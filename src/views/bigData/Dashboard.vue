<template>
  <div class="container-big-data-dashboard">
    <div class="panel center" @dblclick="preview">
      <div :class="getClass">
        <div class="header center">{{BDTitle}}</div>
        <div class="content">
          <template>
            <div class="left">
              <div class="title center navigatior">
                <img :src="titleLogo" class="titleLogo" alt />
                <img :src="titleBar" class="titleBar" alt />
                <span class="building">{{$t("bigdata.dashboard.left.center")}}</span>
                <span class="desc">{{description}}</span>
              </div>
              <div class="person center">
                <div class="rate center">{{$t("bigdata.dashboard.left.person.rate")}}</div>
                <div class="data center">
                  <span class="data">46</span>
                  <span class="data">%</span>
                </div>
              </div>
              <div class="pesonnel center">
                <img :src="personnelBg" alt />
                <div class="title center">
                  <span>{{$t("bigdata.dashboard.left.person.title")}}</span>
                  <img :src="personnelTitle" alt />
                </div>
                <div class="statistic">
                  <div class="detail">
                    <div class="staff">
                      <div class="left">
                        <img :src="staffIcon" alt />
                      </div>
                      <div class="right">
                        <span class="top center">{{$t("bigdata.dashboard.left.person.staff")}}</span>
                        <span class="data bottom center">62%</span>
                      </div>
                    </div>
                    <div class="visitor">
                      <div class="left">
                        <img :src="visitorIcon" alt />
                      </div>
                      <div class="right">
                        <span class="top center">{{$t("bigdata.dashboard.left.person.visitor")}}</span>
                        <span class="data bottom center">38%</span>
                      </div>
                    </div>
                  </div>
                  <div class="rate center"></div>
                </div>
                <div class="list">
                  <div class="item-1 center">
                    <img :src="personnelListBg1" alt />
                    <span class="circle">{{$t("bigdata.dashboard.left.person.reg")}}</span>
                    <span class="fr">
                      <span class="total data">3248</span>
                      <span>{{$t("bigdata.dashboard.people")}}</span>
                    </span>
                  </div>
                  <div class="item-2 center">
                    <img :src="personnelListBg2" alt />
                    <span class="circle">{{$t("bigdata.dashboard.left.person.visitorIn")}}</span>
                    <span class="fr">
                      <span class="total data">1253</span>
                      <span>{{$t("bigdata.dashboard.people")}}</span>
                    </span>
                  </div>
                  <div class="item-3 center">
                    <img :src="personnelListBg3" alt />
                    <span class="circle">{{$t("bigdata.dashboard.left.person.visitorNum")}}</span>
                    <span class="fr">
                      <span class="total data">148</span>
                      <span>{{$t("bigdata.dashboard.people")}}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="electron center">
                <img :src="personnelBg" alt />
                <div class="title center">
                  <span>{{$t("bigdata.dashboard.left.electron.title")}}</span>
                  <img :src="personnelTitle" alt />
                </div>
                <div class="list">
                  <div class="item-1 center">
                    <div class="title">
                      <div class="left">
                        <img :src="electronWaterTitle" alt />
                        <span>{{$t("bigdata.dashboard.left.electron.water")}}</span>
                        <span class="unit">{{$t("bigdata.dashboard.left.ton")}}</span>
                      </div>
                      <div class="right">
                        <select v-model="formInline.waterOptions" style="font-size:8px">
                          <option value="1" style="font-size:8px">
                            <div class="option">{{$t("bigdata.dashboard.left.electron.week")}}</div>
                          </option>
                          <option value="2" style="font-size:8px">
                            <div class="option">{{$t("bigdata.dashboard.left.electron.month")}}</div>
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="centent water-in-use"></div>
                  </div>
                  <div class="item-2 center">
                    <div class="title">
                      <div class="left">
                        <img :src="electronTitle" alt />
                        <span>{{$t("bigdata.dashboard.left.electron.title1")}}</span>
                        <span class="unit">{{$t("bigdata.dashboard.left.kw")}}</span>
                      </div>
                      <div class="right">
                        <select v-model="formInline.electronOptions">
                          <option value="1" style="font-size:8px">
                            <div class="option">{{$t("bigdata.dashboard.left.electron.week")}}</div>
                          </option>
                          <option value="2" style="font-size:8px">
                            <div class="option">{{$t("bigdata.dashboard.left.electron.month")}}</div>
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="centent electron-in-use"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template>
            <div class="middle">
              <div class="inner">
                <!-- <model-obj
                    id="place"
                    :src="modelObj"
                    :mtl="modelMtl"
                    backgroundColor="rgb(0,0,0)"
                    :scale="{ x: 0.8, y: 0.8, z: 0.8 }"
                ></model-obj>-->
                <model></model>
              </div>
              <div class="bottom">
                <img :src="weatherBg" alt />
                <div class="list">
                  <div class="item-1">
                    <div class="time center">{{formInline.time}}</div>
                    <div class="date center">{{formInline.date}}</div>
                  </div>
                  <div class="item-2">
                    <div class="time center">
                      <span class="data">{{formInline.atmosphere}}</span>
                      <span>{{$t("bigdata.dashboard.middle.good")}}</span>
                    </div>
                    <div class="date center">{{$t("bigdata.dashboard.middle.air")}}</div>
                  </div>
                  <div class="item-3">
                    <div class="time center">
                      <span class="data">{{formInline.rain}}</span>
                      <span>{{$t("bigdata.dashboard.middle.ml")}}</span>
                    </div>
                    <div class="date center">{{$t("bigdata.dashboard.middle.rain")}}</div>
                  </div>
                  <div class="item-4">
                    <canvas id="canvas1"></canvas>
                    <img :src="timeIcon" id="canvas" />
                  </div>
                  <div class="item-5">
                    <div class="weather center">
                      <img :src="weather" alt />
                    </div>
                  </div>
                  <div class="item-6">
                    <div class="temperature">
                      <img :src="temperatureIcon" />
                      <span :class="['data' , getWeatherType]">{{temperature}}</span>
                      <span :class="['tag' , getWeatherType]">℃</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template>
            <div class="right">
              <div class="top center">
                <img :src="personnelBg" alt />
                <div class="title center">
                  <span>{{$t("bigdata.dashboard.right.car.title")}}</span>
                  <img :src="personnelTitle" alt />
                </div>
                <div class="list">
                  <div class="item-1">
                    <div class="left">
                      <!-- <img :src="car1" alt /> -->
                    </div>
                    <div class="right">
                      <div class="top">
                        <span>{{$t("bigdata.dashboard.right.car.left")}}</span>
                      </div>
                      <div class="bottom">
                        <div class="div hints">
                          <span class="dot rest"></span>
                          <span class="dot rest"></span>
                          <span class="dot rest"></span>
                          <span class="dot rest"></span>
                          <span class="data">20</span>
                          <span>{{$t("bigdata.dashboard.vehicle")}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-2">
                    <div class="left">
                      <!-- <img :src="car3" alt /> -->
                    </div>
                    <div class="right">
                      <div class="top">
                        <span>{{$t("bigdata.dashboard.right.car.used")}}</span>
                      </div>
                      <div class="bottom">
                        <div class="div hints">
                          <span class="do used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="dot used"></span>
                          <span class="data">53</span>
                          <span>{{$t("bigdata.dashboard.vehicle")}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-3">
                    <div class="left">
                      <!-- <img :src="car2" alt /> -->
                    </div>
                    <div class="right">
                      <div class="top">
                        <span>{{$t("bigdata.dashboard.right.car.violation")}}</span>
                      </div>
                      <div class="bottom">
                        <div class="div hints">
                          <span class="dot warning"></span>
                          <span class="data vehicle">5</span>
                          <span>{{$t("bigdata.dashboard.vehicle")}}</span>
                          <span class="overview">{{$t("bigdata.dashboard.right.car.overview")}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <img :src="spaceBg" alt />
                <div class="title center">
                  <span>{{$t("bigdata.dashboard.right.space.title")}}</span>
                  <img :src="personnelTitle" alt />
                  <select v-model="formInline.roomOptions">
                    <option value="1">
                      <div class="option">{{$t("bigdata.dashboard.right.space.week")}}</div>
                    </option>
                    <option value="2">
                      <div class="option">{{$t("bigdata.dashboard.right.space.month")}}</div>
                    </option>
                  </select>
                </div>
                <div class="banner">
                  <span class="room-rent">{{$t("bigdata.dashboard.right.space.rate")}}</span>
                  <span class="order-number">{{$t("bigdata.dashboard.right.space.order")}}</span>
                </div>
                <div class="statistic space"></div>
                <div class="list">
                  <div class="item-1">
                    <div class="left">{{$t("bigdata.dashboard.right.space.item1")}}</div>
                    <div class="right">
                      <span class="data">512</span>
                      <span>{{$t("bigdata.dashboard.item")}}</span>
                    </div>
                  </div>
                  <div class="item-2">
                    <div class="left">{{$t("bigdata.dashboard.right.space.item2")}}</div>
                    <div class="right">
                      <span class="data">312</span>
                      <span>{{$t("bigdata.dashboard.item")}}</span>
                    </div>
                  </div>
                  <div class="item-3">
                    <div class="left">{{$t("bigdata.dashboard.right.space.item3")}}</div>
                    <div class="right">
                      <span class="data">
                        1L
                        <img :src="usingIcon(1)" />
                      </span>
                      <span class="data ok">2L</span>
                      <span class="data">
                        3L
                        <img :src="usingIcon(2)" />
                      </span>
                    </div>
                  </div>
                  <div class="item-4">
                    <div class="left">{{$t("bigdata.dashboard.right.space.item4")}}</div>
                    <div class="right">
                      <span class="data">******</span>
                      <span>{{$t("bigdata.dashboard.yuan")}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ModelObj } from "vue-3d-model";
// import Model from "./Model-MTL-OBJ";
import echarts from "echarts";
import moment from "moment";
import * as Three from "three";
import Model from "./Model-STL";
import drawcanvas, { timeOpions } from "./drawCanvas";
import { simplifyDay } from "@/utils/tools";
import {
  launchFullscreen,
  exitFullscreen,
  isFullScreen
} from "@/utils/fullscreen";

const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "big-data",
  data() {
    return {
      fullscreen: false,
      formInline: {
        waterOptions: "1",
        electronOptions: "1",
        roomOptions: "1",
        time: moment(new Date()).format("HH:mm:ss"),
        date: moment(new Date()).format("YYYY/MM/DD"),
        atmosphere: 45,
        rain: 25
      },
      timeChoice: 1,
      language: "zh",
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      timer: null,
      regInstance: null,
      spaceInstance: null,
      waterInstance: null,
      elecInstance: null,
      currentTime: "",
      description: "",
      showImg: false,
      weatherType: 3,
      temperature: 28,
      titleBar: require("@/assets/img/titlebar/pic-05.png"),
      titleLogo: require("@/assets/img/titlebar/pic-06.png"),
      personnelBg: require("@/assets/img/personnel/bg-03.png"),
      personnelTitle: require("@/assets/img/personnel/bg-02.png"),
      personnelListBg1: require("@/assets/img/personnel/bg-01.png"),
      personnelListBg2: require("@/assets/img/personnel/bg-04.png"),
      personnelListBg3: require("@/assets/img/personnel/bg-05.png"),
      electronWaterTitle: require("@/assets/img/electronic/pic-03.png"),
      electronTitle: require("@/assets/img/electronic/pic-02.png"),
      carsBg: require("@/assets/img/cars/pic-05.png"),
      spaceBg: require("@/assets/img/space/pic-07.png"),
      car1: require("@/assets/img/cars/pic-02.png"),
      car2: require("@/assets/img/cars/pic-03.png"),
      car3: require("@/assets/img/cars/pic-04.png"),
      weatherBg: require("@/assets/img/titlebar/pic-04.png"),
      staffIcon: require("@/assets/img/personnel/pic-01.png"),
      visitorIcon: require("@/assets/img/personnel/pic-02.png"),
      temperatureIcon: require("@/assets/svg/temperature.svg"),
      bigData: require("@/assets/img/bigdata.png"),
      modelObj: "../../static/model/building/mall.obj",
      modelMtl: "../../static/model/building/mall.mtl",
      regsiterOption: {
        tooltip: {
          //提示框，可以在全局也可以在
          trigger: "item", //提示框的样式
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          color: "#000", //提示框的背景色
          textStyle: {
            //提示的字体样式
            color: "#fff"
          }
        },
        // legend: {
        //   //图例
        //   orient: "vertical", //图例的布局，竖直    horizontal为水平
        //   x: "right", //图例显示在右边
        //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        //   textStyle: {
        //     //图例文字的样式
        //     color: "#333", //文字颜色
        //     fontSize: 12 //文字大小
        //   }
        // },
        series: [
          {
            name: "",
            type: "pie", //环形图的type和饼图相同
            radius: ["85%", "100%"], //饼图的半径，第一个为内半径，第二个为外半径
            center: ["50%", "50%"], //设置餠图位置
            avoidLabelOverlap: false,
            color: ["#36b0ef", "#47c8ce"],
            label: {
              normal: {
                //正常的样式
                show: true,
                position: "left"
              },
              emphasis: {
                //选中时候的样式
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            }, //提示文字
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 335,
                name: "访客",
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#5cbb7a"
                    },
                    {
                      offset: 1,
                      color: "#47c8ce"
                    }
                  ])
                }
              },
              {
                value: 310,
                name: "常驻人员",
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: "#348fe6" },
                    {
                      offset: 1,
                      color: "#36b0ef"
                    }
                  ])
                }
              }
            ]
          }
        ]
      },
      elecUseOptions: {
        title: {
          left: "left",
          text: "",
          show: false
        },
        tooltip: {
          trigger: "axis",
          show: false,
          formatter: "{a}:{c}",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        grid: {
          show: false,
          top: "40",
          bottom: "20",
          right: "0",
          left: "40"
        },
        xAxis: [
          {
            show: true,
            type: "category",
            data: [
              "00:00",
              "04:00",
              "08:00",
              "12:00",
              "16:00",
              "20:00",
              "24:00"
            ],
            axisPointer: {
              type: "shadow"
            },
            splitLine: {
              show: false
            },
            axisLine: {
              //设置x轴坐标线的样式
              show: true,
              lineStyle: {
                type: "solid",
                // type: "dotted",
                fontSize: 8,
                color: "#47c8ce" //x轴坐标线的颜色
              },
              axisLabel: {
                textStyle: {
                  fontSize: 5,
                  color: "#fff"
                }
              }
            },
            axisTick: {
              show: false,
              interval: 0
            }
          }
        ],

        //设置两个y轴，左边显示数量，右边显示概率

        yAxis: [
          {
            type: "value",
            name: "",
            show: true,
            axisLine: {
              //设置x轴坐标线的样式
              show: true,
              lineStyle: {
                type: "solid",
                // type: "dotted",
                fontSize: 8,
                color: "#47c8ce" //x轴坐标线的颜色
              },
              axisLabel: {
                show: false,
                textStyle: {
                  fontSize: 8,
                  color: "#47c8ce"
                }
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: true,
              interval: 0
            }
          },
          {
            type: "value",
            name: "",
            min: 0,
            max: 100,
            interval: 10,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: ""
            }
          }
        ],

        //每个设备分数量、概率2个指标，只要让他们的name一致，即可通过，legeng进行统一的切换

        series: [
          {
            name: "",
            type: "bar",
            data: [70, 75, 68, 81, 65, 64, 70],
            barWidth: "10%",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#3bb6bd" },
                  { offset: 0.3, color: "#010101" },
                  { offset: 0.7, color: "#010101" },
                  { offset: 1, color: "#3bb6bd" }
                ]),
                lineStyle: {
                  color: "#3bb6bd"
                }
              }
            }
          },
          {
            name: "",
            type: "line",
            smooth: true, //设置折线图平滑
            yAxisIndex: 1, //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
            data: [70, 75, 68, 81, 65, 64, 70],
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: "#3bb6bd",
                lineStyle: {
                  color: "#3bb6bd"
                }
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    BDTitle() {
      let { BDTitle } = this.$route.query;
      return BDTitle || this.$t("bigdata.dashboard.platform");
    },
    weather() {
      // 1天晴 2多云 3下雨 4 阴天
      if (this.weatherType === 1) {
        return require("@/assets/img/titlebar/sunny.png");
      }
      if (this.weatherType === 2) {
        return require("@/assets/img/titlebar/cloudy.png");
      }
      if (this.weatherType === 3) {
        return require("@/assets/svg/rain.svg");
      }
      return require("@/assets/svg/cloudy.svg");
    },
    timeIcon() {
      return require(`@/assets/img/sun/sun${this.timeChoice || 1}.png`);
    },
    getWeatherType() {
      if (this.temperature > 35) {
        return "hot";
      }
      return "normal";
    },
    getClass() {
      return this.fullscreen ? "outer" : "inner";
    }
  },
  components: {
    // ModelObj
    Model
  },
  methods: {
    usingIcon(type) {
      if (type == 1) {
        return require("@/assets/img/space/pic-05.png");
      }
      if (type == 2) {
        return require("@/assets/img/space/pic-06.png");
      }
    },
    drawcanvas(hours, forceUpate) {
      if (hours != this.currentTime || forceUpate) {
        let canvas = document.querySelector("#canvas");
        let day = null;
        for (let i = 0; i < timeOpions.length; i++) {
          if (timeOpions[i].time - 0 >= hours) {
            day = timeOpions[i];
            break;
          }
        }
        this.timeChoice = Math.ceil(hours / 3);
        // drawcanvas.call(this, canvas, 4, "#f1cb35", day.x, day.y);
        this.currentTime = hours;
      }
    },
    initTime() {
      this.timer = setInterval(() => {
        let now = new Date();
        let hours = moment(now).format("HH");
        this.formInline.time = moment(now).format("HH:mm:ss");
        this.formInline.date = moment(now).format("YYYY/MM/DD");
        this.drawcanvas(hours);
      }, 1000);
    },
    preview() {
      // this.$previewImg({
      //   src: require("@/assets/img/bigdata.png"),
      //   fullscreen: true
      // });
      this.fullscreen = !this.fullscreen;
      if (this.fullscreen) {
        launchFullscreen(document.documentElement || document);
      }
      if (!this.fullscreen && isFullScreen()) {
        exitFullscreen(document.documentElement || document);
      }
    },
    initEcharts() {
      return new Promise(resolve => {
        if (this.regInstance) {
          this.regInstance.dispose();
          this.regInstance = null;
        }
        if (this.spaceInstance) {
          this.spaceInstance.dispose();
          this.spaceInstance = null;
        }
        if (this.waterInstance) {
          this.waterInstance.dispose();
          this.waterInstance = null;
          this.watUseOptions = null;
        }
        if (this.elecInstance) {
          this.elecInstance.dispose();
          this.elecInstance = null;
        }
        let regsiterDom = document.querySelector(".statistic .rate");
        let spaceDom = document.querySelector(".statistic.space");
        let waterDom = document.querySelector(".electron .water-in-use");
        let electronDom = document.querySelector(".electron .electron-in-use");
        if (regsiterDom) {
          this.regInstance = echarts.init(regsiterDom);
        }
        if (spaceDom) {
          this.spaceInstance = echarts.init(spaceDom);
        }
        if (waterDom) {
          this.waterInstance = echarts.init(waterDom);
        }
        if (electronDom) {
          this.elecInstance = echarts.init(electronDom);
        }
        let dataSource = [
          {
            name: this.$t && this.$t("bigdata.dashboard.right.space.rent"),
            value: 11,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#32a3e4"
                },
                {
                  offset: 1,
                  color: "#298df8"
                }
              ])
            }
          },
          {
            name: this.$t && this.$t("bigdata.dashboard.right.space.new"),
            value: 22,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#47c8ce"
                },
                {
                  offset: 1,
                  color: "#5cbb7a"
                }
              ])
            }
          },
          {
            name: this.$t && this.$t("bigdata.dashboard.right.space.deadLine"),
            value: 2,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#f1cb35"
                },
                {
                  offset: 1,
                  color: "#e6a23c"
                }
              ])
            }
          },
          {
            name: this.$t && this.$t("bigdata.dashboard.right.space.vacant"),
            value: 11,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#e41e2a"
                },
                {
                  offset: 1,
                  color: "#f56c6c"
                }
              ])
            }
          }
        ];
        let weekDays = [];
        for (let i = 0; i < 7; i++) {
          weekDays.push(simplifyDay(this.language || "zh", i));
        }
        let labelList = dataSource.map(item => {
          return item.name;
        });
        this.watUseOptions = {
          title: {
            left: "left",
            text: "",
            show: false
          },
          tooltip: {
            trigger: "axis",
            show: false,
            formatter: "{a}:{c}",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            }
          },
          grid: {
            show: false,
            top: "40",
            bottom: "20",
            right: "0",
            left: "40"
          },
          xAxis: [
            {
              show: true,
              type: "category",
              data: [...weekDays],
              axisPointer: {
                type: "shadow"
              },
              splitLine: {
                show: false
              },
              axisLine: {
                //设置x轴坐标线的样式
                show: true,
                lineStyle: {
                  type: "solid",
                  // type: "dotted",
                  fontSize: 8,
                  color: "#32a3e4" //x轴坐标线的颜色
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 5,
                    color: "#fff"
                  }
                }
              },
              axisTick: {
                show: false,
                interval: 0
              }
            }
          ],

          //设置两个y轴，左边显示数量，右边显示概率

          yAxis: [
            {
              type: "value",
              name: "",
              show: true,
              axisLine: {
                //设置x轴坐标线的样式
                show: true,
                lineStyle: {
                  type: "solid",
                  // type: "dotted",
                  fontSize: 8,
                  color: "#006bd0" //x轴坐标线的颜色
                },
                axisLabel: {
                  show: false,
                  textStyle: {
                    fontSize: 5,
                    color: "#006bd0"
                  }
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: true,
                interval: 0
              }
            },
            {
              type: "value",
              name: "",
              min: 0,
              max: 100,
              interval: 10,
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: ""
              }
            }
          ],

          //每个设备分数量、概率2个指标，只要让他们的name一致，即可通过，legeng进行统一的切换

          series: [
            {
              name: "",
              type: "bar",
              data: [81, 64, 70, 70, 75, 68, 81],
              barWidth: "10%",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#32a3e4" },
                    { offset: 0.3, color: "#010101" },
                    { offset: 0.7, color: "#010101" },
                    { offset: 1, color: "#32a3e4" }
                  ]),
                  lineStyle: {
                    color: "#32a3e4"
                  }
                }
              }
            },
            {
              name: "",
              type: "line",
              smooth: true, //设置折线图平滑
              yAxisIndex: 1, //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
              data: [81, 64, 70, 70, 75, 68, 81],
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: "#32a3e4",
                  lineStyle: {
                    color: "#32a3e4"
                  }
                }
              }
            }
          ]
        };
        this.spaceOption = {
          tooltip: {
            //提示框，可以在全局也可以在
            trigger: "item", //提示框的样式
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            color: "#000", //提示框的背景色
            textStyle: {
              //提示的字体样式
              color: "#fff"
            }
          },
          legend: {
            //图例
            orient: "vertical", //图例的布局，竖直    horizontal为水平
            x: "265px", //图例显示在右边
            y: "center",
            data: [...labelList],
            formatter(name) {
              return name;
            },
            textStyle: {
              //图例文字的样式
              color: "#fff", //文字颜色
              fontSize: 12 //文字大小
            }
          },
          grid: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0,
            containLabel: true
          },
          series: [
            {
              name: "",
              type: "pie", //环形图的type和饼图相同
              // radius: ["50%", "90%"], //饼图的半径，第一个为内半径，第二个为外半径
              radius: ["0px", "66%"], //饼图的半径，第一个为内半径，第二个为外半径
              center: ["40%", "53%"], //设置餠图位置
              avoidLabelOverlap: false,
              color: ["#32a3e4", "#47c8ce", "#f1cb35", "#e41e2a"],
              label: {
                normal: {
                  //正常的样式
                  show: false,
                  position: "right"
                },
                emphasis: {
                  //选中时候的样式
                  show: false,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                  }
                }
              }, //提示文字
              itemStyle: {
                borderWidth: 0, //设置border的宽度有多大
                borderColor: "#0A2237"
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [...dataSource]
            }
          ]
        };
        resolve();
      });
    },
    drawEcharts() {
      this.regInstance && this.regInstance.setOption(this.regsiterOption);
      this.spaceInstance && this.spaceInstance.setOption(this.spaceOption);
      this.waterInstance && this.waterInstance.setOption(this.watUseOptions);
      this.elecInstance && this.elecInstance.setOption(this.elecUseOptions);
    }
  },
  mounted() {
    this.initTime();
    this.initEcharts().then(this.drawEcharts);
    window.addEventListener("resize", () => {
      this.initEcharts().then(this.drawEcharts);
    });
    this.$ebus.$on("changeLang", language => {
      this.language = language;
      this.initEcharts().then(this.drawEcharts);
      this.drawcanvas(this.currentTime, true);
    });
  },
  beforeDestroy() {
    this.$ebus.$off("changeLang");
  }
};
</script>

