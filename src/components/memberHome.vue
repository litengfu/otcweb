<template>
  <div class="memberHome">
    <div class="homeTop">
      <ul class="statisWrap">
        <li class="item">
          <div class="title">余额(U)</div>
          <div class="num">{{staticForm.accAmt}}</div>
        </li>
        <li class="item">
          <div class="title">今日买入金额(CNY)</div>
          <div class="num">{{staticForm.buyAmt}}</div>
        </li>
        <li class="item">
          <div class="title">今日买入数量(U)</div>
          <div class="num">{{staticForm.buyUsdt}}</div>
        </li>
        <li class="item">
          <div class="title">今日卖出金额(CNY)</div>
          <div class="num">{{staticForm.sellAmt}}</div>
        </li>
        <li class="item">
          <div class="title">今日卖出数量(U)</div>
          <div class="num">{{staticForm.sellUsdt}}</div>
        </li>
      </ul>
    </div>
    <div class="userContent">
      <div class="left">
        <div class="imgWrap">
          <img src="../../static/img/sy/wepLogo.png" />
        </div>
        <div style="height:10px;"></div>
        <div class="name">
          {{userinfoForm.userName}}</div>
        <div class="createTime content">
          <span class="title">创建时间:</span>
          <span>{{userinfoForm.crtTime}}</span>
        </div>
        <div class="phone content">
          <span class="title">手机号码:</span>
          <span>{{userinfoForm.userMobil}}</span>
        </div>
        <div class="status content">
          <span class="title">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</span>
          <span>{{userinfoForm.userStatus}}</span>
        </div>
        <div class="googleStatus content">
          <span class="title">谷歌验证:</span>
          <el-switch v-model="googleForm.googleStatus" @change="_changeGoogleStatus('G',googleForm.googleStatus)" active-color="#13ce66" class="asta" active-value="启用" inactive-value="禁用" inactive-color="#ff4949">
          </el-switch>
          <span class="setBtn" @click="_googleBtn">设置</span>
        </div>
        <div class="btn">
          <span v-if="roleType=='商户'" class="recharge" @click="_getuAddr">立即充值</span>
          <span v-else class="recharge disable">立即充值</span>
        </div>
      </div>
      <div class="right">
        <div class="title">今日订单统计</div>
        <div id="main" style="flex:1;width:100%;"></div>
      </div>
    </div>
    <!-- <el-row class="bottomContent" :gutter="20">
      <el-col :span="24">
        <div class="left">
        </div>
      </el-col>
    </el-row> -->
    <!--账户充值-->
    <el-dialog class="push" :visible.sync="rechargeDialog" width="530px">
      <div slot="title" class="dialog-footer">
        <span>账户充值</span>
      </div>
      <el-form style="overflow:hidden;" :model="rechargeForm" status-icon ref="ruleForm1" label-width="90px" class="demo-ruleForm1">
        <el-form-item label="币种:" :rules="[{required:true}]">
          <el-radio-group v-model="rechargeForm.curcd">
            <el-radio label="USDT">USDT</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量:" :rules="[{required:true}]">
          <el-input type="number" style="width: 350px" v-model="rechargeForm.uNum" placeholder="请输入充值数量"></el-input>
        </el-form-item>
        <el-form-item label="充值地址:" :rules="[{required:true}]">
          <div>
            <div id="recharge" style="width: 128px;height:128px;margin: 0 auto"></div>
            <div style="margin-top: 10px;font-size: 12px;color:#606266;">地址：{{rechargeForm.uAddr}}</div>
          </div>
        </el-form-item>
        <el-form-item label="充值备注:">
          <el-input type="textarea" style="width: 350px;height: 50px" v-model="rechargeForm.orderRsv" placeholder="请输入充值备注"></el-input>
        </el-form-item>
        <div style="text-align:right">
          <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;margin:0px 383px;margin-bottom:0;" @click="_rechargeClick()" :loading="rechargeLoading">充值
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 谷歌验证 -->
    <el-dialog class="instAbout googleWrap" :visible.sync="googleDialog" width="587px">
      <div slot="title" class="dialog-footer">
        <span>谷歌验证设置</span>
      </div>
      <div id="qrcode"></div>
      <!-- 创建一个div，并设置id为qrcode -->
      <div class="keys">秘钥：{{googleForm.googleKey}}</div>
      <div class="notice">
        <div class="noticeTitle">
          <span>在谷歌验证器中添加秘钥并备份</span>
        </div>
        <div class="noticeContent">注：打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="googleDialog=false">
          确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from "../api";
