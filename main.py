import requests
import os
import json
import time
import tempfile
import subprocess
from base64 import b64encode, b64decode

GREEN_API_INSTANCE_ID = os.environ.get('GREEN_API_INSTANCE_ID', '')
GREEN_API_TOKEN = os.environ.get('GREEN_API_TOKEN', '')
META_ACCESS_TOKEN = os.environ.get('META_ACCESS_TOKEN', 'EAAPFPWV7ag4BSHWhqltDC7nqSiTZCuHpOltPgYT5Q4B6qtd9cFTwSq2W3VhSZBz1qDCmXE6ul7JdS5UlPMPIwlCQEsBWrgVsW3Nkdu7TBQrDGmlw29YiWCPTth68Cjgrl6s3IfjmZCMukwX9Kyj9Ub9vB7fOL5mKaNN9ZBX2TGcjA4GwGEcffO3ZBjDekzdbDVGykriAydxm6UYEb2t8LHzBKQJqo8EINM81LXIKShlemULYkZBH4W6uQ21gc3CBimP4uZAyo8YInCIfjD18dtGkiAc')
META_PHONE_NUMBER_ID = os.environ.get('META_PHONE_NUMBER_ID', '1281252485060445')
YEMOT_USERNAME = os.environ['YEMOT_USERNAME']
YEMOT_PASSWORD = os.environ['YEMOT_PASSWORD']
YEMOT_EXTENSION = os.environ.get('YEMOT_EXTENSION', 'ivr2:4')          # כל ההיסטוריה (מקש 4)
YEMOT_EXTENSION_NEW = os.environ.get('YEMOT_EXTENSION_NEW', 'ivr2:1')  # הודעות חדשות שלא נשמעו (מקש 1)
YEMOT_EXTENSION_RECORD = os.environ.get('YEMOT_EXTENSION_RECORD', 'ivr2:2:2')  # הקלטות לשליחה לוואטסאפ (מקש 2)
YEMOT_EXTENSION_RESET = os.environ.get('YEMOT_EXTENSION_RESET', 'ivr2:5')  # חיוג לכאן = איפוס תיקיית חדשות (מקש 5)
CONTACTS_FILE = 'contacts.json'  # קיצורי אנשי קשר (קוד קצר -> שם ומספר)
RESET_KEYWORD = os.environ.get('RESET_KEYWORD', '#נשמע')  # שולחים הודעה זו כדי לאפס את "החדשות"
TZINTUK_LIST = os.environ.get('TZINTUK_LIST', 'yt2178whatsapp')  # שם רשימת הצינתוקים החינמית (ivr2:6 = שלוחת הרשמה)
OWN_CHAT_ID = os.environ.get('OWN_CHAT_ID', '972526751178@c.us')  # הצ'אט עם עצמי (הודעות עצמיות) - תמיד נכלל במלואו
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
GITHUB_REPO = 'yt2178/whatsapp-yemot-ivr'
STATE_FILE = 'state.json'
HISTORY_MINUTES = int(os.environ.get('HISTORY_MINUTES', '10080'))  # 7 days back-fill
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')  # חינמי: console.groq.com
TEXT_TYPES = ('textMessage', 'extendedTextMessage')
EDITED_TYPES = ('editedMessage',)  # הודעה נערכה = נחשבת חדשה
MEDIA_TYPES = ('audioMessage', 'videoMessage')  # הודעות קוליות וסרטונים

def format_phone_label(raw):
    """הופך מזהה גולמי (למשל 972501234567@c.us) למספר קריא, לשימוש כשאין שם שמור לשולח"""
    if not raw:
        return 'מספר לא ידוע'
    digits = ''.join(c for c in raw if c.isdigit())
    if not digits:
        return 'מספר לא ידוע'
    if digits.startswith('972'):
        digits = '0' + digits[3:]
    return digits

def get_contact_name(phone_raw, fallback_name=''):
    """מחזיר את השם הכי טוב: אם fallback_name נראה כשם אמיתי (לא מספר) - משתמשים בו.
    אחרת מנסים להביא שם מ-Green API, נכשל → מספר פורמטי"""
    if fallback_name:
        stripped = fallback_name.strip()
        # אם זה לא מספר (לא מתחיל ב-0 ולא ב-972) — כנראה שם אמיתי
        if stripped and not stripped.lstrip('+').isdigit():
            return stripped
    # מנסים Green API
    try:
        p = phone_raw.split('@')[0]
        chat_id = phone_raw if '@' in phone_raw else p + '@c.us'
        url = f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/getContactInfo/{GREEN_API_TOKEN}'
        r = requests.post(url, json={'chatId': chat_id}, timeout=8)
        if r.status_code == 200:
            d = r.json()
            name = d.get('name', '') or d.get('contactName', '') or ''
            if name and not name.lstrip('+').isdigit() and name != p:
                return name
    except Exception:
        pass
    # fallback → מספר קריא
    return fallback_name or format_phone_label(phone_raw)

