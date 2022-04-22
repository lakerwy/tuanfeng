//保留两位小数
export function valueTofixed(val){
  let num = 0;
  let reg = /^[0-9]+\.?[0-9]*$/;
  if(reg.test(val+'')){
    num = Number(val).toFixed(2);
    return Number(num)
  } else {
    return val
  }
}
