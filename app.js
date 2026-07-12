"use strict";

(function () {
  const form = document.getElementById("emotion-form");
  const input = document.getElementById("emotion-input");
  const resultSection = document.getElementById("result");
  const errorMessage = document.getElementById("error-message");
  const image = document.getElementById("card-image");
  const missingCard = document.getElementById("missing-card");
  const stepUpButton = document.getElementById("step-up");
  const stepDownButton = document.getElementById("step-down");

  const MIN_EMOTION = -6;
  const MAX_EMOTION = 6;
  const EMOTION_STEP = 0.01;

  let repeatDelayTimer = null;
  let repeatTimer = null;

  function requiredElement(element, name) {
    if (!element) {
      throw new Error(`Missing required page element: ${name}`);
    }

    return element;
  }

  requiredElement(form, "emotion-form");
  requiredElement(input, "emotion-input");
  requiredElement(resultSection, "result");
  requiredElement(errorMessage, "error-message");
  requiredElement(image, "card-image");
  requiredElement(missingCard, "missing-card");
  requiredElement(stepUpButton, "step-up");
  requiredElement(stepDownButton, "step-down");

  if (!window.FlowerCardSelector) {
    errorMessage.textContent = "花卡選擇程式無法載入，請重新整理頁面。";
    return;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function changeEmotion(amount) {
    let value = Number(input.value);

    if (!Number.isFinite(value)) {
      value = 0;
    }

    value = Math.round((value + amount + Number.EPSILON) * 100) / 100;
    value = clamp(value, MIN_EMOTION, MAX_EMOTION);
    input.value = value.toFixed(2);
  }

  function stopRepeating() {
    clearTimeout(repeatDelayTimer);
    clearInterval(repeatTimer);
    repeatDelayTimer = null;
    repeatTimer = null;
  }

  function startRepeating(amount) {
    stopRepeating();
    changeEmotion(amount);

    repeatDelayTimer = setTimeout(function () {
      repeatTimer = setInterval(function () {
        changeEmotion(amount);
      }, 70);
    }, 450);
  }

  function connectStepButton(button, amount) {
    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      startRepeating(amount);
    });

    button.addEventListener("pointerup", stopRepeating);
    button.addEventListener("pointercancel", stopRepeating);
    button.addEventListener("pointerleave", stopRepeating);

    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        changeEmotion(amount);
      }
    });
  }

  function showMissingCard(selected) {
    const firstLine = document.createTextNode(
      `已選到 ${selected.fileName}，但找不到圖片。`
    );
    const secondLine = document.createTextNode("請確認圖片位於：");
    const pathCode = document.createElement("code");
    pathCode.textContent = selected.cardPath;

    missingCard.replaceChildren(
      firstLine,
      document.createElement("br"),
      secondLine,
      document.createElement("br"),
      pathCode
    );

    image.hidden = true;
    missingCard.hidden = false;
  }

  function displayCard(rawEmotion) {
    errorMessage.textContent = "";

    try {
      const selected = window.FlowerCardSelector.selectFlowerCard(rawEmotion);

      document.getElementById("emotion-value").textContent =
        selected.emotion.toFixed(2);
      document.getElementById("emotion-level").textContent =
        selected.level > 0 ? `+${selected.level}` : String(selected.level);
      document.getElementById("emotion-range").textContent = selected.range;
      document.getElementById("stage-title").textContent =
        `第 ${selected.stage} 張｜${selected.stageName}`;
      document.getElementById("card-file").textContent = selected.fileName;
      document.getElementById("card-path").textContent = selected.cardPath;

      image.hidden = false;
      missingCard.hidden = true;
      image.alt =
        `情緒 ${selected.emotion.toFixed(2)} 的${selected.stageName}花卡`;

      image.onload = function () {
        image.hidden = false;
        missingCard.hidden = true;
      };

      image.onerror = function () {
        showMissingCard(selected);
      };

      image.src = selected.cardPath;
      resultSection.hidden = false;
    } catch (error) {
      resultSection.hidden = true;
      errorMessage.textContent =
        error instanceof Error ? error.message : "無法處理情緒數值。";
    }
  }

  connectStepButton(stepUpButton, EMOTION_STEP);
  connectStepButton(stepDownButton, -EMOTION_STEP);
  document.addEventListener("pointerup", stopRepeating);
  document.addEventListener("pointercancel", stopRepeating);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = Number(input.value);

    if (!Number.isFinite(value)) {
      resultSection.hidden = true;
      errorMessage.textContent = "請輸入有效的情緒數值。";
      return;
    }

    if (value < MIN_EMOTION || value > MAX_EMOTION) {
      resultSection.hidden = true;
      errorMessage.textContent =
        "請輸入 -6.00 至 +6.00 之間的情緒數值。";
      return;
    }

    input.value = value.toFixed(2);
    displayCard(input.value);
  });

  displayCard(input.value);
})();
