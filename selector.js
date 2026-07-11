(function (global) {
  "use strict";

  const STAGES = [
    { number: 1, min: 0.00, max: 0.25, name: "含苞待放" },
    { number: 2, min: 0.26, max: 0.50, name: "半開" },
    { number: 3, min: 0.51, max: 0.75, name: "漸開" },
    { number: 4, min: 0.76, max: 0.99, name: "盛開" }
  ];

  function roundToTwoDecimals(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function parseEmotion(input) {
    if (typeof input === "string" && input.trim() === "") {
      throw new Error("請輸入情緒數值。");
    }

    const value = Number(input);
    if (!Number.isFinite(value)) {
      throw new Error("情緒值必須是有效的數字。");
    }

    const emotion = roundToTwoDecimals(value);

    if (emotion < -6.00 || emotion > 6.00) {
      throw new Error("情緒值必須介於 -6.00 與 +6.00 之間。");
    }

    return emotion;
  }

  function getEmotionLevel(emotion) {
    // 負數向 0 取整，例如 -6.20 → -6；正數亦向 0 取整。
    return Math.trunc(emotion);
  }

  function getFraction(emotion, level) {
    return roundToTwoDecimals(Math.abs(emotion - level));
  }

  function getStage(fraction) {
    if (fraction <= 0.25) return STAGES[0];
    if (fraction <= 0.50) return STAGES[1];
    if (fraction <= 0.75) return STAGES[2];
    return STAGES[3];
  }

  function formatNumber(value) {
    return value.toFixed(2);
  }

  function getRangeText(level, stage, originalEmotion) {
    // 依使用者的表示方式呈現，例如 -6.00 ～ -6.25。
    const sign = level < 0 || (level === 0 && originalEmotion < 0) ? -1 : 1;
    const absoluteLevel = Math.abs(level);

    const start = sign * (absoluteLevel + stage.min);
    const end = sign * (absoluteLevel + stage.max);

    return `${formatNumber(start)} ～ ${formatNumber(end)}`;
  }

  function getCardLocation(level, stageNumber, basePath = "cards") {
    const absoluteLevel = Math.abs(level);
    const fileName = `${absoluteLevel}-${stageNumber}.png`;

    if (level < 0) {
      return {
        fileName,
        path: `${basePath}/negative/${fileName}`,
        group: "negative"
      };
    }

    if (level > 0) {
      return {
        fileName,
        path: `${basePath}/positive/${fileName}`,
        group: "positive"
      };
    }

    return {
      fileName: `0-${stageNumber}.png`,
      path: `${basePath}/neutral/0-${stageNumber}.png`,
      group: "neutral"
    };
  }

  function selectFlowerCard(input, options = {}) {
    const emotion = parseEmotion(input);
    const level = getEmotionLevel(emotion);
    const fraction = getFraction(emotion, level);
    const stage = getStage(fraction);
    const location = getCardLocation(
      level,
      stage.number,
      options.basePath || "cards"
    );

    return {
      emotion,
      level,
      fraction,
      stage: stage.number,
      stageName: stage.name,
      range: getRangeText(level, stage, emotion),
      fileName: location.fileName,
      cardPath: location.path,
      cardGroup: location.group
    };
  }

  const api = {
    STAGES,
    selectFlowerCard
  };

  // Browser
  global.FlowerCardSelector = api;

  // Node.js tests or server-side use
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
