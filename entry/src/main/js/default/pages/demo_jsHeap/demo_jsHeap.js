console.info("pages/demo_hmlFor/demo_hmlFor onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    jsHeap: "-",
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
      default: "-",
      success: v => {
        this.jsHeap = v || "-";
      },
    });
  },

  onShow() {
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: false });
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
      uri: "/pages/devdemo_index/devdemo_index",
    });
  },
}

function getRnd() {
  return Math.floor(Math.random() * 10);
}