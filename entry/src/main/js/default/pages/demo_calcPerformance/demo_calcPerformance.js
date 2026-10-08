console.info("pages/demo_calcPerformance/demo_calcPerformance onInit");

const testDuration = 5000;
const operationsPerInterval = 1000;

const tests = [
  { name: "整数加减法", operate: integerAddSubtract },
  { name: "浮点加减法", operate: floatAddSubtract },
  { name: "整数乘除法", operate: integerMultiplyDivide },
  { name: "浮点乘除法", operate: floatMultiplyDivide },
  { name: "布尔运算", operate: booleanOperation },
  { name: "位运算", operate: bitOperation },
  { name: "正弦函数", operate: sineOperation },
  { name: "余弦函数", operate: cosineOperation },
  { name: "正切函数", operate: tangentOperation },
  { name: "对数运算", operate: logarithmOperation },
  { name: "指数运算", operate: exponentOperation },
];

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",
    tests,
    results: $app.getImports().memory["mathPerformanceResults"],
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

  runTest(testName, then) {
    let test = null;
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].name === testName) {
        test = this.tests[i];
        break;
      }
    }
    if (!test || test.running) return then && then();

    test.running = true;
    test.progress = 0;

    runTimedTest(test.operate, progress => {
      test.progress = progress;
    }, result => {
      this.results[testName] = result;
      test.running = false;
      test.progress = 100;
      this.saveResults();
      return then && then();
    });
  },

  runAllTests() {
    let index = 0;
    const next = () => {
      if (index >= this.tests.length) return;
      this.runTest(this.tests[index].name, () => {
        index++;
        setTimeout(next, 0);
      });
    };
    next();
  },

  saveResults() {
    $app.getImports().memory["mathPerformanceResults"] = this.results;
    $app.getImports().memory.save("mathPerformanceResults");
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
};

function runTimedTest(operate, onProgress, onDone) {
  let operationCount = 0;
  let operationTime = 0;
  const startTime = Date.now();

  const next = () => {
    // 每节通过 setTimeout 递归调度；墙钟时间控制 5 秒，OPS 只累计批次实际执行时间。
    const operationStart = Date.now();
    for (let i = 0; i < operationsPerInterval; i++) {
      operate();
    }
    operationTime += Date.now() - operationStart;
    operationCount += operationsPerInterval;

    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(100, Math.floor(elapsedTime * 100 / testDuration));
    onProgress(progress);

    if (elapsedTime >= testDuration) {
      return onDone(formatOps(operationCount, operationTime));
    }
    setTimeout(next, 0);
  };

  next();
}

function formatOps(operationCount, elapsedTime) {
  return `${Math.round(operationCount * 1000 / elapsedTime)} OPS`;
}

function integerAddSubtract() {
  let value = 123456;
  value += 789;
  return value - 456;
}

function floatAddSubtract() {
  let value = 123.456;
  value += 78.9;
  return value - 45.6;
}

function integerMultiplyDivide() {
  let value = 12345;
  value *= 37;
  return Math.floor(value / 37);
}

function floatMultiplyDivide() {
  let value = 123.45;
  value *= 3.7;
  return value / 3.7;
}

function booleanOperation() {
  const first = true;
  const second = false;
  return (first && !second) || (second && first);
}

function bitOperation() {
  const value = 0x5a5a;
  return ((value << 3) ^ (value >>> 2)) & 0xffff;
}

function sineOperation() {
  return Math.sin(0.7853981633974483);
}

function cosineOperation() {
  return Math.cos(0.7853981633974483);
}

function tangentOperation() {
  return Math.tan(0.7853981633974483);
}

function logarithmOperation() {
  return Math.log(123.456);
}

function exponentOperation() {
  return Math.exp(1.23456);
}
