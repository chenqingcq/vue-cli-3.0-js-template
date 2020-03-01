<template>
  <div class="calendar-box">
    <div class="calendar-today">
      <img :src="arrowLeft" class="arrowLeft" @click="changeIndex(-1 , false, false)" alt />
      {{formateDate(selectedDay)}}
      <img
        :src="arrowLeft"
        class="arrowRight"
        @click="changeIndex(1 , false, false)"
        alt
      />
    </div>
    <!-- <div class="calendar-toggle">
      <div class="toggle-line"></div>
    </div>-->
    <ul class="calendar-head">
      <li>{{$t("room.overview.Mon")}}</li>
      <li>{{$t("room.overview.Tue")}}</li>
      <li>{{$t("room.overview.Wed")}}</li>
      <li>{{$t("room.overview.Thr")}}</li>
      <li>{{$t("room.overview.Fri")}}</li>
      <li>{{$t("room.overview.Sat")}}</li>
      <li>{{$t("room.overview.Sun")}}</li>
    </ul>
    <transition name="fade">
      <calendarContent
        ref="calendar_swiper"
        :checkDate="current_day"
        @on-change="changeIndex"
        @calendarHeight="calendarHeight"
      >
        <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
          <ul v-for="(week,weekindex) in month" :key="weekindex">
            <li
              v-for="(day,dayindex) in week"
              :class="{ischecked:checkedDay==day.date,istoday:day.istoday , hasRecord:day.thing && day.thing.length}"
              @click.prevent.stop="chooseDay( day )"
              :key="dayindex"
            >
              <div
                class="week-day"
                :class="[ _ifOrder(day , day.thing && day.thing.records) , { othermonth:day.othermonth,
                 istoday:day.istoday , future:isFuture(day) , 
                 isweekend : isWeekEnd(day)}]"
              >
                <span class="one-day">
                  <i v-if="checkedDay==day.date" class="ischecked">{{day.day}}</i>
                  <i v-if="day.thing && day.thing.length" class="hasRecord">{{day.day}}</i>
                  <i v-else-if="day.istoday" class="day today">{{day.day}}</i>
                  <i v-else class="day">{{day.day}}</i>
                </span>
                <div class="thing">
                  <a
                    v-for="(item, index) in day.thing"
                    :class="['thing' , _ifOrder(day , item ) , {
                      today:day.istoday
                    }]"
                    :key="index"
                  ></a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </calendarContent>
    </transition>
  </div>