def load_contacts():
    """טוען את רשימת קיצורי אנשי הקשר (קוד קצר -> מספר) מתוך הריפו, לשימוש בשלוחת ההקלטה"""
    try:
        r = requests.get(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{CONTACTS_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'}, timeout=15
        )
        if r.status_code == 200:
            data = r.json()
            content = b64decode(data['content']).decode('utf-8')
            return json.loads(content)
    except Exception as e:
        print(f'שגיאה בטעינת אנשי קשר: {e}')
    return {}

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
    return {'uploaded_ids': [], 'unheard_ids': [], 'sent_recordings': [], 'last_messages': [], '_sha': None}

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

def _media_entry(msg_id, media_kind, sender, chat_name, timestamp, is_outgoing, download_url, mime_type, caption):
    return {
        'id': msg_id, 'type': 'media', 'media_kind': media_kind,
        'text': caption or '', 'sender': sender, 'group': chat_name,
        'timestamp': timestamp, 'is_outgoing': is_outgoing,
        'download_url': download_url, 'mime_type': mime_type or ''
    }

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
        sender_data = body.get('senderData', {})
        chat_id = sender_data.get('chatId', '')
        chat_name = sender_data.get('chatName', '') or chat_id
        is_outgoing = webhook_type == 'outgoingMessageReceived'
        sender_phone_raw = sender_data.get('sender', '') or chat_id
        sender_name = 'אני' if is_outgoing else get_contact_name(sender_phone_raw, sender_data.get('senderName', ''))
        msg_id = body.get('idMessage', '') or str(rid)
        timestamp = body.get('timestamp', 0)

        if type_msg in MEDIA_TYPES:
            file_data = msg_data.get('fileMessageData', {}) or {}
            download_url = file_data.get('downloadUrl', '')
            if not download_url:
                delete_receipt(rid)
                continue
            media_kind = 'audio' if type_msg == 'audioMessage' else 'video'
            messages.append(_media_entry(
                msg_id, media_kind, sender_name, chat_name, timestamp, is_outgoing,
                download_url, file_data.get('mimeType', ''), file_data.get('caption', '')
            ))
            delete_receipt(rid)
            time.sleep(0.1)
            continue

        # הודעה נערכה — חלץ את הטקסט הנערך וטפל כהודעה חדשה
        if type_msg in EDITED_TYPES:
            edited_data = msg_data.get('editedMessageData') or {}
            edit_text = edited_data.get('textMessage', '') or edited_data.get('text', '')
            if edit_text.strip():
                # נשתמש ב-ID חדש (id+_edit) כדי לא לדלג עליו בגלל dedup
                msg_id = msg_id + '_edit'
                type_msg = 'textMessage'
                msg_data['textMessageData'] = {'textMessage': edit_text}
            else:
                delete_receipt(rid)
                continue
        elif type_msg not in TEXT_TYPES:
            delete_receipt(rid)
            continue

        text = (msg_data.get('textMessageData') or {}).get('textMessage', '') or \
               (msg_data.get('extendedTextMessageData') or {}).get('text', '')
        if not text.strip():
            delete_receipt(rid)
            continue

        messages.append({
            'id': msg_id, 'type': 'text', 'text': text, 'sender': sender_name,
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
            type_msg = m.get('typeMessage', '')
            if type_msg in MEDIA_TYPES:
                download_url = m.get('downloadUrl') or (m.get('fileMessageData') or {}).get('downloadUrl', '')
                if not download_url:
                    continue
                media_kind = 'audio' if type_msg == 'audioMessage' else 'video'
                sender_disp = get_contact_name(m.get('sender', '') or m.get('chatId', ''), m.get('senderName', ''))
                messages.append(_media_entry(
                    m.get('idMessage', ''), media_kind, sender_disp, m.get('chatId', ''),
                    m.get('timestamp', 0), False, download_url, m.get('mimeType', ''), m.get('caption', '')
                ))
                continue
            if type_msg in EDITED_TYPES:
                edited_data = m.get('editedMessageData') or {}
                edit_text = edited_data.get('textMessage', '') or edited_data.get('text', '')
                if not edit_text.strip():
                    continue
                # ID ייחודי כדי לעלות שוב גם אם ה-ID המקורי כבר ב-uploaded_ids
                edit_id = m.get('idMessage', '') + '_edit'
                sender_disp = get_contact_name(m.get('sender', '') or m.get('chatId', ''), m.get('senderName', ''))
                messages.append({
                    'id': edit_id, 'type': 'text', 'text': f'[נערך] {edit_text}',
                    'sender': sender_disp, 'group': m.get('chatId', ''),
                    'timestamp': m.get('timestamp', 0), 'is_outgoing': False
                })
                continue
            if type_msg not in TEXT_TYPES:
                continue
            text = m.get('textMessage') or (m.get('extendedTextMessageData') or {}).get('text', '')
            if not text.strip():
                continue
            sender_disp = get_contact_name(m.get('sender', '') or m.get('chatId', ''), m.get('senderName', ''))
            messages.append({
                'id': m.get('idMessage', ''), 'type': 'text', 'text': text,
                'sender': sender_disp, 'group': m.get('chatId', ''),
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
            type_msg = m.get('typeMessage', '')
            if type_msg in MEDIA_TYPES:
                download_url = m.get('downloadUrl') or (m.get('fileMessageData') or {}).get('downloadUrl', '')
                if not download_url:
                    continue
                media_kind = 'audio' if type_msg == 'audioMessage' else 'video'
                messages.append(_media_entry(
                    m.get('idMessage', ''), media_kind, 'אני', m.get('chatId', ''),
                    m.get('timestamp', 0), True, download_url, m.get('mimeType', ''), m.get('caption', '')
                ))
                continue
            if type_msg not in TEXT_TYPES:
                continue
            text = m.get('textMessage') or (m.get('extendedTextMessageData') or {}).get('text', '')
            if not text.strip():
                continue
            messages.append({
                'id': m.get('idMessage', ''), 'type': 'text', 'text': text,
                'sender': 'אני', 'group': m.get('chatId', ''),
                'timestamp': m.get('timestamp', 0), 'is_outgoing': True
            })
    except Exception as e:
        print(f'שגיאה בשליפת היסטוריה יוצאת: {e}')

    return messages

def generate_tts_wav(text):
    """מייצר קובץ שמע קולי בעברית באיכות גבוהה בעזרת edge-tts (קול אנושי טבעי של Microsoft).
    מחזיר bytes של שמע או None אם נכשל/לא מותקן"""
    if not text or not text.strip():
        return None
    try:
        import asyncio
        import edge_tts
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
            mp3_path = f.name
        asyncio.run(edge_tts.Communicate(text, 'he-IL-AvriNeural').save(mp3_path))
        with open(mp3_path, 'rb') as f:
            audio_bytes = f.read()
        try:
            os.remove(mp3_path)
        except Exception:
            pass
        if audio_bytes and len(audio_bytes) > 100:
            return audio_bytes
    except Exception as e:
        print(f'edge-tts fallback ל-TTS של ימות: {e}')
    return None

def upload_to_yemot(text, sender, token, path):
    try:
        tts_text = f'{sender}: {text}' if sender else text
        audio_bytes = generate_tts_wav(tts_text)
        if audio_bytes:
            r = requests.post(
                'https://www.call2all.co.il/ym/api/UploadFile',
                params={'token': token, 'path': path, 'autoNumbering': '1', 'convertAudio': '1'},
                files={'file': ('msg.mp3', audio_bytes, 'audio/mp3')},
                timeout=60
            )
            res = r.json()
            if res.get('path'):
                return res

        # Fallback ל-TTS המובנה של ימות המשיח אם edge-tts לא היה זמין
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

def download_media_bytes(url):
    """מוריד קובץ מדיה (שמע/וידאו) מוואטסאפ לפי כתובת ההורדה"""
    try:
        r = requests.get(url, timeout=60)
        if r.status_code == 200 and r.content:
            return r.content
    except Exception as e:
        print(f'שגיאה בהורדת מדיה: {e}')
    return None

def convert_to_wav(raw_bytes, src_suffix):
    """ממיר קובץ שמע/וידאו לפורמט WAV טלפוני (8kHz מונו) בעזרת ffmpeg. מחזיר bytes או None"""
    try:
        with tempfile.NamedTemporaryFile(suffix=src_suffix, delete=False) as src_f:
            src_f.write(raw_bytes)
            src_path = src_f.name
        dst_path = src_path + '.wav'
        result = subprocess.run(
            ['ffmpeg', '-y', '-i', src_path, '-vn', '-ar', '8000', '-ac', '1', dst_path],
            capture_output=True, timeout=120
        )
        wav_bytes = None
        if result.returncode == 0 and os.path.exists(dst_path):
            with open(dst_path, 'rb') as out_f:
                wav_bytes = out_f.read()
        else:
            print(f'שגיאת ffmpeg בהמרה: {result.stderr.decode(errors="ignore")[:300]}')
        try:
            os.remove(src_path)
        except Exception:
            pass
        try:
            os.remove(dst_path)
        except Exception:
            pass
        return wav_bytes
    except Exception as e:
        print(f'שגיאה בהמרת מדיה ל-WAV: {e}')
        return None

def upload_media_to_yemot(wav_bytes, sender, media_kind, chat_name, token, path):
    """מעלה קובץ מדיה בפועל (הקלטה קולית/סרטון) + תווית TTS שמכריזה מי שלח - התווית מועלית שנייה כדי שתישמע ראשונה (start=max)"""
    try:
        r_audio = requests.post(
            'https://www.call2all.co.il/ym/api/UploadFile',
            params={'token': token, 'path': path, 'autoNumbering': '1', 'convertAudio': '1'},
            files={'file': ('media.wav', wav_bytes, 'audio/wav')},
            timeout=60
        )
        audio_result = r_audio.json()
        if not audio_result.get('path'):
            print(f'שגיאה בהעלאת קובץ מדיה: {audio_result}')
            return {}

        kind_label = 'הודעה קולית' if media_kind == 'audio' else 'סרטון'
        label_text = f'{sender} שלח {kind_label}' + (f' בקבוצה {chat_name}' if chat_name.endswith('@g.us') else '')
        label_result = upload_to_yemot(label_text, '', token, path)
        return audio_result if label_result.get('path') else audio_result
    except Exception as e:
        print(f'שגיאה בהעלאת מדיה לימות ({path}): {e}')
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
    """בודק אם מישהו חייג לשלוחת האיפוס (ivr2:5) - אם כן:
    1. מאפס את תיקיית החדשות (ivr2:1)
    2. בודק שהתיקייה אכן ריקה
    3. מעלה TTS לשלוחה 5 שישמע 'ההודעות החדשות אופסו' (ייכנס לתור הניגון)
    4. מנקה את שלוחת האיפוס ומשחזר הגדרותיה"""
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

    # שלב 1: מחיקה + בדיקה
    clear_new_folder(token)
    time.sleep(1)

    # שלב 2: בדיקה שאכן ריקה
    try:
        rcheck = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                              params={'token': token, 'path': YEMOT_EXTENSION_NEW}, timeout=30)
        remaining = len(rcheck.json().get('files', []))
        success = (remaining == 0)
        print(f'קבצים שנשארו לאחר איפוס: {remaining}')
    except Exception:
        success = True  # אם לא ניתן לבדוק, מניחים שהצליח

    # שלב 3: ניקוי שלוחת ה-record (5) + שחזור הגדרות + הכנסת TTS אישור
    try:
        requests.get('https://www.call2all.co.il/ym/api/FileAction',
                     params={'token': token, 'path': YEMOT_EXTENSION_RESET, 'action': 'delete'}, timeout=30)
        time.sleep(0.5)
        # שחזור הגדרות השלוחה (נמחקו יחד עם ext.ini)
        requests.get('https://www.call2all.co.il/ym/api/UpdateExtension', params={
            'token': token, 'path': YEMOT_EXTENSION_RESET, 'type': 'record', 'title': 'איפוס הודעות חדשות',
            'record_ok': '#', 'say_record_number': 'no', 'option_record': '-1-',
        }, timeout=30)
        # העלאת M2991.tts לשלוחה 5 (prompt שישמע בפעם הבאה)
        prompt5 = 'לאיפוס הודעות חדשות לחצו כוכבית'
        requests.post('https://www.call2all.co.il/ym/api/UploadFile',
                      params={'token': token, 'path': YEMOT_EXTENSION_RESET, 'tts': '1'},
                      files={'file': ('M2991.tts', prompt5.encode('utf-8'), 'text/plain')},
                      timeout=30)
    except Exception as e:
        print(f'שגיאה בניקוי שלוחת איפוס טלפוני: {e}')

    if success:
        print('✅ איפוס הסתיים בהצלחה')
    else:
        print('⚠️ האיפוס בוצע אך נשארו קצת קבצים')
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

def transcribe_hebrew(wav_bytes):
    """מתמלל הקלטה לעברית באמצעות מודל Whisper חינמי (רץ מקומית, ללא API בתשלום)"""
    try:
        from faster_whisper import WhisperModel
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
            f.write(wav_bytes)
            path = f.name
        model = WhisperModel('small', device='cpu', compute_type='int8')
        segments, _ = model.transcribe(path, language='he')
        text = ' '.join(seg.text.strip() for seg in segments).strip()
        try:
            os.remove(path)
        except Exception:
            pass
        return text
    except Exception as e:
        print(f'שגיאה בתמלול: {e}')
        return ''


def ask_ai(user_command, contacts, recent_messages):
    """מפרש פקודה קולית בעברית ומחזיר dict עם הפעולה לביצוע.
    מחזיר: {'action': 'send'/'read'/'none', 'chat_id': ..., 'message': ..., 'read_contact': ...}
    """
    if not GROQ_API_KEY:
        return {'action': 'none', 'reason': 'אין GROQ_API_KEY'}
    
    contacts_str = '\n'.join([f"  {c['name']}: {c['phone']}" for c in contacts.values()]) or '  (אין אנשי קשר)'
    recent_str = '\n'.join([
        f"  [{m.get('sender','')}] {m.get('text','')[:80]}"
        for m in recent_messages[-5:]
    ]) if recent_messages else '  (אין הודעות אחרונות)'
    
    system_prompt = f"""אתה עוזר שמפרש פקודות קוליות בעברית לשליחת/קריאת הודעות וואטסאפ.
    
אנשי קשר שמורים:
{contacts_str}

5 הודעות אחרונות שהתקבלו:
{recent_str}

החזר JSON בלבד (ללא הסבר) עם שדות:
- action: "send" | "read_last" | "none"
- chat_id: מספר טלפון עם קידומת 972 ו-@c.us (לשליחה בלבד, חפש בשמות אנשי הקשר)
- message: טקסט ההודעה לשליחה (אם action=send)
- read_contact: שם איש הקשר שממנו לקרוא (אם action=read_last)
- error: הסבר אם לא הצלחת להבין

דוגמאות:
"תשלח לאריאל מה נשמע" → {{"action":"send","chat_id":"972..@c.us","message":"מה נשמע"}}
"תשמיע לי ההודעה האחרונה משלמה" → {{"action":"read_last","read_contact":"שלמה"}}
"אני עסוק ואחזור אליך" → {{"action":"send","chat_id":"?","message":"אני עסוק ואחזור אליך"}}"""

    try:
        r = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={'Authorization': f'Bearer {GROQ_API_KEY}', 'Content-Type': 'application/json'},
            json={
                'model': 'llama-3.1-8b-instant',
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_command}
                ],
                'temperature': 0.1,
                'max_tokens': 300,
                'response_format': {'type': 'json_object'}
            },
            timeout=15
        )
        if r.status_code == 200:
            text = r.json()['choices'][0]['message']['content']
            return json.loads(text)
        else:
            print(f'Groq API שגיאה: {r.status_code} {r.text[:100]}')
            return {'action': 'none', 'reason': f'groq error {r.status_code}'}
    except Exception as e:
        print(f'שגיאה ב-ask_ai: {e}')
        return {'action': 'none', 'reason': str(e)}


def handle_ai_command(token, audio_bytes, state):
    """מקבל הקלטה קולית של פקודה, שולח ל-AI, מבצע את הפקודה, מחזיר תשובה TTS."""
    # תמלול הפקודה
    command_text = transcribe_hebrew(audio_bytes).strip()
    if not command_text:
        return "לא הצלחתי להבין את הפקודה. נסה שוב."
    print(f'[AI] פקודה: "{command_text}"')
    
    contacts = load_contacts()
    recent_msgs = state.get('last_messages', [])
    
    result = ask_ai(command_text, contacts, recent_msgs)
    print(f'[AI] תוצאה: {result}')
    
    action = result.get('action', 'none')
    
    if action == 'send':
        chat_id = result.get('chat_id', '')
        message = result.get('message', '')
        if not chat_id or '?' in chat_id:
            return f"לא הצלחתי לזהות למי לשלוח. אמרת: {command_text}"
        if not message:
            return "לא הצלחתי להבין מה לשלוח."
        try:
            sr = requests.post(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}',
                json={'chatId': chat_id, 'message': f'🤖 {message}'}, timeout=30
            )
            if sr.status_code == 200 and sr.json().get('idMessage'):
                return f"ההודעה נשלחה: {message}"
            else:
                return "שגיאה בשליחת ההודעה."
        except Exception as e:
            return f"שגיאה: {e}"
    
    elif action == 'read_last':
        contact_name = result.get('read_contact', '')
        # חיפוש ההודעה האחרונה מאיש הקשר
        for msg in reversed(recent_msgs):
            sender = msg.get('sender_name', '') or msg.get('sender', '')
            if contact_name.lower() in sender.lower():
                text = msg.get('text', '')
                return f"ההודעה האחרונה מ{sender} היא: {text}"
        return f"לא מצאתי הודעה אחרונה מ{contact_name}."
    
    else:
        err = result.get('error', '') or result.get('reason', '')
        return f"לא הצלחתי לפרש את הפקודה. {err}"


