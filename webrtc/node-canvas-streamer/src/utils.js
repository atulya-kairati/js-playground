function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return rgbToHex(r, g, b);
}

function polarToCartesian(r, theta) {
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  return [x, y];
}

module.exports = {
  randomColor,
  polarToCartesian,
};
