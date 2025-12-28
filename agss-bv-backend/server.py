from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
from pymongo import MongoClient
import uuid
from datetime import datetime
from scipy.fftpack import fft, ifft
# downloaded beacuse this allows code to go to frontend 
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)
# ================== CONFIGURATION ==================
client = MongoClient("mongodb://localhost:27017/")
db = client["AGSS_BV"]
students = db["students"]
counters = db["counters"]   # 🔹 ADDED (for auto studentId)

UPLOAD_FOLDER = r"E:\BV Gate Security\AGSS-BV\uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Accuracy Constants (UNCHANGED)
RADIAL_RES = 64
ANGULAR_RES = 256
HAMMING_THRESHOLD = 0.32
ROTATION_SHIFTS = 10
ENROLL_SAMPLES = 3
GLARE_THRESHOLD = 245
SHADOW_THRESHOLD = 30

# =========================================================
# 🔹 STUDENT ID GENERATOR (BTBTC23xxx)
# =========================================================
def generate_student_id():
    counter = counters.find_one_and_update(
        {"key": "studentId"},
        {"$inc": {"count": 1}},
        upsert=True,
        return_document=True
    )

    num = str(counter["count"]).zfill(3)
    return f"BTBTC23{num}"

# =========================================================
# 1️⃣ IMAGE PREPROCESSING & QUALITY
# =========================================================
def enhance_iris(img):
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    return clahe.apply(img)

def check_quality(img):
    lap = cv2.Laplacian(img, cv2.CV_64F).var()
    if lap < 800:
        return False, "Image too blurry"
    return True, "Good quality"

# =========================================================
# 2️⃣ ROBUST SEGMENTATION
# =========================================================
def segment_iris(img):
    blurred = cv2.medianBlur(img, 11)

    circles = cv2.HoughCircles(
        blurred, cv2.HOUGH_GRADIENT, dp=1, minDist=50,
        param1=100, param2=30, minRadius=25, maxRadius=160
    )

    if circles is None:
        raise Exception("Iris not found. Ensure eye is centered and open.")

    circles = np.uint16(np.around(circles[0]))
    circles = sorted(circles, key=lambda x: x[2])

    pupil = circles[0]
    iris = circles[-1] if len(circles) > 1 else [pupil[0], pupil[1], int(pupil[2] * 2.8)]

    return pupil, iris

# =========================================================
# 3️⃣ NORMALIZATION WITH DYNAMIC MASKING
# =========================================================
def normalize_and_mask(img, pupil, iris):
    px, py, pr = pupil
    ix, iy, ir = iris

    norm = np.zeros((RADIAL_RES, ANGULAR_RES), dtype=np.float32)
    mask = np.ones((RADIAL_RES, ANGULAR_RES), dtype=np.uint8)

    for t in range(ANGULAR_RES):
        theta = 2 * np.pi * t / ANGULAR_RES
        xp, yp = px + pr * np.cos(theta), py + pr * np.sin(theta)
        xi, yi = ix + ir * np.cos(theta), iy + ir * np.sin(theta)

        for r in range(RADIAL_RES):
            r_norm = r / (RADIAL_RES - 1)
            x = int((1 - r_norm) * xp + r_norm * xi)
            y = int((1 - r_norm) * yp + r_norm * yi)

            if 0 <= x < img.shape[1] and 0 <= y < img.shape[0]:
                val = img[y, x]
                norm[r, t] = val
                if val > GLARE_THRESHOLD or val < SHADOW_THRESHOLD:
                    mask[r, t] = 0
            else:
                mask[r, t] = 0

    return norm, mask

# =========================================================
# 4️⃣ PHASE ENCODING & MATCHING
# =========================================================
def log_gabor_encode(norm, mask):
    rows, cols = norm.shape
    f = fft(norm, axis=1)

    freqs = np.fft.fftfreq(cols)
    radius = np.abs(freqs)
    radius[radius == 0] = 1e-6

    log_gabor = np.exp(-(np.log(radius / 0.25) ** 2) / (2 * np.log(0.5) ** 2))

    code = np.zeros((rows, cols), dtype=np.uint8)
    for r in range(rows):
        filtered = ifft(f[r] * log_gabor)
        code[r] = np.real(filtered) > 0

    return code.flatten(), mask.flatten()

