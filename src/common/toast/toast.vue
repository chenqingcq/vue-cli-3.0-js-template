<template>
  <div class="toast-container center" v-if="show">
    <div class="panel">
      <div class="title center">{{title}}</div>
      <div class="content center" v-html="content"></div>
      <div class="footer">
        <div class="concel center" @click="handleConcel">{{onConcelText}}</div>
        <div class="confirm center" @click="handleConfirm">{{onOkText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "toast",
  methods: {
    handleConfirm() {
      this.show = false;
      this.onOk();
    },
    handleConcel() {
      this.show = false;
      this.onConcel();
    }
  }
};
</script>

<style scoped lang='less'>
.toast-container {
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
  .panel {
    width: 300px; /*no*/
    // height: 30%;
    min-height: 160px; /*no*/
    background: #fff;
    // border-radius: 10px;
    display: flex;
    flex-direction: column;
    .title {
      height: 43px;
      font-size: 18px; /*no*/
      color: #222;
      font-weight: bold;
    }
    .content {
      flex: 1;
      font-size: 14px; /*no*/
      color: #333;
      width: 70%;
      word-break: break-all;
      text-align: center;
      margin: 0 auto;
      padding-top: 10px;
      padding-bottom: 5px;
      line-height: 20px;
      align-items: flex-start;
    }
    .footer {
      height: 43px;
      display: flex;
      border-top: 1px solid rgba(223, 223, 224, 0.5); /*no*/
      div {
        flex: 1;
        font-size: 18px; /*no*/
        &:hover {
          cursor: pointer;
        }
        &:first-of-type {
          color: #333;
        }
        &:last-of-type {
          border-left: 1px solid rgba(223, 223, 224, 0.5); /*no*/
          color: #0eb4ff;
          &:hover {
            color: #298df8;
          }
        }
      }
    }
  }
}
</style>