<template>
  <div class="container-room">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "room"
};
</script>

<style lang="less" scoped>
.container-room {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>