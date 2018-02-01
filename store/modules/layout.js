
const PVC_LAST_PAGE = 'pvc-last-page';

import DataHelper from "../helper/data";
import RemoteHelper from "../helper/remote";

export default {
    namespaced: true,
    state: {
        sidebar: {
            active: 1,
            collapse: false
        },
        mainPage: {
            icon: '',
            title: '',
            summary: ''
        },
        breadcrumb: [],
        menus: [],
        settings: {}
    },
    getters: {
        sidebar: (state) => state.sidebar,
        mainPage: (state) => state.mainPage,
        lastPage: (state) => sessionStorage.getItem(PVC_LAST_PAGE),
        menuTree: (state) => DataHelper.getChildren(state.menus),
        logo: (state) => state.settings && _.has(state.settings,'logo_path') ? state.settings.logo_path : '/logo.png',
        settings: (state) => state.settings,
        isExpire: (state) => {
            if (_.has(state.settings,'updateAt')) {
                let now = (new Date()).getTime() / 1000,
                    updateAt = state.settings.updateAt.getTime() / 1000;
                return now - updateAt > 300;
            } else {
                return true;
            }
        }
    },
    mutations: {
        collapseSideBar(state) {
            state.sidebar.collapse = true;
        },
        expandSideBar(state) {
            state.sidebar.collapse = false;
        },

        setMainPage(state,page) {
            state.mainPage = page;
        },

        saveLastPage(state,url) {
            if (! (url in {'/init':'','/login':'','/':''})) {
                sessionStorage.setItem(PVC_LAST_PAGE, url);
            }
        },

        setMenus(state,menus) {
            state.menus = menus;
        },

        setSettings(state,settings) {
            if (!_.isObject(settings)) {
                settings = {};
            }
            settings['updatedAt'] = new Date();
            state.settings = settings;
        }
    },
    actions: {
        getMenus({commit}) {
            return new Promise(resolve => {
                this._vm.$axios.get('/layout/menu')
                    .then(response => {
                        if (response.data.status) {
                            commit('setMenus',response.data.data);
                        }
                        resolve(response.data.data);
                    })
                    .catch((error) => {
                        RemoteHelper.showRemoteError(this._vm,error,'获取菜单失败');
                    });
            });
        },

        getSettings({commit,getters}) {
            return new Promise(resolve => {
                if (getters.isExpire) {
                    this._vm.$axios.get('/layout/settings')
                        .then(response => {
                            commit('setSettings', response.data.data);
                            resolve(getters.settings);
                        })
                } else {
                    resolve(getters.settings);
                }
            })
        }
    }
};