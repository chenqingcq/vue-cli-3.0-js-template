<template>
  <div class="popup-container" v-if="show">
    <div class="panel center">{{content}}</div>
  </div>
</template>
<script>
export default {
  name: "popup",
  mounted() {
    setTimeout(() => {
      this.show = false;
    }, this.duration);
  }
};
</script>
<style lang="less" scoped>
.popup-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  .panel {
    width: auto;
    min-width: 100px;
    padding: 10px;
    height: 50px;
    background: rgba(0, 0, 0, 0.8 );
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
  }
}
</style>