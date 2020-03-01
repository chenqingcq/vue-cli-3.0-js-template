<template>
  <div class="container-feedback-detail">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/feedback/list' }">{{$t('feedback.header')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('feedback.detail.title')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="content center">
      <div class="panel">
        <div class="detail">
          <ul ref="scroll">
            <li
              v-for="(item , index) in feedback"
              :key="`feedback-${index}`"
              :class="{question:item.type == 2, reply:item.type== 1 }"
            >
              <div
                :class="['time' , {question:item.type == 2, reply:item.type == 1 } ]"
              >{{formateTime(item.createTime)}}</div>
              <div :class="['content' , {question:item.type == 2, reply:item.type == 1 }]">
                <div class="avator">
                  <img :src="getAvator(item)" alt />
                </div>
                <div :class="{question:item.type == 2, reply:item.type == 1 }">{{item.content}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="reply">
          <textarea
            :placeholder="$t('feedback.detail.plzIptContent')"
            v-model.trim="content"
            style="height:100%"
            @keydown.enter="reply"
          ></textarea>
          <div class="button center" @click="reply">{{$t('feedback.detail.send')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { queryFeedBackTopicInfo, addFeedBackInfo } from "@/api/feedback";

export default {
  name: "feedback-detail",
  data() {
    return {
      content: "", //回复内容
      timer: null,
      feedback: []
    };
  },
  methods: {
    formateTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getAvator(item) {
      let { visitorHeader, companyLogo, type } = item;
      if (type == 1) {
        if (companyLogo) {
          return `${process.env.VUE_APP_BASE_API}${companyLogo}`;
        } else {
          return require("@/assets/svg/pic_servicer.svg");
        }
      }
      if (type == 2) {
        if (visitorHeader) {
          return `${process.env.VUE_APP_BASE_API}${visitorHeader}`;
        } else {
          return require("@/assets/svg/pic_personnel.svg");
        }
      }
    },
    reply() {
      if (!this.content) {
        this.$Message.error(this.$t("feedback.detail.plzIptContent"));
        return false;
      }
      this.addFeedBackInfo();
    },
    scrollIntoView(element) {
      element.scrollTop = element.scrollHeight;
    },
    async addFeedBackInfo() {
      try {
        let { topicId, visitorId, companyId, feedbackId } = this.$route.query;
        let formData = new FormData();
        formData.append("feedbackType", "1");
        formData.append("feedbackTopicType", "2");
        formData.append("feedbackVisitorId", visitorId);
        formData.append("feedbackCompanyId", companyId);
        formData.append("feedbackContent", this.content);
        formData.append("feedbackTopicId", topicId);
        formData.append("feedbackId", feedbackId);
        const res = await addFeedBackInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("feedback.detail.success"));
          this.queryFeedBackTopicInfo().then(() => {
            this.scrollIntoView(this.$refs.scroll);
          });
          this.content = null;
        } else {
          this.$Message.error(this.$t("feedback.detail.error") + ":" + res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("feedback.detail.error"));
      }
    },
    async queryFeedBackTopicInfo() {
      if (this.$route && this.$route.query && this.$route.query.topicId) {
        try {
          let formData = new FormData();
          formData.append("id", this.$route.query.topicId);
          const res = await queryFeedBackTopicInfo(formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          if (res.code == 1 && res.data) {
            console.log(res.data, "topicId", this.$route.query.topicId);
            this.feedback = res.data.sort((a, b) => {
              return (
                +new Date(this.formateTime(a.createTime)) -
                +new Date(this.formateTime(b.createTime))
              );
            });
          } else {
            this.$Message.error(this.$t("common.searchError"));
          }
        } catch (err) {
          console.log(err);
          this.$Message.error(this.$t("common.searchError"));
        }
      } else {
        this.timer && clearInterval(this.timer);
      }
    },
    heartBeat() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.queryFeedBackTopicInfo();
      }, 3000);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.heartBeat();
    });
  },
  beforeRouteLeave(to, from, next) {
    next(vm => {
      if (vm.timer) {
        clearInterval(vm.timer);
        vm.timer = null;
      }
    });
  },
  mounted() {
    this.queryFeedBackTopicInfo();
    this.heartBeat();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="less" scoped>
.container-feedback-detail {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  background: #fff;
  > .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .content {
    height: calc(100% - 60px);
    overflow-y: auto;
    // min-height: 600px;
    .panel {
      width: 600px;
      height: 90%;
      border: solid 1px #cccccc;
      // display: flex;
      // flex-direction: column;
      > .detail {
        // flex: 1;
        height: calc(100% - 100px);
        width: 100%;
        overflow: hidden;
        ul {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 15px;
          li {
            margin-top: 15px;
            width: 100%;
            .time {
              color: #999;
              font-size: 12px;
              margin-bottom: 8px;
              &.question {
                text-align: left;
              }
              &.reply {
                text-align: right;
              }
            }
            .content {
              display: flex;
              width: 100%;
              height: 100%;
              color: #333;
              &.question {
                flex-direction: row;
                .avator {
                  margin-right: 16px;
                }
              }
              &.reply {
                flex-direction: row-reverse;
                .avator {
                  margin-left: 16px;
                }
              }
              .avator {
                img {
                  display: inline-block;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                }
              }
              .question {
                padding: 0px 10px;
                background-color: #f3f3f3;
                border-radius: 2px;
                max-width: 80%;
                border-radius: 2px;
                height: auto;
                display: flex;
                align-items: center;
                word-break: break-all;
              }
              .reply {
                padding: 0px 10px;
                max-width: 80%;
                background-color: #d0e9ff;
                border-radius: 2px;
                height: auto;
                display: flex;
                align-items: center;
                word-break: break-all;
              }
            }
          }
        }
      }
      > .reply {
        height: 100px;
        width: 100%;
        border-top: solid 1px #cccccc;
        position: relative;
        textarea {
          display: inline-block;
          width: 100%;
          height: 100%;
          padding: 10px 15px 30px;
          border: none;
          resize: none;
        }
        .button {
          position: absolute;
          width: auto;
          height: 28px;
          right: 15px;
          padding: 0 20px;
          bottom: 15px;
          appearance: none;
          background: #298df8;
          color: #fff;
          &:hover {
            cursor: pointer;
            color: whitesmoke;
          }
        }
      }
    }
  }
}
</style>