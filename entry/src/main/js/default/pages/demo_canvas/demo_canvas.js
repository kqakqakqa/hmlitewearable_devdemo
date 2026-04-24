console.info("pages/demo_canvas/demo_canvas onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",
    statusText: "准备就绪",
    canvasVisible: true,
    rectX: 50,
    rectY: 50,
    rectWidth: 100,
    rectHeight: 60,
    textX: 150,
    textY: 100,
    moveDirection: 1,
    animationId: null,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
    this.drawInitialCanvas();
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
    this.stopAnimation();
  },

  clickBack() {
    $app.getImports().router.replace({ uri: "pages/demo_index/demo_index" });
  },

  clickBtn(type) {
    console.info("Canvas Test Type: " + type);

    switch (type) {
      case "show":
        this.canvasVisible = true;
        this.statusText = "Canvas已显示";
        this.drawInitialCanvas();
        break;

      case "hide":
        this.canvasVisible = false;
        this.statusText = "Canvas已隐藏";
        break;

      case "rect":
        this.drawRectangle();
        this.statusText = "绘制矩形";
        break;

      case "text":
        this.drawText();
        this.statusText = "绘制文字";
        break;

      case "move":
        this.startMoving();
        this.statusText = "开始移动";
        break;

      case "clear":
        this.clearCanvas();
        this.statusText = "画布已清空";
        break;
    }
  },

  drawInitialCanvas() {
    if (!this.canvasVisible || !this.$refs.canvas) return;
    
    const ctx = this.$refs.canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    
    // 绘制初始矩形
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
    
    // 绘制初始文字
    ctx.fillStyle = '#4ecdc4';
    ctx.font = '24px sans-serif';
    ctx.fillText('Canvas测试', this.textX, this.textY);
  },

  drawRectangle() {
    if (!this.canvasVisible || !this.$refs.canvas) return;
    
    const ctx = this.$refs.canvas.getContext('2d');
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
  },

  drawText() {
    if (!this.canvasVisible || !this.$refs.canvas) return;
    
    const ctx = this.$refs.canvas.getContext('2d');
    ctx.fillStyle = '#4ecdc4';
    ctx.font = '24px sans-serif';
    ctx.fillText('Canvas测试', this.textX, this.textY);
  },

  startMoving() {
    this.stopAnimation();
    
    const move = () => {
      if (!this.canvasVisible || !this.$refs.canvas) return;
      
      const ctx = this.$refs.canvas.getContext('2d');
      
      // 清空画布
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      
      // 更新位置
      this.rectX += this.moveDirection * 2;
      this.textX += this.moveDirection * 2;
      
      // 边界检测
      if (this.rectX <= 0 || this.rectX + this.rectWidth >= this.$refs.canvas.width) {
        this.moveDirection *= -1;
      }
      
      // 绘制矩形
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
      
      // 绘制文字
      ctx.fillStyle = '#4ecdc4';
      ctx.font = '24px sans-serif';
      ctx.fillText('Canvas测试', this.textX, this.textY);
      
      this.animationId = requestAnimationFrame(move);
    };
    
    move();
  },

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  clearCanvas() {
    if (!this.canvasVisible || !this.$refs.canvas) return;
    
    const ctx = this.$refs.canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
  }
};