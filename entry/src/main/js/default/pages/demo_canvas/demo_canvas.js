console.info("pages/demo_canvas/demo_canvas onInit");

const canvasWidth = $app.getImports().uiSizes.uiWidth;
const canvasHeight = 180;
const canvasBackground = "#222";

let ctx;

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    canvasVisible: true,

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

    this.showCanvas();
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });

    this.stopAnimation();
  },

  showCanvas() {
    this.canvasVisible = true;

    setTimeout(() => ctx = this.$refs.canvas.getContext("2d"), 50);
  },

  hideCanvas() {
    this.canvasVisible = false;
  },

  startMoving() {
    this.stopAnimation();

    let rectX = canvasWidth * 0.2;
    let rectY = canvasHeight * 0.3;
    const rectWidth = 24;
    const rectHeight = 24;
    let textX = canvasWidth * 0.6;
    const textY = canvasHeight * 0.55;
    let moveDirection = 1;

    const move = () => {
      if (!this.canvasVisible || !this.$refs.canvas) return;

      // 清空画布
      ctx.fillStyle = canvasBackground;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 更新位置
      rectX += moveDirection * 2;
      textX += moveDirection * 2;

      // 边界检测
      if (rectX <= 0 || rectX + rectWidth >= canvasWidth) {
        moveDirection *= -1;
      }

      // 绘制矩形
      ctx.fillStyle = "#ff6b6b";
      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

      // 绘制文字
      ctx.fillStyle = "#4ecdc4";
      ctx.font = "24px sans-serif";
      ctx.fillText("canvas", textX, textY);

      this.animationId = setTimeout(move, Math.round(1000 / 30));
    };

    move();
  },

  stopAnimation() {
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  },

  clearCanvas() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.fillStyle = canvasBackground;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  },

  // 测试fillRect方法
  testFillRect() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.fillStyle = "#33ff6b6b";
    ctx.fillRect(50, 50, 100, 80);
  },

  // 测试strokeRect方法
  testStrokeRect() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 50, 100, 80);
  },

  // 测试fillText方法
  testFillText() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.fillStyle = "#4ecdc4";
    ctx.font = "30px sans-serif";
    ctx.fillText("canvas测试", 50, 100);
  },

  // 测试lineWidth属性
  testLineWidth() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.strokeStyle = "#ff6b6b";
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, 100, 80);
  },

  // 测试strokeStyle属性
  testStrokeStyle() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#77ddff";
    ctx.strokeRect(50, 50, 100, 80);
  },

  // 测试stroke方法
  testStroke() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(100, 130);
    ctx.closePath();
    ctx.strokeStyle = "#ff6b6b";
    ctx.stroke();
  },

  // 测试beginPath方法
  testBeginPath() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#0000ff";
    ctx.moveTo(50, 80);
    ctx.lineTo(250, 80);
    ctx.stroke();
  },

  // 测试moveTo方法
  testMoveTo() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(250, 130);
    ctx.strokeStyle = "#4ecdc4";
    ctx.stroke();
  },

  // 测试lineTo方法
  testLineTo() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(250, 130);
    ctx.strokeStyle = "#ff6b6b";
    ctx.stroke();
  },

  // 测试closePath方法
  testClosePath() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(100, 130);
    ctx.closePath();
    ctx.strokeStyle = "#4ecdc4";
    ctx.stroke();
  },

  // 测试font属性
  testFont() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#ff6b6b";
    ctx.fillText("字体测试", 50, 100);
  },

  // 测试textAlign属性
  testTextAlign() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.strokeStyle = "#dd66ff";
    ctx.beginPath();
    ctx.moveTo(140, 10);
    ctx.lineTo(140, 160);
    ctx.stroke();

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#ff6b6b";

    ctx.textAlign = "left";
    ctx.fillText("textAlign=left", 140, 100);

    ctx.textAlign = "center";
    ctx.fillText("textAlign=center", 140, 120);

    ctx.textAlign = "right";
    ctx.fillText("textAlign=right", 140, 140);
  },

  // 测试arc方法
  testArc() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 6.28);
    ctx.strokeStyle = "#ff6b6b";
    ctx.stroke();
  },

  // 测试rect方法
  testRect() {
    if (!this.canvasVisible || !this.$refs.canvas) return;

    ctx.rect(50, 50, 100, 80);
    ctx.strokeStyle = "#4ecdc4";
    ctx.stroke();
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  }

};