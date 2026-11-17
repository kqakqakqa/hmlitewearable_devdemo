console.info("pages/demo_eventFlow/demo_eventFlow onInit");

// 同一次点击里，子元素和父元素的回调会连着触发；200ms 内到达的都算同一次点击，
// 超过就认为用户开始了新的一次点击（所以两次点击间隔最好别短于 200ms）。
const sameTapWindow = 200;

// 命中链在最后一次回调之后保留多久（毫秒），到点变回「点一下」
const hitResetDelay = 2000;

// 每个场景一段描述。元素里面不写字，靠颜色和位置对照这里的说明；
// Lite 的 text 不会自动折行（超宽直接截断），所以文案在这里按行拆好，一行最多约 8 个中文字。
// 元素编号按树形写：嵌套的子元素是 a.b.c（a=场景号，b=外层元素），并列的兄弟元素是 a.b / a.c，层级一眼能看出来。
// 描述用带缩进符号的树，顺序和 playground 里的摆放顺序一致；同一页里颜色固定：红=on 蓝=grab 黄=无事件。
const scenes = [
  {
    desc: [
      "1.1 父 on",
      "├1.1.1 红 on",
      "├1.1.2 蓝 grab",
      "└1.1.3 黄 无",
    ],
  },
  {
    desc: [
      "2.1 父 grab",
      "├2.1.1 红 on",
      "├2.1.2 蓝 grab",
      "└2.1.3 黄 无",
    ],
  },
  {
    desc: [
      "3.1 父 无",
      "├3.1.1 红 on",
      "├3.1.2 蓝 grab",
      "└3.1.3 黄 无",
    ],
  },
  {
    desc: [
      "4.1 下层 on",
      "4.2 红 on",
      "4.3 蓝 grab",
      "4.4 黄 无",
    ],
  },
  {
    desc: [
      "5.1 下层 grab",
      "5.2 红 on",
      "5.3 蓝 grab",
      "5.4 黄 无",
    ],
  },
  {
    desc: [
      "6.1 下层 无",
      "6.2 红 on",
      "6.3 蓝 grab",
      "6.4 黄 无",
    ],
  },
  {
    desc: [
      "7.1 底板 on",
      "├7.1.1 实心 on",
      "├7.1.2 边框 on",
      "└7.1.3 隐形 on",
    ],
  },
  {
    desc: [
      "8.1 底板 on",
      "├8.1.1 实心 grab",
      "├8.1.2 边框 grab",
      "└8.1.3 隐形 grab",
    ],
  },
  {
    desc: [
      "9.1 底板 on",
      "├9.1.1 实心 无",
      "├9.1.2 边框 无",
      "└9.1.3 隐形 无",
    ],
  },
];

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    // 描述区：切场景时整块换掉，行数不同高度也不同
    descLines: 0,
    descHeight: 0,
    desc0: "",
    desc1: "",
    desc2: "",
    desc3: "",
    desc4: "",
    desc5: "",

    // 当前是第几个场景（swiper 的页号）
    scene: 0,

    // 命中链：按回调触发顺序记录被点到的元素编号，用 > 连接。
    // 比如 "1C1>1P" 表示先触发子元素再触发父元素；只有一个编号表示没往上冒泡。
    hits: "",
    lastHitAt: 0,
    hitTimer: null,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    this.showScene(0);
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  // 页面不在前台了就把复位定时器清掉，免得它落到别的页面上
  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
    this.clearHitTimer();
  },

  onDestroy() {
    this.clearHitTimer();
  },

  // 把第 i 个场景的描述贴到 data 上，同时清掉上一个场景的命中链
  showScene(i) {
    const lines = scenes[i].desc;

    this.scene = i;
    this.descLines = lines.length;
    // text-30px 一行 38px，描述区高度按行数算
    this.descHeight = lines.length * 38;
    this.desc0 = lines[0];
    this.desc1 = lines[1] || "";
    this.desc2 = lines[2] || "";
    this.desc3 = lines[3] || "";
    this.desc4 = lines[4] || "";
    this.desc5 = lines[5] || "";

    this.clearHit();
  },

  // 所有测试元素都回调到这里，id 就是描述里写的元素编号
  hit(id) {
    console.info("[eventFlow] hit " + id);

    const now = Date.now();
    this.hits = now - this.lastHitAt > sameTapWindow ? id : this.hits + ">" + id;
    this.lastHitAt = now;

    // 2 秒内没有新的命中就变回「点一下」
    this.clearHitTimer();
    this.hitTimer = setTimeout(() => {
      this.hits = "";
      this.hitTimer = null;
    }, hitResetDelay);
  },

  clearHit() {
    this.clearHitTimer();
    this.hits = "";
    this.lastHitAt = 0;
  },

  clearHitTimer() {
    if (!this.hitTimer) return;

    clearTimeout(this.hitTimer);
    this.hitTimer = null;
  },

  // swiper 换页：优先用回参里的 index；万一回参没带 index，就自己往后数一格（真机字段待确认）
  onSceneChange(e) {
    console.info("[eventFlow] scene " + JSON.stringify(e));

    const index = typeof e.index === "number" ? e.index : (this.scene + 1) % scenes.length;
    this.showScene(index);
  },

  // playground 上的滑动就地接住：里面靠 swiper 切场景，这一层只负责不让滑动继续往上冒泡到页面
  onPlaygroundSwipe() {
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}
