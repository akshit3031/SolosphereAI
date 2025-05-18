import json
import time
import uuid
from checks import *

def get_machine_id():
    return str(uuid.getnode())

def run_checks():
    return {
        "machine_id": get_machine_id(),
        "os": get_os(),
        "disk_encryption": check_disk_encryption(),
        "os_update": check_os_update(),
        "antivirus": check_antivirus(),
        "sleep_ok": check_sleep_setting(),
    }

def load_last_state():
    try:
        with open("state.json", "r") as f:
            return json.load(f)
    except:
        return {}

def save_state(state):
    with open("state.json", "w") as f:
        json.dump(state, f)

def state_changed(old, new):
    return json.dumps(old, sort_keys=True) != json.dumps(new, sort_keys=True)
