# AI Mind Reading Card｜情緒花卡選擇器

這是一個不需要伺服器的純 HTML／CSS／JavaScript 小程序，可直接放入 GitHub Pages。

## 目前的選卡規則

每一個整數情緒等級有四張花卡：

| 小數區間 | 花開狀態 | 卡片編號 |
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

原先示例中的 `.21～.25` 與 `.71～.75` 有重疊，因此此版本改成連續且不重疊的 `.26` 與 `.76` 起算。

## 圖片資料夾

請將圖片依下列方式放置：

```text
cards/
├─ negative/
│  ├─ 6-1.png
│  ├─ 6-2.png
│  ├─ 6-3.png
│  ├─ 6-4.png
│  └─ ...其餘負向等級
├─ neutral/
│  ├─ 0-1.png
│  ├─ 0-2.png
│  ├─ 0-3.png
│  └─ 0-4.png
└─ positive/
   ├─ 1-1.png
   ├─ 1-2.png
   └─ ...其餘正向等級
```

負向與正向使用不同資料夾，可避免 `-6` 與 `+6` 使用相同檔名時發生衝突。

## 使用方式

1. 將此資料夾的檔案上傳到 GitHub repository。
2. 把花卡 PNG 放入對應的 `cards` 子資料夾。
3. 開啟 repository 的 **Settings → Pages**。
4. 選擇要發布的 branch，例如 `main`，資料夾選 `/root`。
5. 儲存後，以 GitHub Pages 網址開啟。

本機測試可在資料夾內執行：

```bash
python -m http.server 8000
```

然後在瀏覽器開啟 `http://localhost:8000`。

## JavaScript API

其他頁面也可以直接呼叫：

```html
<script src="selector.js"></script>
<script>
  const card = FlowerCardSelector.selectFlowerCard(-6.20);
  console.log(card.cardPath); // cards/negative/6-1.png
</script>
```

## 執行測試

已安裝 Node.js 時：

```bash
node test-selector.js
```
