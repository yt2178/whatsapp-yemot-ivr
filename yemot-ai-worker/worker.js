var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// work/active-worker.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function needsWebSearch(text) {
  const q = String(text || "").toLowerCase();
  const clock = /(?:מה השעה|מה התאריך|איזה תאריך|תאריך עברי|איזה יום היום)/.test(q);
  const explicit = /(?:חפש|תחפש|תבדוק|בדוק).{0,24}(?:אינטרנט|רשת|גוגל)|(?:אינטרנט|רשת|גוגל).{0,24}(?:חפש|תחפש|תבדוק|בדוק)/.test(q);
  if (clock && !explicit) return false;
  const rates = /(?:שער|דולר|אירו|מ\u05d8בע|חליפין)/.test(q);
  if (rates && !explicit) return false;
  return explicit || /(?:היום|עכשיו|כרגע|עדכני|עדכנית|חדשות|מחיר|שער|דולר|אירו|מזג|תוצאה|לוח זמנים|טיסה|רכבת|אוטובוס|מי ראש|מי הנשיא)/.test(q);
}
__name(needsWebSearch, "needsWebSearch");
function verifiedSearchUsed(message) {
  return Boolean(message && (Array.isArray(message.executed_tools) && message.executed_tools.length || Array.isArray(message.citations) && message.citations.length));
}
__name(verifiedSearchUsed, "verifiedSearchUsed");
function speakTimeNumber(n) {
  const units = ["\u05D0\u05E4\u05E1", "\u05D0\u05D7\u05EA", "\u05E9\u05EA\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9", "\u05D0\u05E8\u05D1\u05E2", "\u05D7\u05DE\u05E9", "\u05E9\u05E9", "\u05E9\u05D1\u05E2", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2"];
  const teens = ["\u05E2\u05E9\u05E8", "\u05D0\u05D7\u05EA \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05EA\u05D9\u05DD \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05DC\u05D5\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05D0\u05E8\u05D1\u05E2 \u05E2\u05E9\u05E8\u05D4", "\u05D7\u05DE\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05D1\u05E2 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05DE\u05D5\u05E0\u05D4 \u05E2\u05E9\u05E8\u05D4", "\u05EA\u05E9\u05E2 \u05E2\u05E9\u05E8\u05D4"];
  if (n < 10) return units[n] || String(n);
  if (n < 20) return teens[n - 10];
  const tens = { 20: "\u05E2\u05E9\u05E8\u05D9\u05DD", 30: "\u05E9\u05DC\u05D5\u05E9\u05D9\u05DD", 40: "\u05D0\u05E8\u05D1\u05E2\u05D9\u05DD", 50: "\u05D7\u05DE\u05D9\u05E9\u05D9\u05DD" };
  if (tens[n]) return tens[n];
  const base = Math.floor(n / 10) * 10;
  return tens[base] ? `${tens[base]} \u05D5${units[n - base]}` : String(n);
}
__name(speakTimeNumber, "speakTimeNumber");
function makePhoneFriendlyTimes(answer) {
  return String(answer || "").replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (_, hour, minute) => `${speakTimeNumber(Number(hour))}, ${speakTimeNumber(Number(minute))}`);
}
__name(makePhoneFriendlyTimes, "makePhoneFriendlyTimes");
var worker_default = {
  async fetch(request, env, ctx) {
    const GROQ_KEY = env.GROQ_KEY || "";
    const YEMOT_TOKEN = env.YEMOT_TOKEN || "";
    const url = new URL(request.url);
    if (url.pathname === "/google-chat-events") {
      return new Response(JSON.stringify({ text: "\u05D4\u05E2\u05D5\u05D6\u05E8 \u05D4\u05D8\u05DC\u05E4\u05D5\u05E0\u05D9 \u05DE\u05D7\u05D5\u05D1\u05E8. \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D4\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D5 \u05D3\u05E8\u05DA \u05D4\u05E7\u05D5." }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    const params = Object.fromEntries(url.searchParams.entries());
    if (params.hangup === "yes") {
      return new Response("ok", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    const callerPhone = params.ApiPhone || params.phone || params.Phone || "";
    logEvent("request_received", { hasRecording: Boolean(params.link || params.file_path || params.RecordingPath || params.val || params["000"] || params["api_000"]), caller: callerTail(callerPhone) });
    if (callerPhone && env.USER_MEMORY) {
      try {
        const reminderKey = `reminder_${callerPhone}`;
        const reminderRaw = await env.USER_MEMORY.get(reminderKey);
        if (reminderRaw) {
          const reminder = JSON.parse(reminderRaw);
          const now = /* @__PURE__ */ new Date();
          const reminderTime = new Date(reminder.fireAt);
          if (now >= reminderTime) {
            await env.USER_MEMORY.delete(reminderKey);
            const msg = encodeURIComponent(reminder.message || "\u05E9\u05DC\u05D5\u05DD! \u05D6\u05D5\u05D4\u05D9 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05E9\u05D1\u05D9\u05E7\u05E9\u05EA");
            await fetch(`https://www.call2all.co.il/ym/api/SendTTS?token=${YEMOT_TOKEN}&phones=${callerPhone}&message=${msg}`, { headers: { "User-Agent": "Mozilla/5.0" } });
          }
        }
      } catch (_) {
      }
    }
    let rawPath = params.link || params.file_path || params.RecordingPath || params.val || params["000"] || params["api_000"] || "";
    if (!rawPath) {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v === "string" && (v.includes(".wav") || v.includes(".opus"))) {
          rawPath = v;
          break;
        }
      }
    }
    if (!rawPath || !rawPath.trim()) {
      return textResponse("id_list_message=t-\u05D0\u05E0\u05D0 \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D4\u05E9\u05D0\u05DC\u05D4 \u05D1\u05E7\u05D5\u05DC \u05E8\u05DD");
    }
    try {
      let p = rawPath.trim();
      while (p.startsWith("ivr2:") || p.startsWith("/")) {
        if (p.startsWith("ivr2:")) p = p.substring(5);
        if (p.startsWith("/")) p = p.substring(1);
      }
      const downloadUrl = `https://www.call2all.co.il/ym/api/DownloadFile?token=${YEMOT_TOKEN}&path=ivr2:${p}`;
      logEvent("recording_download_started", { caller: callerTail(callerPhone) });
      const audioRes = await fetch(downloadUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!audioRes.ok) {
        logEvent("recording_download_failed", { status: audioRes.status });
        return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D4\u05D5\u05E8\u05D3\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4");
      }
      const audioBlob = await audioRes.blob();
      logEvent("recording_downloaded", { bytes: audioBlob.size });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-large-v3-turbo");
      formData.append("language", "he");
      formData.append("temperature", "0");
      formData.append("prompt", "\u05E9\u05D9\u05D7\u05D4 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05E7\u05D5 \u05D8\u05DC\u05E4\u05D5\u05DF. \u05DE\u05D5\u05E0\u05D7\u05D9\u05DD: \u05EA\u05D6\u05DB\u05D9\u05E8, \u05E9\u05E2\u05D4, \u05EA\u05D0\u05E8\u05D9\u05DA, \u05D3\u05D5\u05DC\u05E8, \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC, \u05E0\u05E7\u05D5\u05D3\u05D4.");
      formData.append("response_format", "verbose_json");
      const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_KEY}` },
        body: formData
      });
      if (!whisperRes.ok) {
        let errorCode = "unknown";
        try {
          errorCode = String((await whisperRes.json())?.error?.code || "unknown").slice(0, 40);
        } catch (_) {
        }
        logEvent("transcription_failed", { status: whisperRes.status, code: errorCode });
        return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05EA\u05DE\u05DC\u05D5\u05DC \u05D4\u05E9\u05D0\u05DC\u05D4");
      }
      const transcribedText = (await whisperRes.json()).text?.trim() || "";
      const chatIntent = /(?:גוגל|google|גוגול).{0,20}(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat)|(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat).{0,20}(?:גוגל|google|גוגול)|(?:^|[\s,])(?:ב)?(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat)(?=[\s,]|$)|איש\s+קשר/i.test(transcribedText);
      const emailIntent = /(?:מייל|אימייל|אימיל|email|e-mail|mail|תיבת\s*הדואר|דואר\s*נכנס)/i.test(transcribedText);
      const sendIntent = /(?:שלח|תשלח|שליחה|העבר|תעביר)/.test(transcribedText);
      logEvent("transcription_completed", { chars: transcribedText.length, chatIntent, emailIntent, sendIntent });
      if (!transcribedText) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2, \u05D0\u05E0\u05D0 \u05D3\u05D1\u05E8 \u05D1\u05E8\u05D5\u05E8 \u05D9\u05D5\u05EA\u05E8");
      const pendingChat = await getPendingChat(env, callerPhone);
      if (chatIntent || pendingChat && transcribedText.length <= 80) {
        return await handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone, pendingChat);
      }
      if (emailIntent) {
        return await handleEmail(env, GROQ_KEY, transcribedText, callerPhone);
      }
      if (sendIntent) {
        return await routeCommunication(env, GROQ_KEY, transcribedText, callerPhone);
      }
      let callerMemory = null;
      let callerName = "";
      if (callerPhone && env.USER_MEMORY) {
        try {
          const stored = await env.USER_MEMORY.get(`mem_${callerPhone}`);
          if (stored) {
            callerMemory = JSON.parse(stored);
            callerName = callerMemory.name || "";
          }
        } catch (_) {
        }
      }
      const now = /* @__PURE__ */ new Date();
      const currentTimeIsrael = now.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", hour12: false });
      const currentDateIsrael = now.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem", weekday: "long", year: "numeric", month: "long", day: "numeric" });
      let hebrewDateStr = "", parashaStr = "", usdRateStr = "", liveContext = "";
      try {
        const hebcalRes = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${now.getMonth() + 1}&gd=${now.getDate()}&g2h=1`, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (hebcalRes.ok) {
          const hd = await hebcalRes.json();
          hebrewDateStr = hd.hebrew || "";
          if (hd.events?.length) parashaStr = hd.events.join(", ");
        }
        const rateRes = await fetch("https://open.er-api.com/v6/latest/ILS", { headers: { "User-Agent": "Mozilla/5.0" } });
        if (rateRes.ok) {
          const rd = await rateRes.json();
          const usd = rd.rates?.USD ? (1 / rd.rates.USD).toFixed(2) : "3.06";
          const eur = rd.rates?.EUR ? (1 / rd.rates.EUR).toFixed(2) : "3.32";
          const gbp = rd.rates?.GBP ? (1 / rd.rates.GBP).toFixed(2) : "3.85";
          const cad = rd.rates?.CAD ? (1 / rd.rates.CAD).toFixed(2) : "2.24";
          usdRateStr = `\u05D3\u05D5\u05DC\u05E8: ${usd} \u20AA, \u05D0\u05D9\u05E8\u05D5: ${eur} \u20AA, \u05DC\u05D9\u05E9"\u05D8: ${gbp} \u20AA, \u05D3\u05D5\u05DC\u05E8 \u05E7\u05E0\u05D3\u05D9: ${cad} \u20AA`;
        }
        const isReminder = transcribedText.includes("\u05EA\u05D6\u05DB\u05D9\u05E8") || transcribedText.includes("\u05EA\u05D6\u05DB\u05E8") || transcribedText.includes("\u05EA\u05D6\u05DB\u05D9\u05E8\u05D9");
        if (isReminder && callerPhone && env.USER_MEMORY) {
          const hourMatch = transcribedText.match(/(\d{1,2})(?::(\d{2}))?/);
          const hour = hourMatch ? parseInt(hourMatch[1]) : 8;
          const minute = hourMatch?.[2] ? parseInt(hourMatch[2]) : 0;
          const isTomorrow = transcribedText.includes("\u05DE\u05D7\u05E8");
          const fireDate = /* @__PURE__ */ new Date();
          if (isTomorrow) fireDate.setDate(fireDate.getDate() + 1);
          fireDate.setHours(hour, minute, 0, 0);
          const message = transcribedText.replace(/תזכיר(י)? לי (מחר )?(ב-?\d{1,2}(:\d{2})?)?/g, "").trim() || "\u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05DE\u05DE\u05E2\u05E8\u05DB\u05EA \u05D4-AI";
          await env.USER_MEMORY.put(`reminder_${callerPhone}`, JSON.stringify({ fireAt: fireDate.toISOString(), message }), { expirationTtl: 86400 });
          liveContext = `\u05E0\u05E9\u05DE\u05E8\u05D4 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05E7\u05D5\u05DC\u05D9\u05EA \u05D0\u05D9\u05E9\u05D9\u05EA \u05E2\u05D1\u05D5\u05E8 \u05D4\u05DE\u05EA\u05E7\u05E9\u05E8 ${callerPhone} \u05D1\u05E9\u05E2\u05D4 ${hour}:${minute < 10 ? "0" + minute : minute}${isTomorrow ? " \u05DE\u05D7\u05E8" : " \u05D4\u05D9\u05D5\u05DD"}: "${message}"`;
        }
        const nameMatch = transcribedText.match(/(?:שמי|קוראים לי|אני)\s+([\u0590-\u05FF]+)/);
        if (nameMatch && callerPhone && env.USER_MEMORY) {
          const newName = nameMatch[1];
          const mem = callerMemory || {};
          mem.name = newName;
          mem.lastSeen = now.toISOString();
          await env.USER_MEMORY.put(`mem_${callerPhone}`, JSON.stringify(mem), { expirationTtl: 2592e3 });
          liveContext = `\u05E9\u05DE\u05E8\u05EA\u05D9 \u05D0\u05EA \u05E9\u05DE\u05DA \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA: ${newName}. \u05D1\u05E4\u05E2\u05DD \u05D4\u05D1\u05D0\u05D4 \u05E9\u05EA\u05EA\u05E7\u05E9\u05E8, \u05D0\u05D3\u05E2 \u05E9\u05D0\u05EA\u05D4 ${newName}!`;
        }
        if (!liveContext && (transcribedText.includes("\u05D6\u05DE\u05E0\u05D9") || transcribedText.includes("\u05E9\u05E7\u05D9\u05E2\u05D4") || transcribedText.includes("\u05D6\u05E8\u05D9\u05D7\u05D4") || transcribedText.includes("\u05E9\u05D7\u05E8\u05D9\u05EA") || transcribedText.includes("\u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2") || transcribedText.includes("\u05DE\u05E0\u05D7\u05D4") || transcribedText.includes("\u05E2\u05E8\u05D1\u05D9\u05EA"))) {
          const cityCode = transcribedText.includes("\u05D7\u05D9\u05E4\u05D4") ? "IL-Haifa" : transcribedText.includes("\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1") ? "IL-TelAviv" : transcribedText.includes("\u05D1\u05D9\u05EA\u05E8") ? "IL-BeitarIllit" : transcribedText.includes("\u05D1\u05E0\u05D9 \u05D1\u05E8\u05E7") ? "IL-BneiBrak" : transcribedText.includes("\u05D0\u05E9\u05D3\u05D5\u05D3") ? "IL-Ashdod" : transcribedText.includes("\u05D1\u05D0\u05E8 \u05E9\u05D1\u05E2") ? "IL-Beersheba" : "IL-Jerusalem";
          const zRes = await fetch(`https://www.hebcal.com/zmanim?cfg=json&city=${cityCode}`, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (zRes.ok) {
            const zm = (await zRes.json()).times;
            liveContext = `\u05D6\u05DE\u05E0\u05D9 \u05D4\u05D9\u05D5\u05DD \u05D1\u05D4\u05DC\u05DB\u05D4: \u05E2\u05DC\u05D5\u05EA \u05D4\u05E9\u05D7\u05E8 ${zm.alotHaShachar?.substring(11, 16)}, \u05D6\u05E8\u05D9\u05D7\u05D4 ${zm.sunrise?.substring(11, 16)}, \u05E1\u05D5\u05E3 \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2 ${zm.sofZmanShma?.substring(11, 16)}, \u05D7\u05E6\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD ${zm.chatzot?.substring(11, 16)}, \u05DE\u05E0\u05D7\u05D4 \u05D2\u05D3\u05D5\u05DC\u05D4 ${zm.minchaGedola?.substring(11, 16)}, \u05E9\u05E7\u05D9\u05E2\u05D4 ${zm.sunset?.substring(11, 16)}`;
          }
        }
      } catch (_) {
      }
      const systemPrompt = `\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05E2\u05D5\u05E0\u05D4 \u05E7\u05E6\u05E8, \u05D1\u05E8\u05D5\u05E8 \u05D5\u05EA\u05DE\u05E6\u05D9\u05EA\u05D9. \u05EA\u05E9\u05D5\u05D1\u05D4 \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9\u05EA 3 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD. \u05D0\u05DC \u05EA\u05D0\u05E8\u05D9\u05DA. \u05D0\u05DC \u05EA\u05E1\u05D1\u05D9\u05E8 \u05DE\u05D4 \u05D0\u05EA\u05D4 \u05E2\u05D5\u05E9\u05D4, \u05E8\u05E7 \u05E2\u05E0\u05D4 \u05D9\u05E9\u05D9\u05E8\u05D5\u05EA. \u05D0\u05DD \u05E9\u05D5\u05D0\u05DC\u05D9\u05DD \u05DE\u05D9 \u05D0\u05EA\u05D4, \u05E2\u05E0\u05D4: \u05D0\u05E0\u05D9 \u05D4\u05E2\u05D5\u05D6\u05E8 \u05D4\u05D7\u05DB\u05DD \u05E9\u05DC\u05DA. \u05E2\u05E0\u05D4 \u05EA\u05DE\u05D9\u05D3 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05E4\u05E9\u05D5\u05D8\u05D4 \u05D5\u05D1\u05E8\u05D5\u05E8\u05D4. \u05D0\u05DC \u05EA\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA.
\u05D4\u05E9\u05E2\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5 ${currentTimeIsrael}, \u05D4\u05EA\u05D0\u05E8\u05D9\u05DA ${currentDateIsrael}${hebrewDateStr ? ", " + hebrewDateStr : ""}${parashaStr ? ", " + parashaStr : ""}${usdRateStr ? ". \u05E9\u05E2\u05E8\u05D9 \u05D7\u05DC\u05D9\u05E4\u05D9\u05DF: " + usdRateStr : ""}${callerName ? ". \u05D4\u05DE\u05EA\u05E7\u05E9\u05E8 \u05E0\u05E7\u05E8\u05D0 " + callerName : ""}${liveContext ? ". \u05DE\u05D9\u05D3\u05E2 \u05E0\u05D5\u05E1\u05E3: " + liveContext : ""}`;
      const useWebSearch = needsWebSearch(transcribedText);
      const models = useWebSearch ? ["groq/compound"] : ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
      let chatRes = null;
      let aiAnswer = "";
      let webVerified = !useWebSearch;
      for (const mdl of models) {
        try {
          chatRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: mdl,
              temperature: 0,
              max_tokens: 300,
              reasoning_effort: "low",
              ...useWebSearch ? { citation_options: "enabled" } : {},
              messages: [{ role: "system", content: `${systemPrompt}${useWebSearch ? "\n\u05D6\u05D5 \u05E9\u05D0\u05DC\u05D4 \u05E9\u05D3\u05D5\u05E8\u05E9\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9. \u05D7\u05E4\u05E9 \u05D1\u05E8\u05E9\u05EA \u05DC\u05E4\u05E0\u05D9 \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4. \u05E2\u05E0\u05D4 \u05E8\u05E7 \u05DC\u05E4\u05D9 \u05DE\u05E7\u05D5\u05E8\u05D5\u05EA \u05E9\u05DE\u05E6\u05D0\u05EA; \u05D0\u05DD \u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E7\u05D5\u05E8\u05D5\u05EA, \u05D0\u05DE\u05D5\u05E8 \u05E9\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA \u05DC\u05D0\u05DE\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9." : ""}` }, { role: "user", content: transcribedText }]
            })
          });
          if (chatRes.ok) {
            const completion = await chatRes.json();
            const message = completion.choices?.[0]?.message || {};
            aiAnswer = message.content || "";
            webVerified = !useWebSearch || verifiedSearchUsed(message);
            if (aiAnswer.trim() && webVerified) {
              logEvent("model_answered", { model: mdl, webSearch: useWebSearch, webVerified });
              if (useWebSearch) logEvent("web_search_verified", { sources: (message.citations || []).length });
              break;
            }
          }
          logEvent("model_failed", { model: mdl, status: chatRes?.status || 0 });
        } catch (e) {
          logEvent("model_error", { model: mdl, type: e?.name || "Error" });
        }
      }
      if (useWebSearch && !webVerified) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D0\u05DE\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9 \u05D1\u05E8\u05E9\u05EA, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05DB\u05DE\u05D4 \u05D3\u05E7\u05D5\u05EA");
      if (!aiAnswer.trim()) return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D1\u05DC\u05EA \u05EA\u05E9\u05D5\u05D1\u05EA AI, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      logEvent("answer_ready", { chars: aiAnswer.length });
      if (callerPhone && env.USER_MEMORY) {
        try {
          const mem = callerMemory || {};
          mem.lastSeen = now.toISOString();
          await env.USER_MEMORY.put(`mem_${callerPhone}`, JSON.stringify(mem), { expirationTtl: 2592e3 });
        } catch (_) {
        }
      }
      const cleanAnswer = makePhoneFriendlyTimes(aiAnswer).replace(/<\/?think>/gi, "").replace(/[\r\n]+/g, " ").replace(/[.\u2024\u2026]+/g, ", ").replace(/[-\u2010-\u2015]+/g, " ").replace(/[&=#%+]/g, " ").replace(/[^a-zA-Z0-9\u0590-\u05FF\s,?!;:]/g, "").replace(/\s+/g, " ").replace(/,+/g, ",").substring(0, 450).trim().replace(/^[,;:!?\s]+|[,;:\s]+$/g, "");
      if (!cleanAnswer) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05EA\u05E7\u05D9\u05E0\u05D4, \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1");
      return textResponse(`id_list_message=t-${cleanAnswer}`);
    } catch (err) {
      logEvent("system_error", { type: err?.name || "Error" });
      return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA");
    }
  }
};
function textResponse(text) {
  return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(textResponse, "textResponse");
__name2(textResponse, "textResponse");
function logEvent(event, details = {}) {
  const safe = { event, at: (/* @__PURE__ */ new Date()).toISOString() };
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === "string") safe[key] = value.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 80);
    else if (typeof value === "number" || typeof value === "boolean") safe[key] = value;
  }
  console.log(JSON.stringify(safe));
}
__name(logEvent, "logEvent");
__name2(logEvent, "logEvent");
function callerTail(phone) {
  const normalized = normalizeIsraelPhone(phone);
  return normalized ? `phone_${normalized.slice(-4)}` : "missing";
}
__name(callerTail, "callerTail");
__name2(callerTail, "callerTail");
var BRIDGE_URL = "https://script.google.com/macros/s/AKfycbyxunjICEfNwuvhQNlf7nBJTEJ65IJFLC2dNUjf5TDb4aiGQPRX7cQ0w1RjymEoNhwYzQ/exec";
async function callBridge(env, payload) {
  const res = await fetch(BRIDGE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, auth: env.GMAIL_BRIDGE_SECRET || "" })
  });
  return await res.json().catch(() => ({ ok: false, error: "bridge_unreachable" }));
}
__name(callBridge, "callBridge");
__name2(callBridge, "callBridge");
async function kvGetList(env, key) {
  try {
    const v = await env.USER_MEMORY.get(key);
    return v ? JSON.parse(v) : null;
  } catch (_) {
    return null;
  }
}
__name(kvGetList, "kvGetList");
__name2(kvGetList, "kvGetList");
async function kvSetList(env, key, val) {
  try {
    await env.USER_MEMORY.put(key, JSON.stringify(val), { expirationTtl: 600 });
  } catch (_) {
  }
}
__name(kvSetList, "kvSetList");
__name2(kvSetList, "kvSetList");
function contactStorageKey(callerPhone) {
  return "chat_contacts_" + normalizeIsraelPhone(callerPhone);
}
__name(contactStorageKey, "contactStorageKey");
__name2(contactStorageKey, "contactStorageKey");
function pendingChatStorageKey(callerPhone) {
  return "pending_chat_" + normalizeIsraelPhone(callerPhone);
}
__name(pendingChatStorageKey, "pendingChatStorageKey");
__name2(pendingChatStorageKey, "pendingChatStorageKey");
function normalizeContactTerm(value) {
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}
__name(normalizeContactTerm, "normalizeContactTerm");
__name2(normalizeContactTerm, "normalizeContactTerm");
async function getContacts(env, callerPhone) {
  const stored = await kvGetList(env, contactStorageKey(callerPhone));
  return Array.isArray(stored) ? stored.filter((contact) => contact && contact.name && contact.address) : [];
}
__name(getContacts, "getContacts");
__name2(getContacts, "getContacts");
async function putContacts(env, callerPhone, contacts) {
  if (!env.USER_MEMORY) return false;
  try {
    await env.USER_MEMORY.put(contactStorageKey(callerPhone), JSON.stringify(contacts));
    return true;
  } catch (_) {
    return false;
  }
}
__name(putContacts, "putContacts");
__name2(putContacts, "putContacts");
function findContactMatches(contacts, requestedName) {
  const wanted = normalizeContactTerm(requestedName);
  if (!wanted) return [];
  const exact = contacts.filter((contact) => [contact.name, ...contact.aliases || []].some((value) => normalizeContactTerm(value) === wanted));
  if (exact.length) return exact;
  return contacts.filter((contact) => [contact.name, ...contact.aliases || []].some((value) => normalizeContactTerm(value).includes(wanted) || wanted.includes(normalizeContactTerm(value))));
}
__name(findContactMatches, "findContactMatches");
__name2(findContactMatches, "findContactMatches");
async function saveContact(env, callerPhone, name, address, aliases) {
  const contacts = await getContacts(env, callerPhone);
  const normalizedAliases = Array.isArray(aliases) ? aliases.map((alias) => String(alias || "").trim()).filter(Boolean).slice(0, 8) : [];
  const contact = { id: crypto.randomUUID(), name: String(name || "").trim().slice(0, 80), address, aliases: normalizedAliases };
  const oldIndex = contacts.findIndex((item) => item.address.toLowerCase() === address.toLowerCase() || normalizeContactTerm(item.name) === normalizeContactTerm(contact.name));
  if (oldIndex >= 0) contacts[oldIndex] = { ...contacts[oldIndex], ...contact, id: contacts[oldIndex].id };
  else contacts.push(contact);
  return await putContacts(env, callerPhone, contacts);
}
__name(saveContact, "saveContact");
__name2(saveContact, "saveContact");
async function getPendingChat(env, callerPhone) {
  return await kvGetList(env, pendingChatStorageKey(callerPhone));
}
__name(getPendingChat, "getPendingChat");
__name2(getPendingChat, "getPendingChat");
async function setPendingChat(env, callerPhone, value) {
  await kvSetList(env, pendingChatStorageKey(callerPhone), value);
}
__name(setPendingChat, "setPendingChat");
__name2(setPendingChat, "setPendingChat");
async function clearPendingChat(env, callerPhone) {
  try {
    await env.USER_MEMORY.delete(pendingChatStorageKey(callerPhone));
  } catch (_) {
  }
}
__name(clearPendingChat, "clearPendingChat");
__name2(clearPendingChat, "clearPendingChat");
function contactChoiceNames(contacts) {
  return contacts.map((contact) => contact.name).slice(0, 4).join(" \u05D0\u05D5 ");
}
__name(contactChoiceNames, "contactChoiceNames");
__name2(contactChoiceNames, "contactChoiceNames");
async function groqChatShort(GROQ_KEY, systemPrompt, userText, maxTokens) {
  const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
  for (const mdl of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: mdl, temperature: 0, max_tokens: maxTokens, reasoning_effort: "low", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userText }] })
      });
      if (!res.ok) continue;
      const content = (await res.json()).choices[0].message.content || "";
      if (content.trim()) return content.trim();
    } catch (_) {
    }
  }
  return "";
}
__name(groqChatShort, "groqChatShort");
__name2(groqChatShort, "groqChatShort");
function cleanFromName(from) {
  const s = String(from || "");
  const name = s.split("<")[0].replace(/["']/g, "").trim();
  return (name || s).slice(0, 60);
}
__name(cleanFromName, "cleanFromName");
__name2(cleanFromName, "cleanFromName");
function fmtEmailList(msgs) {
  if (!msgs || !msgs.length) return "\u05D0\u05D9\u05DF \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD \u05D1\u05EA\u05D9\u05D1\u05D4";
  const parts = msgs.map((m, i) => `\u05DE\u05D9\u05D9\u05DC ${i + 1}, \u05DE\u05D0\u05EA ${cleanFromName(m.from)}, \u05D1\u05E0\u05D5\u05E9\u05D0 ${(m.subject || "\u05DC\u05DC\u05D0 \u05E0\u05D5\u05E9\u05D0").slice(0, 60)}`);
  return `\u05D9\u05E9 \u05DC\u05DA ${msgs.length} \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD. ${parts.join(". ")}. \u05DC\u05D4\u05E9\u05DE\u05E2\u05EA \u05DE\u05D9\u05D9\u05DC \u05D0\u05DE\u05D5\u05E8, \u05E7\u05E8\u05D0 \u05DC\u05D9 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05DE\u05E1\u05E4\u05E8...`;
}
__name(fmtEmailList, "fmtEmailList");
__name2(fmtEmailList, "fmtEmailList");
function normalizeAddress(addr) {
  return String(addr || "").trim().replace(/שטרודל/g, "@").replace(/נקודה/g, ".").replace(/\s+/g, "");
}
__name(normalizeAddress, "normalizeAddress");
__name2(normalizeAddress, "normalizeAddress");
function normalizeIsraelPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("972")) digits = "0" + digits.slice(3);
  return digits;
}
__name(normalizeIsraelPhone, "normalizeIsraelPhone");
__name2(normalizeIsraelPhone, "normalizeIsraelPhone");
async function routeCommunication(env, GROQ_KEY, transcribedText, callerPhone) {
  const routerPrompt = '\u05D0\u05EA\u05D4 \u05DE\u05DE\u05D9\u05D9\u05DF \u05D1\u05E7\u05E9\u05EA \u05EA\u05E7\u05E9\u05D5\u05E8\u05EA \u05DE\u05D4\u05D8\u05DC\u05E4\u05D5\u05DF. \u05D4\u05D7\u05D6\u05E8 JSON \u05D1\u05DC\u05D1\u05D3: {"service":"email"} \u05DB\u05E9\u05DE\u05D3\u05D5\u05D1\u05E8 \u05D1\u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D3\u05D5\u05D0\u05E8, {"service":"chat"} \u05DB\u05E9\u05DE\u05D3\u05D5\u05D1\u05E8 \u05D1\u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8, \u05E6\u05D0\u05D8 \u05D0\u05D5 \u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05D4, \u05D0\u05D5 {"service":"ask"} \u05DB\u05E9\u05D0\u05D9 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D3\u05E2\u05EA. \u05D2\u05DD \u05D0\u05DD \u05D4\u05DE\u05D9\u05DC\u05D4 \u05D4\u05D5\u05E2\u05EA\u05E7\u05D4 \u05DC\u05D0 \u05E0\u05DB\u05D5\u05DF, \u05D4\u05D1\u05DF \u05DC\u05E4\u05D9 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4.';
  const raw = await groqChatShort(GROQ_KEY, routerPrompt, transcribedText, 80);
  const matched = raw.match(/\{[\s\S]*\}/);
  let service = "ask";
  if (matched) try {
    service = JSON.parse(matched[0]).service || "ask";
  } catch (_) {
  }
  logEvent("communication_routed", { service: String(service).slice(0, 12), caller: callerTail(callerPhone) });
  if (service === "email") return await handleEmail(env, GROQ_KEY, transcribedText, callerPhone);
  if (service === "chat") return await handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone);
  return speak("\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D0\u05DD \u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D4\u05D5\u05D3\u05E2\u05EA \u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8. \u05D0\u05DE\u05D5\u05E8 \u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8 \u05D1\u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4");
}
__name(routeCommunication, "routeCommunication");
__name2(routeCommunication, "routeCommunication");
async function handleEmail(env, GROQ_KEY, transcribedText, callerPhone) {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) {
      return speak("\u05D4\u05D2\u05D9\u05E9\u05D4 \u05D4\u05D8\u05DC\u05E4\u05D5\u05E0\u05D9\u05EA \u05DC\u05DE\u05D9\u05D9\u05DC \u05E2\u05D3\u05D9\u05D9\u05DF \u05D1\u05D4\u05D2\u05D3\u05E8\u05D4, \u05D0\u05D9\u05DF \u05DB\u05E8\u05D2\u05E2 \u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05D5 \u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF");
    }
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) {
      return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
    }
    const plannerSystem = '\u05D0\u05EA\u05D4 \u05DE\u05E0\u05EA\u05E9 \u05D1\u05E7\u05E9\u05D5\u05EA \u05DE\u05D9\u05D9\u05DC \u05DC\u05E4\u05E2\u05D5\u05DC\u05D5\u05EA. \u05D4\u05D7\u05D6\u05E8 JSON \u05D1\u05DC\u05D1\u05D3 \u05D1\u05DC\u05D9 \u05D4\u05E1\u05D1\u05E8\u05D9\u05DD \u05D1\u05E4\u05D5\u05E8\u05DE\u05D8 {"action":"...","params":{}}. \u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA: {"action":"list","params":{"count":5}} \u05E8\u05E9\u05D9\u05DE\u05EA \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD. {"action":"summarize","params":{"count":5}} \u05E1\u05D9\u05DB\u05D5\u05DD \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD. {"action":"read","params":{"index":2}} \u05E7\u05E8\u05D9\u05D0\u05EA \u05DE\u05D9\u05D9\u05DC \u05DC\u05E4\u05D9 \u05DE\u05E1\u05E4\u05E8\u05D5 \u05D1\u05E8\u05E9\u05D9\u05DE\u05D4. {"action":"search","params":{"query":"..."}} \u05D7\u05D9\u05E4\u05D5\u05E9 \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD. {"action":"send","params":{"to":"...","subject":"...","body":"..."}} \u05E9\u05DC\u05D9\u05D7\u05EA \u05DE\u05D9\u05D9\u05DC \u05D7\u05D3\u05E9. {"action":"reply","params":{"index":1,"body":"..."}} \u05DE\u05E2\u05E0\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC. {"action":"forward","params":{"index":1,"to":"..."}} \u05D4\u05E2\u05D1\u05E8\u05EA \u05DE\u05D9\u05D9\u05DC. \u05D1\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05DE\u05D9\u05D9\u05DC: \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC \u05E4\u05D9\u05E8\u05D5\u05E9\u05D5 \u05E1\u05D9\u05DE\u05DF @ \u05D5\u05E0\u05E7\u05D5\u05D3\u05D4 \u05E4\u05D9\u05E8\u05D5\u05E9\u05D4 \u05E0\u05E7\u05D5\u05D3\u05D4. \u05D0\u05DD \u05D1\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DF \u05D3\u05D5\u05DE\u05D9\u05D9\u05DF \u05D4\u05D5\u05E1\u05E3 @gmail.com. \u05D0\u05DD \u05D4\u05D1\u05E7\u05E9\u05D4 \u05DC\u05D0 \u05D1\u05E8\u05D5\u05E8\u05D4 \u05D4\u05D7\u05D6\u05E8 {"action":"none"}.';
    let plan = {};
    const planRaw = await groqChatShort(GROQ_KEY, plannerSystem, transcribedText, 250);
    const jm = planRaw.match(/\{[\s\S]*\}/);
    if (jm) {
      try {
        plan = JSON.parse(jm[0]);
      } catch (_) {
      }
    }
    if (!plan.action || plan.action === "none") {
      logEvent("email_plan_unclear", { caller: callerTail(callerPhone) });
      if (/(?:שלח|תשלח|שליחה|העבר|תעביר)/.test(transcribedText)) return speak("\u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05D5\u05D0\u05EA \u05EA\u05D5\u05DB\u05DF \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4, \u05DC\u05DE\u05E9\u05DC \u05E9\u05DC\u05D7 \u05DE\u05D9\u05D9\u05DC \u05DC\u05DB\u05EA\u05D5\u05D1\u05EA, \u05E2\u05DD \u05D4\u05D5\u05D3\u05E2\u05D4");
      return speak("\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D0\u05D9\u05D6\u05D5 \u05E4\u05E2\u05D5\u05DC\u05EA \u05DE\u05D9\u05D9\u05DC \u05D1\u05E8\u05E6\u05D5\u05E0\u05DA \u05DC\u05D1\u05E6\u05E2");
    }
    const p = plan.params || {};
    logEvent("email_intent", { action: String(plan.action).slice(0, 20), caller: callerTail(callerPhone) });
    const listKey = "lastlist_" + callerPhone;
    if (plan.action === "list" || plan.action === "summarize" || plan.action === "search") {
      const payload = plan.action === "search" ? { action: "search", query: p.query || "", max: parseInt(p.count) || 5 } : { action: "list", max: Math.min(parseInt(p.count) || 5, 10) };
      const data = await callBridge(env, payload);
      if (!data.ok) {
        logEvent("email_bridge_failed", { action: plan.action });
        return speak("\u05D0\u05D9\u05DF \u05E2\u05D3\u05D9\u05D9\u05DF \u05D7\u05D9\u05D1\u05D5\u05E8 \u05E4\u05E2\u05DC \u05DC\u05DE\u05D9\u05D9\u05DC, \u05D9\u05E9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05D4\u05E8\u05E9\u05D0\u05D4");
      }
      const msgs = data.messages || [];
      await kvSetList(env, listKey, { messages: msgs, ts: Date.now() });
      if (plan.action === "summarize") {
        const digest = msgs.map((m, i) => `${i + 1}. \u05DE\u05D0\u05EA ${cleanFromName(m.from)}, \u05E0\u05D5\u05E9\u05D0 ${m.subject}: ${m.snippet || ""}`).join("\n");
        if (!digest) return speak("\u05D0\u05D9\u05DF \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05DC\u05E1\u05D9\u05DB\u05D5\u05DD");
        const ans = await groqChatShort(GROQ_KEY, "\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05E1\u05DB\u05DD \u05D0\u05EA \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D4\u05D1\u05D0\u05D4 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05E8\u05D5\u05E8\u05D4 \u05D5\u05E7\u05E6\u05E8\u05D4, \u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD 5 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD. \u05D0\u05DC \u05EA\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D0\u05D5 \u05D1\u05DE\u05E7\u05E4\u05D9\u05DD \u05D1\u05EA\u05E9\u05D5\u05D1\u05D4.", digest, 300);
        return speak(ans || fmtEmailList(msgs));
      }
      return speak(fmtEmailList(msgs));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("\u05D0\u05D9\u05DF \u05E8\u05E9\u05D9\u05DE\u05EA \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05E4\u05E2\u05D9\u05DC\u05D4, \u05D1\u05E7\u05E9 \u05E7\u05D5\u05D3\u05DD \u05D0\u05EA \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD");
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id });
      if (!data.ok) return speak("\u05D9\u05E9 \u05EA\u05E7\u05DC\u05D4 \u05D1\u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      const ans = await groqChatShort(GROQ_KEY, "\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05D4\u05E7\u05E8\u05D0 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05D4\u05D1\u05D0 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D8\u05D1\u05E2\u05D9\u05EA \u05D5\u05D1\u05E8\u05D5\u05E8\u05D4, \u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD 6 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD, \u05D1\u05DC\u05D9 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D5\u05D1\u05DC\u05D9 \u05DE\u05E7\u05E4\u05D9\u05DD. \u05DE\u05D0\u05EA " + cleanFromName(data.from) + ", \u05D1\u05E0\u05D5\u05E9\u05D0 " + (data.subject || "\u05DC\u05DC\u05D0 \u05E0\u05D5\u05E9\u05D0") + ", \u05D5\u05D4\u05EA\u05D5\u05DB\u05DF \u05D4\u05D5\u05D0: " + (data.body || "").slice(0, 1800), "\u05D4\u05E7\u05E8\u05D0 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC", 450);
      return speak(ans || "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D4\u05E7\u05E8\u05D9\u05D0 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC");
    }
    if (plan.action === "send") {
      const to = normalizeAddress(p.to);
      if (!to.includes("@") || !to.split("@")[1]) return speak("\u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC, \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC");
      if (!to.split("@")[1].includes(".")) return speak("\u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05D7\u05E1\u05E8\u05D4 \u05E1\u05D9\u05D5\u05DE\u05EA, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05D5\u05EA\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05D1\u05D9\u05E8\u05D5\u05E8");
      const data = await callBridge(env, { action: "send", to, subject: p.subject || "", body: p.body || "" });
      logEvent("email_send", { ok: Boolean(data.ok) });
      if (!data.ok) return speak("\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05E0\u05DB\u05E9\u05DC\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      return speak("\u05D4\u05DE\u05D9\u05D9\u05DC \u05E0\u05E9\u05DC\u05D7 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4");
    }
    if (plan.action === "reply" || plan.action === "forward") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("\u05D0\u05D9\u05DF \u05E8\u05E9\u05D9\u05DE\u05EA \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05E4\u05E2\u05D9\u05DC\u05D4, \u05D1\u05E7\u05E9 \u05E7\u05D5\u05D3\u05DD \u05D0\u05EA \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC\u05D9\u05DD");
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id });
      if (!data.ok) return speak("\u05D9\u05E9 \u05EA\u05E7\u05DC\u05D4 \u05D1\u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      if (plan.action === "reply") {
        const subj = (data.subject || "").startsWith("Re:") ? data.subject : "Re: " + (data.subject || "");
        const snd2 = await callBridge(env, { action: "send", to: data.fromAddr || data.from, subject: subj, body: p.body || "", inReplyTo: data.id, threadId: data.threadId });
        if (!snd2.ok) return speak("\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
        return speak("\u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05E0\u05E9\u05DC\u05D7\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4");
      }
      const to = normalizeAddress(p.to);
      if (!to.includes("@") || !to.split("@")[1]) return speak("\u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05D4\u05E2\u05D1\u05E8\u05D4, \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC");
      const fwdBody = "\u05D4\u05D5\u05D3\u05E2\u05D4 \u05E9\u05D4\u05D5\u05E2\u05D1\u05E8\u05D4 \u05D0\u05DC\u05D9\u05DA:\n" + (data.body || "").slice(0, 3e3);
      const snd = await callBridge(env, { action: "send", to, subject: "\u05D4\u05E2\u05D1\u05E8\u05D4 \u05E9\u05DC " + (data.subject || "\u05DE\u05D9\u05D9\u05DC"), body: fwdBody });
      if (!snd.ok) return speak("\u05D4\u05E2\u05D1\u05E8\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05E0\u05DB\u05E9\u05DC\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      return speak("\u05D4\u05DE\u05D9\u05D9\u05DC \u05D4\u05D5\u05E2\u05D1\u05E8 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4");
    }
    return speak("\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D0\u05EA \u05D1\u05E7\u05E9\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC");
  } catch (e) {
    logEvent("email_error", { type: e?.name || "Error" });
    return speak("\u05D9\u05E9 \u05EA\u05E7\u05DC\u05D4 \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  }
}
__name(handleEmail, "handleEmail");
__name2(handleEmail, "handleEmail");
function fmtChatList(messages) {
  if (!messages || !messages.length) return "\u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA";
  const parts = messages.slice(0, 5).map((message, index) => `\u05D4\u05D5\u05D3\u05E2\u05D4 ${index + 1}, \u05DE\u05D0\u05EA ${cleanFromName(message.sender || "\u05E9\u05D5\u05DC\u05D7 \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2")}, ${String(message.text || "\u05D4\u05D5\u05D3\u05E2\u05D4 \u05DC\u05DC\u05D0 \u05D8\u05E7\u05E1\u05D8").slice(0, 140)}`);
  return `\u05DE\u05E6\u05D0\u05EA\u05D9 ${messages.length} \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D1\u05E6\u05D0\u05D8. ${parts.join(". ")}. \u05DB\u05D3\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D0\u05DE\u05D5\u05E8 \u05E7\u05E8\u05D0 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05E1\u05E4\u05E8`;
}
__name(fmtChatList, "fmtChatList");
__name2(fmtChatList, "fmtChatList");
async function handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone, pendingChat = null) {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) return speak("\u05D4\u05D2\u05D9\u05E9\u05D4 \u05DC\u05E6\u05D0\u05D8 \u05E2\u05D3\u05D9\u05D9\u05DF \u05D1\u05D4\u05D2\u05D3\u05E8\u05D4");
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("\u05D4\u05D2\u05D9\u05E9\u05D4 \u05DC\u05E6\u05D0\u05D8 \u05DE\u05D5\u05EA\u05E8\u05EA \u05E8\u05E7 \u05DE\u05D4\u05D8\u05DC\u05E4\u05D5\u05DF \u05E9\u05DC \u05D1\u05E2\u05DC \u05D4\u05D7\u05E9\u05D1\u05D5\u05DF");
    if (pendingChat && transcribedText.length <= 80) {
      const matches = findContactMatches(pendingChat.matches || [], transcribedText);
      if (matches.length === 1) {
        const data = await callBridge(env, { action: "chat_send_text", to: matches[0].address, text: pendingChat.text || "" });
        logEvent("chat_pending_send", { ok: Boolean(data.ok) });
        if (!data.ok) return speak("\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8 \u05E0\u05DB\u05E9\u05DC\u05D4");
        await clearPendingChat(env, callerPhone);
        return speak("\u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8 \u05E0\u05E9\u05DC\u05D7\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4");
      }
      return speak(`\u05DE\u05E6\u05D0\u05EA\u05D9 \u05DB\u05DE\u05D4 \u05D0\u05E0\u05E9\u05D9 \u05E7\u05E9\u05E8 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D9\u05DD, \u05D0\u05DE\u05D5\u05E8 \u05E9\u05DD \u05DE\u05DC\u05D0: ${contactChoiceNames(pendingChat.matches || [])}`);
    }
    const planner = `\u05D0\u05EA\u05D4 \u05DE\u05E0\u05EA\u05D7 \u05D1\u05E7\u05E9\u05D5\u05EA \u05DC Google Chat. \u05D4\u05D7\u05D6\u05E8 JSON \u05D1\u05DC\u05D1\u05D3 \u05D1\u05DC\u05D9 \u05D4\u05E1\u05D1\u05E8\u05D9\u05DD \u05D1\u05E4\u05D5\u05E8\u05DE\u05D8 {"action":"...","params":{}}. \u05E4\u05E2\u05D5\u05DC\u05D5\u05EA: unread \u05DC\u05E7\u05D1\u05DC\u05EA \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA, search \u05DC\u05D7\u05D9\u05E4\u05D5\u05E9 \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05DC\u05E4\u05D9 \u05DE\u05D9\u05DC\u05D9\u05DD, read \u05DC\u05E7\u05E8\u05D9\u05D0\u05EA \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DC\u05E4\u05D9 \u05DE\u05E1\u05E4\u05E8 \u05DE\u05D4\u05E8\u05E9\u05D9\u05DE\u05D4 \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4, send_text \u05DC\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05EA \u05D8\u05E7\u05E1\u05D8, save_contact \u05DC\u05E9\u05DE\u05D9\u05E8\u05EA \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8. \u05DC\u05E9\u05DC\u05D9\u05D7\u05D4 \u05D4\u05D7\u05D6\u05E8 {"action":"send_text","params":{"to":"\u05E9\u05DD \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8, \u05DB\u05D9\u05E0\u05D5\u05D9, \u05D0\u05D5 \u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC \u05DE\u05DC\u05D0\u05D4","text":"\u05EA\u05D5\u05DB\u05DF \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4"}}. \u05DC\u05E9\u05DE\u05D9\u05E8\u05EA \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D4\u05D7\u05D6\u05E8 {"action":"save_contact","params":{"name":"\u05E9\u05DD","address":"\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC \u05DE\u05DC\u05D0\u05D4","aliases":["\u05DB\u05D9\u05E0\u05D5\u05D9"]}}. \u05D4\u05DE\u05D9\u05DC\u05D4 \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC \u05D4\u05D9\u05D0 @ \u05D5\u05E0\u05E7\u05D5\u05D3\u05D4 \u05D4\u05D9\u05D0 . \u05D0\u05D9\u05DF \u05DC\u05E0\u05D7\u05E9 \u05DB\u05EA\u05D5\u05D1\u05EA \u05D7\u05E1\u05E8\u05D4. \u05DB\u05E9\u05DE\u05D1\u05E7\u05E9\u05D9\u05DD \u05DC\u05E9\u05DC\u05D5\u05D7 \u05D4\u05D5\u05D3\u05E2\u05EA \u05E7\u05D5\u05DC \u05D0\u05D5 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05EA\u05D5\u05DE\u05DC\u05DC\u05EA, \u05D4\u05E4\u05E2\u05D5\u05DC\u05D4 \u05D4\u05D9\u05D0 send_text \u05D5\u05D4\u05D8\u05E7\u05E1\u05D8 \u05D4\u05D5\u05D0 \u05EA\u05D5\u05DB\u05DF \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4 \u05E9\u05E0\u05D0\u05DE\u05E8. \u05DB\u05E9\u05DC\u05D0 \u05D1\u05E8\u05D5\u05E8 \u05D4\u05D7\u05D6\u05E8 {"action":"none","params":{}}.`;
    let plan = {};
    const raw = await groqChatShort(GROQ_KEY, planner, transcribedText, 250);
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) try {
      plan = JSON.parse(match[0]);
    } catch (_) {
    }
    const params = plan.params || {};
    const listKey = "lastchat_" + callerPhone;
    logEvent("chat_intent", { action: String(plan.action || "none").slice(0, 30), caller: callerTail(callerPhone) });
    if (plan.action === "save_contact") {
      const name = String(params.name || "").trim();
      const address = normalizeAddress(params.address || params.to || "");
      if (!name) return speak("\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05EA \u05E9\u05DD \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8");
      if (!address.includes("@") || !address.split("@")[1]?.includes(".")) return speak("\u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05D4\u05DE\u05DC\u05D0\u05D4 \u05E9\u05DC \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8, \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC \u05D5\u05E0\u05E7\u05D5\u05D3\u05D4");
      const saved = await saveContact(env, callerPhone, name, address, params.aliases || params.alias || []);
      logEvent("chat_contact_saved", { ok: saved });
      return saved ? speak(`\u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8 ${name} \u05E0\u05E9\u05DE\u05E8 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4`) : speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8");
    }
    if (plan.action === "unread" || plan.action === "search") {
      const payload = plan.action === "search" ? { action: "chat_search", query: params.query || "", max: Math.min(parseInt(params.count) || 5, 10) } : { action: "chat_unread", max: Math.min(parseInt(params.count) || 5, 10) };
      const data = await callBridge(env, payload);
      if (!data.ok) return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DB\u05E8\u05D2\u05E2 \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D4\u05E6\u05D0\u05D8");
      await kvSetList(env, listKey, { messages: data.messages || [], ts: Date.now() });
      return speak(fmtChatList(data.messages || []));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const item = list?.messages?.[(parseInt(params.index) || 1) - 1];
      if (!item) return speak("\u05D0\u05D9\u05DF \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8 \u05E4\u05E2\u05D9\u05DC\u05D4, \u05D1\u05E7\u05E9 \u05E7\u05D5\u05D3\u05DD \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA");
      const data = await callBridge(env, { action: "chat_get", name: item.name });
      if (!data.ok) return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E4\u05EA\u05D5\u05D7 \u05D0\u05EA \u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8");
      const answer = await groqChatShort(GROQ_KEY, "\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA. \u05D4\u05E7\u05E8\u05D0 \u05D0\u05EA \u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8 \u05D1\u05E7\u05E6\u05E8\u05D4 \u05D5\u05D1\u05E6\u05D5\u05E8\u05D4 \u05D1\u05E8\u05D5\u05E8\u05D4, \u05E2\u05D3 \u05D0\u05E8\u05D1\u05E2\u05D4 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD.", `\u05DE\u05D0\u05EA ${data.message?.sender || "\u05E9\u05D5\u05DC\u05D7 \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2"}. \u05EA\u05D5\u05DB\u05DF: ${data.message?.text || "\u05DC\u05DC\u05D0 \u05D8\u05E7\u05E1\u05D8"}`, 350);
      return speak(answer || "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D4\u05E7\u05E8\u05D9\u05D0 \u05D0\u05EA \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4");
    }
    if (plan.action === "send_text") {
      const requestedTo = String(params.to || "").trim();
      const directAddress = normalizeAddress(requestedTo);
      const text = String(params.text || "").trim();
      if (!text) return speak("\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05EA \u05EA\u05D5\u05DB\u05DF \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4");
      let to = directAddress;
      if (!to.includes("@") || !to.split("@")[1]?.includes(".")) {
        const matches = findContactMatches(await getContacts(env, callerPhone), requestedTo);
        if (!matches.length) return speak("\u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D1\u05E9\u05DD \u05D4\u05D6\u05D4. \u05DB\u05D3\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D0\u05DE\u05D5\u05E8, \u05D1\u05E6\u05D0\u05D8 \u05E9\u05DE\u05D5\u05E8 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8, \u05E9\u05DD, \u05DB\u05EA\u05D5\u05D1\u05EA \u05DE\u05D9\u05D9\u05DC \u05D5\u05DB\u05D9\u05E0\u05D5\u05D9");
        if (matches.length > 1) {
          await setPendingChat(env, callerPhone, { text, matches: matches.map((contact) => ({ name: contact.name, address: contact.address, aliases: contact.aliases || [] })) });
          return speak(`\u05DE\u05E6\u05D0\u05EA\u05D9 \u05DB\u05DE\u05D4 \u05D0\u05E0\u05E9\u05D9 \u05E7\u05E9\u05E8 \u05D1\u05E9\u05DD \u05D4\u05D6\u05D4: ${contactChoiceNames(matches)}. \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D4\u05E9\u05DD \u05D4\u05DE\u05DC\u05D0`);
        }
        to = matches[0].address;
      }
      const data = await callBridge(env, { action: "chat_send_text", to, text });
      logEvent("chat_send", { ok: Boolean(data.ok), usedContact: to !== directAddress });
      if (!data.ok) return speak("\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8 \u05E0\u05DB\u05E9\u05DC\u05D4");
      return speak("\u05D4\u05D5\u05D3\u05E2\u05EA \u05D4\u05E6\u05D0\u05D8 \u05E0\u05E9\u05DC\u05D7\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4");
    }
    return speak("\u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05D0\u05D5\u05DC \u05D0\u05DD \u05D9\u05E9 \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8 \u05D7\u05D3\u05E9\u05D5\u05EA, \u05DC\u05D1\u05E7\u05E9 \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D4\u05D5\u05D3\u05E2\u05D4, \u05DC\u05D7\u05E4\u05E9 \u05D4\u05D5\u05D3\u05E2\u05D4, \u05D0\u05D5 \u05DC\u05E9\u05DC\u05D5\u05D7 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05EA\u05D5\u05DE\u05DC\u05DC\u05EA");
  } catch (error) {
    logEvent("chat_error", { type: error?.name || "Error" });
    return speak("\u05D9\u05E9 \u05EA\u05E7\u05DC\u05D4 \u05D1\u05D7\u05D9\u05D1\u05D5\u05E8 \u05DC\u05E6\u05D0\u05D8, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  }
}
__name(handleGoogleChat, "handleGoogleChat");
__name2(handleGoogleChat, "handleGoogleChat");
function speak(text) {
  const clean = String(text || "").replace(/[\r\n]+/g, " ").replace(/[.\u2024\u2026]+/g, ", ").replace(/[-\u2010-\u2015]+/g, " ").replace(/[&=#%+:]/g, " ").replace(/[^a-zA-Z0-9\u0590-\u05FF\s,?!]/g, "").replace(/\s+/g, " ").replace(/,+/g, ",").substring(0, 450).trim().replace(/^[,;!?\s]+|[,;:\s]+$/g, "");
  if (!clean) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05EA\u05E7\u05D9\u05E0\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  return textResponse(`id_list_message=t-${clean}`);
}
__name(speak, "speak");
__name2(speak, "speak");
export {
  worker_default as default
};
//# sourceMappingURL=active-worker.js.map
