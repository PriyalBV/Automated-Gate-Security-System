import cv2
import easyocr
import re
from ultralytics import YOLO
from datetime import datetime
from collections import defaultdict, Counter

# ================= TEMPORAL VOTING =================
# Groups similar plates across frames to stabilize OCR
plate_buffer = defaultdict(list)
VOTE_FRAMES = 5

# ================= CONFIG =================
DEBUG = True
COOLDOWN_SECONDS = 5
MIN_OCR_CONF = 0.55

# Indian number plate format
# PLATE_REGEX = r'^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{3,4}$' ---> for old vehicles with 3 digit numbers
PLATE_REGEX = r'^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'

# ================= HELPER FUNCTIONS =================
def log_plate(plate_text, now):
    """Log detected plate with timestamp"""
    print(f"🚗 PLATE DETECTED | {plate_text} | {now.strftime('%Y-%m-%d %H:%M:%S')}")

def clean_text(text):
    """Remove symbols & spaces"""
    return re.sub(r'[^A-Z0-9]', '', text.upper())

def smart_correct_plate(text):
    """
    Structure-aware correction:
    AA | 1–2 digits | 1–2 letters | 4 digits
    """
    text = text.upper()
    text = re.sub(r'[^A-Z0-9]', '', text)

    # Match flexible Indian plate
    m = re.fullmatch(r'([A-Z]{2})(\d{1,2})([A-Z]{1,2})(\d{4})', text)
    if not m:
        return text  # don't force incorrect fixes

    state, district, series, number = m.groups()

    # ---- Corrections ----
    state = state.replace('0', 'O').replace('1', 'I')

    district = (
        district.replace('O', '0')
                .replace('I', '1')
                .replace('L', '4')
                .replace('Z', '2')
    )

    series = series.replace('0', 'O').replace('1', 'I')

    number = (
        number.replace('O', '0')
              .replace('I', '1')
              .replace('L', '4')
              .replace('F', '4')
              .replace('S', '5')
              .replace('B', '8')
              .replace('G', '6')
    )

    return f"{state}{district}{series}{number}"

def normalize_plate_key(plate):
    """
    Normalize plate for temporal voting
    Allows similar OCR variants to vote together
    """
    return re.sub(r'[A-Z]', 'A', plate)

# ================= INITIALIZATION =================
print("🔄 Loading EasyOCR...")
reader = easyocr.Reader(
    ['en'],
    gpu=False,
    recog_network='english_g2'  # Best for uppercase plates
)

print("🔄 Loading YOLOv8 model...")
model = YOLO("runs/detect/train/weights/best.pt")

last_seen = {}

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Camera not opened")
    exit()

# Create CLAHE once (performance optimization)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

# ================= MAIN LOOP =================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # YOLO inference (CPU-safe & fast)
    results = model(
        frame,
        conf=0.4,
        imgsz=640,
        device="cpu",
        verbose=False
    )

    debug_plate = debug_gray = None

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Clamp bounding box (safety)
            h_img, w_img = frame.shape[:2]
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w_img, x2), min(h_img, y2)

            w, h = x2 - x1, y2 - y1
            if w < 60 or h < 40:
                continue

            plate = frame[y1:y2, x1:x2]

            # ---------- PREPROCESSING ----------
            gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)
            gray = clahe.apply(gray)

            # Resize only if needed (speed)
            if gray.shape[1] < 300:
                gray = cv2.resize(
                    gray, None,
                    fx=2, fy=2,
                    interpolation=cv2.INTER_CUBIC
                )

            # Otsu threshold
            _, gray = cv2.threshold(
                gray, 0, 255,
                cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )

            debug_plate = plate
            debug_gray = gray

            # ---------- OCR ----------
            ocr_results = reader.readtext(
                gray,
                detail=1,
                paragraph=False,
                allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            )

            if not ocr_results:
                continue

            merged_text = ""
            conf_sum = 0
            valid_count = 0

            for bbox, text, conf in ocr_results:
                if conf < MIN_OCR_CONF:
                    continue
                merged_text += text + " "
                conf_sum += conf
                valid_count += 1

            if valid_count == 0:
                continue

            merged_text = merged_text.strip()
            avg_conf = max(conf_sum / valid_count, 0.01)

            raw_text = clean_text(merged_text)
            plate_text = smart_correct_plate(raw_text)

            # Fix DL → PL confusion
            if plate_text.startswith("PL") and avg_conf < 0.8:
                plate_text = "DL" + plate_text[2:]


            if DEBUG:
                print(f"OCR RAW: {merged_text} ({avg_conf:.2f}) → {plate_text}")

            # ---------- VALIDATION ----------
            if not (8 <= len(plate_text) <= 10):
                continue

            if not re.fullmatch(PLATE_REGEX, plate_text):
                if DEBUG:
                    print("❌ INVALID FORMAT")
                continue

            # ---------- TEMPORAL VOTING ----------
            buffer_key = normalize_plate_key(plate_text)
            plate_buffer[buffer_key].append(plate_text)

            if len(plate_buffer[buffer_key]) >= VOTE_FRAMES:
                final_plate = "".join(
                    Counter(chars).most_common(1)[0][0]
                    for chars in zip(*plate_buffer[buffer_key])
                )

                now = datetime.now()

                if (
                    final_plate not in last_seen or
                    (now - last_seen[final_plate]).seconds > COOLDOWN_SECONDS
                ):
                    last_seen[final_plate] = now
                    log_plate(final_plate, now)

                plate_buffer[buffer_key].clear()

            # ---------- DRAW ----------
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                plate_text,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 255, 0),
                2
            )

    # ---------- DEBUG WINDOWS ----------
    if DEBUG and debug_plate is not None:
        cv2.imshow("DEBUG_PLATE", debug_plate)
        cv2.imshow("DEBUG_GRAY", debug_gray)

    cv2.imshow("YOLO Plate OCR (FINAL)", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# ================= CLEANUP =================
cap.release()
cv2.destroyAllWindows()
