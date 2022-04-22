// 验证规则---只能是纯数字
let checkPending;
let check = (rule, value, callback) => {
  clearTimeout(checkPending);
  if (!value) {
    return callback(new Error("不能为空"));
  }
  checkPending = setTimeout(() => {
    if (!Number.isInteger(Number(value))) {
      callback(new Error("请输入数字"));
    } else {
      callback();
    }
  }, 1000);
};
export default check;


