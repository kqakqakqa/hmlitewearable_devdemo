console.info("lookupDictV4.js onImport");

const _this = {
  lookupDict: lookupDict,
};

function lookupDict(baseDir, key, then) {
  console.info("lookup dict " + baseDir + " for key " + key);

  let depth = 0;
  let pos = 0;
  let len = null;

  function readLayer() {
    const uri = baseDir + "/" + depth;
    console.info("reading " + uri);

    $app.getImports().file.readText({
      uri: uri,
      position: pos,
      length: len,
      fail: (data, code) => console.error("fail: code=" + code + ", data=" + data),
      success: data => {
        const text = data.text;
        const ch = key[depth];

        const lines = text.split("\u001e");
        for (let i = 0; i < lines.length; i++) {
          if (!lines[i]) continue;
          const line = lines[i].split("\u001f");

          const readCh = line[0];
          if (readCh !== ch) continue;

          const readOffset = line[1];
          const readLen = line[2];
          const readValue = line[3];
          const readBranch = readOffset && readLen;

          // 当前是末位字符
          if (depth === key.length - 1) {
            if (readBranch) continue;

            return then(readValue || null);
          }

          // 当前是中途字符
          if (depth !== key.length - 1) {
            if (!readBranch) continue;

            depth++;
            pos = +readOffset;
            len = +readLen;
            return setTimeout(readLayer, 0);
          }
        }

        then(null);
      },
    });
  }

  return setTimeout(readLayer, 0);
}

export default _this;