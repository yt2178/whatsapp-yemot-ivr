import requests
import os
import json
import time
from base64 import b64encode, b64decode

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')          # כל ההודעות
YEMOT_EXTENSION_NEW = os.environ.get('YEMOT_EXTENSION_NEW', 'ivr2:2')  # רק חדשות שלא נשמעו
YEMOT_EXTENSION_RECORD = os.environ.get('YEMOT_EXTENSION_RECORD', 'ivr2:3')  # הקלטות לשליחה לוואטסאפ
YEMOT_EXTENSION_RESET = os.environ.get('YEMOT_EXTENSION_RESET', 'ivr2:5')  # חיוג לכאן = איפוס תיקיית חדשות
RESET_KEYWORD = os.environ.get('RESET_KEYWORD', '#נשמע')  # שולחים הודעה זו כדי לאפס את "החדשות"
TZINTUK_LIST = os.environ.get('TZINTUK_LIST', 'yt2178whatsapp')  # שם רשימת הצינתוקים החינמית (ivr2:6 = שלוחת הרשמה)
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
GITHUB_REPO = 'yt2178/whatsapp-yemot-ivr'
STATE_FILE = 'state.json'
HISTORY_MINUTES = int(os.environ.get('HISTORY_MINUTES', '10080'))  # 7 days back-fill
TEXT_TYPES = ('textMessage', 'extendedTextMessage')

def load_state():
    try:
        r = requests.get(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
            timeout=30
        )
        if r.status_code == 200:
            data = r.json()
            content = b64decode(data['content']).decode('utf-8')
            state = json.loads(content)
            state['_sha'] = data['sha']
            return state
    except Exception as e:
        print(f'שגיאה בטעינת state: {e}')
    return {'uploaded_ids': [], 'unheard_ids': [], 'sent_recordings': [], '_sha': None}

def save_state(state):
    try:
        sha = state.pop('_sha', None)
        content = b64encode(json.dumps(state).encode('utf-8')).decode('utf-8')
        body = {'message': 'Update state', 'content': content}
        if sha:
            body['sha'] = sha
        requests.put(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
            json=body,
            timeout=30
        )
    except Exception as e:
        print(f'שגיאה בשמירת state: {e}')

def receive_notification():
    try:
        r = requests.get(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/receiveNotification/{GREEN_API_TOKEN}',
            timeout=30
        )
        return r.json()
    except Exception as e:
        print(f'שגיאה בקבלת הודעה: {e}')
        return None

def delete_receipt(rid):
    try:
        requests.delete(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
            timeout=30
        )
    except Exception:
        pass

def fetch_queue_messages():
    messages = []
    for _ in range(50):
        d = receive_notification()
        if d is None or not d:
            break
        rid = d.get('receiptId')
        body = d.get('body', {})
        webhook_type = body.get('typeWebhook')

        if webhook_type not in ('incomingMessageReceived', 'outgoingMessageReceived'):
            delete_receipt(rid)
            continue

        msg_data = body.get('messageData', {})
        type_msg = msg_data.get('typeMessage', '')
        if type_msg not in TEXT_TYPES:
            delete_receipt(rid)
            continue

        text = (msg_data.get('textMessageData') or {}).get('textMessage', '') or \
               (msg_data.get('extendedTextMessageData') or {}).get('text', '')
        if not text.strip():
            delete_receipt(rid)
            continue

        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')
        chat_name = sender_data.get('chatName', '') or chat_id
        is_outgoing = webhook_type == 'outgoingMessageReceived'
        sender_name = 'אני' if is_outgoing else sender_data.get('senderName', '')
        msg_id = body.get('idMessage', '') or str(rid)
        timestamp = body.get('timestamp', 0)

        messages.append({
            'id': msg_id, 'text': text, 'sender': sender_name,
            'group': chat_name, 'timestamp': timestamp, 'receiptId': rid,
            'is_outgoing': is_outgoing
        })
        delete_receipt(rid)
        time.sleep(0.1)
    return messages

