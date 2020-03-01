<template>
  <div class="container-big-data">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "password"
};
</script>

<style lang="less" scoped>
.container-big-data {
  width: 100%;
  height: 100%;

  // background: #fff;
}
</style>