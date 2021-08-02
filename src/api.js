import axios from 'axios'
// let api='http://192.168.0.113:8080/QcodePay';
// let exporturl ='http://192.168.0.113:8080';
// let yamurl = "http://192.168.0.113:8080/QcodePay/getYam.do?";
let api = 'http://192.168.0.113:8080/OTCpay';
let exporturl = 'http://192.168.0.113:8080';
let yamurl = "http://192.168.0.113:8080/OTCpay/getYam.do?";

let baseRul = process.env.NODE_ENV !== 'production' ? '/OTCpay' : api
const service = axios.create({
  // baseURL: api,
  baseURL: baseRul
})
//请求拦截--添加Authorization
service.interceptors.request.use(config => {
  let token = JSON.parse(localStorage.getItem('otc_token'))
  if (token !== "") {
    config.headers.common['Authorization'] = token;
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

let API = {
  getyamurl() {
    return yamurl;
  },

  phLogin(url, data) {
    return service.post(url, data, {
      withCredentials: true
    });
  },
  imgUpload(url, data) {
    return service.post(url, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  format(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  },
  geturl() {
    return api;
  },
  getexporturl() {
    return exporturl;
  },
  isEmpty(val) {
    if (val == null || val == undefined || val == '') {
      return true;
    }
    return false;
  }

}
axios.defaults.headers = {
  'Content-Type': 'text/plain'

}


export default API;
