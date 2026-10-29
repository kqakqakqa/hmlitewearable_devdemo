console.info("memory.js onImport");

const _this = {
  init,
  save,
};

const defaults = {
  privacyPolicyAccepted: false,

  loopPerformanceResults: {},
  mathPerformanceResults: {},

  fetchSize: "未知",
  fetchSpeed: null,
};

// 双保险：每个键在 kvstore 下占两个槽（<key>_slot1 / <key>_slot2）。
// 这里记录两槽各自最近一次【成功】写入的时间戳，只放内存，用来决定下次该覆盖哪个槽。
// 结构：{ [key]: { slot1: number, slot2: number } }
const slotTimes = {};

function init(onDone) {
  const keys = Object.keys(defaults);

  function next() {
    if (keys.length === 0) {
      return onDone && onDone(_this);
    }
    const key = keys.shift();
    load(key, next);
  }

  $app.getImports().file.mkdir({
    uri: "internal://app/kvstore",
    fail: (data, code) => {
      console.error(`file.mkdir kvstore fail: ${code} ${data}`);
    },
    complete: next,
  })
}

// 双保险读取：两个槽都读出来，取时间戳较新的那份作为当前值。
// 两槽都不可用时用 defaults 兜底（旧的单份 <key> 文件按约定直接放弃，不做迁移）。
function load(key, then) {
  let slot1 = null;
  let slot2 = null;
  let pending = 2;

  function pick() {
    pending -= 1;
    if (pending > 0) return;

    const t1 = slot1 ? slot1.time : 0;
    const t2 = slot2 ? slot2.time : 0;
    slotTimes[key] = { slot1: t1, slot2: t2 };

    // 时间戳相等时取槽1，和写入侧 slot1 <= slot2 优先覆盖槽1 的规则保持对称
    const fresh = t1 >= t2 ? slot1 : slot2;
    _this[key] = fresh ? fresh.data : defaults[key];
    then && setTimeout(() => then(_this[key]), 0);
  }

  readSlot(key, "slot1", v => {
    slot1 = v;
    pick();
  });
  readSlot(key, "slot2", v => {
    slot2 = v;
    pick();
  });
}

// 读单个槽，返回 { time, data } 信封。
// 文件不存在、JSON 非法、或内容不是信封形状，一律返回 null，
// 由 load 静默回退到另一个槽 —— 这是双保险里"防读坏"的那一半。
function readSlot(key, slot, done) {
  const name = `${key}_${slot}`;
  let value = null;

  $app.getImports().file.readText({
    uri: `internal://app/kvstore/${name}`,
    fail: (data, code) => {
      console.info(`file.readText ${name} not exist: ${code} ${data}`);
    },
    success: d => {
      console.info(`file.readText ${name} success`);
      try {
        const parsed = JSON.parse(d.text);
        if (parsed && typeof parsed === "object" && typeof parsed.time === "number") {
          value = parsed;
        } else {
          console.error(`file.readText ${name} invalid shape`);
        }
      } catch (e) {
        console.error(`file.readText ${name} parse fail: ${e}`);
      }
    },
    complete: () => {
      return done(value);
    },
  });
}

// 双保险写入：每次只覆盖时间戳较旧的那个槽，另一个槽始终留着上一份完整数据，
// 所以任何一次写坏都不会让这个键彻底不可用。写入内容统一包成 { time, data } 信封。
function save(key, then) {
  const times = slotTimes[key] || { slot1: 0, slot2: 0 };
  const target = times.slot1 <= times.slot2 ? "slot1" : "slot2";
  const name = `${key}_${target}`;
  const now = Date.now();
  let ok = false;

  $app.getImports().file.writeText({
    uri: `internal://app/kvstore/${name}`,
    text: JSON.stringify({ time: now, data: _this[key] }),
    fail: (data, code) => {
      console.error(`file.writeText ${name} fail: ${code} ${data}`);
    },
    success: () => {
      console.info(`file.writeText ${name} success`);
      ok = true;
    },
    complete: () => {
      // 只有写成功才推进该槽的时间戳。失败时保留旧时间戳，下次仍优先选中这个槽重试，
      // 这样失败不会把另一个槽里的好数据挤掉。
      if (ok) times[target] = now;
      slotTimes[key] = times;
      return then && setTimeout(() => then(_this[key]), 0);
    }
  });
}

export default _this;