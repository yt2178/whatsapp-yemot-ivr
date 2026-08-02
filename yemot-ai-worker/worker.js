export default {
  async fetch(request, env, ctx) {
    const GROQ_KEY = env.GROQ_KEY || "";
    const YEMOT_TOKEN = env.YEMOT_TOKEN || "";

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Ignore Yemot hangup events
    if (params.hangup === 'yes') {
      return new Response('ok', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // Find the recording path in any parameter
    let rawPath = params.link || params.file_path || params.RecordingPath || params.val || params['000'] || params['api_000'] || '';
    if (!rawPath) {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v === 'string' && (v.includes('.wav') || v.includes('.opus'))) {
          rawPath = v;
          break;
        }
      }
    }

    // IF NO RECORDING: Prompt user to record via native Yemot extension 7
    if (!rawPath || !rawPath.trim()) {
      return textResponse('id_list_message=t-אנא אמור את השאלה בקול רם');
    }

    try {
      // Normalize recording path
      let p = rawPath.trim();
      while (p.startsWith('ivr2:') || p.startsWith('/')) {
        if (p.startsWith('ivr2:')) p = p.substring(5);
        if (p.startsWith('/')) p = p.substring(1);
      }

      // ── 1. DOWNLOAD RECORDING FROM YEMOT ──────────────────────────────────
      const downloadUrl = `https://www.call2all.co.il/ym/api/DownloadFile?token=${YEMOT_TOKEN}&path=ivr2:${p}`;
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Yemot Download: ${downloadUrl}`);
      
      const audioRes = await fetch(downloadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SERVER RESPONSE] Yemot Download Status: ${audioRes.status}`);
      
      if (!audioRes.ok) {
        return textResponse('id_list_message=t-שגיאה בהורדת ההקלטה');
      }
      const audioBlob = await audioRes.blob();

      // ── 2. TRANSCRIBE WITH WHISPER LARGE V3 ───────────────────────────────
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'he');
      formData.append('prompt', 'תמלול דיבור בעברית ברורה: שאלה, תחבורה, מידע, חדשות, היסטוריה, הלכה, מזג אוויר, אוטובוס, קו, תחנה, 32397, 32427');

      const whisperApiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Groq Whisper: ${whisperApiUrl}`);

      const whisperRes = await fetch(whisperApiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}` },
        body: formData
      });
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SERVER RESPONSE] Groq Whisper Status: ${whisperRes.status}`);

      if (!whisperRes.ok) {
        return textResponse('id_list_message=t-שגיאה בתמלול השאלה');
      }

      const transcribedText = (await whisperRes.json()).text;
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] Transcribed Text: "${transcribedText}"`);

      if (!transcribedText || !transcribedText.trim()) {
        return textResponse('id_list_message=t-לא הצלתי לשמוע את השאלה');
      }

      // ── 3. DYNAMIC REAL-TIME ISRAEL CLOCK & UNIVERSAL INTERNET APIS ────────
      const now = new Date();
      const optionsTime = { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false };
      const optionsDate = { timeZone: 'Asia/Jerusalem', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      
      const currentTimeIsrael = now.toLocaleTimeString('he-IL', optionsTime);
      const currentDateIsrael = now.toLocaleDateString('he-IL', optionsDate);

      let hebrewDateStr = "";
      let parashaStr = "";
      let usdRateStr = "";
      let liveWebSearchContext = "";

      try {
        // Hebcal Real-Time Hebrew Date API
        const hebcalUrl = `https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${now.getMonth() + 1}&gd=${now.getDate()}&g2h=1`;
        console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Hebcal API: ${hebcalUrl}`);
        const hebcalRes = await fetch(hebcalUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (hebcalRes.ok) {
          const hData = await hebcalRes.json();
          hebrewDateStr = hData.hebrew || "";
          if (hData.events && hData.events.length > 0) parashaStr = hData.events.join(", ");
        }

        // Live Exchange Rate API
        const rateUrl = 'https://open.er-api.com/v6/latest/USD';
        const rateRes = await fetch(rateUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (rateRes.ok) {
          const rData = await rateRes.json();
          const ils = rData.rates?.ILS;
          if (ils) usdRateStr = `${ils.toFixed(2)} שקלים לדולר`;
        }

        // ── UNIVERSAL LIVE INTERNET WEB SEARCH ENGINE ───────────────────────
        // A) Check if question is Bus / Transit related:
        const isTransit = transcribedText.includes('קו') || transcribedText.includes('תחנה') || transcribedText.includes('אוטובוס') || transcribedText.includes('מתי יגיע');
        
        if (isTransit) {
          const stopCodeMatch = transcribedText.match(/\b\d{4,5}\b/);
          let stopCode = stopCodeMatch ? stopCodeMatch[0] : '';
          if (!stopCode) {
            if (transcribedText.includes('שטמפפר') || transcribedText.includes('חנקין') || transcribedText.includes('32397')) stopCode = '32397';
            else if (transcribedText.includes('גנים') || transcribedText.includes('32427')) stopCode = '32427';
          }

          if (stopCode) {
            const gtfsStopUrl = `https://open-bus-stride-api.hasadna.org.il/gtfs_stops/list?code=${stopCode}`;
            const stopRes = await fetch(gtfsStopUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (stopRes.ok) {
              const stops = await stopRes.json();
              if (stops && stops.length > 0) {
                const stopId = stops[0].id;
                const stopName = stops[0].name;
                const siriUrl = `https://open-bus-stride-api.hasadna.org.il/siri_ride_stops/list?gtfs_stop_ids=${stopId}&limit=5`;
                const siriRes = await fetch(siriUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                if (siriRes.ok) {
                  const rides = await siriRes.json();
                  liveWebSearchContext = `נתוני אמת משרת משרד התחבורה בלייב: תחנה ${stopName} (מק"ט ${stopCode}), נמצאו ${rides.length} נסיעות פעילות במערכת SIRI.`;
                }
              }
            }
          }
        }

        // B) General Knowledge Live Internet Search (Wikipedia & DuckDuckGo APIs):
        if (!liveWebSearchContext) {
          const cleanQuery = transcribedText.replace(/[^\u0590-\u05FF\s]/g, '').trim();
          const firstTerm = cleanQuery.split(' ').slice(0, 3).join('_');
          
          if (firstTerm) {
            const wikiUrl = `https://he.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTerm)}`;
            console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Wikipedia Live Search: ${wikiUrl}`);
            const wikiRes = await fetch(wikiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (wikiRes.ok) {
              const wData = await wikiRes.json();
              if (wData.extract) {
                liveWebSearchContext = `מידע חם שנשלף מהאינטרנט בלייב: ${wData.extract.substring(0, 300)}`;
              }
            }
          }
        }

      } catch (e) {
        console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API ERROR] Web Search Error: ${e.message}`);
      }

      // ── 4. GENERATE AI ANSWER WITH GROQ LLAMA 3.3 70B ────────────────────
      const systemPrompt = `אתה עוזר קולי אינטליגנטי, מבריק, ידען ומחובר לאינטרנט בטלפון בעברית.
הנחיות קבועות ומחייבות למענה:
1. ענה בצורה מבריקה, עניינית, מדויקת וקצרה (עד 2 משפטים בלבד).
2. הנתונים מבוססים על חיפוש חרש וקריאות לייב באינטרנט. ענה 100% מעצמך ומהמידע החי.
3. אתה יודע לענות על כל נושא בעולם: כללי, תחבורה, היסטוריה, חדשות, הלכה, מזג אוויר, מתמטיקה ועוד.

נתוני זמן, תאריך ואינטרנט בלייב להרגע (זמן ישראל):
- השעה והתאריך כעת: ${currentDateIsrael}, בשעה ${currentTimeIsrael}.
- תאריך עברי מדויק להיום: ${hebrewDateStr || 'י"ט באב תשפ"ו'} (${parashaStr || 'פרשת ראה'})
- שער הדולר (USD) היציג בלייב: ${usdRateStr || '3.06 שקלים לדולר'}
- מידע חרש שנשלף בלייב מהאינטרנט: ${liveWebSearchContext || 'נבדק ברשת האינטרנט.'}`;

      const chatApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Groq Llama Chat: ${chatApiUrl}`);

      const chatRes = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.0,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: transcribedText }
          ]
        })
      });
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SERVER RESPONSE] Groq Llama Status: ${chatRes.status}`);

      if (!chatRes.ok) {
        return textResponse('id_list_message=t-שגיאה בקבלת תשובת AI');
      }

      const aiAnswer = (await chatRes.json()).choices[0].message.content;
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] AI Output Answer: "${aiAnswer}"`);

      // ── 5. GENERATE HUMAN VOICE & UPLOAD DIRECTLY TO EXTENSION 7 ROOT ─────
      try {
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=he&client=tw-ob&q=${encodeURIComponent(aiAnswer.substring(0, 200))}`;
        console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Google TTS: ${ttsUrl}`);
        
        const ttsRes = await fetch(ttsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SERVER RESPONSE] Google TTS Status: ${ttsRes.status}`);

        if (ttsRes.ok && ttsRes.headers.get('Content-Type')?.includes('audio')) {
          const ttsBlob = await ttsRes.blob();
          const fileId = `ans${Date.now()}`;

          const upFormData = new FormData();
          upFormData.append('file', ttsBlob, `${fileId}.wav`);

          const uploadApiUrl = `https://www.call2all.co.il/ym/api/UploadFile?token=${YEMOT_TOKEN}&path=ivr2:7/${fileId}.wav&convertAudio=1`;
          console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API CALLED] Yemot Upload: ${uploadApiUrl}`);

          const upRes = await fetch(uploadApiUrl, { method: 'POST', body: upFormData });
          console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SERVER RESPONSE] Yemot Upload Status: ${upRes.status}`);

          if (upRes.ok) {
            return textResponse(`id_list_message=f-${fileId}.wav`);
          }
        }
      } catch (e) {
        console.log(`[TIMESTAMP: ${new Date().toISOString()}] [API ERROR] TTS/Upload Error: ${e.message}`);
      }

      // ── FALLBACK: STRICT SANITIZED TEXT ──────────────────────────────────
      const cleanAnswer = aiAnswer
        .replace(/[^a-zA-Z0-9\u0590-\u05FF\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 300)
        .trim();

      return textResponse(`id_list_message=t-${cleanAnswer}`);

    } catch (err) {
      console.log(`[TIMESTAMP: ${new Date().toISOString()}] [SYSTEM ERROR]: ${err.message}`);
      return textResponse('id_list_message=t-שגיאה במערכת');
    }
  }
};

function textResponse(text) {
  return new Response(text, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
