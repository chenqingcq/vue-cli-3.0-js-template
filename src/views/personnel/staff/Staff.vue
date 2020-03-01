<template>
  <div class="container-staff">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "staff"
};
</script>

<style lang="less" scoped>
.container-staff {
  width: 100%;
  height: 100%;
}
</style>