<template>
  <div class="baseSet">
    <ul class="user">
      <li class="item">
        <div class="title">用户名称：</div>
        <div class="content">{{userinfoForm.userName}}</div>
      </li>
      <li class="item">
        <div class="title">用户角色：</div>
        <div class="content">{{userinfoForm.userType}}</div>
      </li>
      <li class="item">
        <div class="title">手机号：</div>
        <div class="content">{{userinfoForm.userMobil}}</div>
      </li>
      <li class="item">
        <div class="title">状态：</div>
        <div class="content">{{userinfoForm.userStatus}}</div>
      </li>
      <li class="item">
        <div class="title">谷歌权限：</div>
        <div class="content">{{userinfoForm.googleStatus}}</div>
      </li>
      <li class="item">
        <div class="title">账户余额(U)：</div>
        <div class="content">{{userinfoForm.accAmt}}</div>
      </li>
      <li class="item">
        <div class="title">冻结余额(U)：</div>
        <div class="content">{{userinfoForm.accFreeze}}</div>
      </li>
      <li class="item">
        <div class="title">买入费率：</div>
        <div class="content">{{userinfoForm.buyFee}}%</div>
      </li>
      <li class="item">
        <div class="title">卖出费率：</div>
        <div class="content">{{userinfoForm.sellFee}}%</div>
      </li>
      <li class="item">
        <div class="title">注册时间：</div>
        <div class="content">{{userinfoForm.crtTime}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import com from "../../common";
import API from "../../api";

export default {
  data() {
    return {
      userinfoForm: {},
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this._getInfoUser(); //获取会员信息
  },
  methods: {
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
  },
};
</script>
<style lang="stylus" scoped>
.baseSet {
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-sizing: border-box;

  .user {
    padding: 30px;

    .item {
      display: flex;
      margin-bottom: 15px;
      font-size: 14px;

      .title {
        margin-right: 8px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: right;
        color: #99a9bf;
      }

      .content {
        display: flex;
        align-items: center;
        height: 40px;
        width: 500px;
        border: 1px solid #E4E7ED;
        padding: 0 15px;
        border-radius: 4px;
        background :#F5F7FA;
        color:#C0C4CC;
      }
    }
  }
}
</style>