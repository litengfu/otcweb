<template>
  <div class="transfer accountInfoQuery">
    <el-tabs v-model="tab">
      <el-tab-pane label="买币" name="买币">
        <div style="margin-top:14px;">
          <el-form label-position="left" class="demo-table-expand" label-width="100px">
            <el-form-item label="购买币种:" :rules="[{required:true}]">
              <span>USDT (1U = {{uCNY}} CNY)</span>
            </el-form-item>
            <el-form-item label="支付方式:" :rules="[{required:true}]">
              <el-radio-group v-model="buyForm.qcodeType">
                <el-radio label="银行卡">银行卡</el-radio>
                <el-radio label="支付宝">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="金额:" :rules="[{required:true}]" class="computed">
              <div class="computedWrap">
                <span class="inputWrap" style="border-right:0;">
                  <el-input placeholder="请输入购买金额" type="number" v-model="buyForm.orderAmt" style="width:200px;" @input="_moneyInput"></el-input>
                  <span class="text">CNY</span>
                </span>
                <span class="change">
                  <img src="../../../static/img/change.png" alt="" width="43">
                </span>
                <span class="inputWrap" style="border-left:0;">
                  <el-input placeholder="请输入购买数量" type="number" v-model="buyForm.uNum" style="width:200px;" @input="_numInput"></el-input>
                  <span class="text">USDT</span>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="转账地址:" :rules="[{required:true}]">
              <el-input type="text" v-model="buyForm.uAddr" placeholder="请输入USDT转账地址" style="width: 542px;">
              </el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" style="width: 542px;height: 50px" :maxlength="128" v-model="buyForm.orderRsv" placeholder="请输入备注"></el-input>
            </el-form-item>
            <div style="margin-left:100px;margin-top:20px;" class="dialog-footer">
              <el-button type="danger" @click="_saveList" :loading="saveLoading" style="background-color: #1ec695;border:1px solid #1ec695;">立即购买</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="卖币" name="卖币">
        <div style="margin-top:14px;">
          <el-form label-position="left" class="demo-table-expand" label-width="100px">
            <el-form-item label="出售币种:" :rules="[{required:true}]">
              <span>USDT (1U = {{uCNY}} CNY)</span>
            </el-form-item>
            <el-form-item label="支付方式:" :rules="[{required:true}]">
              <el-radio-group v-model="sellForm.qcodeType">
                <el-radio label="银行卡">银行卡</el-radio>
                <el-radio label="支付宝">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="金额:" :rules="[{required:true}]" class="computed">
              <div class="computedWrap">
                <span class="inputWrap" style="border-right:0;">
                  <el-input placeholder="请输入购买金额" type="number" v-model="sellForm.orderAmt" style="width:200px;" @input="_moneyInput"></el-input>
                  <span class="text">CNY</span>
                </span>
                <span class="change">
                  <img src="../../../static/img/change.png" alt="" width="43">
                </span>
                <span class="inputWrap" style="border-left:0;">
                  <el-input placeholder="请输入购买数量" type="number" v-model="sellForm.uNum" style="width:200px;" @input="_numInput"></el-input>
                  <span class="text">USDT</span>
                </span>
              </div>
            </el-form-item>
            <template v-if="sellForm.qcodeType=='银行卡'">
              <el-form-item label="银行卡号:" :rules="[{required:true}]">
                <el-input type="text" v-model="sellForm.bankAccNo" placeholder="请输入银行卡号" style="width: 542px;">
                </el-input>
              </el-form-item>
              <el-form-item label="银行卡姓名:" :rules="[{required:true}]">
                <el-input type="text" v-model="sellForm.bankAccName" placeholder="请输入银行卡姓名" style="width: 542px;">
                </el-input>
              </el-form-item>
              <el-form-item label="银行名称:" :rules="[{required:true}]">
                <el-input type="text" v-model="sellForm.bankName" placeholder="请输入银行名称" style="width: 542px;">
                </el-input>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="支付宝姓名:" :rules="[{required:true}]">
                <el-input type="text" v-model="sellForm.aliName" placeholder="请输入支付宝姓名" style="width: 542px;">
                </el-input>
              </el-form-item>
              <el-form-item label="支付宝账号:" :rules="[{required:true}]">
                <el-input type="text" v-model="sellForm.aliNo" placeholder="请输入支付宝账号" style="width: 542px;">
                </el-input>
              </el-form-item>
            </template>
            <el-form-item label="备注:">
              <el-input type="textarea" style="width: 542px;height: 50px" :maxlength="128" v-model="sellForm.orderRsv" placeholder="请输入备注"></el-input>
            </el-form-item>
            <div style="margin-left:100px;margin-top:20px;" class="dialog-footer">
              <el-button type="danger" @click="_saveList" :loading="saveLoading" style="background-color: #1ec695;border:1px solid #1ec695;">立即出售</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import com from "../../common";
import API from "../../api";

