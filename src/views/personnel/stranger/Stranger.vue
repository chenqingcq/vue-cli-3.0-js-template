<template>
  <div class="container-stranger">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "visitor"
};
</script>

<style lang="less" scoped>
.container-stranger {
  width: 100%;
  height: 100%;
}
</style>