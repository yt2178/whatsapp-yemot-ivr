import requests
import os
import time

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')

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
    except Exception as e:
        print(f'שגיאה במחיקת receipt {rid}: {e}')

def get_group_messages():
    messages = []
    to_delete = []

    for _ in range(50):
        d = receive_notification()
        if d is None:
            break
        if not d:
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

        if text.strip():
            messages.append({
                'text': text,
                'sender': sender_name,
                'group': group_name,
                'receiptId': rid
            })
        else:
            to_delete.append(rid)

    return messages, to_delete

def upload_to_yemot(text, sender, group, token):
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
    print('שולף הודעות מ-Green API...')
    messages, to_delete = get_group_messages()

    # מוחקים לא רלוונטיים
    for rid in to_delete:
        delete_receipt(rid)
        time.sleep(0.1)

    if not messages:
        print('אין הודעות חדשות מקבוצות')
        return

    print(f'נמצאו {len(messages)} הודעות מקבוצות')

    try:
        r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
            'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
        }, timeout=15)
        token = r.json().get('token')
        print('מחובר לימות המשיח')
    except Exception as e:
        print(f'שגיאה בהתחברות לימות: {e}')
        return

    for msg in messages:
        result = upload_to_yemot(msg['text'], msg['sender'], msg['group'], token)
        path = result.get('path', 'שגיאה')
        print(f'הועלה: [{msg["group"]}] {msg["text"][:40]} → {path}')
        delete_receipt(msg['receiptId'])
        time.sleep(0.1)

    try:
        requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=10)
    except:
        pass

    print('סיום ✅')

if __name__ == '__main__':
    main()