def resolve_recipient_from_voice(audio_bytes):
    """מתמלל הקלטת קול קצרה (שם/מספר) ומחזיר chat_id ותווית.
    מנסה להתאים לאיש קשר שמור לפי שם, אחרת מניח שזה מספר."""
    if not audio_bytes:
        return None, None
    text = transcribe_hebrew(audio_bytes).strip()
    if not text:
        return None, None
    print(f'תמלול שם/מספר: "{text}"')

    # 1. נסה להתאים לאיש קשר לפי שם (חיפוש חלקי, case-insensitive)
    contacts = load_contacts()
    text_lower = text.lower()
    best_contact = None
    best_score = 0
    for code, c in contacts.items():
        cname = c.get('name', '').lower()
        if not cname:
            continue
        # ניקוד: כמה מילות השם מופיעות בתמלול
        words_matched = sum(1 for w in cname.split() if w in text_lower)
        if words_matched > best_score:
            best_score = words_matched
            best_contact = c
    if best_contact and best_score > 0:
        chat_id = normalize_phone(best_contact['phone']) + '@c.us'
        print(f'זוהה איש קשר: {best_contact["name"]} → {chat_id}')
        return chat_id, best_contact['name']

    # 2. אם התמלול נראה כמספר טלפון (ספרות בלבד)
    digits_only = ''.join(c for c in text if c.isdigit())
    if len(digits_only) >= 7:
        chat_id = normalize_phone(digits_only) + '@c.us'
        print(f'מספר טלפון מתמלול: {digits_only} → {chat_id}')
        return chat_id, digits_only

    print(f'לא זוהה נמען מתמלול: "{text}"')
    return None, None


