"""
WAHA Compatibility Layer — מאפשר ל-main.py לעבוד עם WAHA במקום Green API.
כאשר WAHA_URL מוגדר, כל קריאות ה-API מופנות ל-WAHA במקום ל-Green API.
"""
import os
import requests
import json

WAHA_URL = os.environ.get('WAHA_URL', '').rstrip('/')
WAHA_API_KEY = os.environ.get('WAHA_API_KEY', 'waha-secret-key-2026')
WAHA_SESSION = os.environ.get('WAHA_SESSION', 'default')

def use_waha():
    return bool(WAHA_URL)

def _headers():
    return {'Content-Type': 'application/json', 'X-Api-Key': WAHA_API_KEY}

def _headers_multipart():
    return {'X-Api-Key': WAHA_API_KEY}

# ── SEND TEXT MESSAGE ──────────────────────────────────────────────────────
def send_message(chat_id, message, timeout=30):
    """Send a text message. Returns dict with idMessage on success."""
    if use_waha():
        url = f'{WAHA_URL}/api/sendText'
        payload = {'chatId': chat_id, 'text': message, 'session': WAHA_SESSION}
        r = requests.post(url, json=payload, headers=_headers(), timeout=timeout)
        if r.status_code == 200:
            data = r.json()
            return {'idMessage': data.get('id', data.get('messageId', 'ok'))}
        return {}
    else:
        # Green API fallback
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}'
        r = requests.post(url, json={'chatId': chat_id, 'message': message}, timeout=timeout)
        return r.json() if r.status_code == 200 else {}

# ── SEND FILE (audio/image/doc) ─────────────────────────────────────────────
def send_file_by_upload(chat_id, file_content, filename, caption='', mime_type='audio/wav', timeout=30):
    """Send a file. Returns dict with idMessage on success."""
    if use_waha():
        url = f'{WAHA_URL}/api/sendFile'
        # WAHA expects base64 for file content
        from base64 import b64encode
        file_b64 = b64encode(file_content).decode()
        payload = {
            'chatId': chat_id,
            'file': f'data:{mime_type};base64,{file_b64}',
            'filename': filename,
            'caption': caption,
            'session': WAHA_SESSION
        }
        r = requests.post(url, json=payload, headers=_headers(), timeout=timeout)
        if r.status_code == 200:
            data = r.json()
            return {'idMessage': data.get('id', data.get('messageId', 'ok'))}
        return {}
    else:
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendFileByUpload/{GREEN_API_TOKEN}'
        r = requests.post(url, 
            data={'chatId': chat_id, 'caption': caption},
            files={'file': (filename, file_content, mime_type)}, timeout=timeout)
        return r.json() if r.status_code == 200 else {}

# ── RECEIVE NOTIFICATIONS (polling) ─────────────────────────────────────────
def receive_notification(timeout=15):
    """Get one pending notification. Returns (receipt_id, body) or (None, None)."""
    if use_waha():
        # WAHA uses webhooks, but we can also poll /api/messages for new ones
        # For compatibility, we'll return None (webhooks handle this)
        return None, None
    else:
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/receiveNotification/{GREEN_API_TOKEN}'
        r = requests.get(url, timeout=timeout)
        d = r.json()
        if d.get('receiptId'):
            return d['receiptId'], d.get('body', {})
        return None, None

def delete_notification(receipt_id, timeout=10):
    """Delete a processed notification."""
    if use_waha():
        return True  # No-op for WAHA (webhooks don't need deletion)
    else:
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/deleteNotification/{GREEN_API_TOKEN}/{receipt_id}'
        requests.get(url, timeout=timeout)
        return True

