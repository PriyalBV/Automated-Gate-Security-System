from ultralytics import YOLO
import cv2

# Load YOLO model
model = YOLO("models/plate_yolo.pt")

# Open camera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Camera not accessible")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # YOLO detection
    results = model(frame, conf=0.4)

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Draw bounding box
            cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)

            # Crop plate
            plate = frame[y1:y2, x1:x2]

            if plate.size != 0:
                cv2.imshow("Detected Plate", plate)

    cv2.imshow("YOLO Number Plate Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
