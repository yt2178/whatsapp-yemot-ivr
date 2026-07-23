import os
import sys
import requests
from faster_whisper import WhisperModel

# קבלת פרמטרים מתוך ה-Trigger של ה-Action (שם הקובץ ומספר טלפון)
RECORDING_FILENAME = os.getenv("RECORDING_FILENAME", "ym000.wav")
USER_PHONE = os.getenv("USER_PHONE", "") # מספר השולח מימות המשיח

# הגדרת קרדינלים מסביבת הריצה של ה-Github Secrets
YEMOT_TOKEN = os.getenv("YEMOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GREEN_API_ID = os.getenv("GREEN_API_INSTANCE_ID")
GREEN_API_TOKEN = os.getenv("GREEN_API_TOKEN")

def download_audio():
    print("⏳ מוריד קובץ שמע מימות המשיח...")
    url = f"https://www.call2all.co.il/ym/api/DownloadFile?token={YEMOT_TOKEN}&path=ivr2/3/{RECORDING_FILENAME}"
    response = requests.get(url)
    if response.status_code == 200:
        with open("recording.wav", "wb") as f:
            f.write(response.content)
        print("✅ קובץ השמע הורד בהצלחה.")
    else:
        print(f"❌ שגיאה בהורדת הקובץ: {response.status_code}")
        sys.exit(1)

def transcribe_audio():
    print("⏳ מתחיל תמלול עם faster-whisper...")
    # שימוש במודל ייעודי לעברית של ivrit-ai לתוצאות הטובות ביותר
    model = WhisperModel("ivrit-ai/faster-whisper-v2-d4", device="cpu", compute_type="int8")
    
    segments, info = model.transcribe("recording.wav", beam_size=5, language="he")
    transcription = " ".join([segment.text for segment in segments])
    
    print(f"📝 תוצאת תמלול: {transcription}")
    return transcription

def analyze_with_gemini(text):
    print("⏳ שולח ל-Gemini Flash לצורך הבנת הפעולה...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    אתה עוזר אישי חכם שמנתח פקודות קוליות בעברית שהתקבלו מטלפון.
    ההודעה שהתקבלה היא: "{text}"
    חלץ מתוך ההודעה את הפרטים הבאים בפורמט JSON בלבד:
    {{
       "name": "שם איש הקשר אליו יש לשלוח (או ריק אם לא צוין)",
       "message_to_send": "נוסח ההודעה המדויק שיש לשלוח",
       "phone_number": "אם הוזכר מספר טלפון בהודעה, חלץ אותו. אחרת השאר ריק"
    }}
    אל תוסיף שום טקסט אחר פרט ל-JSON המבוקש.
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    response = requests.post(url, json=payload)
    result = response.json()
    try:
        raw_text = result['candidates'][0]['content']['parts'][0]['text']
        # ניקוי פורמטי markdown אם ישנם
        cleaned_json = raw_text.replace("```json", "").replace("```", "").strip()
        import json
        return json.loads(cleaned_json)
    except Exception as e:
        print(f"❌ שגיאה בפענוח תגובת Gemini: {e}")
        return None

import json

def load_contacts():
    try:
        if os.path.exists("contacts.json"):
            with open("contacts.json", "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"שגיאה בטעינת אנשי קשר: {e}")
    return {}

def send_whatsapp(data):
    if not data or not data.get("message_to_send"):
        print("❌ אין מספיק נתונים לשליחת הודעה.")
        return
    
    contacts = load_contacts()
    target_name = data.get("name", "")
    target_phone = data.get("phone_number") or contacts.get(target_name, {}).get("phone", "")
    
    if not target_phone:
        print(f"❌ לא נמצא מספר טלפון עבור איש הקשר: {target_name}")
        return
        
    print(f"⏳ שולח וואטסאפ ל-{target_name} ({target_phone}) דרך Green API...")
    url = f"https://api.green-api.com/waInstance{GREEN_API_ID}/sendMessage/{GREEN_API_TOKEN}"
    
    payload = {
        "chatId": f"{target_phone}@c.us",
        "message": data["message_to_send"]
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("✅ הודעת הוואטסאפ נשלחה בהצלחה!")
    else:
        print(f"❌ שגיאה בשליחת וואטסאפ: {response.text}")

if __name__ == "__main__":
    download_audio()
    text = transcribe_audio()
    extracted_data = analyze_with_gemini(text)
    send_whatsapp(extracted_data)
