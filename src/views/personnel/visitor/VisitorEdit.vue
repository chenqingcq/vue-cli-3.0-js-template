<template>
  <div class="container-visitor-edit">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/visitor/list' }">{{$t('personnel.visitor.list')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{getVisitorName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="panel center">
      <div class="panel">
        <div class="item upload">
          <div class="title">{{$t('personnel.edit.avator')}}</div>
          <div class="content">
            <div class="avator">
              <img
                :src="getAvator(formInline.visitorPicture)"
                @click="handleZoom(formInline.visitorPicture)"
                v-if="formInline.visitorPicture"
                alt
              />
              <img :src="formInline.uploadIcon" v-else class="add" alt />
            </div>
            <div class="button center">
              <div class="btnText">{{$t('personnel.edit.upload')}}</div>
              <input
                type="file"
                :title="$t('personnel.edit.upload')"
                accept="image/png, image/jpeg, image/jpg"
                @change="upload"
              />
            </div>
          </div>
        </div>
        <div class="item name">
          <div class="title">{{$t('personnel.edit.name')}}</div>
          <input v-model="formInline.visitorName" :placeholder="$t('personnel.edit.plzIptName')" />
        </div>
        <div class="item dueTime">
          <div class="title">{{$t('personnel.edit.deadLine')}}</div>
          <el-date-picker
            style="width:100%"
            v-model="formInline.visitorDueTime"
            :placeholder="$t('personnel.edit.plzIptDeadLine')"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          ></el-date-picker>
        </div>
        <div class="item submit">
          <div class="button center" @click="submit">{{$t('common.submit')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryOneUserInfo,
  updateVisitorInfo,
  resetPassword
} from "@/api/personnel";

export default {
  name: "visitor-edit",
  data() {
    return {
      formInline: {
        uploadIcon: require("@/assets/svg/upload.svg"),
        picFile: null,
        visitorName: "",
        visitorPicture: "",
        visitorDueTime: "",
        visitorAccount: ""
      }
    };
  },
  computed: {
    getVisitorName() {
      let { visitorName } = this.$route.query;
      return this.$t("common.edit") + (visitorName ? ` / ${visitorName}` : "");
    }
  },
  methods: {
    handleZoom(picture) {
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${picture}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain"
        }
      });
    },
    getAvator(picture) {
      if (picture.includes("data:image")) {
        return picture;
      }
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    upload(event) {
      this.formInline.picFile = null;
      this.formInline.picFile = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.formInline.picFile);
      reader.onload = e => {
        this.formInline.visitorPicture = e.target.result;
      };
    },
    submit() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.submitHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateVisitorInfo();
        }
      });
    },
    reset() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.resetHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.resetPassword(_this.$route.query.visitorId);
        }
      });
    },
    async resetPassword(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await resetPassword(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);

        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure") + res.msg);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
    async updateVisitorInfo() {
      try {
        let formData = new FormData();
        let {
          picFile,
          visitorId,
          visitorName,
          visitorDueTime,
          visitorPicture
        } = this.formInline;
        if (picFile) {
          formData.append("picFile", picFile);
        }
        formData.append("visitorId", visitorId);
        formData.append("visitorName", visitorName);
        formData.append("visitorDueTime", visitorDueTime);
        const res = await updateVisitorInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res, picFile);
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
          this.formInline.picFile = null;
        } else {
          this.$Message.success(this.$t("common.saveFailure"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      } finally {
        this.formInline.picFile = null;
      }
    },
    async queryOneUserInfo(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await queryOneUserInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);

        if (res.code == 1) {
          // this.$Message.success("删除成功");
          Object.assign(this.formInline, res.data);
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.queryOneUserInfo(vm.$route.query.visitorId);
    });
  }
};
</script>

<style lang="less" scoped>
.container-visitor-edit {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  > .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .panel {
    height: calc(100% - 60px - 68px);
    overflow-y: auto;
    .panel {
      width: 400px;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 10px;
        }
        &.upload {
          .content {
            display: flex;
            .avator {
              width: 140px;
              height: 140px;
              border-radius: 2px;
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
            .button {
              position: relative;
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              &:hover {
                cursor: pointer;
                color: #000;
                border: 1px solid #ccc;
              }
              input {
                display: inline-block;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
                z-index: 999;
                position: absolute;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
        &.name,
        &.dueTime {
          input {
            display: inline-block;
            height: 42px;
            line-height: 42px;
            width: 100%;
            border-radius: 4px;
            background: none;
            outline: none;
            border: 1px solid #ccc;
            padding-left: 12px;
            &:focus {
              border: 1px solid #419aee;
            }
          }
        }
        &.account {
          .content {
            display: flex;
            .account {
              width: 100px;
              height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
              line-height: 42px;
            }
            .button {
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              color: #ff5b5b;
              &:hover {
                cursor: pointer;
                border: 1px solid #ff5b5b;
              }
            }
          }
        }
        &.submit {
          .button {
            height: 42px;
            border-radius: 4px;
            font-size: 18px;
            letter-spacing: 5px;
            color: #fff;
            background: linear-gradient(90deg, #3172ff 0%, #419aee 100%);

            &:hover {
              cursor: pointer;
            }
            &.disable {
              background-color: #cccccc;
              cursor: not-allowed;
              pointer-events: none;
            }
          }
        }
      }
    }
  }
}
</style>