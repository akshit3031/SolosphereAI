import time
import schedule
import requests
from main import run_checks, load_last_state, save_state, state_changed

SERVER_URL = "http://localhost:3000/api/reports"  # Replace with actual endpoint

def job():
    new_state = run_checks()
    last_state = load_last_state()

    if state_changed(last_state, new_state):
        print("System state changed. Sending update...")
        try:
            res = requests.post(SERVER_URL, json=new_state)
            if res.status_code == 201:
                print("Update sent successfully.")
                save_state(new_state)
            else:
                print("Server error:", res.status_code)
        except Exception as e:
            print("Error sending update:", e)
    else:
        print("No change in system state.")

def start_daemon():
    schedule.every(0.2).minutes.do(job)
    job()  # Run once immediately

    while True:
        schedule.run_pending()
        time.sleep(5)

if __name__ == "__main__":
    start_daemon()
