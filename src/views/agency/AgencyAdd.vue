<template>
  <div class="container-agency-add">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/agency' }">{{$t("agency.title")}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t("agency.list.add")}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="panel center">
      <div class="panel">
        <div class="item upload">
          <div class="title">{{$t("agency.list.logo")}}</div>
          <div class="content">
            <div class="avator">
              <img :src="formInline.headPath" v-if="formInline.headPath" alt />
              <img :src="formInline.uploadIcon" v-else class="add" alt />
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
          <input
            clearable
            v-model.trim="formInline.companyName"
            :placeholder="$t('agency.add.plzAddName')"
          />
        </div>
        <div class="item name">
          <div class="title">{{$t("agency.add.address")}}</div>
          <input
            clearable
            v-model.trim="formInline.companyAddress"
            :placeholder="$t('agency.add.plzIptAddress')"
            style="height:45px"
          />
        </div>
        <div class="item name">
          <div class="title">{{$t('agency.add.account')}}</div>
          <input
            clearable
            class="ruleName"
            v-model.trim="formInline.companyAccount"
            :placeholder="$t('agency.add.plzIptAccount')"
            style="height:45px"
          />
        </div>
        <div class="item name">
          <div class="title">{{$t("agency.add.psw")}}</div>
          <input
            clearable
            v-model.trim="formInline.companyPassword"
            type="password"
            :placeholder="$t('agency.add.plzIptPsw')"
            style="height:45px"
          />
        </div>
        <div class="item account">
          <div class="title">{{$t('agency.add.model')}}</div>
          <el-select
            v-model.trim="formInline.companyModelVersion"
            class="ruleName"
            style="width:100%;height:42px;border-radius: 2px;"
            :placeholder="$t('agency.add.plzSelectModel')"
            @visible-change="handleGetModelVersion"
          >
            <el-option
              v-for="item in modelVersionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="item account">
          <div class="title">{{$t('agency.list.scan')}}</div>
          <el-select
            v-model.trim="formInline.companySupportScan"
            class="ruleName"
            style="width:100%;height:42px;border-radius: 2px;"
            :placeholder="$t('agency.list.plzIptScan')"
          >
            <el-option
              v-for="item in supportScanOptions"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="item account">
          <div class="title">{{$t('agency.add.filter')}}</div>
          <el-select
            v-model.trim="formInline.companyFilter"
            class="ruleName"
            style="width:100%;height:42px;border-radius: 2px;"
            :placeholder="$t('agency.add.plzSelectFilter')"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="item name">
          <div class="title">{{$t("agency.add.theshold")}} {{getTheshold}}</div>
          <el-slider v-model="formInline.companyThreshold" :show-tooltip="false"></el-slider>
        </div>
        <div class="item submit">
          <div class="button center" @click="submit">{{$t('common.add')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addAgencyInfo, queryFeatureModel } from "@/api/agency";

export default {
  name: "staff-add",
  data() {
    return {
      formInline: {
        picFile: null,
        headPath: "",
        uploadIcon: require("@/assets/svg/company.svg"),
        companyName: "",
        companyAddress: "",
        companyAccount: "",
        companyPassword: "",
        companyThreshold: 100,
        companyModelVersion: "",
        companyFilter: "",
        companySupportScan: ""
      },
      modelVersionList: [],
      filterOptions: [
        {
          value: "1",
          label: "agency.add.yes"
        },
        {
          value: "2",
          label: "agency.add.no"
        }
      ],
      supportScanOptions: [
        {
          value: "1",
          label: "agency.add.yes"
        },
        {
          value: "2",
          label: "agency.add.no"
        }
      ]
    };
  },
  computed: {
    getTheshold() {
      return `( ${this.formInline.companyThreshold / 100} )`;
    }
  },
  methods: {
    upload(event) {
      console.log(event.target.files);
      this.formInline.picFile = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.formInline.picFile);
      reader.onload = e => {
        console.log(e);
        this.formInline.headPath = e.target.result;
      };
    },
    submit() {
      let checked = this.check();
      let _this = this;
      if (!checked) return;
      this.$toast({
        title: `${_this.$t("common.confirm")}?`,
        content: `${_this.$t("common.confirm")}${_this.$t("agency.list.add")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.addAgencyInfo();
        }
      });
    },
    check() {
      console.log(this.formInline);
      let {
        picFile,
        companyName,
        companyAddress,
        companyAccount,
        companyPassword,
        companyModelVersion,
        companyFilter,
        companySupportScan
      } = this.formInline;
      if (!picFile) {
        this.$Message.error(this.$t("agency.add.plzUpload"));
        return false;
      }
      if (!companyName) {
        this.$Message.error(this.$t("agency.add.plzAddName"));
        return false;
      }
      if (!companyAddress) {
        this.$Message.error(this.$t("agency.add.plzIptAddress"));
        return false;
      }
      if (!companyAccount) {
        this.$Message.error(this.$t("agency.add.plzIptAccount"));
        return false;
      }
      if (!companyPassword) {
        this.$Message.error(this.$t("agency.add.plzIptPsw"));
        return false;
      }
      if (companyModelVersion === "") {
        this.$Message.error(this.$t("agency.add.plzSelectModel"));
        return false;
      }
      if (!companySupportScan) {
        this.$Message.error(this.$t("agency.list.plzIptScan"));
        return false;
      }
      if (!companyFilter) {
        this.$Message.error(this.$t("agency.list.plzSelectFilter"));
        return false;
      }
      return true;
    },
    handleGetModelVersion(show) {
      if (!show) return;
      this.queryFeatureModel();
    },
    reset() {
      Object.assign(this.formInline, {
        picFile: "",
        headPath: "",
        companyName: "",
        companyAddress: "",
        companyAccount: "",
        companyPassword: "",
        companySupportScan: "",
        companyModelVersion: "",
        companyThreshold: 100,
        companyFilter: ""
      });
    },
    async addAgencyInfo() {
      console.log(this.formInline);
      try {
        let {
          picFile,
          companyName,
          companyAddress,
          companyAccount,
          companyPassword,
          companySupportScan,
          companyModelVersion,
          companyFilter,
          companyThreshold
        } = this.formInline;
        let formData = new FormData();
        formData.append("picFile", picFile);
        formData.append("companyName", companyName);
        formData.append("companyAccount", companyAccount);
        formData.append("companyPassword", this.$md5(companyPassword));
        formData.append("companyThreshold", companyThreshold / 100);
        formData.append("companyAddress", companyAddress);
        formData.append("companyModelVersion", companyModelVersion);
        formData.append("companySupportScan", companySupportScan);
        formData.append("companyFilter", companyFilter);
        const res = await addAgencyInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.reset();
          this.$Message.success(this.$t("common.addSuccess"));
        } else {
          this.$Message.error(this.$t("common.addFailure") + res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.addFailure"));
      }
    },
    async queryFeatureModel() {
      try {
        let formData = new FormData();
        const res = await queryFeatureModel(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.modelVersionList = res.data.map(item => {
            if (item) {
              let { index, name } = item;
              return {
                value: index,
                label: name
              };
            }
          });
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
    this.reset();
  }
};
</script>

<style lang="less" scoped>
.container-agency-add {
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
        margin-bottom: 2px;
        .title {
          margin-bottom: 5px;
        }
        &.upload {
          .content {
            display: flex;
            .avator {
              width: 160px;
              height: 120px;
              border-radius: 2px;
              img {
                display: inline-block;
                width: 100%;
                height: 100%;
                object-fit: contain;
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
                font-size: 14px;
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
            font-size: 14px;
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
          margin-top: 10px;
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