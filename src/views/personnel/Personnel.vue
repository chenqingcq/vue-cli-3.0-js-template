<template>
  <div class="container-personnel">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "container-personnel"
};
</script>

<style lang="less" scoped>
.container-personnel {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>