def fetch_history_messages(minutes=HISTORY_MINUTES):
    messages = []
    try:
        r = requests.get(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/lastIncomingMessages/{GREEN_API_TOKEN}',
            params={'minutes': minutes}, timeout=30
        )
        for m in r.json():
            if m.get('typeMessage', '') not in TEXT_TYPES:
                continue
            text = m.get('textMessage') or (m.get('extendedTextMessageData') or {}).get('text', '')
            if not text.strip():
                continue
            messages.append({
                'id': m.get('idMessage', ''), 'text': text,
                'sender': m.get('senderName', ''), 'group': m.get('chatId', ''),
                'timestamp': m.get('timestamp', 0), 'is_outgoing': False
            })
    except Exception as e:
        print(f'שגיאה בשליפת היסטוריה נכנסת: {e}')

    try:
        r2 = requests.get(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/lastOutgoingMessages/{GREEN_API_TOKEN}',
            params={'minutes': minutes}, timeout=30
        )
        for m in r2.json():
            if m.get('typeMessage', '') not in TEXT_TYPES:
                continue
            text = m.get('textMessage') or (m.get('extendedTextMessageData') or {}).get('text', '')
            if not text.strip():
                continue
            messages.append({
                'id': m.get('idMessage', ''), 'text': text,
                'sender': 'אני', 'group': m.get('chatId', ''),
                'timestamp': m.get('timestamp', 0), 'is_outgoing': True
            })
    except Exception as e:
        print(f'שגיאה בשליפת היסטוריה יוצאת: {e}')

    return messages

def upload_to_yemot(text, sender, token, path):
    try:
        tts_text = f'{sender}: {text}' if sender else text
        r = requests.post(
            'https://www.call2all.co.il/ym/api/UploadFile',
            params={'token': token, 'path': path, 'tts': '1', 'autoNumbering': '1'},
            files={'file': ('msg.txt', tts_text.encode('utf-8'), 'text/plain')},
            timeout=30
        )
        return r.json()
    except Exception as e:
        print(f'שגיאה בהעלאה לימות ({path}): {e}')
        return {}

def clear_new_folder(token):
    """מוחק את כל תיקיית ה'חדשות' - נקרא כשהמשתמש מסמן שכבר שמע, ומשחזר את הגדרות השלוחה"""
    try:
        r = requests.get(
            'https://www.call2all.co.il/ym/api/FileAction',
            params={'token': token, 'path': YEMOT_EXTENSION_NEW, 'action': 'delete'},
            timeout=30
        )
        print(f'איפוס תיקיית חדשות: {r.text[:200]}')
        # מחיקת התיקייה מוחקת גם את ה-ext.ini שלה - משחזרים את ההגדרות
        requests.get('https://www.call2all.co.il/ym/api/UpdateExtension', params={
            'token': token, 'path': YEMOT_EXTENSION_NEW, 'type': 'playfile', 'title': 'הודעות חדשות',
        }, timeout=30)
    except Exception as e:
        print(f'שגיאה באיפוס תיקיית חדשות: {e}')

def check_phone_reset(token):
    """בודק אם מישהו חייג לשלוחת האיפוס הטלפונית (ivr2:5) - אם כן, מאפס את תיקיית החדשות ומנקה את שלוחת האיפוס"""
    try:
        r = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                          params={'token': token, 'path': YEMOT_EXTENSION_RESET}, timeout=30)
        files = r.json().get('files', [])
    except Exception as e:
        print(f'שגיאה בבדיקת שלוחת איפוס טלפוני: {e}')
        return False

    if not files:
        return False

    print(f'זוהה איפוס דרך הקו ({len(files)} קבצי טריגר) - מנקה תיקיית חדשות')
    clear_new_folder(token)
    try:
        requests.get('https://www.call2all.co.il/ym/api/FileAction',
                     params={'token': token, 'path': YEMOT_EXTENSION_RESET, 'action': 'delete'}, timeout=30)
        # משחזרים את הגדרות השלוחה כי מחיקת התיקייה מוחקת גם את ה-ext.ini שלה
        requests.get('https://www.call2all.co.il/ym/api/UpdateExtension', params={
            'token': token, 'path': YEMOT_EXTENSION_RESET, 'type': 'record', 'title': 'איפוס הודעות חדשות',
            'record_ok': '#', 'say_record_number': 'no', 'option_record': '-1-',
        }, timeout=30)
    except Exception as e:
        print(f'שגיאה בניקוי שלוחת איפוס טלפוני: {e}')
    return True

