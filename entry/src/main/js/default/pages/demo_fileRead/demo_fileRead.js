console.info("pages/demo_fileRead/demo_fileRead onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    readPos: 0,
    text: "",
    utf: "",
    binary: "",
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });

    this.readText();
  },

  onShow() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.bindRotation.rotation) this.$refs.bindRotation.rotation({ focus: false });
  },

  readText() {
    $app.getImports().file.readText({
      uri: "internal://app/rawfile/fileReadTest.txt",
      position: this.readPos,
      length: 30,
      fail: (data, code) => {
        this.text = code + " " + data;
      },
      success: d => {
        this.text = textStr(d.text);
        this.utf = textUtf(d.text);
      }
    });

    $app.getImports().file.readArrayBuffer({
      uri: "internal://app/rawfile/fileReadTest.txt",
      position: this.readPos,
      length: 30,
      fail: (data, code) => {
        this.text = code + " " + data;
      },
      success: d => {
        this.binary = bufStr(d.buffer);
      }
    });
  },

  changeReadPos(v) {
    this.readPos = Math.max(this.readPos + v, 0);
    this.readText();
  },

  clickBack() {
    $app.getImports().router.replace({
      uri: "pages/demo_index/demo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}

function textStr(str) {
  // decoder: b12345678 c12345678 d12345678 -> b5678c3456 c78d345678
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(String.fromCharCode(str.charCodeAt(i)));
  }
  return result.join("");
}

function textUtf(str) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(("0000" + str.charCodeAt(i).toString(16)).slice(-4));
  }
  return result.join(" ");
}

function bufStr(buf) {
  const result = [];
  for (let i = 0; i < buf.length; i++) {
    result.push(buf[i].toString(16));
  }
  return result.join(" ");
}