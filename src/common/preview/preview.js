import Prewiew from './preview.vue';
let previewInstace = null;
export default {
    install(Vue) {
        Vue.prototype.$previewImg = function (configs) {
            configs = Object.assign({}, {
                src: '',
                show: false,
                fullscreen: false,//是否全屏展示
                style: {},
                hide() { }
            }, configs);
            if (!previewInstace || !configs.show) {
                previewInstace = null;
                let PrevewConstructor = Vue.extend(Prewiew, "Prewiew");
                previewInstace = new PrevewConstructor({
                    data() {
                        return {
                            src: configs.src,
                            show: true,
                            toggle: configs.hide,
                            style: {
                                ...configs.style,
                                width: configs.style.width ? configs.style.width + "px" : '100%',
                                height: configs.style.height ? configs.style.height + "px" : '100%'
                            },
                            fullscreen: configs.fullscreen
                        }
                    }
                });
                document.body.appendChild(previewInstace.$mount().$el);
            }
        };

    }
}