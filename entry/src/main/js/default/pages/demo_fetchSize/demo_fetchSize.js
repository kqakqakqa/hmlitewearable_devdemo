console.info("pages/demo_fetch/demo_fetch onInit");

const maxTrial = 3;

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    model: "未知",
    fetchSize: "未知",
    msg: "",

    isTesting: false,
    isStopping: false,

    retryCount: 0,

    low: 0,
    high: -1,
    currentTest: 1,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: true,
    });

    $app.getImports().storage.get({
      key: "fetchSize",
      default: "未知",
      success: v => {
        this.fetchSize = v;
      },
    });

    $app.getImports().device.getInfo({
      success: d => {
        this.model = d.model || d.product || d.brand;
      },
    });
  },

  onDestroy() {
    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: false,
    });

    this.stopTest();
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: true,
    });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: false,
    });

    this.stopTest();
  },

  stopTest() {
    this.isStopping = true;
    this.isTesting = false;
  },

  clickTest() {
    if (this.isTesting) return this.stopTest();
    if (!$app.getImports().fetch) return this.msg = "设备不支持fetch"

    this.isStopping = false;
    this.isTesting = true;

    this.retryCount = 0;

    this.currentTest = 1;
    this.low = 0;
    this.high = -1;

    this.tryFetch();
  },

  tryFetch() {
    if (this.isStopping) return;

    this.msg = (this.retryCount > 0 ? ("重试×" + (this.retryCount) + "：") : "测试：") + this.currentTest + "字节";

    $app.getImports().fetch.fetch({
      url: "https://httpbin.org/bytes/" + this.currentTest,
      method: "GET",
      responseType: "text",
      fail: (data, code) => {
        if (this.isStopping) return;

        if (code === -76 || data === "WebClient common error") {
          this.retryCount = 0;
          this.high = this.currentTest - 1;
          setTimeout(() => this.nextBinaryStep(), 0);
          return;
        }

        if (++this.retryCount < maxTrial) {
          setTimeout(this.tryFetch, 500);
          return;
        }

        return this.msg = "fetch失败：" + code + " " + data;
      },
      success: () => {
        if (this.isStopping) return;

        this.retryCount = 0;

        if (this.high === -1) {
          this.low = this.currentTest;
          this.currentTest *= 2;
          setTimeout(this.tryFetch, 0);

        } else {
          this.low = this.currentTest + 1;
          setTimeout(this.nextBinaryStep, 0);

        }
      },
    });
  },

  nextBinaryStep() {
    if (this.isStopping) return;

    if (this.low <= this.high) {
      this.currentTest = Math.floor((this.low + this.high) / 2);
      this.tryFetch();
    } else {
      this.isTesting = false;
      this.msg = "测试完成";

      this.fetchSize = this.low;

      $app.getImports().storage.set({
        key: "fetchSize",
        value: "" + this.fetchSize,
      });
    }
  },

  clickBack() {
    $app.getImports().router.replace({
      uri: "pages/demo_index/demo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}