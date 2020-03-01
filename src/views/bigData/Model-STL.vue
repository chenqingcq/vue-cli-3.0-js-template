<template>
  <div class="container-model center">
    <div id="panel-3d-model"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
let STLLoader = require("three-stl-loader")(THREE);
let camera = null;
let scene = null;
let renderer = null;
let light = null;
let controls = null;
let container = null;
export default {
  data() {
    return {};
  },
  methods: {
    initRender() {
      //设置renderer
      container = document.getElementById("panel-3d-model");
      //渲染器构建
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      // 告诉渲染器需要阴影效果
      // renderer.setClearColor(0xeeeeee);
      renderer.setClearColor(0x010101);
      container.appendChild(renderer.domElement);
    },
    initCamera() {
      //相机构建
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        1,
        3600
      );
      //camera.position.set(0, 40, 50);
      camera.position.set(0, 240, 260);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    initScene() {
      //场景构建
      scene = new THREE.Scene();
    },
    initLight() {
      // 灯光
      // scene.add(new THREE.AmbientLight(0x444444));
      // 户外光
      light = new THREE.HemisphereLight(0x404040, 0xffffff, 1);
      // 点光
      // light = new THREE.PointLight(0xffffff);
      // light.position.set(0,50,50);
      light.position.set(0, 1, 0);
      //告诉平行光需要开启阴影投射
      light.castShadow = true;
      scene.add(light);
    },
    initModel() {
      // 开启辅助工具
      // let helper = new THREE.AxesHelper(50);
      // scene.add(helper);
      //加载STL文件
      this.initModelSTL();
      //加载.OBJ .MTL文件
      // this.initModelMTLAndOBJ();
    },
    initModelSTL() {
      let loader = new STLLoader();
      let path =
        process.env.NODE_ENV == "production"
          ? `../../iim/iim-science-management-system/static/model/building/mall.STL`
          : `../../static/model/building/mall.STL`;
      loader.load(path, geometry => {
        //创建纹理
        let mat = new THREE.MeshLambertMaterial({ color: 0x36b0ef });
        let mesh = new THREE.Mesh(geometry, mat);
        // let mesh = new THREE.Mesh(geometry);
        mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
        mesh.scale.set(1, 1, 1); //缩放
        geometry.center(); //居中显示
        scene.add(mesh);
      });
    },
    initModelMTLAndOBJ() {
      let path =
        process.env.NODE_ENV == "production"
          ? `../../iim/iim-science-management-system/static/model/building/`
          : `../../static/model/building/`;
      let manager = new THREE.LoadingManager();
      let mtlLoader = new MTLLoader(manager);
      mtlLoader.setPath(path);
      mtlLoader.setCrossOrigin(true);
      mtlLoader.load("mall.mtl", materials => {
        let objLoader = new OBJLoader(manager);
        objLoader.setPath(path);
        objLoader.materials = materials;
        console.log(materials, objLoader, "/");
        // objLoader.load("mall.obj", object => {
        //   console.log(object, "/");
        //   object.position.y = 0;
        //   object.scale.set(0.5, 0.5, 0.5);
        //   scene.add(object);
        // });
      });
    },
    initControls() {
      //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
      controls = new OrbitControls(camera, renderer.domElement);
      // 如果使用animate方法时，将此函数删除
      //controls.addEventListener( 'change', render );

      // 使动画循环使用时阻尼或自转 意思是否有惯性
      controls.enableDamping = true;

      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      controls.dampingFactor = 0.25;

      //是否可以缩放
      controls.enableZoom = true;

      //是否自动旋转
      controls.autoRotate = true;

      controls.autoRotateSpeed = 0.5;

      //设置相机距离原点的最远距离
      controls.minDistance = 1;

      //设置相机距离原点的最远距离
      controls.maxDistance = 200;

      //是否开启右键拖拽
      controls.enablePan = true;
    },
    render() {
      renderer.render(scene, camera);
    },
    onWindowResize() {
      //窗口变动触发的函数
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      this.render();
      renderer.setSize(container.clientWidth, container.clientHeight);
    },
    animate() {
      //更新控制器
      this.render();
      controls.update();
      requestAnimationFrame(this.animate);
    },
    draw3D() {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();
      this.initControls();
      this.animate();
    },
    throttle(delay = 500, callback) {
      //500s之内不用重复刷新
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        callback.call(this, arguments);
      }, delay);
    }
  },
  mounted() {
    this.draw3D();
    window.addEventListener("resize", () => {
      // this.throttle(1000, this.onWindowResize);
    });
  }
};
</script>
 
<style lang='less' scoped>
.container-model {
  width: 100%;
  height: 100%;
  position: relative;
  #panel-3d-model {
    width: 80%;
    height: 80%;
  }
}
</style>