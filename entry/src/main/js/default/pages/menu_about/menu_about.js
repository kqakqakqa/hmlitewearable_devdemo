console.info("pages/menu_about/menu_about onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    versionName: $app.getImports().app.getInfo().versionName,
  },
  onInit() { },

  swipeBack(data) {
    if (data.direction === "right") return $app.getImports().router.replace({
      uri: "/pages/menu/menu",
    });
  },
}