import requests
import os
import json
import time
from base64 import b64encode, b64decode

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
GITHUB_REPO = 'yt2178/whatsapp-yemot-ivr'
STATE_FILE = 'state.json'
HISTORY_MINUTES = int(os.environ.get('HISTORY_MINUTES', '10080'))  # 7 days back-fill
TEXT_TYPES = ('textMessage', 'extendedTextMessage')

def load_state():
    """טוען את המצב האחרון מ-GitHub"""
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
    return {'uploaded_ids': [], '_sha': None}

def save_state(state):
    """שומר את המצב ל-GitHub"""
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
    """קורא הודעות בזמן אמת מהתור (קבוצות + פרטי + הודעות שאני שולח)"""
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
            'group': chat_name, 'timestamp': timestamp, 'receiptId': rid
        })
        delete_receipt(rid)
        time.sleep(0.1)
    return messages

def fetch_history_messages(minutes=HISTORY_MINUTES):
    """מגבה היסטוריה - הודעות נכנסות (קבוצות+פרטי) והודעות יוצאות (ששלחתי בעצמי)"""
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
                'timestamp': m.get('timestamp', 0)
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
                'timestamp': m.get('timestamp', 0)
            })
    except Exception as e:
        print(f'שגיאה בשליפת היסטוריה יוצאת: {e}')

    return messages

def upload_to_yemot(text, sender, token):
    try:
        tts_text = f'{sender}: {text}' if sender else text
        r = requests.post(
            'https://www.call2all.co.il/ym/api/UploadFile',
            params={'token': token, 'path': YEMOT_EXTENSION, 'tts': '1', 'autoNumbering': '1'},
            files={'file': ('msg.txt', tts_text.encode('utf-8'), 'text/plain')},
            timeout=30
        )
        return r.json()
    except Exception as e:
        print(f'שגיאה בהעלאה לימות: {e}')
        return {}

def main():
    print('טוען מצב קודם...')
    state = load_state()
    uploaded_ids = set(state.get('uploaded_ids', []))
    print(f'כבר הועלו: {len(uploaded_ids)} הודעות')

    print('שולף הודעות מהתור בזמן אמת...')
    try:
        queue_msgs = fetch_queue_messages()
    except Exception as e:
        print(f'שגיאה בשליפת תור: {e}')
        queue_msgs = []

    print(f'שולף היסטוריה (עד {HISTORY_MINUTES} דקות אחורה, כולל פרטי + קבוצות + הודעות שלי)...')
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
    # ממיינים מהישן לחדש -> ההודעה החדשה ביותר תקבל את המספר הגבוה ביותר בימות (start=max = תושמע ראשונה)
    new_messages.sort(key=lambda m: m.get('timestamp', 0))

    if not new_messages:
        print('אין הודעות חדשות להעלאה')
        return

    print(f'נמצאו {len(new_messages)} הודעות חדשות')

    try:
        r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
            'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
        }, timeout=30)
        token = r.json().get('token')
        print('מחובר לימות המשיח')
    except Exception as e:
        print(f'שגיאה בהתחברות לימות: {e}')
        return

    newly_uploaded = []
    for msg in new_messages:
        try:
            result = upload_to_yemot(msg['text'], msg['sender'], token)
            path = result.get('path', '')
            if path:
                print(f'הועלה: [{msg["group"]}] {msg["sender"]}: {msg["text"][:40]} → {path}')
                newly_uploaded.append(msg['id'])
            else:
                print(f'שגיאה בהעלאה: {msg["text"][:40]}')
        except Exception as e:
            print(f'שגיאה בהעלאת הודעה: {e}')
        time.sleep(0.1)

    all_ids = list(uploaded_ids) + newly_uploaded
    state['uploaded_ids'] = all_ids[-1000:]
    save_state(state)

    try:
        requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=30)
    except Exception:
        pass

    print(f'סיום ✅ הועלו {len(newly_uploaded)} הודעות חדשות')

if __name__ == '__main__':
    main()