# ── HISTORY MESSAGES ────────────────────────────────────────────────────────
def get_last_messages(direction='incoming', count=100, timeout=30):
    """Get last incoming or outgoing messages.
    Returns list of normalized message dicts compatible with main.py format."""
    if use_waha():
        # WAHA: GET /api/messages?chatId=...&session=...&limit=...
        # Since we want ALL chats, we'll use /api/chats first then get messages per chat
        # For simplicity, we'll get all chats and their recent messages
        url = f'{WAHA_URL}/api/chats?session={WAHA_SESSION}'
        r = requests.get(url, headers=_headers(), timeout=timeout)
        if r.status_code != 200:
            return []
        chats = r.json()
        all_msgs = []
        for chat in chats:
            chat_id = chat.get('id', '')
            if not chat_id:
                continue
            msg_url = f'{WAHA_URL}/api/messages?session={WAHA_SESSION}&chatId={chat_id}&limit=50&downloadMedia=false'
            mr = requests.get(msg_url, headers=_headers(), timeout=timeout)
            if mr.status_code == 200:
                msgs = mr.json()
                for m in msgs:
                    # Normalize to Green API format
                    normalized = _normalize_waha_message(m, direction)
                    if normalized:
                        all_msgs.append(normalized)
        return all_msgs
    else:
        # Green API fallback
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        endpoint = 'lastIncomingMessages' if direction == 'incoming' else 'lastOutgoingMessages'
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/{endpoint}/{GREEN_API_TOKEN}'
        r = requests.get(url, params={'count': count}, timeout=timeout)
        return r.json() if r.status_code == 200 else []

def _normalize_waha_message(m, direction):
    """Convert WAHA message format to Green API-compatible format."""
    from_ = m.get('from', '')
    to_ = m.get('to', '')
    is_outgoing = direction == 'outgoing' or m.get('fromMe', False)
    
    msg = {
        'idMessage': m.get('id', ''),
        'timestamp': m.get('timestamp', 0),
        'typeMessage': 'textMessage',
        'chatId': to_ if is_outgoing else from_,
        'senderId': from_,
        'isOutgoing': is_outgoing,
    }
    
    # Text message
    body = m.get('body', '')
    if body:
        msg['textMessage'] = body
        msg['typeMessage'] = 'textMessage'
    
    # Check for edited
    if m.get('edited'):
        msg['editedMessageData'] = {'textMessage': body}
    
    # Media
    if m.get('hasMedia') or m.get('hasAttachment'):
        mime = m.get('mimeType', '')
        if 'audio' in mime:
            msg['typeMessage'] = 'audioMessage'
            msg['fileMessageData'] = {'downloadUrl': '', 'mimeType': mime}
        elif 'video' in mime:
            msg['typeMessage'] = 'videoMessage'
            msg['fileMessageData'] = {'downloadUrl': '', 'mimeType': mime}
        else:
            msg['typeMessage'] = 'imageMessage'
            msg['fileMessageData'] = {'downloadUrl': '', 'mimeType': mime}
    
    return msg

# ── DOWNLOAD MEDIA ─────────────────────────────────────────────────────────
def download_media(message_id, chat_id='', timeout=30):
    """Download media for a message. Returns bytes."""
    if use_waha():
        url = f'{WAHA_URL}/api/downloadFile'
        payload = {'messageId': message_id, 'session': WAHA_SESSION}
        r = requests.post(url, json=payload, headers=_headers(), timeout=timeout)
        if r.status_code == 200:
            data = r.json()
            # WAHA returns base64 or URL
            if data.get('base64'):
                from base64 import b64decode
                return b64decode(data['base64'])
            elif data.get('url'):
                mr = requests.get(data['url'], timeout=timeout)
                return mr.content if mr.status_code == 200 else b''
        return b''
    else:
        # Green API uses downloadUrl directly
        return None  # main.py handles this via downloadUrl

# ── CONTACT INFO ───────────────────────────────────────────────────────────
def get_contact_info(phone, timeout=15):
    """Get contact name for a phone number."""
    if use_waha():
        chat_id = f'{phone}@c.us' if '@' not in phone else phone
        url = f'{WAHA_URL}/api/checkChat?session={WAHA_SESSION}&chatId={chat_id}'
        r = requests.get(url, headers=_headers(), timeout=timeout)
        if r.status_code == 200:
            data = r.json()
            return {'name': data.get('name', '') or data.get('pushname', '')}
        return {}
    else:
        from main import GREEN_API_INSTANCE_ID, GREEN_API_TOKEN
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/getContactInfo/{GREEN_API_TOKEN}'
        r = requests.get(url, params={'chatId': f'{phone}@c.us'}, timeout=timeout)
        return r.json() if r.status_code == 200 else {}

