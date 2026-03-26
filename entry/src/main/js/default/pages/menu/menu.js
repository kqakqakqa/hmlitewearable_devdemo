console.info("pages/menu/menu onInit");

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
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: true });
  },
  onHide() {
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: false });
  },
  pageTo(p) {
    $app.getImports().router.replace({
      uri: "pages/" + p + "/" + p,
    });
  },
  clickBack() {
    $app.getImports().router.replace({
      uri: "/pages/devdemo_index/devdemo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

  exitApp() {
    $app.getImports().app.terminate();
  },
}