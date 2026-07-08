/**
 * מפעיל את ה-GitHub Action ישירות (workflow_dispatch) במקום לסמוך על ה-cron הפנימי של GitHub
 * שידוע כלא אמין (יכול להתעכב שעות בעומס).
 *
 * הגדרה חד פעמית:
 * 1. לך ל- https://script.google.com -> New project
 * 2. הדבק את כל הקוד הזה
 * 3. Project Settings (גלגל שיניים בצד) -> Script Properties -> Add property:
 *    שם: GITHUB_PAT   ערך: <ה-Personal Access Token שיצרת>
 * 4. Triggers (שעון בצד שמאל) -> Add Trigger:
 *    - Function: triggerGithubAction
 *    - Event source: Time-driven
 *    - Type: Minutes timer -> Every 5 minutes
 * 5. שמור ואשר הרשאות (יבקש חד פעמי)
 *
 * יצירת ה-PAT (Personal Access Token):
 * github.com/settings/tokens?type=beta -> Generate new token
 * - Repository access: Only select repositories -> yt2178/whatsapp-yemot-ivr
 * - Permissions -> Actions: Read and write
 * - Generate token, והדבק אותו ב-Script Properties כמו שהוסבר למעלה
 */

function triggerGithubAction() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_PAT');
  if (!token) {
    Logger.log('חסר GITHUB_PAT ב-Script Properties!');
    return;
  }

  const url = 'https://api.github.com/repos/yt2178/whatsapp-yemot-ivr/actions/workflows/main.yml/dispatches';
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    payload: JSON.stringify({ ref: 'main' }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Status: ' + response.getResponseCode());
  if (response.getResponseCode() >= 300) {
    Logger.log('Error: ' + response.getContentText());
  }
}
