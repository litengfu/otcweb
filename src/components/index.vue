<template>
  <div id="hlManage">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside :width="asideWidth + 'px'" style="background-color: #fff ;  overflow:hidden; position: relative">
        <div style="width: 200px;height: 54px; background-color: #fff;position: relative;z-index:100">
          <span style="color: white;font-size: 23px;font-weight: bold; text-align: center;display: block; height:50px;background:#1EC695;line-height:50px;">OTC-运营系统</span>
        </div>
        <el-menu :default-active="$route.path" :default-openeds="openeds" class="el-menu-vertical-demo" @select="_select" active-text-color="rgb(30, 198, 149)" :unique-opened="true" :collapse="isCollapse" router>
          <el-menu-item index="/home" id="homePage">
            <i class="iconfont icon-shouye" style="font-size:20px;"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="(r,index) in reSult" :key="index" :index="r.id" :class="{active:r.id==curIndex}">

            <template slot="title">
              <i :class="r.className" style="margin-right:6px;"></i>
              <span slot="title">{{r.name}}</span>
            </template>
            <el-menu-item v-for="(c,index) in r.child" :key="index" :index="_getRouter(c.menuId)">{{c.menuNm}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>

        <el-header height="50px" style="text-align: right; font-size: 16px;position:relative;color:#fff;">
          <div :class="te1" style="width: 200px;height: 54px; background-color: #fff;position: relative;z-index:100">
            <span style="margin-left:-168px;;color: white;font-size: 23px;font-weight: bold; text-align: center;display: block; height:50px;background:#1EC695;line-height:50px;">OTC-运营系统</span>
          </div>
          <span style="display:inline-block;" :style="{marginRight:UserType=='管理员'?'-60px':'-32px'}">
            {{newDate}}
          </span>
          <div style="font-size: 17px;margin: 0 30px;color: red;cursor: pointer;width: 200px;height: 30px;float: right">
            <img @click="exit" style="width: 20px;height: 20px;margin:-3px 0px" src="../../static/ph/ESC.png">&nbsp;<span @click="exit" style="color:white;">退出</span>
          </div>
          <div @click="changePwdBtn=true" style="width: 30px; height: 30px;cursor: pointer;float: right;margin: 8px -147px;"><img style="width: 28px;color: red" src="../../static/ph/password.png" alt="密码修改" title="密码修改"></div>
          <div v-show="UserType!='管理员'" style="width: 28px; height: 28px;cursor: pointer;float: right;margin: 8px -98px;">
            <el-popover placement="bottom" title="公告" trigger="hover">
              <img slot="reference" style="width: 28px;height: 28px;color: red;" src="../../static/img/gd.png" alt="工单提交/意见反馈" title="工单提交/意见反馈" />
              <div style="overflow:auto;height:150px;">
                <ul class="noticeWrap" v-infinite-scroll="noticeLoad" :infinite-scroll-distance="1">
                  <li v-for="(item,index) in noticeData" :key="index" @click="noteinfo(item.noteId)" style="height:34px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
                    <div class="title" style="margin-right:20px;">{{item.noteTitle}}</div>
                    <div>{{item.crtTime}}</div>
                  </li>
                </ul>
              </div>
            </el-popover>
          </div>
        </el-header>
        <el-header style="height:50px;text-align: right; font-size: 16px;position:relative;z-index:100;color:#666666;box-shadow:4px 2px 5px rgba(0, 0, 0, 0.349019607843137);background:white;">
          <i :class="isCollapse ? 'listIconAct' : 'listIcon'" @click="changeIsColl"></i>
          <p class="routerName" @click="go2Index" style="color:#666666">
            首页
            <span>&nbsp;/&nbsp; {{this.$route.meta.title}}</span>
          </p>
        </el-header>
        <el-main>

          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>

    <!-- 修改密码 -->
    <el-dialog class="instAbout" :visible.sync="changePwdBtn">
      <div slot="title" class="dialog-footer">
        <span>密码修改</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <div class="ts"><img src="../../static/ph/ts2.png" style="width: 20px;height: 20px;vertical-align: middle"><span style="margin-left: 10px;color: orange">输入原始密码</span></div>
        <el-form-item label="原密码：" prop="OldPword">
          <el-input type="password" :maxlength="32" v-model="ruleForm.OldPword" placeholder="请输入旧密码" show-password clearable autocomplete="off">
          </el-input>
        </el-form-item>
        <div class="ts"><img src="../../static/ph/ts2.png" style="width: 20px;height: 20px;vertical-align: middle"><span style="margin-left: 10px;color: orange">新密码为6-10位</span></div>

        <el-form-item label="新密码：" prop="NewPword">
          <el-input :maxlength="32" v-model="ruleForm.NewPword" placeholder="请输入6~10位新密码" show-password clearable autocomplete="off" type="password"></el-input>
        </el-form-item>
        <div class="ts"><img src="../../static/ph/ts2.png" style="width: 20px;height: 20px;vertical-align: middle"><span style="margin-left: 10px;color: orange">再次输入新密码并确认</span></div>
        <el-form-item label="请确认新密码：" prop="surePwd">
          <el-input :maxlength="32" v-model="ruleForm.surePwd" placeholder="请再次输入新密码" show-password clearable autocomplete="off" type="password"></el-input>
        </el-form-item>
        <!-- <el-form-item>
            <el-button type="primary" @click="changePwd()" style="width:100%;">修改密码</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:0;" @click="setNewPwd">提交</el-button>
      </div>
    </el-dialog>
    <!-- 公告详情 -->
    <el-dialog class="instAbout" :visible.sync="noticeDialog" width="587px">
      <div slot="title" class="dialog-footer">
        <span>公告详情</span>
      </div>
      <div v-html="note.ntitle"></div>
      <div style="margin-top: 10px" v-html="note.time"></div>
      <div style="margin-top: 20px;text-align: left;font-size: 13px; line-height: 20px;   font-weight: 400;
    font-style: normal;" v-html="note.msg"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:0;" @click="noticeDialog=false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from "../api";
import com from "../common";
import { mapMutations, mapState, mapActions } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Message } from "element-ui";

