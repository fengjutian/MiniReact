// mini-cssinjs.js

// 简单 hash，用于生成唯一 className / animationName
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return "c" + Math.abs(h).toString(36);
}

// 获取或创建 <style>
function getStyleEl() {
  let styleEl = document.querySelector("style[data-css-in-js]");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-css-in-js", "true");
    document.head.appendChild(styleEl);
  }
  return styleEl;
}

// 定义普通样式，返回 className
export function css(strings, ...values) {
  let styleText = "";
  strings.forEach((s, i) => {
    styleText += s + (values[i] ?? "");
  });

  const className = simpleHash(styleText);
  const finalCss = styleText.replace(/&/g, "." + className);

  const styleEl = getStyleEl();
  if (!styleEl.innerHTML.includes(className)) {
    styleEl.innerHTML += `.${className}{${finalCss}}\n`;
  }

  return className;
}

// 定义 keyframes 动画，返回 animationName
export function keyframes(strings, ...values) {
  let animText = "";
  strings.forEach((s, i) => {
    animText += s + (values[i] ?? "");
  });

  const animName = "k" + simpleHash(animText);
  const styleEl = getStyleEl();
  if (!styleEl.innerHTML.includes(animName)) {
    styleEl.innerHTML += `@keyframes ${animName}{${animText}}\n`;
  }

  return animName;
}
