(function (global) {
  "use strict";

  var BASE_PATH = "cards";

  var STAGES = [
    { number: 1, min: 0.00, max: 0.25, name: "含苞待放" },
    { number: 2, min: 0.26, max: 0.50, name: "半開" },
    { number: 3, min: 0.51, max: 0.75, name: "漸開" },
    { number: 4, min: 0.76, max: 0.99, name: "盛開" }
  ];

  function isFiniteNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }

  function trimText(value) {
    return String(value).replace(/^\s+|\s+$/g, "");
  }

  function parseEmotion(input) {
    if (typeof input === "string" && trimText(input) === "") {
      throw new Error("請輸入情緒數值。");
    }

    var value = Number(input);

    if (!isFiniteNumber(value)) {
      throw new Error("情緒值必須是有效的數字。");
    }

    var emotion = roundToTwoDecimals(value);

    if (emotion < -6.99 || emotion > 6.99) {
      throw new Error("情緒值必須介於 -6.99 與 +6.99 之間。");
    }

    return emotion;
  }

  function truncateTowardZero(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  }

  function getEmotionLevel(emotion) {
    return truncateTowardZero(emotion);
  }

  function getFraction(emotion, level) {
    return roundToTwoDecimals(Math.abs(emotion - level));
  }

  function getStage(fraction) {
    if (fraction <= 0.25) {
      return STAGES[0];
    }

    if (fraction <= 0.50) {
      return STAGES[1];
    }

    if (fraction <= 0.75) {
      return STAGES[2];
    }

    return STAGES[3];
  }

  function formatNumber(value) {
    return value.toFixed(2);
  }

  function getRangeText(level, stage, originalEmotion) {
    var sign =
      level < 0 || (level === 0 && originalEmotion < 0) ? -1 : 1;
    var absoluteLevel = Math.abs(level);
    var start = sign * (absoluteLevel + stage.min);
    var end = sign * (absoluteLevel + stage.max);

    return formatNumber(start) + " ～ " + formatNumber(end);
  }

  function getCardLocation(level, stageNumber) {
    var absoluteLevel = Math.abs(level);
    var fileName = absoluteLevel + "-" + stageNumber + ".png";

    if (level < 0) {
      return {
        fileName: fileName,
        path: BASE_PATH + "/negative/" + fileName,
        group: "negative"
      };
    }

    if (level > 0) {
      return {
        fileName: fileName,
        path: BASE_PATH + "/positive/" + fileName,
        group: "positive"
      };
    }

    return {
      fileName: "0-" + stageNumber + ".png",
      path: BASE_PATH + "/neutral/0-" + stageNumber + ".png",
      group: "neutral"
    };
  }

  function selectFlowerCard(input) {
    var emotion = parseEmotion(input);
    var level = getEmotionLevel(emotion);
    var fraction = getFraction(emotion, level);
    var stage = getStage(fraction);
    var location = getCardLocation(level, stage.number);

    return {
      emotion: emotion,
      level: level,
      fraction: fraction,
      stage: stage.number,
      stageName: stage.name,
      range: getRangeText(level, stage, emotion),
      fileName: location.fileName,
      cardPath: location.path,
      cardGroup: location.group
    };
  }

  var api = {
    STAGES: STAGES,
    selectFlowerCard: selectFlowerCard
  };

  global.FlowerCardSelector = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
      ? global
      : this
);
