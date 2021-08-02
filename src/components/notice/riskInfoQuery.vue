<template>
  <div class="accountInfoQuery">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="交易设置" name="FK0001">
        <div style="color:rgb(255, 133, 78);margin-bottom:20px;background:rgb(255, 243, 212);padding:5px;text-align:left;">
          请设置平台风控，商户创建订单时自动检查风控。
        </div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="检查状态:">
            <el-switch v-model="formChange.riskStatus" active-color="#13ce66" class="asta" active-value="启用" inactive-value="禁用" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="当日限额(U):">
            <el-input type="number" v-model="formChange.allAmt" placeholder="请输入当日限额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>

          <el-form-item label="最小金额(U):">
            <el-input type="number" v-model="formChange.minAmt" placeholder="请输入最小金额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>
          <el-form-item label="最大金额(U):">
            <el-input type="number" v-model="formChange.maxAmt" placeholder="请输入最大金额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>
          <el-form-item label="工作时间:">
            <el-time-picker is-range arrow-control v-model="BTxTime" range-separator="至" start-placeholder="起始交易时间" end-placeholder="结束交易时间" placeholder="选择时间范围" style="width: 348px;">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="充值地址(USDT):">
            <el-input type="text" v-model="formChange.curcdAddr" placeholder="请输入充值地址" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>
          <div style="text-align: right" class="dialog-footer">
            <el-button type="primary" style="background-color: #1ec695;border:0;" @click="update">保存</el-button>
          </div>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="提现设置" name="FK0002">
        <div style="color:rgb(255, 133, 78);margin-bottom:20px;background:rgb(255, 243, 212);padding:5px;text-align:left;">
          请设置平台风控，商户创建订单时自动检查风控。
        </div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="检查状态:">
            <el-switch v-model="formChange.riskStatus" active-color="#13ce66" class="asta" active-value="启用" inactive-value="禁用" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="提现限额(U):">
            <el-input type="number" v-model="formChange.allAmt" placeholder="请输入提现限额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>

          <el-form-item label="最小金额(U):">
            <el-input type="number" v-model="formChange.minAmt" placeholder="请输入最小金额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>
          <el-form-item label="最大金额(U):">
            <el-input type="number" v-model="formChange.maxAmt" placeholder="请输入最大金额" autocomplete="off" style="width: 600px;"></el-input>
          </el-form-item>
          <el-form-item label="工作时间:">
            <el-time-picker is-range arrow-control v-model="BTxTime" range-separator="至" start-placeholder="起始交易时间" end-placeholder="结束交易时间" placeholder="选择时间范围" style="width: 348px;">
            </el-time-picker>
          </el-form-item>
          <div style="text-align: right" class="dialog-footer">
            <el-button type="primary" style="background-color: #1ec695;border:0;" @click="update">保存</el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import API from "../../api";
import com from "../../common";
function getFormReq(mes) {
  const formReq = {
    riskStatus: {
      isNoEmpty: "请选择风控状态！",
    },
    allAmt: {
      isNoEmpty: mes == "FK0001" ? "请输入当日限额！" : "请输入提现限额！",
      isNoNegative:
        mes == "FK0001" ? "请输入正确的当日限额！" : "请输入正确的提现限额！",
    },
    minAmt: {
      isNoEmpty: "请输入最小金额",
      isNoNegative: "请输入正确的最小金额！",
    },
    maxAmt: {
      isNoEmpty: "请输入最大金额",
      isNoNegative: "请输入正确的最大金额！",
      isArea: ["minAmt", "maxAmt", "最大金额必须大于最小金额！"],
    },
  };
  let param = {
    curcdAddr: {
      isNoEmpty: "请输入充值地址",
    },
  };
  mes == "FK0001" ? Object.assign(formReq, param) : "";
  return formReq;
}