function getFormReq(qcodeType = "") {
  let param = {};
  if (qcodeType == "银行卡") {
    param = {
      bankAccNo: {
        isNoEmpty: "请输入银行卡号",
      },
      bankAccName: {
        isNoEmpty: "请输入银行卡姓名",
      },
      bankName: {
        isNoEmpty: "请输入银行名称",
      },
    };
  } else if (qcodeType == "支付宝") {
    param = {
      aliName: {
        isNoEmpty: "请输入支付宝姓名",
      },
      aliNo: {
        isNoEmpty: "请输入支付宝账号",
      },
    };
  }
  let formReq = {
    curcd: {
      isNoEmpty: "请输入币种",
    },
    qcodeType: {
      isNoEmpty: "请选择支付方式",
    },
    orderAmt: {
      isNoEmpty: "请输入金额",
      isNoNegative: "金额必须大于0",
    },
    uAddr: {
      isNoEmpty: "请输入转账地址(USDT)",
    },
  };
  return Object.assign(formReq, param);
}
export default {
  data() {
    return {
      tab: "买币",
      saveLoading: false,
      //卖出
      sellForm: {
        curcd: "USDT",
        orderAmt: "",
        orderRsv: "",
        qcodeType: "银行卡",
        bankAccNo: "",
        bankAccName: "",
        bankName: "",
        aliName: "",
        aliNo: "",
        uNum: "",
      },
      //买币
      buyForm: {
        curcd: "USDT",
        orderAmt: "",
        orderRsv: "",
        qcodeType: "银行卡",
        uNum: "",
        uAddr: "",
      },
      uCNY: "", //汇率
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this._getuCNY(); //获取转换汇率
  },
  methods: {
    _moneyInput: function (val) {
      //转换
      switch (this.tab) {
        case "买币":
          this.buyForm.uNum = (val / this.uCNY).toFixed(2);
          break;
        case "卖币":
          this.sellForm.uNum = (val / this.uCNY).toFixed(2);
          break;
      }
    },
    _numInput: function (val) {
      //转换
      switch (this.tab) {
        case "买币":
          this.buyForm.orderAmt = (val * this.uCNY).toFixed(2);
          break;
        case "卖币":
          this.sellForm.orderAmt = (val * this.uCNY).toFixed(2);
          break;
      }
    },
    _getuCNY() {
      //获取转换汇率
      API.phLogin("/getuCNY.do").then((res) => {
        if (res.data.code == "0000") {
          this.uCNY = res.data.data.price;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _saveList() {
      //提交申请
      let url, param;
      switch (this.tab) {
        case "买币":
          if (!com._checkParam(this.buyForm, getFormReq())) {
            return;
          }
          url = "/buyTxn.do";
          param = {
            userId: this.UserId,
            ...this.buyForm,
          };
          delete param.orderAmt;
          break;
        case "卖币":
          if (
            !com._checkParam(this.sellForm, getFormReq(this.sellForm.qcodeType))
          ) {
            return;
          }
          url = "/sellTxn.do";
          param = {
            userId: this.UserId,
            ...this.sellForm,
          };
          if (this.sellForm.qcodeType == "银行卡") {
            Object.assign(param, {
              aliName: "",
              aliNo: "",
            });
          } else {
            Object.assign(param, {
              bankName: "",
              bankAccNo: "",
              bankAccName: "",
            });
          }
          delete param.orderAmt;
          break;
      }
      this.saveLoading = true;
      API.phLogin(url, param).then(
        (res) => {
          this.saveLoading = false;
          if (res.data.code == "0000") {
            this.buyForm = {
              curcd: "USDT",
              orderAmt: "",
              orderRsv: "",
              qcodeType: "银行卡",
              uNum: "",
              uAddr: "",
            };
            this.sellForm = {
              curcd: "USDT",
              orderAmt: "",
              orderRsv: "",
              qcodeType: "银行卡",
              bankName: "",
              bankAccNo: "",
              bankAccName: "",
              aliName: "",
              aliNo: "",
              uNum: "",
            };
            this.$message.success("交易成功");
          } else if (res.data.code == "9999") {
            this.$router.push("/login");
            this.$message.error("登录已失效,请重新登录!");
          } else {
            this.$message.error(res.data.msg);
          }
        },
        (res) => {
          this.saveLoading = false;
        }
      );
    },
  },
};
</script>
<style scoped lang="stylus">
.transfer {
  background-color: #f0f4f6;

  /deep/ .el-radio__label {
    font-size: 17px;
  }

  .computed {
    .computedWrap {
      display: flex;
      align-items: center;
    }

    .inputWrap {
      height: 42px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      width: 220px;

      .text {
        padding: 0 20px;
        font-size: 20px;
        color: #05b570;
      }

      /deep/ input {
        height: 100%;
        padding: 10px 12px 10px 12px;
        width: 100%;
        border: 0;
        color: #000;
      }
    }

    .change {
      height: 42px;
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      border: 1px solid #cecece;
      border-right: 0;
      border-left: 0;
    }
  }
}

.accountInfoQuery {
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
}

.demo-table-expand {
  text-align: left;
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
</style>