<template>
  <div class="container-visitor">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "visitor"
};
</script>

<style lang="less" scoped>
.container-visitor {
  width: 100%;
  height: 100%;
}
</style>