def masked_rotated_hamming(c1, c2, m1, m2):
    c1 = c1.reshape(RADIAL_RES, ANGULAR_RES)
    c2 = c2.reshape(RADIAL_RES, ANGULAR_RES)
    m1 = m1.reshape(RADIAL_RES, ANGULAR_RES)
    m2 = m2.reshape(RADIAL_RES, ANGULAR_RES)

    min_hd = 1.0
    for shift in range(-ROTATION_SHIFTS, ROTATION_SHIFTS + 1):
        c2s = np.roll(c2, shift, axis=1)
        m2s = np.roll(m2, shift, axis=1)

        combined_mask = m1 & m2s
        if np.sum(combined_mask) < 100:
            continue

        diff = np.logical_xor(c1, c2s) & combined_mask
        hd = np.sum(diff) / np.sum(combined_mask)
        min_hd = min(min_hd, hd)

    return float(min_hd)

# =========================================================
# 5️⃣ FULL PIPELINE
# =========================================================
def process_full_pipeline(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise Exception("Invalid image")

    ok, msg = check_quality(img)
    if not ok:
        raise Exception(msg)

    img = enhance_iris(img)
    pupil, iris = segment_iris(img)
    norm, mask = normalize_and_mask(img, pupil, iris)
    return log_gabor_encode(norm, mask)

# =========================================================
# 📸 REGISTER / CAPTURE (UPDATED)
# =========================================================
@app.route("/capture", methods=["POST"])
def register():
    try:
        file = request.files["image"]
        path = os.path.join(UPLOAD_FOLDER, f"reg_{uuid.uuid4()}.jpg")
        file.save(path)

        code, mask = process_full_pipeline(path)

        student_id = generate_student_id()   # 🔹 BTBTC23xxx

        students.insert_one({
            "student_id": student_id,

            # ---- STUDENT INFO (Node compatible) ----
            "firstName": request.form.get("firstName"),
            "lastName": request.form.get("lastName"),
            "personalEmail": request.form.get("personalEmail"),
            "collegeEmail": request.form.get("collegeEmail"),
            "fatherName": request.form.get("fatherName"),
            "motherName": request.form.get("motherName"),
            "fatherEmail": request.form.get("fatherEmail"),
            "motherEmail": request.form.get("motherEmail"),
            "studentPhone": request.form.get("studentPhone"),
            "fatherPhone": request.form.get("fatherPhone"),
            "motherPhone": request.form.get("motherPhone"),
            "rollNo": request.form.get("rollNo"),
            "course": request.form.get("course"),

            "address": {
                "houseNo": request.form.get("houseNo"),
                "street": request.form.get("street"),
                "pincode": request.form.get("pincode"),
                "city": request.form.get("city"),
                "state": request.form.get("state"),
                "country": request.form.get("country")
            },

            "currentStatus": "inside",

            # ---- IRIS DATA (UNCHANGED) ----
            "iris_code": code.tolist(),
            "mask": mask.tolist(),

            "timestamp": datetime.utcnow()
        })

        return jsonify({
            "status": "Success",
            "student_id": student_id
        })

    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)}), 400

# =========================================================
# ✅ VERIFY (UNCHANGED)
# =========================================================
@app.route("/verify", methods=["POST"])
def verify():
    try:
        student_id = request.form.get("student_id")
        file = request.files["image"]

        user = students.find_one({"student_id": student_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        path = os.path.join(UPLOAD_FOLDER, f"ver_{uuid.uuid4()}.jpg")
        file.save(path)

        live_code, live_mask = process_full_pipeline(path)

        hd = masked_rotated_hamming(
            np.array(user["iris_code"]),
            live_code,
            np.array(user["mask"]),
            live_mask
        )

        return jsonify({
            "match": hd < HAMMING_THRESHOLD,
            "score": round(1 - hd, 4),
            "distance": round(hd, 4)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

# =========================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)