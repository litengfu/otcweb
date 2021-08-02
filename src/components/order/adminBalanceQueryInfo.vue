<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker size="small" v-model="formInline.tDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" style="width: 180px;" v-model="formInline.userId" :maxlength="32" placeholder="请输入商户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="crtTime" label="操作时间" width="180"></el-table-column>
        <el-table-column label="商户信息" width="180">
          <template slot-scope='scope'>
            <div style="font-size: 12px">商户ID:{{scope.row.userId}}</div>
            <div style="font-size: 12px">商户名称:{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orgAmount" label="原余额(U)" width="120"></el-table-column>
        <el-table-column prop="cutAmount" label="当前余额(U)" width="120"></el-table-column>
        <el-table-column prop="operAmount" label="操作金额(U)" width="120"></el-table-column>
        <el-table-column prop="operDesc" label="操作描述" width="320"></el-table-column>
      </el-table>
      <div class="tableMsg">
        <el-pagination layout="prev, pager, next" @current-change="currentC" :page-size="1" :total="allPage">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import API from "../../api";
import com from "../../common";

export default {
  data() {
    return {
      UserId: "",
      CurPage: 1,
      allPage: 1,
      // 查询
      tableData: [],
      formInline: {
        userId: "",
        tDate: [com._historyTime(0), com._historyTime(0, 2)],
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
    currentC(page) {
      //改变页数
      this.CurPage = page;
      this.clearTab();
      this.nextSubmit();
    },
    clearTab() {
      this.tableData = [];
    },
    onSubmit() {
      // 点击查询按钮
      this.currentC(1);
    },
    nextSubmit() {
      // 查询数据
      let tDate = this.formInline.tDate;
      if (tDate == null || tDate == undefined) {
        this.$message.error("请选择日期后提交");
        return;
      }
      let data = {
        operId: this.UserId,
        userId: this.formInline.userId,
        beginDate: API.format(tDate[0], "yyyyMMddhhmmss"),
        endDate: API.format(tDate[1], "yyyyMMddhhmmss"),
        curPage: this.CurPage.toString(),
      };
      API.phLogin("/selAcclogS.do", data).then((res) => {
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

.userInfoQuery /deep/ .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.userInfoQuery >>> input::-webkit-outer-spin-button, .userInfoQuery >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.userInfoQuery >>> input[type='number'] {
  -moz-appearance: textfield;
}
</style>