def send_recording_to_whatsapp(token, file_path, chat_id, recipient_label, mode, sent_recordings, uid):
    """שולח קובץ הקלטה לוואטסאפ. mode=1 קול, mode=2 טקסט מתומלל."""
    try:
        dl = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                           params={'token': token, 'path': file_path}, timeout=30)
        if dl.status_code != 200 or not dl.content:
            print(f'שגיאה בהורדת הקלטה {file_path}')
            return sent_recordings

        sent_ok = False
        if mode == '2':
            text = transcribe_hebrew(dl.content)
            if text:
                sr = requests.post(
                    f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}',
                    json={'chatId': chat_id, 'message': f'🎙️ הודעה מתומללת מהקו:\n{text}'}, timeout=30
                )
                sent_ok = sr.status_code == 200 and sr.json().get('idMessage')
                if not sent_ok:
                    mode = '1'  # נופלים לקול אם תמלול נכשל

        if mode == '1':
            fname = file_path.split('/')[-1]
            sr = requests.post(
                f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendFileByUpload/{GREEN_API_TOKEN}',
                data={'chatId': chat_id, 'caption': f'📞 הודעה קולית לך מהקו'},
                files={'file': (fname, dl.content, 'audio/wav')}, timeout=30
            )
            sent_ok = sr.status_code == 200 and sr.json().get('idMessage')

        if sent_ok:
            print(f'✅ הקלטה נשלחה ל-{recipient_label} ({chat_id})')
            sent_recordings.add(uid)
            requests.get('https://www.call2all.co.il/ym/api/FileAction',
                         params={'token': token, 'path': file_path, 'action': 'delete'}, timeout=30)
        else:
            print(f'❌ שגיאה בשליחה ל-{chat_id}')
    except Exception as e:
        print(f'שגיאה בטיפול בהקלטה {file_path}: {e}')
    return sent_recordings


