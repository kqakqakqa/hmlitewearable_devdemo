console.info("pages/demo_hmlFor/demo_hmlFor onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    model: "未知",
    jsHeap: "未知",
    doTest: false,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    $app.getImports().storage.get({
      key: "doTest",
      default: "",
      success: v => {
        this.doTest = v === "1";
      },
    });

    $app.getImports().storage.get({
      key: "jsHeap",
      default: "未知",
      success: v => {
        this.jsHeap = v;
      },
    });

    $app.getImports().device.getInfo({
      success: d => {
        this.model = d.model || d.product || d.brand;
      },
    });
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  clickBtn() {
    this.doTest = !this.doTest;
    $app.getImports().storage.set({
      key: "doTest",
      value: this.doTest ? "1" : "",
    });
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