import router from "../../router.js";

// import appName from "../../appName.js";
import bundleName from "../../bundleName.js";
// import headerBar from "../../headerBar.js";
import headerTimeBattery from "../../headerTimeBattery.js";
import memory from "../../memory.js";
import uiSizes from "../../uiSizes.js";
// import lookupDict from "../../lookupDictV5.js";

console.info("pages/index/index onInit");

const imports = {
  app: requireNative("system.app"),
  battery: requireNative("system.battery"),
  brightness: requireNative("system.brightness"),
  // configuration: requireNative("system.configuration"),
  device: requireNative("system.device"),
  fetch: requireNative("system.fetch"),
  file: requireNative("system.file"),
  // geolocation: requireNative("system.geolocation"),
  router: router, // requireNative("system.router"),
  // sensor: requireNative("system.sensor"),
  storage: requireNative("system.storage"),
  vibrator: requireNative("system.vibrator"),

  // appName: appName,
  bundleName: bundleName,
  // headerBar: headerBar,
  headerTimeBattery: headerTimeBattery,
  memory: memory,
  uiSizes: uiSizes,
  // lookupDict: lookupDict,
};

// 开屏图标浮出动画时长
const splashAnimDuration = 500;

// 消失分两段：先原地停 splashHoldDuration（什么都不做），再花 splashFadeDuration 淡出
const splashHoldDuration = 250;
const splashFadeDuration = 250;

// 开屏图标边长，居中坐标要按它算
const iconSize = 114;

export default {
  data: {
    iconAnimName: "splash-icon-hidden",
    importsLoaded: false,
    goTimer: null,
    // 开屏尺寸：等 onInit 里 getInfo 回来才有值，在那之前是 0，和"动画等 complete 才开始"同步
    screenWidth: 0,
    screenHeight: 0,
    // 图标不用 flex 居中的容器，直接按 top/left 摆在屏幕正中
    iconSize: iconSize,
    iconLeft: 0,
    iconTop: 0,
    // 动画时长跟着当前这段动画走：浮出 500ms、淡出 250ms
    iconAnimDuration: splashAnimDuration,
  },

  onInit() {
    $app.setImports(imports);

    requireNative("system.device").getInfo({
      success: data => {
        this.screenWidth = data.windowWidth;
        this.screenHeight = data.windowHeight;
        this.iconLeft = Math.round((data.windowWidth - iconSize) / 2);
        this.iconTop = Math.round((data.windowHeight - iconSize) / 2);
      },
      complete: () => {
        this.startSplash();
      },
    });
  },

  onShow() {
    initImports(() => {
      this.importsLoaded = true;
    });
  },

  onDestroy() {
    if (this.goTimer) {
      clearTimeout(this.goTimer);
      this.goTimer = null;
    }
  },

  // 起计时并触发浮出动画——Lite 没有 animationend 事件，只能按动画时长定时
  startSplash() {
    if (this.splashStarted) return;
    this.splashStarted = true;

    this.iconAnimName = "splash-icon-float-in";

    this.goTimer = setTimeout(() => {
      this.tryGoNext();
    }, splashAnimDuration);
  },

  // 动画播完且 js 库加载完成才跳转，缺一个就每 0.5 秒再看一次
  tryGoNext() {
    if (!this.importsLoaded) {
      this.goTimer = setTimeout(() => this.tryGoNext(), splashAnimDuration);
      return;
    }

    this.startExit();
  },

  // 消失分两段：先原地停 250ms，再淡出 250ms，淡出播完才跳转
  startExit() {
    if (this.exitStarted) return;
    this.exitStarted = true;

    // 第一段什么都不做：不切动画名，图标停在浮出动画的终态（原地、不透明）
    this.goTimer = setTimeout(() => {
      // 先切动画名再改时长：万一改时长会让动画重新开始，重来的也是淡出本身，不会退回浮出
      this.iconAnimName = "splash-icon-fade-out";
      this.iconAnimDuration = splashFadeDuration;

      this.goTimer = setTimeout(() => {
        if (true || $app.getImports().memory["privacyPolicyAccepted"]) {
          return router.replace({ uri: "pages/demo_index/demo_index", });
        } else {
          return router.replace({ uri: "pages/privacyPolicy/privacyPolicy" });
        }
      }, splashFadeDuration);
    }, splashHoldDuration);
  },
}

function initImports(onAllDone) {
  console.info("initImports");
  const imports = $app.getImports();
  const keys = Object.keys(imports);
  let idx = 0;

  function next() {
    if (idx >= keys.length) {
      console.info("all init done");
      onAllDone(imports);
      return;
    }

    const key = keys[idx++];
    console.info("init " + key);

    if (imports[key] && imports[key].init) {
      let done = false;

      const timer = setTimeout(() => {
        if (!done) {
          console.warn("init " + key + " timeout, skip");
          done = true;
          setTimeout(next, 0);
        }
      }, 3000);

      imports[key].init(() => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          console.info("init " + key + " done");
          setTimeout(next, 0);
        }
      });
    } else {
      console.info("init " + key + " not needed");
      setTimeout(next, 0);
    }
  }

  setTimeout(next, 0);
}