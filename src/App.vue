<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import "./assets/css/reset.less";
@import "./assets/css/theme.less";
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
html,
body {
  width: 100%;
  height: 100%;
  font-family: PingFangSC-Regular, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  font-size: 14px;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.ivu-tooltip {
  margin-top: -2px;
}
input.ivu-input,
button.ivu-btn {
  border-radius: 0px;
}
</style>
