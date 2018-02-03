
// import routeMap from "./routes";
import Router from "../modules/router";
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import PaladinStoreConfig from "../store";
import PreLoader from "../modules/preloader";
import AxiosHelper from "../plugin/axios-helper";
import ElementUI from 'element-ui';
import Database from "../store/database/database";
import Definition from "../store/definition";
import perloaderMapping from "../preloader.mapping";

const moment = require('moment');
require('moment/locale/zh-cn');

class Launcher {

    constructor() {
        this.vueConfig = {};
        this.init();
        this.document = window.document;
        this.map = {};
        this.storeConfig = {};
        this._router = new Router();
    }

    init() {
        Vue.use(VueRouter);
        Vue.use(ElementUI,{ size: 'small' });
        Vue.use(require('vue-moment'),{
            moment
        });
    }

    _initLoader() {
        Vue.use(PreLoader, {
            componentMap: _.defaultsDeep(this.map,perloaderMapping),
            callback: function (name) {
                store.commit('loader/complete', name)
            }
        });
    }

    setComponentMap(map) {
        this.map = map;
    }

    setStoreConfig(storeConfig) {
        this.storeConfig = storeConfig;
    }

    set router(router) {
        this._router = router;
    }

    get router() {
        return this._router;
    }

    boot() {
        this._initLoader();
        this._setRoute();
        this._setStore();
        this._setAxios();
        return new Vue(_.defaults(this.vueConfig,{
            created() {
                let self = this;

                //将待加载组件读入store
                this.$store.commit('loader/init',PreLoader.getInstance().getComponents());

                //注册组件，但虽然注册了，但其实所有组件都是异步加载的，所以只有用到的组件才会加载
                this.$loader.registerAll();

                //跳到初始页，加载组件
                this.$router.push('/init');

                window.onload = function () {
                    //在页面加载完成后，主动加载所有组件
                    self.$loader.loadAll();
                };

                this.$router.beforeEach((to,from,next) => {
                    this.$store.commit(Definition.COMMON_MUTATION_RESET_REMOTE_FORM_ERROR);
                    next();
                });

                //注册钩子函数，在路由完成后调用
                this.$router.afterEach((to,from) => {
                    //将访问的页面保存到sessionStorage中
                    self.$store.commit('layout/saveLastPage', to.path);
                });
            },
        }));
    }

    _setAxios() {
        Vue.use(AxiosHelper,{
            router: this.vueConfig.router,
            store: this.vueConfig.store
        });
    }

    getRoutes() {
       return this.router.output();
    }

    _setRoute() {
        let loader = PreLoader.getInstance();

        this.router
            .addRootRoute('/init','pvc-init')
            .addRootRoute('/login','pvc-login')
            .addRootRoute('/','pvc-app');
        this.router
            .addModuleRoute('admin','管理员','管理员','users')
            .addModuleRoute('role','角色','角色','users')
            .addModuleRoute('permission','权限','权限','user-secret')
            .addModuleRoute('permission-category','权限类别','权限类别','user-secret')
            .addModuleRoute('menu','菜单','菜单','list-ul');

        this.vueConfig.router = new VueRouter({
            routes: this._parseRoute(this.router.output(),loader)
        });
    }

    _parseRoute(routesList,loader) {
        let self = this;
        _.map(routesList,(route) => {
            if (_.has(route,'componentName')) {
                route.component = loader.get(route.componentName);
            } else if (_.has(route,'componentNames') && _.isObject(route.componentNames)){
                _.forEach(route.componentNames,(value,key) => {
                    _.set(route,'components.'+key,loader.get(value));
                });
            }

            if (_.has(route,'children')) {
                route.children = self._parseRoute(route.children,loader);
            }
        });

        return routesList;
    }

    _setStore() {
        Vue.use(Vuex);
        Database.setIndexedDB(window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
        this.vueConfig.store = new Vuex.Store(_.merge(PaladinStoreConfig,this.storeConfig));
    }
}

export default Launcher;