<template>
  <div class="container-room-edit">
    <template>
      <div class="header center">
        <div class="bream">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
            <el-breadcrumb-item :to="{ path: '/main/room' }">{{$t("room.header")}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{getSpace}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="panel center">
        <div class="panel">
          <div class="item upload">
            <div class="title">{{$t("room.authorize.avator")}}</div>
            <div class="content">
              <template v-if="formInline.spacePics.length">
                <div
                  class="avator"
                  v-for="(item , index) in formInline.spacePics"
                  :key="`${index}-space-picture`"
                  @mouseenter="handleShowDeleteIcon(item , true)"
                  @mouseleave="handleShowDeleteIcon(item , false)"
                >
                  <img
                    :src="getAvator(item.picture)"
                    @click="handleZoom(item.picture)"
                    alt
                    class="picture"
                  />
                  <img
                    @click="deletePicture(item , index)"
                    v-show="item.active"
                    :src="deleteIcon"
                    :title="$t('common.delete')"
                    class="delete"
                  />
                </div>
              </template>
              <template v-if="formInline.uploadPicture">
                <div
                  class="avator"
                  @mouseenter="handleDisplayDeleteIcon(true)"
                  @mouseleave="handleDisplayDeleteIcon(false)"
                >
                  <img
                    :src="getAvator(formInline.uploadPicture)"
                    @click="handleZoom(formInline.uploadPicture)"
                    alt
                    class="picture"
                  />
                  <img
                    @click="deleteUploadPicture"
                    v-show="uploadActive"
                    :src="deleteIcon"
                    :title="$t('common.delete')"
                    class="delete"
                  />
                </div>
              </template>
              <div class="button center">
                <div class="btnText">
                  <img :src="formInline.addIcon" class="add" alt />
                </div>
                <input
                  type="file"
                  multiple
                  :title="$t('room.edit.upload')"
                  accept="image/*"
                  @change="upload"
                />
              </div>
            </div>
          </div>
          <div class="item name">
            <div class="title">{{$t("room.edit.space")}}</div>
            <input v-model="formInline.spaceName" :placeholder="$t('room.edit.plzIptSpace')" />
          </div>
          <div class="item name">
            <div class="title">{{$t("room.edit.address")}}</div>
            <input v-model.trim="formInline.address" :placeholder="$t('room.edit.plzIptAddress')" />
          </div>
          <div class="item account">
            <div class="title">{{$t('room.edit.access')}}</div>
            <el-select
              v-model="formInline.permit"
              class="ruleName"
              style="width:100%;height:42px;border-radius: 2px;"
              :placeholder="$t('room.edit.ruleHint')"
            >
              <el-option
                v-for="item in accessListOptions"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="item account" v-if="showRules">
            <div class="title">{{$t('room.edit.rule')}}</div>
            <!-- <el-select
              v-model="formInline.reserveRules"
              class="ruleName"
              style="width:100%;height:42px;border-radius: 2px;"
              :placeholder="$t('room.edit.ruleHint')"
              :disabled="formInline.permit == 3 && formInline.cacheReserveRules != 0"
            >
              <el-option
                v-for="item in roomListOptions"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>-->
            <el-select
              v-model="formInline.reserveRules"
              class="ruleName"
              style="width:100%;height:42px;border-radius: 2px;"
              :placeholder="$t('room.edit.ruleHint')"
            >
              <el-option
                v-for="item in roomListOptions"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-if="formInline.reserveRules!=3"
              v-model="formInline.reserveTimeType"
              class="ruleName"
              style="width:100%;height:42px;border-radius: 2px;margin-top:16px"
              :placeholder="$t('room.edit.ruleTime')"
              @change="handleRulesChange"
            >
              <el-option
                v-for="item in timeListOptions"
                v-show="item.show"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="item dueTime">
            <div class="title">{{$t("room.edit.remark")}}</div>
            <input v-model.trim="formInline.spaceRemark" :placeholder="$t('room.edit.plzIptRmk')" />
          </div>
          <div class="item" style="margin-top:20px">
            <div class="title">{{$t("room.edit.setRemindTime")}}</div>
            <Slider
              :disabled="remindHourDisabled"
              :max="60*24"
              v-model="formInline.remindHour"
              style="width:90%;display:inline-block"
              show-input
            ></Slider>
            <span class="minutes">{{$t('common.minutes')}}</span>
          </div>
          <div class="item" style="margin-top:20px">
            <div class="title">{{$t("room.edit.setCancelTime")}}</div>
            <Slider
              :disabled="cancelLimitHourDisabled"
              :max="60*24"
              v-model="formInline.cancelLimitHour"
              style="width:90%;display:inline-block"
              show-input
            ></Slider>
            <span class="minutes">{{$t('common.minutes')}}</span>
          </div>
          <div class="item tags">
            <div class="title">{{$t("room.edit.tags")}}</div>
            <template>
              <div class="content">
                <template v-if="formInline.tags.length">
                  <el-tag
                    v-for="(tag , index ) in formInline.tags"
                    :key="`selected-${index}`"
                    :title="tag"
                    :disable-transitions="false"
                    closable
                    class="selected"
                    type="info"
                    @close="handleClose( index)"
                  >{{tag}}</el-tag>
                </template>
                <template>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                  >{{$t("room.edit.addTag")}}+</el-button>
                </template>
              </div>
            </template>
          </div>
          <div class="item tags">
            <div class="title">{{$t('room.edit.robot')}}</div>
            <template>
              <div class="hint">{{$t('room.edit.selected')}}</div>
              <div class="content" v-if="selectedRobots.length">
                <el-tag
                  v-for="(tag , index ) in selectedRobots"
                  :key="`selected-${index}`"
                  :title="tag.identifier"
                  closable
                  class="selected"
                  type="info"
                  @close="remove(tag , index)"
                >{{tag.name}}</el-tag>
              </div>
              <div class="content" v-else>
                <div class="noData">{{$t('common.noData')}}</div>
              </div>
            </template>
            <template>
              <div class="hint">
                <span>{{$t('room.edit.selectable')}}</span>
                <span class="add" @click="handleShowAdDialog">{{$t("robots.add.title")}}</span>
              </div>
              <div class="content" v-if="selectableRobots.length">
                <el-button
                  class="selectable"
                  style="margin-left:0"
                  v-for="(tag , index ) in selectableRobots"
                  :key="`selectable-${index}`"
                  :title="tag.identifier"
                  :type="tag.type"
                  @click="addTag(tag , index)"
                >
                  {{tag.name}}
                  <span class="add">+</span>
                </el-button>
              </div>
              <div class="content" v-else>
                <div class="noData">{{$t('common.noData')}}</div>
              </div>
            </template>
          </div>
          <div class="item submit">
            <div class="button center" @click="submit">{{$t('common.submit')}}</div>
          </div>
        </div>
      </div>
    </template>
    <template>
      <el-dialog
        :title="$t('robots.add.title')"
        :visible.sync="centerDialogVisible"
        v-if="centerDialogVisible"
        width="600px"
      >
        <el-form
          :model="formInline"
          :rules="rules"
          ref="editForm"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('robots.add.name')" prop="name">
            <el-input
              v-model.trim="formInline.name"
              :placeholder="$t('robots.add.plzIptName')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('robots.add.SN')" prop="identifier">
            <el-input
              v-model.trim="formInline.identifier"
              :placeholder="$t('robots.add.plzIptSN')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('robots.add.type')" prop="robotType">
            <el-select
              style="width:100%"
              v-model="formInline.robotType"
              :placeholder="$t('robots.add.plzSelectType')"
            >
              <el-option
                v-for="item  in robotTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('robots.add.model')" prop="robotModel">
            <el-select
              style="width:100%"
              v-model="formInline.robotModel"
              @visible-change="queryRobotModelInfo"
              :placeholder="$t('robots.add.plzSelectModel')"
            >
              <el-option
                v-for="item  in robotModelOptions"
                :key="item.value"
                :label="item.label"
                :title="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            @click="centerDialogVisible = false"
            style="border-radius:0px;width:75px"
          >{{$t("common.cancel")}}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleAddRobot('editForm')"
            style="border-radius:0px;width:75px"
          >{{$t("common.add")}}</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import store from "@/store/store";
import {
  updateSpaceInfo,
  queryOneSpaceInfo,
  updateSpace,
  getSpaceInfo,
  uploadFile,
  deleteFile
} from "@/api/room";
import { addRobotsInfo, queryRobotModelInfo } from "@/api/robots";
const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";

export default {
  name: "room-edit",
  data() {
    return {
      cancelLimitHourDisabled: false,
      remindHourDisabled: false,
      centerDialogVisible: false,
      uploadActive: false,
      inputVisible: false,
      inputValue: "",
      deleteIcon: require("@/assets/svg/delete.svg"),
      formInline: {
        uploadIcon: require("@/assets/svg/room.svg"),
        addIcon: require("@/assets/svg/room-add.svg"),
        picFile: null,
        spacePics: [],
        deletePics: [],
        tags: [],
        address: "",
        uploadPicture: "",
        spaceName: "",
        spaceRemark: "",
        cancelLimitHour: 60,
        remindHour: 5,
        reserveRules: "",
        spacePermissions: "",
        reserveTimeType: "",
        cacheReserveTimeType: "",
        cacheReserveRules: "",
        permit: ""
      },
      robotModelOptions: [],
      robotTypeOptions: [
        {
          value: "1",
          label: "Solaris"
        },
        {
          value: "2",
          label: "Ego"
        },
        {
          value: "3",
          label: "Smarteye"
        },
        {
          value: "4",
          label: "Iknow"
        },
        {
          value: "5",
          label: "Alpha"
        },
        {
          value: "6",
          label: "Tianbo"
        }
      ],
      roomListOptions: [
        {
          value: 1,
          label: "personnel.add.noRepeatable"
        },
        {
          value: 2,
          label: "personnel.add.repeatable"
        },
        {
          value: 3,
          label: "personnel.add.noAppoint"
        }
      ],
      timeListOptions: [
        {
          value: 1,
          label: "personnel.add.byTime",
          show: true
        },
        {
          value: 2,
          label: "personnel.add.byDay",
          show: true
        },
        {
          value: 3,
          label: "personnel.add.byWeek",
          show: false
        },
        {
          value: 4,
          label: "personnel.add.byMon",
          show: true
        },
        {
          value: 5,
          label: "personnel.add.byTimes",
          show: true
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
  computed: {
    getSpace() {
      let { spaceName } = this.$route.query;
      return this.$t("common.edit") + (spaceName ? ` / ${spaceName}` : "");
    },
    showRules() {
      if (this.formInline.permit == 1 || this.formInline.permit == 2) {
        return false;
      }
      return true;
    }
  },
  methods: {
    handleRulesChange() {
      log(this.formInline.reserveTimeType);
      if (this.formInline.reserveTimeType == 5) {
        this.cancelLimitHourDisabled = true;
        this.remindHourDisabled = true;
        this.formInline.remindHour = 0;
        this.formInline.cancelLimitHour = 0;
      } else {
        this.cancelLimitHourDisabled = false;
        this.remindHourDisabled = false;
      }
    },
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
    handleClose(index) {
      this.formInline.tags.splice(index, 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formInline.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleAddRobot(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRobotsInfo();
        }
      });
    },
    initRules() {
      this.rules = {
        name: [
          {
            required: true,
            message: this.$t("robots.add.plzIptName"),
            trigger: "blur"
          }
        ],
        identifier: [
          {
            required: true,
            message: this.$t("robots.add.plzIptSN"),
            trigger: "blur"
          }
        ],
        robotType: [
          {
            required: true,
            message: this.$t("robots.add.plzSelectType"),
            trigger: "change"
          }
        ],
        robotModel: [
          {
            required: true,
            message: this.$t("robots.add.plzSelectModel"),
            trigger: "change"
          }
        ]
      };
    },
    handleShowAdDialog() {
      this.initRules();
      this.centerDialogVisible = true;
    },
    getAvator(picture) {
      if (picture.includes("data:image")) {
        return picture;
      }
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    handleShowDeleteIcon(item, show) {
      item.active = show;
    },
    handleDisplayDeleteIcon(show) {
      this.uploadActive = show;
    },
    deletePicture(item, index) {
      this.formInline.deletePics.push(item.picture);
      this.formInline.spacePics.splice(index, 1);
    },
    deleteUploadPicture() {
      this.formInline.uploadPicture = null;
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
      if (event.target.files && event.target.files.length) {
        if (event.target.files.length <= 5) {
          let uploadFileTasks = [];
          [...event.target.files].forEach(file => {
            uploadFileTasks.push(this.uploadFile(file));
          });
          Promise.all(uploadFileTasks)
            .then(res => {
              this.formInline.spacePics.push(
                ...res.map(item => {
                  return {
                    picture: `/${item.data.url}`,
                    active: false
                  };
                })
              );
            })
            .catch(err => {
              this.$Message.error(this.$t("common.uploadError"));
            });
        } else {
          this.$Message.error(this.$t("room.edit.maxlimit"));
        }
      }
    },
    submit() {
      let checked = this.check();
      if (!checked) return;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.submitHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          // _this.updateSpaceInfo();
          if (_this.formInline.deletePics.length) {
            _this.formInline.deletePics.forEach(picture => {
              _this.deleteFile(picture);
            });
          }
          _this.updateSpace();
        }
      });
    },
    check() {
      console.log(this.formInline);
      let {
        picFile,
        spaceName,
        address,
        spaceRemark,
        reserveRules,
        permit,
        spacePermissions,
        reserveTimeType
      } = this.formInline;
      if (!picFile && !this.formInline.spacePics.length) {
        this.$Message.error(this.$t("room.edit.plzUpload"));
        return false;
      }
      if (!spaceName) {
        this.$Message.error(this.$t("room.edit.plzIptSpace"));
        return false;
      }
      if (!address.length) {
        this.$Message.error(this.$t("room.edit.plzIptAddress"));
        return false;
      }
      if (!permit) {
        this.$Message.error(this.$t("room.edit.accessHint"));
        return false;
      }
      if (permit == 3) {
        if (!reserveRules) {
          this.$Message.error(this.$t("room.edit.ruleHint"));
          return false;
        }
        if (!reserveTimeType) {
          this.$Message.error(this.$t("room.edit.ruleTime"));
          return false;
        }
      }
      // if (this.selectableRobots.length && !this.selectedRobots.length) {
      //   this.$Message.error(this.$t("room.edit.plzSelect"));
      //   return false;
      // }
      // if (!this.selectedRobots.length && !this.selectableRobots.length) {
      //   this.$Message.error(this.$t("room.edit.plzAdd"));
      //   return false;
      // }
      return true;
    },
    async deleteFile(path) {
      try {
        const res = await deleteFile({
          path
        });
      } catch (err) {
        this.deleteFile(path);
      }
    },
    async uploadFile(file) {
      try {
        let { extraToken } = store.state[USERINFO].userInfo || {};
        let formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", 2);
        formData.append("msToken", extraToken);
        return await uploadFile(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        this.$Message.error(this.$t("common.uploadError"));
      }
    },
    async addRobotsInfo() {
      try {
        let formData = new FormData();
        let { name, identifier, robotType, robotModel } = this.formInline;
        formData.append("name", name);
        formData.append("identifier", identifier);
        formData.append("robotType", robotType);
        formData.append("robotModel", robotModel);
        const res = await addRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
          this.centerDialogVisible = false;
          this.searchSpace();
        } else {
          this.$Message.error(this.$t("common.saveFailure") + res.msg);
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async queryRobotModelInfo(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        const res = await queryRobotModelInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.robotModelOptions = res.data.map(item => {
            if (item) {
              let { robotModel, robotModelName, robotModelComnt } = item;
              let label = `${robotModelName} ${
                robotModelComnt ? `( ${robotModelComnt} )` : ""
              } `;
              return {
                label,
                value: robotModel
              };
            }
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async updateSpaceInfo() {
      try {
        let formData = new FormData();
        let {
          picFile,
          spaceId,
          spaceName,
          spaceRemark,
          spacePics,
          permit,
          reserveRules,
          reserveTimeType,
          cancelLimitHour,
          remindHour
        } = this.formInline;
        let spacePermissions = [];
        this.selectedRobots.forEach(robot => {
          if (robot && robot.identifier) {
            spacePermissions.push(robot.identifier);
          }
        });
        let spaceHeaders = [];
        spacePics.forEach(space => {
          if (space && space.picture) {
            spaceHeaders.push(space.picture);
          }
        });
        if (picFile) {
          formData.append("picFile", picFile);
        }
        formData.append("spacePics", spaceHeaders.join(";") || "");
        formData.append("spaceId", spaceId);
        formData.append("spaceName", spaceName);
        formData.append("spaceRemark", spaceRemark);
        formData.append("spacePermit", permit);
        formData.append("spacePermissions", spacePermissions.toString());
        formData.append("spaceReserveRules", reserveRules);
        formData.append("spaceReserveTimeType", reserveTimeType);
        formData.append("spaceLimitHour", cancelLimitHour);
        formData.append("spaceRemindHour", remindHour);

        const res = await updateSpaceInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        const result = await updateSpace({
          spaceId,
          spaceRemindHour: remindHour
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.success(this.$t("common.saveFailure"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    },
    async updateSpace() {
      try {
        let { agencyType } = store.state[USERINFO].userInfo || {};
        let {
          picFile,
          spaceId,
          tags,
          spaceName,
          address,
          spaceRemark,
          spacePics,
          permit,
          reserveRules,
          reserveTimeType,
          cancelLimitHour,
          remindHour
        } = this.formInline;
        let spacePermissions = [];
        this.selectedRobots.forEach(robot => {
          if (robot && robot.identifier) {
            spacePermissions.push(robot.identifier);
          }
        });
        const res = await updateSpace({
          spaceId,
          spacePics: spacePics.map(item => item.picture),
          spaceName,
          address,
          spaceRemindHour: this.remindHourDisabled ? 0 : remindHour,
          cancelLimitHour: this.cancelLimitHourDisabled ? 0 : cancelLimitHour,
          reserveRules: permit == 3 ? reserveRules : 0,
          permit: parseInt(permit),
          reserveTimeType: permit == 3 ? reserveTimeType : 0,
          permissions: spacePermissions.toString(),
          tags,
          type: agencyType == 3 ? 2 : 1,
          remark: spaceRemark
        });
        if (res && res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.success(this.$t("common.saveFailure"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.success(this.$t("common.saveFailure"));
      }
    },
    async queryOneSpaceInfo() {
      try {
        let formData = new FormData();
        formData.append("spaceId", this.$route.query.spaceId);
        const res = await queryOneSpaceInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);

        if (res && res.code == 1) {
          let {
            cancelLimitHour,
            remindHour,
            spacePics,
            reserveRules,
            reserveTimeType
          } = res.data;
          Object.assign(this.formInline, res.data, {
            cancelLimitHour: parseFloat(cancelLimitHour),
            remindHour: parseFloat(remindHour),
            reserveRules: parseFloat(reserveRules) || "",
            reserveTimeType: parseFloat(reserveTimeType) || "",
            cacheReserveRules: parseFloat(reserveRules) || "",
            cacheReserveTimeType: parseFloat(reserveTimeType) || ""
          });
          if (reserveTimeType == 5) {
            this.cancelLimitHourDisabled = true;
            this.remindHourDisabled = true;
            this.formInline.remindHour = 0;
            this.formInline.cancelLimitHour = 0;
          }
          log(reserveTimeType, reserveRules, this.formInline);
          this.selectableRobots = res.data.noPermRobotList.filter(
            robot => robot && robot.bonded == 0
          );
          this.selectedRobots = res.data.permRobotList.filter(
            robot => robot && robot.bonded == 1
          );
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    },
    async getSpaceInfo() {
      try {
        const res = await getSpaceInfo({
          spaceId: this.$route.query.spaceId
        });
        console.log(res);
        if (res && res.code == 1) {
          console.log(res);
          let { tags, address, spacePics } = res.data;
          Object.assign(this.formInline, {
            tags,
            address,
            spacePics: spacePics.map(picture => {
              return {
                picture,
                active: false
              };
            })
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    },
    searchSpace() {
      this.queryOneSpaceInfo();
      this.getSpaceInfo();
    }
  },
  mounted() {
    this.searchSpace();
  }
};
</script>

<style lang="less" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
.noData {
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
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
      width: 450px;
      height: 100%;
      .item {
        margin-bottom: 5px;
        position: relative;
        .title {
          margin-bottom: 10px;
        }
        .minutes {
          position: absolute;
          bottom: 15px;
          right: 0px;
        }
        &.upload {
          .content {
            width: 450px;
            height: 100px;
            overflow-x: auto;
            overflow-y: hidden;
            display: flex;
            flex-shrink: 0;
            flex-wrap: nowrap;
            .avator {
              display: inline-block;
              min-width: 80px;
              max-width: 80px;
              height: 80px;
              border-radius: 2px;
              margin-right: 15px;
              position: relative;
              img {
                &:hover {
                  cursor: pointer;
                }
                &.picture {
                  display: inline-block;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                &.delete {
                  position: absolute;
                  right: 5px;
                  top: 5px;
                  width: 25px;
                  z-index: 999;
                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
            .button {
              position: relative;
              display: inline-block;
              min-width: 80px;
              max-width: 80px;
              height: 80px;
              border-radius: 4px;
              border: 1px solid #ededed;
              &:hover {
                cursor: pointer;
                color: #000;
                border: 1px solid #ccc;
              }
              .btnText {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                img {
                  display: inline-block;
                  width: 80%;
                  height: 80%;
                }
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
            span {
              margin-right: 20px;
              &:last-of-type {
                &:hover {
                  cursor: pointer;
                  color: #419aee;
                }
              }
            }
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
              padding: 0px 10px;
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