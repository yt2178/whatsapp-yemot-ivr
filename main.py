import requests
import os

GREEN_API_INSTANCE_ID = os.environ['GREEN_API_INSTANCE_ID']
GREEN_API_TOKEN = os.environ['GREEN_API_TOKEN']
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:1')

def get_last_group_message():
    """שולף את כל ההודעות מהתור ומחזיר רק האחרונה מקבוצה כלשהי"""
    all_receipts = []
    last_message = None

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
        all_receipts.append(rid)

        if body.get('typeWebhook') != 'incomingMessageReceived':
            continue

        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')

        # רק קבוצות (מסתיימות ב-@g.us)
        if not chat_id.endswith('@g.us'):
            continue

        msg_data = body.get('messageData', {})
        text = (msg_data.get('textMessageData') or {}).get('textMessage', '') or \
               (msg_data.get('extendedTextMessageData') or {}).get('text', '')
        sender_name = sender_data.get('senderName', '')
        group_name = sender_data.get('chatName', '')

        if text.strip():
            # שומרים את האחרונה (כל איטרציה מחליפה)
            last_message = {
                'text': text,
                'sender': sender_name,
                'group': group_name
            }

    return all_receipts, last_message

def upload_to_yemot(text, sender, group, token):
    tts_text = f'{group} - {sender}: {text}' if sender else text
    r = requests.post(
        'https://www.call2all.co.il/ym/api/UploadFile',
        params={'token': token, 'path': YEMOT_EXTENSION, 'tts': '1'},
        files={'file': ('msg.txt', tts_text.encode('utf-8'), 'text/plain')},
        timeout=20
    )
    return r.json()

def delete_all(receipts):
    for rid in receipts:
        requests.delete(
            f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{rid}',
            timeout=10
        )

def main():
    print('שולף הודעות מ-Green API...')
    receipts, last_msg = get_last_group_message()

    print(f'סה"כ הודעות בתור: {len(receipts)}')

    # מוחקים את כל התור
    delete_all(receipts)

    if not last_msg:
        print('אין הודעות חדשות מקבוצות')
        return

    print(f'הודעה אחרונה: [{last_msg["group"]}] {last_msg["sender"]}: {last_msg["text"][:50]}')

    r = requests.get('https://www.call2all.co.il/ym/api/Login', params={
        'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD
    }, timeout=10)
    token = r.json().get('token')

    result = upload_to_yemot(last_msg['text'], last_msg['sender'], last_msg['group'], token)
    print(f'הועלה לימות: {result.get("path", "שגיאה")}')

    requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=5)
    print('סיום ✅')

if __name__ == '__main__':
    main()