export default {
  components: { Message },
  data() {
    return {
      openeds: [1],
      stompClient: "",
      fileList: [],
      te: "t1",
      te1: "t2",
      key: "1",
      asideWidth: 200,
      isCollapse: false, //是否缩放
      UserId: "",
      UserType: "", //用户类型
      changePwdBtn: false, //是否显示修改密码
      ruleForm: {
        OldPword: "",
        NewPword: "",
        surePwd: "",
      },
      rules: {
        OldPword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
        NewPword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
        surePwd: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      reSult: [],
      // 轮巡
      dateTime: "",
      curIndex: "",
      newDate: "",
      //公告
      noticeData: [],
      noticeDialog: false,
      note: {
        ntitle: "",
        time: "",
        msg: "",
      },
      curPage: 1,
      allPage: 1, //总页数
    };
  },
  methods: {
    noticeLoad() {
      //公告查询
      if (this.curPage >= this.allPage) {
        return;
      }
      this.curPage += 1;
      this.notesubmit();
    },
    notesubmit() {
      //公告查询
      let data = {
        userId: this.UserId,
        noteStatus: "启用",
        curPage: this.curPage.toString(),
      };
      API.phLogin("/homeNote.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.noticeData.push(...res.data.data.reSult);
          this.allPage = parseInt(res.data.data.totPage);
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    noteinfo(val) {
      //公告点击
      let data = {
        userId: this.UserId,
        noteId: val,
      };
      API.phLogin("/selNoteInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          let ntitle =
            '<div style="text-align: center;"><span style="    font-weight: 700;font-style: normal;font-size: 16px;">' +
            data.noteTitle +
            "</span></div>";
          let time =
            '<div style="text-align: center;"><font size="3">' +
            data.ctrTime +
            "</font></div>";
          let msg = "<div>" + data.noteMessage + "</div>";
          // $("#test").html(title + time + msg);

          // data 定义

          this.note = {
            ntitle,
            time,
            msg,
          };
          this.noticeDialog = true;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _setDate() {
      //设置顶部时间
      let date = new Date();
      this.newDate = this.dateFormat("YYYY年mm月dd日 HH:MM:SS", date);
      setInterval(() => {
        let date = new Date();
        this.newDate = this.dateFormat("YYYY年mm月dd日 HH:MM:SS", date);
      }, 1000);
    },
    _initMenuStyle() {
      //初始化菜单样式
      let index = this._getRouter("", this.$route.path);
      let list = this.reSult;
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].child.length; j++) {
          if (index == list[i].child[j].menuId) {
            this.curIndex = list[i].id;
            return;
          }
        }
      }
    },
    dateFormat(fmt, date) {
      //格式化时间
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
      let res = fmt.split(" ");
      let result = [res[0], str, res[1]];
      return result.join(" ");
    },
    _select(...val) {
      // 菜单激活回调
      this.curIndex = val[1][0];
    },
    _getRouter(key, value) {
      /**
       * @key:路由id
       * return router
       */
      let res = {
        0: "/home",
        "0101": "/riskInfoQuery", //管理员系统设置.
        "0102": "/noticeInfoQuery", //管理员公告.
        "0103": "/teamManager", //管理员团队管理.
        "0104": "/receivePay", //管理员收款管理.
        "0201": "/userInfoQuery", //管理员商户查询.
        "0202": "/proxyInfoQuery", //管理员代理查询.
        "0301": "/adminBuyQueryInfo", //管理员买入订单.
        "0302": "/adminSellQueryInfo", //管理员卖出订单.
        "0303": "/adminTxorderQueryInfo", //管理员提现订单.
        "0304": "/adminRechargeQueryInfo", //管理员充值订单.
        "0401": "/adminBalanceQueryInfo", //管理员资金日志.
        "0402": "/adminOrderSt", //管理员交易统计.
        5001: "/baseSet", //商户、代理基本信息
        5101: "/commonChild", //代理下级查询.
        5201: "/transactionOrder", //商户申请交易.
        5202: "/buyOrderQueryInfo", //商户买入订单.
        5203: "/sellOrderQueryInfo", //商户卖出订单.
        5204: "/txorderQueryInfo", //商户、代理提现订单.
        5205: "/rechargeQueryInfo", //商户充值订单.
        5206: "/proxyTransferQueryInfo", //代理交易订单.
        5301: "/balanceQueryInfo", //商户、代理资金日志.
        5302: "/memberOrderSt", //商户交易统计.
        5303: "/proxyOrderSt", //代理交易统计.
      };
      if (typeof value !== "undefined") {
        for (let i in res) {
          if (res[i] == value) {
            return i;
          }
        }
      }
      return res[key] ? res[key] : "";
    },
    go2Index() {
      this.$router.push("/home");
    },
    exit() {
      this.$confirm("此操作将退出登录！, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.getOut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出！",
          });
        });
    },
    initWebSocket() {
      this.connect();
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
    },
    connect() {
      //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      let _this = this;
      let userId = _this.UserId;
      let loginType = "pc";
      let api = API.geturl() + "/endpointWisely";
      if (_this._isMobile()) {
        loginType = "app";
      }
      console.log("api: " + api);
      let token = "t" + hex_md5(userId + loginType).toUpperCase();
      let sock = new SockJS(api);
      // 获取STOMP子协议的客户端对象
      let stompClient = Stomp.over(sock);
      this.stompClient = stompClient;
      // 向服务器发起websocket连接
      let connection = stompClient.connect({}, function (frame) {
        //3连接webSocket的服务端。
        console.log("开始进行连接Connected: " + frame);
        //4通过stompClient.subscribe（）订阅服务器的目标是'/topic/getResponse'发送过来的地址，与@SendTo中的地址对应。
        stompClient.subscribe("/user/" + token + "/msg", function (respnose) {
          let result = JSON.parse(respnose.body);
          console.log("reuslt:" + result);
          if (result.code == "8000") {
            //如果通知code为8000为有新的订单产生了
            _this.open1();
            _this.playSound();
          } else if (result.code == "8100") {
            //如果通知code为8100为在别处有人登陆了
            _this.open();
            com.clearCookie();
            com.clearLocalStorage("otc_webUserInfo");
            com.clearLocalStorage("otc_webUserId");
          } else if (result.code == "8101") {
            //如果通知code为8101为长时间未动被系统强制下线了
            _this.open3();
            com.clearLocalStorage("otc_webUserInfo");
            com.clearLocalStorage("otc_webUserId");
          }
        });
      });
    },
    open() {
      this.$alert(
        "您的账号已在别处登陆，如不是本人，请点击确认立即登陆后修改密码。",
        "账号异常提醒",
        {
          confirmButtonText: "确定",
          type: "warning",
          callback: (action) => {
            this.open2();
          },
        }
      );
    },
    open3() {
      this.$alert(
        "您的账号由于长时间未进行任何操作，已被系统强制下线，如需继续使用请点击确认，重新登陆。",
        "账号状态提醒",
        {
          confirmButtonText: "确定",
          type: "info",
          callback: (action) => {
            this.open2();
          },
        }
      );
    },
    open1() {
      this.$notify({
        title: "成功",
        message: "你有一条新的交易订单！",
        type: "success",
      });
    },
    open2() {
      this.$router.push("/login");
    },
    //订单声音提示
    playSound() {
      let borswer = window.navigator.userAgent.toLowerCase();
      if (borswer.indexOf("ie") >= 0) {
        //IE内核浏览器
        let url =
          process.env.NODE_ENV !== "production"
            ? "../../static/img/new.mp3"
            : API.geturl() + "/static/img/new.mp3";
        let strEmbed = `<embed name="embedPlay" src="${url}" autostart="true" hidden="true" loop="false"></embed>`;
        if ($("body").find("embed").length <= 0) $("body").append(strEmbed);
        let embed = document.embedPlay;
        //浏览器不支持 audion，则使用 embed 播放
        embed.volume = 100;
        //embed.play();这个不需要
      } else {
        //非IE内核浏览器
        let url =
          process.env.NODE_ENV !== "production"
            ? "../../static/img/new.mp3"
            : API.geturl() + "/static/img/new.mp3";
        let strAudio = `<audio id='audioPlay' src='${url}' hidden='true'>`;
        if ($("#audioPlay").length <= 0) {
          $("#app").append(strAudio);
        }
        let audio = document.getElementById("audioPlay");
        //浏览器支持 audio
        audio.play();
      }
    },

    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },

    changeIsColl() {
      this.isCollapse = !this.isCollapse;
      if (this.te == "t1") {
        this.te = "t2";
        this.te1 = "t1";
      } else {
        this.te = "t1";
        this.te1 = "t2";
      }
    },
    getOut() {
      let data = {
        userId: this.UserId,
      };
      API.phLogin("/exitUser.do", data).then((res) => {});
      com.clearCookie();
      com.clearLocalStorage("otc_webUserInfo");
      com.clearLocalStorage("otc_webUserId");
      this.$message({
        message: "退出成功！",
        type: "success",
        duration: 1500,
      });
      this.$router.push("/login");
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    setNewPwd() {
      if (this.ruleForm.NewPword != this.ruleForm.surePwd) {
        this.$message.error("两次输入密码不一致！");
        this.ruleForm.NewPword = "";
        this.ruleForm.surePwd = "";
        return;
      }
      if (
        this.ruleForm.NewPword.length > 10 ||
        this.ruleForm.NewPword.length < 6
      ) {
        this.$message.error("新密码长度在 6 到 10 个字符");
        return;
      }
      let data = {
        userId: this.UserId,
        newPwd: hex_md5(this.ruleForm.NewPword).toUpperCase(),
        oldPwd: hex_md5(this.ruleForm.OldPword).toUpperCase(),
      };
      let _this = this;
      API.phLogin("/modUserPwd.do", data).then((res) => {
        if (res.data.code == "0000") {
          _this.$message.success("密码修改成功！");
          _this.changePwdBtn = false;
        } else {
          this.$message.error(res.data.msg);
        }
        _this.ruleForm.OldPword = "";
        _this.ruleForm.NewPword = "";
        _this.ruleForm.surePwd = "";
      });
    },
  },

  watch: {
    isCollapse(newVal, oldVal) {
      if (newVal) {
        this.asideWidth = 64;
      } else {
        this.asideWidth = 200;
      }
    },
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
  },

  created() {
    this.reSult = com.getLocalStorage("otc_webReSult");
    this.UserId = com.getLocalStorage("otc_webUserId");
    this.UserType = com.getLocalStorage("otc_webUserType");
    this._setDate(); //设置顶部时间
    this._initMenuStyle(); //给菜单加样式
    this.notesubmit(); //公告查询
  },
  mounted() {
    this.initWebSocket();
  },
};
</script>