def check_and_send_recordings(token, sent_recordings, state=None):
    """בודק הקלטות חדשות בשני נתיבים:
    נתיב A (ivr2:2:2) — הקשת מספר/קיצור (ספרות), כרגיל.
    נתיב B (ivr2:2:1) — תמלול שם קולי: קובץ name.wav ← תמלול ← חיפוש בcontacts ← הקלטת ההודעה ב-ivr2:2:1:record.
    """
    # ===== נתיב A: שלוחה 2:2 — הקלטת מספר + mode + קול/טקסט עם אישור =====
    #
    # 2:2           = הקלטת מספר טלפון קולית   → files here
    # 2:2:confirm   = routing אישור (main.py לא צריך לגעת בו)
    # 2:2:mode      = routing בחירת מצב (לא צריך לגעת)
    # 2:2:voice     = הקלטת הודעה קולית         → files here → שולח ישיר
    # 2:2:text      = הקלטת הודעה לתמלול        → files here → Whisper → TTS אישור → 2:2:text:ok
    # 2:2:text:ok   = routing אישור תמלול        → 1=שלח / 2=חזור
    # 2:2:text:send = transfer (main.py שולח כשרואה אישור)
    #
    # מיפוי: כל קובץ ב-2:2 (מספר) מותאם ל-2:2:voice או 2:2:text לפי סדר זמן
    
    try:
        r_phone = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                               params={'token': token, 'path': 'ivr2:2:2'}, timeout=30)
        phone_files = sorted(
            [f for f in r_phone.json().get('files', []) if f.get('name','').endswith(('.wav','.opus'))],
            key=lambda x: x.get('date','')
        )
        r_voice = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                               params={'token': token, 'path': 'ivr2:2:2:voice'}, timeout=30)
        voice_files = sorted(
            [f for f in r_voice.json().get('files', []) if f.get('name','').endswith(('.wav','.opus'))],
            key=lambda x: x.get('date','')
        )
        r_text = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                              params={'token': token, 'path': 'ivr2:2:2:text'}, timeout=30)
        text_files = sorted(
            [f for f in r_text.json().get('files', []) if f.get('name','').endswith(('.wav','.opus'))],
            key=lambda x: x.get('date','')
        )
        r_textok = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                                params={'token': token, 'path': 'ivr2:2:2:text:ok'}, timeout=30)
        textok_ini = r_textok.json().get('extIni', {})
        # בדיקה אם כבר יש TTS אישור (תמלול) שממתין לאישור משתמש
        r_textok_files = [f for f in r_textok.json().get('files', []) if f.get('name','').endswith('.tts')]
        r_textsend = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                                  params={'token': token, 'path': 'ivr2:2:2:text:send'}, timeout=30)
        textsend_files = sorted(
            [f for f in r_textsend.json().get('files', []) if f.get('name','').endswith(('.wav','.opus'))],
            key=lambda x: x.get('date','')
        )
    except Exception as e:
        print(f'שגיאה בטעינת נתיב A: {e}')
        phone_files = voice_files = text_files = textsend_files = []
        textok_ini = {}
        r_textok_files = []

    # --- שלב 1: הודעות קוליות מוכנות (2:2:voice) ---
    for i, vf in enumerate(voice_files):
        uid = vf.get('uniqueId','')
        if not uid or uid in sent_recordings:
            continue
        # מחפש קובץ מספר מקביל
        if i >= len(phone_files):
            print(f'אין קובץ מספר מקביל ל-voice {vf["name"]}')
            break
        pf = phone_files[i]
        phone_uid = pf.get('uniqueId','')

        # תמלול המספר
        print(f'[נתיב A קול] מתמלל מספר מ-{pf["name"]}...')
        try:
            dl_p = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                params={'token': token, 'path': f'ivr2:2:2/{pf["name"]}'}, timeout=30)
            phone_text = transcribe_hebrew(dl_p.content if dl_p.status_code == 200 else b'').strip()
        except Exception as e:
            print(f'שגיאה בתמלול מספר: {e}')
            phone_text = ''

        digits_only = ''.join(c for c in phone_text if c.isdigit())
        print(f'מספר שזוהה: "{digits_only}"')

        if len(digits_only) < 7:
            print(f'מספר לא תקין, מדלג')
            for uid_skip, path_skip in [(uid, f'ivr2:2:2:voice/{vf["name"]}'), (phone_uid, f'ivr2:2:2/{pf["name"]}')]:
                sent_recordings.add(uid_skip)
                try: requests.get('https://www.call2all.co.il/ym/api/FileAction',
                                  params={'token': token, 'path': path_skip, 'action': 'delete'}, timeout=30)
                except: pass
            continue

        chat_id = normalize_phone(digits_only) + '@c.us'
        sent_recordings = send_recording_to_whatsapp(
            token, f'ivr2:2:2:voice/{vf["name"]}', chat_id, digits_only, '1', sent_recordings, uid)
        sent_recordings.add(phone_uid)
        try: requests.get('https://www.call2all.co.il/ym/api/FileAction',
                          params={'token': token, 'path': f'ivr2:2:2/{pf["name"]}', 'action': 'delete'}, timeout=30)
        except: pass

    # --- שלב 2: הודעות טקסט — תמלול + TTS אישור → העלאה ל-2:2:text:ok ---
    # קובץ ב-2:2:text שעדיין אין לו TTS אישור ב-2:2:text:ok → מתמלל ומעלה TTS
    # (אחד בכל פעם — מחכים לאישור המשתמש בריצה הבאה)
    if text_files and not r_textok_files:
        tf = text_files[0]
        uid = tf.get('uniqueId','')
        if uid and uid not in sent_recordings:
            # מחפש מספר מקביל (לפי index בין phone_files ל-text)
            # phone_files שלא שויכו לvoice הם השלוחות שהיו text
            used_phone_count = len([vf for vf in voice_files if vf.get('uniqueId','') not in sent_recordings or True])
            # פשוט: phone_files[len(voice_files)] = המספר המקביל לtext[0]
            phone_idx = len(voice_files)
            pf = phone_files[phone_idx] if phone_idx < len(phone_files) else None

            print(f'[נתיב A טקסט] מתמלל הקלטת הודעה מ-{tf["name"]}...')
            try:
                dl_t = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                    params={'token': token, 'path': f'ivr2:2:2:text/{tf["name"]}'}, timeout=30)
                transcribed = transcribe_hebrew(dl_t.content if dl_t.status_code == 200 else b'').strip()
            except Exception as e:
                print(f'שגיאה בתמלול הודעה: {e}')
                transcribed = ''

            if transcribed:
                print(f'תמלול: "{transcribed}"')
                # מעלה TTS לשלוחת האישור (2:2:text:ok)
                tts_confirm = f'ההודעה המתומללת היא: {transcribed}. לאישור ושליחה לחץ 1. להקלטה מחדש לחץ 2.'
                try:
                    requests.post('https://www.call2all.co.il/ym/api/UploadFile',
                        params={'token': token, 'path': 'ivr2:2:2:text:ok', 'tts': '1'},
                        files={'file': ('M2991.tts', tts_confirm.encode('utf-8'), 'text/plain')}, timeout=30)
                    print(f'TTS אישור הועלה ל-2:2:text:ok')
                except Exception as e:
                    print(f'שגיאה בהעלאת TTS אישור: {e}')
            else:
                print('לא הצלחתי לתמלל, מדלג')
                sent_recordings.add(uid)
                try: requests.get('https://www.call2all.co.il/ym/api/FileAction',
                                  params={'token': token, 'path': f'ivr2:2:2:text/{tf["name"]}', 'action': 'delete'}, timeout=30)
                except: pass

    # --- שלב 3: אם יש קובץ ב-2:2:text:send — המשתמש אישר → שולח טקסט ---
    for sf in textsend_files:
        uid = sf.get('uniqueId','')
        if not uid or uid in sent_recordings:
            continue
        # מצא text file + phone file מקביל
        phone_idx = len(voice_files)
        pf = phone_files[phone_idx] if phone_idx < len(phone_files) else None
        tf = text_files[0] if text_files else None

        # שחזר את הטקסט מתוך TTS האישור ב-2:2:text:ok (שמשמש כcache)
        transcribed = ''
        try:
            r_tts = requests.get('https://www.call2all.co.il/ym/api/GetTextFile',
                                 params={'token': token, 'path': 'ivr2:2:2:text:ok/M2991.tts'}, timeout=30)
            tts_content = r_tts.json().get('contents','')
            # חלץ את הטקסט מתוך ה-TTS (פורמט: "ההודעה המתומללת היא: TEXT. לאישור...")
            if 'ההודעה המתומללת היא:' in tts_content:
                transcribed = tts_content.split('ההודעה המתומללת היא:')[1].split('. לאישור')[0].strip()
        except Exception as e:
            print(f'שגיאה בשחזור טקסט: {e}')

        if not transcribed and tf:
            # תמלל מחדש אם צריך
            try:
                dl_t = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                    params={'token': token, 'path': f'ivr2:2:2:text/{tf["name"]}'}, timeout=30)
                transcribed = transcribe_hebrew(dl_t.content if dl_t.status_code == 200 else b'').strip()
            except Exception:
                pass

        # מספר הנמען
        digits_only = ''
        if pf:
            try:
                dl_p = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                    params={'token': token, 'path': f'ivr2:2:2/{pf["name"]}'}, timeout=30)
                phone_text = transcribe_hebrew(dl_p.content if dl_p.status_code == 200 else b'').strip()
                digits_only = ''.join(c for c in phone_text if c.isdigit())
            except Exception:
                pass

        if transcribed and len(digits_only) >= 7:
            chat_id = normalize_phone(digits_only) + '@c.us'
            print(f'[נתיב A טקסט] שולח טקסט ל-{chat_id}: "{transcribed}"')
            try:
                sr = requests.post(
                    f'https://api.green-api.com/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}',
                    json={'chatId': chat_id, 'message': f'🎙️ הודעה מתומללת מהקו:\n{transcribed}'}, timeout=30)
                if sr.status_code == 200 and sr.json().get('idMessage'):
                    print(f'✅ נשלח!')
                    sent_recordings.add(uid)
                    # ניקוי: מחיקת text file, phone file, TTS אישור, send file
                    for path_del in [
                        f'ivr2:2:2:text:send/{sf["name"]}',
                        f'ivr2:2:2/{pf["name"]}' if pf else None,
                        f'ivr2:2:2:text/{tf["name"]}' if tf else None,
                    ]:
                        if path_del:
                            try: requests.get('https://www.call2all.co.il/ym/api/FileAction',
                                              params={'token': token, 'path': path_del, 'action': 'delete'}, timeout=30)
                            except: pass
                    if pf: sent_recordings.add(pf.get('uniqueId',''))
                    if tf: sent_recordings.add(tf.get('uniqueId',''))
            except Exception as e:
                print(f'שגיאה בשליחת טקסט: {e}')
        else:
            print(f'חסר טקסט או מספר, מדלג על שליחה')
            sent_recordings.add(uid)

    # ===== נתיב AI: שלוחה 2:3 ו-שלוחה 3 — פקודה קולית חופשית =====
    ai_targets = [('ivr2:2:3', 'ivr2:2:3:result'), ('ivr2:3', 'ivr2:3:result')]
    for in_path, out_path in ai_targets:
        try:
            r_ai = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                                 params={'token': token, 'path': in_path}, timeout=30)
            ai_files = sorted(
                [f for f in r_ai.json().get('files', []) if f.get('name','').endswith(('.wav','.opus'))],
                key=lambda x: x.get('date','')
            )
        except Exception as e:
            print(f'שגיאה בטעינת פקודות AI מ-{in_path}: {e}')
            ai_files = []

        for af in ai_files:
            uid = af.get('uniqueId','')
            if not uid or uid in sent_recordings:
                continue
            print(f'[AI] מעבד פקודה מ-{in_path}: {af["name"]}')
            try:
                dl = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                   params={'token': token, 'path': f'{in_path}/{af["name"]}'}, timeout=30)
                audio_bytes = dl.content if dl.status_code == 200 else b''
            except Exception as e:
                print(f'שגיאה בהורדת פקודה AI: {e}')
                audio_bytes = b''

            response_text = handle_ai_command(token, audio_bytes, state)
            print(f'[AI] תשובה: "{response_text}"')

            # מעלה TTS של התשובה (בקול אנושי בעזרת edge-tts)
            try:
                upload_to_yemot(response_text, '', token, out_path)
            except Exception as e:
                print(f'שגיאה בהעלאת תשובת AI: {e}')

            sent_recordings.add(uid)
            try:
                requests.get('https://www.call2all.co.il/ym/api/FileAction',
                             params={'token': token, 'path': f'{in_path}/{af["name"]}', 'action': 'delete'}, timeout=30)
            except Exception:
                pass

    # ===== נתיב B: שלוחה 2/1 — תמלול שם קולי =====
    name_entries, rec_entries = [], []
    for p_name, p_rec in [('ivr2:2/1', 'ivr2:2/1/record'), ('ivr2:2:1', 'ivr2:2:1:record')]:
        try:
            rn = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                              params={'token': token, 'path': p_name}, timeout=30)
            n_list = [(f, p_name) for f in rn.json().get('files', [])
                      if f.get('name', '').endswith(('.wav', '.opus'))]
            rr = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                              params={'token': token, 'path': p_rec}, timeout=30)
            r_list = [(f, p_rec) for f in rr.json().get('files', [])
                      if f.get('name', '').endswith(('.wav', '.opus'))]
            name_entries.extend(n_list)
            rec_entries.extend(r_list)
        except Exception as e:
            print(f'שגיאה בבדיקת נתיב B ({p_name}): {e}')

    name_entries.sort(key=lambda x: x[0].get('date', ''))
    rec_entries.sort(key=lambda x: x[0].get('date', ''))

    for i, (nf, p_name) in enumerate(name_entries):
        uid = nf.get('uniqueId', '')
        if not uid or uid in sent_recordings:
            continue
        if i >= len(rec_entries):
            print(f'אין הקלטת הודעה מקבילה לשם קובץ {nf["name"]}, ממתין לrun הבא')
            break

        rf, p_rec = rec_entries[i]
        rec_uid = rf.get('uniqueId', '')
        if rec_uid in sent_recordings:
            sent_recordings.add(uid)
            continue

        print(f'נתיב B: מתמלל שם מ-{p_name}/{nf["name"]}...')
        try:
            dl_name = requests.get('https://www.call2all.co.il/ym/api/DownloadFile',
                                    params={'token': token, 'path': f'{p_name}/{nf["name"]}'}, timeout=30)
            chat_id, recipient_label = resolve_recipient_from_voice(dl_name.content if dl_name.status_code == 200 else b'')
        except Exception as e:
            print(f'שגיאה בהורדת הקלטת שם: {e}')
            chat_id, recipient_label = None, None

        if not chat_id:
            print(f'לא זוהה נמען, מדלג')
            sent_recordings.add(uid)
            sent_recordings.add(rec_uid)
            requests.get('https://www.call2all.co.il/ym/api/FileAction',
                         params={'token': token, 'path': f'{p_name}/{nf["name"]}', 'action': 'delete'}, timeout=30)
            requests.get('https://www.call2all.co.il/ym/api/FileAction',
                         params={'token': token, 'path': f'{p_rec}/{rf["name"]}', 'action': 'delete'}, timeout=30)
            continue

        # שולחים את ההקלטה (תמיד קול ב-נתיב B)
        sent_recordings = send_recording_to_whatsapp(
            token, f'{p_rec}/{rf["name"]}', chat_id, recipient_label, '1', sent_recordings, rec_uid)
        sent_recordings.add(uid)
        # מוחקים גם את הקלטת השם
        try:
            requests.get('https://www.call2all.co.il/ym/api/FileAction',
                         params={'token': token, 'path': f'{p_name}/{nf["name"]}', 'action': 'delete'}, timeout=30)
        except Exception:
            pass

    return sent_recordings

