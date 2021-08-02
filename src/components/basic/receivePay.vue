<template>
  <div class="receivePay">
    <div style="background:#fff3d4;padding:5px;color:#ff854e;margin-bottom:20px;">
      需要提前添加收款银行卡或支付宝，商户创建好订单时系统会自动匹配。
    </div>
    <div class="bank">
      <div class="item" v-for="(item,index) in bankList" :key="index">
        <div class="itmeTop">
          <div>{{item.bankName}}</div>
          <div>{{item.bankAccNo}}</div>
          <div>姓名：{{item.bankAccName}}</div>
          <div style="margin-bottom:0;">状态：
            <el-switch v-model="item.qcodeStatus" active-color="#13ce66" class="asta" active-value="启用" inactive-value="禁用" @change="_edit(item.id,item.qcodeStatus,'银行卡')" inactive-color="#ff4949">
            </el-switch>
          </div>
          <div style="text-align:right;margin-bottom:0;cursor:pointer;">
            <div style="display:inline-block;margin-right:10px;" @click="_getInfo(item.id,'银行卡')">
              <i class="el-icon-warning-outline"></i>
              <span>详情</span>
            </div>
            <div style="display:inline-block" @click="_delete(item.id,'银行卡')">
              <i class="el-icon-delete"></i>
              <span>删除</span>
            </div>
          </div>
        </div>
        <div class="status">
          <img src="../../../static/img/yl.png" alt="" />
        </div>
      </div>
      <div class="item add" @click="addBankDialog=true">
        <i class="el-icon-plus"></i>
        <div>添加银行卡</div>
      </div>
    </div>
    <div class="bank zfb">
      <div class="item" v-for="(item,index) in zfbList" :key="index">
        <div class="itmeTop">
          <div>支付宝姓名：{{item.aliName}}</div>
          <div>账号：{{item.aliNo}}</div>
          <div style="margin-bottom:0;">状态：
            <el-switch v-model="item.qcodeStatus" active-color="#13ce66" class="asta" active-value="启用" inactive-value="禁用" @change="_edit(item.id,item.qcodeStatus,'支付宝')" inactive-color="#ff4949">
            </el-switch>
          </div>
          <div style="text-align:right;margin-bottom:0;cursor:pointer;">
            <div style="display:inline-block;margin-right:10px;" @click="_getInfo(item.id,'支付宝')">
              <i class="el-icon-warning-outline"></i>
              <span>详情</span>
            </div>
            <div style="display:inline-block" @click="_delete(item.id,'支付宝')">
              <i class="el-icon-delete"></i>
              <span>删除</span>
            </div>
          </div>
        </div>
        <div class="status">
          <i class="iconfont icon-zfb" style="font-size:35px;color:rgb(6, 180, 253)"></i>
        </div>
      </div>
      <div class="item add" @click="addZFBDialog=true">
        <i class="el-icon-plus"></i>
        <div>添加支付宝</div>
      </div>
    </div>
    <!-- 银行卡添加 -->
    <el-dialog class="shopsAboutChange" :visible.sync="addBankDialog" width="550px">
      <div slot="title" class="dialog-footer">
        <span>银行卡添加</span>
      </div>
      <el-form :model="bankForm" status-icon label-width="100px">
        <el-form-item label="银行卡号:" :rules="[{required:true}]">
          <el-input type="number" v-model="bankForm.bankAccNo" placeholder="请输入银行卡号" autocomplete="off" style="width: 348px;" v-on:blur="bankinfo(bankForm.bankAccNo)"></el-input>
        </el-form-item>
        <el-form-item label="银行卡姓名:" :rules="[{required:true}]">
          <el-input type="text" v-model="bankForm.bankAccName" placeholder="请输入银行卡姓名" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="银行名称:" :rules="[{required:true}]">
          <el-input type="text" v-model="bankForm.bankName	" placeholder="请输入银行名称" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="入金限额:" :rules="[{required:true}]">
          <el-input type="text" v-model="bankForm.czAmt" placeholder="请输入入金限额" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="出金限额:" :rules="[{required:true}]">
          <el-input type="text" v-model="bankForm.txAmt" placeholder="请输入出金限额" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBankDialog = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="_addBank()">确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 支付宝添加 -->
    <el-dialog class="shopsAboutChange" :visible.sync="addZFBDialog" width="550px">
      <div slot="title" class="dialog-footer">
        <span>支付宝添加</span>
      </div>
      <el-form :model="ZFBForm" status-icon label-width="100px">
        <el-form-item label="支付宝姓名:" :rules="[{required:true}]">
          <el-input type="text" v-model="ZFBForm.aliName	" placeholder="请输入支付宝姓名" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号:" :rules="[{required:true}]">
          <el-input type="text" v-model="ZFBForm.aliNo" placeholder="请输入支付宝账号" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="入金限额:" :rules="[{required:true}]">
          <el-input type="text" v-model="ZFBForm.czAmt" placeholder="请输入入金限额" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
        <el-form-item label="出金限额:" :rules="[{required:true}]">
          <el-input type="text" v-model="ZFBForm.txAmt" placeholder="请输入出金限额" autocomplete="off" style="width: 348px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addZFBDialog = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="_addZFB()">确定
        </el-button>
      </div>
    </el-dialog>
    <!--银行卡详情-->
    <el-dialog class="instAbout detail" :visible.sync="bankDetailDialog" width="500px">
      <div slot="title" class="dialog-footer">
        <span>详情信息</span>
      </div>
      <el-form label-position="left" class="demo-table-expand">
        <div style="border: 1px solid rgba(1, 1, 1, 0.2);">
          <el-form-item label="姓名:">
            <span>{{bankDetail.bankAccName}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="银行卡号:">
            <span>{{bankDetail.bankAccNo}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="银行名称:">
            <span>{{bankDetail.bankName}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="入金限额(元):">
            <span>￥{{bankDetail.czAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="出金限额(元):">
            <span>￥{{bankDetail.txAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="状态:">
            <span>{{bankDetail.qcodeStatus}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{bankDetail.crtTime}}&nbsp;</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bankDetailDialog = false">确定</el-button>
      </div>
    </el-dialog>
    <!--支付宝详情-->
    <el-dialog class="instAbout detail" :visible.sync="ZFBDetailDialog" width="500px">
      <div slot="title" class="dialog-footer">
        <span>详情信息</span>
      </div>
      <el-form label-position="left" class="demo-table-expand">
        <div style="border: 1px solid rgba(1, 1, 1, 0.2);">
          <el-form-item label="支付宝姓名:">
          <span>{{ZFBDetail.aliName}}&nbsp;</span>
          </el-form-item> 
          <el-form-item label="支付宝账号:">
            <span>{{ZFBDetail.aliNo}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="入金限额(元):">
            <span>￥{{ZFBDetail.czAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="出金限额(元):">
            <span>￥{{ZFBDetail.txAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="状态:">
            <span>{{ZFBDetail.qcodeStatus}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ZFBDetail.crtTime}}&nbsp;</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ZFBDetailDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from "../../api";
import com from "../../common";
function getFormReq(type = "") {
  let param = {};
  if (type == "银行卡") {
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
      czAmt: {
        isNoEmpty: "请输入入金限额",
        isNoNegative: "入金限额必须大于0",
      },
      txAmt: {
        isNoEmpty: "请输出金限额",
        isNoNegative: "出金限额必须大于0",
      },
    };
  } else {
    param = {
      aliName: {
        isNoEmpty: "请输入支付宝姓名",
      },
      aliNo: {
        isNoEmpty: "请输入支付宝账号",
      },
      czAmt: {
        isNoEmpty: "请输入入金限额",
        isNoNegative: "入金限额必须大于0",
      },
      txAmt: {
        isNoEmpty: "请输出金限额",
        isNoNegative: "出金限额必须大于0",
      },
    };
  }
  return param;
}
export default {
  data() {
    return {
      bankList: [],
      zfbList: [],
      addBankDialog: false,
      bankForm: {
        bankAccName: "",
        bankAccNo: "",
        bankName: "",
        czAmt: "",
        txAmt: "",
      }, //银行卡
      bankDetailDialog: false,
      bankDetail: {},
      addZFBDialog: false,
      ZFBForm: {
        aliName: "",
        aliNo: "",
        czAmt: "",
        txAmt: "",
      }, //支付宝
      ZFBDetailDialog: false,
      ZFBDetail: {},
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this._getBankList(); //获取银行卡列表
    this._getZFBList(); //获取支付宝列表
  },
  methods: {
    bankinfo(val, val2) {
      //匹配银行名称
      if (this.bankForm.bankName == "自动匹配失败" || !this.bankForm.bankName) {
        var BIN = require("bankcardinfo");
        BIN.getBankBin(val, (err, data) => {
          if (!err) {
            //6222005865412565805
            this.bankForm.bankName = data.bankName;
          } else {
            this.bankForm.bankName = "自动匹配失败";
            this.$message.error(
              "银行卡信息匹配失败 请仔细核对银行卡号，或者手动输入银行名称！"
            );
          }
          this.$forceUpdate();
        });
      }
    },
    _getBankList() {
      //获取银行卡列表
      let data = {
        operId: this.UserId,
      };
      API.phLogin("/selBank.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.bankList = res.data.data.reSult;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _addBank() {
      //银行卡添加
      if (!com._checkParam(this.bankForm, getFormReq("银行卡"))) {
        return;
      }
      let data = {
        operId: this.UserId,
        ...this.bankForm,
      };
      API.phLogin("/addBank.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("添加成功");
          this.bankForm = {
            bankAccName: "",
            bankAccNo: "",
            bankName: "",
            czAmt: "",
            txAmt: "",
          };
          this._getBankList();
          this.addBankDialog = false;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _delete(id, type = "") {
      //删除银行卡
      let msg = `此操作将删除此${type}, 是否继续?`;
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            operId: this.UserId,
            id,
          };
          API.phLogin("/delBank.do", data).then((res) => {
            if (res.data.code == "0000") {
              this.$message.success("删除成功");
              if (type == "银行卡") {
                this._getBankList();
              } else {
                this._getZFBList();
              }
            } else if (res.data.code == "9999") {
              this.$router.push("/login");
              this.$message.error("登录已失效,请重新登录!");
            } else {
              this.$message.error(res.data.msg);
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
    _edit(id, qcodeStatus, type = "") {
      //编辑
      let data = {
        operId: this.UserId,
        id,
        qcodeStatus,
      };
      API.phLogin("/upBank.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("修改成功");
          if (type == "银行卡") {
            this._getBankList();
          } else {
            this._getZFBList();
          }
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _getZFBList() {
      //获取支付宝列表
      let data = {
        operId: this.UserId,
      };
      API.phLogin("/selAli.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.zfbList = res.data.data.reSult;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _addZFB() {
      //支付宝添加
      if (!com._checkParam(this.ZFBForm, getFormReq("支付宝"))) {
        return;
      }
      let data = {
        operId: this.UserId,
        ...this.ZFBForm,
      };
      API.phLogin("/addAli.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("添加成功");
          this.ZFBForm = {
            aliName: "",
            aliNo: "",
            czAmt: "",
            txAmt: "",
          };
          this._getZFBList();
          this.addZFBDialog = false;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _getInfo(id, type) {
      //详情
      let data = {
        operId: this.UserId,
        id,
      };
      API.phLogin("/bankInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          if (type == "银行卡") {
            this.bankDetailDialog = true;
            this.bankDetail = res.data.data;
          } else {
            this.ZFBDetailDialog = true;
            this.ZFBDetail = res.data.data;
          }
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
<style lang="stylus" scoped>
.receivePay {
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-sizing: border-box;
  text-align: left;

  /deep/ .instAbout {
    .el-form-item__content {
      float: left;
      text-align: left;
      width: 200px !important;
    }

    .demo-table-expand {
      label {
        width: 118px !important;
        float: left;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
      }
    }
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

  /deep/ .el-dialog__body {
    padding-bottom: 0px;
  }

  .bank {
    display: flex;
    flex-wrap: wrap;

    .add {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i {
        font-size: 36px;
      }
    }

    .item {
      min-height: 145px;
      border: 1px solid #f8dba1;
      box-shadow: 0 0 6px 2px #f8dba1;
      width: 19%;
      min-width: 235px;
      border-radius: 5px;
      position: relative;
      margin-right: 10px;
      margin-bottom: 25px;
      font-size: 13px;

      .itmeTop {
        padding: 15px;

        >div {
          margin-bottom: 10px;
        }
      }

      .status {
        position: absolute;
        top: 5px;
        right: 16px;

        img {
          width: 52px;
        }
      }
    }
  }

  .zfb {
    .item {
      min-height: 123px;
      border: 1px solid #1abc9c;
      box-shadow: 0 0 6px 2px #1abc9c;

      .btn {
        border-top: 2px solid #1abc9c;
      }

      .status {
        position: absolute;
        top: 13px;
        right: 22px;

        img {
          width: 34px;
        }
      }
    }
  }
  .detail {
    .el-form-item {
      border-bottom: 1px solid rgba(1, 1, 1, 0.2);
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>