console.info("pages/demo_hmlFor/demo_hmlFor onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",

    arr: [],
  },

  onInit() {
    $app.getImports().headerTimeBattery.subscribe(() => {
      this.timeBatteryStr = $app.getImports().headerTimeBattery.time + "  " + $app.getImports().headerTimeBattery.battery;
    });
  },

  onShow() {
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: true });
  },

  onHide() {
    if (this.$refs.mainList.rotation) this.$refs.mainList.rotation({ focus: false });
  },

  clickBtn(type) {
    console.info("Array Test Type: " + type);

    switch (type) {
      case "same":
        this.arr = this.arr;
        break;

      case "push":
        this.arr.push({ v: getRnd() });
        break;

      case "pop":
        this.arr.pop();
        break;

      case "shift":
        this.arr.shift();
        break;

      case "unshift":
        this.arr.unshift({ v: getRnd() });
        break;

      case "reverse":
        this.arr.reverse();
        break;

      case "sort":
        this.arr.sort((o1, o2) => o1.v - o2.v);
        break;

      case 'forEachV':
        this.arr.forEach(o => { o.v = getRnd(); });
        break;

      case 'forEachI':
        this.arr.forEach((o, i) => { this.arr[i].v = getRnd(); });
        break;

      // case 'forOf':
      //   for (let o of this.arr) {
      //     o.v = getRnd();
      //   }
      //   break;

      case 'forIn':
        for (let i in this.arr) {
          this.arr[i].v = getRnd();
        }
        break;

      case 'forLet':
        for (let i = 0; i < this.arr.length; i++) {
          this.arr[i].v = getRnd();
        }
        break;

      case "index":
        if (this.arr.length > 0) {
          this.arr[0].v = getRnd();
        }
        break;

      case 'fill':
        this.arr.fill({ v: getRnd() });
        break;

      case "splice":
        if (this.arr.length > 0) this.arr.splice(0, 1, { v: getRnd() }, { v: getRnd() });
        break;

      case 'from':
        this.arr = Array.from({ length: 5 }, (v, k) => ({ v: k }));
        break;

      case "assign":
        this.arr = [{ v: getRnd() }, { v: getRnd() }, { v: getRnd() }];
        break;

      case "len0":
        this.arr.length = 0;
        break;
    }
  },

  clickBack() {
    $app.getImports().router.replace({
      uri: "/pages/devdemo_index/devdemo_index",
    });
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },
}

function getRnd() {
  return Math.floor(Math.random() * 10);
}