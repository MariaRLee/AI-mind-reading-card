"use strict";

(function () {
  var form = document.getElementById("emotion-form");
  var input = document.getElementById("emotion-input");
  var resultSection = document.getElementById("result");
  var errorMessage = document.getElementById("error-message");
  var image = document.getElementById("card-image");
  var missingCard = document.getElementById("missing-card");
  var stepUpButton = document.getElementById("step-up");
  var stepDownButton = document.getElementById("step-down");
  var detailsPanel = document.querySelector(".details");

  var MIN_EMOTION = -6;
  var MAX_EMOTION = 6;
  var EMOTION_STEP = 0.01;

  var repeatDelayTimer = null;
  var repeatTimer = null;

  function requiredElement(element, name) {
    if (!element) {
      throw new Error("Missing required page element: " + name);
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
  requiredElement(detailsPanel, "details");

  if (!window.FlowerCardSelector) {
    errorMessage.textContent = "花卡選擇程式無法載入，請重新整理頁面。";
    return;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }

  function changeEmotion(amount) {
    var value = Number(input.value);

    if (!isFiniteNumber(value)) {
      value = 0;
    }

    value = roundToTwoDecimals(value + amount);
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
      }, 85);
    }, 500);
  }

  function keyboardClick(event, amount) {
    var detail = event && typeof event.detail !== "undefined"
      ? event.detail
      : 0;

    if (detail === 0) {
      changeEmotion(amount);
    }
  }

  function connectStepButton(button, amount) {
    if (window.PointerEvent) {
      button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        startRepeating(amount);
      });

      button.addEventListener("pointerup", stopRepeating);
      button.addEventListener("pointercancel", stopRepeating);
      button.addEventListener("pointerleave", stopRepeating);
    } else {
      button.addEventListener("touchstart", function (event) {
        event.preventDefault();
        startRepeating(amount);
      });

      button.addEventListener("touchend", function (event) {
        event.preventDefault();
        stopRepeating();
      });

      button.addEventListener("touchcancel", stopRepeating);

      button.addEventListener("mousedown", function (event) {
        event.preventDefault();
        startRepeating(amount);
      });

      button.addEventListener("mouseup", stopRepeating);
      button.addEventListener("mouseleave", stopRepeating);
    }

    button.addEventListener("click", function (event) {
      keyboardClick(event, amount);
    });

    button.addEventListener("blur", stopRepeating);
  }

  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function showMissingCard(selected) {
    var firstLine = document.createTextNode(
      "已選到 " + selected.fileName + "，但找不到圖片。"
    );
    var secondLine = document.createTextNode("請確認圖片位於：");
    var pathCode = document.createElement("code");

    pathCode.textContent = selected.cardPath;

    clearElement(missingCard);
    missingCard.appendChild(firstLine);
    missingCard.appendChild(document.createElement("br"));
    missingCard.appendChild(secondLine);
    missingCard.appendChild(document.createElement("br"));
    missingCard.appendChild(pathCode);

    image.hidden = true;
    missingCard.hidden = false;
  }

  function hasClass(element, className) {
    return new RegExp("(^|\\s)" + className + "(\\s|$)").test(
      element.className
    );
  }

  function addClass(element, className) {
    if (!hasClass(element, className)) {
      element.className =
        element.className === ""
          ? className
          : element.className + " " + className;
    }
  }

  function removeClass(element, className) {
    var pattern = new RegExp("(^|\\s)" + className + "(?=\\s|$)", "g");
    element.className = element.className
      .replace(pattern, " ")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s{2,}/g, " ");
  }

  function requestFrame(callback) {
    var frame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

    if (frame) {
      frame.call(window, callback);
    } else {
      setTimeout(callback, 16);
    }
  }

  function emphasizeUpdatedResult() {
    removeClass(detailsPanel, "result-updated");

    requestFrame(function () {
      addClass(detailsPanel, "result-updated");
    });
  }

  function displayCard(rawEmotion) {
    errorMessage.textContent = "";

    try {
      var selected =
        window.FlowerCardSelector.selectFlowerCard(rawEmotion);

      document.getElementById("emotion-value").textContent =
        selected.emotion.toFixed(2);
      document.getElementById("emotion-level").textContent =
        selected.level > 0 ? "+" + selected.level : String(selected.level);
      document.getElementById("emotion-range").textContent = selected.range;
      document.getElementById("stage-title").textContent =
        "第 " + selected.stage + " 張｜" + selected.stageName;
      document.getElementById("card-file").textContent = selected.fileName;
      document.getElementById("card-path").textContent = selected.cardPath;

      image.hidden = false;
      missingCard.hidden = true;
      image.alt =
        "情緒 " +
        selected.emotion.toFixed(2) +
        " 的" +
        selected.stageName +
        "花卡";

      image.onload = function () {
        image.hidden = false;
        missingCard.hidden = true;
      };

      image.onerror = function () {
        showMissingCard(selected);
      };

      image.src = selected.cardPath;
      resultSection.hidden = false;
      emphasizeUpdatedResult();
    } catch (error) {
      resultSection.hidden = true;
      errorMessage.textContent =
        error && error.message ? error.message : "無法處理情緒數值。";
    }
  }

  connectStepButton(stepUpButton, EMOTION_STEP);
  connectStepButton(stepDownButton, -EMOTION_STEP);

  if (window.PointerEvent) {
    document.addEventListener("pointerup", stopRepeating);
    document.addEventListener("pointercancel", stopRepeating);
  } else {
    document.addEventListener("touchend", stopRepeating);
    document.addEventListener("touchcancel", stopRepeating);
    document.addEventListener("mouseup", stopRepeating);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var value = Number(input.value);

    if (!isFiniteNumber(value)) {
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
