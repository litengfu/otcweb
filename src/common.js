import Vue from "vue";

var obj = {
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  },
  clearCookie() {
    this.setCookie("UserNo", "", -1);
  },
  saveLocalStorage(key, value) {//用户信息存在localStorage
    var storage = window.localStorage;
    storage[key] = JSON.stringify(value)
  },
  getLocalStorage(key) {//获取localStorage
    if (window.localStorage[key]) {
      return JSON.parse(window.localStorage[key]);
    }
  },
  clearLocalStorage(key) {//清空localStorage
    window.localStorage[key] = ''
  },
  //检查参数
  _checkParam(list, formReq) {
    /**
     * 检查参数
     * @list:表单对象
     * @formReq:表单规则
     * 
     * "isNoEmpty:不能空"
     * "isNoNegative:不能小于0"
     * "isArea":Array 范围 [0]:最小值 [1]最大值 [2]错误提示
     */
    if (!(list instanceof Object) || !(formReq instanceof Object)) {
      console.error('_checkParam的参数必须是对象');
      return
    }
    let form = JSON.parse(JSON.stringify(list));
    for (let i in form) {
      let res = formReq[i];
      if (!res) continue;
      for (var j in res) {
        switch (true) {
          case j == "isNoEmpty" && !form[i] && form[i] !== 0:
            Vue.prototype.$message.error(res.isNoEmpty);
            return;
          case j == "isNoNegative" && form[i] < 0:
            Vue.prototype.$message.error(res.isNoNegative);
            return;
          case j == 'isArea' && Number(form[res[j][0]]) > Number(form[res[j][1]]):
            Vue.prototype.$message.error(res.isArea[2]);
            return;
        }
      }
    }
    return true
  },
  //判断手机号
  checkPhone(TEL) {
    var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (strTemp.test(TEL)) {
      return true;
    }
    return false;
  },
  _isMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
  },
  //过去时间
  _historyTime: function (num, type = 1) {
    var day = 3600 * 24 * 1000;
    var date = new Date(new Date().getTime() - day * num);
    if (type == 1) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
      );
    } else if (type == 2) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59
      );
    }
  }
}

export default obj;
