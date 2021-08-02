<template>
  <div class="userInfoQuery">
    <div class="textAL queryD">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button size="small" type="primary" @click="UserPush">新增公告
          </el-button>
        </el-form-item>
        <el-form-item label="">
          <el-select size="small" v-model="formInline.noteStatus" filterable placeholder="请选择" style="width:150px">
            <el-option label="默认" value=""></el-option>
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
          <el-button size="small" type="primary" style="transform:translate(-6px,-1px);" @click="onSubmit">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableD">
      <el-table :data="tableData" :header-cell-style="{ background: 'rgba(250, 250, 250, 1)' }" style="width: 100%;font-size:13px;">
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="noteTitle" label="公告标题" width="350"></el-table-column>
        <el-table-column label="公告状态" width="120">
          <template slot-scope='scope'>
            <div v-if="scope.row.noteStatus=='启用'" style="color: green;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.noteStatus}}</div>
            <div v-if="scope.row.noteStatus=='禁用'" style="color: red;width: 40px;height: 25px;line-height: 25px;text-align: center;border-radius: 5px">
              {{scope.row.noteStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="crtTime" width="160" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-info" size="small" @click="userinfo(scope.row.noteId,'1')" style="background-color: #78909C">详情</el-button>
              <el-button @click="userinfo(scope.row.noteId,'2')" type="success" icon="el-icon-edit-outline" size="small">编辑</el-button>
              <el-button @click="upsta(scope.row.noteId)" type="danger" icon="el-icon-delete" size="small">删除
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
    <el-dialog class="instAbout" :visible.sync="instAboutBtn">
      <div slot="title" class="dialog-footer">
        <span>公告详情</span>
      </div>
      <div v-html="note.ntitle"></div>
      <div style="margin-top: 10px" v-html="note.time"></div>
      <div style="margin-top: 20px;text-align: left;font-size: 13px; line-height: 20px;   font-weight: 400;
    font-style: normal;" v-html="note.msg"></div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="instAboutBtn=false">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog class="instAbout a642" :visible.sync="userPush">
      <div slot="title" class="dialog-footer">
        <span>公告添加</span>
      </div>
      <el-form class="demo-table-expand">
        <el-form-item label="标题：" :rules="[{ required: true }]">
          <el-input type="text" :maxlength="128" v-model="formPush.noteTitle" placeholder="请输入标题" style="width:576px">
          </el-input>
        </el-form-item>
        <el-form-item label="状态：" :rules="[{ required: true }]">
          <el-select v-model="formPush.noteStatus" placeholder="请选择" style="width:576px">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" :rules="[{ required: true }]">
          <br>
          <vue-egdit ref="editor1" id="editor" width="576" v-model="initContent" :menus="meaus"></vue-egdit>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userPush = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="userInfoPush()">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog class="instAbout a642" :visible.sync="userChange">
      <div slot="title" class="dialog-footer">
        <span>公告修改</span>
      </div>
      <el-form class="demo-table-expand">
        <el-form-item label="标题：" :rules="[{ required: true }]">
          <el-input type="text" :maxlength="128" v-model="formChange.noteTitle" placeholder="请输入标题" style="width:576px">
          </el-input>
        </el-form-item>
        <el-form-item label="状态：" :rules="[{ required: true }]">
          <el-select v-model="formChange.noteStatus" placeholder="请选择" style="width:576px">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" :rules="[{ required: true }]">
          <br>
          <vue-egdit width="576" ref="editor2" id="editor2" v-model="initContent2" :menus="meaus"></vue-egdit>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userChange = false">取消</el-button>
        <el-button type="primary" style="background-color: #1ec695;border:1px solid #1ec695;" @click="userinfoChange()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import API from "../../api";
import com from "../../common";
import vueEgdit from "vue-wangeditor";

export default {
  components: {
    vueEgdit,
  },
  data() {
    return {
      initContent: "",
      initContent2: "",
      meaus: [
        "bold", // 粗体
        "underline", // 下划线
        "italic", // 斜体
        "strikethrough", // 中线
        "eraser", // 清空格式
        "fontfamily", // 字体
        "fontsize", // 字号
        "alignleft", // 左对齐
        "aligncenter", // 居中
        "alignright", // 右对齐
        "link", // 链接
        "unlink", // 取消链接
        "undo", // 撤销
        "redo", // 重做
        "fullscreen", // 全屏
      ],
      UserId: "",
      instAboutBtn: false,
      CurPage: 1,
      allPage: 1,
      // 查询
      formInline: {
        noteStatus: "",
      },
      formPush: {},
      tableData: [],
      //添加
      userPush: false,
      // 用户修改
      userChange: false,
      formChange: {},
      note: {
        title: "",
        time: "",
        msg: "",
      },
    };
  },
  created() {
    this.UserId = com.getLocalStorage("otc_webUserId");
    this.onSubmit();
  },
  methods: {
    upsta(val) {
      //删除公告
      let noteId = val;
      let msg = "此操作将删除此公告, 是否继续?";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            userId: this.UserId,
            noteId: noteId,
          };
          API.phLogin("/delNoteInfo.do", data).then((res) => {
            if (res.data.code == "0000") {
              this.$message.success(res.data.msg);
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
    getContent() {
      //获取编辑器editor1内容
      this.initContent = this.$refs.editor1.getHtml(this.initContent);
    },
    setContent2(val) {
      //设置编辑器editor2内容
      this.initContent2 = val;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.editor2.setHtml(this.initContent2); //如设置：后台返回来的固定内容
        }, 100);
      });
    },
    getContent2() {
      //获取编辑器editor2内容
      this.initContent2 = this.$refs.editor2.getHtml(this.initContent2);
    },
    userinfo(val1, val2) {
      //公告详情
      let data = {
        userId: this.UserId,
        noteId: val1,
      };
      API.phLogin("/selNoteInfo.do", data).then((res) => {
        if (res.data.code == "0000") {
          let data = res.data.data;
          if (val2 == "1") {
            let ntitle =
              '<div style="text-align: center;"><span style="    font-weight: 700;font-style: normal;font-size: 16px;">' +
              data.noteTitle +
              "</span></div>";
            let time =
              '<div style="text-align: center;"><font size="3">' +
              data.ctrTime +
              "</font></div>";
            let msg = "<div>" + data.noteMessage + "</div>";
            this.note = {
              ntitle,
              time,
              msg,
            };
            this.instAboutBtn = true;
          } else {
            this.formChange = data;
            this.formChange.noteId = val1;
            this.userChange = true;
            this.setContent2(data.noteMessage);
          }
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    currentC(page) {
      //页数查询
      this.CurPage = page;
      this.clearTab();
      this.nextSubmit();
    },
    clearTab() {
      this.tableData = [];
    },
    UserPush() {
      //添加公告弹框
      this.userPush = true;
    },
    userInfoPush() {
      //添加公告
      this.getContent();
      let noteTitle = this.formPush.noteTitle;
      let initContent = this.initContent;
      let noteStatus = this.formPush.noteStatus;
      if (noteTitle == null || noteTitle == undefined) {
        this.$message.error("请添加公告标题！");
        return;
      }
      if (initContent == null || initContent == undefined) {
        this.$message.error("请添加公告内容！");
        return;
      }
      if (noteStatus == null || noteStatus == undefined) {
        this.$message.error("请选择公告状态！");
        return;
      }
      let data = {
        userId: this.UserId,
        noteTitle: noteTitle,
        noteMessage: initContent,
        noteStatus: noteStatus,
      };
      API.phLogin("/addNote.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.userPush = false;
          this.$message.success("公告添加成功！");
          this.formPush = {};
          this.onSubmit();
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    userinfoChange() {
      //编辑公告
      this.getContent2();
      let noteTitle = this.formChange.noteTitle;
      let initContent = this.initContent2;
      let noteStatus = this.formChange.noteStatus;
      let noteId = this.formChange.noteId;
      if (noteTitle == null || noteTitle == undefined) {
        this.$message.error("请添加公告标题！");
        return;
      }
      if (initContent == null || initContent == undefined) {
        this.$message.error("请添加公告内容！");
        return;
      }
      if (noteStatus == null || noteStatus == undefined) {
        this.$message.error("请选择公告状态！");
        return;
      }
      let data = {
        userId: this.UserId,
        noteId: noteId,
        noteTitle: noteTitle,
        noteMessage: initContent,
        noteStatus: noteStatus,
      };
      API.phLogin("/upNote.do", data).then((res) => {
        if (res.data.code == "0000") {
          this.userPush = false;
          this.$message.success("公告修改成功！");
          this.formChange = {};
          this.userChange = false;
          this.onSubmit();
        } else if (res.data.code == "9999") {
          this.$router.push("/login");
          this.$message.error("登录已失效,请重新登录!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    onSubmit() {
      // 点击查询按钮
      this.currentC(1);
      this.$forceUpdate();
    },
    nextSubmit() {
      //公告查询
      let noteStatus = this.formInline.noteStatus;
      let data = {
        userId: this.UserId,
        noteStatus: noteStatus.toString(),
        curPage: this.CurPage.toString(),
      };
      API.phLogin("/selNoteList.do", data).then((res) => {
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
      width: 922px;
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

.userInfoQuery /deep/ .instAbout .el-dialog__header {
  background-color: #1ec695;
  text-align: left;
  font-size: 15px;
  color: white;
}

.userInfoQuery /deep/ .instAbout .el-dialog__close {
  color: white !important;
  font-size: 25px;
  margin: -5px -5px;
}

.userInfoQuery /deep/ .wangEditor-container {
  width: 578px !important;
}

.userInfoQuery /deep/ .el-form-item__content {
  text-align: left;
}

.userInfoQuery /deep/ .el-form-item__label {
  text-align: left !important;
}

.userInfoQuery >>> input::-webkit-outer-spin-button, .userInfoQuery >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.userInfoQuery >>> input[type='number'] {
  -moz-appearance: textfield;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 5px;
  width: 60.5%;
}

.instAbout /deep/ .el-dialog {
  width: 587px;
}

.a642 /deep/ .el-dialog {
  width: 642px !important;
}

.w-e-toolbar {
  flex-wrap: wrap;
}
</style>




