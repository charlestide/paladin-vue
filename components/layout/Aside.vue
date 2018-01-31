<template>
    <el-aside :width="sidebarWidth" id="sidebar-left" class="bg-dark text-light" v-loading="menuLoading"
              element-loading-text="正在加载菜单" >
        <el-row class="text-algin">
            <div class="brand bg-primary text-center" v-show="!sidebar.collapse">
                <a href="/">
                    <img class="logo" src="/logo.png" alt="brand logo" width="150" height="45" />
                </a>
            </div>
            <button class="btn btn-outline-primary fixed-button" v-show="sidebar.collapse" @click="expandSideBar">
                <i class="fa fa-bars"></i>
            </button>
        </el-row>
        <el-row class="bg-dark">
            <div class="avatar-info" v-show="!sidebar.collapse">
                <h6 class="media-heading">
                    <div class="avatar fa fa-user" width="50"></div>
                       <span style="margin-left: 10px">欢迎, {{admin.name}}</span>
                </h6>
                <small><i class="fa fa-envelope" style="margin-right: 10px;"></i> {{admin.email}}</small>
            </div>
            <div class="avatar-info" v-show="sidebar.collapse">
                <div class="avatar fa fa-user"></div>
            </div>
        </el-row>
        <el-row id="menu-row" >
            <el-menu background-color="#2a2a2a" active-text-color="#fff" text-color="#999"
                     :unique-opened="true" default-active="1" :collapse="sidebar.collapse"
                     @select="menuClick" :default-active="active" :default-openeds="opens">
                <el-submenu v-for="(menu,menuIndex) in menuTree" :key="menu.id" :index="String(menu.id)">
                    <template slot="title">
                            <i :class="['fa','fa-'+menu.icon,'icon']"></i>
                            <span class="text">{{menu.name}}</span>
                    </template>

                    <el-menu-item v-for="(submenu,submenuIndex) in menu.children" :index="String(submenu.id)"
                                  :key="submenu.id">
                        <template slot="title">
                                <i :class="['fa','fa-'+submenu.icon,'icon']"></i>
                                <span>{{submenu.name}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-row>
    </el-aside>
</template>

<script>
    import {mapGetters,mapMutations,mapActions,mapState} from "vuex";

    export default {
        name: "pvc-aside",
        data() {
            return {
                menuLoading: true
            }
        },
        computed: {
            ...mapGetters('auth',['admin']),
            ...mapGetters('layout',['sidebar','menuTree']),
            ...mapState('layout',['menus']),
            sidebarWidth() {
                return this.sidebar.collapse ? '65px' : '200px';
            },
            currentMenu() {
                let currentMenu = null;
                if (_.has(this.$route.meta,'menu_name')) {
                    currentMenu = _.find(this.menus,{name: this.$route.meta.menu_name})
                } else if (this.$route.path) {
                    currentMenu = _.find(this.menus,{url: this.$route.path});
                }
                return currentMenu;
            },
            opens() {
                if (_.has(this,'currentMenu')) {
                    return currentMenu.parent_path;
                } else {
                    return [];
                }
            },
            active() {
                if (this.currentMenu) {
                    return String(this.currentMenu.id);
                } else {
                    return null;
                }
            }
        },
        created() {
            this.getMenus()
                .then(() => {
                    this.menuLoading = false;
                })
        },
        mounted() {
            this.currentMenu;
        },
        methods: {
            ...mapMutations('layout',['expandSideBar']),
            ...mapActions('layout',['getMenus']),
            menuClick(index,path) {
                let menu = _.find(this.menus,{id: Number(index)});
                console.log(index,menu,this.menus);
                if (menu && menu.url) {
                    this.$router.push(menu.url);
                }
            }
        }
    }
</script>

<style scoped lang="scss">


</style>