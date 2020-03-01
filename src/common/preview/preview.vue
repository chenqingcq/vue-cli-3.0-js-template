<template>
  <div class="container-preview center" v-if="show" @click="handleHide">
    <img :src="src" :style="computedStyle" alt />
  </div>
</template>

<script>
import {
  launchFullscreen,
  exitFullscreen,
  isFullScreen
} from "@/utils/fullscreen";
export default {
  computed: {
    computedStyle() {
      return {
        ...this.style
      };
    }
  },
  watch: {
    show: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && this.fullscreen) {
          launchFullscreen(document.documentElement || document);
        }
        if (!val && isFullScreen()) {
          exitFullscreen(document.documentElement || document);
        }
      }
    }
  },
  methods: {
    handleHide() {
      this.show = false;
    }
  }
};
</script>

<style scoped lang='less'>
.container-preview {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>