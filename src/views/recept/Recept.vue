<template>
  <div class="container-recept">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "room"
};
</script>

<style lang="less" scoped>
.container-recept{
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>