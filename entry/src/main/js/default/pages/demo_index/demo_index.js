console.info("pages/demo_index/demo_index onInit");

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
  clickCard(v) {
    $app.getImports().router.replace({
      uri: "pages/" + v + "/" + v,
    });
  },

  swipeBack(data) {
    if (data.direction === "right") return this.exitApp();
  },

  exitApp() {
    $app.getImports().app.terminate();
  },

  nullFn: void 0,
}