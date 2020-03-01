<template>
  <div class="container-model">
    <div class="header"></div>
    <div id="panel-3d-model"></div>
  </div>
</template>
 
<script>
import * as Three from "three";
import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,
      elements: [],
      tipsBottom: 5 + 200,
      tipsTop: 5 + 200 + 40 
    };
  },
  methods: {
    createSphere(color) {
      //创建球体
      let radius = 10,
        segemnt = 16,
        rings = 16;
      let sphereMaterial = new Three.MeshLambertMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      });
      let sphere = new Three.Mesh(
        new Three.SphereGeometry(radius, segemnt, rings),
        sphereMaterial
      );
      sphere.geometry.verticesNeedUpdate = true;
      sphere.geometry.normalsNeedUpdate = true;
      return sphere;
    },
    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    loadObj(id, baseUrl, objName, multiplyScalar, position, materials) {
      let obj = { id: id, isTips: false, cylis: [] };
      if (!multiplyScalar) {
        multiplyScalar = 1;
      }
      let manager = new Three.LoadingManager();
      let loader = new OBJLoader(manager);
      if (multiplyScalar) {
        loader.setMaterials(materials);
        obj.materials = materials;
      }
      loader.setPath(baseUrl);
      loader.load(objName, object => {
        //显示比例
        object.scale.multiplyScalar(multiplyScalar);
        //加入到页面中
        this.scene.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        obj.model = object;
        object.position.set(position.x, position.y, position.z);
        this.elements.push(obj);
      });
    },
    loadObjWithMaterials(
      id,
      baseUrl,
      objName,
      mtlName,
      position,
      multiplyScalar
    ) {
      let mtlLoader = new MTLLoader();
      mtlLoader.setPath("../../static/model/building/");
      mtlLoader.load("mall.mtl", materials => {
        this.loadObj(
          id,
          "../../static/model/building/",
          "mall.obj",
          multiplyScalar,
          position,
          materials
        );
      });
    },
    initThree() {
      let element = document.querySelector("#panel-3d-model");
      //初始化相机
      this.camera = new Three.PerspectiveCamera(
        70,
        element.clientWidth / element.clientHeight,
        1,
        1000
      );
      this.camera.position.x = 0;
      this.camera.position.y = 1000;
      this.camera.position.z = 1000;
      this.camera.rotation.x -= 45 * (Math.PI / 180);
      //场景
      this.scene = new Three.Scene();
      //渲染
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(element.clientWidth, element.clientHeight);
      element.appendChild(this.renderer.domElement);
      //灯光
      this.light = new Three.AmbientLight(0xffffff);
      this.scene.add(this.light);

      //创建地面
      let plane = new Three.Mesh(
        new Three.PlaneBufferGeometry(1000, 1000),
        new Three.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0x101010
        })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -0.5;
      this.scene.add(plane);
      plane.receiveShadow = true;

      this.loadObjWithMaterials(
        "m1",
        "../../static/model/building/",
        "building.obj",
        "building.mtl",
        {
          x: 0,
          y: 0,
          z: 0
        },
        1
      );
    }
  },
  mounted() {
    this.initThree();
    window.addEventListener("resize", this.initThree, false);
  }
};
</script>
 
<style lang='less' scoped>
.container-model {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .header {
    height: 100px;
  }
  #container {
    width: 55%;
    margin: 0 auto;
    height: 100%;
  }
}
</style>