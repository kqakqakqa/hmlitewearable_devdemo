console.info("pages/demo_onEvent/demo_onEvent onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    status: "",

    sliderValue: 0,

    rotateStatus: 0,
    swipeStatus: "",

    touchX: 0,
    touchY: 0,
    touchStatus: 0,
    touchSampleRate: "",
    touchMoveTimes: [],

    pinchX: 0,
    pinchY: 0,
    pinchStatus: 0,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  relPosX(globalX) {
    const offsetX = (this.uiSizes.screenWidth - 276) / 2;
    return globalX - offsetX;
  },

  relPosY(globalY) {
    const offsetY = this.uiSizes.topMargin + 120;
    return globalY - offsetY;
  },

  onRotate(e) {
    console.info(JSON.stringify(e));
    const value = e.value || e.progress || 0;

    this.sliderValue = NaN;
    this.sliderValue = 0;

    const step = value > 0 ? 1 : value < 0 ? -1 : 0;
    this.rotateStatus = step;
  },

  onClick(e) {
    console.info(JSON.stringify(e));
    this.status = "on:click";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;
  },

  onSwipe(e) {
    console.info(JSON.stringify(e));
    this.swipeStatus = { top: "up", bottom: "down" }[e.direction] || e.direction;
  },

  onDoubleClick(e) {
    console.info(JSON.stringify(e));
    this.status = "on:doubleclick";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;
  },

  onLongPress(e) {
    console.info(JSON.stringify(e));
    this.status = "on:longpress";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;
  },

  onLongPressRelease(e) {
    console.info(JSON.stringify(e));
    this.status = "on:longpressrelease";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = -1;
  },

  onTouchStart(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchstart";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;
    this.touchSampleRate = "";
    this.touchMoveTimes = [];
  },

  onTouchMove(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchmove";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;

    const now = Date.now();
    const times = this.touchMoveTimes;
    // 最近15次 touchmove 中，取1秒内最早一次到当前的间隔计算采样率。
    if (times.length === 15) times.shift();
    times.push(now);
    let first = 0;
    while (first < times.length - 1 && now - times[first] > 1000) first++;
    const count = times.length - first;
    const elapsed = now - times[first];
    this.touchSampleRate = count > 1 && elapsed > 0
      ? ((count - 1) * 1000 / elapsed).toFixed(1) + "Hz"
      : "";
  },

  onTouchEnd(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchend";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = -1;
    this.touchSampleRate = "";
    this.touchMoveTimes = [];
  },

  onTouchCancel(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchcancel";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = -1;
    this.touchMoveTimes = [];
  },

  onPinchStart(e) {
    console.info(JSON.stringify(e));
    this.status = "on:pinchstart";
    this.pinchX = this.relPosX(e.pinchCenterX);
    this.pinchY = this.relPosY(e.pinchCenterY);
    this.pinchStatus = 1;
  },

  onPinchUpdate(e) {
    console.info(JSON.stringify(e));
    this.pinchX = this.relPosX(e.pinchCenterX);
    this.status = "on:pinchupdate";
    this.pinchY = this.relPosY(e.pinchCenterY);
    this.pinchStatus = 1;
  },

  onPinchEnd(e) {
    console.info(JSON.stringify(e));
    this.status = "on:pinchend";
    this.pinchX = this.relPosX(e.pinchCenterX);
    this.pinchY = this.relPosY(e.pinchCenterY);
    this.pinchStatus = -1;
  },

  onPinchCancel(e) {
    console.info(JSON.stringify(e));
    this.status = "on:pinchcancel";
    this.pinchX = this.relPosX(e.pinchCenterX);
    this.pinchY = this.relPosY(e.pinchCenterY);
    this.pinchStatus = -1;
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}