def normalize_phone(raw_digits):
    """הופך מספר שהוקלד (למשל 0501234567) לפורמט בינלאומי לוואטסאפ (972501234567)"""
    digits = ''.join(c for c in raw_digits if c.isdigit())
    if digits.startswith('0'):
        digits = '972' + digits[1:]
    elif not digits.startswith('972'):
        digits = '972' + digits
    return digits

def trigger_tzintuk(token, list_name):
    """מפעיל צינתוק חינמי (ללא עלות יחידות) לכל מי שרשום ברשימת הצינתוקים - התראה על הודעה פרטית חדשה"""
    if not list_name:
        return
    try:
        r = requests.get('https://www.call2all.co.il/ym/api/RunTzintuk', params={
            'token': token, 'phones': f'tzl:{list_name}', 'TzintukTimeOut': '15'
        }, timeout=30)
        print(f'צינתוק חינמי נשלח לרשימה {list_name}: {r.text[:200]}')
    except Exception as e:
        print(f'שגיאה בשליחת צינתוק: {e}')

def check_and_send_recordings(token, sent_recordings):
    """בודק אם יש הקלטות חדשות בשלוחת ההקלטה, ושולח אותן לוואטסאפ לפי המספר שהוקלד כשם הקובץ"""
    try:
        r = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                          params={'token': token, 'path': YEMOT_EXTENSION_RECORD}, timeout=30)
        data = r.json()
        files = data.get('files', [])
    except Exception as e:
        print(f'שגיאה בבדיקת שלוחת הקלטות: {e}')
        return sent_recordings

    for f in files:
        uid = f.get('uniqueId', '')
        name = f.get('name', '')
        if not uid or uid in sent_recordings:
            continue

        phone_raw = name.split('.')[0]
        if not phone_raw.isdigit() or len(phone_raw) < 8:
            print(f'שם קובץ לא נראה כמו מספר טלפון, מדלג: {name}')
            sent_recordings.add(uid)
            continue

        chat_id = normalize_phone(phone_raw) + '@c.us'
        file_path = f'{YEMOT_EXTENSION_RECORD}/{name}'

        try:
            dl = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                               params={'token': token, 'path': file_path}, timeout=30)
            if dl.status_code != 200 or not dl.content:
                print(f'שגיאה בהורדת הקלטה {name}')
                continue

            files_payload = {'file': (name, dl.content, 'audio/wav')}
            data_payload = {'chatId': chat_id, 'caption': 'הודעה קולית חדשה מהקו'}
            sr = requests.post(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendFileByUpload/{GREEN_API_TOKEN}',
                data=data_payload, files=files_payload, timeout=30
            )
            if sr.status_code == 200 and sr.json().get('idMessage'):
                print(f'הקלטה נשלחה בהצלחה ל-{chat_id}: {name}')
                sent_recordings.add(uid)
                # מוחקים את הקובץ מהשלוחה כדי לפנות את השם למקרה הבא ולמנוע שליחה כפולה
                requests.get('https://www.call2all.co.il/ym/api/FileAction',
                             params={'token': token, 'path': file_path, 'action': 'delete'}, timeout=30)
            else:
                print(f'שגיאה בשליחת הקלטה ל-{chat_id}: {sr.text[:200]}')
        except Exception as e:
            print(f'שגיאה בטיפול בהקלטה {name}: {e}')

    return sent_recordings

