console.info("pages/demo_deviceInfo/demo_deviceInfo onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    brand: "未知",
    manufacturer: "未知",
    model: "未知",
    product: "未知",
    language: "未知",
    region: "未知",
    windowWidth: "未知",
    windowHeight: "未知",
    screenDensity: "未知",
    screenShape: "未知",
    apiVersion: "未知",
    deviceType: "未知",
    wearEngineVersion: "未知",
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    this.getDeviceInfo();
    this.getWearEngineVersion();
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  getDeviceInfo() {
    $app.getImports().device.getInfo({
      success: data => {
        this.brand = data.brand;
        this.manufacturer = data.manufacturer;
        this.model = data.model;
        this.product = data.product;
        this.language = data.language;
        this.region = data.region;
        this.windowWidth = data.windowWidth;
        this.windowHeight = data.windowHeight;
        this.screenDensity = data.screenDensity;
        this.screenShape = data.screenShape;
        this.apiVersion = data.apiVersion;
        this.deviceType = data.deviceType;
      }
    });
  },

  getWearEngineVersion() {
    try {
      $app.getImports().wearengine.getWearEngineVersion({
        complete: data => {
          if (data) {
            this.wearEngineVersion = data;
            console.info("wearEngine version: " + data);
          } else {
            this.wearEngineVersion = "获取失败";
            console.info("get wearEngine version fail");
          }
        },
        sdkVersion: "3"
      });
    } catch (error) {
      this.wearEngineVersion = "不支持";
      console.info("wearEngine version is too low: " + error.message);
    }
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

  clickBack() {
    $app.getImports().router.back();
  },

  exitApp() {
    $app.getImports().app.terminate();
  },

}
