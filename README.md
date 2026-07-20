# AI-Mind Care 情緒花卡 v1.1  
## AI-Mind Care Emotion Flower Cards

看見情緒，讀懂自己，讓心如花綻放。  
輸入情緒數值（-6.0 ～ +6.0），系統會依據情緒等級與花開階段，顯示對應的花朵、花語與鼓勵關懷語。

See your emotions, understand yourself, and let your heart bloom.  
Enter an emotion value from -6.0 to +6.0 to receive a corresponding flower card, flower meaning, and caring message.

---

## v1.1 更新｜Android Compatibility Update

此版本保留 v1.0 的畫面與功能，並加強較舊 Android 手機、Android WebView 與 LINE 內建瀏覽器的相容性：

- ▲／▼ 同時支援 Pointer、Touch、Mouse 與鍵盤操作
- 不依賴 `Math.trunc()`、`Number.EPSILON` 或 `replaceChildren()`
- JavaScript 改用較舊瀏覽器可執行的 ES5 寫法
- 加入 `requestAnimationFrame` 備用處理
- 為 `clamp()`、`min()` 與 CSS Grid 加入傳統版面備用設定
- 手機旋鈕改用較普遍支援的 Flexbox 排列
- 保留無 Cookie、無分析追蹤、無資料上傳的隱私設計

若 LINE 內建瀏覽器仍無法正常顯示，請使用「在 Chrome 中開啟」，並更新 Google Chrome 與 Android System WebView。

---

## 主要功能｜Main Features

- 輸入情緒數值：`-6.0 ～ +6.0`
- 自動顯示對應花卡
- 顯示情緒等級、花開區間與花卡檔案
- 手機版提供 ▲／▼ 按鈕，可輸入負數
- Home 按鈕連結至 HyLove 官方網站
- 支援桌機與手機瀏覽
- 不使用訪客計數器、Cookie 或外部分析追蹤工具
- 情緒數值只在使用者瀏覽器中處理，不會上傳或儲存

---

## 花開階段｜Blooming Stages

| 小數區間 | 花開階段 | 卡片編號 |
|---|---|---|
| `.00 ～ .25` | 含苞待放 | `1` |
| `.26 ～ .50` | 半開 | `2` |
| `.51 ～ .75` | 漸開 | `3` |
| `.76 ～ .99` | 盛開 | `4` |

例如：

- `-6.20` → `cards/negative/6-1.png`
- `-6.40` → `cards/negative/6-2.png`
- `-6.60` → `cards/negative/6-3.png`
- `-6.90` → `cards/negative/6-4.png`

---

## 專案檔案｜Project Files

```text
index.html          網頁主要結構
style.css           網頁樣式與手機版配置
selector.js         情緒值與花卡對應邏輯
app.js              網頁互動功能
test-selector.js    選卡邏輯測試
cards/              花卡圖片資料夾
```

---

## 圖片資料夾｜Card Folders

```text
cards/
├─ negative/    負向情緒花卡
├─ neutral/     中性情緒花卡
└─ positive/    正向情緒花卡
```

---

## 隱私與安全｜Privacy and Security

- 本網站不使用 Google Analytics、GoatCounter 或其他外部分析工具。
- 不使用 Cookie、localStorage 或訪客追蹤技術。
- 使用者輸入的情緒數值只在本機瀏覽器中運算。
- 不會上傳、保存或分享使用者輸入的情緒資料。
- 請勿在公開 GitHub repository 中放入密碼、API 金鑰或私人資料。

---

## GitHub Pages 發布｜Deployment

1. 將所有檔案上傳至 GitHub repository。
2. 保留 `cards/` 資料夾及所有花卡圖片。
3. 前往 **Settings → Pages**。
4. 選擇：
   - Branch：`main`
   - Folder：`/root`
5. 儲存並等待 GitHub Pages 完成部署。

網站：

```text
https://mariarlee.github.io/AI-mind-reading-card/
```

---

## 測試｜Testing

如已安裝 Node.js，可執行：

```bash
node test-selector.js
```

---

## 版權｜Copyright

© Hylove Business Inc.  
All rights reserved.
