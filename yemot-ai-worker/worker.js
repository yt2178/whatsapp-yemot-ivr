import { connect } from "cloudflare:sockets";
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
function splitTtsChunks(text, maxLen) {
  const t = String(text || "").trim();
  const chunks = [];
  let cur = "";
  for (const part of t.split(/(?<=[.,;:!?])\s+|\s+/)) {
    if ((cur + " " + part).trim().length > maxLen && cur) {
      chunks.push(cur.trim());
      cur = part;
    } else {
      cur = (cur ? cur + " " : "") + part;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [t];
}
__name(splitTtsChunks, "splitTtsChunks");
__name2(splitTtsChunks, "splitTtsChunks");
__name22(splitTtsChunks, "splitTtsChunks");
// ===== Edge TTS DRM v2 (מאומת מול edge-tts 7.3.1) =====
const EDGE_TKN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WIN_EPOCH = 11644473600;

const SHA256_INITIAL = [0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19];
const SHA256_STATE = [0xFD9FBEA2,0x91243CE7,0xBE499094,0xCD2E1E0A,0x6C006F49,0x04BD35AB,0xFEB0A7E4,0x03EFFBD2];
const SHA256_SCHEDULE = [0xEB24BF9E,0x1558691F,0xA0C09EE2,0x0CFA32BA,0xA622EE8C,0xD1DD9491,0xC0DD25A0,0xF9E70AB6,0xF0C31573,0x7058CE4E,0x7188E606,0x00E5AB33,0xD258B060,0x72766564];
const K14 = 0xC9DC06A7;
const SIGMA0_ADJ = 0x059C0B80;
const SIGMA1_ADJ = 0x000B92C0;
const CS64_COEF = [
  [0xE82E91B1,0xB32700D0],[0x44DE24C6,0x88DFF51D],[0x3BEB65BC,0x29514038],
  [0xC89C5933,0xB328CBDF],[0x8D1EC211,0xD405B4D5],[0x314EF5D5,0x26E55F3C],
  [0xE92491B1,0x607801C6],[0xF0A5B9D5,0x82B2C1FB],[0x06064CF3,0xFA51A3DA],
  [0xDA79FA60,0x207CC464],[0xBED20560,0x3C3C74F3],[0x89F9C9F8,0xD2D14B61],
  [0x35FA38C6,0xBB04A2C1],[0xCB49E3C6,0xC5626167],
];
const CS64_FACTOR = 0x82893933;
const CS64_ADJ0 = 0xF2F90B1A, CS64_ADJ1 = 0x0B1A0000;
const MASK = 0xFFFFFFFFn;
const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2].map(BigInt);

const rol16 = (v) => { const x = BigInt(v) & MASK; return ((x << 16n) | (x >> 16n)) & MASK; };
const sigma0 = (v) => { const x = BigInt(v); return ((x >> 7n) ^ (x << 25n) ^ (x >> 18n) ^ (x << 14n) ^ (x >> 3n)) & MASK; };
const sigma1 = (v) => { const x = BigInt(v); return ((x >> 17n) ^ (x << 15n) ^ (x >> 19n) ^ (x << 13n) ^ (x >> 10n)) & MASK; };

function wordsLE4Even(bytes) {
  const pad = (4 - (bytes.length % 4)) % 4;
  const padded = new Uint8Array(bytes.length + pad);
  padded.set(bytes);
  if (padded.length === 0) return [];
  const words = [];
  const dv = new DataView(padded.buffer);
  for (let i = 0; i < padded.length / 4; i++) words.push(BigInt(dv.getUint32(i * 4, true)));
  if (words.length % 2) words.push(0n);
  return words;
}

function expandSchedule(words, firstWord = 16) {
  for (let index = firstWord; index < 64; index++) {
    const x = words[index - 2], y = words[index - 15];
    const s1 = ((x >> 17n) ^ (x << 15n) ^ (x >> 19n) ^ (x << 13n) ^ (x >> 10n)) & MASK;
    const s0 = ((y >> 7n) ^ (y << 25n) ^ (y >> 18n) ^ (y << 14n) ^ (y >> 3n)) & MASK;
    words.push((s1 + words[index - 7] + s0 + words[index - 16]) & MASK);
  }
}

function sha256Rounds(state, words, firstRound = 0) {
  let [a, b, c, d, e, f, g, h] = state;
  const consts = firstRound === 14 ? K.map((v, i) => (i === 14 ? BigInt(K14) : v)) : K;
  for (let index = firstRound; index < 64; index++) {
    const rotE = (e << 32n) | e;
    const rotA = (a << 32n) | a;
    const S1 = (rotE >> 6n) ^ (rotE >> 11n) ^ (rotE >> 25n);
    const t1 = h + S1 + (g ^ (e & (f ^ g))) + consts[index] + words[index];
    const S0 = (rotA >> 2n) ^ (rotA >> 13n) ^ (rotA >> 22n);
    const t2 = S0 + ((a & b) | (c & (a | b)));
    const nh = (t1 + t2) & MASK;
    [a, b, c, d, e, f, g, h] = [nh, a, b, c, (d + t1) & MASK, e, f, g];
  }
  return [a, b, c, d, e, f, g, h];
}

function sha256Init(data7) {
  const dv = new DataView(data7.buffer, data7.byteOffset, data7.byteLength);
  const words = new Array(14).fill(0n);
  words.push(BigInt((dv.getUint8(0) << 16) | (dv.getUint8(1) << 8) | dv.getUint8(2)));
  words.push(BigInt(dv.getUint32(3)));
  for (let index = 16; index < 30; index++) {
    let value = BigInt(SHA256_SCHEDULE[index - 16]);
    if (index - 2 >= 14) value += (index === 16 ? (sigma1(words[index - 2]) ^ BigInt(SIGMA1_ADJ)) : sigma1(words[index - 2]));
    if (index - 7 >= 14) value += words[index - 7];
    if (index - 15 >= 14) value += (index === 29 ? (sigma0(words[index - 15]) ^ BigInt(SIGMA0_ADJ)) : sigma0(words[index - 15]));
    words.push(value & MASK);
  }
  words.push((sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + BigInt(K14) - K[14]) & MASK);
  expandSchedule(words, 31);
  const working = sha256Rounds(SHA256_STATE.map(BigInt), words, 14);
  return SHA256_INITIAL.map((s, i) => (BigInt(s) + working[i]) & MASK);
}

function sha256Digest(data) {
  if (data.length < 7) throw new Error("salt too short");
  const length = 57 + data.length;
  const rest = data.subarray(7);
  const totalPadded = Math.ceil((rest.length + 9) / 64) * 64;
  const padded = new Uint8Array(totalPadded);
  padded.set(rest, 0);
  padded[rest.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(totalPadded - 8, Math.floor((length * 8) / 2 ** 32));
  dv.setUint32(totalPadded - 4, (length * 8) >>> 0);
  let state = sha256Init(data.subarray(0, 7));
  for (let off = 0; off < totalPadded; off += 64) {
    const words = [];
    for (let i = 0; i < 16; i++) words.push(BigInt(dv.getUint32(off + i * 4)));
    expandSchedule(words, 16);
    const working = sha256Rounds(state, words, 0);
    state = state.map((s, i) => (s + working[i]) & MASK);
  }
  const out = new Uint8Array(32);
  const odv = new DataView(out.buffer);
  state.forEach((w, i) => odv.setUint32(i * 4, Number(w)));
  return out;
}

function cs64Digest(data, digest) {
  const ddv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
  const keyA = ddv.getUint32(0, true) | 1;
  const keyB = ddv.getUint32(4, true) | 1;
  const f0 = Math.imul(keyA, CS64_FACTOR) >>> 0;
  const f1 = Math.imul(keyB, CS64_FACTOR) >>> 0;
  const terms = [], offsets = [];
  for (let i = 0; i < 14; i++) {
    terms.push(Math.imul(CS64_COEF[i][0], i % 2 ? f1 : f0) >>> 0);
    offsets.push(CS64_COEF[i][1]);
  }
  const wbytes = new Uint8Array(data.length + 1);
  wbytes.set(data, 1);
  for (const [index, w] of wordsLE4Even(wbytes).entries()) {
    const word = Number(w);
    const key = index % 2 ? keyB : keyA;
    let term = Math.imul(word, key);
    let offset = Math.imul(Number(rol16(word)), index % 2 ? 0xC31713DB : 0xEF0569FB);
    if (index === 0) { term = (term + Math.imul(CS64_ADJ0, f0)) >>> 0; offset = (offset + CS64_ADJ1) >>> 0; }
    terms.push(term >>> 0);
    offsets.push(offset >>> 0);
  }
  let swapAcc = 0, swapLast = 0, state = 0, acc = 0;
  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index], y = terms[index + 1];
    let t = Number(rol16((offsets[index] + x) >>> 0));
    let q = Math.imul(t, 0x76F50F34) >>> 0;
    swapAcc = (swapAcc + ((Math.imul(Number(rol16(q)), 0xC3EFEA97) + q) >>> 0)) >>> 0;
    t = Number(rol16((offsets[index + 1] + y) >>> 0));
    q = Math.imul(t, 0x1881CE3C) >>> 0;
    swapLast = (Math.imul(Number(rol16(q)), 0x35BD1EC9) + q) >>> 0;
    swapAcc = (swapAcc + swapLast) >>> 0;

    state = (Math.imul(state, keyA) + x) >>> 0;
    state = Math.imul(Number(rol16(state)), 0xCF98B111) >>> 0;
    state = Math.imul(Number(rol16(state)), 0x87085B9F) >>> 0;
    state = Math.imul(Number(rol16(state)), 0x12CEB96D) >>> 0;
    state = Math.imul(Number(rol16(state)), 0x257E1D83) >>> 0;
    acc = (acc + state) >>> 0;
    t = (Math.imul(state, keyB) + y) >>> 0;
    t = Math.imul(Number(rol16(t)), 0xA27416F5) >>> 0;
    t = Math.imul(Number(rol16(t)), 0xD38396FF) >>> 0;
    state = Math.imul(Number(rol16(Math.imul(Number(rol16(t)), 0x7C932B89) >>> 0)), 0xBFA49F69) >>> 0;
    acc = (acc + state) >>> 0;
  }
  return [swapLast ^ state, swapAcc ^ acc];
}

