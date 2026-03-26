console.info("pages/demo_fileRead/demo_fileRead onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",


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

  onRotate(e) {
    console.info(JSON.stringify(e));
    this.rotateStatus = e.value;
    this.$refs.bindRotation.value = 0;
    this.$refs.bindRotation.progress = 0;
    e.value = 0;
    e.progress = 0;
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