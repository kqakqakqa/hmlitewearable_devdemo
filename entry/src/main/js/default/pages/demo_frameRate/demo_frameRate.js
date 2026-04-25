console.info("pages/demo_frameRate/demo_frameRate onInit");

const estFrameTime = Math.round(1000 / 30);

const stackWidth = 276;
const stackHeight = 180;

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    elements: [],

    isRunning: false,
    animationInterval: null,

    currentFps: "--",
    lastFrameTime: 0,
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

  clickBack() {
    $app.getImports().router.replace({ uri: "pages/demo_index/demo_index" });
  },

  addElements(count) {
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

      this.elements.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        baseX: centerX + radius * Math.cos(angle),
        baseY: centerY + radius * Math.sin(angle),
        angle: angle,
        radius: radius,
        rotationAngle: 0,
        vx: 0,
        vy: 0,
      });
    }
  },

  clearElements() {
    this.stopAnimation();
    this.elements = [];
  },

  startAnimation() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = Date.now();

    // 使用画布常量计算并固定中心点位置，避免运行时漂移
    const centerX = stackWidth / 2;
    const centerY = stackHeight / 2;

    const animate = () => {
      if (!this.isRunning) return;

      const timestamp = Date.now();

      // 更新元素位置，让它们绕中心点旋转
      const rotationSpeed = 0.02; // 旋转速度

      for (let i = 0; i < this.elements.length; i++) {
        let element = this.elements[i];

        // 更新旋转角度
        element.rotationAngle += rotationSpeed;

        // 计算旋转后的位置
        const cos = Math.cos(element.rotationAngle);
        const sin = Math.sin(element.rotationAngle);

        // 相对于中心点的偏移
        const offsetX = element.baseX - centerX;
        const offsetY = element.baseY - centerY;

        // 应用旋转
        element.x = centerX + offsetX * cos - offsetY * sin;
        element.y = centerY + offsetX * sin + offsetY * cos;
      }

      // 计算瞬时帧率（每帧计算）
      const actualFrameTime = timestamp - this.lastFrameTime;
      if (actualFrameTime > 0) {
        this.currentFps = (1000 / actualFrameTime).toFixed(2);
      }
      this.lastFrameTime = timestamp;

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
  },

  swipeBack(d) {
    if (d.direction === "right") {
      $app.getImports().router.replace({ uri: "pages/demo_index/demo_index" });
    }
  }
};