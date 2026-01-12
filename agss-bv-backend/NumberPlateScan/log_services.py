import requests

def create_vehicle_log(
    plate,
    vehicle_type,
    category,
    status,
    confidence
):
    payload = {
        "vehicleNo": plate,
        "vehicleType": vehicle_type,
        "category": category,
        "movementType": "ENTRY",
        "decision": status,
        "confidence": confidence,
        "source": {
            "type": "ANPR",
            "cameraId": "CAMERA_1"
        }
    }

    try:
        requests.post(
            "http://localhost:5000/api/vehicle-logs",
            json=payload,
            timeout=1
        )
    except Exception as e:
        print("⚠️ Log service error:", e)
