<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button size="small" type="primary" @click="_add">新增商户</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.userName" placeholder="请输入商户名称" style="width:200px;">
            <el-button size="small" slot="append" style="background-color: #1EC695;color:white;" @click="onSubmit">查询
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="userId" label="商户ID" width="120"></el-table-column>
        <el-table-column prop="userName" label="商户名称" width="120"></el-table-column>
        <el-table-column prop="accAmt" label="帐户余额(U)" width="120"></el-table-column>
        <el-table-column prop="accFreeze" label="冻结金额(U)" width="120"></el-table-column>
        <el-table-column label="买入费率" width="120">
          <template slot-scope='scope'>
            {{scope.row.buyFee}}%
          </template>
        </el-table-column>
        <el-table-column label="卖出费率" width="120">
          <template slot-scope='scope'>
            {{scope.row.sellFee}}%
          </template>
        </el-table-column>
        <el-table-column label="商户状态" width="85">
          <template slot-scope='scope'>
            <div v-if="scope.row.userStatus=='正常'" style="color: green;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='冻结'" style="color: red;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='注销'" style="color: orange;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="crtTime" width="160" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="480">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-info" size="small" style="background-color: #78909C;color:white;" @click="_getUser(scope.row.userId,1)">详情</el-button>
              <el-button @click="userinfo(scope.row.userId)" type="success" icon="el-icon-edit-outline" size="small">
                编辑</el-button>
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
    <!--用户修改-->
    <el-dialog class="shopsAboutChange" :visible.sync="userChange">
      <div slot="title" class="dialog-footer">
        <span>商户编辑</span>
      </div>
      <el-form :model="ruleForm1">
        <el-form :model="ruleForm1" status-icon ref="ruleForm1" label-width="150px" class="demo-ruleForm1">
          <el-form-item label="商户名:" :rules="[{required:true}]">
            <el-input type="text" :maxlength="20" v-model="ruleForm1.userName" placeholder="请输入商户名" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="商户状态	:" :rules="[{required:true}]">
            <el-radio-group v-model="ruleForm1.userStatus">
              <el-radio style="width: 50px!important;" label="正常">正常</el-radio>
              <el-radio style="width: 50px!important;" label="注销">注销</el-radio>
              <el-radio style="width: 50px!important;" label="冻结">冻结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="谷歌权限:" :rules="[{required:true}]">
            <el-radio-group v-model="ruleForm1.googleStatus">
              <el-radio style="width: 50px!important;" label="启用">启用</el-radio>
              <el-radio style="width: 50px!important;" label="禁用">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系手机号:">
            <el-input type="number" :maxlength="11" v-model="ruleForm1.userMobil" placeholder="请输入联系手机号" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="联系QQ:">
            <el-input type="text" :maxlength="20" v-model="ruleForm1.userQQ" placeholder="请输入QQ" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="上级代理:">
            <el-select v-model="ruleForm1.agenId" placeholder="请选择上级代理" style="width: 348px;" clearable>
              <el-option v-for="item in parentList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="买入费率(%):" :rules="[{required:true}]">
            <el-input type="number" v-model="ruleForm1.buyFee" placeholder="请输入买入费率" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="卖出费率(%):" :rules="[{required:true}]">
            <el-input type="number" v-model="ruleForm1.sellFee" placeholder="请输入卖出费率" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="加减余额:">
            <el-input type="number" maxlength="8" v-model="ruleForm1.addAmt" placeholder="请输入加减余额" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="">
            <span style="color:red">注:当前账户余额剩余&nbsp;
              <span style="font-weight:bold">{{Number(ruleForm1.accAmt).toFixed(2)}}</span>
              （U）</span>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userChange = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="submitForm(ruleForm1.userId)">修改</el-button>
      </div>
    </el-dialog>
    <!-- 配置白名单 -->
    <el-dialog class="shopsAboutChange shopsAboutChange2" :visible.sync="whiteListDialog">
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
    <!-- 用户添加 -->
    <el-dialog class="shopsAboutChange" :visible.sync="userPush">
      <div slot="title" class="dialog-footer">
        <span>商户添加</span>
      </div>
      <el-form :model="ruleForm1">
        <el-form :model="ruleForm1" status-icon ref="ruleForm1" label-width="150px" class="demo-ruleForm1">
          <el-form-item label="商户名称:" :rules="[{required:true}]">
            <el-input type="text" maxlength="30" v-model="ruleForm1.userName" placeholder="请输入商户名称" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="联系手机号:">
            <el-input type="number" maxlength="11" v-model="ruleForm1.userMobil" placeholder="请输入联系手机号" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="联系QQ:">
            <el-input type="number" maxlength="20" v-model="ruleForm1.userQQ" placeholder="请输入QQ" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="上级代理:">
            <el-select v-model="ruleForm1.agenId" placeholder="请选择上级代理" style="width: 348px;" clearable>
              <el-option v-for="item in parentList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="买入费率(%):" :rules="[{required:true}]">
            <el-input type="number" v-model="ruleForm1.buyFee" placeholder="请输入买入费率" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="卖出费率(%):" :rules="[{required:true}]">
            <el-input type="number" v-model="ruleForm1.sellFee" placeholder="请输入卖出费率" autocomplete="off" style="width: 348px;"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" style="width: 350px;height: 50px" :maxlength="128" v-model="ruleForm1.userRsv" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label>
            <p style="color:red">
              注:初始默认密码为
              <span style="font-weight:bold">123456</span> ，可在登录后修改密码
            </p>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userPush = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="_addUser()">确定
        </el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog class="instAbout detail" :visible.sync="instAboutBtn" width="500px">
      <div slot="title" class="dialog-footer">
        <span>详情信息</span>
      </div>
      <el-form label-position="left" class="demo-table-expand">
        <div style="border: 1px solid rgba(1, 1, 1, 0.2);">
          <el-form-item label="商户名称:">
            <span>{{instAboutList.userName}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="联系手机号:">
            <span>{{instAboutList.userMobil}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="联系QQ:">
            <span>{{instAboutList.userQQ}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="商户状态:">
            <span>{{instAboutList.userStatus}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="谷歌状态:">
            <span>{{instAboutList.googleStatus}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="账户余额(U):">
            <span>{{instAboutList.accAmt}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="买入费率:">
            <span>{{instAboutList.buyFee}}%&nbsp;</span>
          </el-form-item>
          <el-form-item label="卖出费率:">
            <span>{{instAboutList.sellFee}}%&nbsp;</span>
          </el-form-item>
          <el-form-item label="上级代理:">
            <span>{{instAboutList.agenName}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="注册时间:">
            <span>{{instAboutList.crtTime	}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="备注:">
            <span>{{instAboutList.userRsv	}}&nbsp;</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="instAboutBtn = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '../../api'
import com from '../../common'
const formReq = {
  userName: {
    isNoEmpty: '请输入商户名称！',
  },
  userStatus: {
    isNoEmpty: '请选择商户状态！',
  },
  googleStatus: {
    isNoEmpty: '请选择谷歌权限！',
  },
  buyFee: {
    isNoEmpty: '请输入买入费率！',
    isNoNegative: '请输入正确的买入费率！',
  },
  sellFee: {
    isNoEmpty: '请输入卖出费率！',
    isNoNegative: '请输入正确的卖出费率！',
  },
}

export default {
  data() {
    return {
      UserId: '',
      instAboutBtn: false, //详情
      userChange: false, //编辑
      userPush: false, //添加
      CurPage: 1,
      allPage: 1,
      ruleForm1: {},
      // 查询
      formInline: {
        userName: '',
      },
      instAboutList: {}, //详情列表
      tableData: [], //表格数据
      ///配置白名单
      whiteListDialog: false,
      whiteListForm: { ip: '' },
      whiteListTableData: [],
      googleBtn: false,
      //上级代理
      parentList: [],
    }
  },
  created() {
    this.UserId = com.getLocalStorage('otc_webUserId')
    this._getParentList() //上级代理
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    _getParentList(userId = 0) {
      //获取上级代理
      let data = {
        userId,
      }
      return API.phLogin('/selRefer.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.parentList = res.data.data.userList
          return res.data.data.userList
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _getUser(userId) {
      //详情
      this.instAboutList = {}
      let data = {
        operId: this.UserId,
        userId,
      }
      API.phLogin('/selUserInfo.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.instAboutBtn = true
          this.instAboutList = res.data.data
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _addUser(val) {
      //添加商户
      if (!com._checkParam(this.ruleForm1, formReq)) {
        //表单规则
        return
      }
      let userMobil = this.ruleForm1.userMobil
      if (userMobil && !com.checkPhone(userMobil)) {
        this.$message.error('请输入正确手机号码！')
        return
      }
      let data = {
        operId: this.UserId,
        userName: this.ruleForm1.userName,
        userMobil: this.ruleForm1.userMobil,
        userQQ: this.ruleForm1.userQQ,
        buyFee: this.ruleForm1.buyFee,
        sellFee: this.ruleForm1.sellFee,
        agenId: this.ruleForm1.agenId,
        userRsv: this.ruleForm1.userRsv,
      }

      API.phLogin('/addUser.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.$message.success('用户信息保存成功！')
          this.userPush = false
          this.clearTab()
          this.onSubmit()
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _add() {
      //添加商户弹框
      this.userPush = true
      this.ruleForm1 = {
        userName: '',
        userMobil: '',
        userQQ: '',
        agenId: '',
        buyFee: '',
        sellFee: '',
        userRsv: '',
      }
    },
    qrcode() {
      let _this = this
      $('#qrcode').html('')
      setTimeout(function () {
        let qrcode = new QRCode('qrcode', {
          width: 128, // 二维码宽度，单位像素
          height: 128, // 二维码高度，单位像素
          text: _this.instAboutList.googleQrcode, // 生成二维码的链接
        })
      }, 100)
    },
    _getGuGeInfo(userId) {
      //谷歌验证
      let data = {
        userId,
        operId: this.UserId,
      }

      API.phLogin('/infoSecure.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.googleBtn = true
          this.instAboutList = res.data.data
          this.qrcode()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _deleteWhiteList(ipAddr) {
      //删除白名单
      let data = {
        operId: this.UserId,
        userId: this.whiteUserId,
        ipAddr,
      }
      API.phLogin('/delIp.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.whiteListForm.ip = ''
          this._setWhiteLIstDialog(this.whiteUserId)
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _addWhiteList() {
      //添加白名单
      if (!this.whiteListForm.ip) {
        this.$message.error('请输入需要添加的IP!')
        return
      }
      let data = {
        operId: this.UserId,
        userId: this.whiteUserId,
        ipAddr: this.whiteListForm.ip,
      }
      API.phLogin('/addIp.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.whiteListForm.ip = ''
          this._setWhiteLIstDialog(this.whiteUserId)
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _setWhiteLIstDialog(userId) {
      //配置白名单
      this.whiteListDialog = true
      this.whiteUserId = userId
      let data = {
        operId: this.UserId,
        userId,
      }
      API.phLogin('/selIpList.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.whiteListTableData = res.data.data.ipList
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    uPwd(val1) {
      //重置用户密码
      let msg = '是否重置用户密码?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            userId: val1,
            operId: this.UserId,
          }
          API.phLogin('/modPwd.do', data).then((res) => {
            if (res.data.code == '0000') {
              this.$message.success('重置成功！')
              this.clearTab()
              this.nextSubmit()
            } else if (res.data.code == '9999') {
              this.$router.push('/login')
              this.$message.error('登录已失效,请重新登录!')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },
    submitForm(val) {
      //用户|修改
      if (!com._checkParam(this.ruleForm1, formReq)) {
        //表单规则
        return
      }
      let userId = val
      let userMobil = this.ruleForm1.userMobil
      if (userMobil && !com.checkPhone(userMobil)) {
        this.$message.error('请输入正确手机号码！')
        return
      }
      let data = {
        userId: userId,
        operId: this.UserId,
        userName: this.ruleForm1.userName,
        googleStatus: this.ruleForm1.googleStatus,
        userMobil: userMobil,
        userQQ: this.ruleForm1.userQQ,
        userStatus: this.ruleForm1.userStatus,
        addAmt: this.ruleForm1.addAmt,
        buyFee: this.ruleForm1.buyFee,
        sellFee: this.ruleForm1.sellFee,
        agenId: this.ruleForm1.agenId,
        userRsv: this.ruleForm1.userRsv,
      }
      API.phLogin('/upUser.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.$message.success('用户信息保存成功！')
          this.userChange = false
          this.clearTab()
          this.onSubmit()
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    currentC(page) {
      this.CurPage = page
      this.clearTab()
      this.nextSubmit()
    },
    clearTab() {
      this.tableData = []
    },
    //   点击查询
    onSubmit() {
      this.currentC(1)
    },
    nextSubmit() {
      //查询
      let userName = this.formInline.userName
      let data = {
        operId: this.UserId,
        userName: userName.toString(),
        curPage: this.CurPage.toString(),
      }
      API.phLogin('/selUserList.do', data).then((res) => {
        if (res.data.code == '0000') {
          let data = res.data.data
          this.allPage = parseInt(data.totPage)
          if (data.totCnt == 0) {
            this.clearTab()
            return
          }
          this.tableData = data.reSult
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    userinfo(val1) {
      //编辑弹框
      let data = {
        operId: this.UserId,
        userId: val1,
      }
      API.phLogin('/selUserInfo.do', data).then((res) => {
        if (res.data.code == '0000') {
          this.ruleForm1 = res.data.data
          this.ruleForm1.userId = val1
          this.$forceUpdate()
          this.userChange = true
        } else if (res.data.code == '9999') {
          this.$router.push('/login')
          this.$message.error('登录已失效,请重新登录!')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
  },
}
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
      width: 1461px;
      max-width: 100%;
      display: flex;
      justify-content: space-between;

      .el-form-item {
        margin-bottom: 10px;
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

.tableMsg {
  padding-top: 15px;
}

.userInfoQuery /deep/ .el-form-item__content {
  text-align: left;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
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

.userInfoQuery /deep/ .shopsAboutChange .el-dialog {
  width: 670px;
}

.userInfoQuery /deep/ .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.demo-table-expand {
  font-size: 0;
  text-align: left;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.userInfoQuery /deep/ .shopsAboutChange .demo-table-expand label {
  width: 150px;
  padding-left: 12px;
  color: #99a9bf;
}

.userInfoQuery /deep/ .shopsAboutChange .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 100%;
}

.userInfoQuery /deep/ .shopsAboutChange .el-form-item__label {
  width: 400px;
  text-align: right;
  color: #99a9bf;
}

.userInfoQuery /deep/ .instAbout .el-form-item__content {
  width: 280px !important;
}

.userInfoQuery /deep/ .instAbout .el-form-item__label {
  width: 120px !important;
}
</style>
