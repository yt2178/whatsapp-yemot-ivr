import requests
import json
import sys
import time
import os

sys.stdout.reconfigure(encoding='utf-8')

# Import main functions
import main

username = '0795695500'
password = '12589'

def get_token():
    try:
        r = requests.get('https://www.call2all.co.il/ym/api/Login', params={'username': username, 'password': password}, timeout=15)
        return r.json().get('token')
    except Exception as e:
        print(f"[Worker Login Error] {e}")
        return None

token = get_token()
print(f"Live worker started for Yemot user: {username}")

while True:
    try:
        if not token:
            token = get_token()
            time.sleep(3)
            continue

        r3 = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir', params={'token': token, 'path': 'ivr2:3'}, timeout=10)
        files = r3.json().get('files', [])
        ai_files = [f for f in files if f.get('name', '').endswith(('.wav', '.opus'))]
        
        if ai_files:
            for af in ai_files:
                fname = af.get('name')
                print(f"[Worker] Found new AI recording: {fname}")
                
                # מנקים מיד את שלוחת התשובות (ivr2:3/1) מקבצים ישנים כדי שהמאזין ישמע מוזיקה בלבד עד לתשובה החדשה
                try:
                    r_clean = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir', params={'token': token, 'path': 'ivr2:3/1'}, timeout=10)
                    for old_f in r_clean.json().get('files', []):
                        old_name = old_f.get('name')
                        requests.get('https://www.call2all.co.il/ym/api/FileAction', params={'token': token, 'path': f'ivr2:3/1/{old_name}', 'action': 'delete'}, timeout=10)
                    print("[Worker] Cleaned all old response files from ivr2:3/1")
                except Exception as e:
                    print(f"[Worker Clean Error] {e}")

                dl = requests.get('https://www.call2all.co.il/ym/api/DownloadFile', params={'token': token, 'path': f"ivr2:3/{fname}"}, timeout=15)
                audio_bytes = dl.content if dl.status_code == 200 else b''
                
                state = main.load_state()
                print("[Worker] Transcribing & executing AI command...")
                response_text = main.handle_ai_command(token, audio_bytes, state)
                print(f"[Worker] AI Response: '{response_text}'")
                
                print("[Worker] Uploading response to ivr2:3/1...")
                main.upload_to_yemot(response_text, '', token, 'ivr2:3/1')
                
                # Delete recorded file from ivr2:3 so it is not processed twice
                requests.get('https://www.call2all.co.il/ym/api/FileAction', params={'token': token, 'path': f"ivr2:3/{fname}", 'action': 'delete'}, timeout=10)
                print(f"[Worker] Cleaned {fname} from ivr2:3")
    except Exception as e:
        print(f"[Worker Error] {e}")
        token = get_token()
    
    time.sleep(2)
