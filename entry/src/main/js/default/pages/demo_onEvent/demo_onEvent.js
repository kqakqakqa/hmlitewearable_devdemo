console.info("pages/demo_onEvent/demo_onEvent onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    status: "",

    rotateStatus: 0,
    swipeStatus: "",

    touchX: 0,
    touchY: 0,
    touchStatus: 0,

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
    const offsetX = (this.uiSizes.screenWidth - 280) / 2;
    return globalX - offsetX;
  },

  relPosY(globalY) {
    const offsetY = this.uiSizes.topMargin + 120;
    return globalY - offsetY;
  },

  onRotate(e) {
    console.info(JSON.stringify(e));
    this.rotateStatus = e.value;
    this.$refs.bindRotation.value = 0;
    this.$refs.bindRotation.progress = 0;
    e.value = 0;
    e.progress = 0;
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
  },

  onTouchMove(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchmove";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = 1;
  },

  onTouchEnd(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchend";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = -1;
  },

  onTouchCancel(e) {
    console.info(JSON.stringify(e));
    this.status = "on:touchcancel";
    this.touchX = this.relPosX(e.globalX);
    this.touchY = this.relPosY(e.globalY);
    this.touchStatus = -1;
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
    $app.getImports().router.replace({
      uri: "/pages/devdemo_index/devdemo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}