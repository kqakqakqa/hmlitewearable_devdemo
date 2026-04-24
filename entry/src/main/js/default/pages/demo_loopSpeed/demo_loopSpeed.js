console.info("pages/demo_loopSpeed/demo_loopSpeed onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",
    statusText: "准备就绪",
    resultText: "",
    isRunning: false,
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
  },

  clickBack() {
    $app.getImports().router.replace({ uri: "pages/demo_index/demo_index" });
  },

  clickBtn(type) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.statusText = "测试进行中...";
    this.resultText = "";
    
    console.info("Loop Speed Test Type: " + type);

    setTimeout(() => {
      switch (type) {
        case "recursive":
          this.testRecursive();
          break;
        case "tailRecursive":
          this.testTailRecursive();
          break;
        case "forLet":
          this.testForLet();
          break;
        case "forIn":
          this.testForIn();
          break;
        case "forEach":
          this.testForEach();
          break;
        case "setTimeoutRecursive":
          this.testSetTimeoutRecursive();
          break;
        case "whileLoop":
          this.testWhileLoop();
          break;
        case "runAll":
          this.runAllTests();
          break;
      }
    }, 100);
  },

  testRecursive() {
    const startTime = performance.now();
    let count = 0;
    
    const recursive = (n) => {
      if (n <= 0) return;
      count++;
      recursive(n - 1);
    };
    
    recursive(100);
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "递归测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  testTailRecursive() {
    const startTime = performance.now();
    let count = 0;
    
    const tailRecursive = (n, acc = 0) => {
      if (n <= 0) return acc;
      return tailRecursive(n - 1, acc + 1);
    };
    
    count = tailRecursive(100);
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "尾递归测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  testForLet() {
    const startTime = performance.now();
    let count = 0;
    
    for (let i = 0; i < 100; i++) {
      count++;
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "for let测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  testForIn() {
    const startTime = performance.now();
    let count = 0;
    const arr = new Array(100).fill(0);
    
    for (let i in arr) {
      count++;
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "for in测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  testForEach() {
    const startTime = performance.now();
    let count = 0;
    const arr = new Array(100).fill(0);
    
    arr.forEach(() => {
      count++;
    });
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "forEach测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  testSetTimeoutRecursive() {
    const startTime = performance.now();
    let count = 0;
    let completed = false;
    
    const setTimeoutRecursive = (n) => {
      if (n <= 0) {
        completed = true;
        return;
      }
      count++;
      setTimeout(() => setTimeoutRecursive(n - 1), 0);
    };
    
    setTimeoutRecursive(100);
    
    // 等待所有setTimeout完成
    const checkComplete = () => {
      if (completed) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        this.statusText = "setTimeout递归测试完成";
        this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
        this.isRunning = false;
      } else {
        setTimeout(checkComplete, 10);
      }
    };
    
    checkComplete();
  },

  testWhileLoop() {
    const startTime = performance.now();
    let count = 0;
    let i = 0;
    
    while (i < 100) {
      count++;
      i++;
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    this.statusText = "while循环测试完成";
    this.resultText = `耗时: ${duration}ms, 计数: ${count}`;
    this.isRunning = false;
  },

  runAllTests() {
    const tests = [
      { name: "递归", fn: () => this.testRecursive() },
      { name: "尾递归", fn: () => this.testTailRecursive() },
      { name: "for let", fn: () => this.testForLet() },
      { name: "for in", fn: () => this.testForIn() },
      { name: "forEach", fn: () => this.testForEach() },
      { name: "while", fn: () => this.testWhileLoop() }
    ];
    
    let results = [];
    let index = 0;
    
    const runNext = () => {
      if (index >= tests.length) {
        this.statusText = "全部测试完成";
        this.resultText = results.join(" | ");
        this.isRunning = false;
        return;
      }
      
      const test = tests[index];
      const startTime = performance.now();
      
      try {
        test.fn();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        results.push(`${test.name}: ${duration}ms`);
      } catch (e) {
        results.push(`${test.name}: 错误`);
      }
      
      index++;
      setTimeout(runNext, 50);
    };
    
    runNext();
  }
};