<style scoped lang="stylus">
.noticeWrap {
  .title {
    display: inline-block;
    white-space: nowrap;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.el-icon-sort, .el-icon-setting {
  margin: 0 4px 0 1px;
  width: 20px !important;
  height: 20px !important;
  box-sizing: content-box;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.cardIcon {
  margin: 0 4px 0 4px;
  width: 15px !important;
  height: 15px !important;
  box-sizing: content-box;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.listIcon, .listIconAct {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  margin: 15px;
  background: url('../../static/img/listIcon.png') no-repeat;
  background-size: 100% 100%;
  transition: all 1s;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
}

.listIconAct {
  transition: all 1s;
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
}

#hlManage {
  width: 100%;
  min-width: 1280px;
  height: 100%;
}

.el-header {
  background-color: #1EC695;
  color: #333;
  line-height: 50px;
}

.el-menu-vertical-demo {
  text-align: left;
}

.el-aside {
  color: #333;
}

.zoomOutIcon, .zoomInIcon {
  width: 26px;
  height: 26px;
  margin: 15px;
  position: absolute;
  top: 0;
  left: 0;
}

.el-main {
  padding: 8px;
}

.headerSpan {
  padding: 0 14px 0 0;
  border-right: 3px solid #97a8be;
  color: #97a8be;
  margin-right: 10px;
}

.routerName {
  cursor: pointer;
  position: absolute;
  line-height: 50px;
  left: 50px;
  font-size: 14px;
  color: #fff;
}

.routerName span {
  color: #666666;
  font-size: 14px;
}

.userLogo {
  width: 36px;
  height: 36px;
  position: absolute;
  left: -45px;
  top: 4px;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: -10px;
  width: 80%;
}

.instAbout .el-form-item {
  margin-right: 0;
  margin-bottom: 30px;
  width: 50%;
}

#hlManage /deep/ .instAbout {
  font-family: '黑体';
}

#hlManage /deep/ .instAbout .el-form-item__label {
  width: 100px;
  text-align: right;
  color: #99a9bf;
}

#hlManage /deep/ .instAbout .el-form-item__content {
  width: 200px;
  text-align: left;
}

#hlManage /deep/ .instAbout .address .el-form-item__content {
  width: calc(100% - 140px);
  text-align: left;
}

.t1 {
  display: block;
  float: left;
}

.t2 {
  display: none;
}

#hlManage /deep/ .instAbout .el-dialog__header {
  background-color: #1ec695;
  text-align: left;
  font-size: 15px;
  color: white;
}

.instAbout /deep/ .el-dialog {
  width: 587px !important;
}

.i3 /deep/ .el-dialog {
  width: 850px !important;
}

#hlManage /deep/ .instAbout .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.ts {
  width: 33%;
  float: right;
  height: 40px;
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 12px;
}

#hlManage >>> input::-webkit-outer-spin-button, #hlManage >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

#hlManage >>> input[type="number"] {
  -moz-appearance: textfield;
}

.active {
  color: #1ec695 !important;

  /deep/ .el-submenu__title {
    position: relative;
    color: #1ec695 !important;

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 4px;
      height: 100%;
      background: #1ec695;
      left: 0;
      top: 0;
    }

    i {
      color: #1ec695 !important;
    }
  }
}
</style>

