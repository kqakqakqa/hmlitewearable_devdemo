console.info("pages/demo_loopPerformance/demo_loopPerformance onInit");

const testLoopCount = 1000;
const testDuration = 5000;

const lcgConfig = {
  a: 1664525,
  c: 1013904223,
  m: 4294967296,
  initialSeed: 42,
};

// 统一的数组，供多个测试函数使用
const testArr = [];
testArr.length = testLoopCount;
for (let i = 0; i < testLoopCount; i++) {
  testArr[i] = 0;
}

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    tests: [
      { name: "for let", fn: testForLet },
      { name: "while", fn: testWhile },
      { name: "for in", fn: testForIn },
      { name: "forEach", fn: testForEach },
      { name: "map", fn: testMap },
      { name: "递归", fn: testRecursive },
      { name: "尾递归", fn: testTailRecursive },
      { name: "timeout递归", fn: testTimeoutRecursive },
      { name: "1/10timeout递归", fn: testTimeoutRecursive_1in10 },
    ],

    results: $app.getImports().memory["loopPerformanceResults"],
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

    runTimedTest(test.fn, progress => {
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
    $app.getImports().memory["loopPerformanceResults"] = this.results;
    $app.getImports().memory.save("loopPerformanceResults");
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

};

function lcgNext(seed) {
  return (lcgConfig.a * seed + lcgConfig.c) % lcgConfig.m;
}

function runTimedTest(runInterval, onProgress, onDone) {
  let operationCount = 0;
  let operationTime = 0;
  const startTime = Date.now();

  const next = () => {
    const operationStart = Date.now();
    runInterval(completedCount => {
      operationTime += Date.now() - operationStart;
      operationCount += completedCount;

      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(100, Math.floor(elapsedTime * 100 / testDuration));
      onProgress(progress);

      if (elapsedTime >= testDuration) {
        return onDone(formatOps(operationCount, operationTime));
      }
      // 外层 timeout 只用于分批调度，不计入测试项的实际执行时间。
      setTimeout(next, 0);
    });
  };

  next();
}

function formatOps(operationCount, operationTime) {
  return `${operationTime === 0 ? 0 : Math.round(operationCount * 1000 / operationTime)} OPS`;
}

function testForLet(then) {
  let seed = lcgConfig.initialSeed;
  for (let i = 0; i < testLoopCount; i++) {
    seed = lcgNext(seed);
  }
  then(testLoopCount);
}

function testWhile(then) {
  let seed = lcgConfig.initialSeed;
  let i = 0;
  while (i < testLoopCount) {
    seed = lcgNext(seed);
    i++;
  }
  then(testLoopCount);
}

function testForIn(then) {
  let seed = lcgConfig.initialSeed;
  for (let i in testArr) {
    seed = lcgNext(seed);
  }
  then(testLoopCount);
}

function testForEach(then) {
  let seed = lcgConfig.initialSeed;
  testArr.forEach(() => {
    seed = lcgNext(seed);
  });
  then(testLoopCount);
}

function testMap(then) {
  let seed = lcgConfig.initialSeed;
  testArr.map(() => {
    seed = lcgNext(seed);
  });
  then(testLoopCount);
}

function testRecursive(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;
  const next = () => {
    if (count >= testLoopCount) return then(count);
    seed = lcgNext(seed);
    count++;
    return next();
  };
  next();
}

function testTailRecursive(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;
  const next = () => {
    seed = lcgNext(seed);
    count++;
    return (count >= testLoopCount) || next();
  };
  next();
  then(count);
}

function testTimeoutRecursive(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;
  const next = () => {
    if (count >= testLoopCount) return then(count);
    seed = lcgNext(seed);
    count++;
    setTimeout(next, 0);
  };
  next();
}

function testTimeoutRecursive_1in10(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;
  const next = () => {
    if (count >= testLoopCount) return then(count);
    seed = lcgNext(seed);
    count++;
    if (count % 10 === 0) {
      return setTimeout(next, 0);
    }
    return next();
  };
  next();
}