def acquire_lock(state):
    """בודק אם ריצה אחרת כבר פועלת. מחזיר True אם קיבלנו lock, False אם כבר תפוס."""
    now = time.time()
    running_since = state.get('running_since', 0)
    if running_since and (now - running_since) < 180:  # 3 דקות timeout
        print(f'⚠️  ריצה אחרת כבר פועלת (לפני {int(now - running_since)} שניות) — דולג')
        return False
    state['running_since'] = now
    # שמור מיד כדי ל"הזמין" את ה-lock (שומר העתק, _sha נשמר בstate המקורי)
    sha_backup = state.get('_sha')
    save_state(dict(state))
    state['_sha'] = sha_backup  # שחזר _sha כי save_state עושה pop
    # טען מחדש ובדוק שה-lock שלנו נשמר (אין race עם תהליך אחר)
    time.sleep(2)
    fresh = load_state()
    fresh_since = fresh.get('running_since', 0)
    if abs(fresh_since - now) > 5:
        print(f'⚠️  race condition זוהה — ריצה אחרת ניצחה את ה-lock')
        return False
    return True

def release_lock(state):
    """משחרר את ה-lock בסוף ריצה — טוען sha עדכני כדי שה-save_state הסופי יצליח."""
    state.pop('running_since', None)
    # עדכן _sha ל-sha האחרון שנשמר בגיט (כדי שהsave הסופי לא יכשל ב-409)
    try:
        r = requests.get(
            f'https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}',
            headers={'Authorization': f'Bearer {GITHUB_TOKEN}'}, timeout=15
        )
        if r.status_code == 200:
            state['_sha'] = r.json()['sha']
    except Exception:
        pass

