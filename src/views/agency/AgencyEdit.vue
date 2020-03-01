<template>
  <div class="container-room-edit">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/agency' }">{{$t("agency.title")}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t("agency.edit.title")}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="panel center">
      <div class="panel">
        <div class="item upload">
          <div class="title">{{$t("agency.list.logo")}}</div>
          <div class="content">
            <div class="avator">
              <img
                v-if="formInline.agencyLogo"
                :src="getAvator(formInline.agencyLogo)"
                @click="handleZoom(formInline.agencyLogo)"
                alt
              />
              <img v-else :src="formInline.uploadIcon" class="add" />
            </div>
            <div class="button center">
              <div class="btnText">{{$t("agency.add.upload")}}</div>
              <input
                type="file"
                :title="$t('room.edit.upload')"
                accept="image/png, image/jpeg, image/jpg"
                @change="upload"
              />
            </div>
          </div>
        </div>
        <div class="item name">
          <div class="title">{{$t("agency.list.name")}}</div>
          <input v-model="formInline.agencyName" :placeholder="$t('agency.add.plzAddName')" />
        </div>
        <div class="item name">
          <div class="title">{{$t("agency.add.address")}}</div>
          <input v-model="formInline.agencyAddress" :placeholder="$t('agency.add.plzIptAddress')" />
        </div>
        <div class="item name">
          <div class="title">{{$t('agency.add.account')}}</div>
          <div class="center" id="agency-account">
            <input v-model="formInline.agencyAccount" :placeholder="$t('agency.add.plzIptAccount')" />
            <div class="reset center" @click="reset">{{$t("personnel.edit.reset")}}</div>
          </div>
        </div>
        <div class="item submit">
          <div class="button center" @click="submit">{{$t('common.submit')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  queryOneAgencyInfo,
  updateAgencyInfo,
  updateAgencyPassword
} from "@/api/agency";

export default {
  name: "staff-edit",
  data() {
    return {
      formInline: {
        uploadIcon: require("@/assets/svg/company.svg"),
        picFile: "",
        agencyLogo: "",
        agencyName: "",
        agencyAccount: "",
        agencyAddress: ""
      }
    };
  },
  computed: {
    ...mapGetters(["getAgencyType"])
  },
  methods: {
    ...mapMutations(["setAgencyInfo", "setAgencyLogo"]),
    handleZoom(picture) {
      let src = this.getAvator(picture);
      this.$previewImg({
        src,
        style: {
          width: 500,
          height: 400,
          objectFit:"contain"
        }
      });
    },
    getAvator(picture = "") {
      if (picture.startsWith("data:image")) {
        return picture;
      }
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    upload(event) {
      console.log(event.target.files);
      this.formInline.picFile = event.target.files[0];
      let reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = e => {
          console.log(e);
          this.formInline.agencyLogo = e.target.result;
        };
      }
    },
    reset() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.resetHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateAgencyPassword(_this.$route.query.agencyId);
        }
      });
    },
    submit() {
      let checked = this.check();
      if (!checked) return;
      let _this = this;
      this.$toast({
        title: `${_this.$t("common.confirm")}?`,
        content: `${_this.$t("common.submitText")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateAgencyInfo();
        }
      });
    },
    check() {
      console.log(this.formInline);
      let {
        picFile,
        agencyLogo,
        agencyName,
        agencyAddress,
        agencyAccount
      } = this.formInline;
      if (!picFile && !agencyLogo) {
        this.$Message.error(this.$t("personnel.edit.plzUpload"));
        return false;
      }
      if (!agencyName) {
        this.$Message.error(this.$t("agency.add.plzAddName"));
        return false;
      }
      if (!agencyAddress) {
        this.$Message.error(this.$t("agency.add.plzIptAddress"));
        return false;
      }
      if (!agencyAccount) {
        this.$Message.error(this.$t("agency.add.plzIptAccount"));
        return false;
      }
      return true;
    },
    async updateAgencyPassword(agencyId, newPassWord) {
      try {
        let formData = new FormData();
        formData.append("agencyId", agencyId);
        formData.append("newPassWord", this.$md5("123456"));
        const res = await updateAgencyPassword(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
          if (this.getAgencyType == 2) {
            setTimeout(() => {
              this.$router.push("/login", () => {
                this.setAgencyInfo("");
                window.localStorage.setItem(process.env.TOKEN, "");
                window.location.reload();
              });
            }, 1000);
          }
        } else {
          this.$Message.error(this.$t("common.saveFailure"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
    async updateAgencyInfo() {
      try {
        let {
          picFile,
          agencyName,
          agencyAddress,
          agencyAccount
        } = this.formInline;
        let formData = new FormData();
        if (picFile) {
          formData.append("picFile", picFile);
        }
        formData.append("agencyName", agencyName);
        formData.append("agencyAddress", agencyAddress);
        formData.append("agencyId", this.$route.query.agencyId);
        formData.append("agencyAccount", agencyAccount);
        const res = await updateAgencyInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.queryOneAgencyInfo();
          this.$Message.success(this.$t("personnel.edit.success"));
        } else {
          this.$Message.error(this.$t("personnel.edit.error"));
        }
      } catch (err) {
        this.$Message.error(this.$t("personnel.edit.error"));
      }
    },
    async queryOneAgencyInfo() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.$route.query.agencyId);
        const res = await queryOneAgencyInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          let {
            agencyLogo,
            agencyName,
            agencyAddress,
            agencyAccount
          } = res.data;
          Object.assign(this.formInline, {
            agencyLogo,
            agencyName,
            agencyAddress,
            agencyAccount
          });
          if (this.getAgencyType == 2) {
            this.setAgencyLogo({ agencyLogo, agencyName });
          }
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  mounted() {
    this.queryOneAgencyInfo();
  }
};
</script>

<style lang="less" scoped>
#agency-account {
  justify-content: space-between;
  input {
    width: calc(100% - 80px);
  }
  .reset {
    width: auto;
    white-space: nowrap;
    height: 35px;
    border-radius: 4px;
    background-color: #ededed;
    margin-left: 20px;
    color: #ff5b5b;
    padding: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

.container-room-edit {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .panel {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 20px 0;
    .panel {
      width: 400px;
      height: 100%;
      .item {
        margin-bottom: 15px;
        .title {
          margin-bottom: 10px;
        }
        &.upload {
          .content {
            display: flex;
            .avator {
              width: 180px;
              height: 140px;
              border-radius: 2px;
              img {
                display: inline-block;
                width: 100%;
                height: 100%;
                object-fit: contain;
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
        &.tags {
          .hint {
            margin-bottom: 12px;
            color: #999;
            font-size: 12px;
          }
          .content {
            width: 100%;
            height: auto;
            margin-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            text-align: justify;
            &::after {
              content: "";
              width: 30%;
            }
            .selectable {
              color: #333;
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              border: none;
              background-color: #ededed;
              height: 35px;
              padding: 10px;
              margin-bottom: 10px;
            }
            .selected {
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              margin-bottom: 10px;
            }
            .noData {
              width: 100%;
              color: #999;
              font-size: 12px;
              text-align: center;
            }
            .add {
              font-size: 18px;
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