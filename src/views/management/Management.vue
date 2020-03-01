<template>
  <div class="container-management">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "management"
};
</script>

<style lang="less" scoped>
.container-management {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>