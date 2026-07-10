# 📱 WhatsApp ↔️ Yemot IVR Automation

משלב **WhatsApp** עם **Yemot HaMashiach** (מערכת IVR טלפונית) — שידור הודעות דו-כיווני, תמלול קולי, והפעלת פקודות AI בעברית.

---

## 🎯 תכונות

### 📥 **קליטת הודעות WhatsApp**
- שליפה בזמן אמת (תור) והיסטוריה מ-Green API
- תמיכה בטקסט, הודעות קוליות, וידאו, ותמלולים
- זיהוי שם שולח (contacts + Green API)
- עקיפה של הודעות עצמיות יוצאות (בצ'אטים פרטיים)

### 📤 **שדרוג לYemot (מערכת קוית VoIP)**
- **הודעות טקסט** → TTS אוטומטי
- **הודעות קוליות וסרטונים** → המרה ל-WAV (ffmpeg) → העלאה
- יצירת תיקיות לפי שלוחות (Yemot extensions)
- **צ'ט פרטי חדש?** → צינתוק חינמי אוטומטי

### 🎤 **קליטת הקלטות לוואטסאפ (שני נתיבים)**

#### **נתיב A: הקלטת מספר + בחירת מצב**
```
ivr2:2:2           ← הקלטת מספר טלפון (קולית)
├─ ivr2:2:2:voice  ← קול ישיר לנמען
└─ ivr2:2:2:text   ← הודעה לתמלול + אישור טקסטי

תזרים:
1. משתמש מקליט מספר → תמלול קולי ל-digits
2. בחירה: [1=קול ישיר | 2=תמלול טקסט]
3. שליחה לWA עם הודעה קולית או טקסט
```

#### **נתיב B: הקלטת שם + הקלטת הודעה**
```
ivr2:2:1           ← הקלטת שם אישי (קולי)
└─ ivr2:2:1:record ← הקלטת הודעה (קולית בלבד)

תזרים:
1. משתמש מקליט שם (דוגמה: "דן" או מספר)
2. תמלול → חיפוש בcontacts.json
3. שליחה ישירה כקובץ קולי לWA
```

### 🤖 **AI פקודות חופשיות (נתיב 2:3)**
```
איפה "תשלח לדן מה נשמע" → Groq LLM מפרש עברית
↓ מחיקים פקודה / קריאת הודעות / שליחה ל-Contacts
↓ TTS תשובה לשלוחה 2:3:result
```

### 🔄 **ניהול מצב**
- **state.json** שמור בGitHub — עקיבות הודעות שכבר עובדו
- מניעת כפלויות: `uploaded_ids`, `unheard_ids`, `sent_recordings`
- שמירת 50 הודעות אחרונות לשימוש AI context

### 🔌 **אינטגרציות**
| שירות | תפקיד |
|-------|--------|
| **Green API** | קליטה + שידור WhatsApp |
| **Yemot** | IVR VoIP, TTS, הקלטות |
| **Groq** (LLM) | פענוח פקודות AI בעברית |
| **Whisper** | תמלול קולי עברי (faster-whisper) |
| **GitHub** | אחסון מצב, triggers (workflow_dispatch) |
| **Google Apps Script** | טריגר אמין כל 5 דקות |

---

## 🔧 הגדרה

### **דרישות**
```bash
pip install requests faster-whisper ffmpeg
# ffmpeg חייב להיות בPATH למערכת
```

### **משתנים סביבה**

#### Green API (WhatsApp)
```bash
GREEN_API_INSTANCE_ID=1234567890  # ממשק Green
GREEN_API_TOKEN=your_token_here
```

#### Yemot (IVR)
```bash
YEMOT_USERNAME=your_username
YEMOT_PASSWORD=your_password
YEMOT_EXTENSION=ivr2:4              # תיקיית "הכל" (ברירת מחדל)
YEMOT_EXTENSION_NEW=ivr2:1          # "הודעות חדשות שלא נשמעו"
YEMOT_EXTENSION_RECORD=ivr2:2:2     # שלוחת הקלטת הודעה
YEMOT_EXTENSION_RESET=ivr2:5        # טריגר איפוס טלפוני
```

#### AI + תמלול
```bash
GROQ_API_KEY=your_groq_key          # https://console.groq.com
```

#### Github + State
```bash
GITHUB_TOKEN=ghp_xxxxx              # Token עם permissions: actions (read/write)
GITHUB_REPO=yt2178/whatsapp-yemot-ivr  # קו ברירת מחדל
```

#### Tweaks
```bash
OWN_CHAT_ID=972501234567@c.us       # הצ'אט עם עצמי (הודעות ניהול פנימיות)
RESET_KEYWORD=#נשמע                 # הודעה זו = איפוס תיקיית חדשות
TZINTUK_LIST=yt2178whatsapp         # שם רשימת צינתוקים להתראות
HISTORY_MINUTES=10080               # 7 ימים — החזר היסטוריה כמה דקות אחורה
```

### **התחלה**

#### אפשרות 1: CI/CD (מומלץ)
```bash
# עדכן .github/workflows/main.yml ב-repo
# הגדר סודות בSettings > Secrets
# Trigger: Google Apps Script כל 5 דקות (ראה google_apps_script_trigger.gs)
```

#### אפשרות 2: Local
```bash
python main.py
```

---

## 📁 מבנה פרויקט

```
whatsapp-yemot-ivr/
├── main.py                        # סקריפט ליבה (1.2K שורות)
├── google_apps_script_trigger.gs  # קריאת Actions מGoogle Sheets
├── README.md                      # תיעוד זה
├── contacts.json                  # מילון קצורים (קוד → {name, phone})
├── state.json                     # מצב עקיבות (GitHub-backed)
└── .github/workflows/
    ├── main.yml                   # ריצה ראשית (GitHub Actions)
    └── reset.yml                  # איפוס שלוחה 1 (כללי-לילי)
```

---

## 🚀 זרימות עבודה

### **זרימת הודעה טקסט (WhatsApp → Yemot)**
```
User sends message to WhatsApp
            ↓
Green API webhook → main.py detects
            ↓
fetch_queue_messages() + fetch_history_messages()
            ↓
Dedup by id (skip if in uploaded_ids)
            ↓
Skip outgoing messages in private chats (not OWN_CHAT_ID)
            ↓
upload_to_yemot(text, sender, token, extension)
  → TTS: "{sender}: {text}"
            ↓
Yemot plays to callers (extension ivr2:4 + ivr2:1)
            ↓
state.json: mark id as uploaded, add to unheard
            ↓
If NEW private message → trigger_tzintuk() (free alert)
```

### **זרימת הקלטה (Phone → WhatsApp)**

#### **Path A: Recorded Number + Mode Selection**
```
Caller: [records number] → 1 (voice) or 2 (text transcribe)
            ↓
get_path_messages() reads ivr2:2:2 (phone numbers)
            ↓
transcribe_hebrew(phone_audio) → digits
            ↓
Mode 1: send_recording_to_whatsapp(..., '1')
  → Direct WAV file as audio message
         
Mode 2: transcribe_hebrew(message_audio)
  → Show TTS confirmation: "ההודעה המתומללת היא: TEXT"
  → Wait for confirmation: 1 (send) or 2 (retry)
  → send as text message with 🎙️ emoji
            ↓
Delete processed files from Yemot
            ↓
Mark sent_recordings [uid]
```

#### **Path B: Recorded Name (contact lookup)**
```
Caller: [records name] → system matches contact from contacts.json
            ↓
[records message]
            ↓
resolve_recipient_from_voice(name_audio)
  1. Try name match (fuzzy) in contacts.json
  2. If digits detected → use as phone
            ↓
send_recording_to_whatsapp(message_audio)
  → WAV file as audio message
            ↓
Mark sent_recordings [uid]
```

### **AI Command Flow (Free Voice Commands)**
```
Caller: [records free-form Hebrew command]
            ↓
ivr2:2:3 detects WAV file
            ↓
transcribe_hebrew() → command_text
            ↓
ask_ai(command_text, contacts, recent_messages)
  → Groq API (LLM): parse intent
  → Extract: action (send/read/none), chat_id, message/contact
            ↓
handle_ai_command():
  - action=send:      send_message(chat_id, message)
  - action=read_last: find & read latest from contact
  - action=none:      explain error
            ↓
Upload response_text as TTS to ivr2:2:3:result
            ↓
Yemot plays response to caller
```

### **Phone Reset Flow (Optional)**
```
Caller dials ivr2:5 (reset extension) or app sends #נשמע to OWN_CHAT_ID
            ↓
check_phone_reset() or RESET_KEYWORD detected
            ↓
clear_new_folder(token) → DELETE ivr2:1/*
            ↓
Wait 1 sec, verify empty
            ↓
POST TTS prompt to ivr2:5
            ↓
Reset state: unheard_ids = []
            ↓
Log success/warning
```

---

## 🛠️ API Reference

### **Green API (WhatsApp)**
| Method | Endpoint |
|--------|----------|
| GET | `/waInstance{ID}/receiveNotification/{TOKEN}` |
| DELETE | `/waInstance{ID}/deleteNotification/{TOKEN}/{RID}` |
| POST | `/waInstance{ID}/sendMessage/{TOKEN}` |
| POST | `/waInstance{ID}/sendFileByUpload/{TOKEN}` |
| GET | `/waInstance{ID}/lastIncomingMessages/{TOKEN}` |
| GET | `/waInstance{ID}/lastOutgoingMessages/{TOKEN}` |
| POST | `/waInstance{ID}/getContactInfo/{TOKEN}` |

### **Yemot (IVR)**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/Login` | Authenticate |
| POST | `/api/UploadFile` | Upload TTS / WAV / media |
| GET | `/api/DownloadFile` | Download recording |
| GET | `/api/GetIVR2Dir` | List extension files |
| GET | `/api/FileAction?action=delete` | Delete file |
| GET | `/api/UpdateExtension` | Set extension config |
| GET | `/api/GetTextFile` | Read TTS prompt text |
| GET | `/api/RunTzintuk` | Trigger free alert |

### **Groq LLM (AI)**
| Method | Endpoint |
|--------|----------|
| POST | `/openai/v1/chat/completions` |

---

## 📊 State Management

**state.json** במאגר = מצב עקיבות:

```json
{
  "uploaded_ids": ["id1", "id2", ...],      // הודעות שכבר העלו לYemot
  "unheard_ids": ["id3", "id4", ...],       // חדשות שעדיין לא נשמעו (מבחינה נשמע)
  "sent_recordings": ["uid1", "uid2", ...], // הקלטות שכבר נשלחו ל-WA
  "last_messages": [{...}, {...}],           // 50 הודעות אחרונות (AI context)
  "_sha": "abc123..."                        // Git blob SHA (internal)
}
```

- **last 1000** uploaded_ids שמורים (מניעה זיכרון אינסופי)
- **last 50** messages לשימוש קונטקסט AI
- **last 500** recordings שנשלחו

---

## ✅ טיפול שגיאות

| שגיאה | גורם | פתרון |
|-------|------|-------|
| `GREEN_API_INSTANCE_ID missing` | סביבה | בדוק `.env` / Secrets |
| `YEMOT token expired` | זמן | מחבר מחדש בכל ריצה |
| `ffmpeg not found` | System | `apt-get install ffmpeg` |
| `Whisper model too large` | RAM | `WhisperModel(..., device='cpu', compute_type='int8')` |
| `Groq rate limit` | API | הודעה "לא הצלחתי להבין" |
| `State SHA mismatch` | Git | עדכון קובץ בעצמך → rerun |

---

## 🧪 דוגמה שימוש

### **1️⃣ שידור הודעה (WA → Phone)**
```
User sends on WhatsApp: "שלום מעובד הצי!"
                      ↓
main.py detects
                      ↓
TTS: "מעובד הצי: שלום מעובד הצי!"
                      ↓
Caller hears on Yemot
```

### **2️⃣ הקלטה למספר (Phone → WA)**
```
Caller: [dials *2, records "050-123-4567"]
        [presses 1 - voice mode]
        [records message: "בחור, תעדכן אותי"]
                      ↓
Transcribed: "050-123-4567"
             Mode: voice
                      ↓
Recipient gets WA audio message + "📞 הודעה קולית לך מהקו"
```

### **3️⃣ AI Command**
```
Caller: [records] "תשלח לדן מה נשמע בחברה"
                      ↓
Transcribed: "תשלח לדן מה נשמע בחברה"
             Groq: {action: "send", chat_id: "972...", message: "מה נשמע בחברה"}
                      ↓
Dan gets message on WA: "🤖 מה נשמע בחברה"
                      ↓
TTS reply: "ההודעה נשלחה: מה נשמע בחברה"
```

---

## 📝 License

פתוח לשימוש אישי. תשמרו על attribution אם משדרים/מדווחים.

---

## 🤝 תרומות

Issues ו-PRs welcome! Especially:
- [ ] תמלול מדויק יותר (שיפור Whisper)
- [ ] תמיכה בקבוצות מיוחדות
- [ ] Webhook ישיר (במקום polling)
- [ ] ממשק ניהול UI

---

## 🔗 Links

- **Green API Docs:** https://greenapi.com/
- **Yemot API:** https://www.call2all.co.il/ym/api/
- **Groq Console:** https://console.groq.com/
- **Whisper:** https://github.com/openai/whisper
- **GitHub Actions:** https://docs.github.com/en/actions
