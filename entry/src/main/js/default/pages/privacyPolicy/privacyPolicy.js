console.info("pages/menu_sponsor/menu_sponsor onInit");

export default {
  data: {
    uiSizes: $app.getImports().uiSizes,
    timeBatteryStr: "",
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

  clickAccept() {
    $app.getImports().memory["privacyPolicyAccepted"] = true;
    $app.getImports().memory.save("privacyPolicyAccepted");

    $app.getImports().router.clear();
    $app.getImports().router.replace({
      uri: "pages/demo_index/demo_index",
    });
  },

  clickReject() {
    $app.getImports().memory["privacyPolicyAccepted"] = false;
    $app.getImports().memory.save("privacyPolicyAccepted");

    $app.getImports().app.terminate();
  },

  clickBack() {
    $app.getImports().router.back();
  },

  swipeBack(d) {
    if (d.direction === "right") return this.clickBack();
  },

}