<template>
  <div class="container-home">
    <Tab />
    <div class="home-panel">
      <Header />
      <div class="home-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Tab from "./Tab";
export default {
  name: "home",
  components: {
    Header,
    Tab
  }
};
</script>

<style lang="less" scoped>
.container-home {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  color: #333;
  font-family: PingFangSC-Regular;
  .container-tab {
    width: 180px;
    height: 100%;
  }
  .home-panel {
    width: calc(100% - 180px);
    height: 100%;
    .container-header {
      width: 100%;
      height: 64px;
    }
    .home-content {
      width: 100%;
      height: calc(100% - 64px);
      background: #eaeef4;
      padding: 20px;
    }
  }
}
</style>