def main():
    print('טוען מצב קודם...')
    state = load_state()
    # בדיקת lock — אם ריצה אחרת פועלת, יוצאים
    if not acquire_lock(state):
        return
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
        if m.get('type', 'text') == 'text' and m.get('is_outgoing') and m['text'].strip() == RESET_KEYWORD:
            reset_requested = True
            uploaded_ids.add(m['id'])
            continue

        group = m.get('group', '')
        # בצ'אט פרטי (לא קבוצה): בצ'אט עם עצמי - מעלים הכל. בצ'אט עם אדם אחר - מעלים רק את ההודעות שהוא שלח (לא את מה ששלחתי אני)
        if group.endswith('@c.us') and group != OWN_CHAT_ID and m.get('is_outgoing'):
            uploaded_ids.add(m['id'])  # מסמנים כמטופל כדי שלא ניבדק שוב, אבל לא מעלים לימות
            continue

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
                if msg.get('type') == 'media':
                    raw_bytes = download_media_bytes(msg['download_url'])
                    if not raw_bytes:
                        print(f'דילוג - נכשלה הורדת מדיה [{msg["media_kind"]}] מ-{msg["sender"]}')
                        continue
                    suffix = '.ogg' if msg['media_kind'] == 'audio' else '.mp4'
                    wav_bytes = convert_to_wav(raw_bytes, suffix)
                    if not wav_bytes:
                        print(f'דילוג - נכשלה המרת מדיה [{msg["media_kind"]}] מ-{msg["sender"]}')
                        continue

                    result = upload_media_to_yemot(wav_bytes, msg['sender'], msg['media_kind'], msg['group'], token, YEMOT_EXTENSION)
                    if result.get('path'):
                        print(f'הועלה מדיה [הכל]: [{msg["group"]}] {msg["sender"]} ({msg["media_kind"]}) → {result["path"]}')
                        newly_uploaded.append(msg['id'])
                    else:
                        print(f'שגיאה בהעלאת מדיה לתיקיית הכל מ-{msg["sender"]}')
                        continue

                    result2 = upload_media_to_yemot(wav_bytes, msg['sender'], msg['media_kind'], msg['group'], token, YEMOT_EXTENSION_NEW)
                    if result2.get('path'):
                        unheard_ids.add(msg['id'])
                else:
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
        sent_recordings = check_and_send_recordings(token, sent_recordings, state)
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
    # שמור 50 הודעות אחרונות לשימוש AI
    if 'last_messages' not in state:
        state['last_messages'] = []
    state['last_messages'] = (state['last_messages'] + new_messages)[-50:]
    state['sent_recordings'] = list(sent_recordings)[-500:]
    release_lock(state)
    save_state(state)

    try:
        requests.get('https://www.call2all.co.il/ym/api/Logout', params={'token': token}, timeout=30)
    except Exception:
        pass

    print('סיום ✅')

