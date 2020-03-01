<template>
  <div class="container-password">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "password"
};
</script>

<style lang="less" scoped>
.container-password {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>