console.info("router.js onImport");

const _this = {

  /**
   *
   * @param {Object} d
   * @param {string} d.uri
   * @param {Object} [d.params]
   *
   */
  replace(d) {
    setTimeout(() => requireNative("system.router").replace({
      uri: "/pages/router/router",
      params: {
        uri: d.uri,
        params: d.params || {},
      },
    }), 0);
  },

};

export default _this;