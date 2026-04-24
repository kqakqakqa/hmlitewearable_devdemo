console.info("pages/demo_frameRate/demo_frameRate onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",
    elementCount: 100,
    elements: [],
    currentFps: 0,
    isRunning: false,
    animationId: null,
    lastTime: 0,
    frameCount: 0,
    fpsUpdateTime: 0,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });
    
    this.initializeElements();
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

  changeElementCount(e) {
    this.elementCount = parseInt(e.value) || 100;
    this.initializeElements();
  },

  initializeElements() {
    this.elements = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
    
    for (let i = 0; i < this.elementCount; i++) {
      this.elements.push({
        x: Math.random() * (this.uiSizes.uiWidth - 20),
        y: Math.random() * 160,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: colors[i % colors.length]
      });
    }
  },

  clickBtn(type) {
    console.info("Frame Rate Test Type: " + type);

    switch (type) {
      case "start":
        this.startAnimation();
        break;

      case "stop":
        this.stopAnimation();
        break;

      case "reset":
        this.stopAnimation();
        this.initializeElements();
        this.currentFps = 0;
        break;

      case "add10":
        this.addElements(10);
        break;

      case "add100":
        this.addElements(100);
        break;

      case "add1000":
        this.addElements(1000);
        break;
    }
  },

  addElements(count) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
    
    for (let i = 0; i < count; i++) {
      this.elements.push({
        x: Math.random() * (this.uiSizes.uiWidth - 20),
        y: Math.random() * 160,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    this.elementCount = this.elements.length;
  },

  startAnimation() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateTime = this.lastTime;
    
    const animate = (timestamp) => {
      if (!this.isRunning) return;
      
      // 更新元素位置
      for (let element of this.elements) {
        element.x += element.vx;
        element.y += element.vy;
        
        // 边界反弹
        if (element.x <= 0 || element.x >= this.uiSizes.uiWidth - 20) {
          element.vx *= -1;
        }
        if (element.y <= 0 || element.y >= 160) {
          element.vy *= -1;
        }
      }
      
      // 更新帧率
      this.frameCount++;
      if (timestamp - this.fpsUpdateTime >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.fpsUpdateTime = timestamp;
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  },

  stopAnimation() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
};