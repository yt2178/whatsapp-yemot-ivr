import fs from 'fs';
import { nameVariants, findContactMatches, matchCandidatesAmong, resolveContinuation, findCurrency, contQuestionFor, isPronounRef, buildWhisperPrompt } from './unit-logic.mjs';

let pass=0, fail=0;
const T=(label,cond)=>{ cond?pass++:fail++; console.log((cond?'✓':'✗ FAIL')+' '+label); };

// --- nameVariants: הסרת תחיליות ---
T('לידידיה→ידידיה', nameVariants('לידידיה').includes('ידידיה'));
T('לדוד→דוד', nameVariants('לדוד').includes('דוד'));

// --- findContactMatches: תרחיש אברהם ---
const contacts=[
 {name:'אברהם דוד', address:'a1@x.com', aliases:['אברהם','אברהם דוד','דוד']},
 {name:'אברהם כהן', address:'a2@x.com', aliases:['אברהם','אברהם כהן','כהן']},
 {name:'ידידיה', address:'yed@x.com', aliases:['ידידיה','יודידיה','Yedidya']},
 {name:'דון', address:'don@x.com', aliases:['דון','natand1409']},
];
T('אברהם→2 התאמות', findContactMatches(contacts,'אברהם').length===2);
T('לידידיה (עם ל)→ידידיה יחיד', findContactMatches(contacts,'לידידיה').length===1 && findContactMatches(contacts,'לידידיה')[0].name==='ידידיה');
T('Yedidya לטיני→ידידיה', findContactMatches(contacts,'Yedidya').length===1);

// --- contQuestionFor ---
const q=contQuestionFor(findContactMatches(contacts,'אברהם'));
T('שאלת הבהרה בנוסח הנדרש: "'+q+'"', q==='לאיזה אברהם אתה מתכוון: אברהם דוד או אברהם כהן?');

// --- matchCandidatesAmong ---
const cands=findContactMatches(contacts,'אברהם');
T('תשובה "דוד"→אברהם דוד יחיד', matchCandidatesAmong(cands,'דוד').length===1 && matchCandidatesAmong(cands,'דוד')[0].name==='אברהם דוד');
T('תשובה "כהן"→אברהם כהן יחיד', matchCandidatesAmong(cands,'כהן').length===1 && matchCandidatesAmong(cands,'כהן')[0].name==='אברהם כהן');
T('תשובה "אברהם דוד" מלא→יחיד', matchCandidatesAmong(cands,'אברהם דוד').length===1);
T('תשובה "אברהם" (עדיין דו-משמעית)→2', matchCandidatesAmong(cands,'אברהם').length===2);
T('תשובה "בננה"→אין התאמה', matchCandidatesAmong(cands,'בננה').length===0);

// --- resolveContinuation: כללי ---
const cont={kind:'contact',action:'chat_send',candidates:cands,question:q,payload:{text:'שלום'}};
T('"דוד" ממשיך בקשה קודמת', resolveContinuation(cont,'דוד',contacts).status==='resolved' && resolveContinuation(cont,'דוד',contacts).contact.name==='אברהם דוד');
T('"כהן" ממשיך בקשה קודמת', resolveContinuation(cont,'כהן',contacts).contact.name==='אברהם כהן');
T('"אברהם" עדיין דו-משמעי→שאל שוב', resolveContinuation(cont,'אברהם',contacts).status==='reask');
T('"בננה"→שאל שוב', resolveContinuation(cont,'בננה',contacts).status==='reask');
T('"בטל"→ביטול', resolveContinuation(cont,'בטל',contacts).status==='cancel');
T('"לא משנה"→ביטול', resolveContinuation(cont,'לא משנה',contacts).status==='cancel');
T('"מה השעה"→פקודה חדשה', resolveContinuation(cont,'מה השעה',contacts).status==='newcommand');
T('פקודה שליחה ארוכה→פקודה חדשה', resolveContinuation(cont,'תשלח לדון בבוקר טוב שמעת',contacts).status==='newcommand');
T('"טוביה" (איש קשר אחר מהרשימה)→פתרון', resolveContinuation(cont,'טוביה',[...contacts,{name:'טוביה קטלן',address:'t@x.com',aliases:['טוביה']}]).contact.name==='טוביה קטלן');

// --- resolveContinuation: מטבע ---
const ccont={kind:'currency',action:'rate',question:'לאיזה מטבע?'};
T('"אירו"→EUR', resolveContinuation(ccont,'אירו',[]).currency==='eur');
T('"יורו"→EUR', resolveContinuation(ccont,'יורו',[]).currency==='eur');
T('"דולר"→USD', resolveContinuation(ccont,'דולר',[]).currency==='usd');
T('"ביטקוין"→BTC', resolveContinuation(ccont,'ביטקוין',[]).currency==='btc');
T('"גבינה"→שאל שוב', resolveContinuation(ccont,'גבינה',[]).status==='reask');
T('שאלת שעה בזמן המתנת מטבע→פקודה חדשה', resolveContinuation(ccont,'מה השעה',[]).status==='newcommand');

// --- isPronounRef / findCurrency ---
T('לו→כינוי', isPronounRef('לו') && isPronounRef('אליו') && isPronounRef('לה'));
T('לאברהם→לא כינוי', !isPronounRef('לאברהם'));
T('ארוך→לא אירו', findCurrency('ארוך')===null);

// --- buildWhisperPrompt ---
const p=buildWhisperPrompt(contacts);
T('רמז וויספר מכיל את ידידיה', p.includes('ידידיה'));
T('רמז וויספר מכיל את אברהם דוד', p.includes('אברהם דוד'));


// ===== בדיקות תיקון 2026-10-08 =====
(function(){
  const src=fs.readFileSync('live-merged.js','utf8');
  const decoded = src.replace(/\\u([0-9a-fA-F]{4})/g,(_,h)=>String.fromCharCode(parseInt(h,16)));
  T('אין עוד שאלת הבהרת מטבע תקועה', !src.includes('currQuestion = "לאיזה מטבע'));
  T('מסלול מהיר לשאלת יכולות', src.includes('const capsQ'));
  T('תודה מנקה המשך תקוע', src.includes('status: "ack"'));
  T('מגביל שאלות חוזרות לשתיים', src.includes('asks >= 2'));
  T('TTL קצר להמשך מטבע', src.includes('"currency" ? 180000'));
  T('בדיחה ברמז התמלול', src.includes('בדיחה, תודה'));
  T('פרומפט: אין סירוב לצאטים', decoded.includes('אל תגיד שאינך יכול'));
  T('פרומפט: אנטי המצאה בתמלול משובש', decoded.includes('טעות תמלול'));
})();

console.log(`\n=== תוצאה: ${pass} עבר, ${fail} נכשל ===`);
process.exit(fail?1:0);
