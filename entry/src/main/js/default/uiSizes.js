/* version 20261122 */

console.info("uiSizes.js onImport");

let deviceInfo = {};
let uiSize;

const _this = {
  screenWidth: undefined,
  screenHeight: undefined,
  isCircle: undefined,
  uiWidth: undefined,
  uiHeight: undefined,
  topMargin: undefined,
  leftMargin: undefined,
  init: onDone => {
    if (uiSize) return onDone();

    $app.getImports().device.getInfo({
      success: data => {
        deviceInfo = data;
      },
      complete: () => {
        _this.screenWidth = deviceInfo.windowWidth;
        _this.screenHeight = deviceInfo.windowHeight;
        // 预览器的 screenShape 会错报成方形，靠宽高兜底成圆屏。
        _this.isCircle = deviceInfo.screenShape === "circle" || _this.screenWidth === _this.screenHeight;
        uiSize = getUiSize(_this.screenWidth, _this.screenHeight);
        _this.uiWidth = uiSize[0];
        _this.uiHeight = uiSize[1];
        _this.topMargin = (_this.screenHeight - _this.uiHeight) / 2;
        _this.leftMargin = (_this.screenWidth - _this.uiWidth) / 2;
        return onDone();
      },
    });
  },
}

function getUiSize(w, h) {
  const isCircle = _this.isCircle;

  let uiWidth;
  let uiHeight;

  if (isCircle) { // circle

    if (w < 454) uiWidth = 276;
    else uiWidth = w / 454 * 306;

    if (h < 454) uiHeight = 276;
    else uiHeight = h / 454 * 306;

  } else { // rect

    if (w < 336) uiWidth = 276;
    else if (w < 408) uiWidth = 336;
    else uiWidth = w - 408 + 336;

    if (h < 480) uiHeight = 360;
    else uiHeight = h - 480 + 396;

  }

  return [uiWidth, uiHeight];
}

export default _this;