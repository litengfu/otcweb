<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item></el-form-item>
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
        <el-table-column prop="userId" label="商户ID" width="200"></el-table-column>
        <el-table-column prop="userName" label="商户名称" width="200"></el-table-column>
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
        <el-table-column label="状态" width="200">
          <template slot-scope='scope'>
            <div v-if="scope.row.userStatus=='正常'" style="color: green;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='冻结'" style="color: red;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
            <div v-if="scope.row.userStatus=='注销'" style="color: orange;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.userStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="crtTime" width="250" label="注册时间	"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-info" size="small" style="background-color: #78909C;color:white;" @click="_getUser(scope.row.userId,1)">详情</el-button>
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
export default {
  data() {
    return {
      UserId: '',
      CurPage: 1,
      allPage: 1,
      // 查询
      formInline: {
        userName: '',
      },
      tableData: [],
      //详情
      instAboutList: {},
      instAboutBtn: false,
    }
  },
  created() {
    this.UserId = com.getLocalStorage('otc_webUserId')
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
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
    currentC(page) {
      //改变页数
      this.CurPage = page
      this.clearTab()
      this.nextSubmit()
    },
    clearTab() {
      this.tableData = []
    },
    onSubmit() {
      // 点击查询按钮
      this.currentC(1)
    },
    nextSubmit() {
      // 查询数据
      let userName = this.formInline.userName
      let data = {
        operId: this.UserId,
        userName: userName.toString(),
        curPage: this.CurPage.toString(),
      }
      API.phLogin('/referList.do', data).then((res) => {
        if (res.data.code == '0000') {
          let data = res.data.data
          this.allPage = parseInt(data.totPage)
          if (data.totCnt == 0) {
            this.clearTab()
            return
          }
          this.tableData = data.reSult
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
      width: 1235px;
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

.demo-table-expand {
  font-size: 0;
  text-align: left;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.userInfoQuery /deep/ .instAbout .el-form-item__content {
  width: 280px !important;
}

.userInfoQuery /deep/ .instAbout .el-form-item__label {
  width: 120px !important;
}
</style>