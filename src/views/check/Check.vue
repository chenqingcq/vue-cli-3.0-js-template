<template>
  <div class="container-check">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "check"
};
</script>

<style lang="less" scoped>
.container-check {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>