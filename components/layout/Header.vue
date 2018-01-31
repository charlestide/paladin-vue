<template>
    <el-header id="header" height="50px">
        <div class="float-left" v-show="!sidebar.collapse">
            <button class="btn btn-outline-primary fixed-button" @click="collapseSideBar">
                <i class="fa fa-bars"></i>
            </button>
        </div>
        <div class="float-right">
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="fa fa-user"></i>
                    {{admin.name}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="profile">我的信息</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <button class="fixed-button btn btn-outline-primary">
                <i class="fa fa-gear fa-spin"></i>
            </button>
        </div>
    </el-header>
</template>

<script>
    import {mapGetters,mapMutations} from "vuex";


    export default {
        name: "pvc-header",
        computed: {
            ...mapGetters('auth',['admin']),
            ...mapGetters('layout',['sidebar'])
        },
        methods: {
            ...mapMutations('layout',['collapseSideBar']),
            ...mapMutations('auth',['logout']),
            handleCommand(command) {
                switch (command) {
                    case 'profile':
                        break;
                    case 'logout':
                            this.logout();
                            this.$router.push('/login');
                        break;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
</style>