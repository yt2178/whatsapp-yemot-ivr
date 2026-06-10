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

def load_state():
    """טוען את המצב האחרון מ-GitHub"""
    try:
        r = requests.get(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
            timeout=10
        )
        if r.status_code == 200:
            data = r.json()
            content = b64decode(data['content']).decode('utf-8')
            state = json.loads(content)
            state['_sha'] = data['sha']
            return state
    except:
        pass
    return {'uploaded_ids': [], '_sha': None}

def save_state(state):
    """שומר את המצב ל-GitHub"""
    try:
        sha = state.pop('_sha', None)
        content = b64encode(json.dumps(state).encode('utf-8')).decode('utf-8')
        body = {
            'message': 'Update state',
            'content': content
        }
        if sha:
            body['sha'] = sha
        requests.put(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
            json=body,
            timeout=10
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
    except:
        pass

def get_group_messages():
    messages = []
    to_delete = []
    for _ in range(50):
        d = receive_notification()
        if d is None or not d:
            break
        rid = d.get('receiptId')
        body = d.get('body', {})
        if body.get('typeWebhook') != 'incomingMessageReceived':
            to_delete.append(rid)
            continue
        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')
        if not chat_id.endswith('@g.us'):
            to_delete.append(rid)
            continue
        msg_data = body.get('messageData', {})
        text = (msg_data.get('textMessageData') or {}).get('textMessage', '') or \
               (msg_data.get('extendedTextMessageData') or {}).get('text', '')
        sender_name = sender_data.get('senderName', '')
        group_name = sender_data.get('chatName', '')
        msg_id = body.get('idMessage', '') or str(rid)

        if text.strip():
            messages.append({
                'text': text,
                'sender': sender_name,
                'group': group_name,
                'receiptId': rid,
                'id': msg_id
            })
        else:
            to_delete.append(rid)
    return messages, to_delete

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

    print('שולף הודעות מ-Green API...')
    messages, to_delete = get_group_messages()

    for rid in to_delete:
        delete_receipt(rid)
        time.sleep(0.1)

    # מסנן רק הודעות שלא הועלו עדיין
    new_messages = [m for m in messages if m['id'] not in uploaded_ids]

    if not new_messages:
        print('אין הודעות חדשות להעלאה')
        # עדיין מוחקים מהתור
        for msg in messages:
            delete_receipt(msg['receiptId'])
        return

    print(f'נמצאו {len(new_messages)} הודעות חדשות (מתוך {len(messages)} בתור)')

    try:
        r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
            'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
        }, timeout=15)
        token = r.json().get('token')
        print('מחובר לימות המשיח')
    except Exception as e:
        print(f'שגיאה בהתחברות לימות: {e}')
        return

    newly_uploaded = []
    for msg in new_messages:
        result = upload_to_yemot(msg['text'], msg['sender'], token)
        path = result.get('path', '')
        if path:
            print(f'הועלה: [{msg["group"]}] {msg["text"][:40]} → {path}')
            newly_uploaded.append(msg['id'])
        else:
            print(f'שגיאה בהעלאה: {msg["text"][:40]}')
        delete_receipt(msg['receiptId'])
        time.sleep(0.1)

    # שומר IDs שהועלו (שומר רק 500 אחרונים כדי לא לתפוח)
    all_ids = list(uploaded_ids) + newly_uploaded
    state['uploaded_ids'] = all_ids[-500:]
    state['_sha'] = state.get('_sha')
    save_state(state)

    try:
        requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=10)
    except:
        pass

    print(f'סיום ✅ הועלו {len(newly_uploaded)} הודעות חדשות')

if __name__ == '__main__':
    main()
