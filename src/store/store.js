import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import userModule from './modules/userInfo';

Vue.use(Vuex);

const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";

export default new Vuex.Store({
    strict: true,
    modules: {
        [USERINFO]: userModule,
    },
    plugins: [createPersistedState()]
})