<template>
  <div class="container-feedback">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "feedback"
};
</script>

<style lang="less" scoped>
.container-feedback {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>