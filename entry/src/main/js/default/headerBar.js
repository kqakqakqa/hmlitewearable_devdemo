console.info("headerBar.js onImport");

const _this = {
  /**
   * 创建并控制顶部条的显示/隐藏动画
   * @param {Object} param
   * @param {function(number): void} param.updateFn 动画进度更新时要传递到的函数，获得一个当前动画进度progress作为参数，范围 0~1
   * 
   * @returns {{triggerShowAnimation: function(): void}} 手动触发显示动画
   *
   * @example
   * let animationProgress;
   *
   * const animation = setAnimation({
   *   updateFn: p => animationProgress = p
   * });
   *
   * // 手动触发显示动画
   * animation.triggerShowAnimation();
   */
  setAnimation(param) {
    const updateFn = param.updateFn;

    const fps = 30;
    const frameTime = 1000 / fps;
    const showHideInterval = 3000;
    const animationDuration = 150;
    const progressSection = frameTime / animationDuration;

    let progress = 1;
    let hideTimeout;
    stepShowAnimation();
    return { triggerShowAnimation };

    function triggerShowAnimation() {
      if (progress >= 1) {
        return hideAnimation();
      }
      if (progress <= 0) {
        return stepShowAnimation();
      }
    }
    function stepShowAnimation() {
      if (progress >= 1) return hideAnimation();
      if (progress <= 0) updateFn(toSmoothed(progress = 0));
      updateFn(toSmoothed(progress += progressSection));
      setTimeout(stepShowAnimation, frameTime);
    }
    function hideAnimation() {
      updateFn(toSmoothed(progress = 1));
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(stepHideAnimation, showHideInterval);
    }
    function stepHideAnimation() {
      if (progress <= 0) return;
      if (progress >= 1) updateFn(toSmoothed(progress = 1));
      updateFn(toSmoothed(progress -= progressSection));
      setTimeout(stepHideAnimation, frameTime);
    }
    function toSmoothed(p) {
      return (2 - p) * p;
    }
  },
}

export default _this;