function generateSecMsGecV2(unixSeconds) {
  let ticks = unixSeconds + WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= 1e7;
  const str = `${ticks.toFixed(0)}${EDGE_TKN}`;
  const data = new TextEncoder().encode(str);
  const digest = sha256Digest(data);
  const [cs0, cs1] = cs64Digest(data, digest);
  const csHex = [cs0, cs1].map((v) => { const b = (v >>> 0).toString(16).padStart(8, "0"); return (b[6]+b[7]+b[4]+b[5]+b[2]+b[3]+b[0]+b[1]); }).join("").toUpperCase();
  const dHex = [...digest].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${csHex}-${dHex}`;
}


// ===== Edge TTS (Microsoft) — קול עברי חינמי, עיקרי =====
var EDGE_TTS_VOICE = "he-IL-AvriNeural";
function edgeDateString() {
  const d = /* @__PURE__ */ new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const p2 = (n) => String(n).padStart(2, "0");
  return days[d.getUTCDay()] + " " + months[d.getUTCMonth()] + " " + p2(d.getUTCDate()) + " " + d.getUTCFullYear() + " " + p2(d.getUTCHours()) + ":" + p2(d.getUTCMinutes()) + ":" + p2(d.getUTCSeconds()) + " GMT+0000 (Coordinated Universal Time)";
}
function edgeEscapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function edgeConcat(chunks) {
  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}
async function edgeTtsMp3(text, timeoutMs = 15000) {
  try {
    const gec = generateSecMsGecV2(Date.now() / 1000);
    const connId = crypto.randomUUID().replace(/-/g, "");
    const muid = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    const url = "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=" + connId + "&Sec-MS-GEC=" + gec + "&Sec-MS-GEC-Version=2-143.0.3650.75";
    const keyBytes = crypto.getRandomValues(new Uint8Array(16));
    const secKey = btoa(String.fromCharCode(...keyBytes));
    const resp = await fetch(url, { headers: {
      "Upgrade": "websocket", "Connection": "Upgrade",
      "Sec-WebSocket-Version": "13", "Sec-WebSocket-Key": secKey,
      "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
      "Cache-Control": "no-cache", "Pragma": "no-cache",
      "Cookie": "muid=" + muid + ";",
    } });
    if (!resp.webSocket) { logEvent("edge_ws_refused", {}); return null; }
    const ws = resp.webSocket;
    ws.accept();
    return await new Promise((resolve) => {
      const chunks = [];
      let done = false;
      const finish = (val) => { if (!done) { done = true; clearTimeout(timer); try { ws.close(); } catch (_) {} resolve(val); } };
      const timer = setTimeout(() => finish(chunks.length ? edgeConcat(chunks) : null), timeoutMs);
      ws.addEventListener("message", (ev) => {
        const d = ev.data;
        if (typeof d === "string") {
          if (d.includes("Path:turn.end")) finish(chunks.length ? edgeConcat(chunks) : null);
          return;
        }
        Promise.resolve(d instanceof ArrayBuffer ? new Uint8Array(d) : d && d.arrayBuffer ? new Uint8Array(d.arrayBuffer()) : ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : null).then((u8) => {
          if (!u8 || u8.length < 2) return;
          const headerLen = (u8[0] << 8) | u8[1];
          if (headerLen > u8.length) return;
          const header = new TextDecoder().decode(u8.subarray(2, headerLen));
          if (header.includes("Path:audio")) {
            let start = headerLen;
            if (u8[start] === 13 && u8[start + 1] === 10) start += 2;
            chunks.push(u8.subarray(start));
          }
        });
      });
      ws.addEventListener("close", () => finish(chunks.length ? edgeConcat(chunks) : null));
      ws.addEventListener("error", () => finish(null));
      const ts = edgeDateString();
      ws.send("X-Timestamp:" + ts + "\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" + '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n');
      const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='" + EDGE_TTS_VOICE + "'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>" + edgeEscapeXml(text) + "</prosody></voice></speak>";
      ws.send("X-RequestId:" + connId + "\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:" + ts + "Z\r\nPath:ssml\r\n\r\n" + ssml);
    });
  } catch (e) {
    logEvent("edge_tts_error", { type: e?.name || "Error" });
    return null;
  }
}

async function ttsTextToYemotFile(env, text) {
  const YEMOT_TOKEN = env.YEMOT_TOKEN || "";
  if (!YEMOT_TOKEN || !String(text || "").trim()) return null;
  let blob = await edgeTtsMp3(String(text || ""));
  if (blob && blob.length) {
    logEvent("tts_edge_ok", { size: blob.length });
  } else {
    logEvent("tts_edge_failed", {});
  try {
    const chunks = splitTtsChunks(text, 180);
    const parts = await Promise.all(chunks.map((q, i) => fetch("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=iw&total=" + chunks.length + "&idx=" + i + "&textlen=" + q.length + "&q=" + encodeURIComponent(q), { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.ok ? r.arrayBuffer() : null).catch(() => null)));
    if (parts.some((p) => !p || !p.byteLength)) return null;
    let total = 0;
    for (const p of parts) total += p.byteLength;
    if (!total) return null;
    blob = new Uint8Array(total);
    let off = 0;
    for (const p of parts) {
      const arr = new Uint8Array(p);
      blob.set(arr, off);
      off += arr.length;
    }
  } catch (e) {
    logEvent("tts_error", { type: e?.name || "Error" });
    return null;
  }
  }
  try {
    const fname = Date.now() + "_" + Math.floor(Math.random() * 1e4) + ".wav";
    const fd = new FormData();
    fd.append("file", new Blob([blob], { type: "audio/mpeg" }), "a.mp3");
    const upRes = await fetch(`https://www.call2all.co.il/ym/api/UploadFile?token=${YEMOT_TOKEN}&path=ivr/9/r/${fname}&convertAudio=1`, { method: "POST", body: fd });
    const upData = await upRes.json().catch(() => null);
    if (upData && upData.responseStatus === "OK") {
      logEvent("tts_file_uploaded", { ms: Date.now(), size: blob.length });
      return "/9/r/" + fname.replace(/\.wav$/, "");
    }
    logEvent("tts_upload_failed", { status: upData?.responseStatus || "err" });
    return null;
  } catch (e) {
    logEvent("tts_upload_error", { type: e?.name || "Error" });
    return null;
  }
}
__name(ttsTextToYemotFile, "ttsTextToYemotFile");
__name2(ttsTextToYemotFile, "ttsTextToYemotFile");
__name22(ttsTextToYemotFile, "ttsTextToYemotFile");
async function cleanupOldTtsFiles(env) {
  const YEMOT_TOKEN = env.YEMOT_TOKEN || "";
  try {
    const dirRes = await fetch(`https://www.call2all.co.il/ym/api/GetIVR2Dir?token=${YEMOT_TOKEN}&path=ivr2:9/r`);
    const dirData = await dirRes.json().catch(() => null);
    const files = (dirData && dirData.dirDetails) || [];
    const cutoff = Date.now() - 108e5;
    const jobs = [];
    for (const f of files) {
      const m = String(f.name || "").match(/^(\d{13})_/);
      if (m && Number(m[1]) < cutoff) jobs.push(fetch(`https://www.call2all.co.il/ym/api/FileAction?token=${YEMOT_TOKEN}&path=ivr2:9/r/${f.name}&action=delete&newPath=&newFileName=`).catch(() => null));
    }
    if (jobs.length) await Promise.all(jobs);
  } catch (_) {}
}
__name(cleanupOldTtsFiles, "cleanupOldTtsFiles");
__name2(cleanupOldTtsFiles, "cleanupOldTtsFiles");
__name22(cleanupOldTtsFiles, "cleanupOldTtsFiles");
var worker_default = {
  async fetch(request, env, ctx) {
    const __t0 = Date.now();
    let __res = await this.fetchInner(request, env, ctx);
    try {
      const __url = new URL(request.url);
      const __phone = __url.searchParams.get("ApiPhone") || "";
      if (env.USER_MEMORY && __phone && __url.pathname.startsWith("/ivr/")) {
        let __converted = null;
        try {
          const __raw = await __res.clone().text();
          const __m = __raw.match(/^id_list_message=t-([\s\S]*?)(&read=(.*))?$/);
          if (__m) {
            const __parts = [];
            const __mainFile = await ttsTextToYemotFile(env, __m[1]);
            if (__mainFile) {
              __parts.push("id_list_message=f-" + __mainFile);
              if (__m[3] !== void 0) {
                const __rm = __m[3].match(/^t-([^=]+)=((?:confirm|account),.*)$/);
                if (__rm) {
                  const __qFile = await ttsTextToYemotFile(env, __rm[1]);
                  if (__qFile) __parts.push("read=f-" + __qFile + "=" + __rm[2]);
                  else __parts.push("read=" + __m[3]);
                } else __parts.push("read=" + __m[3]);
              }
              if (__m[3] === void 0) {
                const __fuFile = await ttsTextToYemotFile(env, "אמרו את בקשתכם הבאה או נתקו לסיום");
                if (__fuFile) __converted = __parts.join("&") + "&read=f-" + __fuFile + "=link,,record,/3/rec,,no,yes,,1,30";
              }
              __converted = __converted || __parts.join("&");
              if (Math.random() < 0.25) ctx.waitUntil(cleanupOldTtsFiles(env));
            }
          } else {
            const __ro = __raw.match(/^read=t-([^=]+)=((?:confirm|account|link),[\s\S]*)$/);
            if (__ro) {
              const __qFile = await ttsTextToYemotFile(env, __ro[1]);
              if (__qFile) {
                __converted = "read=f-" + __qFile + "=" + __ro[2];
                if (Math.random() < 0.25) ctx.waitUntil(cleanupOldTtsFiles(env));
              }
            }
          }
        } catch (_) {}
        if (__converted) __res = new Response(__converted, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
        const __ms = Date.now() - __t0;
        let __body = "";
        try { __body = (await __res.clone().text()).slice(0, 400); } catch (_) {}
        const __key = "calllog_" + __phone;
        let __arr = [];
        try { __arr = JSON.parse((await env.USER_MEMORY.get(__key)) || "[]") || []; } catch (_) {}
        __arr.unshift({ at: new Date().toISOString(), ms: __ms, callId: __url.searchParams.get("ApiCallId") || "", body: __body });
        if (__arr.length > 20) __arr = __arr.slice(0, 20);
        ctx.waitUntil(env.USER_MEMORY.put(__key, JSON.stringify(__arr), { expirationTtl: 604800 }));
      }
    } catch (_) {}
    return __res;
  },
  async scheduled(event, env, ctx) {
    try {
      const YEMOT_TOKEN_S = env.YEMOT_TOKEN || "";
      let cursor;
      do {
        try {
          await hqScanDrop(env);
          await hqDrain(env);
        } catch (_) {}
        try {
          const jl = await env.USER_MEMORY.list({ prefix: "tlk_job_" });
          for (const jk of jl.keys || []) {
            try {
              const jraw = await env.USER_MEMORY.get(jk.name);
              if (!jraw) continue;
              const j = JSON.parse(jraw);
              if (j && j.at && Date.now() - j.at > 120000) { logEvent("tlk_job_drain", { age: Math.round((Date.now() - j.at) / 1000) }); await tlkFinishJob(env, jk.name.replace("tlk_job_", "")); }
            } catch (_) {}
          }
        } catch (_) {}
        const listRes = await env.USER_MEMORY.list({ prefix: "reminder_" });
        for (const k of listRes.keys || []) {
          try {
            const raw = await env.USER_MEMORY.get(k.name);
            if (!raw) continue;
            const r = JSON.parse(raw);
            const phone = k.name.replace("reminder_", "");
            if (!r.notified && r.fireAt && Date.now() >= new Date(r.fireAt).getTime()) {
              if (YEMOT_TOKEN_S) {
                try {
                  const tz = await fetch(`https://www.call2all.co.il/ym/api/RunTzintuk?token=${YEMOT_TOKEN_S}&phones=tzl:yt2178whatsapp`);
                  logEvent("reminder_tzintuk_sent", { caller: callerTail(phone), status: tz.status });
                } catch (_) {
                }
              }
              await env.USER_MEMORY.put(k.name, JSON.stringify({ ...r, notified: true }), { expirationTtl: 86400 });
            }
          } catch (_) {
          }
        }
        cursor = listRes.list_complete ? void 0 : listRes.cursor;
      } while (cursor);
    } catch (_) {
    }
  },
  async fetchInner(request, env, ctx) {
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
    if (url.pathname === "/tlk-site" || url.pathname === "/tlk-site/") {
      return new Response(TLK_SITE_HTML, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (url.pathname.startsWith("/tlk-api/")) {
      return await handleTlkSiteApi(env, url, request);
    }
    if (url.pathname.startsWith("/tlk/")) {
      if (!env.MAILBOX_PATH_SECRET || url.pathname.slice(5) !== env.MAILBOX_PATH_SECRET) return new Response("denied", { status: 403 });
      return await handleTlkRequest(env, params, callerPhone, ctx);
    }
    if (url.pathname.startsWith("/tlk-hq/")) {
      if (!env.MAILBOX_PATH_SECRET || url.pathname.slice(8) !== env.MAILBOX_PATH_SECRET) return new Response("denied", { status: 403 });
      return await handleHqRequest(env, params, callerPhone, ctx);
    }

    const mailboxAuth = url.pathname.startsWith("/ivr/") ? url.pathname.slice(5) : "";
    if (url.pathname.startsWith("/dbg/") && (request.method === "GET" || request.method === "POST")) {
      if (!env.MAILBOX_PATH_SECRET || url.pathname.slice(5) !== env.MAILBOX_PATH_SECRET) return new Response("denied", { status: 403 });
      const k = url.searchParams.get("k") || "";
      if (!k) return Response.json({ error: "missing k" });
      if (k === "tts_full_diag") {
        const text = url.searchParams.get("text") || "בדיקת הקראה מלאה";
        const f = await ttsTextToYemotFile(env, text);
        let uploadInfo = null;
        if (!f) {
          try {
            const mp3 = await edgeTtsMp3(text);
            if (mp3) {
              const fname = Date.now() + "_diag.wav";
              const fd = new FormData();
              fd.append("file", new Blob([mp3], { type: "audio/mpeg" }), "a.mp3");
              const upRes = await fetch(`https://www.call2all.co.il/ym/api/UploadFile?token=${env.YEMOT_TOKEN || ""}&path=ivr/9/r/${fname}&convertAudio=1`, { method: "POST", body: fd });
              uploadInfo = await upRes.text().catch(() => "upload_err");
            } else uploadInfo = "edge_null";
          } catch (e) { uploadInfo = "exc: " + String(e?.message || e); }
        }
      }
      if (k === "edge_tts_diag") {
        const text = url.searchParams.get("text") || "בדיקת קול עברי";
        let result = { stage: "start" };
        try {
          const gec = generateSecMsGecV2(Date.now() / 1000);
          result.gec = gec;
          const connId = crypto.randomUUID().replace(/-/g, "");
          const muid = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
          const wurl = "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=" + connId + "&Sec-MS-GEC=" + gec + "&Sec-MS-GEC-Version=2-143.0.3650.75";
          const keyBytes = crypto.getRandomValues(new Uint8Array(16));
          const secKey = btoa(String.fromCharCode(...keyBytes));
          const resp = await fetch(wurl, { headers: {
            "Upgrade": "websocket", "Connection": "Upgrade",
            "Sec-WebSocket-Version": "13", "Sec-WebSocket-Key": secKey,
            "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
            "Cache-Control": "no-cache", "Pragma": "no-cache",
            "Cookie": "muid=" + muid + ";",
          } });
          result.httpStatus = resp.status;
          result.hasWs = Boolean(resp.webSocket);
          if (resp.webSocket) {
            const ws = resp.webSocket;
            ws.accept();
            const audio = await new Promise((resolve) => {
              const chunks = [];
              const timer = setTimeout(() => resolve({ to: true, chunks }), 12000);
              ws.addEventListener("message", (ev) => {
                const d = ev.data;
                if (typeof d === "string") {
                  if (d.includes("Path:turn.end")) { clearTimeout(timer); resolve({ to: false, chunks }); try { ws.close(); } catch (_) {} }
                  else if (d.includes("Path:turn.start")) result.turnStart = true;
                  return;
                }
                Promise.resolve(d instanceof ArrayBuffer ? new Uint8Array(d) : d && d.arrayBuffer ? new Uint8Array(d.arrayBuffer()) : null).then((u8) => {
                  if (u8 && u8.length > 2) chunks.push(u8.length);
                });
              });
              ws.addEventListener("error", () => { clearTimeout(timer); resolve({ wsError: true, chunks }); });
              ws.addEventListener("close", () => { clearTimeout(timer); resolve({ closed: true, chunks }); });
              const ts = edgeDateString();
              ws.send("X-Timestamp:" + ts + "\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" + '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n');
              const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='he-IL-AvriNeural'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>" + edgeEscapeXml(text) + "</prosody></voice></speak>";
              ws.send("X-RequestId:" + connId + "\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:" + ts + "Z\r\nPath:ssml\r\n\r\n" + ssml);
            });
            result.audioFrames = audio.chunks?.length || 0;
            result.audioBytes = (audio.chunks || []).reduce((a, b) => a + b, 0);
            result.detail = audio.to ? "timeout" : audio.wsError ? "ws_error" : audio.closed ? "closed_early" : "done";
          }
        } catch (e) {
          result.err = String(e?.message || e);
          result.errType = e?.name || "Error";
        }
        return Response.json(result);
      }
      if (k === "bridge_diag") {
        const acct = url.searchParams.get("bridge") === "2" ? 2 : 1;
        const act = url.searchParams.get("action") || "list";
        const bd = await callBridge(env, { action: act, max: 1 }, acct);
        return Response.json({ account: acct, bridge_raw: bd });
      }
      const v = url.searchParams.get("v");
      if (v !== null && request.method === "POST") {
        let parsed;
        try { parsed = JSON.parse(v); } catch (_) { return Response.json({ error: "bad json" }); }
        await env.USER_MEMORY.put(k, JSON.stringify(parsed));
        if (/^chat_contacts_/.test(k)) await doStateFetch(env, k, "PUT", parsed);
        return Response.json({ ok: true, key: k });
      }
      const doVal = await doStateFetch(env, k, "GET");
      let kvVal = null;
      try { kvVal = await env.USER_MEMORY.get(k); } catch (_) {}
      return Response.json({ key: k, do: doVal?.value ?? null, kv: kvVal ? JSON.parse(kvVal) : null });
    }
    if (params.confirm !== void 0 && callerPhone) {
      const hasRecording = Boolean(params.link || params.file_path || params.RecordingPath || params.val || params["000"] || params["api_000"] || (typeof params.t === "string" && params.t.trim())) || Object.entries(params).some(([, v]) => typeof v === "string" && (v.includes(".wav") || v.includes(".opus")));
      if (!hasRecording) {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D1\u05D9\u05E6\u05D5\u05E2 \u05D4\u05E4\u05E2\u05D5\u05DC\u05D4 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
        return await handleConfirm(env, params.confirm, callerPhone);
      }
      logEvent("stale_confirm_with_recording", { caller: callerTail(callerPhone) });
    }
    let preferredAccount = null;
    if (params.account !== void 0 && callerPhone) {
      const hasRecording = Boolean(params.link || params.file_path || params.RecordingPath || params.val || params["000"] || params["api_000"] || (typeof params.t === "string" && params.t.trim())) || Object.entries(params).some(([, v]) => typeof v === "string" && (v.includes(".wav") || v.includes(".opus")));
      if (hasRecording) {
        const d = String(params.account);
        if (d === "1" || d === "2") {
          preferredAccount = d === "1" ? 1 : 2;
          logEvent("stale_account_with_recording", { caller: callerTail(callerPhone), account: d });
        }
      } else {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("אין הרשאה לביצוע הפעולה ממספר זה");
        return await handleAccountSelection(env, String(params.account), callerPhone, makeRequestId(callerPhone, "dtmf"));
      }
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
      const isSim = String(params.ApiCallId || "").startsWith("sim_") && typeof params.t === "string" && params.t.trim().length > 0;
      let transcribedText = "";
      let whisperContacts = [];
      if (isSim) {
        transcribedText = params.t.trim();
        whisperContacts = callerPhone ? await getContacts(env, callerPhone) : [];
        logEvent("sim_turn", { caller: callerTail(callerPhone), len: transcribedText.length });
      } else {
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
      whisperContacts = callerPhone ? await getContacts(env, callerPhone) : [];
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-large-v3");
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
        transcribedText = (await whisperRes.json()).text?.trim() || "";
      }

      transcribedText = await correctTranscription(transcribedText);
      const callId = String(params.ApiCallId || requestId || "call_" + callerPhone).slice(0, 90);
      if (callId.startsWith("dbg_") && env.MAILBOX_PATH_SECRET && mailboxAuth === env.MAILBOX_PATH_SECRET) {
        return Response.json({ t: transcribedText, effective: effectiveTextIfAny(transcribedText), caller: callerPhone });
      }
      if (!transcribedText) return textResponse("id_list_message=t-\u05DC\u05D0 \u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05D5\u05EA\u05DA, \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D1\u05E7\u05E9\u05EA\u05DA \u05D1\u05E7\u05D5\u05DC \u05E8\u05DD");
      globalThis.__callId = callId;
      const cont = await kvGetList(env, contStateKey(callerPhone));
      if (cont && cont.kind && Date.now() - (cont.ts || 0) < (cont.kind === "currency" ? 180000 : 600000)) {
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
        if (contRes.status === "ack") {
          await clearContState(env, callerPhone);
          return speak("בכיף, במה עוד אפשר לעזור?");
        }
        if (contRes.status === "reask") {
          const asks = (cont.asks || 0) + 1;
          if (asks >= 2) {
            await clearContState(env, callerPhone);
            return speak("לא הבנתי, במה עוד אפשר לעזור?");
          }
          await setContState(env, callerPhone, { ...cont, asks });
          return openQuestion(cont.question || "אנא ענה על השאלה הקודמת");
        }
        await clearContState(env, callerPhone);
      }
      let convo = null;
      if (env.USER_MEMORY) {
        try {
          const cDo = await doStateFetch(env, "convo_" + callId, "GET");
        const cRaw = (cDo && cDo.value !== undefined && cDo.value !== null) ? JSON.stringify(cDo.value) : await env.USER_MEMORY.get("convo_" + callId);
          if (cRaw) convo = JSON.parse(cRaw);
        } catch (_) {
        }
      }
      if (convo && Date.now() - (convo.ts || 0) > 300000) convo = null;
      const isShortReply = transcribedText.split(/\s+/).filter(Boolean).length <= 4;
      const clockGlued = transcribedText.replace(/\s+/g, "");
      const clockFast = (/(?:מה השעה|מה שעה|השעה עכשיו|מה התאריך|מה תאריך|איזה תאריך|התאריך היום|תאריך עברי|איזה יום היום|איזה יום)/.test(transcribedText) || /(?:מההשעה|מהשעה|השעהעכשיו|מההתאריך|מהתאריך|איזהתאריך|התאריךהיום|תאריךעברי|איזהיוםהיום|איזהיום|מהיום)/.test(clockGlued)) && !/(?:מייל|אימייל|צאט|שלח|תשלח|שלוח|תעביר|דולר|אירו|יורו|מזג|ביטקוין|ביקוד|קריפטו)/.test(transcribedText);
      if (clockFast) {
        const WORLD_TZ = [
          { tz: "America/New_York", names: ["\u05E0\u05D9\u05D5 \u05D9\u05D5\u05E8\u05E7", "\u05D5\u05D5\u05E9\u05D9\u05E0\u05D2\u05D8\u05D5\u05DF", "\u05DE\u05D9\u05D0\u05DE\u05D9", "\u05E4\u05D9\u05DC\u05D3\u05DC\u05E4\u05D9\u05D4"] },
          { tz: "America/Chicago", names: ["\u05E9\u05D9\u05E7\u05D2\u05D5", "\u05D9\u05D5\u05E1\u05D8\u05D5\u05DF", "\u05D3\u05E0\u05D5\u05D5\u05E8"] },
          { tz: "America/Denver", names: ["\u05D3\u05E0\u05D5\u05D5\u05E8 \u05E7\u05D5\u05DC\u05D5\u05E8\u05D3\u05D5"] },
          { tz: "America/Los_Angeles", names: ["\u05DC\u05D5\u05E1 \u05D0\u05E0\u05D2\u05DC\u05E1", "\u05DC\u05D5\u05E1 \u05D5\u05D0\u05E0\u05D2\u05DC\u05E1", "\u05D5\u05D2\u05D0\u05E1", "\u05E1\u05D0\u05DF \u05E4\u05E8\u05E0\u05E1\u05D9\u05E1\u05E7\u05D5"] },
          { tz: "America/Toronto", names: ["\u05D8\u05D5\u05E8\u05D5\u05E0\u05D8\u05D5", "\u05D0\u05D5\u05D8\u05D5\u05D5\u05D4"] },
          { tz: "America/Mexico_City", names: ["\u05DE\u05E7\u05E1\u05D9\u05E7\u05D5"] },
          { tz: "America/Argentina/Buenos_Aires", names: ["\u05D1\u05D5\u05D0\u05E0\u05D5\u05E1 \u05D0\u05D9\u05D9\u05E8\u05E1"] },
          { tz: "America/Sao_Paulo", names: ["\u05E8\u05D9\u05D5 \u05D3\u05D5 \u05D2\u05E0\u05D9\u05D5\u05E8\u05D5", "\u05E1\u05D0\u05D5 \u05E4\u05D0\u05D5\u05DC\u05D5", "\u05E1\u05D0\u05D5 \u05E4\u05D0\u05D5\u05DC\u05D5"] },
          { tz: "Europe/London", names: ["\u05DC\u05D5\u05E0\u05D3\u05D5\u05DF", "\u05DC\u05D5\u05E0\u05D3\u05D5\u05E0\u05D9"] },
          { tz: "Europe/Paris", names: ["\u05E4\u05E8\u05D9\u05D6", "\u05E4\u05E8\u05D9\u05E1"] },
          { tz: "Europe/Berlin", names: ["\u05D1\u05E8\u05DC\u05D9\u05DF", "\u05DE\u05D9\u05E0\u05DB\u05DF", "\u05E4\u05E8\u05E0\u05E7\u05E4\u05D5\u05E8\u05D8"] },
          { tz: "Europe/Amsterdam", names: ["\u05D0\u05DE\u05E1\u05D8\u05E8\u05D3\u05DD", "\u05D0\u05DE\u05E1\u05D8\u05E8\u05D3\u05DF"] },
          { tz: "Europe/Rome", names: ["\u05E8\u05D5\u05DE\u05D0", "\u05E8\u05D5\u05DE\u05D9", "\u05DE\u05D9\u05DC\u05D0\u05E0\u05D5"] },
          { tz: "Europe/Madrid", names: ["\u05DE\u05D3\u05E8\u05D9\u05D3"] },
          { tz: "Europe/Vienna", names: ["\u05D5\u05D9\u05E0\u05D4"] },
          { tz: "Europe/Zurich", names: ["\u05D6\u05D9\u05E8\u05D9\u05DA", "\u05E6\u05D9\u05E8\u05D9\u05DA"] },
          { tz: "Europe/Prague", names: ["\u05E4\u05E8\u05D0\u05D2"] },
          { tz: "Europe/Budapest", names: ["\u05D1\u05D5\u05D3\u05E4\u05E9\u05D8"] },
          { tz: "Europe/Warsaw", names: ["\u05D5\u05E8\u05E9\u05D4"] },
          { tz: "Europe/Kyiv", names: ["\u05E7\u05D9\u05D9\u05D1", "\u05E7\u05D9\u05D1\u05D5"] },
          { tz: "Europe/Moscow", names: ["\u05DE\u05D5\u05E1\u05E7\u05D1\u05D4", "\u05DE\u05D5\u05E1\u05E7\u05D1\u05D0"] },
          { tz: "Europe/Athens", names: ["\u05D0\u05EA\u05D5\u05E0\u05D4"] },
          { tz: "Europe/Istanbul", names: ["\u05D0\u05D9\u05E1\u05D8\u05E0\u05D1\u05D5\u05DC", "\u05D0\u05D9\u05E1\u05D8\u05DE\u05D1\u05D5\u05DC"] },
          { tz: "Europe/Bucharest", names: ["\u05D1\u05D5\u05E7\u05E8\u05E9\u05D8"] },
          { tz: "Europe/Lisbon", names: ["\u05DC\u05D9\u05E1\u05D1\u05D5\u05E0\u05D4"] },
          { tz: "Europe/Stockholm", names: ["\u05E1\u05D8\u05D5\u05E7\u05D4\u05D5\u05DC\u05DD", "\u05E1\u05D8\u05D5\u05E7\u05D4\u05D5\u05DC\u05DD"] },
          { tz: "Europe/Copenhagen", names: ["\u05E7\u05D5\u05E4\u05E0\u05D4\u05D2\u05DF"] },
          { tz: "Asia/Dubai", names: ["\u05D3\u05D5\u05D1\u05D0\u05D9", "\u05D3\u05D5\u05D1\u05D9"] },
          { tz: "Asia/Bangkok", names: ["\u05D1\u05E0\u05D2\u05E7\u05D5\u05E7"] },
          { tz: "Asia/Kolkata", names: ["\u05D3\u05DC\u05D4\u05D9", "\u05DE\u05D5\u05DE\u05D1\u05D0\u05D9", "\u05E7\u05DC\u05E7\u05D5\u05D8\u05D4"] },
          { tz: "Asia/Singapore", names: ["\u05E1\u05D9\u05E0\u05D2\u05E4\u05D5\u05E8"] },
          { tz: "Asia/Hong_Kong", names: ["\u05D4\u05D5\u05E0\u05D2 \u05E7\u05D5\u05E0\u05D2"] },
          { tz: "Asia/Shanghai", names: ["\u05D1\u05D9\u05D9\u05D2'\u05D9\u05DF", "\u05E9\u05E0\u05D2\u05D7\u05D0\u05D9", "\u05E9\u05E0\u05D2\u05D7\u05D0\u05D9"] },
          { tz: "Asia/Tokyo", names: ["\u05D8\u05D5\u05E7\u05D9\u05D5"] },
          { tz: "Australia/Sydney", names: ["\u05E1\u05D9\u05D3\u05E0\u05D9", "\u05DE\u05DC\u05D1\u05D5\u05E8\u05DF"] },
          { tz: "Pacific/Auckland", names: ["\u05D0\u05D5\u05E7\u05DC\u05E0\u05D3"] },
          { tz: "Africa/Cairo", names: ["\u05E7\u05D4\u05D9\u05E8"] },
          { tz: "Africa/Johannesburg", names: ["\u05D9\u05D5\u05D4\u05E0\u05E1\u05D1\u05D5\u05E8\u05D2"] }
        ];
        const _wEntry = WORLD_TZ.find((e) => e.names.some((nm) => transcribedText.includes(nm)));
        const askedCity = _wEntry ? _wEntry.names[0] : null;
        const askedTz = _wEntry ? _wEntry.tz : null;
        if (askedCity) {
          try {
            const _cn = new Date();
            const _ct = _cn.toLocaleTimeString("he-IL", { timeZone: askedTz, hour: "2-digit", minute: "2-digit", hour12: false });
            const _numH = parseInt(_ct.split(":")[0], 10), _numM = parseInt(_ct.split(":")[1], 10);
            return textResponse("id_list_message=t-\u05D4\u05E9\u05E2\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5 \u05D1" + askedCity + " " + hebNumWords(_numH) + " \u05D5" + hebNumWords(_numM));
          } catch (_) {
          }
        } else {
          const foreignCityHint = /\u05D1\u05D4\u05E8\u05D9\u05D5\u05D7|\u05D1\u05E2\u05D9\u05E8|\u05D1\u05DE\u05D3\u05D9\u05E0\u05D4/.test(transcribedText);
          if (foreignCityHint && !/\u05D9\u05E9\u05E8\u05D0\u05DC|\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD|\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1|\u05D7\u05D9\u05E4\u05D4|\u05D1\u05D0\u05E8 \u05E9\u05D1\u05E2|\u05D0\u05D9\u05DC\u05EA|\u05E0\u05EA\u05E0\u05D9\u05D4/.test(transcribedText)) {
            return textResponse("id_list_message=t-\u05D0\u05E0\u05D9 \u05DE\u05DB\u05D9\u05E8 \u05E9\u05E2\u05D4 \u05D1\u05D9\u05E9\u05E8\u05D0\u05DC \u05D5\u05D1\u05DB\u05DE\u05D4 \u05E2\u05E8\u05D9\u05DD \u05D2\u05D3\u05D5\u05DC\u05D5\u05EA \u05DB\u05DE\u05D5 \u05E0\u05D9\u05D5 \u05D9\u05D5\u05E8\u05E7 \u05D5\u05DC\u05D5\u05E0\u05D3\u05D5\u05DF");
          }
        }
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
      const thanksQ = /^(?:תודה(?: רבה)?(?: על הכול)?|יישר כוח|בסדר גמור)(?:\s*[.!ן]\s*)?$/.test(transcribedText.trim());
      if (thanksQ) {
        const thA = "בכיף, במה עוד אפשר לעזור?";
        await saveConvoTurn(env, transcribedText, thA);
        return speak(thA);
      }
      const capsQ = /(?:מה אתה יכול|מה אפשר לעשות|אילו פעולות|מה היכולות|מה אתה עושה|מה אתה מציע)/.test(transcribedText);
      if (capsQ) {
        const capsA = "אני יכול לומר לך את השעה והתאריך, מזג אוויר, שערי דולר אירו וביטקוין, לקרוא מיילים והודעות צאט, לשלוח מייל והודעות, להגדיר תזכורות, לספר בדיחה ולענות על שאלות כלליות. פשוט תגיד מה צריך";
        await saveConvoTurn(env, transcribedText, capsA);
        return speak(capsA);
      }
      }
      const _weatherQ = /(?:מ[זס]ג\s*ה?\s*או\s*ו?ו?\s*י\s*ר|תח[זס]י[תהונ]|כמה מעלות|טמפרטורה|מ[זס]ג\s*ה?אויר)/.test(transcribedText);
      if (_weatherQ && !/(?:דולר|אירו|מטבע|ביטק|תזכורת|תזכיר)/.test(transcribedText)) {
        try {
          const _WCITIES = {"צפון":[32.85,35.3],"דרום":[31.05,34.85],"מרכז":[32.05,34.85],"שפלה":[31.85,34.85],"ירקון":[32.1,34.92],"שרון":[32.35,34.95],"גוש דן":[32.05,34.82],"נגב":[31.0,34.9],"גליל":[33.0,35.4],"עמק יזרעאל":[32.6,35.25],"כרמל":[32.75,35.0],"שומרון":[32.2,35.2],"יהודה":[31.7,35.1],"בקעה":[31.4,35.3],"ערבה":[30.5,35.0],"גלבוע":[32.5,35.4],"חוף":[32.1,34.8],"קָצִיר":[32.705,35.618],"תל קציר":[32.705,35.618],"עין קיניא":[33.238,35.731],"עין קניה":[33.238,35.731],"אֵילִיָּה קַפִּיטוֹלִינָה":[31.769,35.216],"הַקֹּדֶשׁ":[31.769,35.216],"יְבוּס":[31.769,35.216],"יְרוּשְׁלֶם":[31.769,35.216],"יְרוּשָׁלַיִם":[31.769,35.216],"יְרוּשָׁלַםִ":[31.769,35.216],"יְרוּשָׁלָםִ":[31.769,35.216],"יבוס":[31.769,35.216],"ירושלים":[31.769,35.216],"ירושלם":[31.769,35.216],"מוֹרִיָּה":[31.769,35.216],"מוריה":[31.769,35.216],"צִיּוֹן":[31.769,35.216],"ציון":[31.769,35.216],"שָׁלֵם":[31.769,35.216],"שלם":[31.769,35.216],"אבו תור":[31.767,35.233],"גבעת חנניה":[31.767,35.233],"הר אדר":[31.828,35.131],"תְּקוֹעַ":[31.654,35.228],"תקוע":[31.654,35.228],"מִצְפֵּה יְרִיחוֹ":[31.817,35.394],"מצפה יריחו":[31.817,35.394],"מודיעין":[31.894,35.015],"מודיעין מכבים רעות":[31.894,35.015],"מכבים רעות":[31.894,35.015],"רעות":[31.894,35.015],"כּוֹכַב הַשַּׁחַר":[31.96,35.349],"כוכב השחר":[31.96,35.349],"אלעזר":[31.66,35.143],"צור משה":[32.298,34.912],"צור הדסה":[31.719,35.097],"זִכְרוֹן יַעֲקֹב":[32.569,34.954],"זיכרון יעקב":[32.569,34.954],"זכרון יעקב":[32.569,34.954],"צפת":[32.965,35.496],"זלפה":[32.551,35.187],"יָקְנְעָם עילית":[32.647,35.092],"יוקנעם עילית":[32.647,35.092],"יקנעם עלית":[32.647,35.092],"יִרְכָּא":[32.954,35.212],"ירכא":[32.954,35.212],"יְסוּד הַמַּעֲלָ":[33.059,35.608],"יְסוּד הַמַּעֲלָה":[33.059,35.608],"יסוד המעלה":[33.059,35.608],"ירוחם":[30.988,34.932],"ירחם":[30.988,34.932],"יהוד":[32.033,34.891],"בית גן":[32.706,35.504],"יבנאל":[32.706,35.504],"משמר השלושה":[32.706,35.504],"יבנה":[31.878,34.74],"יגור":[32.743,35.078],"יפו":[32.05,34.752],"יפא":[32.689,35.278],"יפיע":[32.689,35.278],"יַד בִּנְיָמִין":[31.797,34.821],"יד בנימין":[31.797,34.821],"מרכז חנוכי":[31.797,34.821],"עֻזֵיר":[32.791,35.325],"עוזייר":[32.791,35.325],"עזיר":[32.791,35.325],"אם אל פחם":[32.518,35.154],"טובא זנגריה":[32.966,35.593],"טירת כרמל":[32.76,34.969],"תִּפְרַח":[31.327,34.677],"תפרח":[31.327,34.677],"טבריה":[32.794,35.532],"תל מונד":[32.253,34.918],"תל אביב":[32.081,34.781],"תֵּל עֲדָשִׁים":[32.657,35.302],"תל עדשים":[32.657,35.302],"מעלות תרשיחא":[33.017,35.267],"טמרה":[32.853,35.199],"תמרה":[32.853,35.199],"סולם":[32.606,35.334],"שונם":[32.606,35.334],"ביתניה הדרומית":[31.774,34.684],"שְׁתוּלִים":[31.774,34.684],"שתולים":[31.774,34.684],"שלומי":[33.072,35.145],"שְׁפַרְעָם":[32.806,35.169],"שפרעם":[32.806,35.169],"בית יצחק שער חפר":[32.334,34.89],"שַׁעַר אֶפְרַיִם":[32.29,34.997],"שער אפרים":[32.29,34.997],"שַׁעַלְבִים":[31.87,34.987],"שעלבים":[31.87,34.987],"שַׁעַבּ":[32.89,35.239],"שאב":[32.89,35.239],"שעב":[32.89,35.239],"שְׂדֵה עוֹזִיָּהוּ":[31.757,34.679],"שדה עוזיהו":[31.757,34.679],"שדרות":[31.525,34.597],"סַבְיוֹן":[32.05,34.878],"סביון":[32.05,34.878],"סַנְדַלָה":[32.522,35.324],"צַנְדַלָה":[32.522,35.324],"צנדלה":[32.522,35.324],"סִכְנִין":[32.865,35.298],"סכנין":[32.865,35.298],"ראש פינה":[32.969,35.542],"ראש פנה":[32.969,35.542],"ראש העין":[32.095,34.954],"ראשון לציון":[31.971,34.789],"רכסים":[32.75,35.101],"רחובות":[31.894,34.812],"רמלה":[31.926,34.864],"רמת ישי":[32.701,35.164],"רמת השרון":[32.146,34.839],"רמת גן":[32.082,34.811],"רָמָה":[32.939,35.366],"ראמה":[32.939,35.366],"רמה":[32.939,35.366],"רעננה":[32.184,34.874],"כפר הנוער קרית יערים":[31.803,35.102],"קִרְיַת יְעָרִים":[31.803,35.102],"קרית יערים":[31.803,35.102],"קריית ים":[32.85,35.07],"קרית ים":[32.85,35.07],"קרית ימ":[32.85,35.07],"קִרְיַת טִבְעוֹן":[32.712,35.125],"קריית טבעון":[32.712,35.125],"קרית טבעון":[32.712,35.125],"קריית שמונה":[33.212,35.57],"קרית שמונה":[33.212,35.57],"קריית מוצקין":[32.837,35.078],"קרית מוצקון":[32.837,35.078],"קִרְיַת מַלְאָכִי":[31.729,34.746],"קריית מלאכי":[31.729,34.746],"קרית מלאכי":[31.729,34.746],"קריית גת":[31.61,34.764],"קרית גת":[31.61,34.764],"קריית ביאליק":[32.828,35.086],"קרית ביאליק":[32.828,35.086],"קריית אתא":[32.811,35.113],"קרית אתא":[32.811,35.113],"קִדְרוֹן":[31.814,34.797],"קדרון":[31.814,34.797],"קלנסוה":[32.285,34.981],"קלנסווה":[32.285,34.981],"פתח תיקוה":[32.089,34.887],"פתח תיקווה":[32.089,34.887],"פתח תקוה":[32.089,34.887],"פתח תקווה":[32.089,34.887],"פרדסיה":[32.307,34.911],"פרדסייה":[32.307,34.911],"פרדס חנה כרכור":[32.474,34.978],"אור יהודה":[32.029,34.858],"אור עקיבא":[32.506,34.921],"עֹמֶר":[31.265,34.848],"עומר":[31.265,34.848],"עמר":[31.265,34.848],"אופקים":[31.314,34.62],"אפקים":[31.314,34.62],"נוֹרְדִיָּה":[32.314,34.896],"נורדיה":[32.314,34.896],"נורדייה":[32.314,34.896],"נתיבות":[31.423,34.589],"נתניה":[32.333,34.859],"נס ציונה":[31.929,34.799],"נשר":[32.766,35.044],"ניין":[32.63,35.349],"נין":[32.63,35.349],"נעים":[32.63,35.349],"נחלים":[32.06,34.911],"נוֹף הַגָּלִיל":[32.708,35.325],"נוף הגליל":[32.708,35.325],"נצרת עלית":[32.708,35.325],"נצרת":[32.701,35.297],"נָעוּרָה":[32.614,35.392],"נעורה":[32.614,35.392],"נחף":[32.933,35.318],"נהריה":[33.009,35.098],"נַעַן":[31.883,34.858],"נען":[31.883,34.858],"מוסמוס":[32.545,35.155],"מצמץ":[32.545,35.155],"מֻקֵיבִּלָה":[32.514,35.296],"מקיבלה":[32.514,35.296],"מצפה רמון":[30.609,34.801],"מיעיליא":[33.028,35.256],"מעיליא":[33.028,35.256],"מעליא":[33.028,35.256],"מגדל העמק":[32.678,35.242],"מִגְדָּל":[32.839,35.502],"מגדל":[32.839,35.502],"מבשרת ציון":[31.802,35.151],"מטלה":[33.279,35.579],"מזכרת בתיה":[31.854,34.846],"בית כרם":[32.921,35.254],"מראר":[32.889,35.408],"מַעְגָלִים":[31.397,34.599],"מעגלים":[31.397,34.599],"מַעֲגַן מִיכָאֵל":[32.555,34.916],"מעגן מיכאל":[32.555,34.916],"לד":[31.947,34.89],"לוד":[31.947,34.89],"חרבת מיסר":[32.445,35.042],"מֵיסִר":[32.445,35.042],"מיסר":[32.445,35.042],"כפר יונה":[32.315,34.936],"כְּפַר וִיתְקִין":[32.38,34.875],"כפר ויתקין":[32.38,34.875],"כפר תבור":[32.688,35.42],"כְּפַר סִירְקִין":[32.077,34.925],"כפר סירקין":[32.077,34.925],"כפר שמריהו":[32.185,34.821],"כפר סבא":[32.175,34.907],"כְּפַר הֶס":[32.247,34.936],"כפר הס":[32.247,34.936],"דחן":[31.739,34.63],"כפר הנוער ניצנים":[31.739,34.63],"ניצן":[31.739,34.63],"נצן":[31.739,34.63],"כְּפַר חַבָּד":[31.988,34.852],"קִרְיַת עֶקְרוֹן":[31.861,34.823],"קרית עקרון":[31.861,34.823],"כרמיאל":[32.91,35.298],"כַּפְר יָסִיף":[32.955,35.162],"כפר יסיף":[32.955,35.162],"כַּפְר קָאסִם":[32.114,34.976],"כפר קסם":[32.114,34.976],"כַּפְר קַרִע":[32.505,35.052],"כפר קרע":[32.505,35.052],"כפר מצר":[32.645,35.421],"כפר מנדא":[32.811,35.261],"כפר כנא":[32.747,35.342],"כפר כמא":[32.722,35.44],"כַּפְר בַּרָא":[32.131,34.971],"כפר ברא":[32.131,34.971],"כאבול":[32.869,35.212],"כבול":[32.869,35.212],"גּוּשׁ חָלָב":[33.022,35.447],"גוש חלב":[33.022,35.447],"תל גת":[32.398,35.038],"גַ׳לְג׳וּלְיָה":[32.152,34.955],"גלגל":[32.152,34.955],"חוסיפה":[32.718,35.065],"עספיא":[32.718,35.065],"עִלּוּט":[32.718,35.26],"עילוט":[32.718,35.26],"עלוט":[32.718,35.26],"אכסל":[32.682,35.324],"כסלות תבור":[32.682,35.324],"אבטין":[32.761,35.114],"אבלים":[32.822,35.193],"אעבלין":[32.822,35.193],"חורפיש":[33.018,35.348],"חרפיש":[33.018,35.348],"חולון":[32.01,34.779],"הוד השרון":[32.159,34.893],"חוד השרון":[32.159,34.893],"הרצליה":[32.166,34.825],"הרצלייה":[32.166,34.825],"חיפה":[32.813,34.999],"חפה":[32.813,34.999],"חצור הגלילית":[32.982,35.545],"חדרה":[32.442,34.904],"גבעת שמואל":[32.078,34.849],"גיבעת שמואל":[32.078,34.849],"גִּבְעַת בְּרֶנֶר":[31.867,34.801],"גבעת ברנר":[31.867,34.801],"גבעתיים":[32.072,34.813],"גבעתים":[32.072,34.813],"גיבעתיים":[32.072,34.813],"גֶּשֶׁר הַזִּיו":[33.04,35.112],"גשר הזיו":[33.04,35.112],"גדרה":[31.815,34.78],"גן יבנה":[31.787,34.707],"גני תיקווה":[32.06,34.873],"גני תקוה":[32.06,34.873],"גני תקווה":[32.06,34.873],"מפשטה":[33.049,35.309],"פַסּוּטָה":[33.049,35.309],"פסוטה":[33.049,35.309],"אבן יהודה":[32.272,34.886],"אבן שמואל":[31.576,34.763],"א טירה":[32.234,34.95],"טירה":[32.234,34.95],"א טיבה":[32.266,35.009],"טַּיִּבָּה":[32.604,35.444],"טיבה":[32.604,35.444],"א רינה":[32.722,35.316],"ריינה":[32.722,35.316],"עֵין וֶרֶד":[32.267,34.933],"עין ורד":[32.267,34.933],"עֵין שָׂרִיד":[32.274,34.934],"עין שריד":[32.274,34.934],"אליכין":[32.408,34.925],"אל מזרעה":[32.983,35.098],"מזרעה":[32.983,35.098],"אל פרידיס":[32.597,34.953],"פֻרֵידִיס":[32.597,34.953],"פארדיס":[32.597,34.953],"פורידיס":[32.597,34.953],"אילת":[29.558,34.948],"עֵין מָהִל":[32.723,35.353],"עין מאהל":[32.723,35.353],"עין מהל":[32.723,35.353],"עֵילַבּוּ":[32.837,35.401],"עַילַבּוּן":[32.837,35.401],"עילבון":[32.837,35.401],"דימונה":[31.071,35.033],"דֵיר חַנָּא":[32.862,35.364],"דיר חנא":[32.862,35.364],"דליית אל כרמל":[32.694,35.047],"דלית אל כרמל":[32.694,35.047],"עיר הכרמל":[32.694,35.047],"דבוריה":[32.693,35.371],"בקיעה":[32.978,35.334],"פְּקִיעִין":[32.978,35.334],"פקיעין":[32.978,35.334],"בועינה":[32.806,35.364],"בעינה":[32.806,35.364],"ביר אל מכסור":[32.777,35.221],"בנימינה":[32.523,34.945],"בענה":[32.93,35.271],"בית זית":[31.782,35.162],"בית יצחק":[32.328,34.891],"בית שמש":[31.731,34.993],"בית שאן":[32.497,35.496],"בית אלעזרי":[31.844,34.804],"בית דגן":[32.002,34.83],"בת דגן":[32.002,34.83],"בני ברק":[32.081,34.834],"בני עיש":[31.79,34.759],"בני עייש":[31.79,34.759],"באר יעקב":[31.939,34.837],"באר שבע":[31.252,34.791],"בת ים":[32.024,34.752],"בסמת טבעון":[32.739,35.157],"בַּרֶקֶת":[32.018,34.944],"ברקת":[32.018,34.944],"אזור":[32.024,34.806],"עתלית":[32.689,34.942],"אשקלון":[31.669,34.571],"אשדוד":[31.792,34.65],"עַרְעָרָה":[32.496,35.093],"ערערה":[32.496,35.093],"עֲרָד":[31.259,35.213],"ערד":[31.259,35.213],"עכו":[32.928,35.076],"אחיעזר":[31.981,34.872],"עפולה":[32.609,35.289],"אֲפִיקִים":[32.681,35.577],"אפיקים":[32.681,35.577],"אַבּוּ סְנָן":[32.959,35.172],"אבו סנן":[32.959,35.172],"אבו גוש":[31.806,35.109],"שבלי":[32.694,35.392],"שיבלי":[32.694,35.392],"הושעיה":[32.759,35.294],"רומת היב":[32.777,35.305],"סלאמה":[32.893,35.371],"סלמה":[32.893,35.371],"כפר ורדים":[32.994,35.278],"בית השמונאי":[31.89,34.917],"בית חשמונאי":[31.89,34.917],"חספין":[32.845,35.793],"קַצְרִין":[32.992,35.691],"קצרין":[32.992,35.691],"להבים":[31.373,34.816],"מדרשת בן גוריון":[30.852,34.783],"קיסריה":[32.519,34.905],"מערב ירושלים":[31.782,35.22],"מֵיתָר":[31.327,34.939],"מיתר":[31.327,34.939],"עראמשה":[33.087,35.227],"ערמשה":[33.087,35.227],"מֶרְכַּז שַׁפִּירָא":[31.699,34.709],"מרכז שפירא":[31.699,34.709],"אחוזת ברק":[32.643,35.338],"אחזת ברק":[32.643,35.338],"גִּבְעַת אַבְנִי":[32.775,35.438],"גבעת אבני":[32.775,35.438],"כוכב יאיר":[32.226,35.001],"בַּת חֵפֶר":[32.334,35.013],"בת חפר":[32.334,35.013],"חָרִישׁ":[32.462,35.046],"חריש":[32.462,35.046],"זמר":[32.365,35.038],"כַּרְמֵי יוֹסֵף":[31.848,34.92],"כרמי יוסף":[31.848,34.92],"עֵין נַקוּבָּא":[31.794,35.121],"עין נקובא":[31.794,35.121],"רהט":[31.395,34.757],"רהת":[31.395,34.757],"לָקִיָּה":[31.319,34.859],"לקיה":[31.319,34.859],"שֶׂגֶב שָׁלוֹם":[31.199,34.84],"שגב שלום":[31.199,34.84],"שקיב א סלם":[31.199,34.84],"מודיעין עילית":[31.932,35.044],"נוף איילון":[31.871,34.991],"חשמונאים":[31.93,35.022],"לפיד":[31.918,35.032],"כְּפָר הָאֳרָנִים":[31.92,35.037],"כפר האורנים":[31.92,35.037],"נִילִי":[31.964,35.049],"נילי":[31.964,35.049],"נַעֲלֶה":[31.962,35.066],"נעלה":[31.962,35.066],"טַלְמוֹן":[31.939,35.135],"טלמון":[31.939,35.135],"אריאל":[32.106,35.184],"רְבָבָה":[32.119,35.129],"רבבה":[32.119,35.129],"זרזיר":[32.728,35.214],"שִׁמְשִׁית":[32.733,35.247],"שימשית":[32.733,35.247],"שמשית":[32.733,35.247],"גִּבְעַת אֵלָה":[32.723,35.245],"גבעת אלה":[32.723,35.245],"נוֹפִית":[32.76,35.148],"נופית":[32.76,35.148],"פי נר":[32.76,35.148],"כעבייה":[32.75,35.184],"עֲדִי":[32.785,35.173],"עדי":[32.785,35.173],"תֵּל שֶׁבַע":[31.249,34.86],"תל א סבע":[31.249,34.86],"תל שבע":[31.249,34.86],"גַּן נֵר":[32.529,35.337],"גן נר":[32.529,35.337],"חרבת אבו תלול":[31.142,34.914],"עַרְעָרָה בַּנֶּגֶב":[31.16,35.023],"ערערה בנגב":[31.16,35.023],"חורה":[31.301,34.936],"כְּסֵיפָה":[31.245,35.093],"כסיפה":[31.245,35.093],"שהם":[31.999,34.946],"שוהם":[31.999,34.946],"אלעד":[32.051,34.957],"מתן":[32.159,34.975],"קדימה צורן":[32.278,34.919],"כסרא סומיע":[32.973,35.299],"מעלה עירון":[32.554,35.184],"צוּר יִצְחָק":[32.24,34.998],"צור יצחק":[32.24,34.998],"קִרְיַת אוֹנוֹ":[32.061,34.856],"קריית אונו":[32.061,34.856],"קרית אונו":[32.061,34.856],"אום בטין":[31.277,34.882],"אל סייד":[31.283,34.915],"בסמה":[32.529,35.101]};
          let _wCity = "\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD", _wLat = 31.78, _wLon = 35.22;
          const _wText = transcribedText.replace(/(?:^|\s)\u05DC\u05D0\s+\u05D1[^\s,.:;]+/g, " ");
          for (const [_ct, _co] of Object.entries(_WCITIES)) {
            if (_wText.includes(_ct)) { _wCity = _ct; _wLat = _co[0]; _wLon = _co[1]; }
          }
          if (_wCity === "\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD" && !/\u05D9\u05E8\u05D5\u05E9\u05DC/.test(_wText)) {
            try {
              const _cm = _wText.match(/(?:^|\s)(?:\u05D1|\u05E9\u05D1|\u05DC\u05D1)([\u05D0-\u05EA"']+(?:\s[\u05D0-\u05EA"']+)?)/g);
              if (_cm) {
                const cands = _cm.map((m) => m.replace(/^[^\u05D0-\u05EA]*/, "").replace(/^(?:\u05E9\u05D1|\u05DC\u05D1|\u05D1)/, "").replace(/^\u05E2\u05D9\u05E8\s*/, "").replace(/\s(?:\u05DE\u05D7\u05E8|\u05D4\u05D9\u05D5\u05DD|\u05E2\u05DB\u05E9\u05D9\u05D5|\u05D1\u05D1\u05D5\u05E7\u05E8|\u05D1\u05E2\u05E8\u05D1|\u05D1\u05DC\u05D9\u05DC\u05D4)$/, "")).reverse().slice(0, 3);
                const _stop = new Set(["\u05D1\u05D5\u05E7\u05E8", "\u05E2\u05E8\u05D1", "\u05DC\u05D9\u05DC\u05D4", "\u05E6\u05D4\u05E8\u05D9\u05D9\u05DD", "\u05DE\u05D7\u05E8", "\u05D4\u05D9\u05D5\u05DD", "\u05E2\u05DB\u05E9\u05D9\u05D5", "\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05E2\u05D5\u05DC\u05DD", "\u05D7\u05D5\u05E5"]);
                const _nrm = (x) => x.replace(/[\u0591-\u05C7]/g, "").replace(/\s+/g, "");
                const _lev = (a, b) => {
                  if (Math.abs(a.length - b.length) > 2) return 9;
                  const m = a.length, n = b.length;
                  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
                  for (let j = 1; j <= n; j++) d[0][j] = j;
                  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                  return d[m][n];
                };
                let _hadCands = false;
                for (const _cd of cands) {
                  if (_cd.length < 2 || _stop.has(_cd)) continue;
                  _hadCands = true;
                  const _variants = [_nrm(_cd), _nrm("\u05D1" + _cd)];
                  let _fz = null;
                  for (const [_ct, _co] of Object.entries(_WCITIES)) {
                    const _nt = _nrm(_ct);
                    for (const _nc of _variants) {
                      if (_nt === _nc) { _fz = [_ct, _co]; break; }
                      if (_nc.length >= 4 && _nt.length >= 4 && _lev(_nc, _nt) <= (_nc.length >= 7 ? 2 : 1)) { _fz = [_ct, _co]; break; }
                    }
                    if (_fz) break;
                  }
                  if (_fz) { _wCity = _fz[0]; _wLat = _fz[1][0]; _wLon = _fz[1][1]; logEvent("city_fuzzy_match", { heard: _cd, city: _fz[0] }); break; }
                  const _gcres = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(_cd) + "&count=5&language=he&format=json", { headers: { "User-Agent": "Mozilla/5.0" } });
                  if (!_gcres.ok) continue;
                  const _gd = await _gcres.json();
                  const _hit = (_gd.results || []).find((r) => String(r.country_code || "").toUpperCase() === "IL");
                  if (_hit) { _wCity = _cd; _wLat = _hit.latitude; _wLon = _hit.longitude; break; }
                }
                if (_hadCands && _wCity === "\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD") {
                  await saveConvoTurn(env, transcribedText, "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D6\u05D4\u05D5\u05EA \u05D0\u05EA \u05D4\u05E2\u05D9\u05E8 \u05E9\u05D0\u05DE\u05E8\u05EA. \u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05E9\u05DD \u05D4\u05E2\u05D9\u05E8");
                  return speak("\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D6\u05D4\u05D5\u05EA \u05D0\u05EA \u05D4\u05E2\u05D9\u05E8 \u05E9\u05D0\u05DE\u05E8\u05EA. \u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05E9\u05DD \u05D4\u05E2\u05D9\u05E8");
                }
              }
            } catch (_) {
            }
          }
          const _wres = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${_wLat}&longitude=${_wLon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=2&timezone=Asia%2FJerusalem`, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (_wres.ok) {
            const _wd = await _wres.json();
            const _cur = _wd.current || {}, _day = _wd.daily || {};
            const _WCD = { 0: "\u05D1\u05D4\u05D9\u05E8", 1: "\u05D1\u05D4\u05D9\u05E8 \u05D1\u05E8\u05D5\u05D1\u05D5", 2: "\u05DE\u05E2\u05D5\u05E0\u05DF \u05D7\u05DC\u05E7\u05D9\u05EA", 3: "\u05DE\u05E2\u05D5\u05E0\u05DF", 45: "\u05E2\u05E8\u05E4\u05DC", 48: "\u05E2\u05E8\u05E4\u05DC", 51: "\u05D8\u05E4\u05D8\u05D5\u05E3", 53: "\u05D2\u05E9\u05DD \u05E7\u05DC", 55: "\u05D2\u05E9\u05DD \u05E7\u05DC", 61: "\u05D2\u05E9\u05DD \u05E7\u05DC", 63: "\u05D2\u05E9\u05DD", 65: "\u05D2\u05E9\u05DD \u05D7\u05D6\u05E7", 71: "\u05E9\u05DC\u05D2 \u05E7\u05DC", 73: "\u05E9\u05DC\u05D2", 75: "\u05E9\u05DC\u05D2 \u05DB\u05D1\u05D3", 80: "\u05D8\u05D9\u05E4\u05D5\u05EA", 81: "\u05D2\u05E9\u05DE\u05D9\u05DD \u05E7\u05DC\u05D9\u05DD", 82: "\u05D2\u05E9\u05DE\u05D9\u05DD \u05D7\u05D6\u05E7\u05D9\u05DD", 95: "\u05E1\u05D5\u05E4\u05EA \u05E8\u05E2\u05DE\u05D9\u05DD", 96: "\u05E1\u05D5\u05E4\u05EA \u05E8\u05E2\u05DE\u05D9\u05DD", 99: "\u05E1\u05D5\u05E4\u05EA \u05E8\u05E2\u05DE\u05D9\u05DD \u05D7\u05D6\u05E7\u05D4" };
            const _desc = (c) => _WCD[c] || "";
            let _wAns = `\u05DE\u05D6\u05D2 \u05D4\u05D0\u05D5\u05D5\u05D9\u05E8 \u05D1${_wCity}: \u05E2\u05DB\u05E9\u05D9\u05D5 ${Math.round(_cur.temperature_2m)} \u05DE\u05E2\u05DC\u05D5\u05EA, ${_desc(_cur.weather_code)}. \u05D4\u05D9\u05D5\u05DD \u05D1\u05D9\u05DF ${Math.round(_day.temperature_2m_min?.[0])} \u05DC${Math.round(_day.temperature_2m_max?.[0])} \u05DE\u05E2\u05DC\u05D5\u05EA`;
            if (/תח[זס]י/.test(transcribedText)) _wAns += `, \u05D5\u05DE\u05D7\u05E8 \u05D1\u05D9\u05DF ${Math.round(_day.temperature_2m_min?.[1])} \u05DC${Math.round(_day.temperature_2m_max?.[1])} \u05DE\u05E2\u05DC\u05D5\u05EA, ${_desc(_day.weather_code?.[1])}`;
            _wAns += ".";
            await saveConvoTurn(env, transcribedText, _wAns);
            return speak(_wAns);
          }
        } catch (_) {
        }
      }
      const _wavesQ = /(?:\u05D2\u05D5\u05D1\u05D4 (?:\u05E9\u05DC )?\u05D4?\u05D2\u05DC\u05D9\u05DD|\u05D4\u05D2\u05DC\u05D9\u05DD \u05D1\u05D9\u05DD|\u05DE\u05D4 \u05D4\u05D2\u05DC\u05D9\u05DD|\u05D0\u05D9\u05DA \u05D4\u05D9\u05DD|\u05D2\u05DC\u05D9\u05DD \u05E1\u05D5\u05E2\u05E8(?:\u05D9\u05DD)?|\u05D4\u05D9\u05DD \u05E1\u05D5\u05E2\u05E8|\u05D4\u05D0\u05DD \u05D4\u05D9\u05DD|\u05DE\u05D4 \u05DE\u05E6\u05D1 \u05D4\u05D9\u05DD)/.test(transcribedText);
      if (_wavesQ) {
        try {
          const _mres = await fetch("https://marine-api.open-meteo.com/v1/marine?latitude=32.08&longitude=34.78&current=wave_height&timezone=Asia%2FJerusalem", { headers: { "User-Agent": "Mozilla/5.0" } });
          if (_mres.ok) {
            const _md = await _mres.json();
            const _wh = _md?.current?.wave_height;
            if (_wh !== void 0 && _wh !== null) {
              const _state = _wh < 0.5 ? "\u05D4\u05D9\u05DD \u05E8\u05D2\u05D5\u05E2 \u05DE\u05D0\u05D5\u05D3" : _wh < 1 ? "\u05D4\u05D9\u05DD \u05E8\u05D2\u05D5\u05E2" : _wh < 1.5 ? "\u05D9\u05DD \u05E1\u05D1\u05D9\u05E8" : "\u05D9\u05DD \u05E1\u05D5\u05E2\u05E8, \u05D6\u05D4\u05D9\u05E8\u05D5\u05EA";
              const _wvAns = `\u05D2\u05D5\u05D1\u05D4 \u05D4\u05D2\u05DC\u05D9\u05DD \u05D1\u05D7\u05D5\u05E3 \u05EA\u05DC \u05D0\u05D1\u05D9\u05D1 \u05DB\u05E8\u05D2\u05E2 \u05D4\u05D5\u05D0 ${Math.round(_wh * 10) / 10} \u05DE\u05D8\u05E8, ${_state}`;
              await saveConvoTurn(env, transcribedText, _wvAns);
              return speak(_wvAns);
            }
          }
        } catch (_) {
        }
      }
      const effectiveText = convo && isShortReply && String(convo.lastAnswer || "").includes("?") && convo.lastUser ? String(convo.lastUser + " " + transcribedText).slice(0, 280) : transcribedText;
      const chatWord = "(?:צ[׳'״\"]?[אע]?[טת]|ש[׳'״\"]?[אע][טת]|chat)(?:ים)?(?![א-ת])";
      const chatReadFollowUp = /(?:^|\s)(?:קרא|תקרא|הקרא|שמע|תשמע|השמע|קריאה)\s+(?:את\s+)?ה?הודע[הת](?![א-ת])/.test(effectiveText);
      const chatIntent = new RegExp("(?:(?:גוגל|google|גוגול).{0,20}(?:" + chatWord + ")|(?:" + chatWord + ").{0,20}(?:גוגל|google|גוגול)|(?:^|[\\s,])[בהל]?(?:" + chatWord + ")|איש\\s+קשר)", "i").test(effectiveText) || chatReadFollowUp;
      const emailIntent = /(?:(?<!ג'?י)מייל|(?:^|[\s,.!?]|ה)מיל(?![א-ת])|אימייל|אימיל|email|e-mail|mail|תיבת\s*הדואר|דואר\s*נכנס)/i.test(effectiveText);
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
        return await handleEmail(env, GROQ_KEY, stripAccountWords(effectiveText), callerPhone, requestId, detectAccount(effectiveText) || preferredAccount);
      }
      if (chatIntent || sendIntent && mentionsSavedContact) {
        if (!env.MAILBOX_PATH_SECRET || mailboxAuth !== env.MAILBOX_PATH_SECRET) return speak("\u05D0\u05D9\u05DF \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05D9\u05DC \u05D5\u05DC\u05E6\u05D0\u05D8 \u05DE\u05DE\u05E1\u05E4\u05E8 \u05D6\u05D4");
        return await handleGoogleChat(env, GROQ_KEY, stripAccountWords(effectiveText), callerPhone, requestId, detectAccount(effectiveText) || preferredAccount);
      }
      if (!emailIntent && !chatIntent && effectiveText.split(/\s+/).filter(Boolean).length <= 3 && /(?:^|\s)(?:חשבון|בחשבון|החשבון|תיבה)?\s*(?:הראשון|ראשון|השני|שני|שתיים)(?![\u05D0-\u05EA])/.test(effectiveText)) {
        return speak("אין לי בקשה פתוחה עכשיו. אמור מה לבדוק, למשל בדוק מיילים או הודעות צ'אט");
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
          const CITIES = { "\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD": [31.78, 35.22], "\u05D7\u05D9\u05E4\u05D4": [32.79, 34.99], "\u05D1\u05D0\u05E8 \u05E9\u05D1\u05E2": [31.25, 34.79], "\u05D0\u05D9\u05DC\u05EA": [29.55, 34.95], "\u05E0\u05EA\u05E0\u05D9\u05D4": [32.33, 34.86], "\u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4": [32.09, 34.89], "\u05D0\u05E9\u05D3\u05D5\u05D3": [31.8, 34.65], "\u05E6\u05E4\u05EA": [32.96, 35.5], "\u05D8\u05D1\u05E8\u05D9\u05D4": [32.79, 35.53], "\u05E8\u05D7\u05D5\u05D1\u05D5\u05EA": [31.9, 34.9] };
          let weatherCity = "\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1";
          let wLat = 32.08, wLon = 34.78;
          for (const [city, coords] of Object.entries(CITIES)) {
            if (transcribedText.includes(city)) { weatherCity = city; wLat = coords[0]; wLon = coords[1]; break; }
          }
          const wres = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${wLat}&longitude=${wLon}&current=temperature_2m,weather_code&timezone=Asia%2FJerusalem`, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (wres.ok) {
            const wd = await wres.json();
            const wc = wd.current || {};
            if (wc.temperature_2m !== void 0) weatherStr = `\u05DE\u05D6\u05D2 \u05D4\u05D0\u05D5\u05D5\u05D9\u05E8 \u05D1${weatherCity}: ${wc.temperature_2m} \u05DE\u05E2\u05DC\u05D5\u05EA`;
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
        const isReminder = /(?:ת[י]?[זס]כ[ירו]|ה[זס]כ[רי]|א[זס]כור)/.test(transcribedText);
        if (isReminder && callerPhone && env.USER_MEMORY) {
          const _fmtRem = async (ph) => {
            try {
              const raw = await env.USER_MEMORY.get(`reminder_${ph}`);
              if (!raw) return null;
              const r = JSON.parse(raw);
              const d = new Date(r.fireAt);
              const loc = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", hour: "numeric", minute: "2-digit", hour12: false, weekday: "long" });
              const parts = loc.formatToParts(d).reduce((acc, p2) => ({ ...acc, [p2.type]: p2.value }), {});
              const _hh = Number(parts.hour || 8), _mm = Number(parts.minute || 0);
              const timeWords = hebNumWords(_hh) + (_mm === 0 ? " בדיוק" : " ו" + hebNumWords(_mm) + " דקות");
              return `${parts.weekday || ""} בשעה ${timeWords}: ${r.message || "תזכורת"}`;
            } catch (_) { return null; }
          };
          if (/(?:ת?מח[קהי]|מחיק|מחוק|מח[קה] (?:את )?ה?[זס]כור|תבטל|בטל)/.test(transcribedText)) {
            const delKey = `reminder_${callerPhone}`;
            const had = await env.USER_MEMORY.get(delKey);
            if (had) {
              await env.USER_MEMORY.delete(delKey);
              logEvent("reminder_deleted", { caller: callerTail(callerPhone) });
              return speak("התזכורת נמחקה בהצלחה");
            }
            return speak("אין תזכורות שמורות, אין מה למחוק");
          }
          if (/(?:מה (?:הוא |היא )?יגיד|מה יש ב|מה התוכן|מתי (?:תזכיר|אתה מזכיר)|האם יש (?:לי )?(?:עוד )?ת[זס]כורות|יש (?:לי )?(?:עוד )?ת[זס]כורות|אילו ת[זס]כורות|איזה ת[זס]כורות|כמה ת[זס]כורות|מה הת[זס]כורת שלי|מה הת[זס]כורות|מה סידרת)/.test(transcribedText) && !/^\s*(?:ת[י]?[זס]כ[יר]|תעשה)/.test(transcribedText)) {
            const cur = await _fmtRem(callerPhone);
            return speak(cur ? `יש לך תזכורת אחת, ${cur}. כדי למחוק תגיד מחק תזכורת` : "אין תזכורות שמורות כרגע");
          }
          const _W = (w) => "(?:^|(?<=[\u05D1\u05DC\u05E9])|[^\u05D0-\u05EA0-9])";
          const _clean = (t) => t.replace(/[.,\s]+$/g, "").replace(/\s+/g, " ").trim() || "תזכורת ממערכת ה-AI";
          const _stripAll = (t) => _clean(t
            .replace(/(?:ת[י]?[זס]כ(?:יר[יים]?|ורת|ורות|ר)|ה[זס]כר(?:ת)?|א[זס]כור)(?:\s+לי)?/g, " ")
            .replace(/(?:^|\s)(?:בבוקר|בצהריים|בערב|בלילה|בשעה|מחר|היום|להגדיר|הגדר|שים|קח|בבקשה|אני רוצה|אני|רוצה|צריך|לי)(?=\s|$)/g, " ")
            .replace(/(?:^|\s)(?:ב)?(?:אחת עשרה|שתים עשרה|שתיים עשרה|אחת|אחד|שתיים|שתים|שתי|שלוש|שלש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר)(?=\s|$)/g, " "));
          const _NUMW = { "אחת":1,"אחד":1,"שתיים":2,"שתים":2,"שתי":2,"שלוש":3,"שלש":3,"ארבע":4,"חמש":5,"שש":6,"שבע":7,"שמונה":8,"תשע":9,"עשר":10,"חמישה עשר":15,"חמישה":15,"עשרים וחמישה":25,"עשרים":20,"רבעיים":15,"שלושים":30,"ארבעים":40,"חמישים":50 };
          const _MINW = { ..._NUMW, "רבע":15, "חצי":30 };
          const _relM = transcribedText.match(/בעוד\s+(?:(\d{1,3}|אחת|אחד|שתיים|שתים|שתי|שלוש|שלש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|חמישה עשר|עשרים|שלושים)\s*(דקות|דקה|שעות|שעה)|חצי שעה|שעה|שעתיים)/);
          if (_relM) {
            let _mins = 60;
            if (_relM[1]) {
              const _n = /^\d/.test(_relM[1]) ? parseInt(_relM[1]) : (_NUMW[_relM[1]] ?? 60);
              _mins = _relM[2].startsWith("דק") ? _n : _n * 60;
            } else if (_relM[0].includes("חצי")) _mins = 30;
            else if (_relM[0].includes("שעתיים")) _mins = 120;
            const _relFire = new Date(Date.now() + _mins * 6e4);
            const _relMsg = _clean(transcribedText.replace(_relM[0], " ")
              .replace(/(?:ת[י]?[זס]כ(?:יר[יים]?|ורת|ורות|ר)|ה[זס]כר(?:ת)?|א[זס]כור)(?:\s+לי)?/g, " ")
              .replace(/(?:^|\s)(?:אני רוצה|אני|רוצה|צריך|לי|בבקשה)(?=\s|$)/g, " "));
            await env.USER_MEMORY.put(`reminder_${callerPhone}`, JSON.stringify({ fireAt: _relFire.toISOString(), message: _relMsg }), { expirationTtl: 86400 });
            return speak(`נשמרה תזכורת בעוד ${hebNumWords(_mins)} דקות: ${_relMsg}. בשעה זו תקבל צינטוק, וכשתתקשר תשמע את התזכורת.`);
          }
          const _hm = transcribedText.match(/(\d{1,2})(?::(\d{2}))?/);
          let hour = _hm ? parseInt(_hm[1]) : null;
          let minute = _hm?.[2] ? parseInt(_hm[2]) : 0;
          let _hourEnd = -1;
          if (hour === null) {
            const _hwl = [
              ["אחת עשרה", 11], ["שתים עשרה", 12], ["שתיים עשרה", 12],
              ["אחת", 1], ["אחד", 1], ["שתיים", 2], ["שתים", 2], ["שתי", 2],
              ["שלוש", 3], ["שלש", 3], ["ארבע", 4], ["חמש", 5], ["שש", 6],
              ["שבע", 7], ["שמונה", 8], ["תשע", 9], ["עשר", 10]
            ];
            for (const [wd, hv] of _hwl) {
              const _m = new RegExp(_W() + wd + "(?=$|[^\u05D0-\u05EA0-9])").exec(transcribedText);
              if (_m && !/^דקות/.test(transcribedText.slice(_m.index + _m[0].length).trim())) { hour = hv; _hourEnd = _m.index + _m[0].length; break; }
            }
          }
          if (hour === null) {
            if (/בוקר|משך הבוקר/.test(transcribedText)) hour = 8;
            else if (/צהריים/.test(transcribedText)) hour = 12;
            else if (/ערב/.test(transcribedText)) hour = 19;
            else if (/לילה/.test(transcribedText)) hour = 21;
            else hour = 8;
          }
          if (!minute) {
            let _after = "";
            if (_hm && !_hm[2]) _after = transcribedText.slice(_hm.index + _hm[0].length, _hm.index + _hm[0].length + 22);
            else if (_hourEnd > 0) _after = transcribedText.slice(_hourEnd, _hourEnd + 22);
            const _mn = _after.match(/^[\s,]*ו(רבע|חצי|אחת|אחד|שתיים|שתים|שתי|שלוש|שלש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|חמישה עשר|עשרים וחמישה|עשרים|שלושים|ארבעים|חמישים)(?:\s*(?:דקות|דקה))?/);
            if (_mn) minute = _MINW[_mn[1]] ?? 0;
          }
          if (hour !== null && hour < 12) {
            if (/\u05E2\u05E8\u05D1/.test(transcribedText)) hour += 12;
            else if (/\u05DC\u05D9\u05DC\u05D4/.test(transcribedText)) hour += 12;
            else if (/\u05E6\u05D4\u05E8\u05D9\u05D9\u05DD/.test(transcribedText) && hour >= 1 && hour <= 5) hour += 12;
          }
          const isTomorrow = transcribedText.includes("מחר");
          const nowForRem = /* @__PURE__ */ new Date();
          const _israelOffsetMs = (d) => {
            const _dtf = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const _p = {};
            for (const _x of _dtf.formatToParts(d)) _p[_x.type] = _x.value;
            return Date.UTC(+_p.year, +_p.month - 1, +_p.day, +_p.hour % 24, +_p.minute, +_p.second) - d.getTime();
          };
          const _ilP = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(nowForRem).reduce((acc, x) => (acc[x.type] = x.value, acc), {});
          let fireDate = new Date(Date.UTC(+_ilP.year, +_ilP.month - 1, +_ilP.day + (isTomorrow ? 1 : 0), hour, minute, 0) - _israelOffsetMs(new Date(Date.UTC(+_ilP.year, +_ilP.month - 1, +_ilP.day, hour, minute, 0))));
          fireDate = new Date(fireDate.getTime() - _israelOffsetMs(fireDate) + _israelOffsetMs(new Date(fireDate.getTime() - _israelOffsetMs(fireDate))));
          let _rolledFwd = false;
          if (!isTomorrow && fireDate.getTime() <= nowForRem.getTime() + 6e4) { fireDate = new Date(fireDate.getTime() + 864e5); _rolledFwd = true; }
          let _msg = transcribedText;
          if (_hm) _msg = _msg.replace(_hm[0], " ");
          if (minute && !/_hm.*/.test("")) {
            const _mre = new RegExp("ו" + "(רבע|חצי|אחת|אחד|שתיים|שתים|שתי|שלוש|שלש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|חמישה עשר|עשרים וחמישה|עשרים|שלושים|ארבעים|חמישים)(?:\\s*(?:דקות|דקה))?");
            _msg = _msg.replace(_mre, " ");
          }
          const message = _stripAll(_msg);
          await env.USER_MEMORY.put(`reminder_${callerPhone}`, JSON.stringify({ fireAt: fireDate.toISOString(), message }), { expirationTtl: 86400 });
          const _hW2 = hebNumWords(hour === 0 ? 12 : hour > 12 ? hour - 12 : hour);
          const _tod2 = hour >= 21 || hour < 5 ? " בלילה" : hour >= 19 ? " בערב" : hour >= 12 && hour < 17 ? " בצהריים" : " בבוקר";
          const _minP2 = minute === 15 ? " ורבע" : minute === 30 ? " וחצי" : minute > 0 ? " ו" + hebNumWords(minute) + " דקות" : "";
          return speak(`נשמרה תזכורת ל${(isTomorrow || _rolledFwd) ? "מחר" : "היום"} בשעה ${_hW2}${_tod2}${_minP2}: ${message}. בשעה זו תקבל צינטוק, וכשתתקשר תשמע את התזכורת.`);
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
      const pairAns = await currencyTextAnswer(effectiveText);
      if (pairAns) {
        logEvent("currency_pair_answered", { caller: callerTail(callerPhone) });
        await saveConvoTurn(env, transcribedText, pairAns);
        return speak(pairAns);
      }
      const euroQ = asksEuroRate(effectiveText);
      const currOnlyQ = /(?:\u05E9\u05D9?\u05E2\u05E8|\u05E1[\u05D9]?\u05E2\u05E8|\u05DE\u05D8\u05D1\u05E2)/.test(effectiveText) && !asksDollarRate(effectiveText) && !euroQ;
      if (currOnlyQ) {
        const parts = [];
        if (dollarRate && Number.isFinite(dollarRate.rate)) {
          const dSh = Math.floor(dollarRate.rate);
          const dAg = Math.round((dollarRate.rate - dSh) * 100);
          parts.push("שער הדולר " + dSh + " שקלים ו" + dAg + " אגורות");
        }
        const eurAll = await currentEuroRate();
        if (eurAll) {
          const eSh = Math.floor(eurAll);
          const eAg = Math.round((eurAll - eSh) * 100);
          parts.push("שער האירו " + eSh + " שקלים ו" + eAg + " אגורות");
        }
        if (parts.length) {
          const ans = parts.join(", ");
          await saveConvoTurn(env, transcribedText, ans);
          return speak(ans);
        }
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
      const systemPrompt = `\u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05E2\u05D5\u05E0\u05D4 \u05E7\u05E6\u05E8, \u05D1\u05E8\u05D5\u05E8 \u05D5\u05EA\u05DE\u05E6\u05D9\u05EA\u05D9, \u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD 3 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD, \u05EA\u05DE\u05D9\u05D3 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05E4\u05E9\u05D5\u05D8\u05D4, \u05D1\u05DC\u05D9 \u05D0\u05E0\u05D2\u05DC\u05D9\u05EA. \u05D9\u05DB\u05D5\u05DC\u05D5\u05EA \u05D4\u05DE\u05E2\u05E8\u05DB\u05EA: \u05E9\u05E2\u05D4 \u05D5\u05EA\u05D0\u05E8\u05D9\u05DA, \u05DE\u05D6\u05D2 \u05D0\u05D5\u05D5\u05D9\u05E8, \u05E9\u05E2\u05E8\u05D9 \u05D3\u05D5\u05DC\u05E8 \u05D0\u05D9\u05E8\u05D5 \u05D5\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF, \u05E7\u05E8\u05D9\u05D0\u05EA \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D5\u05D4\u05D5\u05D3\u05E2\u05D5\u05EA \u05E6\u05D0\u05D8, \u05D4\u05D2\u05D3\u05E8\u05EA \u05EA\u05D6\u05DB\u05D5\u05E8\u05D5\u05EA, \u05E9\u05DC\u05D9\u05D7\u05EA \u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D5\u05D4\u05D5\u05D3\u05E2\u05D5\u05EA, \u05D1\u05D3\u05D9\u05D7\u05D5\u05EA \u05D5\u05E9\u05D0\u05DC\u05D5\u05EA \u05DB\u05DC\u05DC\u05D9\u05D5\u05EA. \u05D0\u05DC \u05EA\u05D2\u05D9\u05D3 \u05E9\u05D0\u05D9\u05E0\u05DA \u05D9\u05DB\u05D5\u05DC \u05DC\u05D2\u05E9\u05EA \u05DC\u05DE\u05D9\u05D9\u05DC\u05D9\u05DD \u05D0\u05D5 \u05DC\u05E6\u05D0\u05D8\u05D9\u05DD, \u05D6\u05D4 \u05E7\u05D9\u05D9\u05DD \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA. \u05EA\u05D6\u05DB\u05D5\u05E8\u05D5\u05EA \u05E0\u05E9\u05DE\u05E8\u05D5\u05EA \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05DB\u05E9\u05D4\u05D1\u05E7\u05E9\u05D4 \u05DB\u05D5\u05DC\u05DC\u05EA \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05D0\u05D5 \u05EA\u05D6\u05DB\u05D9\u05E8 - \u05D0\u05DD \u05D4\u05D1\u05E7\u05E9\u05D4 \u05D4\u05D2\u05D9\u05E2\u05D4 \u05D0\u05DC\u05D9\u05DA \u05E1\u05D9\u05DE\u05DF \u05E9\u05DC\u05D0 \u05E0\u05E9\u05DE\u05E8\u05D4, \u05D1\u05E7\u05E9 \u05DE\u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05DC\u05D5\u05DE\u05E8 \u05EA\u05D6\u05DB\u05D9\u05E8 \u05DC\u05D9 \u05D5\u05D0\u05D6 \u05D0\u05EA \u05D4\u05E9\u05E2\u05D4. \u05D0\u05DD \u05D4\u05DE\u05E9\u05E4\u05D8 \u05DE\u05D1\u05D5\u05DC\u05D1\u05DC, \u05D7\u05E1\u05E8 \u05DE\u05D9\u05D3\u05E2 \u05D0\u05D5 \u05E0\u05E9\u05DE\u05E2 \u05DB\u05DE\u05D5 \u05D8\u05E2\u05D5\u05EA \u05EA\u05DE\u05DC\u05D5\u05DC \u05DE\u05E7\u05D5 \u05D8\u05DC\u05E4\u05D5\u05E0\u05D9, \u05D0\u05DC \u05EA\u05DE\u05E6\u05D9\u05D0 \u05EA\u05E9\u05D5\u05D1\u05D4, \u05E2\u05E0\u05D4 \u05D1\u05E7\u05E6\u05E8\u05D4 \u05E9\u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA \u05D5\u05D1\u05E7\u05E9 \u05E9\u05D9\u05D7\u05D6\u05D5\u05E8 \u05E2\u05DC \u05D4\u05D1\u05E7\u05E9\u05D4. \u05D0\u05DC \u05EA\u05E1\u05D1\u05D9\u05E8 \u05DE\u05D4 \u05D0\u05EA\u05D4 \u05E2\u05D5\u05E9\u05D4, \u05E8\u05E7 \u05E2\u05E0\u05D4. \u05D0\u05DD \u05E9\u05D5\u05D0\u05DC\u05D9\u05DD \u05DE\u05D9 \u05D0\u05EA\u05D4, \u05E2\u05E0\u05D4: \u05D0\u05E0\u05D9 \u05D4\u05E2\u05D5\u05D6\u05E8 \u05D4\u05D7\u05DB\u05DD \u05E9\u05DC\u05DA.
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
        const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
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
      logEvent("system_error", { type: err?.name || "Error", msg: String(err?.message || "").slice(0, 120), stack: String(err?.stack || "").slice(0, 300) });
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
var BRIDGE_URLS = { 1: "https://script.google.com/macros/s/AKfycby8IpHtoJGHz2zFOxzP1PrsckyYdmdGIvSkW6iCutLi4GyCnaB34xVfCMAnbuKp5cekjg/exec", 2: "https://script.google.com/macros/s/AKfycbwX4_sE_utQvSaU8_WarCw9BtZWXBfe0s6ZnM2Cdl7rtNfKiwB3GoskFAp9Uqugk7w47A/exec" };
function detectAccount(text) {
  const t = String(text || "").replace(/\s+/g, " ");
  if (/(?:חשבון|תיבה)\s*(?:ה)?(?:שניים|שניה|שני|שתיים|2)/.test(t)) return 2;
  if (/(?:חשבון|תיבה)\s*(?:ה)?(?:ראשון|ראשונה|אחד|אחת|1)/.test(t)) return 1;
  return null;
}
function stripAccountWords(text) {
  const t = String(text || "").replace(/\s*(?:\u05D1)?(?:\u05D7\u05E9\u05D1\u05D5\u05DF|\u05EA\u05D9\u05D1\u05D4)\s*(?:\u05D4)?(?:\u05E8\u05D0\u05E9\u05D5\u05DF|\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4|\u05D0\u05D7\u05D3|\u05D0\u05D7\u05EA|\u05E9\u05E0\u05D9\u05D9\u05DD|\u05E9\u05E0\u05D9\u05D4|\u05E9\u05E0\u05D9|\u05E9\u05EA\u05D9\u05D9\u05DD)(?![\u05D0-\u05EA])/g, " ");
  return t.replace(/\s+/g, " ").trim() || String(text || "").trim();
}
__name(stripAccountWords, "stripAccountWords");
__name2(stripAccountWords, "stripAccountWords");
__name22(stripAccountWords, "stripAccountWords");
async function askAccount(env, callerPhone, service, originalRequest, verb) {
  const pend = { service: String(service || "email"), originalRequest: String(originalRequest || ""), verb: String(verb || "בדיקה"), tries: 0 };
  const key = "acct_" + normalizeIsraelPhone(callerPhone);
  await doStateFetch(env, key, "PUT", pend);
  await env.USER_MEMORY.put(key, JSON.stringify(pend), { expirationTtl: 300 });
  logEvent("account_ask", { service: pend.service, verb: pend.verb, caller: callerTail(callerPhone) });
  return accountReadPrompt(pend);
}
__name(askAccount, "askAccount");
__name2(askAccount, "askAccount");
__name22(askAccount, "askAccount");
function accountReadPrompt(pend) {
  const isChat = pend.service === "chat";
  const isSend = pend.verb === "שליחה";
  const v1 = isSend ? (isChat ? "לשליחת הודעת הצאט מ" : "לשליחת המייל מ") : isChat ? "לבדיקת הודעות הצאט ב" : "לבדיקת המיילים ב";
  const question = v1 + "החשבון וואי אפס חמש אפס הקש אחת, " + v1 + "החשבון וואי טי אפס חמש שלוש הקש שתיים";
  return textResponse(`read=t-${question}=account,no,1,1,15,Digits,yes,yes,,,,,None,`);
}
__name(accountReadPrompt, "accountReadPrompt");
__name2(accountReadPrompt, "accountReadPrompt");
__name22(accountReadPrompt, "accountReadPrompt");
async function handleAccountSelection(env, digit, callerPhone, requestId) {
  if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("אין הרשאה לביצוע הפעולה ממספר זה");
  const key = "acct_" + normalizeIsraelPhone(callerPhone);
  const rawDo = await doStateFetch(env, key, "GET");
  const raw = (rawDo && rawDo.value !== void 0 && rawDo.value !== null) ? JSON.stringify(rawDo.value) : await env.USER_MEMORY.get(key);
  if (!raw) return speak("אין בקשה ממתינה לבחירת חשבון, אמור את בקשתך מחדש");
  const pend = JSON.parse(raw);
  if (digit !== "1" && digit !== "2") {
    if ((pend.tries || 0) >= 1) {
      await doStateFetch(env, key, "DELETE");
      await env.USER_MEMORY.delete(key);
      return speak("בוטל");
    }
    const pend2 = { ...pend, tries: (pend.tries || 0) + 1 };
    await doStateFetch(env, key, "PUT", pend2);
    await env.USER_MEMORY.put(key, JSON.stringify(pend2), { expirationTtl: 300 });
    return accountReadPrompt(pend2);
  }
  await doStateFetch(env, key, "DELETE");
  await env.USER_MEMORY.delete(key);
  const account = digit === "2" ? 2 : 1;
  logEvent("account_selected", { account, service: String(pend.service || "").slice(0, 8), caller: callerTail(callerPhone) });
  if (pend.service === "chat") return await handleGoogleChat(env, env.GROQ_KEY || "", pend.originalRequest || "", callerPhone, requestId, account);
  return await handleEmail(env, env.GROQ_KEY || "", pend.originalRequest || "", callerPhone, requestId, account);
}
__name(handleAccountSelection, "handleAccountSelection");
__name2(handleAccountSelection, "handleAccountSelection");
__name22(handleAccountSelection, "handleAccountSelection");
async function callBridge(env, payload, account) {
  const res = await fetch(BRIDGE_URLS[account === 2 ? 2 : 1], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, auth: env.GMAIL_BRIDGE_SECRET || "" })
  });
  return await res.json().catch(() => ({ ok: false, error: "bridge_unreachable" }));
}
__name(callBridge, "callBridge");
__name2(callBridge, "callBridge");
__name22(callBridge, "callBridge");
async function doStateFetch(env, key, method, body) {
  try {
    if (!env.CONT_STATE) return null;
    const stub = env.CONT_STATE.get(env.CONT_STATE.idFromName(key));
    const res = await stub.fetch("https://do/" + encodeURIComponent(key), { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    return await res.json().catch(() => null);
  } catch (_) {
    return null;
  }
}
__name(doStateFetch, "doStateFetch");
__name2(doStateFetch, "doStateFetch");
__name22(doStateFetch, "doStateFetch");
async function kvGetList(env, key) {
  try {
    if (/^(?:cont_|pend_|lt_|convo_)/.test(key) && env.CONT_STATE) {
      const r = await doStateFetch(env, key, "GET");
      if (r && r.value !== undefined && r.value !== null) return r.value;
      if (r && r.value === null) return null;
    }
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
    if (/^(?:cont_|pend_|lt_|convo_)/.test(key) && env.CONT_STATE) {
      await doStateFetch(env, key, "PUT", val);
    }
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
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "").replace(/[\u05DD\u05DF\u05E5\u05E3\u05DA]/g, (ch) => ({ "\u05DD": "\u05DE", "\u05DF": "\u05E0", "\u05E5": "\u05E6", "\u05E3": "\u05E4", "\u05DA": "\u05DB" })[ch]);
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
  if (/[a-z]/.test(n0) && n0.length >= 3) {
    const LATIN_TO_HEB = { b: "ב", c: "כ", d: "ד", f: "פ", g: "ג", h: "ה", j: "ג", k: "ק", l: "ל", m: "מ", n: "נ", p: "פ", q: "ק", r: "ר", s: "ס", t: "ת", v: "ב", w: "ו", x: "ס", z: "ז" };
    let sk = "";
    for (const ch of n0) if (LATIN_TO_HEB[ch]) sk += LATIN_TO_HEB[ch];
    if (sk.length >= 3) out.push(sk);
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
    await doStateFetch(env, contStateKey(callerPhone), "PUT", cont);
    await env.USER_MEMORY.put(contStateKey(callerPhone), JSON.stringify(cont), { expirationTtl: 600 });
  } catch (_) {
  }
}
__name(setContState, "setContState");
__name2(setContState, "setContState");
__name22(setContState, "setContState");
async function clearContState(env, callerPhone) {
  try {
    await doStateFetch(env, contStateKey(callerPhone), "DELETE");
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
    await doStateFetch(env, lastTargetKey(callerPhone), "PUT", { name: String(name || ""), address, kind: String(kind || ""), ts: Date.now() });
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
const CURRENCIES = [
  { code: "USD", names: ["דולר אמריקאי", "דולר"], he: "דולר" },
  { code: "EUR", names: ["אירו", "יורו"], he: "אירו" },
  { code: "GBP", names: ["לירה שטרלינג", "שטרלינג", "פאונד"], he: "לירה שטרלינג" },
  { code: "JPY", names: ["ין"], he: "ין יפני" },
  { code: "CHF", names: ["פרנק שוויצרי", "פרנק"], he: "פרנק שוויצרי" },
  { code: "CAD", names: ["דולר קנדי"], he: "דולר קנדי" },
  { code: "AUD", names: ["דולר אוסטרלי"], he: "דולר אוסטרלי" },
  { code: "CNY", names: ["יואן"], he: "יואן" },
  { code: "RUB", names: ["רובל"], he: "רובל" },
  { code: "PLN", names: ["זלוטי"], he: "זלוטי" },
  { code: "AED", names: ["דירהם"], he: "דירהם" },
  { code: "TRY", names: ["לירה טורקית"], he: "לירה טורקית" },
  { code: "SEK", names: ["קרונה שוודית"], he: "קרונה שוודית" },
  { code: "CZK", names: ["קרונה צכית", "קורונה צכית"], he: "קרונה צכית" },
  { code: "DKK", names: ["קרונה דנית"], he: "קרונה דנית" },
  { code: "NOK", names: ["קרונה נורווגית"], he: "קרונה נורווגית" },
  { code: "THB", names: ["באט תאילנדי", "באט"], he: "באט תאילנדי" },
  { code: "ZAR", names: ["רנד"], he: "רנד" },
  { code: "MXN", names: ["פסו"], he: "פסו מקסיקני" },
  { code: "ILS", names: ["שקלים", "שקל"], he: "שקל" },
  { code: "BTC", names: ["ביטקוין", "ביקוד", "ביטקויד"], he: "ביטקוין" },
  { code: "ETH", names: ["אתריום", "איתריום"], he: "אתריום" }
];
const CUR_SHORT_RE = { "\u05E9\u05E7\u05DC": "\u05E9\u05E7\u05DC", "\u05E9\u05E7\u05DC\u05D9\u05DD": "\u05E9\u05E7\u05DC\u05D9\u05DD" };
function findCurrencyWords(text) {
  let t = " " + String(text || "").replace(/[,.;:!?]/g, " ") + " ";
  const hits = [];
  const names = [];
  for (const c of CURRENCIES) for (const nm of c.names) names.push({ nm, code: c.code, he: c.he });
  names.sort((a, b) => b.nm.length - a.nm.length);
  for (const { nm, code, he } of names) {
    if (["\u05D9\u05DF", "\u05E8\u05E0\u05D3", "\u05D1\u05D0\u05D8", "\u05E4\u05E1\u05D5"].includes(nm)) {
      const re = new RegExp("(?:^|\\s)" + nm + "(?![\u05D0-\u05EA])", "g");
      let m;
      while ((m = re.exec(t)) !== null) hits.push({ code, he, pos: m.index, len: nm.length });
      continue;
    }
    if (nm === "\u05E9\u05E7\u05DC" || nm === "\u05E9\u05E7\u05DC\u05D9\u05DD") {
      const re = new RegExp("(?:^|[^\u05DE])" + nm, "g");
      let m;
      while ((m = re.exec(t)) !== null) hits.push({ code, he, pos: m.index + 1, len: nm.length });
      continue;
    }
    let idx = t.indexOf(nm);
    while (idx >= 0) {
      hits.push({ code, he, pos: idx, len: nm.length });
      t = t.slice(0, idx) + " ".repeat(nm.length) + t.slice(idx + nm.length);
      idx = t.indexOf(nm);
    }
  }
  hits.sort((a, b) => a.pos - b.pos);
  return hits;
}
__name(findCurrencyWords, "findCurrencyWords");
__name2(findCurrencyWords, "findCurrencyWords");
__name22(findCurrencyWords, "findCurrencyWords");
function updatedStampText(unix) {
  try {
    const d = new Date(unix * 1000);
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", day: "numeric", month: "numeric", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(d);
    const get = (t) => (parts.find((p) => p.type === t) || {}).value || "";
    const day = parseInt(get("day"), 10), mon = parseInt(get("month"), 10);
    const hh = parseInt(get("hour"), 10), mm = parseInt(get("minute"), 10);
    const months = ["\u05D9\u05E0\u05D5\u05D0\u05E8", "\u05E4\u05D1\u05E8\u05D5\u05D0\u05E8", "\u05DE\u05E8\u05E5", "\u05D0\u05E4\u05E8\u05D9\u05DC", "\u05DE\u05D0\u05D9", "\u05D9\u05D5\u05E0\u05D9", "\u05D9\u05D5\u05DC\u05D9", "\u05D0\u05D5\u05D2\u05D5\u05E1\u05D8", "\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8", "\u05D0\u05D5\u05E7\u05D8\u05D5\u05D1\u05E8", "\u05E0\u05D5\u05D1\u05DE\u05D1\u05E8", "\u05D3\u05E6\u05DE\u05D1\u05E8"];
    let time = speakTimeNumber(hh % 24);
    if (mm > 0) time += " \u05D5" + speakTimeNumber(mm);
    const _tod = hh >= 21 || hh < 5 ? " \u05D1\u05DC\u05D9\u05DC\u05D4" : hh >= 17 ? " \u05D1\u05E2\u05E8\u05D1" : hh >= 12 ? " \u05D1\u05E6\u05D4\u05E8\u05D9\u05D9\u05DD" : " \u05D1\u05D1\u05D5\u05E7\u05E8";
    return "\u05E2\u05D5\u05D3\u05DB\u05DF \u05D1\u05EA\u05D0\u05E8\u05D9\u05DA " + day + " \u05D1" + months[mon - 1] + " " + new Date().getFullYear() + " \u05D1\u05E9\u05E2\u05D4 " + time + _tod;
  } catch (_) {
    return "";
  }
}
__name(updatedStampText, "updatedStampText");
__name2(updatedStampText, "updatedStampText");
__name22(updatedStampText, "updatedStampText");
async function currencyRateAnswer(from, to) {
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/ILS", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return null;
    const j = await r.json();
    if (j?.result !== "success" || !j.rates) return null;
    const price = (code) => code === "ILS" ? 1 : 1 / Number(j.rates[code]);
    const pf = price(from.code), pt = price(to.code);
    if (!Number.isFinite(pf) || !Number.isFinite(pt) || pf <= 0 || pt <= 0) return null;
    const rate = pf / pt;
    let valStr;
    const cryptoFrom = ["BTC", "ETH"].includes(from.code);
    if (to.code === "ILS") {
      if (cryptoFrom) valStr = Math.round(rate).toLocaleString("en-US") + " \u05E9\u05E7\u05DC\u05D9\u05DD";
      else {
        const sh = Math.floor(rate), ag = Math.round((rate - sh) * 100);
        valStr = sh + " \u05E9\u05E7\u05DC\u05D9\u05DD \u05D5" + ag + " \u05D0\u05D2\u05D5\u05E8\u05D5\u05EA";
      }
    } else {
      const rounded = rate >= 100 ? String(Math.round(rate)) : String(Math.round(rate * 100) / 100);
      valStr = rounded + " " + to.he;
    }
    const stamp = j.time_last_update_unix ? updatedStampText(j.time_last_update_unix) : "";
    return "\u05E9\u05E2\u05E8 \u05D4" + from.he + " \u05DE\u05D5\u05DC \u05D4" + to.he + " \u05D4\u05D5\u05D0 " + valStr + (stamp ? ", " + stamp : "");
  } catch (_) {
    return null;
  }
}
__name(currencyRateAnswer, "currencyRateAnswer");
__name2(currencyRateAnswer, "currencyRateAnswer");
__name22(currencyRateAnswer, "currencyRateAnswer");
async function currencyTextAnswer(text) {
  const hits = findCurrencyWords(text);
  if (!hits.length) return null;
  let from = null, to = null;
  const molIdx = String(text || "").indexOf("\u05DE\u05D5\u05DC");
  if (molIdx >= 0) {
    const before = hits.filter((h) => h.pos < molIdx), after = hits.filter((h) => h.pos >= molIdx);
    from = before[0] || hits[0];
    to = after[0] || hits.find((h) => h.code !== from.code);
  } else {
    const nonIls = hits.filter((h) => h.code !== "ILS");
    if (!nonIls.length) return null;
    if (nonIls.length >= 2) {
      from = nonIls[0];
      to = nonIls[1];
    } else {
      from = nonIls[0];
      to = { code: "ILS", he: "\u05E9\u05E7\u05DC" };
    }
  }
  if (!from || !to || from.code === to.code) return null;
  return await currencyRateAnswer(from, to);
}
__name(currencyTextAnswer, "currencyTextAnswer");
__name2(currencyTextAnswer, "currencyTextAnswer");
__name22(currencyTextAnswer, "currencyTextAnswer");
function findCurrency(text) {
  const t = String(text || "").replace(/[.,!?;:\u05C4]/g, " ");
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
  const glued = text.replace(/\s+/g, "");
  const clockQ = /(?:מההשעה|מהשעה|השעהעכשיו|מההתאריך|מהתאריך|איזהתאריך|התאריךהיום|תאריךעברי|איזהיוםהיום|איזהיום|מהיום)/.test(glued) || /(?:מה השעה|מה שעה|השעה עכשיו|מה התאריך|מה תאריך|איזה תאריך|התאריך היום|תאריך עברי|איזה יום היום|איזה יום)/.test(text);
  if (cont.kind === "mailrange") {
    if (/(?:^|\s)(?:ב?ה?יום|ב?ה?אתמול|ב?ה?יממה|ב?ה?ימום|ב?ה?יוממה)(?![\u05D0-\u05EA])/.test(text) || /(?:יום|יממה|ימום)\s*ה?א?ח\s?רונ/.test(text)) return { status: "resolved", timeframe: "day" };
    if (/(?:^|\s)ב?(?:שבו[לער]|שבועות|שבולים)/.test(text)) return { status: "resolved", timeframe: "week" };
    if (/(?:^|\s)ב?(?:חוד[שס]|חודשיים)/.test(text)) return { status: "resolved", timeframe: "month" };
    if (/(?:^|\s)(?:ב?ה?כל|הכול|(?:ב?כל\s*)?הזמנים)(?![\u05D0-\u05EA])/.test(text)) return { status: "resolved", timeframe: "all" };
    const lifeQ = /(?:שלח|מייל|צ[׳'\u05F4"]?[אע][טת]|תשלח|מזג|גלים|בדיחה|השעה|תאריך|הקש)/.test(text);
    if (words >= 4 || lifeQ) return { status: "newcommand" };
    return { status: "reask" };
  }
  if (cont.kind === "currency") {
    const cur = findCurrency(text);
    if (cur) return { status: "resolved", currency: cur };
    const ackQ = /^(?:תודה|בסדר|אוקיי|כן|לא|סבבה|יפה|כלום|אין כלום)(?:\s|$)/.test(text.trim()) && words <= 2;
    if (ackQ) return { status: "ack" };
    const lifeQ = /(?:מזג|בדיחה|לעזור|יכול לעשות|מה אתה|מייל|צאט|שלח|תשלח)/.test(text);
    if (words >= 4 || lifeQ) return { status: "newcommand" };
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
async function chatSendConfirm(env, callerPhone, to, toName, text, prefixNote, account = 1) {
  logEvent("chat_send_pending_confirm", { caller: callerTail(callerPhone) });
  return await pendingConfirmRead(env, callerPhone, { kind: "chat", to, text: text || "", name: toName || "", account: account || 1 }, `${prefixNote || ""}\u05DC\u05E9\u05DC\u05D5\u05D7 \u05D1\u05E6\u05D0\u05D8 \u05D0\u05DC ${speakAddress(to)} \u05D0\u05EA \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4 ${text || ""}? \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA, \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC \u05D4\u05E7\u05E9 \u05E9\u05EA\u05D9\u05D9\u05DD`);
}
__name(chatSendConfirm, "chatSendConfirm");
__name2(chatSendConfirm, "chatSendConfirm");
__name22(chatSendConfirm, "chatSendConfirm");
async function emailSendConfirm(env, callerPhone, to, toName, subject, body, prefixNote, account = 1) {
  logEvent("email_send_pending_confirm", { caller: callerTail(callerPhone), to: String(to || "").slice(0, 40) });
  return await pendingConfirmRead(env, callerPhone, { kind: "email", to, subject: subject || "", body: body || "", name: toName || "", account: account || 1 }, `${prefixNote || ""}\u05DC\u05E9\u05DC\u05D5\u05D7 \u05DE\u05D9\u05D9\u05DC \u05D0\u05DC ${speakAddress(to)}, \u05D1\u05E0\u05D5\u05E9\u05D0 ${subject || "\u05DC\u05DC\u05D0 \u05E0\u05D5\u05E9\u05D0"}, \u05E2\u05DD \u05D4\u05EA\u05D5\u05DB\u05DF ${body || "\u05E8\u05D9\u05E7"}? \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D4\u05E7\u05E9 \u05D0\u05D7\u05EA, \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC \u05D4\u05E7\u05E9 \u05E9\u05EA\u05D9\u05D9\u05DD`);
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
    if (cont.kind === "mailrange" && res.timeframe) {
      await clearContState(env, callerPhone);
      logEvent("cont_mailrange_resolved", { timeframe: res.timeframe, caller: callerTail(callerPhone) });
      return await emailDigest(env, env.GROQ_KEY || "", callerPhone, requestId, cont.account || 1, res.timeframe, !!cont.unread);
    }
    if (cont.kind === "contact" && res.contact) {
      const contact = res.contact;
      if (cont.action === "chat_send") {
        await clearContState(env, callerPhone);
        logEvent("cont_contact_resolved", { channel: "chat", caller: callerTail(callerPhone) });
        return await chatSendConfirm(env, callerPhone, contact.address, contact.name, (cont.payload && cont.payload.text) || "", "", (cont.payload && cont.payload.account) || 1);
      }
      if (cont.action === "email_send") {
        await clearContState(env, callerPhone);
        logEvent("cont_contact_resolved", { channel: "email", caller: callerTail(callerPhone) });
        return await emailSendConfirm(env, callerPhone, contact.address, contact.name, (cont.payload && cont.payload.subject) || "", (cont.payload && cont.payload.body) || "", "", (cont.payload && cont.payload.account) || 1);
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
async function correctTranscription(text) {
  const orig = (text || "").trim();
  if (!orig || orig.length > 300) return orig;
  const SYS = "\u05D0\u05EA\u05D4 \u05DE\u05EA\u05E7\u05D9\u05DF \u05D8\u05E7\u05E1\u05D8 \u05E2\u05D1\u05E8\u05D9 \u05E9\u05EA\u05D5\u05DE\u05DC\u05DC \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05DE\u05D4\u05E7\u05DC\u05D8\u05EA \u05D8\u05DC\u05E4\u05D5\u05DF \u05D1\u05E7\u05D5 \u05E2\u05D5\u05D6\u05E8 \u05D0\u05D9\u05E9\u05D9. \u05EA\u05D7\u05D5\u05DE\u05D9 \u05D4\u05E7\u05D5: \u05EA\u05D6\u05DB\u05D5\u05E8\u05D5\u05EA, \u05E9\u05E2\u05D4 \u05D5\u05EA\u05D0\u05E8\u05D9\u05DA, \u05DE\u05D6\u05D2 \u05D0\u05D5\u05D5\u05D9\u05E8, \u05E9\u05E2\u05E8\u05D9 \u05DE\u05D8\u05D1\u05E2\u05D5\u05EA, \u05DE\u05D9\u05D9\u05DC \u05D5\u05E6\u05D0\u05D8, \u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA, \u05D1\u05D3\u05D9\u05D7\u05D5\u05EA. \u05EA\u05E7\u05DF \u05D0\u05DA \u05D5\u05E8\u05E7 \u05E9\u05D9\u05D1\u05D5\u05E9\u05D9 \u05EA\u05DE\u05DC\u05D5\u05DC \u05D1\u05E8\u05D5\u05E8\u05D9\u05DD: \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA \u05DE\u05EA\u05D7\u05DC\u05E4\u05D5\u05EA \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA (\u05D6/\u05E1, \u05D8/\u05EA, \u05DB/\u05D7, \u05D3/\u05D6) \u05D0\u05D5 \u05DE\u05D9\u05DC\u05D4 \u05DC\u05D0 \u05E7\u05D9\u05D9\u05DE\u05EA \u05E9\u05D4\u05D2\u05D9\u05D9\u05EA\u05D4 \u05D3\u05D5\u05DE\u05D4 \u05DC\u05DE\u05D9\u05DC\u05D4 \u05E7\u05D9\u05D9\u05DE\u05EA \u05DE\u05EA\u05D7\u05D5\u05DE\u05D9 \u05D4\u05E7\u05D5. \u05D3\u05D5\u05D2\u05DE\u05D0\u05D5\u05EA: \"תסכיר לי\" \u2192 \"תזכיר לי\". \"תסכורת\" \u2192 \"תזכורת\". \"בשבול האחרון\" \u2192 \"בשבוע האחרון\". \"בחודס האחרון\" \u2192 \"בחודש האחרון\". \"ימום\" \u2192 \"ביממה\". \u05DB\u05DC\u05DC\u05D9 \u05D1\u05E8\u05D6\u05DC: 1. \u05D0\u05DC \u05EA\u05E9\u05E0\u05D4 \u05DE\u05D9\u05DC\u05D9\u05DD \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D2\u05DD \u05D0\u05DD \u05E0\u05E8\u05D0\u05D5\u05EA \u05DE\u05D5\u05D6\u05E8\u05D5\u05EA \u05DC\u05DA. 2. \u05D0\u05DC \u05EA\u05D5\u05E1\u05D9\u05E3, \u05D0\u05DC \u05EA\u05E9\u05DE\u05D8\u05D5 \u05D0\u05DC \u05EA\u05D7\u05DC\u05D9\u05E3 \u05DE\u05D9\u05DC\u05D9\u05DD \u05D0\u05D5 \u05E9\u05DE\u05D5\u05EA. 3. \u05D0\u05DD \u05D0\u05D9\u05E0\u05DA \u05D1\u05D8\u05D5\u05D7 \u05E9\u05D9\u05E9 \u05E9\u05D9\u05D1\u05D5\u05E1 - \u05D4\u05D7\u05D6\u05E8 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9 \u05DE\u05D9\u05DC\u05D4 \u05D1\u05DE\u05D9\u05DC\u05D4. 4. \u05D4\u05D7\u05D6\u05E8 \u05D0\u05DA \u05D5\u05E8\u05E7 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8 \u05D4\u05DE\u05EA\u05D5\u05E7\u05DF, \u05D1\u05DC\u05D9 \u05E0\u05E7\u05D5\u05D3\u05EA\u05D9\u05D9\u05DD, \u05D4\u05E2\u05E8\u05D5\u05EA \u05D0\u05D5 \u05D4\u05E1\u05D1\u05D9\u05E8\u05D9\u05DD.";
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "qwen/qwen3.8-27b", temperature: 0, max_tokens: 120, messages: [{ role: "system", content: SYS }, { role: "user", content: orig }] }),
      signal: ctrl.signal
    });
    clearTimeout(to);
    if (!res.ok) return orig;
    const j = await res.json();
    let t2 = (j.choices?.[0]?.message?.content || "").trim().replace(/^[\u05D4\u05D8\u05E7\u05E1\u05D8\u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:]+\s*/, "").replace(/["']/g, "").trim();
    if (!t2 || t2.length > orig.length * 1.25 + 4 || t2.length < orig.length * 0.75) return orig;
    const wc1 = orig.split(/\s+/).length, wc2 = t2.split(/\s+/).length;
    if (Math.abs(wc1 - wc2) > 1) return orig;
    return t2;
  } catch (_) { return orig; }
}

function buildWhisperPrompt(contacts) {
  let p = "שיחה בעברית בקו טלפון. מונחים: תזכיר לי, תזכירי, תזכורת, תזכורות, הזכר לי, ורבע, וחצי, דקות, שעה, בבוקר, בצהריים, בערב, בלילה, מחר, בעוד, צינטוק, תאריך, מזג אוויר, דולר, אירו, ביטקוין, מטבע, שטרודל, נקודה, מייל, צאט, בדיחה, תודה, שלח הודעה, ספר לי.";
  const names = [];
  for (const c of contacts || []) {
    const n = String(c && c.name || "").trim();
    if (n.length >= 2 && n.length <= 14 && /^[\u05D0-\u05EA\s]+$/.test(n) && !names.includes(n)) names.push(n);
    if (names.length >= 8) break;
  }
  if (names.length) p += " שמות: " + names.join(", ").slice(0, 90) + ".";
  return p.slice(0, 220);
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
  const rawToks = String(requestedName || "").split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 3);
  const tokSet = new Set();
  for (const t of rawToks) {
    tokSet.add(normalizeContactTerm(t));
    if (t.length >= 4) tokSet.add(normalizeContactTerm(t.slice(1)));
  }
  for (const tk of tokSet) {
    if (tk.length < 3) continue;
    const word = contacts.filter((contact) => [contact.name, ...contact.aliases || []].some((value) => normalizeContactTerm(value).includes(tk)));
    if (word.length) return word;
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
    let prev = {}; try { const pDo = await doStateFetch(env, key, "GET"); prev = (pDo && pDo.value && pDo.value.turns) ? pDo.value : JSON.parse(await env.USER_MEMORY.get(key) || "{}") || {}; } catch (_) {}
    const turns = [...(prev.turns || []), { u: String(userText || "").slice(0, 200), a: String(answerText || "").slice(0, 300) }].slice(-6);
    await doStateFetch(env, key, "PUT", { turns, lastUser: String(userText || "").slice(0, 200), lastAnswer: String(answerText || "").slice(0, 300), ts: Date.now() });
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
  const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
  for (const mdl of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: mdl, temperature: 0, max_tokens: maxTokens + 350, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userText }] })
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
  let a = String(addr || "").trim()
    .replace(/\u05D5\u05D5[\u05D9\u05D9]\s*\u05D8\u05D9|\u05D5\u05D5[\u05D9\u05D9]\s*\u05D8\u05D5|\u05D5\u05D0\u05D9\s*\u05D8\u05D9/g, "yt")
    .replace(/\u05D5\u05D5[\u05D9\u05D9]|\u05D5\u05D0\u05D9/g, "y")
    .replace(/\u05D3\u05D1\u05DC\s*\u05D5\u05D5|\u05D3\u05D0\u05D1\u05DC\u05D9\u05D5/g, "w")
    .replace(/\u05D2\u05D9\u05DE\u05D9\u05D9\u05DC|\u05D2\u05D8\u05DE\u05D9\u05D9\u05DC|\u05D2\u05DE\u05D9\u05D9\u05DC|\u05D2\u05D9\u05DE\u05DC|\u05D2\u05D9\u05DE\u05D9\u05D9\u05DC|\u05D2\u05D5\u05D2\u05DC\s*\u05DE\u05D9\u05D9\u05DC/g, "gmail")
    .replace(/\u05D7\u05D9\u05D9\u05D9\u05D1|\u05D7\u05D9\u05D9\u05D1\u05D5|\u05D4\u05D5\u05D8\u05DE\u05D9\u05D9\u05DC|\u05D4\u05D5\u05D8\u05DE\u05D9\u05DC/g, "hotmail")
    .replace(/\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8|\u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8/g, "net")
    .replace(/\u05E7\u05D5\u05DD|\u05E7\u05D0\u05DD|\u05E7\u05D5\u05DD \u05E7\u05D5\u05D5\u05D3/g, "com")
    .replace(/\u05D0\u05D5\u05E8\u05D2|\u05D0\u05D5\u05E8\u05D2 \u05D0\u05E0\u05D2\u05DC\u05D9|\u05D0\u05D5\u05E8\u05D2/g, "org")
    .replace(/\u05E9\u05D8\u05E8\u05D5\u05D3\u05DC/g, "@").replace(/\u05E0\u05E7\u05D5\u05D3\u05D4/g, ".")
    .replace(/\u05D0\u05E4\u05E1/g, "0")
    .replace(/\u05D0\u05D7\u05EA|\u05D0\u05D7\u05D3/g, "1")
    .replace(/\u05E9\u05EA\u05D9\u05D9\u05DD|\u05E9\u05EA\u05D9\u05DD|\u05E9\u05EA\u05D9\u05D9|\u05E9\u05EA\u05D9\u05DD/g, "2")
    .replace(/\u05E9\u05DC\u05D5\u05E9|\u05E9\u05DC\u05E9/g, "3")
    .replace(/\u05D0\u05E8\u05D1\u05E2/g, "4")
    .replace(/\u05D7\u05DE\u05D9\u05E9\u05D9\u05DD|\u05D7\u05DE\u05D9\u05E9\u05D4/g, "55").replace(/\u05D7\u05DE\u05E9/g, "5")
    .replace(/\u05E9\u05D9\u05E9\u05D4/g, "6").replace(/\u05E9\u05E9/g, "6")
    .replace(/\u05E9\u05D1\u05E2/g, "7")
    .replace(/\u05E9\u05DE\u05D5\u05E0\u05D4/g, "8")
    .replace(/\u05EA\u05E9\u05E2|\u05D8\u05D9\u05E1\u05E2/g, "9")
    .replace(/\u05E2\u05E9\u05E8\u05D9\u05D5\u05EA/g, "20").replace(/\u05E2\u05E9\u05E8\u05D4|\u05E2\u05E9\u05E8/g, "10")
    .replace(/\u05E9\u05DC\u05D5\u05E9\u05D9\u05DD/g, "30")
    .replace(/\u05D0\u05E8\u05D1\u05E2\u05D9\u05DD/g, "40")
    .replace(/\u05E9\u05D9\u05E9\u05D9\u05DD/g, "60")
    .replace(/\u05E9\u05D1\u05E2\u05D9\u05DD/g, "70")
    .replace(/\u05E9\u05DE\u05D5\u05E0\u05D9\u05DD/g, "80")
    .replace(/\u05EA\u05E9\u05E2\u05D9\u05DD/g, "90")
    .replace(/\s+/g, "");
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
  const _acct = detectAccount(transcribedText);
  if (service === "email") return await handleEmail(env, GROQ_KEY, stripAccountWords(transcribedText), callerPhone, requestId, _acct);
  if (service === "chat") return await handleGoogleChat(env, GROQ_KEY, stripAccountWords(transcribedText), callerPhone, requestId, _acct);
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
  await doStateFetch(env, "pend_" + normalizeIsraelPhone(callerPhone), "PUT", pend);
await env.USER_MEMORY.put("pend_" + normalizeIsraelPhone(callerPhone), JSON.stringify(pend), { expirationTtl: 300 });
  return textResponse(`id_list_message=t-${head}.&read=t-${question}=confirm,no,1,1,15,Digits,yes,yes,,,,,None,`);
}
__name(pendingConfirmRead, "pendingConfirmRead");
__name2(pendingConfirmRead, "pendingConfirmRead");
__name22(pendingConfirmRead, "pendingConfirmRead");async function handleConfirm(env, confirmValue, callerPhone) {
  try {
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("אין הרשאה לביצוע הפעולה ממספר זה");
    const pendKey = "pend_" + normalizeIsraelPhone(callerPhone);
    const rawDo = await doStateFetch(env, pendKey, "GET");
    const raw = (rawDo && rawDo.value !== undefined && rawDo.value !== null) ? JSON.stringify(rawDo.value) : await env.USER_MEMORY.get(pendKey);
    if (!raw) return speak("אין פעולה ממתינה לאישור, הגדר אותה מחדש");
    const pend = JSON.parse(raw);
    await doStateFetch(env, pendKey, "DELETE");
    await doStateFetch(env, pendKey, "DELETE");
    await env.USER_MEMORY.delete(pendKey);
    if (String(confirmValue) !== "1") {
      logEvent("action_cancelled", { caller: callerTail(callerPhone) });
      return speak("הפעולה בוטלה");
    }
    logEvent("action_confirmed", { kind: String(pend.kind || "?").slice(0, 12), caller: callerTail(callerPhone) });
    if (pend.kind === "email") {
      const data = await callBridge(env, { action: "send", to: pend.to, subject: pend.subject || "", body: pend.body || "הודעה מהקו הטלפוני", inReplyTo: pend.inReplyTo, threadId: pend.threadId, requestId: "confirm" }, pend.account || 1);
      logEvent("email_send", { ok: Boolean(data.ok), confirmed: true });
      if (!data.ok) return speak("שליחת המייל נכשלה, נסה שוב");
      await setLastTarget(env, callerPhone, pend.name || "", pend.to, "email");
      return speak("המייל נשלח בהצלחה");
    }
    if (pend.kind === "chat") {
      const data = await callBridge(env, { action: "chat_send_text", to: pend.to, text: pend.text || "", requestId: "confirm" }, pend.account || 1);
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
async function askMailRange(env, callerPhone, account) {
  const q = "מתי לבדוק? ביממה האחרונה, בשבוע האחרון, בחודש האחרון, או בכל הזמנים?";
  await setContState(env, callerPhone, { kind: "mailrange", account: account || 1, unread: false, question: q, ts: Date.now() });
  return openQuestion(q);
}
function openQuestion(text) {
  return textResponse(`read=t-${text}=link,,record,/3/rec,,no,yes,,1,30`);
}
__name(openQuestion, "openQuestion");
__name2(openQuestion, "openQuestion");
__name22(openQuestion, "openQuestion");
__name(askMailRange, "askMailRange");
__name2(askMailRange, "askMailRange");
__name22(askMailRange, "askMailRange");
async function emailDigest(env, GROQ_KEY, callerPhone, requestId, account, timeframe, unread) {
  try {
    const rangeQ = timeframe === "day" ? "newer_than:1d" : timeframe === "week" ? "newer_than:7d" : timeframe === "month" ? "newer_than:30d" : "";
    const q = [unread ? "is:unread" : "", rangeQ].filter(Boolean).join(" ") || "in:inbox";
    const messages = [];
    let pageToken = null;
    for (let i = 0; i < 5; i++) {
      const payload = { action: "search", query: q, max: 10 };
      if (pageToken) payload.pageToken = pageToken;
      const data = await callBridge(env, payload, account);
      if (!data.ok) {
        logEvent("digest_bridge_failed", { account });
        return speak(unread ? "לא הצלחתי כרגע לבדוק את המיילים שלא נקראו" : "אין עדיין חיבור פעל למייל, יש להשלים את אישור ההרשאה");
      }
      messages.push(...(data.messages || []));
      pageToken = data.next_page_token || data.nextPageToken || null;
      if (!pageToken) break;
    }
    await kvSetList(env, "lastlist_" + callerPhone, { messages: messages.slice(0, 10), ts: Date.now(), account });
    const rangeTxt = timeframe === "day" ? "ביממה האחרונה" : timeframe === "week" ? "בשבוע האחרון" : timeframe === "month" ? "בחודש האחרון" : "";
    if (!messages.length) return speak(unread ? "אין מיילים שלא נקראו" : `אין מיילים חדשים ${rangeTxt}`);
    const items = messages.slice(0, 50).map((m, i) => ({ n: i + 1, from: cleanFromName(m.from), address: m.from, subject: String(m.subject || "").slice(0, 80), snippet: String(m.snippet || "").slice(0, 100) }));
    const sumPrompt = "אתה עוזר קולי בעברית בטלפון. קיבלת רשימת מיילים ממוינת מהחדש לישן. תסכם אותה למאזין בעברית מדוברת לפי הכללים: מיילים מאנשים פרטיים או גופים חשובים הזכר בשם השולח ובנושא ואמור אם חשוב. התראות אוטומטיות, ניוזלטרים, פרסומות ומיילים מתמיכה של חברות קבץ יחד בקצרה, למשל שתי התראות אבטחה מגוגל. אל תקריא את כל הרשימה אם היא ארוכה, סכם בכמה משפטים. כתוב בעברית בלי נקודות ובלי מקפים ובלי פסיקים כפולים. אם מייל נראה דחוף או חשוב במיוחד, הדגש זאת תחילה. הרשימה: " + JSON.stringify(items);
    const ans = await groqChatShort(GROQ_KEY, sumPrompt, "סכם את המיילים", 700);
    const totalTxt = messages.length >= 50 ? "יותר מחמישים" : String(messages.length);
    const prefix = unread ? "בדקתי את המיילים שלא נקראו" : `בדקתי את המיילים ${rangeTxt}`;
    const suffix = messages.length <= 10 ? "" : " אם תרצה לשמוע מייל מסוים, אמור קרא מייל לפי מספר";
    return speak(`${prefix}, סך הכול ${totalTxt} מיילים. ${ans || "לא הצלחתי לסכם, אמור הקרא רשימת מיילים"}.${suffix}`);
  } catch (e) {
    logEvent("digest_error", { msg: String(e && e.message || e).slice(0, 120) });
    return speak("משהו בבדיקת המיילים השתבש, נסה שוב");
  }
}
__name(emailDigest, "emailDigest");
__name2(emailDigest, "emailDigest");
__name22(emailDigest, "emailDigest");
async function handleEmail(env, GROQ_KEY, transcribedText, callerPhone, requestId, account = null) {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) {
      return speak("הגישה הטלפונית למייל עדיין בהגדרה, אין כרגע אפשרות לקרוא או לשלוח מיילים בטלפון");
    }
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) {
      return speak("אין הרשאה לגישה למייל ממספר זה");
    }
    const plannerSystem = 'אתה מנתש בקשות מייל לפעולות. החזר JSON בלבד בלי הסברים בפורמט {"action":"...","params":{}}. אפשרויות: {"action":"list","params":{"count":5}} רשימת מיילים אחרונים, לבקשה מפורשת להקראת רשימה. {"action":"digest","params":{"timeframe":"day|week|month|all|ask","unread":false}} בדיקה כללית וסיכום חכם של מיילים, לכל בקשת בדיקה כמו האם שלחו לי מייל, מה חדש, בדוק מיילים, יש לי מיילים, משהו חדש או חשוב, ומיילים שלא נקראו. כללים לdigest: אם נאמר לא נקראו, לא קראתי או לא נקרא קבע unread שווה true. אם נאמר טווח זמן קבע אותו: היום או יממה אחרונה זה day, שבוע אחרון זה week, חודש אחרון זה month, הכל או כל הזמנים זה all. אם לא נאמר טווח ואין unread קבע timeframe שווה ask. {"action":"summarize","params":{"count":5}} סיכום מיילים. {"action":"read","params":{"index":2}} קריאת מייל לפי מספרו ברשימה. {"action":"search","params":{"query":"..."}} חיפוש מיילים. בחיפוש החזר את מילות החיפוש בדיוק כפי שנאמרו בעברית, בלי לתרגם שמות לאנגלית ובלי קידומת from. למשל חפש מיילים מעמנואל זה query עמנואל, ומה המייל האחרון שעמנואל שלח לי זה query עמנואל. חיפוש של שם עברי עובד בגימייל כמו שהוא. {"action":"send","params":{"to":"...","subject":"...","body":"..."}} שליחת מייל חדש. {"action":"reply","params":{"index":1,"body":"..."}} מענה למייל. {"action":"forward","params":{"index":1,"to":"..."}} העברת מייל. בכתובות מייל: שטרודל פירושו סימן @ ונקודה פירושה נקודה. אם הנמען נאמר בשם או בכינוי ולא בכתובת מלאה, החזר אך ורק את השם שנאמר בשדה to ואל תוסיף דומיין או כתובת בעצמך. גם אם הנמען לא מוכר לך, אם זו בקשת שליחה ברורה החזר send עם השם שנאמר. כלל עדיפות: בקשה לשלוח מייל לאיש כלשהו מחזירה תמיד send גם בלשון עבר כמו שלחתי, וגם אם מוסיפים בקשה לבדוק אם ההודעה הגיעה. search ו list רק לבקשות קריאה. כתובות מייל תמיד באותיות באנגלית בלבד. כשהכתובת נאמרת באותיות ובמספרים בעברית, תרגם אותן לאנגלית: וואי היא האות y, וי היא v, טי היא t, שטרודל הוא @ ונקודה היא . למשל וואי אפס חמש אפס שטרודל גימייל נקודה קום זה y050@gmail.com. אל תשמיט את האות הראשונה של הכתובת. אם הבקשה לא ברורה החזר {"action":"none"}. אם הנמען הוא כינוי כמו לו, לה או אליו, החזר את הכינוי בשדה to כפי שנאמר.';
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
    if (plan.action === "digest") {
      const unread = !!(p.unread || /(?:לא\s*(?:נקראו|קראתי|נקרא|נקראתי))/.test(transcribedText));
      let timeframe = String(p.timeframe || "ask");
      if (timeframe !== "day" && timeframe !== "week" && timeframe !== "month" && timeframe !== "all") timeframe = "ask";
      if (!account) return await askAccount(env, callerPhone, "email", transcribedText, "בדיקה");
      if (timeframe === "ask" && !unread) return await askMailRange(env, callerPhone, account);
      return await emailDigest(env, GROQ_KEY, callerPhone, requestId, account, timeframe, unread);
    }
    if (plan.action === "list" || plan.action === "summarize" || plan.action === "search") {
      if (!account) return await askAccount(env, callerPhone, "email", transcribedText, "בדיקה");
      const payload = plan.action === "search" ? { action: "search", query: p.query || "", max: parseInt(p.count) || 5 } : { action: "list", max: Math.min(parseInt(p.count) || 5, 10) };
      const data = await callBridge(env, payload, account);
      if (!data.ok) {
        logEvent("email_bridge_failed", { action: plan.action });
        return speak("אין עדיין חיבור פעל למייל, יש להשלים את אישור ההרשאה");
      }
      const msgs = data.messages || [];
      await kvSetList(env, listKey, { messages: msgs, ts: Date.now(), account });
      if (plan.action === "summarize") {
        const digest = msgs.map((m, i) => `${i + 1}. מאת ${cleanFromName(m.from)}, נושא ${m.subject}: ${m.snippet || ""}`).join("\n");
        if (!digest) return speak("אין מיילים לסיכום");
        const ans = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית בטלפון. סכם את רשימת המיילים הבאה בעברית ברורה וקצרה, מקסימום 5 משפטים. אל תשתמש בנקודות או במקפים בתשובה.", digest, 300);
        return speak(ans || fmtEmailList(msgs));
      }
      const _lbl = account === 2 ? "בחשבון השני, " : "";
      if (!msgs.length && plan.action === "search") return speak("לא מצאתי מיילים לחיפוש הזה, אמור שם אחר או מילה מהנושא");
      return speak(_lbl + fmtEmailList(msgs));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("אין רשימת מיילים פעילה, בקש קודם את רשימת המיילים האחרונים");
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id }, list.account || account || 1);
      if (!data.ok) return speak("יש תקלה בפתיחת המייל, נסה שוב");
      const ans = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית בטלפון. הקרא את המייל הבא בעברית טבעית וברורה, מקסימום 6 משפטים, בלי נקודות ובלי מקפים. מאת " + cleanFromName(data.from) + ", בנושא " + (data.subject || "ללא נושא") + ", והתוכן הוא: " + (data.body || "").slice(0, 1800), "הקרא את המייל", 450);
      return speak(ans || "לא הצלחתי להקריא את המייל");
    }
    if (plan.action === "send") {
      if (!account) return await askAccount(env, callerPhone, "email", transcribedText, "שליחה");
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
            await setContState(env, callerPhone, { kind: "contact", action: "email_send", payload: { subject: p.subject || "", body: p.body || "", account }, candidates: slimCandidates(matches), originalRequest: transcribedText, question, ts: Date.now() });
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
      return await emailSendConfirm(env, callerPhone, to, toName, p.subject || "", p.body || "", resolveNote, account);
    }
    if (plan.action === "reply" || plan.action === "forward") {
      const list = await kvGetList(env, listKey);
      const idx = (parseInt(p.index) || 1) - 1;
      if (!list || !list.messages || !list.messages[idx]) return speak("אין רשימת מיילים פעילה, בקש קודם את רשימת המיילים");
      const _acct = list.account || account || 1;
      const item = list.messages[idx];
      const data = await callBridge(env, { action: "get", id: item.id }, _acct);
      if (!data.ok) return speak("יש תקלה בפתיחת המייל, נסה שוב");
      if (plan.action === "reply") {
        const subj = (data.subject || "").startsWith("Re:") ? data.subject : "Re: " + (data.subject || "");
        logEvent("email_reply_pending_confirm", { caller: callerTail(callerPhone) });
        return await pendingConfirmRead(env, callerPhone, { kind: "email", to: data.fromAddr || data.from, subject: subj, body: p.body || "", inReplyTo: data.id, threadId: data.threadId, name: cleanFromName(data.from), account: _acct }, `לענות למייל מאת ${cleanFromName(data.from)}, בנושא ${data.subject || ""}, עם התוכן ${p.body || "ריק"}? לאישור הקש אחת, לביטול הקש שתיים`);
      }
      let to = normalizeAddress(p.to);
      let fwdName = "";
      if (!to.includes("@")) {
        const contacts = await getContacts(env, callerPhone);
        const fm = findContactMatches(contacts, String(p.to || ""));
        if (fm.length >= 1) { to = fm[0].address; fwdName = fm[0].name; }
      }
      if (!to.includes("@") || !to.split("@")[1]) return speak("לא הצלחתי לזהות למי להעביר. אמור את שם איש הקשר או את הכתובת כולל שטרודל");
      const fwdBody = "הודעה שהועברה אליך:\n" + (data.body || "").slice(0, 3e3);
      logEvent("email_forward_pending_confirm", { caller: callerTail(callerPhone) });
      return await pendingConfirmRead(env, callerPhone, { kind: "email", to, subject: "העברה של " + (data.subject || "מייל"), body: fwdBody, account: _acct }, `להעביר את המייל בנושא ${data.subject || ""} אל ${fwdName || to}? לאישור הקש אחת, לביטול הקש שתיים`);
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
__name22(fmtChatList, "fmtChatList");async function handleGoogleChat(env, GROQ_KEY, transcribedText, callerPhone, requestId = "", account = null) {
  try {
    if (!env.MAILBOX_OWNER_PHONE || !env.GMAIL_BRIDGE_SECRET) return speak("הגישה לצאט עדיין בהגדרה");
    if (normalizeIsraelPhone(callerPhone) !== normalizeIsraelPhone(env.MAILBOX_OWNER_PHONE)) return speak("הגישה לצאט מותרת רק מהטלפון של בעל החשבון");
    const planner = `אתה מנתח בקשות ל Google Chat. החזר JSON בלבד בלי הסברים בפורמט {"action":"...","params":{}}. פעולות: unread לקבלת הודעות חדשות, search לחיפוש הודעות לפי מילים, read לקריאת הודעה לפי מספר מהרשימה האחרונה. בקשה כמו קרא הודעה אחת או קרא הודעה שתיים או שמע הודעה שלוש היא read עם index לפי המספר שנאמר, אחת זה 1 שתיים זה 2 וכון, send_text לשליחת הודעת טקסט, save_contact לשמירת איש קשר. לשליחה החזר {"action":"send_text","params":{"to":"שם איש קשר, כינוי, או כתובת אימייל מלאה","text":"תוכן ההודעה"}}. לשמירת איש קשר החזר {"action":"save_contact","params":{"name":"שם","address":"כתובת אימייל מלאה","aliases":["כינוי"]}}. המילה שטרודל היא @ ונקודה היא . אין לנחש כתובת חסרה. כשמבקשים לשלוח הודעת קול או הודעה מתומללת, הפעולה היא send_text והטקסט הוא תוכן ההודעה שנאמר. כשלא ברור החזר {"action":"none","params":{}}. כתובות מייל באנגלית בלבד. כשהכתובת נאמרת באותיות בעברית, תרגם: וואי היא y, טי היא t, שטרודל הוא @ ונקודה היא . אם הנמען נאמר בשם, החזר את השם כפי שנאמר בלבד ואל תמציא כתובת בעצמך. כלל עדיפות חשוב: אם הבקשה מבקשת לשלוש הודעה לאיש קשר כלשהו, החזר תמיד send_text ולא חיפוש, גם אם הניסוח הוא בלשון עבר כמו נשלח, וגם אם הבקשה מוסיפה בתוכה לראות או לבדוק אם ההודעה הגיעה. פעולות search ו unread כשהבקשה היא לקרוא, לחפש או לבדוק הודעות שהתקבלו, למשל בדוק את הצאטים, תבדוק אם יש הודעות חדשות, מה חדש או יש הודעות חדשות הן כולן unread. אם הנמען הוא כינוי כמו לו, לה או אליו, החזר את הכינוי בשדה to כפי שנאמר. לעולם אל תחזיר save_contact כשמדובר בבקשת שליחה.`;
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
      if (!account) return await askAccount(env, callerPhone, "chat", transcribedText, "בדיקה");
      const payload = plan.action === "search" ? { action: "chat_search", query: params.query || "", max: Math.min(parseInt(params.count) || 5, 10) } : { action: "chat_unread", max: Math.min(parseInt(params.count) || 5, 10) };
      const data = await callBridge(env, payload, account);
      if (!data.ok) return speak("לא הצלחתי כרגע לקרוא את הודעות הצאט");
      await kvSetList(env, listKey, { messages: data.messages || [], ts: Date.now(), account });
      return speak(fmtChatList(data.messages || []));
    }
    if (plan.action === "read") {
      const list = await kvGetList(env, listKey);
      const item = list?.messages?.[(parseInt(params.index) || 1) - 1];
      if (!item) return speak("אין רשימת הודעות צאט פעילה, בקש קודם הודעות חדשות");
      const data = await callBridge(env, { action: "chat_get", name: item.name }, list?.account || account || 1);
      if (!data.ok) return speak("לא הצלחתי לפתוח את הודעת הצאט");
      const answer = await groqChatShort(GROQ_KEY, "אתה עוזר קולי בעברית. הקרא את הודעת הצאט בקצרה ובצורה ברורה, עד ארבעה משפטים.", `מאת ${data.message?.sender || "שולח לא ידוע"}. תוכן: ${data.message?.text || "ללא טקסט"}`, 350);
      return speak(answer || "לא הצלחתי להקריא את ההודעה");
    }
    if (plan.action === "send_text") {
      if (!account) return await askAccount(env, callerPhone, "chat", transcribedText, "שליחה");
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
            await setContState(env, callerPhone, { kind: "contact", action: "chat_send", payload: { text, account }, candidates: slimCandidates(matches), originalRequest: transcribedText, question, ts: Date.now() });
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
                return speak("לא מצאתי איש קשר בשם הזה. אמור שוב את השם, או אמור את כתובת המייל שלו כולל שטרודל ונקודה");
              }
            }
          }
        }
      }
      if (!to || !to.includes("@") || !(to.split("@")[1] || "").includes(".")) return speak("\u05D0\u05DE\u05D5\u05E8 \u05E9\u05D5\u05D1 \u05D0\u05EA \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05DE\u05D9\u05D9\u05DC \u05E9\u05DC \u05D4\u05E0\u05DE\u05E2\u05DF, \u05DB\u05D5\u05DC\u05DC \u05E9\u05D8\u05E8\u05D5\u05D3\u05DC \u05D5\u05E0\u05E7\u05D5\u05D3\u05D4");
      return await chatSendConfirm(env, callerPhone, to, toName, text, prefixNote, account);
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
function effectiveTextIfAny(t) {
  return String(t || "").replace(/[\u05B0-\u05C7]/g, "").replace(/\s+/g, " ").trim();
}
__name(effectiveTextIfAny, "effectiveTextIfAny");
__name2(effectiveTextIfAny, "effectiveTextIfAny");
function speak(text) {
  const clean = String(text || "").replace(/[\r\n]+/g, " ").replace(/(\d)\.(?=\d)/g, "$1 \u05E0\u05E7\u05D5\u05D3\u05D4 ").replace(/[.\u2024\u2026]+/g, ", ").replace(/[-\u2010-\u2015]+/g, " ").replace(/[&=#%+:]/g, " ").replace(/[^a-zA-Z0-9\u0590-\u05FF\s,?!]/g, "").replace(/\s+/g, " ").replace(/,+/g, ",").substring(0, 450).trim().replace(/^[,;!?\s]+|[,;:\s]+$/g, "");
  if (!clean) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05EA\u05E7\u05D9\u05E0\u05D4, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
  return textResponse(`id_list_message=t-${clean}`);
}
__name(speak, "speak");
__name2(speak, "speak");
__name22(speak, "speak");

var ContState = class {
  constructor(state, env) {
    this.state = state;
  }
  async fetch(request) {
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    if (request.method === "GET") {
      const v = await this.state.storage.get(key);
      return Response.json({ value: v === undefined ? null : v });
    }
    if (request.method === "PUT") {
      const body = await request.json().catch(() => null);
      await this.state.storage.put(key, body);
      return Response.json({ ok: true });
    }
    if (request.method === "DELETE") {
      await this.state.storage.delete(key);
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: "bad_method" }, { status: 405 });
  }
};
__name(ContState, "ContState");
__name2(ContState, "ContState");
__name22(ContState, "ContState");

// ===================== שלוחת תמלול קולי (TLK) =====================
async function tlkStore(env, key, val) {
  try {
    if (val === null) { await doStateFetch(env, key, "DELETE"); await env.USER_MEMORY.delete(key); return; }
    let doOk = false;
    try { const j = JSON.stringify(val); if (j.length < 100000) { await doStateFetch(env, key, "PUT", val); doOk = true; } } catch (_) { await doStateFetch(env, key, "DELETE"); }
    if (!doOk) await doStateFetch(env, key, "DELETE");
    await env.USER_MEMORY.put(key, JSON.stringify(val));
  } catch (e) {}
}
__name(tlkStore, "tlkStore");
__name2(tlkStore, "tlkStore");
__name22(tlkStore, "tlkStore");
async function tlkLoad(env, key) {
  try {
    const r = await doStateFetch(env, key, "GET");
    if (r && r.value !== undefined && r.value !== null) return r.value;
  } catch (_) {}
  try { const v = await env.USER_MEMORY.get(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
}
__name(tlkLoad, "tlkLoad");
__name2(tlkLoad, "tlkLoad");
__name22(tlkLoad, "tlkLoad");
function tlkDateStr(ms) {
  try { return new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(ms)); } catch (_) { return ""; }
}
__name(tlkDateStr, "tlkDateStr");
__name2(tlkDateStr, "tlkDateStr");
__name22(tlkDateStr, "tlkDateStr");
const TLK_STYLE_AI = {
  general: "אתה עורך לשוני. קבל תמלול גולמי ממודל זיהוי דיבור והחזר אותו מנוקה בפיסוק: פסיקים, נקודות, סימני שאלה וחלוקה לפסקאות הגיוניות. אסור לשנות, להוסיף או להשמיט אף מילה מהתוכן המקורי. אסור לתרגן. החזר רק את הטקסט המפוסק בלי הקדמות.",
  torah: "אתה עורך לשוני תורני. קבל תמלול גולמי של שיעור או דברי תורה והחזר אותו מנוקה בפיסוק: פסיקים, נקודות, סימני שאלה, וחלוקה לפסקאות לפי מהלך הדברים, עם הבחנה בין קושיא תירוץ וראיה. פתח ראשי תיבות גורים כמו רמב״ם, רש״י, שו״ע, משנ״ב, גמ׳, ברייתא. אסור לשנות, להוסיף או להשמיט אף מילה מהתוכן המקורי. אסור לתרגן. החזר רק את הטקסט המפוסק בלי הקדמות."
};
__name(TLK_STYLE_AI, "TLK_STYLE_AI");
const TLK_WHISPER_PROMPT = {
  general: "תמלול עברית מדוברת, משפטים ברורים, שמות פרטיים בעברית, פיסוק מלא.",
  torah: "תמלול שיעור תורני בעברית: רמב״ם, רש״י, תוספות, סוגיא, קושיא, תירוץ, נפקא מינה, מיגו, סברא, אליבא דהלכתא, ריטב״א, מהרש״א, שו״ע, משנ״ב, גמרא, ברייתא, מאי קמ״ל, הכי קאמר, שפתי חכמים, מהרש״א, תוספות ד״ה, אליבא, להלכה למעשה. פיסוק מלא.",
  hasidic: "תמלול בלשון הקודש בהגייה חסידית: שאבעס, יוי״ט, רבינו, דביקות, טיש, הידור, קידוש השם, שטיבל, בעלזא, חב״ד, ברסלב, גור, ויז׳ניץ, סאטמאר, רבי׳ם, אדמו״ר, התקשרות, התבודדות. פיסוק מלא.",
  yiddish: "טראַנסקריפּציע אין יידיש, גאַנצע זאַצן, פֿולע פּונקטואַציע. אידישע ווערטער אַזוי ווי רבי, שול, משיח, גמרא, סדר, תפילה, שבת, יום טוב, כּבֿוד."
};
__name(TLK_WHISPER_PROMPT, "TLK_WHISPER_PROMPT");
async function tlkSay(env, text, readParams) {
  let body = "";
  const f = await ttsTextToYemotFile(env, text);
  body = f ? "id_list_message=f-" + f : "id_list_message=t-" + text;
  if (readParams) body += "&read=" + readParams;
  return new Response(body, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(tlkSay, "tlkSay");
__name2(tlkSay, "tlkSay");
__name22(tlkSay, "tlkSay");
async function tlkRead(env, promptText, readParams) {
  const f = await ttsTextToYemotFile(env, promptText);
  return new Response("read=" + (f ? "f-" + f : "t-" + promptText) + "=" + readParams, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(tlkRead, "tlkRead");
__name2(tlkRead, "tlkRead");
__name22(tlkRead, "tlkRead");
function tlkWavSplit(buf, maxBytes) {
  try {
    const dv = new DataView(buf);
    if (dv.byteLength < 44) return null;
    const tag = (o) => String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
    if (tag(0) !== "RIFF" || tag(8) !== "WAVE") return null;
    let off = 12, fmtLen = 0, dataOff = -1, dataLen = 0;
    while (off + 8 <= dv.byteLength) {
      const id = tag(off), size = dv.getUint32(off + 4, true);
      if (id === "fmt ") fmtLen = size;
      else if (id === "data") { dataOff = off + 8; dataLen = size; if (dataOff + dataLen > dv.byteLength) dataLen = dv.byteLength - dataOff; break; }
      off += 8 + size + (size % 2);
    }
    if (!fmtLen || dataOff < 0) return null;
    const headerLen = dataOff;
    const maxData = maxBytes - headerLen;
    if (maxData < 100000 || dataLen <= maxData) return null;
    const out = [];
    for (let p = 0; p < dataLen; p += maxData) {
      const chunkData = Math.min(maxData, dataLen - p);
      const ab = new ArrayBuffer(headerLen + chunkData);
      const nb = new Uint8Array(ab);
      nb.set(new Uint8Array(buf, 0, headerLen), 0);
      const ndv = new DataView(ab);
      ndv.setUint32(4, headerLen + chunkData - 8, true);
      ndv.setUint32(headerLen - 4, chunkData, true);
      nb.set(new Uint8Array(buf, dataOff + p, chunkData), headerLen);
      out.push(new Blob([ab], { type: "audio/wav" }));
    }
    return out;
  } catch (_) { return null; }
}
__name(tlkWavSplit, "tlkWavSplit");
__name2(tlkWavSplit, "tlkWavSplit");
__name22(tlkWavSplit, "tlkWavSplit");
async function tlkWhisper(env, blob, style, extraDict) {
  const prompt = (TLK_WHISPER_PROMPT[style] || TLK_WHISPER_PROMPT.general) + (extraDict ? " מילים נוספות לזיהוי: " + extraDict : "");
  const lang = style === "yiddish" ? "yi" : "he";
  const attempt = async (model) => {
    const fd = new FormData();
    fd.append("file", blob, "recording.wav");
    fd.append("model", model);
    fd.append("language", lang);
    fd.append("temperature", "0");
    fd.append("prompt", prompt);
    const wr = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.GROQ_KEY }, body: fd });
    if (!wr.ok) { logEvent("tlk_whisper_failed", { model, status: wr.status }); return null; }
    return String((await wr.json()).text || "").trim();
  };
  let t = await attempt("whisper-large-v3");
  if (t === null) t = await attempt("whisper-large-v3-turbo");
  return t;
}
__name(tlkWhisper, "tlkWhisper");
__name2(tlkWhisper, "tlkWhisper");
__name22(tlkWhisper, "tlkWhisper");
async function tlkProcessBlob(env, audioBlob, callerPhone, skipEdit) {
  if (!audioBlob || audioBlob.size < 1000) return { error: "empty" };
  const cfg = (await tlkLoad(env, "tlk_cfg_" + callerPhone)) || {};
  const style = ["torah", "hasidic", "yiddish"].includes(cfg.style) ? cfg.style : "general";
  const dict = typeof cfg.whisperDict === "string" ? cfg.whisperDict.slice(0, 500) : "";
  let blobs = [audioBlob];
  if (audioBlob.size > 30 * 1024 * 1024) blobs.holdAudio = false;
  if (audioBlob.size > 18 * 1024 * 1024) {
    const parts = tlkWavSplit(await audioBlob.arrayBuffer(), 18 * 1024 * 1024);
    if (parts && parts.length > 1) { blobs = parts; logEvent("tlk_split", { parts: parts.length }); }
    else if (audioBlob.size > 24 * 1024 * 1024) return { error: "big", sizeMB: Math.round(audioBlob.size / 1048576) };
  }
  const t0 = Date.now();
  const raws = [];
  for (const b of blobs) {
    const t = await tlkWhisper(env, b, style, dict);
    if (t === null) { if (raws.length) break; return { error: "whisper" }; }
    if (t) raws.push(t);
  }
  let raw = raws.join(" ").replace(/\s+/g, " ").trim();
  if (!raw) return { error: "silent" };
  logEvent("tlk_whisper_ok", { ms: Date.now() - t0, chars: raw.length, chunks: blobs.length });
  let final = raw;
  if (!skipEdit && raw.length > 12) {
    const words = raw.split(/\s+/).length;
    const aiPrompt = TLK_STYLE_AI[style] + (cfg.customPrompt ? "\n\nהנחיה אישית מהמשתמש (פעל לפיה בנוסף): " + String(cfg.customPrompt).slice(0, 400) : "");
    const edited = await groqChatShort(env, aiPrompt, raw, Math.min(4000, Math.max(400, words * 3)));
    if (edited) {
      const eWords = edited.split(/\s+/).length;
      if (Math.abs(eWords - words) <= Math.max(4, Math.ceil(words * 0.2))) final = edited;
    }
  }
  return { raw, final, style, blob: audioBlob, seconds: Math.round((Date.now() - t0) / 1000) };
}
__name(tlkProcessBlob, "tlkProcessBlob");
__name2(tlkProcessBlob, "tlkProcessBlob");
__name22(tlkProcessBlob, "tlkProcessBlob");
async function tlkProcessRecording(env, rawPath, callerPhone) {
  let p = String(rawPath).trim();
  while (p.startsWith("ivr2:") || p.startsWith("/")) { if (p.startsWith("ivr2:")) p = p.substring(5); if (p.startsWith("/")) p = p.substring(1); }
  const dl = await fetch("https://www.call2all.co.il/ym/api/DownloadFile?token=" + env.YEMOT_TOKEN + "&path=ivr2:" + p, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!dl.ok) { logEvent("tlk_dl_failed", { status: dl.status }); return { error: "download" }; }
  return await tlkProcessBlob(env, await dl.blob(), callerPhone);
}
__name(tlkProcessRecording, "tlkProcessRecording");
__name2(tlkProcessRecording, "tlkProcessRecording");
__name22(tlkProcessRecording, "tlkProcessRecording");
async function tlkSaveTranscript(env, phone, res, jobId, appendTo, via) {
  let list = (await tlkLoad(env, "tlk_" + phone)) || [];
  let item = null, appended = false;
  if (appendTo) {
    item = list.find((x) => x.id === appendTo);
    if (item) { item.text = item.text + "\n\n" + res.final; item.raw = item.raw + "\n\n" + res.raw; item.updated = Date.now(); item.appendCount = (item.appendCount || 0) + 1; delete item.status; appended = true; }
  }
  if (!appended) {
    if (jobId) { const ph = list.find((x) => x.id === jobId); if (ph) list = list.filter((x) => x.id !== jobId); }
    const id = "t" + Date.now();
    item = { id, at: Date.now(), updated: Date.now(), text: res.final, raw: res.raw, style: res.style, via: via || "phone" };
    if (res.blob && await tlkStoreAudio(env, res.blob, id)) item.audio = id;
    list.unshift(item);
  }
  if (list.length > 50) list = list.slice(0, 50);
  await tlkStore(env, "tlk_" + phone, list);
  return { item, appended };
}
__name(tlkSaveTranscript, "tlkSaveTranscript");
__name2(tlkSaveTranscript, "tlkSaveTranscript");
__name22(tlkSaveTranscript, "tlkSaveTranscript");
async function tlkFinishJob(env, jobId) {
  const job = await tlkLoad(env, "tlk_job_" + jobId);
  if (!job || job.done) return;
  try {
    const res = await tlkProcessRecording(env, job.path, job.phone);
    if (res.error) {
      let list = (await tlkLoad(env, "tlk_" + job.phone)) || [];
      const ph = list.find((x) => x.id === jobId);
      if (ph) { ph.status = "error"; ph.text = res.error === "silent" || res.error === "empty" ? "לא נשמע דיבור בהקלטה" : (res.error === "big" ? "ההקלטה גדולה מדי לתמלול" : "התמלול נכשל, נסו שוב"); await tlkStore(env, "tlk_" + job.phone, list); }
      await tlkStore(env, "tlk_job_" + jobId, null);
      return;
    }
    const { item } = await tlkSaveTranscript(env, job.phone, res, jobId, job.appendTo || null, "phone");
    const cfg = (await tlkLoad(env, "tlk_cfg_" + job.phone)) || {};
    const isOwner = !env.MAILBOX_OWNER_PHONE || String(job.phone).endsWith(String(env.MAILBOX_OWNER_PHONE).replace(/\D/g, "").slice(-9));
    const mail = (await tlkLoad(env, "tlk_mail_" + job.phone)) || (isOwner ? "y0508352872@gmail.com" : "");
    if (mail && (cfg.sendEmail === undefined ? isOwner : cfg.sendEmail !== false)) await tlkSendMail(env, job.phone, item, mail);
    logEvent("tlk_job_done", { ok: true, chars: res.final.length });
  } catch (e) {
    logEvent("tlk_job_error", { type: e?.name || "Error" });
  }
  await tlkStore(env, "tlk_job_" + jobId, null);
}
__name(tlkFinishJob, "tlkFinishJob");
__name2(tlkFinishJob, "tlkFinishJob");
__name22(tlkFinishJob, "tlkFinishJob");
async function tlkStoreAudio(env, blob, id) {
  try {
    const fd2 = new FormData();
    fd2.append("file", blob, "a.wav");
    const up = await fetch("https://www.call2all.co.il/ym/api/UploadFile?token=" + env.YEMOT_TOKEN + "&path=ivr/7/audio/" + id + ".wav&convertAudio=1", { method: "POST", body: fd2 });
    const j = await up.json().catch(() => null);
    return Boolean(j && j.responseStatus === "OK");
  } catch (_) { return false; }
}
__name(tlkStoreAudio, "tlkStoreAudio");
__name2(tlkStoreAudio, "tlkStoreAudio");
__name22(tlkStoreAudio, "tlkStoreAudio");
// ===== מייל ישיר עם קובץ מצורף (Gmail SMTP דרך sockets) =====
function b64s(str) { return btoa(unescape(encodeURIComponent(str))); }
__name(b64s, "b64s");
async function smtpSendMail(env, to, subject, textBody, wavBlob, docxBlob) {
  const pass = env.GMAIL_APP_PASS;
  if (!pass) return false;
  const from = "y0508352872@gmail.com";
  let socket;
  try {
    socket = connect({ hostname: "smtp.gmail.com", port: 465 }, { secureTransport: "on" });
    const w = socket.writable.getWriter();
    const dec = new TextDecoder();
    let buf = "";
    const readLine = async () => {
      while (true) {
        const nl = buf.indexOf("\r\n");
        if (nl >= 0) { const l = buf.slice(0, nl); buf = buf.slice(nl + 2); return l; }
        const { value, done } = await socket.readable.getReader().read();
        if (done) return buf;
        buf += dec.decode(value);
      }
    };
    const cmd = async (c, expect) => {
      if (c) { await w.write(new TextEncoder().encode(c + "\r\n")); }
      const l = await readLine();
      if (expect && !l.startsWith(expect)) { logEvent("smtp_unexpected", { got: l.slice(0, 40), want: expect }); throw new Error("smtp " + l); }
      while (l.length > 3 && l[3] === "-") { const l2 = await readLine(); if (expect && l2.startsWith(expect)) break; }
      return l;
    };
    await cmd(null, "220");
    await cmd("EHLO yemot-ai", "250");
    await cmd("AUTH LOGIN", "334");
    await cmd(b64s(from), "334");
    await cmd(b64s(pass), "235");
    await cmd("MAIL FROM:<" + from + ">", "250");
    await cmd("RCPT TO:<" + to + ">", "250");
    await cmd("DATA", "354");
    const boundary = "----tlk" + Date.now();
    let msg = "From: " + from + "\r\nTo: " + to + "\r\nSubject: =?UTF-8?B?" + b64s(subject) + "?=\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"" + boundary + "\"\r\n\r\n";
    msg += "--" + boundary + "\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    msg += b64s(textBody) + "\r\n";
    const attPart = async (blob, ct, fn) => {
      if (!blob || blob.size <= 1000 || blob.size >= 15 * 1024 * 1024) return "";
      const ab = await blob.arrayBuffer();
      let b64 = "";
      const u8 = new Uint8Array(ab);
      for (let i = 0; i < u8.length; i += 12000) b64 += btoa(String.fromCharCode.apply(null, u8.subarray(i, Math.min(i + 12000, u8.length)))) + "\r\n";
      return "--" + boundary + "\r\nContent-Type: " + ct + "\r\nContent-Disposition: attachment; filename=\"" + fn + "\"\r\nContent-Transfer-Encoding: base64\r\n\r\n" + b64;
    };
    msg += await attPart(docxBlob, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "transcription.docx");
    msg += await attPart(wavBlob, "audio/wav", "recording.wav");
    msg += "--" + boundary + "--\r\n";
    const enc = new TextEncoder().encode(msg + ".\r\nQUIT\r\n");
    await w.write(enc);
    await w.close();
    logEvent("smtp_sent", { to: String(to).slice(-10), attachment: Boolean(wavBlob) });
    return true;
  } catch (e) {
    try { socket?.close(); } catch (_) {}
    logEvent("smtp_failed", { type: e?.name || "Error" });
    return false;
  }
}
__name(smtpSendMail, "smtpSendMail");
__name2(smtpSendMail, "smtpSendMail");
__name22(smtpSendMail, "smtpSendMail");

// ===== יצירת קובץ Word (.docx) =====
const DOCX_CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1; t[n] = c >>> 0; } return t; })();
__name(DOCX_CRC_TABLE, "DOCX_CRC_TABLE");
__name2(DOCX_CRC_TABLE, "DOCX_CRC_TABLE");
__name22(DOCX_CRC_TABLE, "DOCX_CRC_TABLE");
function crc32(u8) { let c = 4294967295; for (let i = 0; i < u8.length; i++) c = DOCX_CRC_TABLE[(c ^ u8[i]) & 255] ^ c >>> 8; return (c ^ 4294967295) >>> 0; }
__name(crc32, "crc32");
__name2(crc32, "crc32");
__name22(crc32, "crc32");
function xmlEsc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
__name(xmlEsc, "xmlEsc");
__name2(xmlEsc, "xmlEsc");
__name22(xmlEsc, "xmlEsc");
function makeDocx(text, title) {
  const paras = String(text).split(/\n+/).filter((p) => p.trim());
  let doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>';
  doc += '<w:p><w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:rtl/><w:b/><w:sz w:val="32"/></w:rPr><w:t xml:space="preserve">' + xmlEsc(title || "") + '</w:t></w:r></w:p>';
  for (const p of paras) {
    doc += '<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:rPr><w:rtl/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">' + xmlEsc(p.trim()) + "</w:t></w:r></w:p>";
  }
  doc += '<w:sectPr><w:bidi/></w:sectPr></w:body></w:document>';
  const ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const entries = [["[Content_Types].xml", ct], ["_rels/.rels", rels], ["word/document.xml", doc]];
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const [name, content] of entries) {
    const nu8 = enc.encode(name);
    const du8 = enc.encode(content);
    const crc = crc32(du8);
    const lh = new Uint8Array(30 + nu8.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 67324752, true); dv.setUint16(4, 20, true); dv.setUint16(6, 2048, true);
    dv.setUint16(8, 0, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0, true);
    dv.setUint32(14, crc, true); dv.setUint32(18, du8.length, true); dv.setUint32(22, du8.length, true);
    dv.setUint16(26, nu8.length, true); dv.setUint16(28, 0, true);
    lh.set(nu8, 30);
    chunks.push(lh, du8);
    const ce = new Uint8Array(46 + nu8.length);
    const cv = new DataView(ce.buffer);
    cv.setUint32(0, 33639248, true); cv.setUint16(4, 20, true); cv.setUint16(6, 2048, true);
    cv.setUint16(8, 0, true); cv.setUint16(10, 0, true); cv.setUint16(12, 0, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, du8.length, true); cv.setUint32(24, du8.length, true);
    cv.setUint16(28, nu8.length, true); cv.setUint16(30, 0, true); cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true); cv.setUint16(36, 0, true); cv.setUint32(38, 0, true); cv.setUint32(42, offset, true);
    ce.set(nu8, 46);
    central.push(ce);
    offset += lh.length + du8.length;
  }
  let cdSize = 0;
  for (const c of central) cdSize += c.length;
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 101010256, true); ev.setUint16(8, entries.length, true); ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, eocd], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
__name(makeDocx, "makeDocx");
__name2(makeDocx, "makeDocx");
__name22(makeDocx, "makeDocx");

async function tlkSendMail(env, callerPhone, item, mail) {
  if (!mail || !/.+@.+/.test(mail)) return false;
  const isTorah = item.style === "torah";
  const subj = (item.via === "hq" ? "תמלול איכותי" : "תמלול") + " " + (isTorah ? "תורני" : "") + " - " + tlkDateStr(item.at);
  let wavBlob = null;
  if (item.audio) {
    try {
      const d = await fetch("https://www.call2all.co.il/ym/api/DownloadFile?token=" + env.YEMOT_TOKEN + "&path=ivr2:7/audio/" + item.audio + ".wav", { headers: { "User-Agent": "Mozilla/5.0" } });
      if (d.ok) wavBlob = await d.blob();
    } catch (_) {}
  }
  const txt = item.text || "";
  const isLong = txt.length > 1500;
  const isMed = txt.length > 450;
  const foot = "\n\n—————\nהוקלט ב" + tlkDateStr(item.at) + (isMed || isLong ? "\nהאזנה להקלטה ועריכת התמלול: https://yemot-ai.y0508352872.workers.dev/tlk-site" : "");
  let body, docx = null;
  if (isLong) {
    docx = makeDocx(txt + "\n\n—————\nתמלול גולמי (לפני עריכה):\n" + item.raw, subj);
    body = txt.split(/\n/)[0].slice(0, 220) + "...\n\nהתמלול המלא מצורף בקובץ וורד." + foot;
  } else {
    body = txt + foot;
  }
  if (wavBlob && wavBlob.size >= 15 * 1024 * 1024) wavBlob = null;
  if (await smtpSendMail(env, mail, subj, body, wavBlob, docx)) return true;
  // גשר Apps Script (טקסט בלבד) - אין תמיכה בקבצים מצורפים
  if (isLong) body = txt + "\n\n(קובץ הוורד יופעל במייל ישיר - כרגע מופיע התמלול במלואו)" + foot;
  else body += wavBlob || item.audio ? "" : "";
  if (item.audio) body += "\n\nהקלטת השמע זמינה באזור האישי: https://yemot-ai.y0508352872.workers.dev/tlk-site";
  try {
    const r = await callBridge(env, { action: "send", to: mail, subject: subj, body }, 1);
    logEvent("tlk_mail", { ok: Boolean(r && r.ok) });
    return Boolean(r && r.ok);
  } catch (e) { return false; }
}
__name(tlkSendMail, "tlkSendMail");
__name2(tlkSendMail, "tlkSendMail");
__name22(tlkSendMail, "tlkSendMail");
async function tlkMainMenu(env) {
  return tlkRead(env, "להקלטה חדשה לתמלול הקש אחת. לשמיעת התמלולים האחרונים הקש שתיים. לקוד הכניסה לאתר הקש שלוש. להגדרות הקש ארבע. לסטטוס החשבון הקש חמש.", "menu,no,1,1,20,Digits,yes,yes,,,,,None,");
}
__name(tlkMainMenu, "tlkMainMenu");
__name2(tlkMainMenu, "tlkMainMenu");
__name22(tlkMainMenu, "tlkMainMenu");
async function handleTlkRequest(env, params, callerPhone, ctx) {
  callerPhone = normalizeIsraelPhone(callerPhone);
  logEvent("tlk_request", { caller: String(callerPhone).slice(-4), hasLink: Boolean(params.link), menu: String(params.menu || ""), pick: String(params.pick || ""), set: String(params.set || ""), code: String(params.code || "") });
  if (!callerPhone) return tlkSay(env, "שגיאה בזיהוי המאזין, נסה שוב");
  const key = "tlk_" + callerPhone;
  const cfg = (await tlkLoad(env, "tlk_cfg_" + callerPhone)) || {};
  const c = { sendEmail: cfg.sendEmail === undefined ? true : cfg.sendEmail !== false, playResult: cfg.playResult !== false, style: ["torah", "hasidic", "yiddish"].includes(cfg.style) ? cfg.style : "general", autoHangup: cfg.approve !== true, approve: cfg.approve === true, quickRec: cfg.quickRec === true };
  const isOwner = !env.MAILBOX_OWNER_PHONE || callerPhone.endsWith(String(env.MAILBOX_OWNER_PHONE).replace(/\D/g, "").slice(-9));
  const mail = (await tlkLoad(env, "tlk_mail_" + callerPhone)) || (isOwner ? "y0508352872@gmail.com" : "");
  const digitsHe = (n) => String(n).split("").map((d) => ["אפס", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע"][Number(d)]).join(", ");

  // ----- הקלטה שהגיעה -----
  const recPath = params.link || params.file_path || params.RecordingPath || "";
  if (recPath && String(recPath).includes(".wav")) {
    const pend = await tlkLoad(env, "tlk_pend_" + callerPhone);
    const appendTo = (pend && pend.appendTo) || null;
    if (c.approve && !appendTo) {
      // מצב שמיעה ואישור
      await tlkStore(env, "tlk_pendA_" + callerPhone, { path: String(recPath), at: Date.now() });
      let fp = String(recPath).replace(/^ivr2:?\/?/, "").replace(/^\/+/, "");
      const f = await ttsTextToYemotFile(env, "כך נשמעה ההקלטה. לשליחה לתמלול הקש אחת, להקלטה מחדש הקש שתיים, לביטול הקש שלוש.");
      let body = "id_list_message=f-/" + fp + (f ? "&read=f-" + f + "=confirm,no,1,1,20,Digits,yes,yes,,,,,None," : "");
      return new Response(body, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    if (c.autoHangup) {
      // ניתוק מיידי + עיבוד ברקע
      const jobId = "t" + Date.now();
      let list = (await tlkLoad(env, key)) || [];
      if (!appendTo) { list.unshift({ id: jobId, at: Date.now(), updated: Date.now(), status: "processing", via: appendTo ? "phone" : "phone", text: "", raw: "" }); if (list.length > 50) list = list.slice(0, 50); await tlkStore(env, key, list); }
      await tlkStore(env, "tlk_job_" + jobId, { phone: callerPhone, path: String(recPath), appendTo, at: Date.now() });
      await tlkStore(env, "tlk_pend_" + callerPhone, null);
      const p = tlkFinishJob(env, jobId);
      if (ctx && ctx.waitUntil) ctx.waitUntil(p); else await p;
      return tlkSay(env, appendTo ? "ההמשך נקלט ויוסף לתמלול תוך שניות. שלום." : "ההקלטה נקלטה. התמלול יישלח למייל ויופיע באזור האישי באתר תוך שניות. שלום.");
    }
    // מצב סינכרוני רגיל (ברירת מחדל ישנה): עיבוד והקראה בקו
    const res = await tlkProcessRecording(env, recPath, callerPhone);
    if (res.error === "download") return tlkSay(env, "לא הצלחתי להוריד את ההקלטה, נסה שוב");
    if (res.error === "empty" || res.error === "silent") return tlkSay(env, "לא נשמע דיבור בהקלטה, נסה להקליט שוב");
    if (res.error === "big") return tlkSay(env, "ההקלטה ארוכה מדי ואינה ניתנת לתמלול, נסה להקליט אותה בשני חלקים ולשרשר אותם כהמשך");
    if (res.error === "whisper") return tlkSay(env, "שירות התמלול עמוס כרגע, נסה שוב בעוד דקה");
    const { item, appended } = await tlkSaveTranscript(env, callerPhone, res, null, appendTo, "phone");
    await tlkStore(env, "tlk_pend_" + callerPhone, null);
    let mailSent = false;
    if (c.sendEmail && mail) mailSent = await tlkSendMail(env, callerPhone, item, mail);
    const mailNote = mailSent ? " ונשלח למייל" : "";
    let say;
    if (appended) say = "ההמשך נוסף בהצלחה לתמלול מ" + tlkDateStr(item.at) + mailNote + ". ";
    else say = "התמלול הושלם" + mailNote + ". ";
    if (c.playResult && res.final.length <= 1500) say = say + "כך הוא נשמע: " + res.final;
    else if (c.playResult) say = say + "תחילת התמלול: " + res.final.slice(0, 350) + ". התמלול המלא ארוך ונשמר. ";
    else say = say + "אורכו כ" + res.final.split(/\s+/).length + " מילים. ";
    say = say + " להקלטה נוספת הקש אחת, לתפריט הקש שתיים.";
    return tlkRead(env, say, "again,no,1,1,15,Digits,yes,yes,,,,,None,");
  }
  if (params.again === "1") return tlkRead(env, "הקלט אחרי הצליל. בסיום הקש סולמית או פשוט נתק.", "link,,record,/7/rec,,no,yes,,1,2700");
  if (params.again) return tlkMainMenu(env);

  // ----- אישור במצב שמיעה ואישור -----
  const pendA = await tlkLoad(env, "tlk_pendA_" + callerPhone);
  const confirmV = String(params.confirm || "");
  if (pendA && confirmV && !params.link) {
    if (confirmV === "1") {
      const jobId = "t" + Date.now();
      let list = (await tlkLoad(env, key)) || [];
      list.unshift({ id: jobId, at: pendA.at || Date.now(), updated: Date.now(), status: "processing", via: "phone", text: "", raw: "" });
      await tlkStore(env, key, list);
      await tlkStore(env, "tlk_job_" + jobId, { phone: callerPhone, path: pendA.path, appendTo: null, at: Date.now() });
      await tlkStore(env, "tlk_pendA_" + callerPhone, null);
      const p = tlkFinishJob(env, jobId);
      if (ctx && ctx.waitUntil) ctx.waitUntil(p); else await p;
      return tlkSay(env, "ההקלטה נשלחה לתמלול. התמלול יגיע למייל ולאזור האישי תוך שניות. שלום.");
    }
    if (confirmV === "2") { await tlkStore(env, "tlk_pendA_" + callerPhone, null); return tlkRead(env, "הקלט מחדש אחרי הצליל. בסיום הקש סולמית.", "link,,record,/7/rec,,no,yes,,1,2700"); }
    await tlkStore(env, "tlk_pendA_" + callerPhone, null);
    return tlkMainMenu(env);
  }

  // ----- בחירת תמלול לשמיעה / מייל חוזר / המשך -----
  const pick = String(params.pick || "");
  if (pick) {
    const list = (await tlkLoad(env, key)) || [];
    const idx = Number(pick) - 1;
    if (isNaN(idx) || idx < 0 || idx >= list.length || idx >= 5 || list[idx].status) return tlkSay(env, "בחירה שגויה");
    const item = list[idx];
    const after = String(params.after || "");
    if (after === "1") { const ok = await tlkSendMail(env, callerPhone, item, mail); return tlkSay(env, ok ? "התמלול נשלח שוב למייל" : "שליחת המייל נכשלה, נסה שוב מאוחר יותר"); }
    if (after === "2") {
      await tlkStore(env, "tlk_pend_" + callerPhone, { appendTo: item.id });
      return tlkRead(env, "הקלט את ההמשך עבור התמלול מ" + tlkDateStr(item.at) + ". בסיום הקש סולמית או נתק.", "link,,record,/7/rec,,no,yes,,1,2700");
    }
    if (after === "3") return tlkMainMenu(env);
    const body = item.text.length > 2000 ? item.text.slice(0, 2000) + ". ההמשך במייל." : item.text;
    return tlkRead(env, "תמלול מ" + tlkDateStr(item.at) + ": " + body, "after,no,1,1,15,Digits,yes,yes,,,,,None,");
  }
  if (params.after) return tlkMainMenu(env);

  // ----- תפריט ראשי (מפת ARISH: 1 הקלטה, 2 אחרונים, 3 קוד אתר, 4 הגדרות, 5 סטטוס) -----
  const menu = String(params.menu || "");
  if (menu === "1" || (!menu && c.quickRec && !params.set && !params.code && !params.code2)) return tlkRead(env, "הקלט אחרי הצליל. בסיום הקש סולמית או פשוט נתק. ניתן להקליט עד ארבעים וחמש דקות.", "link,,record,/7/rec,,no,yes,,1,2700");
  if (menu === "2") {
    const list = (await tlkLoad(env, key)) || [];
    const ready = list.filter((x) => !x.status);
    if (!ready.length) return tlkRead(env, "אין תמלולים שמורים. להקלטה חדשה הקש אחת.", "menu,no,1,1,15,Digits,yes,yes,,,,,None,");
    const top = ready.slice(0, 5);
    let say = "יש לך " + ready.length + " תמלולים. ";
    for (let i = 0; i < top.length; i++) {
      const head = top[i].text.replace(/\s+/g, " ").slice(0, 60);
      say += "תמלול " + (i + 1) + ", מ" + tlkDateStr(top[i].at) + ": " + head + ". ";
    }
    say += "לשמיעת תמלול הקש את מספרו.";
    return tlkRead(env, say, "pick,no,1,1,20,Digits,yes,yes,,,,,None,");
  }
  if (menu === "3") {
    let code = await tlkLoad(env, "tlk_code_" + callerPhone);
    const codeOpt = String(params.code || "");
    if (codeOpt === "2") {
      return tlkRead(env, "הקישו קוד קבוע חדש בן ארבע עד שמונה ספרות ולאחריו סולמית.", "newcode,no,4,8,30,Digits,yes,yes,,,,,None,");
    }
    if (codeOpt === "3") {
      const tmp = String(Math.floor(100000 + Math.random() * 900000));
      await tlkStore(env, "tlk_tmp_" + callerPhone, { code: tmp, exp: Date.now() + 86400000 });
      return tlkRead(env, "קוד זמני לאתר למשך יממה: " + digitsHe(tmp) + ". לחזרה לתפריט הקש אחת, לאזור הקוד הקש שתיים.", "menu,no,1,1,20,Digits,yes,yes,,,,,None,");
    }
    if (!code) { code = String(Math.floor(100000 + Math.random() * 900000)); await tlkStore(env, "tlk_code_" + callerPhone, code); }
    return tlkRead(env, "הקוד האישי שלך לכניסה לאתר: " + digitsHe(code) + ". האתר: yemot-ai.y0508352872.workers.dev/tlk-site. לשינוי הקוד הקש שתיים, לקוד זמני ליממה הקש שלוש, לתפריט הקש ארבע.", "code,no,1,1,20,Digits,yes,yes,,,,,None,");
  }
  if (params.newcode) {
    const nc = String(params.newcode).replace(/\D/g, "");
    if (nc.length < 4) return tlkRead(env, "הקוד קצר מדי, חזרה לתפריט הקוד. לשמיעת הקוד הקש אחת, לשינוי הקש שתיים, לקוד זמני הקש שלוש.", "code,no,1,1,20,Digits,yes,yes,,,,,None,");
    await tlkStore(env, "tlk_code_" + callerPhone, nc);
    return tlkRead(env, "הקוד שונה בהצלחה. הקוד החדש: " + digitsHe(nc) + ". לתפריט הקש אחת.", "menu,no,1,1,15,Digits,yes,yes,,,,,None,");
  }
  if (menu === "4") {
    const setPrompt = "הפעלה או כיבוי השמעה חוזרת ברובוט הקש אחת. הפעלה או כיבוי שליחה למייל הקש שתיים. שינוי סגנון ה-Aי בין רגיל לתורני הקש שלוש. כניסה מהירה להקלטה הקש ארבע. ניתוק מיידי לאחר הקלטה הקש חמש. מצב שמיעה ואישור לפני שליחה הקש שש. לחזרה לתפריט הקש שבע.";
    const setv = String(params.set || "");
    if (setv === "1") { c.playResult = !c.playResult; await tlkStore(env, "tlk_cfg_" + callerPhone, c); return tlkRead(env, "השמעה חוזרת " + (c.playResult ? "הופעלה." : "כובתה.") + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,"); }
    if (setv === "2") { c.sendEmail = !c.sendEmail; await tlkStore(env, "tlk_cfg_" + callerPhone, c); return tlkRead(env, "שליחה למייל " + (c.sendEmail ? "הופעלה." : "כובתה.") + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,"); }
    if (setv === "3") {
      const order = ["general", "torah", "hasidic", "yiddish"];
      const names = { general: "רגיל", torah: "תורני", hasidic: "חסידי", yiddish: "אידיש" };
      c.style = order[(order.indexOf(c.style) + 1) % order.length];
      await tlkStore(env, "tlk_cfg_" + callerPhone, c);
      return tlkRead(env, "סגנון התמלול הוגדר ל" + names[c.style] + "." + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,");
    }
    if (setv === "4") { c.quickRec = !c.quickRec; await tlkStore(env, "tlk_cfg_" + callerPhone, c); return tlkRead(env, "כניסה מהירה להקלטה " + (c.quickRec ? "הופעלה, בכניסה לשלוחה תיכף תתחיל ההקלטה." : "כובתה.") + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,"); }
    if (setv === "5") { c.approve = false; await tlkStore(env, "tlk_cfg_" + callerPhone, c); return tlkRead(env, "ניתוק מיידי לאחר הקלטה הופעל." + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,"); }
    if (setv === "6") { c.approve = true; await tlkStore(env, "tlk_cfg_" + callerPhone, c); return tlkRead(env, "מצב שמיעה ואישור לפני שליחה הופעל." + setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,"); }
    if (setv === "7") return tlkMainMenu(env);
    return tlkRead(env, setPrompt, "set,no,1,1,25,Digits,yes,yes,,,,,None,");
  }
  if (menu === "5") {
    const list = (await tlkLoad(env, key)) || [];
    let say = "יש לך " + list.filter((x) => !x.status).length + " תמלולים שמורים. ";
    say += "מפתח גרוק לתמלול פעיל. ";
    say += mail ? "השליחה למייל פעילה לכתובת " + mail + ". " : "השליחה למייל כבויה או שלא הוגדרה כתובת. ";
    say += "סגנון התמלול " + ({ general: "רגיל.", torah: "תורני.", hasidic: "חסידי.", yiddish: "אידיש." })[c.style] + " ";
    return tlkRead(env, say, "menu,no,1,1,20,Digits,yes,yes,,,,,None,");
  }
  // כניסה ראשונה לשלוחה
  const wf = await ttsTextToYemotFile(env, "ברוכים הבאים לשלוחת התמלול. הקלט את דבריך בטלפון, במיקרופון של המחשב או בהעלאת קובץ, ותקבל תמלול מפוסק בהקראה, במייל ובאזור האישי באתר.");
  const mf = await ttsTextToYemotFile(env, "להקלטה חדשה לתמלול הקש אחת. לשמיעת התמלולים האחרונים הקש שתיים. לקוד הכניסה לאתר הקש שלוש. להגדרות הקש ארבע. לסטטוס החשבון הקש חמש.");
  if (mf) {
    let b = "read=f-" + mf + "=menu,no,1,1,20,Digits,yes,yes,,,,,None,";
    if (wf) b = "id_list_message=f-" + wf + "&" + b;
    return new Response(b, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return tlkMainMenu(env);
}
__name(handleTlkRequest, "handleTlkRequest");__name(handleTlkRequest, "handleTlkRequest");
__name2(handleTlkRequest, "handleTlkRequest");
__name22(handleTlkRequest, "handleTlkRequest");

// ===================== אתר אישי - תמלול =====================
// ===== שלוחת האיכות הגבוהה (HQ) =====
const HQ_BACKOFF = [5, 15, 45, 90, 180];
__name(HQ_BACKOFF, "HQ_BACKOFF");
__name2(HQ_BACKOFF, "HQ_BACKOFF");
__name22(HQ_BACKOFF, "HQ_BACKOFF");
async function hqRefine(env, raw, cfg) {
  const style = ["torah", "hasidic", "yiddish"].includes(cfg.style) ? cfg.style : "general";
  const base = TLK_STYLE_AI[style];
  const custom = cfg.customPrompt ? "\n\nהנחיה אישית מהמשתמש (חובה לקיים): " + String(cfg.customPrompt).slice(0, 400) : "";
  const dict = cfg.whisperDict ? "\nמונחים ושמות רלוונטיים: " + String(cfg.whisperDict).slice(0, 500) : "";
  const W = 3500, OV = 500;
  const chunks = [];
  for (let i = 0; i < raw.length; i += W - OV) chunks.push({ text: raw.slice(i, i + W), cont: i > 0 });
  const out = [];
  for (const ch of chunks) {
    const p1 = base + custom + dict + "\n\nזו הקלטה שמעובדת במצב איכות מקסימלית. עבור על הקטע בקפידה: פיסוק מלא ומדויק, חלוקה לפסקאות הגיוניות, פתיחת ראשי תיבות גורים, תיקון שיבושי זיהוי לפי ההקשר. שמור על כל מילה מהתוכן המקורי, אל תשמיט, אל תוסיף, אל תתמצת." + (ch.cont ? "\nזהו המשך של קטע קודם — המשך ברצף בלי כותרת." : "");
    let e = await groqChatShort(env, p1, ch.text, 4000);
    if (e) {
      const w0 = ch.text.split(/\s+/).length, w1 = e.split(/\s+/).length;
      if (Math.abs(w1 - w0) > Math.max(6, Math.ceil(w0 * 0.3))) e = null;
    }
    out.push(e || ch.text);
  }
  let merged = out.join("\n\n");
  if (merged.length > 400 && merged.length <= 12000) {
    const p2 = base + custom + "\n\nלהלן תמלול שכבר נערך. בצע מעבר ליטוש אחרון: אחידות פיסוק ופסקאות, תיקון שאריות שיבושי הקשבה, יישור מינוח. אל תשנה תוכן ואל תשמיט דברים.";
    const m2 = await groqChatShort(env, p2, merged, 4000);
    if (m2) {
      const w0 = merged.split(/\s+/).length, w1 = m2.split(/\s+/).length;
      if (Math.abs(w1 - w0) <= Math.max(6, Math.ceil(w0 * 0.15))) merged = m2;
    }
  }
  return merged;
}
__name(hqRefine, "hqRefine");
__name2(hqRefine, "hqRefine");
__name22(hqRefine, "hqRefine");
async function hqRunJob(env, jobId) {
  const job = await tlkLoad(env, "tlk_hqjob_" + jobId);
  if (!job || job.done) return true;
  job.attempts = (job.attempts || 0) + 1;
  try {
    const res = await tlkProcessRecording(env, job.path, job.phone, true);
    if (res.error) throw new Error(res.error);
    const cfg = (await tlkLoad(env, "tlk_cfg_" + job.phone)) || {};
    const refined = await hqRefine(env, res.raw, cfg);
    const item = { id: "t" + Date.now(), at: job.at || Date.now(), updated: Date.now(), text: refined, raw: res.raw, style: res.style, via: "hq" };
    if (res.blob && res.blob.size < 30 * 1024 * 1024 && await tlkStoreAudio(env, res.blob, item.id)) item.audio = item.id;
    let list = (await tlkLoad(env, "tlk_" + job.phone)) || [];
    list = list.filter((x) => x.id !== jobId && x.id !== "h" + jobId.slice(1));
    list.unshift(item);
    if (list.length > 50) list = list.slice(0, 50);
    await tlkStore(env, "tlk_" + job.phone, list);
    const mail = (await tlkLoad(env, "tlk_mail_" + job.phone)) || "y0508352872@gmail.com";
    if (mail) await tlkSendMail(env, job.phone, item, mail);
    logEvent("hq_job_done", { chars: refined.length, attempts: job.attempts, ms: Date.now() - job.at });
    await tlkStore(env, "tlk_hqjob_" + jobId, null);
    return true;
  } catch (e) {
    logEvent("hq_job_retry", { attempts: job.attempts, reason: String(e?.message || e).slice(0, 60) });
    if (job.attempts >= HQ_BACKOFF.length) {
      let list = (await tlkLoad(env, "tlk_" + job.phone)) || [];
      list.unshift({ id: "e" + Date.now(), at: Date.now(), updated: Date.now(), status: "error", via: "hq", text: "תמלול איכותי נכשל אחרי " + job.attempts + " ניסיונות: " + String(e?.message || e) });
      await tlkStore(env, "tlk_" + job.phone, list);
      await tlkStore(env, "tlk_hqjob_" + jobId, null);
      return true;
    }
    job.nextAt = Date.now() + HQ_BACKOFF[Math.min(job.attempts - 1, HQ_BACKOFF.length - 1)] * 60000;
    await tlkStore(env, "tlk_hqjob_" + jobId, job);
    return false;
  }
}
__name(hqRunJob, "hqRunJob");
__name2(hqRunJob, "hqRunJob");
__name22(hqRunJob, "hqRunJob");
async function hqScanDrop(env) {
  try {
    const r = await fetch("https://www.call2all.co.il/ym/api/GetIVR2Dir?token=" + env.YEMOT_TOKEN + "&path=ivr2:8/drop", { headers: { "User-Agent": "Mozilla/5.0" } });
    const j = await r.json().catch(() => null);
    const files = (j && j.files) || [];
    const seen = (await tlkLoad(env, "hq_seen")) || [];
    let added = 0;
    for (const f of files) {
      const nm = String(f.name || "");
      const isAudio = /\.(wav|mp3|m4a|ogg|flac|aac)$/i.test(nm);
      const isM = /^M\d+/i.test(nm);
      const seenArr = Array.isArray(seen) ? seen : [];
      const isSeen = seenArr.indexOf(nm) >= 0;
      if (!isAudio || isM || isSeen) continue;
      const jobId = "h" + Date.now() + "_" + Math.floor(Math.random() * 900 + 100);
      await tlkStore(env, "tlk_hqjob_" + jobId, { phone: "0537876782", path: "8/drop/" + nm, at: Date.now(), attempts: 0, nextAt: 0 });
      seen.unshift(nm);
      added++;
    }
    if (added) await tlkStore(env, "hq_seen", seen.slice(0, 400));
    logEvent("hq_scan", { found: files.length, added });
    return added;
  } catch (e) { logEvent("hq_scan_failed", {}); return 0; }
}
__name(hqScanDrop, "hqScanDrop");
__name2(hqScanDrop, "hqScanDrop");
__name22(hqScanDrop, "hqScanDrop");
async function hqDrain(env) {
  try {
    const jl = await env.USER_MEMORY.list({ prefix: "tlk_hqjob_" });
    let ran = 0;
    for (const jk of jl.keys || []) {
      const jraw = await env.USER_MEMORY.get(jk.name);
      if (!jraw) continue;
      let j = null;
      try { j = JSON.parse(jraw); } catch (_) {}
      if (!j) continue;
      if ((j.nextAt || 0) > Date.now()) continue;
      await hqRunJob(env, jk.name.replace("tlk_hqjob_", ""));
      ran++;
    }
    return ran;
  } catch (_) { return 0; }
}
__name(hqDrain, "hqDrain");
__name2(hqDrain, "hqDrain");
__name22(hqDrain, "hqDrain");
async function handleHqRequest(env, params, callerPhone, ctx) {
  callerPhone = normalizeIsraelPhone(callerPhone);
  const isOwner = !env.MAILBOX_OWNER_PHONE || !callerPhone || callerPhone.endsWith("7876782");
  logEvent("hq_request", { caller: String(callerPhone).slice(-4), hasLink: Boolean(params.link), menu: String(params.menu || "") });
  const recPath = params.link || params.file_path || "";
  if (recPath && String(recPath).includes(".wav")) {
    const jobId = "h" + Date.now();
    await tlkStore(env, "tlk_hqjob_" + jobId, { phone: callerPhone || "0537876782", path: String(recPath), at: Date.now(), attempts: 0, nextAt: 0 });
    let list = (await tlkLoad(env, "tlk_" + (callerPhone || "0537876782"))) || [];
    list.unshift({ id: jobId, at: Date.now(), updated: Date.now(), status: "processing", via: "hq", text: "", raw: "" });
    await tlkStore(env, "tlk_" + (callerPhone || "0537876782"), list);
    const p = hqRunJob(env, jobId);
    if (ctx && ctx.waitUntil) ctx.waitUntil(p);
    return tlkSay(env, "ההקלטה נקלטה לתמלול באיכות גבוהה. העיבוד עשוי להימשך זמן רב. התמלול יישלח למייל ולאזור האישי. שלום.");
  }
  const menu = String(params.menu || "");
  if (menu === "1") return tlkRead(env, "הקלט אחרי הצליל. בסיום הקש סולמית או נתק. ההקלטה תעובד במצב איכות מקסימלי.", "link,,record,/8/rec,,no,yes,,1,3600");
  if (menu === "2") {
    const added = await hqScanDrop(env);
    const ran = await hqDrain(env);
    return tlkSay(env, added ? "נמצאו " + added + " קבצים חדשים בתיקיית ההשלכה והועברו לתמלול באיכות גבוהה." : "אין קבצים חדשים בתיקיית ההשלכה. " + (ran ? "הופעלו תמלולים שהמתינו." : "אין תמלולים בהמתנה."));
  }
  if (menu === "3") {
    let pending = 0;
    try {
      const jl = await env.USER_MEMORY.list({ prefix: "tlk_hqjob_" });
      for (const jk of jl.keys || []) { const v = await env.USER_MEMORY.get(jk.name); if (v) pending++; }
    } catch (_) {}
    return tlkSay(env, pending ? "בתור האיכות ממתינים כרגע " + pending + " תמלולים בעיבוד." : "תור התמלול באיכות גבוהה ריק, הכל טופל.");
  }
  const wf = await ttsTextToYemotFile(env, "ברוכים הבאים לשלוחת התמלול באיכות גבוהה. להקלטה מיידית הקש אחת. לתמלול קבצים שהושלכו לתיקיית השיתוף הקש שתיים. לסטטוס התור הקש שלוש.");
  const mf = await ttsTextToYemotFile(env, "להקלטה מיידית לתמלול איכותי הקש אחת. לתמלול קבצים שהושלכו לתיקיית השיתוף הקש שתיים. לסטטוס התור הקש שלוש.");
  if (mf) {
    let b = "read=f-" + mf + "=menu,no,1,1,20,Digits,yes,yes,,,,,None,";
    if (wf) b = "id_list_message=f-" + wf + "&" + b;
    return new Response(b, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return tlkRead(env, "להקלטה מיידית לתמלול איכותי הקש אחת. לתמלול קבצים שהושלכו לתיקיית השיתוף הקש שתיים. לסטטוס התור הקש שלוש.", "menu,no,1,1,20,Digits,yes,yes,,,,,None,");
}
__name(handleHqRequest, "handleHqRequest");
__name2(handleHqRequest, "handleHqRequest");
__name22(handleHqRequest, "handleHqRequest");

async function tlkSiteAuth(env, url, request) {
  const auth = request.headers.get("Authorization") || "";
  let token = auth.startsWith("Bearer ") ? auth.slice(7) : (url.searchParams.get("t") || "");
  if (!token) return null;
  const sess = await tlkLoad(env, "tlk_sess_" + token);
  if (!sess || !sess.phone || Date.now() > (sess.exp || 0)) return null;
  return sess.phone;
}
__name(tlkSiteAuth, "tlkSiteAuth");
__name2(tlkSiteAuth, "tlkSiteAuth");
__name22(tlkSiteAuth, "tlkSiteAuth");
async function handleTlkSiteApi(env, url, request) {
  const path = url.pathname;
  const J = { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" };
  if (request.method === "OPTIONS") return new Response("", { headers: J });
  try {
    if (path === "/tlk-api/login" && request.method === "POST") {
      const b = await request.json().catch(() => null);
      const phone = normalizeIsraelPhone((b && b.phone) || "");
      const code = String((b && b.code) || "").trim();
      if (!phone || !code) return Response.json({ ok: false, error: "חסרים פרטי כניסה" }, { headers: J });
      const saved = await tlkLoad(env, "tlk_code_" + phone);
      let okCode = saved && String(saved) === code;
      if (!okCode) {
        const tmp = await tlkLoad(env, "tlk_tmp_" + phone);
        if (tmp && tmp.code === code && Date.now() < (tmp.exp || 0)) okCode = true;
      }
      if (!okCode) return Response.json({ ok: false, error: "מספר הטלפון או הקוד שגויים" }, { headers: J });
      const token = crypto.randomUUID().replace(/-/g, "") + Date.now().toString(36);
      await env.USER_MEMORY.put("tlk_sess_" + token, JSON.stringify({ phone, exp: Date.now() + 2592000000 }), { expirationTtl: 2592000 });
      return Response.json({ ok: true, token, phone }, { headers: J });
    }
    const phone = await tlkSiteAuth(env, url, request);
    if (!phone) return Response.json({ ok: false, error: "unauthorized" }, { status: 401, headers: J });
    if (path === "/tlk-api/list") {
      const list = (await tlkLoad(env, "tlk_" + phone)) || [];
      return Response.json({ ok: true, items: list }, { headers: J });
    }
    if (path === "/tlk-api/save" && request.method === "POST") {
      const b = await request.json().catch(() => null);
      const list = (await tlkLoad(env, "tlk_" + phone)) || [];
      const item = list.find((x) => x.id === (b && b.id));
      if (!item) return Response.json({ ok: false, error: "התמלול לא נמצא" }, { headers: J });
      if (typeof b.text === "string" && b.text.trim()) { item.text = b.text; item.edited = true; }
      if (typeof b.fav === "boolean") item.fav = b.fav;
      if (Array.isArray(b.tags)) item.tags = b.tags.filter(function(t) { return typeof t === "string" && t.trim().length > 0; });
      if (typeof b.folder === "string") item.folder = b.folder.trim();
      item.updated = Date.now();
      await tlkStore(env, "tlk_" + phone, list);
      return Response.json({ ok: true }, { headers: J });
    }
    if (path === "/tlk-api/delete" && request.method === "POST") {
      const b = await request.json().catch(() => null);
      let list = (await tlkLoad(env, "tlk_" + phone)) || [];
      list = list.filter((x) => x.id !== (b && b.id));
      await tlkStore(env, "tlk_" + phone, list);
      return Response.json({ ok: true }, { headers: J });
    }
    if (path === "/tlk-api/settings" && request.method === "GET") {
      const cfg = (await tlkLoad(env, "tlk_cfg_" + phone)) || {};
      const mail = (await tlkLoad(env, "tlk_mail_" + phone)) || "";
      return Response.json({ ok: true, mail, style: ["torah", "hasidic", "yiddish"].includes(cfg.style) ? cfg.style : "general", whisperDict: cfg.whisperDict || "", customPrompt: cfg.customPrompt || "", playResult: cfg.playResult !== false, sendEmail: cfg.sendEmail !== false, approve: cfg.approve === true, quickRec: cfg.quickRec === true }, { headers: J });
    }
    if (path === "/tlk-api/settings" && request.method === "POST") {
      const b = await request.json().catch(() => null) || {};
      const cfg = (await tlkLoad(env, "tlk_cfg_" + phone)) || {};
      if (typeof b.mail === "string") await tlkStore(env, "tlk_mail_" + phone, b.mail.trim());
      if (["torah", "hasidic", "yiddish", "general"].includes(b.style)) cfg.style = b.style;
      if (typeof b.whisperDict === "string") cfg.whisperDict = b.whisperDict.slice(0, 500);
      if (typeof b.customPrompt === "string") cfg.customPrompt = b.customPrompt.slice(0, 400);
      if (typeof b.playResult === "boolean") cfg.playResult = b.playResult;
      if (typeof b.sendEmail === "boolean") cfg.sendEmail = b.sendEmail;
      await tlkStore(env, "tlk_cfg_" + phone, cfg);
      return Response.json({ ok: true }, { headers: J });
    }
    if (path === "/tlk-api/finalize" && request.method === "POST") {
      const fd = await request.formData();
      const rawTxt = String(fd.get("text") || "").replace(/\s+/g, " ").trim();
      if (!rawTxt) return Response.json({ ok: false, error: "אין טקסט לשמירה" }, { headers: J });
      const cfgF = (await tlkLoad(env, "tlk_cfg_" + phone)) || {};
      const style = cfgF.style === "torah" ? "torah" : "general";
      let final = rawTxt;
      if (rawTxt.length > 12) {
        const words = rawTxt.split(/\s+/).length;
        const edited = await groqChatShort(env, TLK_STYLE_AI[style], rawTxt, Math.min(4000, Math.max(400, words * 3)));
        if (edited) {
          const eWords = edited.split(/\s+/).length;
          if (Math.abs(eWords - words) <= Math.max(4, Math.ceil(words * 0.2))) final = edited;
        }
      }
      const item = { id: "t" + Date.now(), at: Date.now(), updated: Date.now(), text: final, raw: rawTxt, style, via: "site-live" };
      const wavF = fd.get("wav");
      if (wavF && wavF.size > 1000 && await tlkStoreAudio(env, wavF, item.id)) item.audio = item.id;
      let list = (await tlkLoad(env, "tlk_" + phone)) || [];
      list.unshift(item);
      if (list.length > 50) list = list.slice(0, 50);
      await tlkStore(env, "tlk_" + phone, list);
      const isOwnerF = !env.MAILBOX_OWNER_PHONE || phone.endsWith(String(env.MAILBOX_OWNER_PHONE).replace(/\D/g, "").slice(-9));
      const mailF = (await tlkLoad(env, "tlk_mail_" + phone)) || (isOwnerF ? "y0508352872@gmail.com" : "");
      let mailSent = false;
      if (mailF && (cfgF.sendEmail === undefined ? isOwnerF : cfgF.sendEmail !== false)) mailSent = await tlkSendMail(env, phone, item, mailF);
      logEvent("tlk_finalize", { chars: final.length, mail: mailSent });
      return Response.json({ ok: true, item, mailSent }, { headers: J });
    }
    if (path === "/tlk-api/audio") {
      const id = url.searchParams.get("id") || "";
      const list = (await tlkLoad(env, "tlk_" + phone)) || [];
      const item = list.find((x) => x.id === id);
      if (!item || !item.audio) return new Response("not found", { status: 404 });
      const d = await fetch("https://www.call2all.co.il/ym/api/DownloadFile?token=" + env.YEMOT_TOKEN + "&path=ivr2:7/audio/" + id + ".wav", { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!d.ok) return new Response("audio missing", { status: 404 });
      return new Response(d.body, { status: 200, headers: { "Content-Type": "audio/wav", "Content-Disposition": "inline", "Cache-Control": "private, max-age=86400" } });
    }
    if (path === "/tlk-api/upload" && request.method === "POST") {
      const fd = await request.formData();
      const file = fd.get("file");
      if (!file || !file.size) return Response.json({ ok: false, error: "לא התקבל קובץ" }, { headers: J });
      if (file.size > 40 * 1024 * 1024) return Response.json({ ok: false, error: "הקובץ גדול מדי לתמלול, נסו להעלות בחלקים" }, { headers: J });
      if (String(fd.get("live") || "") === "1") {
        const cfgL = (await tlkLoad(env, "tlk_cfg_" + phone)) || {};
        const styleL = cfgL.style === "torah" ? "torah" : "general";
        const txt = await tlkWhisper(env, file, styleL);
        if (txt === null) return Response.json({ ok: false, error: "התמלול נכשל, נסו שוב" }, { headers: J });
        logEvent("tlk_live_chunk", { chars: txt.length });
        return Response.json({ ok: true, text: txt }, { headers: J });
      }
      const targetId = String(fd.get("targetId") || "");
      const res = await tlkProcessBlob(env, file, phone);
      if (res.error === "empty" || res.error === "silent") return Response.json({ ok: false, error: "לא נשמע דיבור בהקלטה" }, { headers: J });
      if (res.error === "big") return Response.json({ ok: false, error: "הקובץ גדול מדי לתמלול" }, { headers: J });
      if (res.error) return Response.json({ ok: false, error: "התמלול נכשל, נסו שוב" }, { headers: J });
      const { item } = await tlkSaveTranscript(env, phone, res, null, targetId || null, "site");
      const cfg = (await tlkLoad(env, "tlk_cfg_" + phone)) || {};
      const isOwner = !env.MAILBOX_OWNER_PHONE || phone.endsWith(String(env.MAILBOX_OWNER_PHONE).replace(/\D/g, "").slice(-9));
      const mail = (await tlkLoad(env, "tlk_mail_" + phone)) || (isOwner ? "y0508352872@gmail.com" : "");
      let mailSent = false;
      if (mail && (cfg.sendEmail === undefined ? isOwner : cfg.sendEmail !== false)) mailSent = await tlkSendMail(env, phone, item, mail);
      logEvent("tlk_site_upload", { ok: true, mail: mailSent, chars: res.final.length });
      return Response.json({ ok: true, item, mailSent }, { headers: J });
    }
    return Response.json({ ok: false, error: "unknown" }, { status: 404, headers: J });
  } catch (e) {
    logEvent("tlk_site_error", { type: e?.name || "Error" });
    return Response.json({ ok: false, error: "שגיאת שרת" }, { status: 500, headers: J });
  }
}
__name(handleTlkSiteApi, "handleTlkSiteApi");
__name2(handleTlkSiteApi, "handleTlkSiteApi");
__name22(handleTlkSiteApi, "handleTlkSiteApi");
const TLK_SITE_HTML = String.raw`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>תמלול קולי - אזור אישי</title>
<style>
:root{--p:#0d7a5f;--pd:#0a5c47;--bg:#f4f6f5;--card:#fff;--tx:#1d2b26;--mut:#68766f;--line:#dde5e1;--err:#b3402a;--star:#e8a20c}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Segoe UI",Arial,Helvetica,sans-serif;background:var(--bg);color:var(--tx);min-height:100vh}
.hide{display:none!important}
button{font-family:inherit;cursor:pointer;border:none;border-radius:8px;font-size:15px;padding:9px 16px;background:var(--p);color:#fff;transition:.15s}
button:hover{background:var(--pd)}
button.sec{background:#e8eeeb;color:var(--tx)}
button.sec:hover{background:#d9e2de}
button.danger{background:#f4e6e1;color:var(--err)}
input,textarea{font-family:inherit;font-size:16px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;width:100%;background:#fff;color:var(--tx)}
input:focus,textarea:focus{outline:2px solid var(--p);border-color:transparent}
/* כניסה */
#login{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}
.lcard{background:var(--card);border-radius:16px;box-shadow:0 6px 30px rgba(20,40,30,.12);padding:38px 34px;max-width:380px;width:100%}
.lcard h1{font-size:24px;color:var(--p);margin-bottom:6px}
.lcard p{color:var(--mut);font-size:14px;margin-bottom:22px}
.lcard label{display:block;font-size:13px;color:var(--mut);margin:14px 0 5px}
.lerr{color:var(--err);font-size:14px;margin-top:12px;min-height:18px}
/* אפליקציה */
header{background:var(--card);border-bottom:1px solid var(--line);padding:12px 20px;display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:5}
header .logo{font-size:19px;font-weight:700;color:var(--p);white-space:nowrap}
header .ph{color:var(--mut);font-size:14px;margin-inline-start:auto}
main{max-width:1150px;margin:0 auto;padding:20px 16px 60px}
.bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center}
.bar input[type=search]{flex:1;min-width:200px;max-width:420px}
.bar .chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-size:13px;background:#e8eeeb;border-radius:20px;padding:6px 13px;cursor:pointer}
.chip.on{background:var(--p);color:#fff}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.tile{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;cursor:pointer;transition:.15s;position:relative;display:flex;flex-direction:column;gap:8px}
.tile:hover{box-shadow:0 4px 16px rgba(20,40,30,.13);transform:translateY(-1px)}
.tile .d{font-size:12.5px;color:var(--mut)}
.tile .t{font-size:15.5px;line-height:1.55;flex:1}
.tile .meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.badge{font-size:11.5px;background:#e3efe9;color:var(--pd);border-radius:12px;padding:3px 9px}
.badge.tor{background:#efe8dc;color:#7a5b1e}
.star{position:absolute;top:10px;left:10px;font-size:19px;color:#cdd6d1;background:none;padding:2px}
.star.on{color:var(--star)}
.empty{text-align:center;color:var(--mut);padding:60px 10px;font-size:16px}
/* עורך */
#ov{position:fixed;inset:0;background:rgba(15,25,20,.55);display:flex;align-items:center;justify-content:center;z-index:20;padding:14px}
.modal{background:var(--card);border-radius:16px;max-width:900px;width:100%;max-height:95vh;display:flex;flex-direction:column;overflow:hidden}
.mtop{padding:14px 18px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px;background:var(--card);position:sticky;top:0;z-index:2}
.mtop .d{font-size:13px;color:var(--mut)}
.mtop .sp{margin-inline-start:auto;display:flex;gap:8px;align-items:center}
#player{padding:10px 18px;border-bottom:1px solid var(--line);background:#f8faf9;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#player audio{flex:1;min-width:220px;height:38px}
#player button{padding:6px 10px;font-size:13px;background:#e8eeeb;color:var(--tx)}
#player .spd.on{background:var(--p);color:#fff}
.mbody{padding:18px;overflow:auto;flex:1}
#etxt{min-height:300px;font-size:16.5px;line-height:1.8;resize:vertical}
#rawbox{margin-top:12px}
.mfoot{padding:12px 18px;border-top:1px solid var(--line);display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.mfoot .cnt{font-size:13px;color:var(--mut);margin-inline-start:auto}
/* התקדמות */
#prog{position:fixed;inset:0;background:rgba(15,25,20,.65);display:flex;align-items:center;justify-content:center;z-index:30}
.pcard{background:var(--card);border-radius:16px;padding:34px 40px;text-align:center;min-width:300px}
.ring{width:110px;height:110px;margin:0 auto 16px;border-radius:50%;background:conic-gradient(var(--p) calc(var(--v)*1%),#e3e9e6 0);display:flex;align-items:center;justify-content:center}
.ring>div{width:88px;height:88px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--p)}
.pstage{color:var(--mut);font-size:14px}
#toast{position:fixed;bottom:22px;right:50%;transform:translateX(50%);background:var(--tx);color:#fff;border-radius:10px;padding:12px 22px;font-size:15px;z-index:40;opacity:0;transition:.3s;pointer-events:none}
#toast.on{opacity:1}
@media(max-width:640px){.modal{max-height:98vh}.mtop{flex-wrap:wrap}}
.spin{width:22px;height:22px;border:3px solid #d5e0da;border-top-color:var(--p);border-radius:50%;display:inline-block;animation:sp 1s linear infinite;vertical-align:-5px}
@keyframes sp{to{transform:rotate(360deg)}}
select{font-family:inherit;font-size:14px;border:1px solid var(--line);border-radius:8px;padding:7px 10px;background:#fff;color:var(--tx)}
</style>
</head>
<body>

<div id="login">
  <form class="lcard" id="lform">
    <h1>🎙️ תמלול קולי</h1>
    <p>אזור אישי - התמלולים שהוקלטו בקו וההקלטות מהאתר</p>
    <label>מספר טלפון</label>
    <input id="lphone" inputmode="tel" placeholder="0537876782" required>
    <label>קוד אישי</label>
    <input id="lcode" inputmode="numeric" placeholder="הקוד שלך" required>
    <div class="lerr" id="lerr"></div>
    <button style="width:100%;margin-top:6px">כניסה לאזור האישי</button>
  </form>
</div>

<div id="app" class="hide">
  <header>
    <span class="logo">🎙️ תמלול קולי</span>
    <span class="ph" id="who"></span>
    <button class="sec" id="out" style="padding:7px 12px;font-size:13.5px">התנתקות</button>
  </header>
  <main>
    <div class="bar">
      <input type="search" id="q" placeholder="🔍 חיפוש בתמלולים...">
      <button id="recbtn">🎤 הקלטה מהמיקרופון</button>
      <button id="livebtn">⚡ תמלול חי</button>
      <button class="sec" id="upbtn">📤 העלאת קובץ שמע</button>
      <button class="sec" id="stbtn">⚙ הגדרות</button>
      <input type="file" id="file" accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.webm,.aac,.opus" class="hide">
    </div>
    <div class="bar" style="margin-top:-8px">
      <div class="chips" id="chips"></div>
    </div>
    <div id="grid"></div>
    <div class="empty hide" id="empty">עדיין אין תמלולים.<br>חייגו לקו והקישו 7, הקליטו מהמיקרופון או העלו קובץ שמע.</div>
  </main>
</div>

<div id="ov" class="hide">
  <div class="modal">
    <div class="mtop">
      <span class="d" id="mdate"></span>
      <span class="badge" id="mstyle"></span>
      <span class="sp">
        <button class="star" id="mstar" title="מועדפים">★</button>
        <button class="sec" id="mclose" style="padding:7px 12px">✕ סגירה</button>
      </span>
    </div>
    <div id="player" class="hide">
      <button id="b5">⏪ 5-</button>
      <button id="bp">▶ / ⏸ (Alt+רווח)</button>
      <button id="f5">+5 ⏩</button>
      <button class="spd" data-s="1">1x</button><button class="spd" data-s="1.25">1.25x</button><button class="spd" data-s="1.5">1.5x</button><button class="spd" data-s="2">2x</button>
      <audio id="au" controls preload="metadata"></audio>
    </div>
    <div class="mbody">
      <textarea id="etxt"></textarea>
      <div id="rawbox" class="hide">
        <div style="font-size:12.5px;color:var(--mut);margin-bottom:5px">תמלול גולמי לפני עריכה:</div>
        <textarea id="eraw" readonly style="min-height:110px;font-size:14px;color:var(--mut)"></textarea>
      </div>
    </div>
    <div class="mfoot">
      <button id="msave">💾 שמירה (Ctrl+S)</button>
      <button class="sec" id="mtxt">⬇ TXT</button>
      <button class="sec" id="mdoc">⬇ Word</button>
      <button class="sec" id="mcopy">📋 העתקה</button>
      <button class="sec" id="mapp">🎤 הקלט המשך</button>
      <button class="sec" id="mshare">🔗 שיתוף</button>
      <select id="mfold" title="תיקייה">
        <option value="">ללא תיקייה</option><option value="כללי">כללי</option><option value="עבודה">עבודה</option><option value="לימודים">לימודים</option><option value="רעיונות">רעיונות</option>
      </select>
      <button class="sec" id="mraw">מקור גולמי</button>
      <button class="danger" id="mdel">🗑 מחיקה</button>
      <span class="cnt" id="cnt"></span>
    </div>
  </div>
</div>

<div id="prog" class="hide">
  <div class="pcard">
    <div class="ring" id="ring" style="--v:0"><div id="pv">0%</div></div>
    <div style="font-size:17px;font-weight:600;margin-bottom:5px" id="ptitle">מעבד</div>
    <div class="pstage" id="pstage">מעלה את הקובץ...</div>
  </div>
</div>

<div id="lov" class="hide">
  <div class="modal" style="max-width:820px">
    <div class="mtop"><b>⚡ תמלול חי בזמן אמת</b><span class="sp">
      <span id="lind" class="hide" style="color:#b3402a;font-size:13px">● מקליט</span>
      <button id="lfin">✅ סיים ושמור</button>
      <button class="sec" id="lcan" style="padding:8px 12px">✖ ביטול</button>
    </span></div>
    <div class="mbody" style="min-height:180px">
      <div id="lstage" style="color:var(--mut);font-size:14px">ממתין לדיבור... התחילו לדבר והמילים יופיעו כאן</div>
      <div id="ltxt" style="font-size:17px;line-height:1.8;white-space:pre-wrap"></div>
    </div>
  </div>
</div>
<div id="sov" class="hide">
  <div class="modal" style="max-width:520px">
    <div class="mtop"><b>⚙ הגדרות אישיות</b><span class="sp"><button class="sec" id="sclose" style="padding:7px 12px">✕</button></span></div>
    <div class="mbody" style="padding:20px">
      <label style="font-size:13px;color:var(--mut)">כתובת מייל לקבלת התמלולים</label>
      <input id="smail" type="email" placeholder="you@gmail.com" style="margin:6px 0 16px">
      <label style="font-size:13px;color:var(--mut)">סגנון התמלול</label>
      <select id="sstyle" style="margin:6px 0 16px;width:100%">
        <option value="general">עברית כללית</option>
        <option value="torah">תורני ישיבתי (גמרא, רמב״ם, סוגיות)</option>
        <option value="hasidic">חסידי / לשון הקודש בהגייה חסידית</option>
        <option value="yiddish">אידיש כשפת אם</option>
      </select>
      <label style="font-size:13px;color:var(--mut)">מילון אישי לזיהוי בהשמעה (מוזן לוויספר — שמות נדירים, מונחים, שמות חברות)</label>
      <textarea id="sdict" rows="2" style="margin:6px 0 16px;font-size:14px" placeholder="למשל: מוטקי לוי, חברת שלום בע״מ, הרב אלתר"></textarea>
      <label style="font-size:13px;color:var(--mut)">הנחיה אישית לעורך ה-AI (פועלת אחרי התמלול)</label>
      <textarea id="sprompt" rows="3" style="margin:6px 0 16px;font-size:14px" placeholder="למשל: אם נאמר X החלף תמיד ל-Y. או: ערוך כפרוטוקול מסודר עם החלטות מודגשות"></textarea>
    </div>
    <div class="mfoot"><button id="ssave">💾 שמירת הגדרות</button><span class="cnt" id="sinfo"></span></div>
  </div>
</div>
<div id="toast"></div>

<script>
var API='/tlk-api/', TOK=localStorage.getItem('tlk_tok')||'', PH=localStorage.getItem('tlk_ph')||'', ITEMS=[], CUR=null, POLL=null, tagF='', favF=false, dragT=null;
function $(x){return document.getElementById(x)}
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},2600)}
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
function fmtD(ms){try{return new Intl.DateTimeFormat('he-IL',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(ms))}catch(e){return ''}}
function wc(t){var w=String(t||'').trim();return w?w.split(/\s+/).length:0}
function api(path,opt){opt=opt||{};opt.headers=Object.assign({'Authorization':'Bearer '+TOK},opt.headers||{});return fetch(API+path,opt).then(function(r){if(r.status===401){logout();throw new Error('401')}return r.json()})}

function login(e){
  e.preventDefault();
  $('lerr').textContent='';
  fetch(API+'login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:$('lphone').value,code:$('lcode').value})})
  .then(function(r){return r.json()}).then(function(j){
    if(!j.ok){$('lerr').textContent=j.error||'שגיאה';return}
    TOK=j.token;PH=j.phone;localStorage.setItem('tlk_tok',TOK);localStorage.setItem('tlk_ph',PH);
    start();
  }).catch(function(){$('lerr').textContent='שגיאת רשת, נסה שוב'});
}
function logout(){TOK='';localStorage.removeItem('tlk_tok');clearInterval(POLL);$('app').classList.add('hide');$('login').classList.remove('hide')}
function start(){$('login').classList.add('hide');$('app').classList.remove('hide');$('who').textContent='☎ '+PH;load();POLL=setInterval(function(){load(true)},6000)}

function load(silent){
  return api('list').then(function(j){
    if(!j.ok)return;
    var had=ITEMS.length?ITEMS[0].id:'';
    ITEMS=j.items||[];
    render();
    if(silent&&ITEMS.length&&ITEMS[0].id!==had)toast('🎙️ תמלול חדש מהקו התווסף!');
  }).catch(function(){})
}
function render(){
  var q=$('q').value.trim(), g=$('grid'), h='';
  var tags={};var folds={};
  ITEMS.forEach(function(it){(it.tags||[]).forEach(function(t){tags[t]=1});if(it.folder)folds[it.folder]=(folds[it.folder]||0)+1});
  var ch='';
  ['כללי','עבודה','לימודים','רעיונות'].forEach(function(f){if(folds[f])ch+='<span class="chip'+(tagF==='fld:'+f?' on':'')+'" data-t="fld:'+esc(f)+'">📁 '+f+'</span>'});
  Object.keys(tags).forEach(function(t){ch+='<span class="chip'+(tagF===t?' on':'')+'" data-t="'+esc(t)+'">'+esc(t)+'</span>'});
  if(favF)ch+='<span class="chip on">★ מועדפים</span>';
  if(ch)$('chips').innerHTML=ch;
  var shown=ITEMS.filter(function(it){
    if(favF&&!it.fav)return false;
    if(tagF&&tagF.indexOf('fld:')===0){if(it.folder!==tagF.slice(4))return false}
    else if(tagF&&(it.tags||[]).indexOf(tagF)<0)return false;
    if(q&&((it.text||'')+' '+(it.raw||'')).indexOf(q)<0)return false;
    return true;
  });
  shown.forEach(function(it){
    if(it.status==='processing'){
      h+='<div class="tile" style="opacity:.85"><div class="d">🕐 '+fmtD(it.at)+'</div><div class="t"><span class="spin"></span>&nbsp; '+(it.via==='phone'?'מעבד הקלטה חיה מהטלפון...':'מעבד...')+'</div><div class="meta"><span class="badge">תמלול ב-Groq</span></div></div>';
      return;
    }
    if(it.status==='error'){
      h+='<div class="tile"><div class="d">🕐 '+fmtD(it.at)+'</div><div class="t">⚠ '+esc(it.text||'התמלול נכשל')+'</div></div>';
      return;
    }
    var ex=String(it.text||'').replace(/\s+/g,' ').slice(0,110);
    h+='<div class="tile" data-id="'+it.id+'">'
      +'<button class="star'+(it.fav?' on':'')+'" data-st="'+it.id+'">★</button>'
      +'<div class="d">🕐 '+fmtD(it.at)+(it.appendCount?' · המשכים: '+it.appendCount:'')+(it.edited?' · נערך':'')+(it.via==='site'?' · מהאתר':'')+'</div>'
      +'<div class="t">'+esc(ex)+(ex.length>=110?'...':'')+'</div>'
      +'<div class="meta"><span class="badge'+(it.style&&it.style!=='general'?' tor':'')+'">'+({general:'רגיל',torah:'תורני',hasidic:'חסידי',yiddish:'אידיש'}[it.style||'general'])+'</span>'+(it.folder?'<span class="badge">📁 '+esc(it.folder)+'</span>':'')+'<span class="badge">'+wc(it.text)+' מילים</span>'+(it.tags||[]).map(function(t){return '<span class="badge">'+esc(t)+'</span>'}).join('')+'</div>'
      +'</div>';
  });
  g.innerHTML=h;
  $('empty').classList.toggle('hide',ITEMS.length>0);
  g.querySelectorAll('.tile').forEach(function(el){el.onclick=function(ev){if(ev.target.dataset.st){star(ev.target.dataset.st);return}open(el.dataset.id)}});
  $('chips').querySelectorAll('.chip').forEach(function(el){el.onclick=function(){var t=el.dataset.t;if(el.textContent.indexOf('מועדפים')>=0){favF=!favF}else{tagF=(tagF===t?'':t)}render()}});
}

function open(id){
  CUR=ITEMS.filter(function(x){return x.id===id})[0];if(!CUR)return;
  $('mdate').textContent='🕐 '+fmtD(CUR.at)+(CUR.updated&&CUR.updated!==CUR.at?' · עודכן '+fmtD(CUR.updated):'');
  $('mstyle').textContent=CUR.style==='torah'?'תורני':'רגיל';$('mstyle').className='badge'+(CUR.style==='torah'?' tor':'');
  $('mstar').className='star'+(CUR.fav?' on':'');
  $('etxt').value=CUR.text;$('eraw').value=CUR.raw||'';
  $('rawbox').classList.add('hide');$('mraw').textContent='מקור גולמי';
  var p=$('player');
  if(CUR.audio){p.classList.remove('hide');$('au').src=API+'audio?id='+encodeURIComponent(CUR.id)+'&t='+encodeURIComponent(TOK);}
  else p.classList.add('hide');
  cnt();$('ov').classList.remove('hide');
}
function cnt(){$('cnt').textContent=wc($('etxt').value)+' מילים · '+$('etxt').value.length+' תווים'}
function save(){if(!CUR)return;var t=$('etxt').value;api('save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:CUR.id,text:t})}).then(function(j){if(j.ok){CUR.text=t;toast('נשמר ✓');render()}else toast('השמירה נכשלה')})}
function star(id){api('save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,fav:true})}).then(function(){load()}).catch(function(){load()})}
function del(){if(!CUR)return;if(!confirm('למחוק את התמלול?'))return;api('delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:CUR.id})}).then(function(){$('ov').classList.add('hide');load();toast('נמחק')})}

function dl(name,content,mime){var b=new Blob([content],{type:mime||'text/plain;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},3000)}
function txtOf(){return ($('mdate').textContent)+'\n\n'+$('etxt').value}

/* נגן */
var au=$('au');
$('bp').onclick=toggleP;function toggleP(e){if(e)e.preventDefault();au.paused?au.play():au.pause()}
$('b5').onclick=function(){au.currentTime=Math.max(0,au.currentTime-5)};
$('f5').onclick=function(){au.currentTime=Math.min(au.duration||1e9,au.currentTime+5)};
document.querySelectorAll('.spd').forEach(function(b){b.onclick=function(){au.playbackRate=parseFloat(b.dataset.s);document.querySelectorAll('.spd').forEach(function(x){x.classList.remove('on')});b.classList.add('on')}});
document.addEventListener('keydown',function(e){
  if($('ov').classList.contains('hide'))return;
  if(e.altKey&&(e.code==='Space'||e.key===' ')){toggleP();e.preventDefault()}
  if((e.ctrlKey||e.metaKey)&&e.key==='s'){save();e.preventDefault()}
});

/* ===== תמלול חי בזמן אמת ===== */
var LV={rec:null,chunks:[],wavs:[],text:'',ctx:null,an:null,timer:null,lastSpeech:0,segStart:0,busy:false,stream:null};
function lvSet(rec){LV.rec=rec;$('lind').classList.toggle('hide',!rec)}
$('livebtn').onclick=function(){
  $('lov').classList.remove('hide');$('ltxt').textContent='';$('lstage').classList.remove('hide');$('lstage').textContent='ממתין לדיבור...';
  LV.text='';LV.chunks=[];LV.wavs=[];LV.busy=false;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){$('lstage').textContent='הדפדפן לא תומך בהקלטה';return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    LV.stream=stream;
    LV.ctx=new (window.AudioContext||window.webkitAudioContext)();
    LV.an=LV.ctx.createAnalyser();LV.an.fftSize=512;
    LV.ctx.createMediaStreamSource(stream).connect(LV.an);
    LV.lastSpeech=Date.now();LV.segStart=Date.now();
    lvStartRec();
    LV.timer=setInterval(lvTick,200);
    lvSet(true);
  }).catch(function(){$('lstage').textContent='אין הרשאת מיקרופון'});
};
function lvStartRec(){
  LV.chunks=[];
  LV.rec=new MediaRecorder(LV.stream);
  LV.rec.ondataavailable=function(e){if(e.data&&e.data.size)LV.chunks.push(e.data)};
  LV.rec.onstop=function(){
    var b=new Blob(LV.chunks,{type:LV.rec.mimeType||'audio/webm'});
    if(b.size>1200)lvSendChunk(b);
  };
  LV.rec.start();
}
function lvTick(){
  if(!LV.an)return;
  var d=new Uint8Array(LV.an.fftSize);
  LV.an.getByteTimeDomainData(d);
  var rms=0;for(var i=0;i<d.length;i++){var x=(d[i]-128)/128;rms+=x*x}
  rms=Math.sqrt(rms/d.length);
  var now=Date.now();
  if(rms>0.02){LV.lastSpeech=now;$('lstage').classList.add('hide')}
  var silentFor=now-LV.lastSpeech, segLen=now-LV.segStart;
  if((silentFor>1500&&segLen>3000)||(segLen>40000)){ lvCut(); }
}
function lvCut(){
  if(!LV.rec||LV.rec.state!=='recording')return;
  LV.rec.stop();LV.segStart=Date.now();
  setTimeout(lvStartRec,120);
}
async function lvSendChunk(b){
  if(LV.busy){setTimeout(function(){lvSendChunk(b)},800);return}
  LV.busy=true;
  try{
    var wav=await downsample(b);
    LV.wavs.push(wav);
    var x=new XMLHttpRequest();x.open('POST',API+'upload');
    x.setRequestHeader('Authorization','Bearer '+TOK);
    var fd=new FormData();fd.append('file',wav,'live.webm');fd.append('live','1');
    x.onload=function(){
      try{var j=JSON.parse(x.responseText);
        if(j.ok&&j.text){LV.text+=(LV.text?' ':'')+j.text;$('ltxt').textContent=LV.text;$('lstage').classList.add('hide')}
      }catch(e){}
      LV.busy=false;
    };
    x.onerror=function(){LV.busy=false};
    x.send(fd);
  }catch(e){LV.busy=false}
}
function lvMergeWavs(blobs){
  // איחוי קטעי WAV 16kHz מונו לקובץ אחד
  return Promise.all(blobs.map(function(b){return b.arrayBuffer()})).then(function(bufs){
    var parts=[];var hdr=null;
    bufs.forEach(function(ab){
      var dv=new DataView(ab);var off=12;
      while(off+8<=ab.byteLength){var id=String.fromCharCode(dv.getUint8(off),dv.getUint8(off+1),dv.getUint8(off+2),dv.getUint8(off+3));var sz=dv.getUint32(off+4,true);
        if(id==='data'){if(!hdr)hdr=ab.slice(0,off+8);parts.push(new Uint8Array(ab,off+8,Math.min(sz,ab.byteLength-off-8)));break}
        off+=8+sz+(sz%2)}
    });
    if(!parts.length)return new Blob([],{type:'audio/wav'});
    var total=0;parts.forEach(function(p){total+=p.length});
    var out=new Uint8Array(hdr.byteLength+total);
    out.set(new Uint8Array(hdr),0);var o=hdr.byteLength;
    parts.forEach(function(p){out.set(p,o);o+=p.length});
    var dv2=new DataView(out.buffer);dv2.setUint32(4,out.length-8,true);dv2.setUint32(hdr.byteLength-4,total,true);
    return new Blob([out],{type:'audio/wav'});
  });
}
$('lfin').onclick=async function(){
  if(!LV.text){toast('עדיין אין דיבור מתומלל');return}
  clearInterval(LV.timer);lvSet(false);
  if(LV.rec&&LV.rec.state==='recording')LV.rec.stop();
  $('lstage').textContent='מסיים: עריכה ופיסוק ב-AI ושמירה...';
  try{
    var wav=await lvMergeWavs(LV.wavs);
    var fd=new FormData();fd.append('text',LV.text);if(wav.size>1000)fd.append('wav',wav,'full.wav');
    var x=new XMLHttpRequest();x.open('POST',API+'finalize');
    x.setRequestHeader('Authorization','Bearer '+TOK);
    x.onload=function(){try{var j=JSON.parse(x.responseText);
      if(j.ok){$('lov').classList.add('hide');LV.stream&&LV.stream.getTracks().forEach(function(t){t.stop()});LV.ctx&&LV.ctx.close();
        load().then(function(){open(j.item.id)});toast('התמלול החי נשמר ✓')}
      else{$('lstage').textContent=j.error||'נכשל'}
    }catch(e){$('lstage').textContent='שגיאה'}};
    x.onerror=function(){$('lstage').textContent='שגיאת רשת'};
    x.send(fd);
  }catch(e){$('lstage').textContent='שגיאה בסיום'}
};
$('lcan').onclick=function(){
  clearInterval(LV.timer);lvSet(false);
  if(LV.rec&&LV.rec.state==='recording')LV.rec.stop();
  LV.stream&&LV.stream.getTracks().forEach(function(t){t.stop()});
  LV.ctx&&LV.ctx.close();
  $('lov').classList.add('hide');
};
/* עיבוד קבצים והקלטות */
function setProg(v,title,stage){$('ring').style.setProperty('--v',v);$('pv').textContent=Math.round(v)+'%';if(title)$('ptitle').textContent=title;if(stage!==undefined)$('pstage').textContent=stage}
function downsample(blob){
  return blob.arrayBuffer().then(function(buf){
    var AC=window.AudioContext||window.webkitAudioContext;var ctx=new AC();
    return ctx.decodeAudioData(buf).then(function(ab){
      var sr=16000,len=Math.ceil(ab.duration*sr),oc;
      try{oc=new OfflineAudioContext(1,len,sr)}catch(e){oc=new (window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,len,sr)}
      var s=oc.createBufferSource();s.buffer=ab;s.connect(oc.destination);s.start();
      return oc.startRendering().then(function(rb){
        var d=rb.getChannelData(0),n=d.length,arr=new ArrayBuffer(44+n*2),v=new DataView(arr),i;
        var ws=function(o,s){for(i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
        ws(0,'RIFF');v.setUint32(4,36+n*2,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,n*2,true);
        for(i=0;i<n;i++){var x=Math.max(-1,Math.min(1,d[i]));v.setInt16(44+i*2,x<0?x*32768:x*32767,true)}
        ctx.close();return new Blob([arr],{type:'audio/wav'});
      });
    });
  });
}
function processBlob(blob,name,fromRec){
  $('prog').classList.remove('hide');setProg(4,'מכין את הקובץ','ממיר ל-16 קילו הרץ מונו...');
  downsample(blob).then(function(wav){
    setProg(18,'מעלה','מעלה לשרת לתמלול...');
    var fd=new FormData();fd.append('file',wav,name||'rec.wav');
    var xhr=new XMLHttpRequest();xhr.open('POST',API+'upload');
    xhr.setRequestHeader('Authorization','Bearer '+TOK);
    xhr.upload.onprogress=function(e){if(e.lengthComputable)setProg(18+e.loaded/e.total*37,'מעלה','מעלה לשרת לתמלול...')};
    xhr.onload=function(){
      setProg(85,'מתמלל','מתמלל ב-Whisper ומפוסק ב-AI...');
      try{
        var j=JSON.parse(xhr.responseText);
        if(!j.ok){$('prog').classList.add('hide');toast(j.error||'התמלול נכשל');return}
        setProg(100,'הושלם','מסיים...');
        setTimeout(function(){$('prog').classList.add('hide');load().then(function(){open(j.item.id)});toast('התמלול הושלם ✓')},450);
      }catch(e){$('prog').classList.add('hide');toast('שגיאה בתשובת השרת')}
    };
    xhr.onerror=function(){$('prog').classList.add('hide');toast('שגיאת רשת')};
    xhr.send(fd);
  }).catch(function(){$('prog').classList.add('hide');toast('לא הצלחתי לקרוא את קובץ השמע')});
}

/* הקלטה מהמיקרופון */
var mediaRec=null,chunks=[];
$('recbtn').onclick=function(){
  if(mediaRec&&mediaRec.state==='recording'){mediaRec.stop();return}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast('הדפדפן לא תומך בהקלטה');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    mediaRec=new MediaRecorder(stream);chunks=[];
    mediaRec.ondataavailable=function(e){chunks.push(e.data)};
    mediaRec.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop()});
      var b=new Blob(chunks,{type:mediaRec.mimeType||'audio/webm'});
      if(b.size<900){toast('ההקלטה קצרה מדי');return}
      processBlob(b,'site-rec.webm',true);
    };
    mediaRec.start();
    $('recbtn').textContent='⏹ עצור הקלטה';
    toast('מקליט... לחצו שוב לעצירה');
    mediaRec.onstart=function(){};
    var iv=setInterval(function(){if(!mediaRec||mediaRec.state!=='recording'){clearInterval(iv);$('recbtn').textContent='🎤 הקלטה מהמיקרופון'}},300);
  }).catch(function(){toast('אין הרשאת מיקרופון או שהדפדפן חסום')});
};
$('upbtn').onclick=function(){$('file').click()};
$('file').onchange=function(){if(this.files[0])processBlob(this.files[0],this.files[0].name);this.value=''};
window.addEventListener('dragover',function(e){e.preventDefault()});
window.addEventListener('drop',function(e){e.preventDefault();var f=e.dataTransfer.files[0];if(f&&f.type.indexOf('audio')>=0||/\.(mp3|wav|m4a|ogg|flac|webm|aac|opus)$/i.test(f?f.name:''))if(f)processBlob(f,f.name)});

/* הקלטת המשך מהמיקרופון לתמלול הפתוח */
var appRec=null,appCh=[];
$('mapp').onclick=function(){
  if(appRec&&appRec.state==='recording'){appRec.stop();return}
  if(!CUR)return;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast('הדפדפן לא תומך בהקלטה');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    appRec=new MediaRecorder(stream);appCh=[];
    appRec.ondataavailable=function(e){appCh.push(e.data)};
    appRec.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop()});
      var b=new Blob(appCh,{type:appRec.mimeType||'audio/webm'});
      if(b.size<900){toast('ההקלטה קצרה מדי');return}
      $('prog').classList.remove('hide');setProg(15,'מקליט המשך','ממיר ומעלה...');
      downsample(b).then(function(wav){
        var fd2=new FormData();fd2.append('file',wav,'app.webm');fd2.append('targetId',CUR.id);
        var x=new XMLHttpRequest();x.open('POST',API+'upload');x.setRequestHeader('Authorization','Bearer '+TOK);
        x.upload.onprogress=function(e){if(e.lengthComputable)setProg(15+e.loaded/e.total*50,'מקליט המשך','מעלה...')};
        x.onload=function(){try{var j=JSON.parse(x.responseText);if(j.ok){setProg(100,'הושלם','');setTimeout(function(){$('prog').classList.add('hide');load().then(function(){open(CUR.id)});toast('ההמשך נוסף ✓')},400)}else{$('prog').classList.add('hide');toast(j.error||'נכשל')}}catch(e){$('prog').classList.add('hide');toast('שגיאה')}};
        x.onerror=function(){$('prog').classList.add('hide');toast('שגיאת רשת')};
        setProg(70,'מתמלל','מתמלל ומשורשר למסמך...');
        x.send(fd2);
      });
    };
    appRec.start();$('mapp').textContent='⏹ עצור';toast('מקליט המשך... לחצו שוב לעצירה');
    var iv=setInterval(function(){if(!appRec||appRec.state!=='recording'){clearInterval(iv);$('mapp').textContent='🎤 הקלט המשך'}},300);
  }).catch(function(){toast('אין הרשאת מיקרופון')});
};
/* שיתוף */
$('mshare').onclick=function(){if(!CUR)return;var t=$('etxt').value;if(navigator.share)navigator.share({text:t.slice(0,1500)}).catch(function(){});else{$('mcopy').click()}};
/* הגדרות */
$('stbtn').onclick=function(){
  api('settings').then(function(j){if(!j.ok)return;$('smail').value=j.mail||'';$('sstyle').value=j.style||'general';$('sdict').value=j.whisperDict||'';$('sprompt').value=j.customPrompt||'';
  $('sov').classList.remove('hide')});
};
$('sclose').onclick=function(){$('sov').classList.add('hide')};
$('ssave').onclick=function(){
  api('settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mail:$('smail').value,style:$('sstyle').value,whisperDict:$('sdict').value,customPrompt:$('sprompt').value})}).then(function(j){if(j.ok){toast('ההגדרות נשמרו ✓');$('sov').classList.add('hide')}});
};

/* כפתורי עורך */
$('msave').onclick=save;
$('mtxt').onclick=function(){dl('תמלול.txt',txtOf())};
$('mdoc').onclick=function(){var h='<html dir="rtl"><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:14pt"><h2>תמלול</h2><p>'+esc($('mdate').textContent)+'</p><div>'+esc($('etxt').value).replace(/\n/g,'<br>')+'</div></body></html>';dl('תמלול.doc',h,'application/msword')};
$('mcopy').onclick=function(){navigator.clipboard.writeText($('etxt').value).then(function(){toast('הועתק ✓')}).catch(function(){toast('ההעתקה נכשלה')})};
$('mraw').onclick=function(){var b=$('rawbox');var hid=b.classList.toggle('hide');$('mraw').textContent=hid?'מקור גולמי':'הסתר מקור'};
$('mdel').onclick=del;
$('mclose').onclick=function(){$('ov').classList.add('hide')};
$('mstar').onclick=function(){if(!CUR)return;api('save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:CUR.id,fav:!CUR.fav})}).then(function(){CUR.fav=!CUR.fav;$('mstar').className='star'+(CUR.fav?' on':'');load()})};
$('ov').addEventListener('mousedown',function(e){if(e.target===$('ov'))$('ov').classList.add('hide')});
$('etxt').addEventListener('input',cnt);
$('q').addEventListener('input',render);
$('out').onclick=logout;
$('lform').addEventListener('submit',login);
if(TOK)start();
</script>
</body>
</html>
`;

export {
  worker_default as default,
  ContState
};

//# sourceMappingURL=worker.js.map
