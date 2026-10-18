console.info("pages/demo_domRender/demo_domRender onInit");

const estFrameTime = Math.round(1000 / 30);

const stackWidth = $app.getImports().uiSizes.uiWidth;
const stackHeight = 180;

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    stackVisible: true,

    elements: [],
    divElements: [],
    imageElements: [],

    isRunning: false,
    animationInterval: null,
    frameRotation: 0,

    currentFps: "--",
    frameTimes: [],
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
    this.stopAnimation();
  },

  addElements(count, type) {
    // 使用画布常量计算中心点位置
    const centerX = stackWidth / 2;
    const centerY = stackHeight / 2;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const scaleFactor = 12; // 增加间距因子，从8改为12

    // 获取当前元素数量，作为新元素的起始索引
    const currentCount = this.elements.length;

    for (let i = 0; i < count; i++) {
      // 计算新元素的索引（从当前数量开始）
      const index = currentCount + i;
      const radius = scaleFactor * Math.sqrt(index);
      const angle = index * goldenAngle;

      const element = {
        type: type,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        baseX: centerX + radius * Math.cos(angle),
        baseY: centerY + radius * Math.sin(angle),
        angle: angle,
        radius: radius,
        vx: 0,
        vy: 0,
      };
      this.elements.push(element);
      if (type === "div") this.divElements.push(element);
      if (type === "image") this.imageElements.push(element);
    }
  },

  clearElements() {
    this.stopAnimation();
    this.elements = [];
    this.divElements = [];
    this.imageElements = [];
  },

  startAnimation() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentFps = "--";
    this.frameTimes = [];
    this.frameRotation = 0;

    // 使用画布常量计算并固定中心点位置，避免运行时漂移
    const centerX = stackWidth / 2;
    const centerY = stackHeight / 2;

    const animate = () => {
      if (!this.isRunning) return;

      const timestamp = Date.now();
      const frameTimes = this.frameTimes;
      if (frameTimes.length === 15) frameTimes.shift();
      frameTimes.push(timestamp);

      // 更新元素位置，让它们绕中心点旋转
      const rotationSpeed = 0.1; // 旋转速度
      this.frameRotation += rotationSpeed;
      const cos = Math.cos(this.frameRotation);
      const sin = Math.sin(this.frameRotation);

      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i];

        // 相对于初始位置的偏移
        const offsetX = element.baseX - centerX;
        const offsetY = element.baseY - centerY;

        // 应用当前帧旋转
        element.x = centerX + offsetX * cos - offsetY * sin;
        element.y = centerY + offsetX * sin + offsetY * cos;
      }

      // 最近15帧中，取1秒内最早一帧到当前帧的间隔计算平均帧率。
      let first = 0;
      while (first < frameTimes.length - 1 && timestamp - frameTimes[first] > 1000) first++;
      const count = frameTimes.length - first;
      const elapsed = timestamp - frameTimes[first];
      this.currentFps = count > 1 && elapsed > 0
        ? ((count - 1) * 1000 / elapsed).toFixed(2)
        : "--";

      // 使用setTimeout模拟requestAnimationFrame，约60fps
      this.animationInterval = setTimeout(animate, estFrameTime);
    };

    // 启动动画循环
    this.animationInterval = setTimeout(animate, estFrameTime);
  },

  stopAnimation() {
    this.isRunning = false;
    if (this.animationInterval) {
      clearTimeout(this.animationInterval);
      this.animationInterval = null;
    }
    this.currentFps = "--";
    this.frameTimes = [];
    this.frameRotation = 0;
  },

  hideElements() {
    this.stackVisible = false;
  },

  showElements() {
    this.stackVisible = true;
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

};