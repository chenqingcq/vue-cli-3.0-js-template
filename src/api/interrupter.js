import Axios from 'axios';
import { Spin } from 'iview';
import store from '@/store/store';
const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";
// 创建axios实例
const axios = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API || "", // api的base_url
    timeout: 15000, // 请求超时时间,
    // headers: {
    //     'Access-Control-Allow-Origin': "*",
    //     'Content-Type': process.env.Content_Type,
    //     'Access-Control-Allow-Credentials': true,
    // }
});

// request拦截器
axios.interceptors.request.use(config => {
    let hasSchedule = config.url.includes('schedule') || config.url.includes("queryFeedBackTopicInfo");
    if (!hasSchedule) {
        Spin.show({
            render: h => {
                return h("div", [
                    h("Icon", {
                        class: "spin-icon-load",
                        props: {
                            type: "ios-loading",
                            size: 40
                        }
                    }),
                    h("div", "")
                ]);
            }
        });
    }
    let { agencyId, agencyType, token, extraToken } = store.state[USERINFO].userInfo || {};
    /**
     * 批量注册
     */
    if (config.url.includes('batch/register/staff') ||
        config.url.includes('batch/register/visitor') ||
        config.url.includes('batch/register/schedule')) {
        config.headers['msToken'] = token;
        config.baseURL = process.env.VUE_APP_BASE_UPLOAD_API;
        return config;
    }
    if (config.url.includes('token/sign') ||
        config.url.includes('space/del/reserve') ||
        config.url.includes('space/add/info') ||
        config.url.includes('space/get/list') ||
        config.url.includes('space/get/info') ||
        config.url.includes('space/del/info') ||
        config.url.includes('space/upd/info') ||
        config.url.includes('space/get/apply/notice') ||
        config.url.includes('space/get/reserve/list') ||
        config.url.includes('batch/upload/file') ||
        config.url.includes('compress/delete/file') ||
        config.url.includes('feedback/get/feedback')
    ) {
        if (extraToken) {
            let index = extraToken.indexOf("_");
            if (index > 0) {
                let token = extraToken.substring(0, index + 9);
                config.headers[`token-${token}`] = token;
            }
        }
        config.baseURL = process.env.VUE_APP_BASE_GET_TOKEN_API;
        Object.assign(config.data, {
            agencyId,
            agencyType: agencyType == 3 ? 2 : 1,
            msToken: extraToken
        })
        console.log(config.data);
        return config
    }
    if (Object.prototype.toString.call(config.data).slice(8, -1) == 'FormData') {
        config.data.append("msUserType", agencyType || 2);
        config.data.append("msOrganizeId", agencyId);
        config.data.append("msToken", token);
    }
    return config;
}, error => {
    Spin.hide();
    // Do something with request error
    return Promise.reject(error);
})
// respone拦截器
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config) {
        return Promise.reject(err);
    }
    if (err.response.status === 401) {
        console.log("无权限");
        //处理无权限
        window.localStorage.setItem(TOKEN, "");
        window.location.hash = 'login';
        window.location.reload();
    }
    Spin.hide();
});
// respone拦截器
axios.interceptors.response.use(
    response => {
        let hasStrangerRecord = response.config.url.includes('queryStrangerRecordStatistics');
        let hasStrangerStatistics = response.config.url.includes('queryStrangerRecordStatistics');

        if (hasStrangerRecord && hasStrangerStatistics) {
            return response.data;
        }
        Spin.hide();
        return response.data;

    },
    error => {
        Spin.hide();
        return Promise.reject(error);
    }
);
// axios.defaults.headers['Content-Type'] = 'application/json';
export default axios;