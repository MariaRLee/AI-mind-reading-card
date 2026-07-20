"use strict";

const assert = require("node:assert/strict");
const { selectFlowerCard } = require("./selector.js");

const cases = [
  [-6.20, -6, 1, "cards/negative/6-1.png"],
  [-6.25, -6, 1, "cards/negative/6-1.png"],
  [-6.26, -6, 2, "cards/negative/6-2.png"],
  [-6.50, -6, 2, "cards/negative/6-2.png"],
  [-6.51, -6, 3, "cards/negative/6-3.png"],
  [-6.75, -6, 3, "cards/negative/6-3.png"],
  [-6.76, -6, 4, "cards/negative/6-4.png"],
  [-6.99, -6, 4, "cards/negative/6-4.png"],
  [-5.40, -5, 2, "cards/negative/5-2.png"],
  [3.51, 3, 3, "cards/positive/3-3.png"],
  [0.20, 0, 1, "cards/neutral/0-1.png"]
];

for (const [input, expectedLevel, expectedStage, expectedPath] of cases) {
  const actual = selectFlowerCard(input);
  assert.equal(actual.level, expectedLevel, `level for ${input}`);
  assert.equal(actual.stage, expectedStage, `stage for ${input}`);
  assert.equal(actual.cardPath, expectedPath, `path for ${input}`);
}

assert.throws(() => selectFlowerCard(-7), /介於/);
assert.throws(() => selectFlowerCard(""), /請輸入/);
assert.throws(() => selectFlowerCard("abc"), /有效的數字/);

console.log(`All ${cases.length + 3} checks passed.`);
