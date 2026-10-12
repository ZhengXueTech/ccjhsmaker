/**
 * 中正國中 3D 校園導覽 － Google Apps Script 網頁應用程式
 * 檔案：Code.gs（這個檔）＋ index（3D 導覽網頁，HTML 檔）
 *
 * 作用：把網址上的參數（?to=128、?from=G01&to=128&via=112）交給網頁，
 *       這樣「複製連結」「QR Code」點開就直接顯示指定地點或路線。
 */
// 分享用的短網址（GitHub 轉址頁）。填了之後，「複製連結」產生的都是這個網址；留白則用 GAS 原本的長網址。
// 例：var SHARE_BASE = 'https://帳號.github.io/ccjhs3d/';
var SHARE_BASE = '';

function doGet(e) {
  var boot = {
    url: SHARE_BASE || ScriptApp.getService().getUrl(),   // 分享連結用的網址
    p: (e && e.parameter) ? e.parameter : {}   // 網址參數：to / from / via
  };
  var json = JSON.stringify(boot).replace(/</g, '\\u003c');
  var html = HtmlService.createHtmlOutputFromFile('index').getContent();
  // 兩種方式都放，任一種成功即可：(1) 直接填進程式裡的預留位置 (2) 在 <title> 前插入一段設定
  html = html.split('/*__BOOT__*/null').join(json);
  html = html.replace('<title>', '<script>window.__BOOT__=' + json + ';</script>\n<title>');
  return HtmlService.createHtmlOutput(html)
    .setTitle('中正國中 3D 校園導覽')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** 檢查用：在編輯器選這個函式按「執行」，看「執行記錄」是否兩項都是 true。 */
function selfCheck() {
  var html = HtmlService.createHtmlOutputFromFile('index').getContent();
  Logger.log('找得到預留位置：' + (html.indexOf('/*__BOOT__*/null') >= 0));
  Logger.log('找得到 <title>：' + (html.indexOf('<title>') >= 0));
  Logger.log('應用程式網址：' + ScriptApp.getService().getUrl());
}
