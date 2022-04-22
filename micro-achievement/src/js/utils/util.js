// TZ个格式的日期格式化
export const dateFormatter = (date) => {
  // 日期格式化
  let time = new Date(date);
  // console.log(String(time.getMonth() + 1))
  let year = time.getFullYear();
  let month = String(time.getMonth() + 1).padStart(2, '0');
  let day = String(time.getDay()).padStart(2, '0');
  let hh = String(time.getHours()).padStart(2, '0');
  let mm = String(time.getMinutes()).padStart(2, '0');
  let ss = String(time.getSeconds()).padStart(2, '0');
  let result = `${year}-${month}-${day} ${hh}:${mm}:${ss}`
  return result;
}
