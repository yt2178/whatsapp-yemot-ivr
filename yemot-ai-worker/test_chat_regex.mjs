// בדיקת רגקס זיהוי הצ'אט לפני פריסה
const chatWord = "(?:צ[׳'״\"]?[אע]?[טת]|ש[׳'״\"]?[אע][טת]|chat)(?:ים)?(?![א-ת])";
const chatIntent = new RegExp("(?:(?:גוגל|google|גוגול).{0,20}(?:" + chatWord + ")|(?:" + chatWord + ").{0,20}(?:גוגל|google|גוגול)|(?:^|[\\s,])[בהל]?(?:" + chatWord + ")|איש\\s+קשר)", "i");

const cases = [
  ["אני רוצה שתבדוק לי את השאטים בחשבון הראשון.", true],
  ["בדוק הודעות צאט", true],
  ["הודעות צ׳אטים", true],
  ["הצעת לגוגל צאט", true],
  ["פתח צאט לדון", true],
  ["איש קשר", true],
  ["מה השעה", false],
  ["תזכיר לי מחר בשמונה", false],
  ["מה מזג האוויר בירושלים", false],
  ["מילה קטנה", false],
  ["תשלח מייל לדון", false],
];
let fails = 0;
for (const [txt, want] of cases) {
  const got = chatIntent.test(txt);
  if (got !== want) { console.log("FAIL:", txt, "ציפינו", want, "קיבלנו", got); fails++; }
}
console.log(fails === 0 ? "כל " + cases.length + " הבדיקות עברו" : fails + " נכשלו");
