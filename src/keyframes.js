/**
 * Built-in keyframes for j-animate-{name}-{duration} and j-animate-{name}-{duration}-s.
 * Only these names are supported; duration is generic (ms or seconds with -s).
 */
const KEYFRAMES_CSS = {
  fadein: `@keyframes j-fadein{from{opacity:0}to{opacity:1}}`,
  fadeout: `@keyframes j-fadeout{from{opacity:1}to{opacity:0}}`,
  spin: `@keyframes j-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`,
  pulse: `@keyframes j-pulse{0%,100%{opacity:1}50%{opacity:.5}}`,
  bounce: `@keyframes j-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)}}`,
  ping: `@keyframes j-ping{75%,100%{transform:scale(2);opacity:0}}`,
};

function getKeyframesCSS(usedNames) {
  const lines = [];
  for (const name of usedNames) {
    const css = KEYFRAMES_CSS[name];
    if (css) lines.push(css);
  }
  return lines.join("\n");
}

module.exports = { KEYFRAMES_CSS, getKeyframesCSS };
