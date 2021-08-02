<template>
  <div class="login">
    <div class="right">
      <div class="loginWrap">
        <div class="logo">
          <img src="../../static/img/sy/wepLogo.png" />
          <span>登录</span>
        </div>
        <div class="loginForm">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="UserId">
              <el-input type="text" clearable v-model="ruleForm.UserId" :maxlength="32" placeholder="请输入账号或手机号">
                <i slot="prefix" class="el-input__icon el-icon-user"></i>

              </el-input>
            </el-form-item>
            <el-form-item prop="Pword">
              <el-input v-model="ruleForm.Pword" maxlength="32" placeholder="请输入密码" type="password" clearable @keyup.enter.native="submit('ruleForm')">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="googleCode">
              <el-input v-model="ruleForm.googleCode" maxlength="32" placeholder="请输入谷歌验证码" type="text" clearable @keyup.enter.native="submit('ruleForm')">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox style="float: left;color: black!important;" v-model="checked">同意<a href="#" style="color: #66B1FF">《用户使用服务协议》</a></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginClick('ruleForm')" style="width:100%;height: 40px; font-size: 18px;font-family: '黑体';" :loading="loadding">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="codeWrap" v-show="show">
        <div class="code">
          <PuzzleVerification width="360" height="220" v-model="show" :puzzleImgList="puzzleImgList" blockType="puzzle" style="z-index: 100000" :onSuccess="handleSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../api'
import com from '../common'
import PuzzleVerification from './puzzleVerification.vue'
import { mapMutations } from 'vuex'
export default {
  components: { PuzzleVerification },
  data() {
    return {
      ruleForm: {
        UserId: '',
        Pword: '',
        googleCode: '',
      },
      checked: true,
      rules: {
        UserId: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 32, message: '账户名长度为1-32', trigger: 'blur' },
        ],
        Pword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      loadding: false,
      //ltf
      show: false,
      puzzleImgList: [
        require('../../static/img/yzm/0.jpg'),
        require('../../static/img/yzm/1.jpg'),
        require('../../static/img/yzm/2.jpg'),
        require('../../static/img/yzm/3.jpg'),
        require('../../static/img/yzm/4.jpg'),
        require('../../static/img/yzm/5.jpg'),
        require('../../static/img/yzm/6.jpg'),
        require('../../static/img/yzm/7.jpg'),
        require('../../static/img/yzm/8.jpg'),
        require('../../static/img/yzm/9.jpg'),
        require('../../static/img/yzm/10.jpg'),
        require('../../static/img/yzm/11.jpg'),
        require('../../static/img/yzm/12.jpg'),
        require('../../static/img/yzm/13.jpg'),
        require('../../static/img/yzm/14.jpg'),
        require('../../static/img/yzm/15.jpg'),
        require('../../static/img/yzm/16.jpg'),
        require('../../static/img/yzm/17.jpg'),
        require('../../static/img/yzm/18.jpg'),
        require('../../static/img/yzm/19.jpg'),
        require('../../static/img/yzm/20.jpg'),
      ],
    }
  },
  methods: {
    loginClick() {
      //弹出拖动验证
      if (!this.ruleForm.UserId || !this.ruleForm.Pword) {
        this.$message.warning('账号或密码不能空')
        return
      }
      if (!this.checked) {
        this.$message.warning('请同意用户使用服务协议！')
        return
      }
      this.show = true
    },
    handleSuccess() {
      //图形验证成功回调
      this.submit()
    },
    // 路由跳转
    goTo(val) {
      this.$router.push(val)
      return
    },
    submit() {
      //登录
      let loginType = 'pc'
      if (this._isMobile()) {
        loginType = 'app'
      }
      let data = {
        userId: this.ruleForm.UserId.trim(),
        upwd: hex_md5(this.ruleForm.Pword).toUpperCase(),
        googleCode: this.ruleForm.googleCode || '',
        loginType: loginType,
      }
      this.loadding = true
      com.saveLocalStorage('otc_token', '')
      API.phLogin('/loginUser.do', data).then(
        (res) => {
          this.show = false
          this.loadding = false
          if (res.data.code == '0000') {
            this.$message.success('登录成功')
            let data = res.data.data
            let allReSult = data.menus
            let RS = this.leftRS(allReSult)
            com.saveLocalStorage('otc_webReSult', RS)
            com.saveLocalStorage('otc_token', data.token)
            com.saveLocalStorage('otc_webUserName', data.userNm) //用户名
            com.saveLocalStorage('otc_webUserType', data.userType) //用户类型
            com.saveLocalStorage('otc_webUserId', data.userId) //用户ID
            com.saveLocalStorage('auto', '0')

            this.$router.push('/home')
          } else {
            this.$message.error(res.data.msg)
          }
        },
        () => {
          this.loadding = false
          this.show = false
        }
      )
    },
    leftRS(menus) {
      // 整理菜单栏
      let leftRS = []
      for (let i in menus) {
        let obj = {
          id: menus[i].menuId,
          name: menus[i].menuNm,
          className: this.iconRS(menus[i].menuId),
          child: menus[i].menus,
        }
        leftRS.push(obj)
      }
      return leftRS
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
    iconRS(val) {
      let className = ''
      switch (val) {
        case '0001':
          className = 'el-icon-setting'
          break
        case '0002':
          className = 'iconfont icon-kehuhuiyuanguanli' //管理员商户管理
          break
        case '0003':
          className = 'iconfont icon-zhifubaofukuan' //管理员订单管理
          break
        case '0004':
          className = 'iconfont icon-report'
          break
        case '0050':
          className = 'el-icon-setting' //.
          break
        case '0051':
          className = 'iconfont icon-kehuhuiyuanguanli' //商户下级管理.
          break
        case '0052':
          className = 'iconfont icon-zhifubaofukuan' //商户订单管理.
          break
        case '0053':
          className = 'iconfont icon-icon-p_mrpbaobiao' //.
          break
        default:
          break
      }
      return className
    },
  },
  created() {
    document.title = 'OTC-登录首页'
  },
}
</script>

<style scoped lang="stylus">
@media (max-width: 768px) {
  .login {
    overflow: hidden;

    .right {
      width: 100%;

      .loginWrap {
        box-shadow: 0 0 0;
      }

      .loginForm {
        /deep/ .el-form-item {
          width: 223px;
        }
      }
    }
  }
}

.login {
  /deep/ .puzzle-container {
    border: 0;
    border-radius: 0;
  }
}

.codeWrap {
  position: fixed;
  content: '';
  display: block;
  background: rgba(1, 1, 1, 0.1);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;

  .code {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
  }
}

* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

.login {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.right {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  position: relative;
  background: white;

  .loginWrap {
    width: 400px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.34);
    background: white;
  }
}

.logo {
  display: flex;
  color: #32b5c5;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.logo img {
  height: 32px;
  width: 32px;
  margin-right: 10px;
}

.loginForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40vw;
}

.loginForm .el-form-item {
  margin-top: 15px;
  height: 40px;
  width: 350px;
}

.loginForm /deep/ .el-input-group__append {
  padding: 0px !important;
  border: none !important;
}

.loginForm .el-input {
  outline: none;
  border: none;
}

footer {
  display: flex;
  color: black;
  display: block;
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0px;
}

.login >>> input::-webkit-outer-spin-button, .login >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.login >>> input[type='number'] {
  -moz-appearance: textfield;
}
</style>
