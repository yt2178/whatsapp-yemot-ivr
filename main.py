import requests
import os

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')

# רק מהקבוצה הזו!
ALLOWED_GROUP_ID = '120363425000018019@g.us'

def get_messages():
    messages = []
    for _ in range(20):
        r = requests.get(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/receiveNotification/{GREEN_API_TOKEN}',
            timeout=15
        )
        d = r.json()
        if not d:
            break
        rid = d.get('receiptId')
        body = d.get('body', {})
        
        if body.get('typeWebhook') != 'incomingMessageReceived':
            requests.delete(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
                timeout=10
            )
            continue

        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')
        
        # סינון — רק מהקבוצה המאושרת
        if chat_id != ALLOWED_GROUP_ID:
            print(f'מדלג על הודעה מ-{chat_id} (לא הקבוצה)')
            requests.delete(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
                timeout=10
            )
            continue

        msg_data = body.get('messageData', {})
        text = (msg_data.get('textMessageData') or {}).get('textMessage', '') or \
               (msg_data.get('extendedTextMessageData') or {}).get('text', '')
        sender_name = sender_data.get('senderName', '')

        if text.strip():
            messages.append({'text': text, 'sender': sender_name, 'receiptId': rid})
        else:
            requests.delete(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
                timeout=10
            )
    return messages

def upload_to_yemot(text, sender, token):
    tts_text = f'{sender}: {text}' if sender else text
    r = requests.post(
        'https://www.call2all.co.il/ym/api/UploadFile',
        params={'token': token, 'path': YEMOT_EXTENSION, 'tts': '1', 'autoNumbering': '1'},
        files={'file': ('msg.txt', tts_text.encode('utf-8'), 'text/plain')},
        timeout=20
    )
    return r.json()

def main():
    print('שולף הודעות מ-Green API...')
    messages = get_messages()
    
    if not messages:
        print('אין הודעות חדשות מהקבוצה')
        return
    
    print(f'נמצאו {len(messages)} הודעות מהקבוצה')
    
    r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
        'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
    }, timeout=10)
    token = r.json().get('token')
    print('מחובר לימות המשיח')
    
    for msg in messages:
        result = upload_to_yemot(msg['text'], msg['sender'], token)
        print(f'הועלה: {msg["text"][:40]} → {result.get("path", "שגיאה")}')
        requests.delete(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{msg["receiptId"]}',
            timeout=10
        )
    
    requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=5)
    print('סיום ✅')

if __name__ == '__main__':
    main()