if __name__ == '__main__':
    import sys
    if os.environ.get('RESET_ONLY') == '1':
        # מופעל מ-reset workflow (ימות → GitHub Actions reset.yml)
        print('=== מצב איפוס בלבד ===')
        try:
            r = requests.get('https://www.call2all.co.il/ym/api/Login',
                             params={'username': YEMOT_USERNAME, 'password': YEMOT_PASSWORD}, timeout=30)
            token = r.json().get('token')
        except Exception as e:
            print(f'שגיאה בהתחברות לימות: {e}')
            sys.exit(1)
        
        print('מאפס תיקיית חדשות...')
        clear_new_folder(token)
        import time as _time
        _time.sleep(2)
        
        # בדיקה שאכן ריק
        try:
            rcheck = requests.get('https://www.call2all.co.il/ym/api/GetIVR2Dir',
                                  params={'token': token, 'path': YEMOT_EXTENSION_NEW}, timeout=30)
            remaining = len(rcheck.json().get('files', []))
            success = (remaining == 0)
            print(f'קבצים שנשארו: {remaining}')
        except Exception:
            success = True
        
        # עדכון state.json — ניקוי unheard_ids
        state = load_state()
        state['unheard_ids'] = []
        save_state(state)
        
        # השמעת TTS אישור: מעלים לשלוחה 1 הודעת אישור שתישמע מיד
        if success:
            ok_msg = 'התיקייה אופסה בהצלחה. כעת אין הודעות חדשות.'
        else:
            ok_msg = 'האיפוס בוצע. ייתכן שנשארו מספר קבצים.'
        try:
            requests.post('https://www.call2all.co.il/ym/api/UploadFile',
                          params={'token': token, 'path': YEMOT_EXTENSION_NEW, 'tts': '1', 'autoNumbering': '1'},
                          files={'file': ('confirm.txt', ok_msg.encode('utf-8'), 'text/plain')},
                          timeout=30)
        except Exception:
            pass
        
        print(f'✅ איפוס {"הצליח" if success else "בוצע (חלקי)"}')
        sys.exit(0)
    else:
        main()
