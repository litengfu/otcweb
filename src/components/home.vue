<template>
  <div class="home">
    <template v-if="userType=='管理员'">
      <adminHome></adminHome>
    </template>
    <template v-else>
      <memberHome></memberHome>
    </template>
  </div>
</template>

<script>
import com from "../common";
import adminHome from "./adminHome";
import memberHome from "./memberHome";
export default {
  name: "HelloWorld",
  data() {
    return {
      userType: "",
    };
  },
  created() {
    this.userType = com.getLocalStorage("otc_webUserType");
  },
  components: {
    memberHome,
    adminHome,
  },
};
</script>

<style scoped lang="stylus"></style>