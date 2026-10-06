var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
function hebNumWords(n) {
  const units = ["", "\u05D0\u05D7\u05EA", "\u05E9\u05EA\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9", "\u05D0\u05E8\u05D1\u05E2", "\u05D7\u05DE\u05E9", "\u05E9\u05E9", "\u05E9\u05D1\u05E2", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2"];
  const teens = ["\u05E2\u05E9\u05E8", "\u05D0\u05D7\u05EA \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05EA\u05D9\u05DD \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05DC\u05D5\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05D0\u05E8\u05D1\u05E2 \u05E2\u05E9\u05E8\u05D4", "\u05D7\u05DE\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05E9 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05D1\u05E2 \u05E2\u05E9\u05E8\u05D4", "\u05E9\u05DE\u05D5\u05E0\u05D4 \u05E2\u05E9\u05E8\u05D4", "\u05EA\u05E9\u05E2 \u05E2\u05E9\u05E8\u05D4"];
  const tens = ["", "\u05E2\u05E9\u05E8", "\u05E2\u05E9\u05E8\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9\u05D9\u05DD", "\u05D0\u05E8\u05D1\u05E2\u05D9\u05DD", "\u05D7\u05DE\u05D9\u05E9\u05D9\u05DD"];
  n = Number(n) || 0;
  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  const t2 = Math.floor(n / 10), u2 = n % 10;
  return tens[t2] + (u2 ? " \u05D5" + units[u2] : "");
}
__name(hebNumWords, "hebNumWords");
__name2(hebNumWords, "hebNumWords");
__name22(hebNumWords, "hebNumWords");
function gematria(n) {
  const tensL = ["", "\u05D9", "\u05DB", "\u05DC", "\u05DE", "\u05E0", "\u05E1", "\u05E2", "\u05E4", "\u05E6"];
  const unitsL = ["", "\u05D0", "\u05D1", "\u05D2", "\u05D3", "\u05D4", "\u05D5", "\u05D6", "\u05D7", "\u05D8"];
  if (n === 15) return "\u05D8\u05D5";
  if (n === 16) return "\u05D8\u05D6";
  return tensL[Math.floor(n / 10)] + unitsL[n % 10];
}
__name(gematria, "gematria");
__name2(gematria, "gematria");
__name22(gematria, "gematria");
function localClockText(timeStr, dateStr, hebStr) {
  let out = "";
  const m2 = /^(\d{1,2}):(\d{2})$/.exec(String(timeStr || ""));
  if (m2) {
    const hh = Number(m2[1]), mm = Number(m2[2]);
    out = "\u05D4\u05E9\u05E2\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5 " + hebNumWords(hh) + (mm === 0 ? " \u05D1\u05D3\u05D9\u05D5\u05E7" : ", " + hebNumWords(mm));
  }
  if (dateStr) out += (out ? ", " : "") + "\u05D4\u05EA\u05D0\u05E8\u05D9\u05DA " + dateStr;
  const monMap = { "Tishrei": "\u05EA\u05E9\u05E8\u05D9", "Cheshvan": "\u05D7\u05E9\u05D5\u05DF", "Kislev": "\u05DB\u05E1\u05DC\u05D5", "Tevet": "\u05D8\u05D1\u05EA", "Shevat": "\u05E9\u05D1\u05D8", "Adar": "\u05D0\u05D3\u05E8", "Adar I": "\u05D0\u05D3\u05E8 \u05D0", "Adar II": "\u05D0\u05D3\u05E8 \u05D1", "Nisan": "\u05E0\u05D9\u05E1\u05DF", "Iyyar": "\u05D0\u05D9\u05D9\u05E8", "Sivan": "\u05E1\u05D9\u05D5\u05D5\u05DF", "Tamuz": "\u05EA\u05DE\u05D5\u05D6", "Av": "\u05D0\u05D1", "Elul": "\u05D0\u05DC\u05D5\u05DC" };
  const parts = String(hebStr || "").trim().split(/\s+/);
  if (parts.length >= 3 && /[^0-9]/.test(parts[0])) {
    out += ", " + String(hebStr || "").replace(/[\u0591-\u05C7]/g, "");
  } else if (parts.length >= 3) {
    const yr = parseInt(parts[parts.length - 1], 10);
    const mon = monMap[parts.slice(1, -1).join(" ")] || "";
    const day = parseInt(parts[0], 10);
    if (mon && yr >= 5700 && yr < 5800) {
      out += ", " + gematria(day) + " \u05D1" + mon + " \u05EA\u05E9" + gematria(yr - 5700);
    }
  }
  return out;
}
__name(localClockText, "localClockText");
__name2(localClockText, "localClockText");
__name22(localClockText, "localClockText");
function needsWebSearch(text) {
  const q = String(text || "").toLowerCase();
  const clock = /(?:מה השעה|מה התאריך|איזה תאריך|תאריך עברי|איזה יום היום)/.test(q);
  const explicit = /(?:חפש|תחפש|תבדוק|בדוק).{0,24}(?:אינטרנט|רשת|גוגל)|(?:אינטרנט|רשת|גוגל).{0,24}(?:חפש|תחפש|תבדוק|בדוק)/.test(q);
  if (clock && !explicit) return false;
  const liveSources = /(?:שער|דולר|אירו|מטבע|חליפין|מזג|אוויר|טמפרטורה|ביטק|חמרון)/;
  if (liveSources.test(q) && !explicit) return false;
  return explicit || /(?:היום|עכשיו|כרגע|עדכני|עדכנית|חדשות|מחיר|שער|דולר|אירו|מזג|תוצאה|לוח זמנים|טיסה|רכבת|אוטובוס)/.test(q);
}
__name(needsWebSearch, "needsWebSearch");
__name2(needsWebSearch, "needsWebSearch");
function responsesOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const output = Array.isArray(payload?.output) ? payload.output : [];
  return output.flatMap((item) => Array.isArray(item?.content) ? item.content : []).filter((part) => part?.type === "output_text" || part?.type === "text").map((part) => String(part.text || "")).join(" ").trim();
}
__name(responsesOutputText, "responsesOutputText");
__name2(responsesOutputText, "responsesOutputText");
function responsesUsedBrowserSearch(payload) {
  return (Array.isArray(payload?.output) ? payload.output : []).some((item) => /(?:browser|web)_search/i.test(String(item?.type || "")));
}
__name(responsesUsedBrowserSearch, "responsesUsedBrowserSearch");
__name2(responsesUsedBrowserSearch, "responsesUsedBrowserSearch");
async function currentDollarRate() {
  try {
    const liveResponse = await fetch("https://open.er-api.com/v6/latest/USD", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      const liveRate = Number(liveData?.rates?.ILS);
      if (liveData?.result === "success" && Number.isFinite(liveRate) && liveRate > 0) {
        return { rate: liveRate, lastUpdate: String(liveData?.time_last_update_utc || ""), source: "exchange_rate_api" };
      }
    }
  } catch (_) {
  }
  const response = await fetch("https://boi.org.il/PublicApi/GetExchangeRate?key=USD", { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error("Bank of Israel HTTP " + response.status);
  const data = await response.json();
  const rate = Number(data?.currentExchangeRate);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("Bank of Israel returned no USD rate");
  return { rate, lastUpdate: String(data?.lastUpdate || ""), source: "bank_of_israel" };
}
__name(currentDollarRate, "currentDollarRate");
__name2(currentDollarRate, "currentDollarRate");
function asksDollarRate(text) {
  const q = String(text || "");
  return /(?:שי?ער|ס[י]?ער|מחיר|כמה).{0,20}דולר|דולר.{0,20}(?:שי?ער|ס[י]?ער|מחיר|כמה)/.test(q);
}
__name(asksDollarRate, "asksDollarRate");
__name2(asksDollarRate, "asksDollarRate");
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
__name2(speakTimeNumber, "speakTimeNumber");
function makePhoneFriendlyTimes(answer) {
  return String(answer || "").replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (_, hour, minute) => `${speakTimeNumber(Number(hour))}, ${speakTimeNumber(Number(minute))}`);
}
__name(makePhoneFriendlyTimes, "makePhoneFriendlyTimes");
__name2(makePhoneFriendlyTimes, "makePhoneFriendlyTimes");
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
    const mailboxAuth = url.pathname.startsWith("/ivr/") ? url.pathname.slice(5) : "";
    if (params.confirm !== void 0 && callerPhone) {
      if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D1\u05D9\u05E6\u05D5\u05E2 \u05D4\u05E4\u05E2\u05D5\u05DC\u05D4 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
      return await handleConfirm(env, params.confirm, callerPhone);
    }
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
      const requestId = makeRequestId(callerPhone, p);
      const downloadUrl = `https://www.call2all.co.il/ym/api/DownloadFile?token=${YEMOT_TOKEN}&path=ivr2:${p}`;
      logEvent("recording_download_started", { caller: callerTail(callerPhone) });
      const audioRes = await fetch(downloadUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!audioRes.ok) {
        logEvent("recording_download_failed", { status: audioRes.status });
        return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E7\u05D1\u05DC \u05D0\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
      }
      const audioBlob = await audioRes.blob();
      logEvent("recording_downloaded", { bytes: audioBlob.size });
      try {
        const buf = await audioBlob.arrayBuffer();
        const adv = new DataView(buf);
        let off = 12, silentAudio = false;
        while (off + 8 <= adv.byteLength) {
          const chunkId = String.fromCharCode(adv.getUint8(off), adv.getUint8(off + 1), adv.getUint8(off + 2), adv.getUint8(off + 3));
          const chunkSize = adv.getUint32(off + 4, true);
          if (chunkId === "data") {
            let sum = 0, n = 0;
            const dend = Math.min(off + 8 + chunkSize, adv.byteLength);
            for (let p2 = off + 8; p2 + 1 < dend; p2 += 2) {
              sum += Math.abs(adv.getInt16(p2, true));
              n++;
            }
            if (n > 800 && sum / n < 60) silentAudio = true;
            break;
          }
          off += 8 + chunkSize;
        }
        if (silentAudio) return textResponse("id_list_message=t-\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05D5\u05EA\u05DA, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D1\u05E7\u05E9\u05EA\u05DA \u05D1\u05E7\u05D5\u05DC \u05E8\u05DD");
      } catch (_) {
      }
      const whisperContacts = callerPhone ? await getContacts(env, callerPhone) : [];
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-large-v3-turbo");
      formData.append("language", "he");
      formData.append("temperature", "0");
      formData.append("prompt", buildWhisperPrompt(whisperContacts));
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
        return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2 \u05D0\u05EA \u05D4\u05E9\u05D0\u05DC\u05D4, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05D5\u05EA\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05D1\u05E7\u05E9\u05D4");
      }
      const transcribedText = (await whisperRes.json()).text?.trim() || "";
      if (!transcribedText) return textResponse("id_list_message=t-\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05D5\u05EA\u05DA, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D1\u05E7\u05E9\u05EA\u05DA \u05D1\u05E7\u05D5\u05DC \u05E8\u05DD");
      const callId = String(params.ApiCallId || requestId || "call_" + callerPhone).slice(0, 90);
      globalThis.__callId = callId;
      const cont = await kvGetList(env, contStateKey(callerPhone));
      if (cont && cont.kind && Date.now() - (cont.ts || 0) < 600000) {
        const contRes = resolveContinuation(cont, transcribedText, whisperContacts);
        logEvent("cont_checked", { kind: String(cont.kind || "").slice(0, 10), result: String(contRes.status).slice(0, 12), caller: callerTail(callerPhone) });
        if (contRes.status === "cancel") {
          await clearContState(env, callerPhone);
          return speak("בטלתי את הפעולה");
        }
        if (contRes.status === "resolved") {
          if (cont.kind !== "currency" && (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET || normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE))) {
            await clearContState(env, callerPhone);
            return speak("אין הרשאה לביצוע הפעולה ממספר זה");
          }
          return await executeContinuation(env, cont, contRes, callerPhone, requestId);
        }
        if (contRes.status === "reask") return speak(cont.question || "אנא ענה על השאלה הקודמת");
        await clearContState(env, callerPhone);
      }
      let convo = null;
      if (env.USER_MEMORY) {
        try {
          const cRaw = await env.USER_MEMORY.get("convo_" + callId);
          if (cRaw) convo = JSON.parse(cRaw);
        } catch (_) {
        }
      }
      if (convo && Date.now() - (convo.ts || 0) > 300000) convo = null;
      const isShortReply = transcribedText.split(/\s+/).filter(Boolean).length <= 4;
      const clockGlued = transcribedText.replace(/\s+/g, "");
      const clockFast = (/(?:מה השעה|מה שעה|השעה עכשיו|מה התאריך|מה תאריך|איזה תאריך|התאריך היום|תאריך עברי|איזה יום היום|איזה יום)/.test(transcribedText) || /(?:מההשעה|מהשעה|השעהעכשיו|מההתאריך|מהתאריך|איזהתאריך|התאריךהיום|תאריךעברי|איזהיוםהיום|איזהיום|מהיום)/.test(clockGlued)) && !/(?:מייל|אימייל|צאט|שלח|תשלח|שלוח|תעביר|דולר|אירו|יורו|מזג|ביטקוין|ביקוד|קריפטו)/.test(transcribedText);
      if (clockFast) {
        const _now = /* @__PURE__ */ new Date();
        const _t = _now.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", hour12: false });
        const _d = _now.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem", weekday: "long", year: "numeric", month: "long", day: "numeric" });
        let _hb = "";
        try {
          const _r = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${_now.getFullYear()}&gm=${_now.getMonth() + 1}&gd=${_now.getDate()}&g2h=1`, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (_r.ok) {
            const _hd = await _r.json();
            if (_hd.heDateParts) _hb = _hd.heDateParts.d + " \u05D1" + _hd.heDateParts.m + " " + _hd.heDateParts.y;
            else _hb = _hd.hebrew || "";
          }
        } catch (_) {
        }
        return speak(localClockText(_t, _d, _hb));
      }
      const effectiveText = convo && isShortReply && String(convo.lastAnswer || "").includes("?") && convo.lastUser ? String(convo.lastUser + " " + transcribedText).slice(0, 280) : transcribedText;
      const chatIntent = /(?:גוגל|google|גוגול).{0,20}(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat)|(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat).{0,20}(?:גוגל|google|גוגול)|(?:^|[\s,])(?:ב)?(?:צ[׳'״"]?אט|צ[׳'״"]?ט|צאט|צ׳ט|chat)(?![\u05D0-\u05EA])|איש\s+קשר/i.test(effectiveText);
      const emailIntent = /(?:מייל|אימייל|אימיל|email|e-mail|mail|תיבת\s*הדואר|דואר\s*נכנס)/i.test(effectiveText);
      const sendIntent = /(?:שלח|תשלח|שלוח|שליחה|העבר(?![\u05D0-\u05EA])|תעביר(?![\u05D0-\u05EA]))/.test(effectiveText);
      logEvent("transcription_completed", { chars: transcribedText.length, chatIntent, emailIntent, sendIntent });
      if (!transcribedText) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2, \u05D0\u05E0\u05D0 \u05D3\u05D1\u05E8 \u05D1\u05E8\u05D5\u05E8 \u05D9\u05D5\u05EA\u05E8");
      const savedContacts = whisperContacts;
      const normalizedTranscript = normalizeContactTerm(effectiveText);
      const mentionsSavedContact = savedContacts.some((contact) => [contact.name, ...contact.aliases || []].some((alias) => {
        const normalizedAlias = normalizeContactTerm(alias);
        return normalizedAlias.length >= 2 && normalizedTranscript.includes(normalizedAlias);
      }));
      if (emailIntent) {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC \u05D5\u05DC\u05E6\u05D0\u05D8 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
        return await handleEmail(env, GROQ_KEY, effectiveText, callerPhone, requestId);
      }
      if (chatIntent || sendIntent && mentionsSavedContact) {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC \u05D5\u05DC\u05E6\u05D0\u05D8 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
        return await handleGoogleChat(env, GROQ_KEY, effectiveText, callerPhone, requestId);
      }
      if (sendIntent) {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC \u05D5\u05DC\u05E6\u05D0\u05D8 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
        return await routeCommunication(env, GROQ_KEY, effectiveText, callerPhone, requestId);
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
      let hebrewDateStr = "", parashaStr = "", usdRateStr = "", liveContext = "", dollarRate = null, weatherStr = "", btcStr = "";
      try {
        const hebcalRes = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${now.getMonth() + 1}&gd=${now.getDate()}&g2h=1`, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (hebcalRes.ok) {
          const hd = await hebcalRes.json();
          hebrewDateStr = hd.hebrew || "";
          if (hd.events?.length) parashaStr = hd.events.join(", ");
        }
        dollarRate = await currentDollarRate();
        usdRateStr = `\u05D3\u05D5\u05DC\u05E8: ${dollarRate.rate} \u20AA, \u05DC\u05E4\u05D9 \u05D4\u05E9\u05E2\u05E8 \u05D4\u05D9\u05E6\u05D9\u05D2 \u05D4\u05D0\u05D7\u05E8\u05D5\u05DF \u05E9\u05DC \u05D1\u05E0\u05E7 \u05D9\u05E9\u05E8\u05D0\u05DC`;
        try {
          const wres = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.08&longitude=34.78&current=temperature_2m,weather_code&timezone=Asia%2FJerusalem", { headers: { "User-Agent": "Mozilla/5.0" } });
          if (wres.ok) {
            const wd = await wres.json();
            const wc = wd.current || {};
            if (wc.temperature_2m !== void 0) weatherStr = `\u05DE\u05D6\u05D2 \u05D4\u05D0\u05D5\u05D5\u05D9\u05E8 \u05D1\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1: ${wc.temperature_2m} \u05DE\u05E2\u05DC\u05D5\u05EA`;
          }
        } catch (_) {
        }
        try {
          let btcUsd = null;
          try {
            const cb = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot", { headers: { "User-Agent": "Mozilla/5.0" } });
            if (cb.ok) btcUsd = parseFloat((await cb.json()).data?.amount);
          } catch (_) {
          }
          if (!btcUsd || isNaN(btcUsd)) {
            const bres = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", { headers: { "User-Agent": "Mozilla/5.0" } });
            if (bres.ok) btcUsd = (await bres.json()).bitcoin?.usd || null;
          }
          if (btcUsd && !isNaN(btcUsd)) btcStr = `\u05DE\u05D7\u05D9\u05E8 \u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF \u05DB\u05E8\u05D2\u05E2: ${Math.round(btcUsd).toLocaleString("en-US")} \u05D3\u05D5\u05DC\u05E8`;
        } catch (_) {
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
      const euroQ = asksEuroRate(effectiveText);
      const currOnlyQ = /(?:\u05E9\u05D9?\u05E2\u05E8|\u05E1[\u05D9]?\u05E2\u05E8|\u05DE\u05D8\u05D1\u05E2)/.test(effectiveText) && !asksDollarRate(effectiveText) && !euroQ;
      if (currOnlyQ) {
        const currQuestion = "לאיזה מטבע אתה מתכוון? דולר, אירו או ביטקוין";
        await setContState(env, callerPhone, { kind: "currency", action: "rate", payload: {}, originalRequest: transcribedText, question: currQuestion, ts: Date.now() });
        await saveConvoTurn(env, transcribedText, currQuestion);
        return speak(currQuestion);
      }
      if (euroQ) {
        const eurRate = await currentEuroRate();
        if (eurRate) {
          const eShekels = Math.floor(eurRate);
          const eAgorot = Math.round((eurRate - eShekels) * 100);
          await saveConvoTurn(env, transcribedText, "\u05E9\u05E2\u05E8 \u05D4\u05D0\u05D9\u05E8\u05D5 \u05D4\u05D5\u05D0 " + eShekels + " \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5 " + eAgorot + " \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA");
          return speak("\u05E9\u05E2\u05E8 \u05D4\u05D0\u05D9\u05E8\u05D5 \u05DE\u05D5\u05DC \u05D4\u05E9\u05E7\u05DC \u05D4\u05D5\u05D0 " + eShekels + " \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5 " + eAgorot + " \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA");
        }
      }
      if (asksDollarRate(effectiveText) && dollarRate) {
        const shekels = Math.floor(dollarRate.rate);
        const agorot = Math.round((dollarRate.rate - shekels) * 100);
        const shekelWords = ["\u05D0\u05E4\u05E1", "\u05D0\u05D7\u05D3", "\u05E9\u05E0\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9\u05D4", "\u05D0\u05E8\u05D1\u05E2\u05D4", "\u05D7\u05DE\u05D9\u05E9\u05D4", "\u05E9\u05D9\u05E9\u05D4", "\u05E9\u05D1\u05E2\u05D4", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2\u05D4"];
        const agoraWords = ["\u05D0\u05E4\u05E1", "\u05D0\u05D7\u05EA", "\u05E9\u05EA\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9", "\u05D0\u05E8\u05D1\u05E2", "\u05D7\u05DE\u05E9", "\u05E9\u05E9", "\u05E9\u05D1\u05E2", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2"];
        const amount = shekels >= 0 && shekels < shekelWords.length && agorot >= 0 && agorot < agoraWords.length ? `${shekelWords[shekels]} \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5${agoraWords[agorot]} \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA` : `${dollarRate.rate.toFixed(2)} \u05E9\u05E7\u05DC\u05D9\u05DD`;
        logEvent("dollar_rate_answered", { source: "bank_of_israel" });
        return speak(`\u05D4\u05E9\u05E2\u05E8 \u05D4\u05D9\u05E6\u05D9\u05D2 \u05D4\u05D0\u05D7\u05E8\u05D5\u05DF \u05E9\u05E4\u05E8\u05E1\u05DD \u05D1\u05E0\u05E7 \u05D9\u05E9\u05E8\u05D0\u05DC \u05D4\u05D5\u05D0 ${amount} \u05DC\u05D3\u05D5\u05DC\u05E8`);
      }
      const systemPrompt = `\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05E2\u05D5\u05E0\u05D4 \u05E7\u05E6\u05E8, \u05D1\u05E8\u05D5\u05E8 \u05D5\u05EA\u05DE\u05E6\u05D9\u05EA\u05D9. \u05EA\u05E9\u05D5\u05D1\u05D4 \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9\u05EA 3 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD. \u05D0\u05DC \u05EA\u05D0\u05E8\u05D9\u05DA. \u05D0\u05DC \u05EA\u05E1\u05D1\u05D9\u05E8 \u05DE\u05D4 \u05D0\u05EA\u05D4 \u05E2\u05D5\u05E9\u05D4, \u05E8\u05E7 \u05E2\u05E0\u05D4 \u05D9\u05E9\u05D9\u05E8\u05D5\u05EA. \u05D0\u05DD \u05E9\u05D5\u05D0\u05DC\u05D9\u05DD \u05DE\u05D9 \u05D0\u05EA\u05D4, \u05E2\u05E0\u05D4: \u05D0\u05E0\u05D9 \u05D4\u05E2\u05D5\u05D6\u05E8 \u05D4\u05D7\u05DB\u05DD \u05E9\u05DC\u05DA. \u05E2\u05E0\u05D4 \u05EA\u05DE\u05D9\u05D3 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05E4\u05E9\u05D5\u05D8\u05D4 \u05D5\u05D1\u05E8\u05D5\u05E8\u05D4. \u05D0\u05DC \u05EA\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA.
\u05D4\u05E9\u05E2\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5 ${currentTimeIsrael}, \u05D4\u05EA\u05D0\u05E8\u05D9\u05DA ${currentDateIsrael}${hebrewDateStr ? ", " + hebrewDateStr : ""}${parashaStr ? ", " + parashaStr : ""}${usdRateStr ? ". \u05E9\u05E2\u05E8\u05D9 \u05D7\u05DC\u05D9\u05E4\u05D9\u05DF: " + usdRateStr : ""}${weatherStr ? ", " + weatherStr : ""}${btcStr ? ", " + btcStr : ""}${callerName ? ". \u05D4\u05DE\u05EA\u05E7\u05E9\u05E8 \u05E0\u05E7\u05E8\u05D0 " + callerName : ""}${liveContext ? ". \u05DE\u05D9\u05D3\u05E2 \u05E0\u05D5\u05E1\u05E3: " + liveContext : ""}`;
      const convoCtx = convo && convo.lastUser ? "\u05D1\u05D4\u05DE\u05E9\u05DA \u05DC\u05E9\u05D9\u05D7\u05EA\u05E0\u05D5: \u05E9\u05D0\u05DC\u05EA\u05D9 \u05E7\u05D5\u05D3\u05DD: " + String(convo.lastUser).slice(0, 150) + ", \u05D5\u05E2\u05E0\u05D9\u05EA \u05DC\u05D9: " + String(convo.lastAnswer || "").slice(0, 150) + ". \u05D4\u05D4\u05E9\u05DC\u05D4 \u05D4\u05E0\u05D5\u05DB\u05D7\u05D9\u05EA \u05DE\u05EA\u05D9\u05D7\u05E1\u05EA \u05D0\u05DC\u05D9\u05D4. " : "";
      const useWebSearch = needsWebSearch(effectiveText);
      let chatRes = null;
      let aiAnswer = "";
      let webVerified = !useWebSearch;
      if (useWebSearch) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/responses", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              instructions: `${systemPrompt}
\u05D6\u05D5 \u05E9\u05D0\u05DC\u05D4 \u05E9\u05D3\u05D5\u05E8\u05E9\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9. \u05D7\u05E4\u05E9 \u05D1\u05E8\u05E9\u05EA \u05DC\u05E4\u05E0\u05D9 \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4. \u05E2\u05E0\u05D4 \u05E8\u05E7 \u05DC\u05E4\u05D9 \u05DE\u05E7\u05D5\u05E8\u05D5\u05EA \u05E9\u05DE\u05E6\u05D0\u05EA; \u05D0\u05DD \u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E7\u05D5\u05E8\u05D5\u05EA, \u05D0\u05DE\u05D5\u05E8 \u05E9\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA \u05DC\u05D0\u05DE\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9.`,
              input: convoCtx + effectiveText,
              tools: [{ type: "browser_search" }],
              tool_choice: "required",
              max_output_tokens: 300
            })
          });
          if (response.ok) {
            const result = await response.json();
            aiAnswer = responsesOutputText(result);
            webVerified = responsesUsedBrowserSearch(result);
            if (aiAnswer && webVerified) {
              logEvent("web_search_verified", { source: "groq_browser_search" });
            } else {
              logEvent("web_search_unverified", { hasAnswer: Boolean(aiAnswer), usedSearch: webVerified });
            }
          } else {
            logEvent("web_search_failed", { status: response.status });
          }
        } catch (e) {
          logEvent("web_search_error", { type: e?.name || "Error" });
        }
      } else {
        const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
        for (const mdl of models) {
          try {
            chatRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({ model: mdl, temperature: 0, max_tokens: 300, reasoning_effort: "low", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: convoCtx + effectiveText }] })
            });
            if (chatRes.ok) {
              const completion = await chatRes.json();
              aiAnswer = completion.choices?.[0]?.message?.content || "";
              if (aiAnswer.trim()) {
                logEvent("model_answered", { model: mdl, webSearch: false, webVerified: true });
                break;
              }
            }
            logEvent("model_failed", { model: mdl, status: chatRes?.status || 0 });
          } catch (e) {
            logEvent("model_error", { model: mdl, type: e?.name || "Error" });
          }
        }
      }
      if (useWebSearch && !webVerified) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D0\u05DE\u05EA \u05DE\u05D9\u05D3\u05E2 \u05E2\u05D3\u05DB\u05E0\u05D9 \u05D1\u05E8\u05E9\u05EA, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05DB\u05DE\u05D4 \u05D3\u05E7\u05D5\u05EA");
      if (!aiAnswer.trim()) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D1\u05E6\u05E2 \u05D0\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4 \u05DB\u05E8\u05D2\u05E2, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05E8\u05D2\u05E2");
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
      await saveConvoTurn(env, transcribedText, cleanAnswer);
      return textResponse(`id_list_message=t-${cleanAnswer}`);
    } catch (err) {
      logEvent("system_error", { type: err?.name || "Error" });
      return textResponse("id_list_message=t-\u05DE\u05E9\u05D4\u05D5 \u05D1\u05EA\u05E9\u05D5\u05D1\u05D4 \u05D4\u05E9\u05EA\u05D1\u05E9, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05D1\u05E7\u05E9\u05D4");
    }
  }
};
function stripNiqqud(str) {
  return String(str || "").replace(/[\u0591-\u05C7\u200B-\u200F\uFEFF]/g, "").replace(/[\u05F3\u05F4]/g, "");
}
__name(stripNiqqud, "stripNiqqud");
__name2(stripNiqqud, "stripNiqqud");
__name22(stripNiqqud, "stripNiqqud");
function textResponse(text) {
  let t = stripNiqqud(String(text || ""));
  const emptyBody = t.match(/^id_list_message=t-([\s\S]*)$/);
  if (emptyBody && !emptyBody[1].trim()) {
    t = "id_list_message=t-\u05D0\u05D9\u05DF \u05DE\u05E2\u05E0\u05D4 \u05DB\u05E8\u05D2\u05E2, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05E8\u05D2\u05E2";
  }
  return new Response(t, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(textResponse, "textResponse");
__name2(textResponse, "textResponse");
__name22(textResponse, "textResponse");
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
__name22(logEvent, "logEvent");
function callerTail(phone) {
  const normalized = normalizeIsraelPhone(phone);
  return normalized ? `phone_${normalized.slice(-4)}` : "missing";
}
__name(callerTail, "callerTail");
__name2(callerTail, "callerTail");
__name22(callerTail, "callerTail");
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
__name22(callBridge, "callBridge");
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
__name22(kvGetList, "kvGetList");
async function kvSetList(env, key, val) {
  try {
    await env.USER_MEMORY.put(key, JSON.stringify(val), { expirationTtl: 600 });
  } catch (_) {
  }
}
__name(kvSetList, "kvSetList");
__name2(kvSetList, "kvSetList");
__name22(kvSetList, "kvSetList");
function contactStorageKey(callerPhone) {
  return "chat_contacts_" + normalizeIsraelPhone(callerPhone);
}
__name(contactStorageKey, "contactStorageKey");
__name2(contactStorageKey, "contactStorageKey");
__name22(contactStorageKey, "contactStorageKey");function normalizeContactTerm(value) {
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}
__name(normalizeContactTerm, "normalizeContactTerm");
__name2(normalizeContactTerm, "normalizeContactTerm");
__name22(normalizeContactTerm, "normalizeContactTerm");
async function getContacts(env, callerPhone) {
  const stored = await kvGetList(env, contactStorageKey(callerPhone));
  return Array.isArray(stored) ? stored.filter((contact) => contact && contact.name && contact.address) : [];
}
__name(getContacts, "getContacts");
__name2(getContacts, "getContacts");
__name22(getContacts, "getContacts");
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
__name22(putContacts, "putContacts");
function nameVariants(text) {
  const n0 = normalizeContactTerm(text);
  const out = [n0];
  const prefixes = ["\u05D0\u05DC", "\u05DC\u05D9", "\u05DC", "\u05D4", "\u05D1", "\u05D5", "\u05DE", "\u05DB"];
  for (const p of prefixes) {
    if (n0.startsWith(p) && n0.length > p.length) out.push(n0.slice(p.length));
  }
  return [...new Set(out.filter((v) => v && v.length > 0))];
}
__name(nameVariants, "nameVariants");
__name2(nameVariants, "nameVariants");
__name22(nameVariants, "nameVariants");
function contStateKey(callerPhone) {
  return "cont_" + normalizeIsraelPhone(callerPhone);
}
__name(contStateKey, "contStateKey");
__name2(contStateKey, "contStateKey");
__name22(contStateKey, "contStateKey");
async function setContState(env, callerPhone, cont) {
  if (!env.USER_MEMORY) return;
  try {
    await env.USER_MEMORY.put(contStateKey(callerPhone), JSON.stringify(cont), { expirationTtl: 600 });
  } catch (_) {
  }
}
__name(setContState, "setContState");
__name2(setContState, "setContState");
__name22(setContState, "setContState");
async function clearContState(env, callerPhone) {
  try {
    await env.USER_MEMORY.delete(contStateKey(callerPhone));
  } catch (_) {
  }
}
__name(clearContState, "clearContState");
__name2(clearContState, "clearContState");
__name22(clearContState, "clearContState");
function lastTargetKey(callerPhone) {
  return "lt_" + normalizeIsraelPhone(callerPhone);
}
__name(lastTargetKey, "lastTargetKey");
__name2(lastTargetKey, "lastTargetKey");
__name22(lastTargetKey, "lastTargetKey");
async function setLastTarget(env, callerPhone, name, address, kind) {
  if (!env.USER_MEMORY || !address) return;
  try {
    await env.USER_MEMORY.put(lastTargetKey(callerPhone), JSON.stringify({ name: String(name || ""), address, kind: String(kind || ""), ts: Date.now() }), { expirationTtl: 3600 });
  } catch (_) {
  }
}
__name(setLastTarget, "setLastTarget");
__name2(setLastTarget, "setLastTarget");
__name22(setLastTarget, "setLastTarget");
function slimCandidates(matches) {
  return (matches || []).map((c) => ({ name: c.name, address: c.address, aliases: c.aliases || [] }));
}
__name(slimCandidates, "slimCandidates");
__name2(slimCandidates, "slimCandidates");
__name22(slimCandidates, "slimCandidates");
function contQuestionFor(matches) {
  const names = (matches || []).map((c) => String(c.name || "").trim()).filter(Boolean);
  if (!names.length) return "\u05D0\u05DE\u05D5\u05E8 \u05D1\u05D1\u05E7\u05E9\u05D4 \u05D0\u05EA \u05D4\u05E9\u05DD \u05D4\u05DE\u05DC\u05D0";
  const words0 = names[0].split(/\s+/);
  let j = words0.length;
  for (let i = 1; i < names.length; i++) {
    const wi = names[i].split(/\s+/);
    let k = 0;
    while (k < wi.length && k < words0.length && wi[k] === words0[k]) k++;
    j = Math.min(j, k);
  }
  const prefix = words0.slice(0, j).join(" ");
  if (prefix) return `\u05DC\u05D0\u05D9\u05D6\u05D4 ${prefix} \u05D0\u05EA\u05D4 \u05DE\u05EA\u05DB\u05D5\u05D5\u05DF: ${names.join(" \u05D0\u05D5 ")}?`;
  return `\u05DC\u05DE\u05D9 \u05D0\u05EA\u05D4 \u05DE\u05EA\u05DB\u05D5\u05D5\u05DF: ${names.join(" \u05D0\u05D5 ")}?`;
}
__name(contQuestionFor, "contQuestionFor");
__name2(contQuestionFor, "contQuestionFor");
__name22(contQuestionFor, "contQuestionFor");
function isPronounRef(text) {
  const n = normalizeContactTerm(text);
  return ["\u05DC\u05D5", "\u05DC\u05D4", "\u05D0\u05DC\u05D9\u05D5", "\u05D0\u05DC\u05D9\u05D4", "\u05D0\u05D5\u05EA\u05D5", "\u05D0\u05D5\u05EA\u05D4"].includes(n);
}
__name(isPronounRef, "isPronounRef");
__name2(isPronounRef, "isPronounRef");
__name22(isPronounRef, "isPronounRef");
function findCurrency(text) {
  const t = String(text || "");
  if (/(?:^|\s)(?:\u05D3\u05D5\u05DC\u05E8\S*|\u05D3\u05D5\u05DC\u05D0\u05E8\S*)(?:$|\s|,)|usd|dollar/i.test(t)) return "usd";
  if (/(?:^|\s)(?:\u05D0\u05D9?\u05E8\u05D5|\u05D0\u05E8\u05D5|\u05D9\u05D5\u05E8\u05D5)(?:$|\s|,)|euro|eur/i.test(t)) return "eur";
  if (/(?:^|\s)(?:\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF\S*|\u05D1\u05D9\u05E7\u05D5\u05D9\u05DF\S*|\u05D1\u05D9\u05E7\u05D5\u05D3)(?:$|\s|,)|bitcoin|btc/i.test(t)) return "btc";
  return null;
}
__name(findCurrency, "findCurrency");
__name2(findCurrency, "findCurrency");
__name22(findCurrency, "findCurrency");
function matchCandidatesAmong(candidates, reply) {
  const list = candidates || [];
  const variants = nameVariants(reply);
  for (const wanted of variants) {
    if (wanted.length < 2) continue;
    const exact = list.filter((c) => [c.name, ...(c.aliases || [])].some((v) => normalizeContactTerm(v) === wanted));
    if (exact.length) return exact;
  }
  for (const wanted of variants) {
    if (wanted.length < 2) continue;
    const sub = list.filter((c) => [c.name, ...(c.aliases || [])].some((v) => {
      const n = normalizeContactTerm(v);
      return n.length >= 2 && (n.includes(wanted) || (wanted.length >= 3 && wanted.includes(n)));
    }));
    if (sub.length) return sub;
  }
  const scored = [];
  for (const c of list) {
    let sc = 0;
    for (const k of [c.name, ...(c.aliases || [])]) {
      const n = normalizeContactTerm(k);
      if (!n) continue;
      for (const wanted of variants) {
        sc = Math.max(sc, 1 - levenshteinDistance(wanted, n) / Math.max(wanted.length, n.length, 1));
      }
    }
    if (sc > 0) scored.push({ c, sc });
  }
  const maxS = scored.length ? Math.max(...scored.map((x) => x.sc)) : 0;
  if (maxS >= 0.55) return scored.filter((x) => x.sc === maxS).map((x) => x.c);
  return [];
}
__name(matchCandidatesAmong, "matchCandidatesAmong");
__name2(matchCandidatesAmong, "matchCandidatesAmong");
__name22(matchCandidatesAmong, "matchCandidatesAmong");
function resolveContinuation(cont, reply, allContacts) {
  const text = String(reply || "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  if (/(?:\u05D1\u05D8\u05DC|\u05D1\u05D8\u05D5\u05DC|\u05E2\u05D6\u05D5\u05D1|\u05E9\u05DB\u05D7 \u05DE\u05D6\u05D4|\u05E9\u05DB\u05D7\u05D9 \u05DE\u05D6\u05D4|\u05DC\u05D0 \u05DE\u05E9\u05E0\u05D4|\u05DB\u05DC\u05D5\u05DD|\u05EA\u05E9\u05DB\u05D7)/.test(text) && words <= 4) return { status: "cancel" };
  if (cont.kind === "currency") {
    const cur = findCurrency(text);
    if (cur) return { status: "resolved", currency: cur };
  }
  if (cont.kind === "contact") {
    const among = matchCandidatesAmong(cont.candidates || [], text);
    if (among.length === 1) return { status: "resolved", contact: { name: among[0].name, address: among[0].address } };
    if (among.length > 1) return { status: "reask" };
    if (words <= 4) {
      const others = findContactMatches(allContacts || [], text).filter((c) => !(cont.candidates || []).some((k) => k.address === c.address));
      if (others.length === 1) return { status: "resolved", contact: { name: others[0].name, address: others[0].address } };
    }
  }
  const glued = text.replace(/\s+/g, "");
  const clockQ = /(?:מההשעה|מהשעה|השעהעכשיו|מההתאריך|מהתאריך|איזהתאריך|התאריךהיום|תאריךעברי|איזהיוםהיום|איזהיום|מהיום)/.test(glued) || /(?:מה השעה|מה שעה|השעה עכשיו|מה התאריך|מה תאריך|איזה תאריך|התאריך היום|תאריך עברי|איזה יום היום|איזה יום)/.test(text);
  const sendQ = /(?:\u05E9\u05DC\u05D7|\u05EA\u05E9\u05DC\u05D7|\u05E9\u05DC\u05D5\u05D7|\u05E9\u05DC\u05D9\u05D7\u05D4|\u05D4\u05E2\u05D1\u05E8|\u05EA\u05E2\u05D1\u05D9\u05E8|\u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA|\u05DE\u05D9\u05D9\u05DC\u05D9\u05DD|\u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8)/.test(text);
  const rateQ = /(?:\u05E9\u05D9?\u05E2\u05E8|\u05DE\u05D8\u05D1\u05E2|\u05D3\u05D5\u05DC\u05E8|\u05D0\u05D9\u05E8\u05D5|\u05D9\u05D5\u05E8\u05D5|\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF)/.test(text);
  if (words > 6 || clockQ || sendQ || (cont.kind === "contact" && rateQ)) return { status: "newcommand" };
  return { status: "reask" };
}
__name(resolveContinuation, "resolveContinuation");
__name2(resolveContinuation, "resolveContinuation");
__name22(resolveContinuation, "resolveContinuation");
async function currentBtcPrice() {
  try {
    const cb = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (cb.ok) {
      const v = parseFloat((await cb.json()).data?.amount);
      if (Number.isFinite(v) && v > 0) return v;
    }
  } catch (_) {
  }
  try {
    const b = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (b.ok) {
      const v = (await b.json())?.bitcoin?.usd;
      if (Number.isFinite(v) && v > 0) return v;
    }
  } catch (_) {
  }
  return null;
}
__name(currentBtcPrice, "currentBtcPrice");
__name2(currentBtcPrice, "currentBtcPrice");
__name22(currentBtcPrice, "currentBtcPrice");
function dollarRateText(rate) {
  const shekels = Math.floor(rate);
  const agorot = Math.round((rate - shekels) * 100);
  const shekelWords = ["\u05D0\u05E4\u05E1", "\u05D0\u05D7\u05D3", "\u05E9\u05E0\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9\u05D4", "\u05D0\u05E8\u05D1\u05E2\u05D4", "\u05D7\u05DE\u05D9\u05E9\u05D4", "\u05E9\u05D9\u05E9\u05D4", "\u05E9\u05D1\u05E2\u05D4", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2\u05D4"];
  const agoraWords = ["\u05D0\u05E4\u05E1", "\u05D0\u05D7\u05EA", "\u05E9\u05EA\u05D9\u05D9\u05DD", "\u05E9\u05DC\u05D5\u05E9", "\u05D0\u05E8\u05D1\u05E2", "\u05D7\u05DE\u05E9", "\u05E9\u05E9", "\u05E9\u05D1\u05E2", "\u05E9\u05DE\u05D5\u05E0\u05D4", "\u05EA\u05E9\u05E2"];
  const amount = shekels >= 0 && shekels < shekelWords.length && agorot >= 0 && agorot < agoraWords.length ? `${shekelWords[shekels]} \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5${agoraWords[agorot]} \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA` : `${rate.toFixed(2)} \u05E9\u05E7\u05DC\u05D9\u05DD`;
  return `\u05D4\u05E9\u05E2\u05E8 \u05D4\u05D9\u05E6\u05D9\u05D2 \u05D4\u05D0\u05D7\u05E8\u05D5\u05DF \u05E9\u05E4\u05E8\u05E1\u05DD \u05D1\u05E0\u05E7 \u05D9\u05E9\u05E8\u05D0\u05DC \u05D4\u05D5\u05D0 ${amount} \u05DC\u05D3\u05D5\u05DC\u05E8`;
}
__name(dollarRateText, "dollarRateText");
__name2(dollarRateText, "dollarRateText");
__name22(dollarRateText, "dollarRateText");
function euroRateText(rate) {
  const eShekels = Math.floor(rate);
  const eAgorot = Math.round((rate - eShekels) * 100);
  return `\u05E9\u05E2\u05E8 \u05D4\u05D0\u05D9\u05E8\u05D5 \u05DE\u05D5\u05DC \u05D4\u05E9\u05E7\u05DC \u05D4\u05D5\u05D0 ${eShekels} \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5 ${eAgorot} \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA`;
}
__name(euroRateText, "euroRateText");
__name2(euroRateText, "euroRateText");
__name22(euroRateText, "euroRateText");
async function chatSendConfirm(env, callerPhone, to, toName, text, prefixNote) {
  logEvent("chat_send_pending_confirm", { caller: callerTail(callerPhone) });
  return await pendingConfirmRead(env, callerPhone, { kind: "chat", to, text: text || "", name: toName || "" }, `${prefixNote || ""}\u05DC\u05E9\u05DC\u05D5\u05D7 \u05D1\u05E6\u05D0\u05D8 \u05D0\u05DC ${speakAddress(to)} \u05D0\u05EA \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4 ${text || ""}? \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA, \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC \u05D4\u05E7\u05E9 \u05E9\u05EA\u05D9\u05D9\u05DD`);
}
__name(chatSendConfirm, "chatSendConfirm");
__name2(chatSendConfirm, "chatSendConfirm");
__name22(chatSendConfirm, "chatSendConfirm");
async function emailSendConfirm(env, callerPhone, to, toName, subject, body, prefixNote) {
  logEvent("email_send_pending_confirm", { caller: callerTail(callerPhone) });
  return await pendingConfirmRead(env, callerPhone, { kind: "email", to, subject: subject || "", body: body || "", name: toName || "" }, `${prefixNote || ""}\u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC \u05D0\u05DC ${speakAddress(to)}, \u05D1\u05E0\u05D5\u05E9\u05D0 ${subject || "\u05DC\u05DC\u05D0 \u05E0\u05D5\u05E9\u05D0"}, \u05E2\u05DD \u05D4\u05EA\u05D5\u05DB\u05DF ${body || "\u05E8\u05D9\u05E7"}? \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA, \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC \u05D4\u05E7\u05E9 \u05E9\u05EA\u05D9\u05D9\u05DD`);
}
__name(emailSendConfirm, "emailSendConfirm");
__name2(emailSendConfirm, "emailSendConfirm");
__name22(emailSendConfirm, "emailSendConfirm");
async function executeContinuation(env, cont, res, callerPhone, requestId) {
  try {
    if (cont.kind === "currency" && res.currency) {
      let msg = "";
      if (res.currency === "usd") {
        const r = await currentDollarRate();
        if (!r) throw new Error("no usd rate");
        msg = dollarRateText(r.rate);
      } else if (res.currency === "eur") {
        const r = await currentEuroRate();
        if (!r) throw new Error("no eur rate");
        msg = euroRateText(r);
      } else if (res.currency === "btc") {
        const p = await currentBtcPrice();
        if (!p) throw new Error("no btc price");
        msg = `\u05DE\u05D7\u05D9\u05E8 \u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF \u05DB\u05E8\u05D2\u05E2: ${Math.round(p).toLocaleString("en-US")} \u05D3\u05D5\u05DC\u05E8`;
      }
      if (msg) {
        await clearContState(env, callerPhone);
        await saveConvoTurn(env, String(cont.originalRequest || "") + " " + (res.currency === "usd" ? "\u05D3\u05D5\u05DC\u05E8" : res.currency === "eur" ? "\u05D0\u05D9\u05E8\u05D5" : "\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF"), msg);
        return speak(msg);
      }
      return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E7\u05D1\u05DC \u05DB\u05E8\u05D2\u05E2 \u05D0\u05EA \u05E9\u05E2\u05E8 \u05D4\u05DE\u05D8\u05D1\u05E2, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05E8\u05D2\u05E2");
    }
    if (cont.kind === "contact" && res.contact) {
      const contact = res.contact;
      if (cont.action === "chat_send") {
        await clearContState(env, callerPhone);
        logEvent("cont_contact_resolved", { channel: "chat", caller: callerTail(callerPhone) });
        return await chatSendConfirm(env, callerPhone, contact.address, contact.name, (cont.payload && cont.payload.text) || "", "");
      }
      if (cont.action === "email_send") {
        await clearContState(env, callerPhone);
        logEvent("cont_contact_resolved", { channel: "email", caller: callerTail(callerPhone) });
        return await emailSendConfirm(env, callerPhone, contact.address, contact.name, (cont.payload && cont.payload.subject) || "", (cont.payload && cont.payload.body) || "", "");
      }
    }
    await clearContState(env, callerPhone);
    return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  } catch (e) {
    logEvent("cont_execute_failed", { type: e?.name || "Error" });
    return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DB\u05E8\u05D2\u05E2 \u05DC\u05D4\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1 \u05E2\u05D5\u05D3 \u05E8\u05D2\u05E2");
  }
}
__name(executeContinuation, "executeContinuation");
__name2(executeContinuation, "executeContinuation");
__name22(executeContinuation, "executeContinuation");
function buildWhisperPrompt(contacts) {
  const base = "\u05E9\u05D9\u05D7\u05D4 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05E7\u05D5 \u05D8\u05DC\u05E4\u05D5\u05DF. \u05DE\u05D5\u05E0\u05D7\u05D9\u05DD: \u05EA\u05D6\u05DB\u05D9\u05E8, \u05E9\u05E2\u05D4, \u05EA\u05D0\u05E8\u05D9\u05DA, \u05D3\u05D5\u05DC\u05E8, \u05D0\u05D9\u05E8\u05D5, \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC, \u05E0\u05E7\u05D5\u05D3\u05D4, \u05DE\u05D9\u05D9\u05DC, \u05E6\u05D0\u05D8, \u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF.";
  const names = [];
  for (const c of (contacts || []).slice(0, 40)) {
    for (const v of [c.name, ...(c.aliases || [])]) {
      const n = String(v || "").trim();
      if (n.length >= 2 && n.length <= 30 && /^[\u05D0-\u05EAa-zA-Z0-9 .]+$/.test(n) && !names.includes(n)) names.push(n);
      if (names.length >= 40) break;
    }
    if (names.length >= 40) break;
  }
  if (!names.length) return base;
  return (base + " \u05E9\u05DE\u05D5\u05EA \u05D0\u05E0\u05E9\u05D9 \u05E7\u05E9\u05E8 \u05D0\u05E4\u05E9\u05E8\u05D9\u05D9\u05DD: " + names.join(", ").slice(0, 700) + ".").slice(0, 900);
}
__name(buildWhisperPrompt, "buildWhisperPrompt");
__name2(buildWhisperPrompt, "buildWhisperPrompt");
__name22(buildWhisperPrompt, "buildWhisperPrompt");
function findContactMatches(contacts, requestedName) {
  const variants = nameVariants(requestedName);
  for (const wanted of variants) {
    if (wanted.length < 2) continue;
    const exact = contacts.filter((contact) => [contact.name, ...contact.aliases || []].some((value) => normalizeContactTerm(value) === wanted));
    if (exact.length) return exact;
  }
  for (const wanted of variants) {
    if (wanted.length < 2) continue;
    const sub = contacts.filter((contact) => [contact.name, ...contact.aliases || []].some((value) => {
      const n = normalizeContactTerm(value);
      return n.length >= 2 && (n.includes(wanted) || (wanted.length >= 3 && wanted.includes(n)));
    }));
    if (sub.length) return sub;
  }
  return [];
}
__name(findContactMatches, "findContactMatches");
__name2(findContactMatches, "findContactMatches");
__name22(findContactMatches, "findContactMatches");
function levenshteinDistance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
__name(levenshteinDistance, "levenshteinDistance");
__name2(levenshteinDistance, "levenshteinDistance");
__name22(levenshteinDistance, "levenshteinDistance");
function findFuzzyContact(contacts, requestedName) {
  const wanted = normalizeContactTerm(requestedName);
  if (!wanted || wanted.length < 2) return null;
  let best = null, bestScore = 0;
  for (const contact of contacts || []) {
    const candidates = [contact.name, ...(contact.aliases || []), String(contact.address || "").split("@")[0]];
    for (const cand of candidates) {
      const c = normalizeContactTerm(cand);
      if (!c) continue;
      let score = 1 - levenshteinDistance(wanted, c) / Math.max(wanted.length, c.length, 1);
      if (c.includes(wanted) && wanted.length >= 3) score = Math.max(score, 0.85);
      if (wanted.includes(c) && c.length >= 3) score = Math.max(score, 0.8);
      if (score > bestScore) { bestScore = score; best = contact; }
    }
  }
  return bestScore >= 0.62 ? best : null;
}
__name(findFuzzyContact, "findFuzzyContact");
__name2(findFuzzyContact, "findFuzzyContact");
__name22(findFuzzyContact, "findFuzzyContact");
function speakAddress(addr) {
  return String(addr || "").replace(/@/g, " \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC ").replace(/\./g, " \u05E0\u05E7\u05D5\u05D3\u05D4 ");
}
__name(speakAddress, "speakAddress");
__name2(speakAddress, "speakAddress");
__name22(speakAddress, "speakAddress");
async function saveConvoTurn(env, userText, answerText) {
  try {
    const callId = String(globalThis.__callId || "").slice(0, 80);
    if (!env.USER_MEMORY || !callId) return;
    const key = "convo_" + callId;
    let prev = {};
    try { prev = JSON.parse(await env.USER_MEMORY.get(key) || "{}") || {}; } catch (_) {}
    const turns = [...(prev.turns || []), { u: String(userText || "").slice(0, 200), a: String(answerText || "").slice(0, 300) }].slice(-6);
    await env.USER_MEMORY.put(key, JSON.stringify({ turns, lastUser: String(userText || "").slice(0, 200), lastAnswer: String(answerText || "").slice(0, 300), ts: Date.now() }), { expirationTtl: 900 });
  } catch (_) {}
}
__name(saveConvoTurn, "saveConvoTurn");
__name2(saveConvoTurn, "saveConvoTurn");
__name22(saveConvoTurn, "saveConvoTurn");
function asksEuroRate(text) {
  const q = String(text || "");
  return /(?:\u05E9\u05D9?\u05E2\u05E8|\u05E1[\u05D9]?\u05E2\u05E8|\u05DE\u05D7\u05D9\u05E8|\u05DB\u05DE\u05D4).{0,20}(?:\u05D0\u05D9\u05D9?\u05E8\u05D5|\u05D9\u05D5\u05E8\u05D5|euro)|(?:\u05D0\u05D9\u05D9?\u05E8\u05D5|\u05D9\u05D5\u05E8\u05D5|euro).{0,20}(?:\u05E9\u05D9?\u05E2\u05E8|\u05E1[\u05D9]?\u05E2\u05E8|\u05DE\u05D7\u05D9\u05E8|\u05DB\u05DE\u05D4|\u05E9\u05E7\u05D9\u05DC\u05D9\u05DD)/.test(q);
}
__name(asksEuroRate, "asksEuroRate");
__name2(asksEuroRate, "asksEuroRate");
__name22(asksEuroRate, "asksEuroRate");
async function currentEuroRate() {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?from=EUR&to=ILS", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.ILS;
    return typeof rate === "number" ? rate : null;
  } catch (_) {
    return null;
  }
}
__name(currentEuroRate, "currentEuroRate");
__name2(currentEuroRate, "currentEuroRate");
__name22(currentEuroRate, "currentEuroRate");
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
__name22(saveContact, "saveContact");
async function contactChoiceNames(contacts) {
  return contacts.map((contact) => contact.name).slice(0, 4).join(" \u05D0\u05D5 ");
}
__name(contactChoiceNames, "contactChoiceNames");
__name2(contactChoiceNames, "contactChoiceNames");
__name22(contactChoiceNames, "contactChoiceNames");
async function groqChatShort(GROQ_KEY, systemPrompt, userText, maxTokens) {
  const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
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
__name22(groqChatShort, "groqChatShort");
function cleanFromName(from) {
  const s = String(from || "");
  const name = s.split("<")[0].replace(/["']/g, "").trim();
  return (name || s).slice(0, 60);
}
__name(cleanFromName, "cleanFromName");
__name2(cleanFromName, "cleanFromName");
__name22(cleanFromName, "cleanFromName");
function fmtEmailList(msgs) {
  if (!msgs || !msgs.length) return "\u05D0\u05D9\u05DF \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD \u05D1\u05EA\u05D9\u05D1\u05D4";
  const parts = msgs.map((m, i) => `\u05DE\u05D9\u05D9\u05DC ${i + 1}, \u05DE\u05D0\u05EA ${cleanFromName(m.from)}, \u05D1\u05E0\u05D5\u05E9\u05D0 ${(m.subject || "\u05DC\u05DC\u05D0 \u05E0\u05D5\u05E9\u05D0").slice(0, 60)}`);
  return `\u05D9\u05E9 \u05DC\u05DA ${msgs.length} \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD. ${parts.join(". ")}. \u05DC\u05D4\u05E9\u05DE\u05E2\u05EA \u05DE\u05D9\u05D9\u05DC \u05D0\u05DE\u05D5\u05E8, \u05E7\u05E8\u05D0 \u05DC\u05D9 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05DE\u05E1\u05E4\u05E8...`;
}
__name(fmtEmailList, "fmtEmailList");
__name2(fmtEmailList, "fmtEmailList");
__name22(fmtEmailList, "fmtEmailList");
function normalizeAddress(addr) {
  let a = String(addr || "").trim().replace(/שטרודל/g, "@").replace(/נקודה/g, ".").replace(/\s+/g, "");
  if (a && !a.includes("@") && /^[a-zA-Z0-9._%+-]+$/.test(a)) a = a + "@gmail.com";
  return a.replace(/[^a-zA-Z0-9._@%+-]/g, "");
}
__name(normalizeAddress, "normalizeAddress");
__name2(normalizeAddress, "normalizeAddress");
__name22(normalizeAddress, "normalizeAddress");
function makeRequestId(callerPhone, recordingPath) {
  return `call_${normalizeIsraelPhone(callerPhone) || "unknown"}_${String(recordingPath || "").replace(/[^A-Za-z0-9_-]/g, "_")}`.slice(0, 120);
}
__name(makeRequestId, "makeRequestId");
__name2(makeRequestId, "makeRequestId");
__name22(makeRequestId, "makeRequestId");
function normalizeIsraelPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("972")) digits = "0" + digits.slice(3);
  return digits;
}
__name(normalizeIsraelPhone, "normalizeIsraelPhone");
__name2(normalizeIsraelPhone, "normalizeIsraelPhone");
__name22(normalizeIsraelPhone, "normalizeIsraelPhone");
async function routeCommunication(env, GROQ_KEY, transcribedText, callerPhone, requestId) {
  const routerPrompt = '\u05D0\u05EA\u05D4 \u05DE\u05DE\u05D9\u05D9\u05DF \u05D1\u05E7\u05E9\u05EA \u05EA\u05E7\u05E9\u05D5\u05E8\u05EA \u05DE\u05D4\u05D8\u05DC\u05E4\u05D5\u05DF. \u05D4\u05D7\u05D6\u05E8 JSON \u05D1\u05DC\u05D1\u05D3: {"service":"email"} \u05DB\u05E9\u05DE\u05D3\u05D5\u05D1\u05E8 \u05D1\u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D3\u05D5\u05D0\u05E8, {"service":"chat"} \u05DB\u05E9\u05DE\u05D3\u05D5\u05D1\u05E8 \u05D1\u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8, \u05E6\u05D0\u05D8 \u05D0\u05D5 \u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05D4, \u05D0\u05D5 {"service":"ask"} \u05DB\u05E9\u05D0\u05D9 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D3\u05E2\u05EA. \u05D2\u05DD \u05D0\u05DD \u05D4\u05DE\u05D9\u05DC\u05D4 \u05D4\u05D5\u05E2\u05EA\u05E7\u05D4 \u05DC\u05D0 \u05E0\u05DB\u05D5\u05DF, \u05D4\u05D1\u05DF \u05DC\u05E4\u05D9 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4.';
  const raw = await groqChatShort(GROQ_KEY, routerPrompt, transcribedText, 80);
  const matched = raw.match(/\{[\s\S]*\}/);
  let service = "ask";
  if (matched) try {
    service = JSON.parse(matched[0]).service || "ask";
  } catch (_) {
  }
  logEvent("communication_routed", { service: String(service).slice(0, 12), caller: callerTail(callerPhone) });
  if (service === "email") return await handleEmail(env, GROQ_KEY, transcribedText, callerPhone, requestId);
  if (service === "chat") return await handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone, requestId);
  await saveConvoTurn(env, transcribedText, "\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D0\u05DD \u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D4\u05D5\u05D3\u05E2\u05EA \u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8");
  return speak("\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D0\u05DD \u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D4\u05D5\u05D3\u05E2\u05EA \u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8. \u05D0\u05DE\u05D5\u05E8 \u05DE\u05D9\u05D9\u05DC \u05D0\u05D5 \u05D2\u05D5\u05D2\u05DC \u05E6\u05D0\u05D8 \u05D1\u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05D1\u05E7\u05E9\u05D4");
}
__name(routeCommunication, "routeCommunication");
__name2(routeCommunication, "routeCommunication");
__name22(routeCommunication, "routeCommunication");
async function pendingConfirmRead(env, callerPhone, pend, promptText) {
  const full = String(promptText || "");
  const marker = "\u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA";
  const cut = full.indexOf(marker);
  const head = (cut > 0 ? full.slice(0, cut) : full).replace(/[?.,;:!\s]+$/g, "").replace(/[=\r\n]+/g, " ").slice(0, 300);
  const question = "\u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA, \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC \u05D4\u05E7\u05E9 \u05E9\u05EA\u05D9\u05D9\u05DD";
  await env.USER_MEMORY.put("pend_" + normalizeIsraelPhone(callerPhone), JSON.stringify(pend), { expirationTtl: 300 });
  return textResponse(`id_list_message=t-${head}.&read=t-${question}=confirm,no,1,1,15,Digits,yes,yes,,,,,None,`);
}
__name(pendingConfirmRead, "pendingConfirmRead");
__name2(pendingConfirmRead, "pendingConfirmRead");
__name22(pendingConfirmRead, "pendingConfirmRead");async function handleConfirm(env, confirmValue, callerPhone) {
  try {
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("אין הרשאה לביצוע הפעולה ממספר זה");
    const pendKey = "pend_" + normalizeIsraelPhone(callerPhone);
    const raw = await env.USER_MEMORY.get(pendKey);
    if (!raw) return speak("אין פעולה ממתינה לאישור, הגדר אותה מחדש");
    const pend = JSON.parse(raw);
    await env.USER_MEMORY.delete(pendKey);
    if (String(confirmValue) !== "1") {
      logEvent("action_cancelled", { caller: callerTail(callerPhone) });
      return speak("הפעולה בוטלה");
    }
    logEvent("action_confirmed", { kind: String(pend.kind || "?").slice(0, 12), caller: callerTail(callerPhone) });
    if (pend.kind === "email") {
      const data = await callBridge(env, { action: "send", to: pend.to, subject: pend.subject || "", body: pend.body || "", inReplyTo: pend.inReplyTo, threadId: pend.threadId, requestId: "confirm" });
      logEvent("email_send", { ok: Boolean(data.ok), confirmed: true });
      if (!data.ok) return speak("שליחת המייל נכשלה, נסה שוב");
      await setLastTarget(env, callerPhone, pend.name || "", pend.to, "email");
      return speak("המייל נשלח בהצלחה");
    }
    if (pend.kind === "chat") {
      const data = await callBridge(env, { action: "chat_send_text", to: pend.to, text: pend.text || "", requestId: "confirm" });
      logEvent("chat_send", { ok: Boolean(data.ok), confirmed: true });
      if (!data.ok) return speak("שליחת הודעת הצאט נכשלה");
      await setLastTarget(env, callerPhone, pend.name || "", pend.to, "chat");
      return speak("הודעת הצאט נשלחה בהצלחה");
    }
    return speak("אין פעולה ממתינה לאישור");
  } catch (e) {
    logEvent("confirm_error", { type: e?.name || "Error" });
    return speak("יש תקלה באישור הפעולה, נסה שוב");
  }
}
__name(handleConfirm, "handleConfirm");
__name2(handleConfirm, "handleConfirm");
__name22(handleConfirm, "handleConfirm");
async function handleEmail(env, GROQ_KEY, transcribedText, callerPhone, requestId) {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) {
      return speak("הגישה הטלפונית למייל עדיין בהגדרה, אין כרגע אפשרות לקרוא או לשלוח מיילים בטלפון");
    }
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) {
      return speak("אין הרשאה לגישה למייל ממספר זה");
    }
    const plannerSystem = 'אתה מנתש בקשות מייל לפעולות. החזר JSON בלבד בלי הסברים בפורמט {"action":"...","params":{}}. אפשרויות: {"action":"list","params":{"count":5}} רשימת מיילים אחרונים. {"action":"summarize","params":{"count":5}} סיכום מיילים. {"action":"read","params":{"index":2}} קריאת מייל לפי מספרו ברשימה. {"action":"search","params":{"query":"..."}} חיפוש מיילים. {"action":"send","params":{"to":"...","subject":"...","body":"..."}} שליחת מייל חדש. {"action":"reply","params":{"index":1,"body":"..."}} מענה למייל. {"action":"forward","params":{"index":1,"to":"..."}} העברת מייל. בכתובות מייל: שטרודל פירושו סימן @ ונקודה פירושה נקודה. אם הנמען נאמר בשם או בכינוי ולא בכתובת מלאה, החזר אך ורק את השם שנאמר בשדה to ואל תוסיף דומיין או כתובת בעצמך. גם אם הנמען לא מוכר לך, אם זו בקשת שליחה ברורה החזר send עם השם שנאמר. כתובות מייל תמיד באותיות באנגלית בלבד. אם הבקשה לא ברורה החזר {"action":"none"}. אם הנמען הוא כינוי כמו לו, לה או אליו, החזר את הכינוי בשדה to כפי שנאמר.';
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
      if (/(?:שלח|תשלח|שלוח|שליחה|העבר|תעביר)/.test(transcribedText)) return speak("אמור את כתובת המייל ואת תוכן ההודעה, למשל שלח מייל לכתובת, עם הודעה");
      await saveConvoTurn(env, transcribedText, "לא הבנתי איזו פעולת מייל ברצונך לבצע");
      return speak("לא הבנתי איזו פעולת מייל ברצונך לבצע");
    }
    const p = plan.params || {};
    logEvent("email_intent", { action: String(plan.action).slice(0, 20), caller: callerTail(callerPhone) });
    const listKey = "lastlist_" + callerPhone;
    if (plan.action === "list" || plan.action === "summarize" || plan.action === "search") {
      const payload = plan.action === "search" ? { action: "search", query: p.query || "", max: parseInt(p.count) || 5 } : { action: "list", max: Math.min(parseInt(p.count) || 5, 10) };
      const data = await callBridge(env, payload);
      if (!data.ok) {
        logEvent("email_bridge_failed", { action: plan.action });
        return speak("אין עדיין חיבור פעל למייל, יש להשלים את אישור ההרשאה");
      }
      const msgs = data.messages || [];
      await kvSetList(env, listKey, { messages: msgs, ts: Date.now() });
      if (plan.action === "summarize") {
        const digest = msgs.map((m, i) => `${i + 1}. מאת ${cleanFromName(m.from)}, נושא ${m.subject}: ${m.snippet || ""}`).join("\n");
        if (!digest) return speak("אין מיילים לסיכום");
        const ans = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית בטלפון. סכם את רשימת המיילים הבאה בעברית ברורה וקצרה, מקסימום 5 משפטים. אל תשתמש בנקודות או במקפים בתשובה.", digest, 300);
        return speak(ans || fmtEmailList(msgs));
      }
      return speak(fmtEmailList(msgs));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("אין רשימת מיילים פעילה, בקש קודם את רשימת המיילים האחרונים");
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id });
      if (!data.ok) return speak("יש תקלה בפתיחת המייל, נסה שוב");
      const ans = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית בטלפון. הקרא את המייל הבא בעברית טבעית וברורה, מקסימום 6 משפטים, בלי נקודות ובלי מקפים. מאת " + cleanFromName(data.from) + ", בנושא " + (data.subject || "ללא נושא") + ", והתוכן הוא: " + (data.body || "").slice(0, 1800), "הקרא את המייל", 450);
      return speak(ans || "לא הצלחתי להקריא את המייל");
    }
    if (plan.action === "send") {
      const rawTo = String(p.to || "").trim();
      const hasAddress = rawTo.includes("@") || rawTo.includes("\u05E9\u05D8\u05E8\u05D5\u05D3\u05DC");
      let to = "", toName = "", resolveNote = "";
      if (!hasAddress && isPronounRef(rawTo)) {
        const lt = await kvGetList(env, lastTargetKey(callerPhone));
        if (lt && lt.address) {
          to = lt.address;
          toName = String(lt.name || "");
          resolveNote = "\u05DC" + (toName || "\u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8") + " ";
        } else {
          return speak("\u05D0\u05D9\u05DF \u05DC\u05D9 \u05D9\u05E2\u05D3 \u05D0\u05D7\u05E8\u05D5\u05DF \u05DC\u05E9\u05DC\u05D5\u05D7 \u05D0\u05DC\u05D9\u05D5. \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05E9\u05DD \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8 \u05D0\u05D5 \u05D0\u05EA \u05D4\u05DB\u05EA\u05D5\u05D1\u05EA");
        }
      }
      if (!to) {
        if (hasAddress) {
          to = normalizeAddress(rawTo);
        } else {
          if (!rawTo) return speak("\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05DC\u05DE\u05D9 \u05DC\u05E9\u05DC\u05D5\u05D7 \u05D0\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC. \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05E9\u05DD \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8 \u05D0\u05D5 \u05D0\u05EA \u05D4\u05DB\u05EA\u05D5\u05D1\u05EA");
          const contacts = await getContacts(env, callerPhone);
          const matches = findContactMatches(contacts, rawTo);
          if (matches.length === 1) {
            to = matches[0].address;
            toName = matches[0].name;
          } else if (matches.length > 1) {
            const question = contQuestionFor(matches);
            await setContState(env, callerPhone, { kind: "contact", action: "email_send", payload: { subject: p.subject || "", body: p.body || "" }, candidates: slimCandidates(matches), originalRequest: transcribedText, question, ts: Date.now() });
            logEvent("email_contact_clarify", { count: matches.length, caller: callerTail(callerPhone) });
            return speak(question);
          } else {
            const fuzzyContact = findFuzzyContact(contacts, rawTo);
            if (fuzzyContact) {
              to = fuzzyContact.address;
              toName = fuzzyContact.name;
              resolveNote = "\u05D4\u05D0\u05DD \u05D4\u05EA\u05DB\u05D5\u05D5\u05E0\u05EA \u05DC" + fuzzyContact.name + "? ";
            } else {
              const addrGuess = normalizeAddress(rawTo);
              if (addrGuess.includes("@") && addrGuess.split("@")[1]?.includes(".")) {
                to = addrGuess;
              } else {
                return speak("\u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D1\u05E9\u05DD \u05D6\u05D4. \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D4\u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05DC\u05D0\u05D4 \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC, \u05D0\u05D5 \u05D0\u05DE\u05D5\u05E8 \u05D1\u05E6\u05D0\u05D8 \u05E9\u05DE\u05D5\u05E8 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8, \u05E9\u05DD \u05D5\u05DB\u05EA\u05D5\u05D1\u05EA");
              }
            }
          }
        }
      }
      if (!to.includes("@") || !(to.split("@")[1] || "").includes(".")) return speak("\u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05D7\u05E1\u05E8\u05D4 \u05E1\u05D9\u05D5\u05DE\u05EA, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05D5\u05EA\u05D4 \u05E9\u05D5\u05D1 \u05D1\u05D1\u05D9\u05E8\u05D5\u05EA");
      return await emailSendConfirm(env, callerPhone, to, toName, p.subject || "", p.body || "", resolveNote);
    }
    if (plan.action === "reply" || plan.action === "forward") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("אין רשימת מיילים פעילה, בקש קודם את רשימת המיילים");
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id });
      if (!data.ok) return speak("יש תקלה בפתיחת המייל, נסה שוב");
      if (plan.action === "reply") {
        const subj = (data.subject || "").startsWith("Re:") ? data.subject : "Re: " + (data.subject || "");
        logEvent("email_reply_pending_confirm", { caller: callerTail(callerPhone) });
        return await pendingConfirmRead(env, callerPhone, { kind: "email", to: data.fromAddr || data.from, subject: subj, body: p.body || "", inReplyTo: data.id, threadId: data.threadId, name: cleanFromName(data.from) }, `לענות למייל מאת ${cleanFromName(data.from)}, בנושא ${data.subject || ""}, עם התוכן ${p.body || "ריק"}? לאישור הקש אחת, לביטול הקש שתיים`);
      }
      const to = normalizeAddress(p.to);
      if (!to.includes("@") || !to.split("@")[1]) return speak("אמור שוב את כתובת ההעברה, כולל שטרודל");
      const fwdBody = "הודעה שהועברה אליך:\n" + (data.body || "").slice(0, 3e3);
      logEvent("email_forward_pending_confirm", { caller: callerTail(callerPhone) });
      return await pendingConfirmRead(env, callerPhone, { kind: "email", to, subject: "העברה של " + (data.subject || "מייל"), body: fwdBody }, `להעביר את המייל בנושא ${data.subject || ""} אל ${to}? לאישור הקש אחת, לביטול הקש שתיים`);
    }
    return speak("לא הבנתי את בקשת המייל");
  } catch (e) {
    logEvent("email_error", { type: e?.name || "Error" });
    return speak("יש תקלה במערכת המייל, נסה שוב");
  }
}
__name(handleEmail, "handleEmail");
__name2(handleEmail, "handleEmail");
__name22(handleEmail, "handleEmail");
function fmtChatList(messages) {
  if (!messages || !messages.length) return "\u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA";
  const parts = messages.slice(0, 5).map((message, index) => `\u05D4\u05D5\u05D3\u05E2\u05D4 ${index + 1}, \u05DE\u05D0\u05EA ${cleanFromName(message.sender || "\u05E9\u05D5\u05DC\u05D7 \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2")}, ${String(message.text || "\u05D4\u05D5\u05D3\u05E2\u05D4 \u05DC\u05DC\u05D0 \u05D8\u05E7\u05E1\u05D8").slice(0, 140)}`);
  return `\u05DE\u05E6\u05D0\u05EA\u05D9 ${messages.length} \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05D1\u05E6\u05D0\u05D8. ${parts.join(". ")}. \u05DB\u05D3\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D0\u05DE\u05D5\u05E8 \u05E7\u05E8\u05D0 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05DE\u05E1\u05E4\u05E8`;
}
__name(fmtChatList, "fmtChatList");
__name2(fmtChatList, "fmtChatList");
__name22(fmtChatList, "fmtChatList");async function handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone, requestId = "") {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) return speak("הגישה לצאט עדיין בהגדרה");
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("הגישה לצאט מותרת רק מהטלפון של בעל החשבון");
    const planner = `אתה מנתח בקשות ל Google Chat. החזר JSON בלבד בלי הסברים בפורמט {"action":"...","params":{}}. פעולות: unread לקבלת הודעות חדשות, search לחיפוש הודעות לפי מילים, read לקריאת הודעה לפי מספר מהרשימה האחרונה, send_text לשליחת הודעת טקסט, save_contact לשמירת איש קשר. לשליחה החזר {"action":"send_text","params":{"to":"שם איש קשר, כינוי, או כתובת אימייל מלאה","text":"תוכן ההודעה"}}. לשמירת איש קשר החזר {"action":"save_contact","params":{"name":"שם","address":"כתובת אימייל מלאה","aliases":["כינוי"]}}. המילה שטרודל היא @ ונקודה היא . אין לנחש כתובת חסרה. כשמבקשים לשלוח הודעת קול או הודעה מתומללת, הפעולה היא send_text והטקסט הוא תוכן ההודעה שנאמר. כשלא ברור החזר {"action":"none","params":{}}. כתובות מייל באנגלית בלבד. אם הנמען נאמר בשם, החזר את השם כפי שנאמר בלבד ואל תמציא כתובת בעצמך. כלל עדיפות חשוב: אם הבקשה מבקשת לשלוש הודעה לאיש קשר כלשהו, החזר תמיד send_text ולא חיפוש, גם אם הניסוח הוא בלשון עבר כמו נשלח, וגם אם הבקשה מוסיפה בתוכה לראות או לבדוק אם ההודעה הגיעה. פעולות search ו unread רק כשהבקשה היא לקרוא או לחפש הודעות שהתקבלו. אם הנמען הוא כינוי כמו לו, לה או אליו, החזר את הכינוי בשדה to כפי שנאמר.`;
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
      if (!name) return speak("לא שמעתי את שם איש הקשר");
      if (!address.includes("@") || !address.split("@")[1]?.includes(".")) return speak("אמור שוב את כתובת המייל המלאה של איש הקשר, כולל שטרודל ונקודה");
      const saved = await saveContact(env, callerPhone, name, address, params.aliases || params.alias || []);
      logEvent("chat_contact_saved", { ok: saved });
      return saved ? speak(`איש הקשר ${name} נשמר בהצלחה`) : speak("לא הצלחתי לשמור את איש הקשר");
    }
    if (plan.action === "unread" || plan.action === "search") {
      const payload = plan.action === "search" ? { action: "chat_search", query: params.query || "", max: Math.min(parseInt(params.count) || 5, 10) } : { action: "chat_unread", max: Math.min(parseInt(params.count) || 5, 10) };
      const data = await callBridge(env, payload);
      if (!data.ok) return speak("לא הצלחתי כרגע לקרוא את הודעות הצאט");
      await kvSetList(env, listKey, { messages: data.messages || [], ts: Date.now() });
      return speak(fmtChatList(data.messages || []));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const item = list?.messages?.[(parseInt(params.index) || 1) - 1];
      if (!item) return speak("אין רשימת הודעות צאט פעילה, בקש קודם הודעות חדשות");
      const data = await callBridge(env, { action: "chat_get", name: item.name });
      if (!data.ok) return speak("לא הצלחתי לפתוח את הודעת הצאט");
      const answer = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית. הקרא את הודעת הצאט בקצרה ובצורה ברורה, עד ארבעה משפטים.", `מאת ${data.message?.sender || "שולח לא ידוע"}. תוכן: ${data.message?.text || "ללא טקסט"}`, 350);
      return speak(answer || "לא הצלחתי להקריא את ההודעה");
    }
    if (plan.action === "send_text") {
      const rawTo = String(params.to || "").trim();
      const text = String(params.text || "").trim();
      if (!text) return speak("לא שמעתי את תוכן ההודעה");
      const hasAddress = rawTo.includes("@") || rawTo.includes("\u05E9\u05D8\u05E8\u05D5\u05D3\u05DC");
      let to = "", toName = "", prefixNote = "";
      if (!hasAddress && isPronounRef(rawTo)) {
        const lt = await kvGetList(env, lastTargetKey(callerPhone));
        if (lt && lt.address) {
          to = lt.address;
          toName = String(lt.name || "");
          prefixNote = "\u05DC" + (toName || "\u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8") + " ";
        } else {
          return speak("\u05D0\u05D9\u05DF \u05DC\u05D9 \u05D9\u05E2\u05D3 \u05D0\u05D7\u05E8\u05D5\u05DF \u05DC\u05E9\u05DC\u05D5\u05D7 \u05D0\u05DC\u05D9\u05D5. \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05E9\u05DD \u05D0\u05D9\u05E9 \u05D4\u05E7\u05E9\u05E8 \u05D0\u05D5 \u05D0\u05EA \u05D4\u05DB\u05EA\u05D5\u05D1\u05EA");
        }
      }
      if (!to) {
        if (hasAddress) {
          to = normalizeAddress(rawTo);
        } else {
          const contacts = await getContacts(env, callerPhone);
          const matches = findContactMatches(contacts, rawTo);
          if (matches.length === 1) {
            to = matches[0].address;
            toName = matches[0].name;
          } else if (matches.length > 1) {
            const question = contQuestionFor(matches);
            await setContState(env, callerPhone, { kind: "contact", action: "chat_send", payload: { text }, candidates: slimCandidates(matches), originalRequest: transcribedText, question, ts: Date.now() });
            logEvent("chat_contact_clarify", { count: matches.length, caller: callerTail(callerPhone) });
            return speak(question);
          } else {
            const fuzzyContact = findFuzzyContact(contacts, rawTo);
            if (fuzzyContact) {
              to = fuzzyContact.address;
              toName = fuzzyContact.name;
              prefixNote = "\u05D4\u05D0\u05DD \u05D4\u05EA\u05DB\u05D5\u05D5\u05E0\u05EA \u05DC" + fuzzyContact.name + "? ";
            } else {
              const addrGuess = normalizeAddress(rawTo);
              if (addrGuess.includes("@") && addrGuess.split("@")[1]?.includes(".")) {
                to = addrGuess;
              } else {
                return speak("\u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D1\u05E9\u05DD \u05D4\u05D6\u05D4. \u05DB\u05D3\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05D0\u05DE\u05D5\u05E8, \u05D1\u05E6\u05D0\u05D8 \u05E9\u05DE\u05D5\u05E8 \u05D0\u05D9\u05E9 \u05E7\u05E9\u05E8, \u05E9\u05DD, \u05DB\u05EA\u05D5\u05D1\u05EA \u05DE\u05D9\u05D9\u05DC \u05D5\u05DB\u05D9\u05E0\u05D5\u05D9");
              }
            }
          }
        }
      }
      if (!to || !to.includes("@") || !(to.split("@")[1] || "").includes(".")) return speak("\u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05E9\u05DC \u05D4\u05E0\u05DE\u05E2\u05DF, \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC \u05D5\u05E0\u05E7\u05D5\u05D3\u05D4");
      return await chatSendConfirm(env, callerPhone, to, toName, text, prefixNote);
    }
    return speak("אפשר לשאול אם יש הודעות צאט חדשות, לבקש לקרוא הודעה, לחפש הודעה, או לשלוח הודעה מתומללת");
  } catch (error) {
    logEvent("chat_error", { type: error?.name || "Error" });
    return speak("יש תקלה בחיבור לצאט, נסה שוב");
  }
}
__name(handleGoogleChat, "handleGoogleChat");
__name2(handleGoogleChat, "handleGoogleChat");
__name22(handleGoogleChat, "handleGoogleChat");
function speak(text) {
  const clean = String(text || "").replace(/[\r\n]+/g, " ").replace(/[.\u2024\u2026]+/g, ", ").replace(/[-\u2010-\u2015]+/g, " ").replace(/[&=#%+:]/g, " ").replace(/[^a-zA-Z0-9\u0590-\u05FF\s,?!]/g, "").replace(/\s+/g, " ").replace(/,+/g, ",").substring(0, 450).trim().replace(/^[,;!?\s]+|[,;:\s]+$/g, "");
  if (!clean) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05EA\u05E7\u05D9\u05E0\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  return textResponse(`id_list_message=t-${clean}`);
}
__name(speak, "speak");
__name2(speak, "speak");
__name22(speak, "speak");
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
