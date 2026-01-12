import requests


from NumberPlateScan.plate_access_service import check_plate_access
from NumberPlateScan.anpr_four_wheeler_model import process_four_wheeler
from NumberPlateScan.anpr_two_wheeler_model import process_two_wheeler
from database.mongo import vehicle_logs_collection

LOG_API_URL = "http://localhost:5000/api/vehicle-logs"
import requests
#not being used push_log_to_node
def push_log_to_node(data):
    requests.post(
        "http://localhost:5000/api/anpr-log",
        json=data,
        timeout=2
    )

def scan_plate_image(frame, vehicle_type="four"):
    result = (
        process_two_wheeler(frame)
        if vehicle_type == "two"
        else process_four_wheeler(frame)
    )

    plate = result.get("plate")
    confidence = result.get("confidence", 0)

    if not plate:
        return {
            "plate": None,
            "confidence": confidence,
            "status": "NOT DETECTED",
            "category": "MANUAL",
            "message": "Retry scan or enter manually"
        }
#check the access from db
    access_data = check_plate_access(plate)
# added for logs above all logic for the detecction and extraction page 
    log_payload = {
        "vehicleNo": plate,
        "vehicleType": vehicle_type,
        "category": access_data["category"].lower(),
        "movementType": "ENTRY",
        "decision": access_data["status"],
        "confidence": confidence,
        "source": {
            "type": "ANPR",
            "cameraId": "CAMERA_1"
        }
    }

    # 🔥 Fire-and-forget (never block ANPR)
    try:
        #print("vlog_payload:", log_payload)
        query = {"vehicleNo": plate}
        total_vehicle_count = vehicle_logs_collection.count_documents(query)
        if total_vehicle_count%2!=0:
            log_payload["movementType"]="EXIT"
        
        requests.post(LOG_API_URL, json=log_payload, timeout=1)
        #print("after post")
    except Exception as e:
        #printing exception
        print(e)
        pass
    #print("after try")
    return {
        "plate": plate,
        "confidence": confidence,
        "status": access_data["status"],
        "category": access_data["category"],
        "message": access_data["message"]
    }