import com from "../common";
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
const formReq = {
  curcd: {
    isNoEmpty: "请选择币种",
  },
  uNum: {
    isNoEmpty: "请输入充值数量",
  },
  uAddr: {
    isNoEmpty: "充值地址不能空!",
  },
};
export default {
  data() {
    return {
      userinfoForm: {
        userName: "",
        crtTime: "",
        userMobil: "",
        userStatus: "",
      },
      //充值
      rechargeDialog: false,
      rechargeForm: {
        curcd: "USDT",
        uNum: "",
        uAddr: "",
        orderRsv: "",
      },
      rechargeLoading: false,
      //谷歌
      googleForm: {},
      googleDialog: false,
      staticForm: {
        accAmt: "",
        buyAmt: "",
        buyUsdt: "",
        sellAmt: "",
        sellUsdt: "",
      },
      roleType: "",
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this.roleType = com.getLocalStorage("otc_webUserType");
    this._getGoogle(); //谷歌验证信息
    this._getOrderInfo(); //获取订单信息
    this._getInfoUser(); //获取会员信息
    this._getStatic(); //获取统计信息
  },
  methods: {
    _getStatic() {
      //获取统计信息
      let data = {
        userId: this.UserId,
      };
      API.phLogin("/homeAccInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.staticForm = res.data.data;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    _getInfoUser() {
      // 获取会员信息
      let data = {
        userId: this.UserId,
      };
      API.phLogin("/infoUser.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.userinfoForm = res.data.data;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _getOrderInfo() {
      //获取订单信息
      let data = {
        userId: this.UserId,
      };

      API.phLogin("/homeTxnInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data.nowTxn,
            xList = [],
            yList = [];
          data.map((item) => {
            xList.push(item.label);
            yList.push(item.value);
          });
          this._setEchart(xList, yList);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _setEchart(xList, yList) {
      //echarts图
      var myChart = echarts.init(document.getElementById("main"));
      let option = {
        tooltip: {},
        xAxis: {
          data: xList,
        },
        itemStyle: {
          color: "#1ec695",
        },
        barWidth: "30px",
        yAxis: {},
        label: {
          show: true,
          position: "top",
        },
        series: [
          {
            type: "bar",
            data: yList,
          },
        ],
      };
      myChart.setOption(option);
    },
    _rechargeClick() {
      //充值
      if (!com._checkParam(this.rechargeForm, formReq)) {
        return;
      }
      let data = {
        userId: this.UserId,
        ...this.rechargeForm,
      };
      this.rechargeLoading = true;
      API.phLogin("/addCZ.do", data).then(
        (res) => {
          this.rechargeLoading = false;
          if (res.data.code == "0000") {
            this.rechargeForm = {
              curcd: "USDT",
              uNum: "",
              uAddr: "",
              orderRsv: "",
            };
            this.$message.success("充值成功");
            this.rechargeDialog = false;
          } else if (res.data.code == "9999") {
            this.$router.push("/login");
            this.$message.error("登录已失效,请重新登录!");
          } else {
            this.$message.error(res.data.msg);
          }
        },
        (res) => {
          this.rechargeLoading = false;
        }
      );
    },
    _getuAddr() {
      //获取充值地址
      API.phLogin("/getuAddr.do").then((res) => {
        if (res.data.code == "0000") {
          this.rechargeDialog = true;
          this.rechargeForm.uAddr = res.data.data.uAddr;
          this.qrcode("recharge", this.rechargeForm.uAddr);
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _changeGoogleStatus(val, val2) {
      //改变谷歌验证状态
      let data = {
        userId: this.UserId,
        flag: val,
        status: val2,
      };
      API.phLogin("/upSecureFlag.do", data).then((res) => {
        if (res.data.code == "0000") {
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _googleBtn() {
      //谷歌弹框
      this.googleDialog = true;
      this.qrcode("qrcode", this.googleForm.googleQrcode);
    },
    _getGoogle(type) {
      //谷歌验证信息
      let data = {
        operId: this.UserId,
        userId: this.UserId,
      };

      API.phLogin("/infoSecure.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.googleForm = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    qrcode(id, text) {
      $(`#${id}`).html("");
      this.$nextTick(() => {
        new QRCode(id, {
          width: 128, // 二维码宽度，单位像素
          height: 128, // 二维码高度，单位像素
          text: text, // 生成二维码的链接
        });
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.memberHome {
  text-align: left;
  margin-left: 30px;
  margin-top: 30px;
  overflow: hidden;

  .push {
    /deep/ .el-form-item__content {
      float: left;
      margin-left: 10px !important;
    }

    /deep/ .el-dialog__header {
      background-color: #1ec695;
      text-align: left;
      font-size: 15px;
      color: white;
    }

    /deep/ .el-dialog__close {
      color: white !important;
      font-size: 25px;
      margin: -5px -5px;
    }

    /deep/ label {
      color: #99a9bf;
    }
  }

  * {
    box-sizing: border-box;
  }

  .homeTop {
    background: white;

    .statisWrap {
      padding: 20px 0;
      display: flex;
      justify-content: space-around;

      .item {
        font-size: 14px;
        font-weight: 700;
        height: 90px;
        padding: 15px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 18.5%;

        .num {
          font-size: 20px;
          padding-right: 15px;
          text-align: right;
        }

        &:nth-child(1) {
          background: linear-gradient(270deg, rgba(30, 198, 149, 1) 0%, rgba(30, 198, 149, 1) 0%, rgba(51, 204, 204, 1) 100%, rgba(51, 204, 204, 1) 100%);
        }

        &:nth-child(2) {
          background: linear-gradient(0deg, rgba(244, 174, 149, 1) 0%, rgba(244, 174, 149, 1) 0%, rgba(226, 113, 140, 1) 100%, rgba(226, 113, 140, 1) 100%);
        }

        &:nth-child(3) {
          background: linear-gradient(270deg, rgba(255, 153, 51, 1) 0%, rgba(255, 153, 51, 1) 0%, rgba(239, 203, 45, 1) 100%, rgba(239, 203, 45, 1) 100%);
        }

        &:nth-child(4) {
          background: linear-gradient(270deg, rgba(45, 169, 250, 1) 0%, rgba(45, 169, 250, 1) 0%, rgba(102, 204, 255, 1) 100%, rgba(102, 204, 255, 1) 100%);
        }

        &:nth-child(5) {
          background: linear-gradient(270deg, rgba(170, 137, 254, 1) 0%, rgba(170, 137, 254, 1) 0%, rgba(204, 153, 204, 1) 100%, rgba(204, 153, 204, 1) 100%);
        }
      }
    }
  }

  .userContent {
    display: flex;
    margin-top: 20px;

    .left {
      background: white;
      height: 380px;
      padding-top: 23px;
      width: 276px;
      margin-right: 20px;

      .imgWrap {
        display: flex;
        justify-content: center;
        margin: auto;
        width: 60px;
        height: 60px;

        img {
          width: 57px;
          height: 57px;
          border-radius: 50%;
        }
      }

      .name {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 18px;
        margin-top: 3px;
      }

      .expireTime {
        text-align: center;
        margin-bottom: 18px;
      }

      .content {
        margin-left: 30px;
        margin-bottom: 10px;

        .title {
          color: #d6d7d9;
          margin-right: 5px;
        }

        .setBtn {
          display: inline-block;
          width: 60px;
          height: 20px;
          border: 1px #3a78d6 solid;
          border-radius: 10px;
          background-color: #fff;
          color: #3a78d6;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
          margin-left: 20px;
        }
      }

      .btn {
        text-align: center;

        .recharge {
          background: #1ba9e9;
          cursor: pointer;
          display: inline-block;
          width: 137px;
          height: 30px;
          border-radius: 18px;
          color: white;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          margin-top: 10px;

          &.disable {
            background: gray;
          }
        }
      }
    }

    .right {
      flex: 1;
      background: white;
      height: 380px;
      padding: 20px;
      display: flex;
      flex-direction: column;

      .title {
        height: 20px;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

  .bottomContent {
    margin-top: 20px;

    .left {
      height: 380px;
      background: white;
      position: relative;

      .title {
        height: 60px;
        line-height: 60px;
        margin-left: 10px;
        font-weight: bold;
      }

      .item {
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        cursor: pointer;

        .itemContent {
          float: left;
          display: inline-block;
          width: 360px;
          height: 50px;
          line-height: 50px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .itemTime {
          float: right;
          display: inline-block;
          width: 170px;
          height: 50px;
          line-height: 50px;
          text-align: left;
        }
      }

      .tableMsg {
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
      }

      .item:hover {
        background-color: #f4f4f4;
      }
    }

    .right {
      height: 380px;
      background: white;
    }
  }

  .googleWrap {
    #qrcode {
      width: 128px;
      height: 128px;
      margin: 0 auto;
    }

    .keys {
      margin-top: 10px;
      text-align: center;
    }

    .notice {
      width: 100%;
      text-align: center;

      .noticeTitle {
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;

        span {
          font-weight: 600;
        }
      }

      .noticeContent {
        width: 100%;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
</style>