import requests
import os

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')

def get_group_messages():
    """שולף את כל ההודעות מהתור, מחזיר רק אלו מקבוצות לפי סדר זמן"""
    messages = []
    receipts_to_delete = []

    for _ in range(50):
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
            receipts_to_delete.append(rid)
            continue

        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')

        # רק קבוצות
        if not chat_id.endswith('@g.us'):
            receipts_to_delete.append(rid)
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
            receipts_to_delete.append(rid)

    return messages, receipts_to_delete

def delete_receipts(receipt_ids):
    for rid in receipt_ids:
        requests.delete(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
            timeout=10
        )

def upload_to_yemot(text, sender, group, token):
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
    messages, to_delete = get_group_messages()

    # מוחקים הודעות שלא רלוונטיות
    delete_receipts(to_delete)

    if not messages:
        print('אין הודעות חדשות מקבוצות')
        return

    print(f'נמצאו {len(messages)} הודעות מקבוצות')

    r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
        'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
    }, timeout=10)
    token = r.json().get('token')
    print('מחובר לימות המשיח')

    # מעלים את כל ההודעות לפי סדר (autoNumbering מוסיף מספר עולה)
    for msg in messages:
        result = upload_to_yemot(msg['text'], msg['sender'], msg['group'], token)
        print(f'הועלה: [{msg["group"]}] {msg["text"][:40]} → {result.get("path", "שגיאה")}')
        # מוחקים מהתור אחרי העלאה מוצלחת
        delete_receipts([msg['receiptId']])

    requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=5)
    print('סיום ✅')

if __name__ == '__main__':
    main()
