<template>
  <div class="container-room-edit">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/robots' }">{{$t("robots.list.title")}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t("common.edit")}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="panel center">
      <div class="panel">
        <div class="item upload">
          <div class="title">{{$t("room.edit.avator")}}</div>
          <div class="content">
            <div class="avator">
              <img :src="getAvator(formInline.spacePicture)" v-if="formInline.spacePicture" alt />
              <img :src="formInline.uploadIcon" v-else class="add" alt />
            </div>
            <div class="button center">
              <div class="btnText">{{$t("room.edit.upload")}}</div>
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
          <div class="title">{{$t("room.edit.space")}}</div>
          <input v-model="formInline.spaceName" :placeholder="$t('room.edit.plzIptSpace')" />
        </div>
        <div class="item submit">
          <div class="button center" @click="submit">{{$t('common.save')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateRobotsInfo, queryOneRobotsInfo } from "@/api/robots";

export default {
  name: "staff-edit",
  data() {
    return {
      formInline: {
        uploadIcon: require("@/assets/svg/room.svg"),
        picFile: null,
        spacePicture: "",
        spaceName: "",
        spaceRemark: "",
        reserveRules: "",
        spacePermissions: "",
        reserveTimeType: "",
        permit: ""
      },
      roomListOptions: [
        {
          value: "1",
          label: "personnel.add.noRepeatable"
        },
        {
          value: "2",
          label: "personnel.add.repeatable"
        },
        {
          value: "3",
          label: "personnel.add.noAppoint"
        }
      ],
      timeListOptions: [
        {
          value: "1",
          label: "personnel.add.byTime"
        },
        {
          value: "2",
          label: "personnel.add.byDay"
        },
        {
          value: "3",
          label: "personnel.add.byWeek"
        },
        {
          value: "4",
          label: "personnel.add.byMon"
        }
      ],
      accessListOptions: [
        {
          value: "1",
          label: "personnel.add.open"
        },
        {
          value: "2",
          label: "personnel.add.close"
        },
        {
          value: "3",
          label: "personnel.add.authorized"
        }
      ],
      selectedRobots: [],
      selectableRobots: []
    };
  },
  methods: {
    getAvator(picture) {
      if (picture.includes("data:image")) {
        return picture;
      }
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    remove(tag, index) {
      this.selectedRobots.splice(index, 1);
      this.selectableRobots.unshift(tag);
    },
    addTag(tag, index) {
      console.log(tag);
      this.selectedRobots.push(tag);
      this.selectableRobots.splice(index, 1);
    },
    upload(event) {
      this.formInline.picFile = null;
      this.formInline.picFile = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.formInline.picFile);
      reader.onload = e => {
        this.formInline.spacePicture = e.target.result;
      };
    },
    submit() {
      let checked = this.check();
      if (checked) {
        this.updateSpaceInfo();
      }
      // let _this = this;
      // this.$toast({
      //   title: _this.$t("common.confirm"),
      //   content: _this.$t("personnel.edit.submitHint"),
      //   onOkText: _this.$t("common.confirm"),
      //   onConcelText: _this.$t("common.cancel"),
      //   onOk() {
      //     _this.addSpace();
      //   }
      // });
    },
    addSpace() {
      let checked = this.check();
      if (checked) {
        this.updateSpaceInfo();
      }
    },
    check() {
      console.log(this.formInline);
      let {
        picFile,
        spaceName,
        spaceRemark,
        reserveRules,
        permit,
        spacePermissions,
        reserveTimeType
      } = this.formInline;
      if (!picFile && !this.formInline.spacePicture) {
        this.$Message.error(this.$t("personnel.edit.plzUpload"));
        return false;
      }
      if (!spaceName) {
        this.$Message.error(this.$t("room.edit.space"));
        return false;
      }
      if (!reserveRules) {
        this.$Message.error(this.$t("room.edit.ruleHint"));
        return false;
      }
      if (!reserveTimeType) {
        this.$Message.error(this.$t("room.edit.ruleTime"));
        return false;
      }
      if (!permit) {
        this.$Message.error(this.$t("room.edit.access"));
        return false;
      }
      return true;
    },
    async updateSpaceInfo() {
      try {
        let formData = new FormData();
        let {
          picFile,
          robotId,
          spaceName,
          spaceRemark,
          permit,
          reserveRules,
          reserveTimeType
        } = this.formInline;
        let spacePermissions = [];
        this.selectedRobots.forEach(robot => {
          if (robot && robot.identifier) {
            spacePermissions.push(robot.identifier);
          }
        });
        if (picFile) {
          formData.append("picFile", picFile);
        }
        formData.append("robotId", robotId);
        formData.append("spaceName", spaceName);
        formData.append("spaceRemark", spaceRemark);
        formData.append("spacePermit", permit);
        formData.append("spacePermissions", spacePermissions.toString());
        formData.append("spaceReserveRules", reserveRules);
        formData.append("spaceReserveTimeType", reserveTimeType);
        const res = await updateSpaceInfo(formData, {
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
    async queryOneRobotsInfo(robotId) {
      try {
        let formData = new FormData();
        formData.append("robotId", robotId);
        const res = await queryOneRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);

        if (res.code == 1) {
          Object.assign(this.formInline, res.data);
          this.selectableRobots = res.data.noPermRobotList;
          this.selectedRobots = res.data.permRobotList;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    }
  },
  mounted() {
    this.queryOneRobotsInfo(this.$route.query.robotId);
  }
};
</script>

<style lang="less" scoped>
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
        margin-bottom: 5px;
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
            margin-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            text-align: justify;
            &::after {
              content: " ";
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