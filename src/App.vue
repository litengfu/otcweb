<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import com from "./common";
import { mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {},
  created() {
    let userInfo = com.getLocalStorage("userInfo");
    if (!userInfo) {
      userInfo = {};
    }
    this.$store.commit("login", userInfo); //页面刷新时，把存储的用户信息传给vuex
  },
};
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 15px;
  background-color: #f2f2f2;
}

@media (max-width: 768px) {
  .el-message-box {
    width: 321px;
  }
}
</style>
