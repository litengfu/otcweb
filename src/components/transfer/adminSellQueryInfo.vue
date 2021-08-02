<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker size="small" format="yyyy-MM-dd" v-model="formInline.tDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select size="small" v-model="formInline.orderStatus" placeholder="请选择" style="width: 180px">
            <el-option value="">默认</el-option>
            <el-option value="交易成功">交易成功</el-option>
            <el-option value="待处理">待处理</el-option>
            <el-option value="处理中">处理中</el-option>
            <el-option value="已付款">已付款</el-option>
            <el-option value="交易失败">交易失败</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" type="text" v-model="formInline.orderNo" placeholder="平台订单号/下游订单号" autocomplete="off" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" type="text" v-model="formInline.userId" placeholder="商户ID" autocomplete="off" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询
          </el-button>
          <el-button size="small" icon="el-icon-download" style="background-color: #ff6838;color:white;" @click="_exportClick">导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column label="商户信息" width="160">
          <template slot-scope='scope'>
            <div style="font-size: 12px">商户ID:{{scope.row.userId}}</div>
            <div style="font-size: 12px">商户名称:{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="100">
          <template slot-scope="scope">
            <span :style="{color:scope.row.orderType=='买入'?'green':'red'}">{{scope.row.orderType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmt" label="订单金额(CNY)" width="180"></el-table-column>
        <el-table-column prop="uNum" label="数量(U)" width="100">
        </el-table-column>
        <el-table-column label="转账机构" width="120">
          <template slot-scope='scope'>
            <div v-if="scope.row.qcodeType=='银行卡'" style="font-size: 12px">{{scope.row.bankName}}</div>
            <div v-else style="font-size: 12px">{{scope.row.qcodeType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="转账账户" width="200">
          <template slot-scope='scope'>
            <div v-show="scope.row.qcodeType=='银行卡'" style="font-size: 12px">卡号:{{scope.row.bankAccNo}}</div>
            <div v-show="scope.row.qcodeType=='银行卡'" style="font-size: 12px">姓名:{{scope.row.bankAccName}}</div>
            <div v-show="scope.row.qcodeType!='银行卡'" style="font-size: 12px">账号:{{scope.row.aliNo}}</div>
            <div v-show="scope.row.qcodeType!='银行卡'" style="font-size: 12px">姓名:{{scope.row.aliName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template slot-scope='scope'>
            <div v-if="scope.row.orderStatus=='交易成功'" style="color: green;width: 80px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.orderStatus}}</div>
            <div v-if="scope.row.orderStatus=='待处理'" style="color: orange;width: 80px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.orderStatus}}</div>
            <div v-if="scope.row.orderStatus=='处理中'" style="color: coral;width: 80px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.orderStatus}}</div>
            <div v-if="scope.row.orderStatus=='已付款'" style="color: #00AA88;width: 80px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.orderStatus}}</div>
            <div v-if="scope.row.orderStatus=='交易失败'" style="color: red;width: 80px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.orderStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="200">
          <template slot-scope='scope'>
            <div style="font-size: 12px">创建时间:{{scope.row.crtTime}}</div>
            <div style="font-size: 12px">完成时间:{{scope.row.upTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-info" size="small" style="background-color: #78909C;color:white;" @click="userinfo(scope.row.orderNo,1)">详情</el-button>
              <el-button type="success" @click="notifyClick(scope.row)" icon="el-icon-check" size="small" :disabled="scope.row.orderStatus=='交易成功' || scope.row.orderStatus=='交易失败'">手动结算
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableMsg">
        <el-pagination layout="prev, pager, next" @current-change="currentC" :page-size="1" :total="allPage">
        </el-pagination>
      </div>
    </div>
    <!--详情-->
    <el-dialog class="instAbout" :visible.sync="instAboutBtn">
      <div slot="title" class="dialog-footer">
        <span>详情信息</span>
      </div>
      <el-form label-position="left" inline class="demo-table-expand">
        <template>
          <el-form-item label="订单号:">
            <span>{{instAboutList.orderNo}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="订单金额(CNY):">
            <span>{{instAboutList.orderAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="手续费(USDT):">
            <span>{{instAboutList.orderFee}} U&nbsp;</span>
          </el-form-item>
          <el-form-item label="数量(USDT):">
            <span>{{instAboutList.uNum}} U&nbsp;</span>
          </el-form-item>
          <el-form-item label="转账地址(USDT):">
            <span :style="{fontSize:instAboutList.uAddr && instAboutList.uAddr.length>20?'12px':'14px'}">{{instAboutList.uAddr}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="订单类型:">
            <span>{{instAboutList.orderType}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="订单状态:">
            <span>{{instAboutList.orderStatus}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="订单备注:">
            <div style="width: 600px!important;color:red;">{{instAboutList.orderRsv}}&nbsp;</div>
          </el-form-item>
          <el-form-item label="审核备注:">
            <div style="width: 600px!important;color:red;">{{instAboutList.chkRsv}}&nbsp;</div>
          </el-form-item>
          <el-form-item label="下游订单号:">
            <span>{{instAboutList.mchtOrderNo}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="回调地址:">
            <span>{{instAboutList.mchtBackUrl}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="回调状态:">
            <span>{{instAboutList.mchtBackSta}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="操作员ID:">
            <span>{{instAboutList.operId}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="操作员名称:">
            <span>{{instAboutList.operName}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{instAboutList.crtTime}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="更新时间:">
            <span>{{instAboutList.upTime}}&nbsp;</span>
          </el-form-item>
          <el-form-item label>
            <span></span>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="instAboutBtn = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 手动结算 -->
    <el-dialog class="push" :visible.sync="checkDialog" width="550px">
      <div slot="title" class="dialog-footer">
        <span>手动结算</span>
      </div>
      <el-form :model="checkForm" status-icon ref="ruleForm1" label-width="150px" class="demo-ruleForm1">
        <el-form-item label="订单号:" style="text-align:left;">
          <div>{{checkForm.orderNo}}</div>
        </el-form-item>
        <el-form-item label="创建时间:" style="text-align:left;">
          <div>{{checkForm.crtTime}}</div>
        </el-form-item>
        <el-form-item label="订单状态:" style="text-align:left;">
          <el-radio v-model="checkForm.flag" label="交易成功" style="margin-top:14px;">交易成功</el-radio>
          <br>
          <el-radio v-model="checkForm.flag" label="交易失败" style="margin-top:9px;margin-bottom:15px;">交易失败</el-radio>
          <br>
        </el-form-item>
        <el-form-item label="备注:" style="text-align:left;">
          <el-input type="textarea" style="width: 330px;height: 50px" v-model="checkForm.chkRsv" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialog = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="_checkClick()">确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from "../../api";
import com from "../../common";
export default {
  data() {
    return {
      UserId: "",
      instAboutBtn: false,
      CurPage: 1,
      allPage: 1,
      // 查询
      formInline: {
        userId: "",
        tDate: [new Date(), new Date()],
      },
      instAboutList: {},
      tableData: [],
      //手动结算
      checkDialog: false,
      checkForm: {
        orderNo: "",
        flag: "交易成功",
        chkRsv: "",
        crtTime: "",
      },
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
  },
  mounted() {
    this.onSubmit();
  },
  methods: {
    _exportClick() {
      //导出
      let msg = "是否导出卖出订单?";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.ExlLoading) {
            this.$message.warning("操作频繁，请稍后重试!");
            return;
          }
          let tDate = this.formInline.tDate;
          if (tDate == null || tDate == undefined) {
            this.$message.error("请选择日期后提交");
            return;
          }
          this.loading = this.$loading({
            lock: true,
            text: "正在下载",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.ExlLoading = true;
          let _this = this;

          let data = {
            userId: this.UserId,
            beginDate: API.format(tDate[0], "yyyyMMdd"),
            endDate: API.format(tDate[1], "yyyyMMdd"),
            exportCnt: "0",
            exportList: [],
            orderType: "卖出",
          };
          API.phLogin("/txnExport.do", data).then((res) => {
            if (res.data.code == "0000") {
              const link = document.createElement("a");
              let data = res.data.data;
              let loadingUrl =
                API.getexporturl() + "/export/" + data.exportFile;
              link.style.display = "none";
              link.href = loadingUrl;
              link.setAttribute("download", "卖出订单导出明细");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              _this.loading.close();
              setTimeout(() => {
                _this.ExlLoading = false;
              }, 1000);
              this.$message.success("数据已成功导出！");
            } else if (res.data.code == "9999") {
              this.$router.push("/login");
              this.$message.error("登录已失效,请重新登录!");
              _this.loading.close();
            } else {
              this.$message.error(res.data.msg);
              _this.loading.close();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    notifyClick(val1) {
      //开启手动结算弹框
      this.checkDialog = true;
      this.checkForm = {
        orderNo: val1.orderNo,
        flag: "交易成功",
        crtTime: val1.crtTime,
        chkRsv: "",
      };
    },
    _checkClick() {
      //手动确认代付审核
      let data = {
        userId: this.UserId,
        orderNo: this.checkForm.orderNo || "",
        flag: this.checkForm.flag || "",
        chkRsv: this.checkForm.chkRsv || "",
      };
      API.phLogin("/chkTxn.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("操作成功");
          this.clearTab();
          this.nextSubmit();
          this.checkDialog = false;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    currentC(page) {
      this.CurPage = page;
      this.clearTab();
      this.nextSubmit();
    },
    clearTab() {
      this.tableData = [];
    },
    onSubmit() {
      // 查询按钮
      this.currentC(1);
    },
    nextSubmit() {
      // 查询数据
      let tDate = this.formInline.tDate;
      let orderNo = this.formInline.orderNo || "";
      let orderStatus = this.formInline.orderStatus || "";
      if (tDate == null || tDate == undefined) {
        this.$message.error("请选择日期后提交");
        return;
      }
      let data = {
        operId: this.UserId,
        beginDate: API.format(tDate[0], "yyyyMMdd"),
        endDate: API.format(tDate[1], "yyyyMMdd"),
        orderNo,
        orderStatus,
        orderType: "卖出",
        userId: this.formInline.userId || "",
        curPage: this.CurPage.toString(),
      };
      API.phLogin("/selTxnListS.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          this.allPage = parseInt(data.totPage);
          this.tableData = data.reSult;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    userinfo(val2) {
      //详情
      let orderNo = val2;
      this.instAboutBtn = true;
      this.instAboutList = {};
      let data = {
        userId: this.UserId,
        orderNo: orderNo,
      };
      API.phLogin("/selTxnInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.instAboutList = res.data.data;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>


<style scoped lang="stylus">
.userInfoQuery {
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-sizing: border-box;

  .queryD {
    padding: 10px 22px 0 0;

    .demo-form-inline {
      margin-bottom: 22px;

      .el-form-item {
        margin-bottom: 0px;
      }
    }

    .el-form--inline {
      .el-form-item {
        margin-right: 5px;
      }
    }
  }
}

.tableMsg {
  padding-top: 15px;
}

.userInfoQuery /deep/ .el-form-item__content {
  text-align: left;
}

.userInfoQuery /deep/ .instAbout .el-form-item__content {
  float: left;
  width: 230px !important;
}

.userInfoQuery /deep/ .push .el-form-item__content {
  float: left;
  margin-left: 10px !important;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 49.5%;
}

.userInfoQuery /deep/ .instAbout .el-dialog {
  width: 800px;
}

.userInfoQuery /deep/ .push .el-dialog {
  width: 650px;
}

.userInfoQuery /deep/ .instAbout .demo-table-expand label {
  width: 130px !important;
  float: left;
  color: #99a9bf;
}

.userInfoQuery /deep/ .push label {
  width: 130px !important;
  float: left;
  color: #99a9bf;
}

.userInfoQuery /deep/ .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.userInfoQuery /deep/ .push .el-dialog__header {
  background-color: #1ec695;
  text-align: left;
  font-size: 15px;
  color: white;
}

.userInfoQuery >>> input::-webkit-outer-spin-button, .userInfoQuery >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.userInfoQuery >>> input[type='number'] {
  -moz-appearance: textfield;
}

.userInfoQuery /deep/ .instAbout2 .el-dialog__header {
  background-color: #1ec695;
  text-align: left;
  font-size: 15px;
  color: white;
}

.userInfoQuery /deep/ .instAbout2 .demo-table-expand label {
  width: 130px !important;
  float: left;
  color: #99a9bf;
}

.userInfoQuery /deep/ .instAbout2 .el-dialog {
  width: 580px;
}

.demo-ruleForm1 .el-form-item {
  margin-bottom: 0 !important;
}
</style>
