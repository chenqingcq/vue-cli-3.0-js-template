<template>
  <div class="container-equip">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "equip"
};
</script>

<style lang="less" scoped>
.container-equip {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>