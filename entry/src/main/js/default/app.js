const imports = {};

const _this = {
  onCreate: () => {
    console.info("app.js onCreate");
    requireNative("system.router").replace({
      uri: "pages/testJsHeap/TestJsHeap",
    });
  },
  onDestroy: () => {
    console.info("app.js onDestroy");
  },
  setImports: o => {
    for (const k in o) {
      imports[k] = o[k];
    }
  },
  getImports: () => {
    return imports;
  },
};

export default _this;