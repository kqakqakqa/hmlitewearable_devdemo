console.info("pages/demo_fetch/demo_fetch onInit");

const maxTrial = 3;

// 精度档位表：floor(100 * 1.076^(idx-1))，idx 从 1 开始（100, 107, 115, ...），约 7.6% 一档。
// 整个探测都以档位为单位：没触顶就 10 档 10 档往上跳，触顶后就二分档位序号，测的值永远是 stepSize(idx)。
function stepSize(idx) {
  return Math.floor(100 * Math.pow(1.076, idx - 1));
}

// 传输速度（字节/秒）= 请求字节数 / （发出请求到收到响应的耗时）；耗时可能是 0ms，按 1ms 算避免除零。
// 这里只算数字，单位文案交给 hml
function calcSpeed(bytes, elapsed) {
  return Math.round(bytes * 1000 / Math.max(elapsed, 1));
}

let isStopping = false;

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    model: "未知",
    // 上次测到的结果和速度直接取自 memory（入口页已 init 完成，进页面前值就在了）
    fetchSize: $app.getImports().memory["fetchSize"],
    // 传输速度，单位字节/秒，null 表示还没测到；文案在 hml 里拼
    fetchSpeed: $app.getImports().memory["fetchSpeed"],
    // 正在探测的字节数，配合 retryCount 在 hml 里拼成"测试：xxx字节（第n次）"
    testingSize: 0,
    msg: "",

    isTesting: false,

    retryCount: 0,

    // 探测状态一律存档位序号：currentIdx 是这次要测的档位；
    // 二分区间是 [lowIdx, highIdx]，lowIdx 同时就是"最后确认可行的档位 + 1"；
    // highIdx 为 null 表示还没触顶（还在倍增阶段）
    currentIdx: 1,
    lowIdx: 1,
    highIdx: null,
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: true,
    });

    $app.getImports().device.getInfo({
      success: d => {
        this.model = d.model || d.product || d.brand;
      },
    });
  },

  onDestroy() {
    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: false,
    });

    this.stopTest();
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: true,
    });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });

    $app.getImports().brightness.setKeepScreenOn({
      keepScreenOn: false,
    });

    this.stopTest();
  },

  stopTest() {
    isStopping = true;
    this.isTesting = false;
  },

  clickTest() {
    if (this.isTesting) return this.stopTest();
    if (!$app.getImports().fetch) return this.msg = "设备不支持fetch";

    isStopping = false;
    this.isTesting = true;
    this.msg = ""; // 清掉上一次留下的报错

    this.retryCount = 0;

    // 从最小档位开始，一次 10 档往上跳
    this.currentIdx = 1;
    this.lowIdx = 1;
    this.highIdx = null;

    this.tryFetch();
  },

  tryFetch() {
    if (isStopping) return;

    // 每一次探测都落在档位值上
    const bytes = stepSize(this.currentIdx);

    // 发出请求的时刻，配合 success 里取的时刻算传输速度
    const startTime = Date.now();

    // 把这次探测的字节数交给模板，次数直接用已有的 retryCount，文案由 hml 拼
    this.testingSize = bytes;

    $app.getImports().fetch.fetch({
      url: "https://speed.cloudflare.com/__down?bytes=" + bytes,
      method: "GET",
      responseType: "text",
      fail: (data, code) => {
        if (isStopping) return;
        this.handleFetchFail(data, code);
      },
      success: response => {
        if (isStopping) return;

        // 返回内容全是字符 "0"（0x30），一个字符就是一字节
        const data = response.data;
        const got = data ? data.length : 0;

        // 只有"完整收到请求的字节数"才算成功；短返回、体量超限、报错一律是同一种失败
        if (got !== bytes) {
          // 这是我们自己判定的失败，没有真实错误码，所以不传 code
          this.handleFetchFail("返回" + got + "字节，不足" + bytes);
          return;
        }

        // 完整拿到，这一档确认可行：lowIdx 就是它的下一档，即还没验证的左端
        this.retryCount = 0;
        this.lowIdx = this.currentIdx + 1;
        // 这次成功，上一次失败留下的报错提示要清掉
        this.msg = "";

        // 只显示最后一次测到的速度
        this.fetchSpeed = calcSpeed(bytes, Date.now() - startTime);

        if (this.highIdx === null) {
          // 还没触顶，继续 10 档 10 档往上跳（1.076^10 ≈ 2.08 倍）
          this.currentIdx += 10;
          setTimeout(this.tryFetch, 0);

        } else {
          setTimeout(this.nextBinaryStep, 0);

        }
      },
    });
  },

  // 只有"完整收到请求的字节数"才算成功，其它（短返回、体量超限、网络报错）都是同一种失败：
  // 同一档位最多试 maxTrial 次，仍然失败就认定这一档拉不到，转档位二分。
  // code 是可选的：短返回由我们自己判定，没有真实错误码，就不传。
  handleFetchFail(data, code) {
    if (isStopping) return;

    // 报错统一显示在 msg，测试继续往下走；只有 fetch 真的给了错误码才显示它
    this.msg = "失败：" + (code === undefined ? data : code + " " + data);

    if (++this.retryCount < maxTrial) {
      setTimeout(this.tryFetch, 500);
      return;
    }

    // 重试用尽：这一档拉不到，回到档位二分
    this.retryCount = 0;
    this.highIdx = this.currentIdx - 1;
    setTimeout(() => this.nextBinaryStep(), 0);
  },

  nextBinaryStep() {
    if (isStopping) return;

    // 档位区间还没空就继续二分档位序号
    if (this.lowIdx <= this.highIdx) {
      this.currentIdx = Math.floor((this.lowIdx + this.highIdx) / 2);
      // 换到新档位了，重试计数必须清零，否则上一个档位的失败次数会把这里直接顶到终止
      this.retryCount = 0;
      this.tryFetch();
      return;
    }

    // 正常结束：结果写进 fetchSize，"最大数据量"那行自动从"测试：…"切回结果
    this.isTesting = false;
    this.msg = "测试完成";

    // lowIdx 就是"最后确认可行的档位 + 1"，也就是拉不到的边界，显示成"<xxx字节"。
    // 一档都没成功时 lowIdx 还是 1，正好得到"<100字节"
    this.fetchSize = "<" + stepSize(this.lowIdx) + "字节";

    // 结果和速度一起落到 memory，下次进页面直接显示上次测到的值
    $app.getImports().memory["fetchSize"] = this.fetchSize;
    $app.getImports().memory.save("fetchSize");

    // 这一轮一个成功请求都没有（fetchSpeed 还是 null）时不写，保留上次的有效速度
    if (this.fetchSpeed !== null) {
      $app.getImports().memory["fetchSpeed"] = this.fetchSpeed;
      $app.getImports().memory.save("fetchSpeed");
    }
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}