export default {
  data() {
    return {
      BTxTime: [],
      UserId: "",
      activeName: "FK0001",
      formChange: {
        riskStatus: "",
        allAmt: "",
        minAmt: "",
        maxAmt: "",
        curcdAddr: "",
      },
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this.userinfo();
  },
  methods: {
    handleClick(tab, event) {
      //切换tab
      this.userinfo();
    },
    userinfo() {
      //查询设置
      let data = {
        userId: this.UserId,
        riskId: this.activeName,
      };
      API.phLogin("/selRiskInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          this.betime(data.bTime, data.eTime);
          Object.assign(this.formChange, data);
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    update() {
      //保存
      if (!com._checkParam(this.formChange, getFormReq(this.activeName))) {
        //表单规则
        return;
      }
      let BTxTime = this.BTxTime;
      let bTime;
      let eTime;

      if (!BTxTime) {
        this.$message.error("请选择工作时间！");
        return;
      } else {
        let times = this.btxtime().split(":");
        bTime = times[0];
        eTime = times[1];
      }

      let data = {
        userId: this.UserId,
        riskId: this.activeName,
        riskStatus: this.formChange.riskStatus,
        minAmt: this.formChange.minAmt,
        maxAmt: this.formChange.maxAmt,
        bTime: bTime,
        eTime: eTime,
        allAmt: this.formChange.allAmt,
        curcdAddr: this.formChange.curcdAddr,
      };

      API.phLogin("/upRiskInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("风控信息保存成功！");
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    betime(bTime, eTime) {
      //解析时间
      let bTimes = bTime.split(":");
      let eTimes = eTime.split(":");
      let date1 = new Date();
      let date2 = new Date();
      date1.setHours(bTimes[0]);
      date1.setMinutes(bTimes[1]);
      date1.setSeconds(bTimes[2]);
      date2.setHours(eTimes[0]);
      date2.setMinutes(eTimes[1]);
      date2.setSeconds(eTimes[2]);
      this.BTxTime = [date1, date2];
    },
    btxtime() {
      //转换时间
      let bTxTime = this.BTxTime;
      let date1 = bTxTime[0];
      let date2 = bTxTime[1];
      let hours = this.changetime(date1.getHours());
      let seconds = this.changetime(date1.getSeconds());
      let minutes = this.changetime(date1.getMinutes());
      let hours2 = this.changetime(date2.getHours());
      let seconds2 = this.changetime(date2.getSeconds());
      let minutes2 = this.changetime(date2.getMinutes());
      let bTime = "" + hours + minutes + seconds;
      let eTime = "" + hours2 + minutes2 + seconds2;
      return bTime + ":" + eTime;
    },
    changetime(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    },
  },
};
</script>

<style scoped lang="stylus">
.accountInfoQuery {
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
}

.demo-table-expand {
  text-align: left;
  width: 720px;
}

.demo-table-expand /deep/ .el-form-item__label {
  width: 120px;
  text-align: right;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 20px;
  width: 100%;
}

/* 处理input type = number的上下箭头 */
.accountInfoQuery >>> input::-webkit-outer-spin-button, .accountInfoQuery >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.accountInfoQuery >>> input[type='number'] {
  -moz-appearance: textfield;
}

.accountInfoQuery /deep/ .shopsAboutChange .demo-table-expand label {
  width: 150px;
  padding-left: 12px;
  color: #99a9bf;
}

.accountInfoQuery /deep/ .shopsAboutChange .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 100%;
}

.accountInfoQuery /deep/ .shopsAboutChange .el-form-item__label {
  width: 400px;
  text-align: right;
  color: #99a9bf;
}

.accountInfoQuery /deep/ .shopsAboutChange .el-dialog {
  width: 521px;
}

.accountInfoQuery /deep/ .shopsAboutChange .el-dialog__header {
  background-color: #1ec695;
  text-align: left;
  font-size: 15px;
  color: white;
}

.accountInfoQuery /deep/ .shopsAboutChange .el-form-item__content {
  text-align: left;
}

.accountInfoQuery /deep/ .shopsAboutChange .el-dialog__body {
  padding-bottom: 10px;
}
</style>





