console.info("pages/demo_sensorSubscribe/demo_sensorSubscribe onInit");

const sensor = requireNative("system.sensor");

const sensors_known = [
  { name: "accelerometer", subscribe: "subscribeAccelerometer", unsubscribe: "unsubscribeAccelerometer", label: "线性加速度", hasInterval: true },
  { name: "gyroscope", subscribe: "subscribeGyroscope", unsubscribe: "unsubscribeGyroscope", label: "旋转角速度", hasInterval: true },
  { name: "compass", subscribe: "subscribeCompass", unsubscribe: "unsubscribeCompass", label: "磁场", hasInterval: false },
  { name: "stepCounter", subscribe: "subscribeStepCounter", unsubscribe: "unsubscribeStepCounter", label: "计步", hasInterval: false },
  { name: "barometer", subscribe: "subscribeBarometer", unsubscribe: "unsubscribeBarometer", label: "气压", hasInterval: false },
  { name: "heartRate", subscribe: "subscribeHeartRate", unsubscribe: "unsubscribeHeartRate", label: "心率", hasInterval: false },
  { name: "onBodyState", subscribe: "subscribeOnBodyState", unsubscribe: "unsubscribeOnBodyState", label: "佩戴状态", hasInterval: false },
];

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    accelerometer: "",
    gyroscope: "",
    compass: "",
    stepCounter: "",
    barometer: "",
    heartRate: "",
    onBodyState: "",

    moreSensors: [],
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    console.log("=== sensor 对象可用函数 ===");
    const knownFnSet = {};
    for (let i = 0; i < sensors_known.length; i++) {
      knownFnSet[sensors_known[i].subscribe] = true;
      knownFnSet[sensors_known[i].unsubscribe] = true;
    }

    const moreList = [];
    for (let key in sensor) {
      console.log("  " + key + ": " + typeof sensor[key]);
      if (typeof sensor[key] === "function" && !knownFnSet[key]) {
        moreList.push(key);
      }
    }
    console.log("============================");
    this.moreSensors = moreList;

    this.subscribeAll();
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  onDestroy() {
    console.log("onDestroy: unsubscribing all sensors");
    this.unsubscribeAll();
  },

  subscribeAll() {
    for (let i = 0; i < sensors_known.length; i++) {
      const s = sensors_known[i];
      if (typeof sensor[s.subscribe] !== "function") {
        this[s.name] = "不可用";
        console.log(s.subscribe + " not available");
        continue;
      }
      try {
        const opts = {
          success: (ret) => {
            this[s.name] = JSON.stringify(ret);
          },
          fail: (data, code) => {
            console.error(s.name + " fail: " + code + " " + data);
          },
        };
        if (s.hasInterval) {
          opts.interval = "normal";
        }
        sensor[s.subscribe](opts);
        console.log(s.subscribe + " subscribed");
      } catch (e) {
        console.error(s.subscribe + " exception: " + e);
      }
    }
  },

  unsubscribeAll() {
    for (let i = 0; i < sensors_known.length; i++) {
      const s = sensors_known[i];
      try {
        if (typeof sensor[s.unsubscribe] === "function") {
          sensor[s.unsubscribe]();
          console.log(s.unsubscribe + " done");
        } else {
          console.log(s.unsubscribe + " not available");
        }
      } catch (e) {
        console.error(s.unsubscribe + " exception: " + e);
      }
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
