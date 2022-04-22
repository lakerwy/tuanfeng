/**
 * 根据鼠标滚轮，放大缩小图片
 * @param  { WheelEvent } e
 */
export function zoomInAndOut(e) {
  var delta = 0;
  e = window.event || e;
  if (e.wheelDelta) {
    delta = e.wheelDelta / 120;
  } else if (e.detail) {
    delta = -e.detail / 3;
  }
  let el = e.target;
  el.style.width = el.width * (delta > 0 ? 1.1 : 0.9) + "px";
  el.style.height = el.height * (delta > 0 ? 1.1 : 0.9) + "px";
}
