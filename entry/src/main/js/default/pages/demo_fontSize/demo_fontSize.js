console.info("pages/demo_fontSize/demo_fontSize onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    sliderValue: 0,
    fontSize: 30,
    refreshText: true,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    this.changeFontSize(0);
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  onRotate(e) {
    console.info(JSON.stringify(e));
    const value = e.value || e.progress || 0;

    this.sliderValue = NaN;
    this.sliderValue = 0;

    const step = value > 0 ? 1 : value < 0 ? -1 : 0;
    this.changeFontSize(step);
  },

  changeFontSize(v) {
    this.fontSize = Math.min(Math.max(this.fontSize + v, 0), 120);
    this.refreshText = false;
    setTimeout(() => { this.refreshText = true }, 0);
  },

  clickBack() {
    $app.getImports().router.replace({
      uri: "/pages/demo_index/demo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}