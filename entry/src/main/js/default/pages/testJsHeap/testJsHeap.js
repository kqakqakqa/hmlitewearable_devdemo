console.info("testJsHeap.js onImport");

const chunks = [];
let size = 0;

const storage = requireNative("system.storage");

storage.get({
  key: "doTest",
  default: "",
  success: v => {
    if (v === "1") {
      storage.set({
        key: "doTest",
        value: "",
        success: alloc,
      });
    } else {
      requireNative("system.router").replace({
        uri: "pages/index/index",
      });
    }
  },
});

function alloc() {
  chunks.push(new Uint8Array(1000));
  size += 1000;

  storage.set({
    key: "jsHeap",
    value: "" + size,
    success: setTimeout(alloc, 0),
  });
}

export default {};