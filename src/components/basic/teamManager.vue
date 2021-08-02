<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button size="small" type="primary" @click="add">新增员工</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.userName" placeholder="请输入员工名称" style="width:200px;">
            <el-button size="small" slot="append" style="background-color: #1EC695;color:white;" @click="onSubmit">查询
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="userId" label="员工ID" width="90"></el-table-column>
        <el-table-column prop="userName" label="员工名称" width="200"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="120"></el-table-column>
        <el-table-column prop="userStatus" width="100" label="状态">
          <template slot-scope='scope'>
            <div v-if="scope.row.userStatus=='正常'" style="color: green;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='冻结'" style="color: red;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='注销'" style="color: orange;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="登录状态">
          <template slot-scope='scope'>
            <div v-if="scope.row.loginSt=='已登录'" style="color: green;width: 60px;height: 27px;line-height: 27px;text-align: center;border-radius: 5px">
              {{scope.row.loginSt}}</div>
            <div v-if="scope.row.loginSt=='未登录'" style="color: orange;width: 60px;height: 27px;line-height: 27px;text-align: center;border-radius: 5px">
              {{scope.row.loginSt}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="loginIp" width="200" label="登录IP	"></el-table-column>
        <el-table-column prop="crtTime" width="160" label="注册时间	"></el-table-column>
        <el-table-column label="操作" width="420">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="_deleteUser(scope.row.userId)">删除
              </el-button>
              <el-button @click="uPwd(scope.row.userId)" type="warning" icon="el-icon-refresh" size="small">重置密码
              </el-button>
              <el-button type="danger" icon="el-icon-s-tools" size="small" @click="_setWhiteLIstDialog(scope.row.userId)">IP配置</el-button>
              <el-button @click="_getGuGeInfo(scope.row.userId)" type="success" icon="el-icon-s-custom" size="small">
                谷歌验证
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
    <!-- 员工添加 -->
    <el-dialog class="shopsAboutChange" :visible.sync="userPush" width="600px">
      <div slot="title" class="dialog-footer">
        <span>员工添加</span>
      </div>
      <el-form :model="ruleForm1">
        <el-form :model="ruleForm1" status-icon ref="ruleForm1" label-width="100px" class="demo-ruleForm1">
          <el-form-item label="所属角色:" :rules="[{required:true}]">
            <el-radio-group v-model="ruleForm1.userRole">
              <el-radio label="交易员">交易员</el-radio>
              <el-radio label="财务员">财务员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="员工名称:" :rules="[{required:true}]">
            <el-input type="text" maxlength="20" v-model="ruleForm1.userName" placeholder="请输入员工名称" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="联系手机号:">
            <el-input type="number" maxlength="20" v-model="ruleForm1.userMobil" placeholder="请输入联系手机号" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="联系QQ:">
            <el-input type="number" maxlength="20" v-model="ruleForm1.userQQ" placeholder="请输入QQ" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userPush = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="_addAcount()">确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 配置白名单 -->
    <el-dialog class="shopsAboutChange" :visible.sync="whiteListDialog" width="670px">
      <div slot="title" class="dialog-footer">
        <span>IP配置</span>
      </div>
      <div style="text-align:left;margin-left:30px;padding-bottom:30px;border-bottom:1px solid gray;margin-bottom:30px">
        <span style="margin-right:3px;font-size:16px;">白名单:</span>
        <el-input type="text" v-model="whiteListForm.ip" placeholder="请输入需要添加的IP" autocomplete="off" style="width: 180px;"></el-input>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="_addWhiteList" style="background-color: #1ec695;border:1px solid #1ec695;">添加</el-button>
      </div>
      <el-table :data="whiteListTableData" :header-cell-style="{background:'#f5f7fa'}" style="width: 100%">
        <el-table-column prop="ipAddr" label="IP地址"></el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="170"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="_deleteWhiteList(scope.row.ipAddr)">删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="whiteListDialog = false">确定</el-button>
      </div>
    </el-dialog>
    <!--谷歌验证设置-->
    <el-dialog class="instAbout instAbout3" :visible.sync="googleBtn" width="650px">
      <div slot="title" class="dialog-footer">
        <span>谷歌验证设置</span>
      </div>
      <div id="qrcode" style="width: 128px;height:128px;margin: 0 auto"></div> <!-- 创建一个div，并设置id为qrcode -->
      <div style="margin-top: 10px">秘钥：{{instAboutList.googleKey}}</div>
      <div style="width: 100%;text-align: center">
        <div style="width: 100%;height: 60px;line-height: 60px;text-align: center;">
          <span style="font-weight: 600;">在谷歌验证器中添加秘钥并备份</span>
        </div>
        <div style="width: 100%;font-size: 14px;text-align: center">
          注：打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌。
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="googleBtn=false">
          确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from "../../api";
import com from "../../common";

const formReq = {
  userName: {
    isNoEmpty: "请输入员工名称！",
  },
  userRole: {
    isNoEmpty: "请选择角色！",
  },
};
export default {
  data() {
    return {
      UserId: "",
      CurPage: 1,
      allPage: 1,
      // 查询
      formInline: {
        userName: "",
      },
      tableData: [],
      //添加
      userPush: false,
      ruleForm1: {
        userName: "", //员工名称
        userMobil: "", //员工联系手机号
        userQQ: "",
        userRole: "交易员",
      },
      ///配置白名单
      whiteListDialog: false,
      whiteListForm: { ip: "" },
      whiteListTableData: [],
      googleBtn: false,
      instAboutList: [], //详情列表
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this.onSubmit();
  },
  methods: {
    qrcode() {
      let _this = this;
      $("#qrcode").html("");
      setTimeout(function () {
        let qrcode = new QRCode("qrcode", {
          width: 128, // 二维码宽度，单位像素
          height: 128, // 二维码高度，单位像素
          text: _this.instAboutList.googleQrcode, // 生成二维码的链接
        });
      }, 100);
    },
    _getGuGeInfo(userId) {
      //谷歌验证
      let data = {
        userId,
        operId: this.UserId,
      };

      API.phLogin("/infoSecure.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.googleBtn = true;
          this.instAboutList = res.data.data;
          this.qrcode();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _deleteWhiteList(ipAddr) {
      //删除白名单
      let data = {
        operId: this.UserId,
        userId: this.whiteUserId,
        ipAddr,
      };
      API.phLogin("/delIp.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.whiteListForm.ip = "";
          this._setWhiteLIstDialog(this.whiteUserId);
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _addWhiteList() {
      //添加白名单
      if (!this.whiteListForm.ip) {
        this.$message.error("请输入需要添加的IP!");
        return;
      }
      let data = {
        operId: this.UserId,
        userId: this.whiteUserId,
        ipAddr: this.whiteListForm.ip,
      };
      API.phLogin("/addIp.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.whiteListForm.ip = "";
          this._setWhiteLIstDialog(this.whiteUserId);
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _setWhiteLIstDialog(userId) {
      //配置白名单
      this.whiteListDialog = true;
      this.whiteUserId = userId;
      let data = {
        operId: this.UserId,
        userId,
      };
      API.phLogin("/selIpList.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.whiteListTableData = res.data.data.ipList;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    uPwd(val1) {
      //重置用户密码
      let msg = "是否重置用户密码?";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            userId: val1,
            operId: this.UserId,
          };
          API.phLogin("/modPwd.do", data).then((res) => {
            if (res.data.code == "0000") {
              this.$message.success("重置成功！");
              this.clearTab();
              this.nextSubmit();
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
    _deleteUser(userId) {
      //删除员工
      let msg = "此操作将删除此员工, 是否继续?";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            operId: this.UserId,
            userId,
          };
          API.phLogin("/delTeam.do", data).then((res) => {
            if (res.data.code == "0000") {
              this.$message.success("删除成功");
              this.onSubmit();
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
    currentC(page) {
      this.CurPage = page;
      this.clearTab();
      this.nextSubmit();
    },
    clearTab() {
      this.tableData = [];
    },
    //   点击查询
    onSubmit() {
      this.currentC(1);
    },
    // 查询数据
    // 多次请求过滤器
    nextSubmit() {
      let userName = this.formInline.userName;
      let data = {
        operId: this.UserId,
        userName: userName.toString(),
        curPage: this.CurPage.toString(),
      };
      API.phLogin("/selTeam.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          this.allPage = parseInt(data.totPage);
          if (data.totCnt == 0) {
            this.clearTab();
            return;
          }
          this.tableData = data.reSult;
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    add() {
      //添加弹框
      this.userPush = true;
    },
    _addAcount(val) {
      //员工添加
      let userMobil = this.ruleForm1.userMobil;
      if (!com._checkParam(this.ruleForm1, formReq)) {
        //表单规则
        return;
      }
      if (userMobil && !com.checkPhone(userMobil)) {
        this.$message.error("请输入正确手机号码！");
        return;
      }
      let data = {
        operId: this.UserId,
        ...this.ruleForm1,
      };

      API.phLogin("addTeam.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.$message.success("添加成功");
          this.userPush = false;
          this.clearTab();
          this.onSubmit();
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
        this.ruleForm1 = {
          userName: "", //员工名称
          userMobil: "", //员工联系手机号
          userQQ: "",
          userRole: "交易员",
        };
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
    padding: 10px 0 0 0;

    .demo-form-inline {
      width: 1395px;
      max-width: 100%;
      display: flex;
      justify-content: space-between;

      .el-form-item {
        margin-bottom: 10px;
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

.userInfoQuery /deep/ .shopsAboutChange .el-dialog__header {
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

.userInfoQuery /deep/ .el-dialog {
  width: 850px;
}

.userInfoQuery /deep/ .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.userInfoQuery /deep/ .shopsAboutChange .el-form-item__label {
  width: 400px;
  text-align: right;
  color: #99a9bf;
}
</style>