def main():
    print('טוען מצב קודם...')
    state = load_state()
    uploaded_ids = set(state.get('uploaded_ids', []))
    unheard_ids = set(state.get('unheard_ids', []))
    sent_recordings = set(state.get('sent_recordings', []))
    print(f'כבר הועלו: {len(uploaded_ids)} הודעות, ממתינות כ"חדש": {len(unheard_ids)}')

    print('שולף הודעות מהתור בזמן אמת...')
    try:
        queue_msgs = fetch_queue_messages()
    except Exception as e:
        print(f'שגיאה בשליפת תור: {e}')
        queue_msgs = []

    print(f'שולף היסטוריה (עד {HISTORY_MINUTES} דקות אחורה)...')
    try:
        history_msgs = fetch_history_messages()
    except Exception as e:
        print(f'שגיאה בשליפת היסטוריה: {e}')
        history_msgs = []

    all_msgs = {}
    for m in history_msgs + queue_msgs:
        if m.get('id'):
            all_msgs[m['id']] = m

    new_messages = [m for m in all_msgs.values() if m['id'] not in uploaded_ids]
    new_messages.sort(key=lambda m: m.get('timestamp', 0))  # מהישן לחדש

    # מזהים פקודת איפוס (הודעה עצמית עם המילה המדויקת) - לא מעלים אותה כתוכן
    reset_requested = False
    content_messages = []
    for m in new_messages:
        if m.get('is_outgoing') and m['text'].strip() == RESET_KEYWORD:
            reset_requested = True
            uploaded_ids.add(m['id'])
        else:
            content_messages.append(m)

    try:
        r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
            'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
        }, timeout=30)
        token = r.json().get('token')
        print('מחובר לימות המשיח')
    except Exception as e:
        print(f'שגיאה בהתחברות לימות: {e}')
        return

    if reset_requested:
        print(f'זוהתה פקודת איפוס ("{RESET_KEYWORD}") - מנקה תיקיית חדשות')
        clear_new_folder(token)
        unheard_ids = set()

    if content_messages:
        print(f'נמצאו {len(content_messages)} הודעות חדשות')
        newly_uploaded = []
        for msg in content_messages:
            try:
                result = upload_to_yemot(msg['text'], msg['sender'], token, YEMOT_EXTENSION)
                path = result.get('path', '')
                if path:
                    print(f'הועלה [הכל]: [{msg["group"]}] {msg["sender"]}: {msg["text"][:40]} → {path}')
                    newly_uploaded.append(msg['id'])
                else:
                    print(f'שגיאה בהעלאה לתיקיית הכל: {msg["text"][:40]}')
                    continue

                result2 = upload_to_yemot(msg['text'], msg['sender'], token, YEMOT_EXTENSION_NEW)
                if result2.get('path'):
                    unheard_ids.add(msg['id'])
            except Exception as e:
                print(f'שגיאה בהעלאת הודעה: {e}')
            time.sleep(0.1)

        uploaded_ids.update(newly_uploaded)

        # בדיקה אם בין ההודעות החדשות יש הודעה פרטית נכנסת (לא מקבוצה, לא מאיתנו) - אם כן, מצנתקים
        has_new_private = any(
            m.get('group', '').endswith('@c.us')
            for m in content_messages if m['id'] in newly_uploaded
        )
        if has_new_private and TZINTUK_LIST:
            print('זוהתה הודעה פרטית חדשה - מפעיל צינתוק חינמי')
            trigger_tzintuk(token, TZINTUK_LIST)
    else:
        print('אין הודעות חדשות להעלאה')

    print('בודק הקלטות חדשות לשליחה לוואטסאפ...')
    try:
        sent_recordings = check_and_send_recordings(token, sent_recordings)
    except Exception as e:
        print(f'שגיאה כללית בבדיקת הקלטות: {e}')

    print('בודק איפוס דרך הקו...')
    try:
        if check_phone_reset(token):
            unheard_ids = set()
    except Exception as e:
        print(f'שגיאה כללית בבדיקת איפוס טלפוני: {e}')

    state['uploaded_ids'] = list(uploaded_ids)[-1000:]
    state['unheard_ids'] = list(unheard_ids)[-1000:]
    state['sent_recordings'] = list(sent_recordings)[-500:]
    save_state(state)

    try:
        requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=30)
    except Exception:
        pass

    print('סיום ✅')

if __name__ == '__main__':
    main()
