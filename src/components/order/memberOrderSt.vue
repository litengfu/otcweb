<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker size="small" format="yyyy-MM-dd" v-model="formInline.tDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <ul class="static borderB">
      <li class="item">
        <div class="title">买入总金额</div>
        <div class="num">{{statisList.buyAmt}} U</div>
      </li>
      <li class="item">
        <div class="title">卖出总金额</div>
        <div class="num">{{statisList.sellAmt}} U</div>
      </li>
      <li class="item">
        <div class="title">充值总金额</div>
        <div class="num">{{statisList.czAmt}} U</div>
      </li>
      <li class="item">
        <div class="title">提现总金额</div>
        <div class="num">{{statisList.txAmt}} U</div>
      </li>
      <li class="item">
        <div class="title">总手续费</div>
        <div class="num">{{statisList.allFee}} U</div>
      </li>
    </ul>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="txnDate" label="日期" width="180" align="center"></el-table-column>
        <el-table-column label="买入金额(U)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.buyAmt}} / {{scope.row.buyNum}}笔</span>
          </template>
        </el-table-column>
        <el-table-column label="卖出金额(U)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sellAmt}} / {{scope.row.sellNum}}笔</span>
          </template>
        </el-table-column>
        <el-table-column label="充值金额(U)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.czAmt}} / {{scope.row.czNum}}笔</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额(U)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.txAmt}} / {{scope.row.txNum}}笔</span>
          </template>
        </el-table-column>
        <el-table-column prop="allFee" label="手续费(U)" align="center"></el-table-column>
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
      formInline: {
        userNo: "",
        tDate: [new Date(), new Date()],
      },
      tableData: [],
      //统计
      statisList: {
        buyAmt: 0,
        sellAmt: 0,
        czAmt: 0,
        txAmt: 0,
        allFee: 0,
      },
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
  },
  mounted() {
    this.onSubmit(); //查询
  },
  methods: {
    currentC(page) {
      //当前页数改变
      this.CurPage = page;
      this.clearTab();
      this.nextSubmit();
    },
    clearTab() {
      this.tableData = [];
    },
    onSubmit() {
      // 点击查询
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
        userId: this.UserId,
        beginDate: API.format(tDate[0], "yyyyMMdd"),
        endDate: API.format(tDate[1], "yyyyMMdd"),
        curPage: this.CurPage.toString(),
      };
      API.phLogin("/selSumC.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          for (let i in this.statisList) {
            this.statisList[i] = data[i]; //统计
          }
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

  .static {
    display: flex;
    margin-bottom: 20px;

    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 90px;
      justify-content: center;

      .title {
        margin-bottom: 10px;
        font-size: 14px;
      }

      .num {
        font-weight: 700;
        font-size: 20px;
      }
    }
  }

  .queryD {
    padding: 10px 0 0 0;

    .demo-form-inline {
      margin-bottom: 10px;

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

  .tableMsg {
    padding-top: 15px;
  }
}
</style>