<style scoped  lang='less'>
span {
  color: #fff;
  font-size: 18px !important;
  word-wrap: none;
  white-space: nowrap;
  &.data {
    font-family: "digital";
    font-size: 28px !important;
  }
  &.circle {
    width: 28%;
    display: inline-block;
    text-indent: 20px;
    text-align: normal;
    white-space: normal;
  }
  &.dot {
    display: inline-block;
    width: 8px;
    height: 18px;
    &.warning {
      background: #f1cb35;
    }
    &.used {
      background: #006bd0;
    }
    &.rest {
      background: #47c8ce;
    }
  }
}
select,
option {
  transform: scale(0.8);
}
.container-big-data-dashboard {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  .panel {
    width: 100%;
    height: 100%;
    min-width: 1920px;
    min-height: 1080px;
    position: relative;
    background: #010101;

    > div {
      display: inline-block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
      background-image: url("../../assets/img/bigdata-bg.png");
      background-repeat: no-repeat;
      background-position: left top;
      background-size: contain;
      background-color: #010101;
      &.inner {
        position: absolute;
      }
      &.outer {
        position: fixed;
      }
      .header {
        height: 95px;
        width: 100%;
        // background-image: url("../../assets/img/titlebar/pic-01.png");
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        color: #36b0ef;
        font-size: 36px;
        background: linear-gradient(
          -90deg,
          rgba(68, 210, 211, 1) 0%,
          rgba(6, 119, 213, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
      }
      .content {
        display: flex;
        width: 100%;
        height: calc(100% - 95px);
        > div {
          height: 100%;
        }
        .left {
          // width: 450px;
          flex: 1;
          flex-wrap: wrap;
          position: relative;
          .title {
            width: 100%;
            height: 70px;
            position: relative;
            // background: red;
            img {
              position: absolute;
              object-fit: contain;
              &.titleLogo {
                width: 118px;
                height: 118px;
                left: 12%;
                top: 35px;
              }
              &.titleBar {
                width: 300px;
                height: 70px;
                left: 30%;
                top: 60px;
              }
            }
            span {
              position: absolute;
              font-size: 22px;
              font-weight: bold;

              &.building {
                color: #fff;
                left: 38%;
                top: 72px;
                font-size: 22px !important;
              }
              &.desc {
                color: #3bb6bd;
                left: 55%;
              }
            }
          }
          .person {
            position: absolute;
            top: 220px;
            right: 0px;
            width: 158px;
            height: 158px;
            color: #f1cb35;
            // background: #32a3e4;
            flex-wrap: wrap;
            > div {
              width: 100%;
              height: 50%;
              &.rate {
                font-size: 14px !important;
                font-weight: bold;
                align-items: flex-end;
              }
              &.data {
                align-items: flex-start;
                span {
                  font-size: 20px !important;
                  margin-right: 6px;
                  color: #f1cb35;
                  margin-top: 10px;
                  &:first-of-type {
                    font-size: 48px !important;
                    font-weight: bold;
                    margin-top: -10px;
                  }
                }
              }
            }
          }
          .pesonnel {
            height: 439px;
            position: relative;
            flex-wrap: wrap;
            margin-top: 40px;
            img {
              width: 95%;
              height: 100%;
              position: absolute;
              object-fit: cover;
              top: 20px;
              display: none;
            }
            .title {
              height: 65px;
              position: absolute;
              top: 5%;
              span {
                left: 18%;
                top: 70%;
                position: absolute;
                font-weight: bold;
              }
              img {
                right: -15%;
                top: 85%;
                height: 9px;
                position: absolute;
                object-fit: contain;
                display: none;
              }
            }
            .statistic {
              width: 100%;
              height: 40%;
              position: absolute;
              top: 100px;
              display: flex;
              .detail {
                flex: 1;
                height: 100%;
                // background: red;
                > div {
                  height: 50%;
                  width: 100%;
                  display: flex;
                  .left {
                    width: 50px;
                    height: 100%;
                    position: relative;
                    img {
                      position: absolute;
                      width: 100%;
                      height: 80%;
                      object-fit: contain;
                      bottom: 0;
                      left: 0;
                      display: none;
                    }
                  }
                  .right {
                    margin-top: 8px;
                    .top {
                      height: 50%;
                    }
                    .bottom {
                      height: 50%;
                      font-size: 45px !important;
                      text-align: right;
                      margin-left: -20px;
                    }
                  }
                  &.staff {
                    .right {
                      span {
                        color: #36b0ef;
                      }
                    }
                  }
                  &.visitor {
                    .left {
                      img {
                        top: 10px;
                      }
                    }
                    .right {
                      span {
                        color: #47c8ce;
                      }
                    }
                    // background: green;
                  }
                }
              }
              .rate {
                width: 160px;
                height: 100%;
                margin-top: 8px;
                // background: green;
              }
            }
            .list {
              position: absolute;
              bottom: -50px;
              width: 100%;
              height: 40%;
              > div {
                width: 100%;
                height: 50px;
                line-height: 50px;
                position: absolute;
                span {
                  &:nth-child(3) {
                    margin: 0 10px;
                  }
                  &.fr {
                    display: inline-block;
                    width: 20%;
                    text-align: right;
                    span {
                      position: relative;
                      &:first-of-type {
                      }
                      &:last-of-type {
                        position: absolute;
                        right: 60px;
                      }
                    }
                  }
                }
                &.item-1 {
                  top: -6px;
                  left: 15px;
                  position: relative;
                  span:not(.total) {
                    color: #f1cb35;
                    font-size: 14px !important;
                  }
                  span {
                    &.circle {
                      margin-left: 15px;
                    }
                  }
                }
                &.item-2 {
                  top: 50px;
                  left: 15px;

                  span:not(.total) {
                    color: #006bd0;
                    font-size: 14px !important;
                  }
                  span {
                    &.circle {
                      margin-left: 10px;
                    }
                  }
                }
                &.item-3 {
                  top: 105px;
                  left: 10px;
                  span:not(.total) {
                    color: #47c8ce;
                    font-size: 14px !important;
                    &.circle {
                      margin-left: 15px;
                    }
                  }
                }
                img {
                  position: absolute;
                  top: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 80%;
                  object-fit: contain;
                  display: none;
                }
              }
            }
          }
          .electron {
            height: 329px;
            position: relative;
            img {
              width: 95%;
              height: 100%;
              position: absolute;
              object-fit: cover;
              top: 20px;
              display: none;
            }
            .title {
              height: 65px;
              position: absolute;
              top: 13%;
              span {
                left: 18%;
                top: 70%;
                position: absolute;
                font-weight: bold;
              }
              img {
                right: -20%;
                top: 85%;
                height: 9px;
                position: absolute;
                object-fit: contain;
                display: none;
              }
            }
            .list {
              width: 100%;
              height: calc(96% - 65px);
              position: absolute;
              bottom: -32px;
              left: 22px;
              > div {
                width: 100%;
                height: calc(100% / 2);
                flex-wrap: wrap;
                &.item-1 {
                  position: relative;
                  .title {
                    position: absolute;
                    top: 23px;
                    z-index: 9999;
                    span {
                      color: #32a3e4;
                      margin-left: -5%;
                      font-size: 14px !important;
                      &.unit {
                        margin-top: 107px;
                        margin-left: -25px;
                        font-size: 8px !important;
                      }
                    }
                    .right {
                      display: flex;
                      justify-content: flex-end;
                      select,
                      .option {
                        font-size: 8px !important;

                        // box-shadow: 0px 0px 20px #32a3e4 inset;
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        box-shadow: 0px 0px 10px rgba(50, 163, 228, 0.3) inset;
                        font-size: 14px !important;
                        height: 25px;
                        padding: 0 10px;
                        background: linear-gradient(
                          to right,
                          rgba(50, 163, 228, 0.3),
                          rgba(50, 163, 228, 0.1)
                        ) !important;
                        color: #298df8;
                        border: none;
                      }
                    }
                  }
                }
                &.item-2 {
                  position: relative;
                  .title {
                    position: absolute;
                    top: 30px;
                    z-index: 9999;
                    span {
                      color: #47c8ce;
                      margin-left: -5%;
                      font-size: 14px !important;
                      &.unit {
                        margin-top: 100px;
                        margin-left: -25px;
                        font-size: 8px !important;
                      }
                    }
                    .right {
                      display: flex;
                      justify-content: flex-end;
                      select,
                      .option {
                        font-size: 8px !important;
                        // box-shadow: 0px 0px 20px #3bb6bd inset;
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        box-shadow: 0px 0px 10px rgba(59, 182, 189, 0.5) inset;
                        font-size: 14px !important;
                        height: 25px;
                        padding: 0 10px;
                        background: linear-gradient(
                          to right,
                          rgba(59, 182, 189, 0.5),
                          rgba(59, 182, 189, 0.2)
                        );
                        color: #3bb6bd;
                        border: none;
                      }
                    }
                  }
                }
                .title {
                  width: 70%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 20px;
                  position: relative;
                  > div {
                    flex: 1;
                    height: 100%;
                    line-height: 20px;
                    flex-wrap: nowrap;
                    & .left {
                      display: flex;
                      justify-content: flex-start;
                    }
                    img {
                      object-fit: contain;
                      display: inline-block;
                      width: auto;
                      height: 20px;
                      left: 0;
                      top: 0;
                      display: none;
                    }
                    span {
                      top: 0%;
                    }
                  }
                }
                > .centent {
                  width: 80%;
                  // height: calc(100% - 20px);
                  height: 128px;
                  margin-top: 20px;
                }
              }
            }
          }
        }
        .middle {
          // width: calc(100% - 890px);
          width: 55%;
          // border-left: 1px solid #36b0ef;
          // border-right: 1px solid #36b0ef;
          position: relative;
          .inner {
            width: 100%;
            height: calc(100% - 200px);
          }
          .bottom {
            position: absolute;
            width: 100%;
            height: 120px;
            bottom: 40px;
            > img {
              object-fit: cover;
              width: 110%;
              position: absolute;
              left: -5%;
              top: 0;
              display: none;
            }
            .list {
              width: 100%;
              height: 100%;
              // border-top: 1px solid red;
              position: absolute;
              left: 0;
              top: -8px;
              display: flex;
              justify-content: center;
              align-items: center;
              > div {
                width: auto;
                height: auto;
                // padding: 10px 20px;
                // background: #36b0ef;
                color: #fff;
                margin: 0 30px;
                &.item-1 {
                  .time {
                    font-size: 28px;
                    font-family: "digital";
                  }
                  .date {
                    font-size: 18px;
                    font-family: "digital";
                  }
                }
                &.item-2 {
                  color: #47c8ce;
                  .time {
                    border-radius: 5px;
                    box-shadow: 0px 0px 15px #47c8ce inset;
                    min-width: 85px;
                    height: 45px;
                    span {
                      font-size: 16px;
                      color: #47c8ce;
                      &:last-of-type {
                        font-size: 10px;
                        margin-left: 10px;
                        font-size: 8px !important;
                      }
                    }
                  }
                  .date {
                    white-space: nowrap;
                  }
                }
                &.item-3 {
                  color: #f1cb35;
                  .time {
                    border-radius: 5px;
                    box-shadow: 0px 0px 15px #f1cb35 inset;
                    width: 85px;
                    height: 45px;
                    span {
                      font-size: 16px;
                      color: #f1cb35;
                      &:last-of-type {
                        font-size: 10px;
                        margin-left: 10px;
                        font-size: 8px !important;
                      }
                    }
                  }
                  .date {
                    white-space: nowrap;
                  }
                }
                &.item-4 {
                  position: relative;
                  width: 204px;
                  &::before {
                    // content: "";
                    position: absolute;
                    left: 9px;
                    top: 23px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #f1cb35;
                  }
                  #canvas {
                    width: 204px;
                    object-fit: contain;
                    top: -180px;
                    position: absolute;
                  }
                  #canvas1 {
                    width: 204px;
                    object-fit: contain;
                    top: -180px;
                    position: absolute;
                  }
                }
                &.item-5 {
                  width: 85px;
                  .weather {
                    width: 100%;
                    height: 100%;
                    box-shadow: 0px 0px 15px #f1cb35 inset;
                    border-radius: 5px;

                    img {
                      width: 40px;
                      height: 56px;
                      display: inline-block;
                      object-fit: contain;
                    }
                  }
                }
                &.item-6 {
                  white-space: nowrap;
                  .temperature {
                    img {
                      display: inline-block;
                      height: 25px;
                      object-fit: contain;
                    }
                    span {
                      font-size: 40px !important;
                      font-family: "digital";

                      &.normal {
                        color: #f1cb35;
                      }
                      &.hot {
                        color: #e41e2a;
                      }
                      &.tag {
                        font-size: 16px !important;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .right {
          // width: 450px;
          flex: 1;
          .top {
            width: 100%;
            height: 35%;
            position: relative;
            z-index: 100;
            // background: red;
            img {
              width: 95%;
              position: absolute;
              object-fit: contain;
              display: none;
            }
            .title {
              width: 100%;
              height: 20px;
              position: absolute;
              top: 66px;
              left: -74px;
              span {
                left: 15%;
                top: 20%;
                position: absolute;
                font-weight: bold;
              }
              img {
                left: 20%;
                top: 55%;
                height: 9px;
                position: absolute;
                object-fit: contain;
                display: none;
              }
            }
            .list {
              width: 80%;
              height: calc(90% - 40px);
              position: absolute;
              bottom: -40px;
              > div {
                width: 100%;
                margin-top: 15px;
                height: 60px;
                // display: flex;
                // justify-content: space-between;
                // align-items: center;
                position: relative;
                .right {
                  width: 80%;
                  position: absolute;
                  z-index: 9999;
                  left: 45px;
                  top: 50%;
                  transform: translateY(-50%);
                  .bottom {
                    margin-top: -5px;
                    position: relative;
                  }
                }
                &.item-1 {
                  span {
                    color: #47c8ce;
                    &:not(.data) {
                      font-size: 14px !important;
                    }
                  }
                }
                &.item-2 {
                  span {
                    color: #006bd0;
                    &:not(.data) {
                      font-size: 14px !important;
                    }
                  }
                }
                &.item-3 {
                  span {
                    color: #f1cb35;
                    &:not(.data) {
                      font-size: 14px !important;
                    }
                  }
                  .right {
                    .bottom {
                      display: flex;
                      align-items: center;
                      span {
                        margin-right: 5px;
                      }
                      .overview {
                        position: absolute;
                        right: 20px;
                        bottom: 0px;
                        height: 26px;
                        font-size: 12px !important;
                        margin-left: 10px;
                        line-height: 24px;
                        padding: 0px 20px;
                        color: #f1cb35;
                        border-radius: 3px;
                        border: 1px solid #f1cb35;
                        box-shadow: 0px 0px 10px #f1cb35 inset;
                        &:hover {
                          cursor: pointer;
                        }
                      }
                    }
                  }
                }
                .left {
                  width: 60px;
                  height: 100%;
                  img {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    left: 5%;
                  }
                }
                .right {
                  flex: 1;
                  height: 100%;
                  > div {
                    height: 50%;
                  }
                }
              }
            }
          }
          .bottom {
            width: 100%;
            height: 65%;
            position: relative;
            z-index: 99;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              object-fit: contain;
              display: none;
            }
            .banner {
              width: 100%;
              height: 100%;
              position: absolute;
              .room-rent {
                font-size: 14px !important;
                position: absolute;
                font-weight: bold;
                right: 42%;
                top: 20%;
                z-index: 99999;
                background: linear-gradient(
                  -90deg,
                  rgba(68, 210, 211, 1) 0%,
                  rgba(6, 119, 213, 1) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .order-number {
                font-size: 14px !important;
                font-weight: bold;
                position: absolute;
                left: 1%;
                top: 48%;
                z-index: 99999;
                background: linear-gradient(
                  -90deg,
                  rgba(68, 210, 211, 1) 0%,
                  rgba(6, 119, 213, 1) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
            .title {
              width: 100%;
              height: 20px;
              position: absolute;
              top: 80px;
              left: -73px;
              span {
                left: 15%;
                // top: 75%;
                position: absolute;
                font-weight: bold;
              }
              img {
                left: 20%;
                // top: 110%;
                height: 9px;
                position: absolute;
                object-fit: contain;
                display: none;
              }
              select,
              .option {
                font-size: 8px !important;
                position: absolute;
                z-index: 9999999;
                right: 5px;
                top: -2px;
                // box-shadow: 0px 0px 20px #3bb6bd inset;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                box-shadow: 0px 0px 10px rgba(59, 182, 189, 0.5) inset;
                font-size: 14px !important;
                height: 25px;
                padding: 0 10px;
                background: linear-gradient(
                  to right,
                  rgba(59, 182, 189, 0.5),
                  rgba(59, 182, 189, 0.2)
                );
                color: #3bb6bd;
                border: none;
              }
            }
            .statistic {
              width: 90%;
              height: 35%;
              position: absolute;
              top: calc(20% - 30px);
              left: -90px;
            }
            .list {
              width: 100%;
              height: 40%;
              position: absolute;
              top: 55%;
              min-height: 200px;
              // overflow-y: auto;
              // background: green;
              > div {
                width: 90%;
                height: 45px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                position: absolute;
                left: -3%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                white-space: nowrap;
                .right {
                  margin-left: 20px;
                  line-height: 45px;
                  margin-top: -5px;
                  span {
                    display: inline-block;
                    height: 100%;
                    // line-height: 45px;
                    margin-top: 10px;
                    &:not(.data) {
                      font-size: 12px !important;
                      margin-top: -5px;
                      margin-left: 15px;
                    }
                  }
                }
                .left {
                  height: 100%;
                  line-height: 45px;
                  margin-top: -5px;
                  font-size: 12px !important;
                }
                &.item-1 {
                  // background-image: url("../../assets/img/space/pic-01.png");
                  background-position: center center;
                  top: -3px;
                  .left {
                    text-indent: 3.5rem;
                    color: #006bd0;
                  }
                  .right {
                    text-align: right;
                    margin-right: 60px;
                    span {
                      &:last-of-type {
                        color: #006bd0;
                      }
                    }
                  }
                }
                &.item-2 {
                  // background-image: url("../../assets/img/space/pic-02.png");
                  background-position: center center;
                  top: 54px;
                  .left {
                    text-indent: 3.5rem;
                    color: #3bb6bd;
                  }
                  .right {
                    text-align: right;
                    margin-right: 60px;
                    span {
                      &:last-of-type {
                        color: #3bb6bd;
                      }
                    }
                  }
                }
                &.item-3 {
                  // background-image: url("../../assets/img/space/pic-03.png");
                  background-position: center center;
                  top: 110px;
                  .left {
                    text-indent: 3.5rem;
                    color: #e41e2a;
                  }
                  .right {
                    text-align: right;
                    margin-right: 60px;
                    .data {
                      position: relative;
                      z-index: 999;
                      margin: 0 20px;
                      &.ok {
                        color: #3bb6bd;
                      }
                      img {
                        display: inline-block;
                        width: 38px;
                        height: 38px;
                        border: none;
                        position: absolute;
                        left: -7px;
                        top: 6px;
                      }
                    }
                  }
                }
                &.item-4 {
                  // background-image: url("../../assets/img/space/pic-04.png");
                  background-position: center center;
                  top: 168px;
                  .left {
                    text-indent: 3.5rem;
                    color: #f1cb35;
                  }
                  .right {
                    text-align: right;
                    margin-right: 60px;
                    span {
                      &:last-of-type {
                        color: #f1cb35;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>