</template>
<script>
import moment from "moment";
import calendarContent from "./Swiper-monthorweek";
import format from "./formate";
export default {
  data() {
    return {
      arrowLeft: require("@/assets/svg/arrow-left.svg"),
      selectedDay: moment(new Date()).format("YYYY-MM-DD"),
      disp_date: new Date(),
      today: new Date(),
      current_day: new Date(),
      monthList: [],
      checkedDay: moment(new Date()).format("YYYY-MM-DD"),
      can_click: true,
      calHeight: "" //日历外框高度，自适应要用到
    };
  },
  computed: {
    //当前选中日期
    formateTime() {
      // 标准时间转xxxx年xx月xx日
      return this.formatDateTime(this.disp_date);
    }
  },
  props: {
    record: {
      type: Array,
      default: null
    },
    range: {
      type: String,
      default: null
    }
  },
  watch: {
    record: {
      deep: true,
      handler() {
        this.get3month();
      }
    }
  },
  components: {
    calendarContent
  },
  methods: {
    isWeekEnd(day) {
      if (day.isWeekEnd == 6 || day.isWeekEnd == 0) {
        if ((day.thing && !day.thing.records.length) || !day.thing) {
          return true;
        }
      }
    },
    isFuture(dayInfo) {
      let { date, othermonth } = dayInfo;
      if (+new Date(date) > +new Date()) return false;
    },
    chooseDay(dayInfo) {
      console.log("选择当日", dayInfo);
      let { date, othermonth } = dayInfo;
      if (othermonth == -1) {
        this.changeIndex(-1, false, false);
      }
      if (othermonth == 1) {
        this.changeIndex(1, false, false);
      }
      if (!this.can_click || othermonth) return;
      this.checkedDay = date;
      this.$emit("select", dayInfo);
    },
    formateDate(time, formation = "YYYY-MM") {
      return moment(time).format(formation);
    },
    calendarHeight(newVal) {
      this.calHeight = newVal + 30;
      console.log("---val---" + newVal);
    },
    todayDate() {
      this.checkedDay = this.selectedDay = this.formatDateTime(
        this.today,
        "YYYY-MM-DD"
      );
    },
    formatDateTime(date, formation = "YYYY-MM-DD") {
      return moment(date).format(formation);
    },
    format(year, month, day) {
      month++;
      month < 10 && (month = "0" + month);
      day < 10 && (day = "0" + day);
      // return year + "-" + month + "-" + day;
      return year + "-" + month + "-" + day;
    },
    getWeek(year, month, day) {
      //year,month,day为选中当天的年月日
      let dt = new Date(year, month, day);
      let weekArr = [];
      let dt_first = new Date(year, month, day - ((dt.getDay() + 6) % 7));
      let week = [];
      //循环选中当天所在那一周的每一天
      for (let j = 0; j < 7; j++) {
        let newdt = new Date(
          dt_first.getFullYear(),
          dt_first.getMonth(),
          dt_first.getDate() + j
        );
        let _year = newdt.getFullYear();
        let _month = newdt.getMonth();
        let _day = newdt.getDate();
        /**
         * 获取当月考勤状态 0 旷工 1 缺卡|迟到 2 正常 | 迟到 3 休息日 4 节假日
         */
        let $month = month + 1;
        $month = $month < 10 ? `0${$month}` : $month;
        let $day = day < 10 ? `0${day}` : day;
        let time = `${year}-${$month}-${$day}`;
        let record = this.getRecord(time);
        week.push({
          mode: "week",
          day: _day,
          year: _year,
          month: _month,
          date: this.format(_year, _month, _day),
          //日历要显示的其他内容
          // thing:(day == 22 || day == 4) ? [{title:'预约',color:'red'}]:[],
          thing: record,
          nongli: format.solar2lunar(_year, _month + 1, _day),
          istoday:
            this.today.getFullYear() == _year &&
            this.today.getMonth() == _month &&
            this.today.getDate() == _day
              ? true
              : false,
          ischecked: false,
          othermonth: _month != month
        });
      }
      // console.log('---week---'+ JSON.stringify(week,null,2))
      weekArr.push(week);
      return weekArr;
    },
    getRecord(time) {
      let record = [];
      if (this.record) {
        this.record.forEach(item => {
          if (time == moment(item.startTime).format("YYYY-MM-DD")) {
            record.push(item);
          }
        });
      }
      return record;
    },
    getMonth(year, month) {
      // console.log("---------获取月份信息;", year, month, "-----------");
      //创建单月历
      let monthArr = [];
      let dt_first = new Date(year, month, 1); //每个月第一天
      let dt_last = new Date(year, month + 1, 0); //每个月最后一天
      let monthLength = dt_last.getDate() - dt_first.getDate() + 1;
      let daylist = [];
      let space = (dt_first.getDay() - 1 + 7) % 7; //月历前面空格
      for (let i = -space; i < 36; i += 7) {
        let week = [];
        for (let j = 0; j < 7; j++) {
          let day = i + j + 1;
          if (day > 0 && day <= monthLength) {
            /**
             * 获取当月考勤状态 0 旷工 1 缺卡|迟到 2 正常 | 迟到 3 休息日 4 节假日
             */
            let _month = month + 1;
            _month = _month < 10 ? `0${_month}` : _month;
            let _day = day < 10 ? `0${day}` : day;
            let time = `${year}-${_month}-${_day}`;
            let record = this.getRecord(time);
            let istoday =
              this.today.getFullYear() == year &&
              this.today.getMonth() == month &&
              this.today.getDate() == day
                ? true
                : false;
            let recordDetail = {
              mode: "month",
              day: day,
              year: year,
              month: month,
              date: this.format(year, month, day),
              //日历要显示的其他内容
              thing: record || [],
              // nongli: format.solar2lunar(year, month + 1, day),
              istoday,
              ischecked: false
            };
            week.push(recordDetail);
            // console.log("获取每日打卡详情:", recordDetail, "<----");
            if (istoday) {
              this.$emit("select", recordDetail);
            }
          } else {
            //其它月份
            let newdt = new Date(year, month, day);
            let _year = newdt.getFullYear();
            let _month = newdt.getMonth();
            let _day = newdt.getDate();
            week.push({
              mode: "month",
              day: _day,
              year: _year,
              month: _month,
              date: this.format(year, month, day),
              thing: [],
              // nongli: format.solar2lunar(_year, _month + 1, _day),
              istoday:
                this.today.getFullYear() == _year &&
                this.today.getMonth() == _month &&
                this.today.getDate() == _day
                  ? true
                  : false,
              ischecked: false,
              othermonth: day <= 0 ? -1 : 1
            });
          }
        }
        monthArr.push(week);
      }
      console.log(monthArr, "获取当前考勤状态");
      return monthArr;
    },
    _ifOrder(day, record) {
      // 未来时间不显示
      if (+new Date(day.date.replace(/\-/g, "/")) > +new Date()) {
        return "";
      }
      // 周末也有可能来打卡的情况
      if (day.isWeekEnd == 6 || day.isWeekEnd == 0) {
        if (day.thing && day.thing.records && day.thing.records.length) {
          if (record.length == 2) {
            return "ok";
          }
          if (record.length == 1) {
            return "warn";
          }
        } else {
          return "";
        }
      }
      //TODO 不是这么简单的判断数组长度就可以了
      /**
       * 旷工
       * 上班 迟到
       * 下班 早退
       */
      if (record && Array.isArray(record)) {
        if (record.length == 2) {
          return this.isStatusOk(day, record);
        }
        if (record.length == 1) {
          return "warn";
        }
        if (record.length == 0) {
          return "error";
        }
      }
    },
    isStatusOk(day, records) {
      let { date } = day;
      let time = moment(new Date(date)).format("YYYY-MM-DD");
      let noon = `${time} 12:00`;
      let onWork = this.range.split("-")[0];
      let offWork = this.range.split("-")[1];
      let onTime = `${time} ${onWork}`;
      let offTime = `${time} ${offWork}`;
      let isOnwork_ok = records.find(item => {
        return (
          +new Date(item.time.replace(/\-/g, "/")) <=
          +new Date(onTime.replace(/\-/g, "/"))
        );
      });
      let isffwork_ok = records.find(item => {
        return (
          +new Date(item.time.replace(/\-/g, "/")) >=
          +new Date(offTime.replace(/\-/g, "/"))
        );
      });
      if (isOnwork_ok && isffwork_ok) {
        return "ok";
      } else {
        return "warn";
      }
    },
    ifOrder(year, month, day) {
      return [];
    },
    get3month() {
      console.log("get3month");
      let year = this.disp_date.getFullYear();
      let month = this.disp_date.getMonth();
      this.monthList = [];
      this.monthList.push(this.getMonth(year, month - 1));
      this.monthList.push(this.getMonth(year, month));
      this.monthList.push(this.getMonth(year, month + 1));
    },
    get3week() {
      console.log("get3week");
      let year = this.disp_date.getFullYear();
      let month = this.disp_date.getMonth();
      let day = this.disp_date.getDate();
      this.monthList = [];
      this.monthList.push(this.getWeek(year, month, day - 7));
      this.monthList.push(this.getWeek(year, month, day));
      this.monthList.push(this.getWeek(year, month, day + 7));
      console.log(this.monthList);
    },
    changeIndex(index, is_week, is_click = false) {
      console.log(index, is_week, "切换时间");
      //   if (index) {
      if (is_week) {
        this.disp_date = new Date(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth(),
          this.disp_date.getDate() + 7 * index
        );
        this.selectedDay = this.format(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth(),
          this.disp_date.getDate()
        );
        this.current_day = this.disp_date;
        // this.get3week();
      } else {
        //console.log(this.disp_date.getMonth()+index)
        let _tmpdt = new Date(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth() + index,
          0
        );
        let maxday = _tmpdt.getDate();
        let _day =
          maxday < this.disp_date.getDate() ? maxday : this.disp_date.getDate();
        console.log(_day);

        this.disp_date = new Date(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth() + index,
          _day
        );
        if (!is_click) {
          this.selectedDay = this.format(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth(),
            this.disp_date.getDate()
          );
          // console.log(this.checkedDay);
        }
        //            console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
        this.get3month();
      }
      console.log("move_change", this.disp_date.getMonth());
      this.$emit("get-records", this.disp_date);
      // this.$refs.calendar_swiper.move_change();
    }
    // }
  },
  created() {
    this.todayDate();
    this.changeIndex(0, false, false);
  }
};
</script>
<style lang="less" scoped>
.calendar-box {
  color: #fff;
  background: #fff;
  // height:100%;
  z-index: 99;
  transition: all 0.2s ease;
  width: 448px;
  height: 375px;
  position: absolute;
}
.calendar-head {
  /* background: #4188d8; */
  display: flex;
  width: 100%;
  height: 30px; /*no*/
  line-height: 30px; /*no*/
  position: absolute;
  top: 60px; /*no*/
  z-index: 999;
}
.calendar-head li {
  flex-grow: 1;
  text-align: center;
  color: #999;
  font-family: PingFang-SC-Regular;
  font-size: 0.1rem;
  font-size: 14px; /*no*/
}
.calendar-today {
  position: absolute;
  width: 100%;
  height: 50px; /*no*/
  text-align: center;
  color: #000;
  z-index: 999;
  top: 0rem;
  background: #fff;
  border-bottom: 1px solid#ebebeb; /*no*/
  border-top: 1px solid #ebebeb; /*no*/
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFang-SC-Regular;
  font-size: 14px; /*no*/
  img {
    display: inline-block;
    width: 16px; /*no*/
    height: 100%;
    &:hover {
      cursor: pointer;
    }
    &.arrowLeft {
      margin-right: 20px; /*no*/
    }
    &.arrowRight {
      transform: rotate(180deg);
      margin-left: 20px; /*no*/
    }
  }
}
.calendar-toggle {
  position: absolute;
  width: 100%;
  height: 1px; /*no*/
  z-index: 999;
  top: 0.15rem;
  background: #fff;
  border-bottom: 1px solid #dfdfe0;
}
.swiper-item {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.swiper-item:nth-child(1) {
  left: -100%;
}
.swiper-item:nth-child(2) {
  left: 0;
}
.swiper-item:nth-child(3) {
  left: 100%;
}
.month ul {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 45px; /*no*/
  min-height: 45px; /*no*/
  border-right: 1px solid #eee;
}
.month li {
  flex: 1;
  flex-grow: 1;
  color: #333;
  overflow: hidden;
  border-right: solid 0.5px #ebebeb;
  border-bottom: solid 0.5px #ebebeb;
  user-select: none;

  &.istoday {
    // background-color: #fff !important;
    color: #333 !important;
    font-weight: bold;
  }
  &.ischecked {
    background: #419aee !important;
    color: #fff !important;
    .week-day i :not(.today) {
      color: #fff !important;
    }
  }
  &.hasRecord {
    background: rgba(118, 186, 250, 0.3);
    color: #419aee;
    .week-day i {
      &.hasRecord {
        color: #419aee;
      }
    }
  }
  &:hover {
    cursor: pointer;
  }
}
.week-day {
  position: relative;
  width: 45px; /*no*/
  height: 45px; /*no*/
  margin: auto;
  font-size: 12px; /*no*/
  text-align: center;
  border: 0;
  line-height: 45px; /*no*/
  overflow: hidden;
  // border-top: 1px solid #fff;
  /* border-left: 1px solid #fff; */
  z-index: 1;
  /* height:140px;/*no*/
}
.week-day .one-day {
}
.week-day i {
  display: block;
  text-align: center;
  font-size: 18px; /*no*/
  padding: 1px; /*no*/
  line-height: 45px; /*no*/
  height: 45px; /*no*/
  font-style: normal;
  color: #333;
  &.ischecked {
    background: #419aee !important;
    color: #fff !important;
  }
}
.week-day.isweekend {
  color: #ccc;
}
div.week-day.ok.ischecked {
  background-color: #0eb4ff;
  border-radius: 50%;
}
div.week-day.error.ischecked {
  background-color: #ff493f;
  border-radius: 50%;
}
div.week-day.warn.ischecked {
  background-color: #f39826;
  border-radius: 50%;
}
.week-day.ischecked {
  //   border-radius: 50%;
  color: #fff !important;
  background-color: #419aee;
  font-weight: bold;
  .thing a {
    color: #fff;
    // background: #fff;
  }
  // transition: all .2s ease-in ;
}
div.week-day.ischecked.istoday {
  background-color: #ccc;
  border-radius: 50%;
  .today {
    color: #fff;
  }
}
.thing {
  position: absolute;
  left: 50%;
  bottom: 2px; /*no*/
  transform: translateX(-50%);
  margin-top: 3px; /*no*/
}
.thing a {
  cursor: pointer;
  display: block;
  width: 6px; /*no*/
  height: 6px; /*no*/
  word-break: break-all;
  line-height: 6px; /*no*/
  color: #0eb4ff;
  border-radius: 50%;
  &.ok {
    background: #0eb4ff;
  }
  &.error {
    background: #ff493f;
  }
  &.warn {
    background: #f39826;
  }
  &.today {
    // background: #ccc;
  }
}
.othermonth {
  // display: none;
  span {
    i {
      color: #cccccc;
    }
  }
}
.othermonth,
.future {
  color: #ccc;
  // pointer-events: none;
}
.istoday {
  .today {
    font-size: 16px; /*no*/
    font-weight: bold;
    // color: #5054f4 !important;
  }
}
/* .ischecked{
    background-color: #f17117!important;
  } */
</style>
