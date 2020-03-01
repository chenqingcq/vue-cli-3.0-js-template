<template>
  <div class="container-robots">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "room"
};
</script>

<style lang="less" scoped>
.container-robots {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>