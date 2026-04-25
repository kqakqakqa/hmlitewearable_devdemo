console.info("pages/demo_loopSpeed/demo_loopSpeed onInit");

const testLoopCount = 1000; // 测试循环次数

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
      { name: "for let", msg: "", fn: testForLet },
      { name: "while", msg: "", fn: testWhile },
      { name: "for in", msg: "", fn: testForIn },
      { name: "forEach", msg: "", fn: testForEach },
      { name: "map", msg: "", fn: testMap },
      { name: "递归", msg: "", fn: testRecursive },
      { name: "尾递归", msg: "", fn: testTailRecursive },
      { name: "timeout递归", msg: "", fn: testTimeoutRecursive },
      { name: "1/10timeout递归", msg: "", fn: testTimeoutRecursive_1in10 },
    ],

    results: $app.getImports().memory["loopSpeedResults"],
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

  runTest(buttonName) {
    console.info("testing " + buttonName);

    let test = null;
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].name === buttonName) {
        test = this.tests[i];
        break;
      }
    }
    if (!test) return;

    const testName = test.name;
    const testFunction = test.fn;
    test.msg = "测试中...";

    try {

      testFunction((result) => {
        this.results[testName] = result;
        test.msg = "";
        // 保存测试结果到 memory
        this.saveResults();
      });

    } catch (e) {
      test.msg = "错误: " + e.message;
    }

  },

  runAllTests() {
    let index = 0;

    const next = () => {
      if (index >= this.tests.length) return;

      const test = this.tests[index];
      const testName = test.name;

      try {
        this.runTest(testName);
      } catch (e) {
        test.msg = "错误: " + e.message;
      }

      index++;
      return setTimeout(next, 0);
    };

    next();
  },

  clickBack() {
    $app.getImports().router.replace({ uri: "pages/demo_index/demo_index" });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

  saveResults() {
    $app.getImports().memory["loopSpeedResults"] = this.results;
    $app.getImports().memory.save("loopSpeedResults");
  },
};

function lcgNext(seed) {
  return (lcgConfig.a * seed + lcgConfig.c) % lcgConfig.m;
}

function testForLet(then) {
  let seed = lcgConfig.initialSeed;

  const startTime = Date.now();

  for (let i = 0; i < testLoopCount; i++) {
    seed = lcgNext(seed);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

  then(`${duration}ms`);
}

function testWhile(then) {
  let seed = lcgConfig.initialSeed;
  let i = 0;
  const startTime = Date.now();

  while (i < testLoopCount) {
    seed = lcgNext(seed);
    i++;
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);
  then(`${duration}ms`);
}

function testForIn(then) {
  let seed = lcgConfig.initialSeed;

  const startTime = Date.now();

  for (let i in testArr) {
    seed = lcgNext(seed);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

  then(`${duration}ms`);
}

function testForEach(then) {
  let seed = lcgConfig.initialSeed;

  const startTime = Date.now();

  testArr.forEach(() => {
    seed = lcgNext(seed);
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

  then(`${duration}ms`);
}

function testMap(then) {
  let seed = lcgConfig.initialSeed;

  const startTime = Date.now();

  testArr.map(() => {
    seed = lcgNext(seed);
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

  then(`${duration}ms`);
}

function testRecursive(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;

  const next = () => {
    if (count >= testLoopCount) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

      return then(`${duration}ms`);
    }

    seed = lcgNext(seed);
    count++;
    return next();
  };

  const startTime = Date.now();

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

  const startTime = Date.now();

  next(testLoopCount);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

  then(`${duration}ms`);
}

function testTimeoutRecursive(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;

  const next = () => {
    if (count >= testLoopCount) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

      return then(`${duration}ms`);
    }

    seed = lcgNext(seed);
    count++;
    setTimeout(next, 0);
  };

  const startTime = Date.now();

  next();
}

function testTimeoutRecursive_1in10(then) {
  let seed = lcgConfig.initialSeed;
  let count = 0;

  const next = () => {
    if (count >= testLoopCount) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / testLoopCount).toFixed(3);

      return then(`${duration}ms`);
    }

    seed = lcgNext(seed);
    count++;

    if (count % 10 === 0) {
      return setTimeout(next, 0);
    } else {
      return next();
    }
  };

  const startTime = Date.now();

  next();
}