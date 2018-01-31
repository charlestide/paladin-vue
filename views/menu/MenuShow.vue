<template>
    <el-card>
        <div slot="header">
            <div class="float-left">
                <p>
                    #{{$route.params.id}} <b>{{menu.name}}</b>
                </p>
            </div>
            <div class="float-right">
                <i class="el-icon-time"></i> {{menu.updated_at}}
            </div>
            <br/>
        </div>
        <el-row>
            <el-col :span="24">
                <div style="min-height: 100px">
                    <h5 class="mb-lg-3">上层菜单：</h5>
                    <ul  class="list-group">
                        <li class="list-group-item w-75">
                            <div class="justify-content-between d-flex ">
                                <p class="title">{{menu.parent_id ? menu.parent.name : '顶层菜单'}}</p>
                                <pvc-button type="primary" :url="'/menu/'+menu.parent_id">查看</pvc-button>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div style="min-height: 300px">
                    <h5 class="mb-lg-3">关联的管理员：</h5>
                    <ul  class="list-group">
                        <li v-for="admin in menu.permission.admins" class="list-group-item w-75">
                            <div class="justify-content-between d-flex ">
                                <p class="title">{{admin.name}}</p>
                                <pvc-button type="primary" :url="'/admin/'+admin.id">查看</pvc-button>
                            </div>
                            <small>{{admin.description}}</small>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="min-height: 300px">
                    <h5 class="mb-lg-3">关联的角色：</h5>
                    <ul  class="list-group">
                        <li v-for="role in menu.permission.roles" class="list-group-item w-75">
                            <div class="justify-content-between d-flex ">
                                <p class="title">{{role.name}}</p>
                                <pvc-button type="primary" :url="'/role/'+role.id">查看</pvc-button>
                            </div>
                            <small>{{role.description}}</small>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <pvc-button type="primary" :url="'/menu/'+$route.params.id + '/edit'" icon="el-icon-edit" :autofocus="true">修改</pvc-button>
        <pvc-button type="primary" url="/menu" icon="fa fa-list">列表</pvc-button>

    </el-card>
</template>

<script>
    import Definition from "../../store/definition";
    import {mapGetters,mapMutations,mapActions} from "vuex";

    export default {
        name: "pvc-menu-show",
        computed: {
            ...mapGetters('menu',{
                menu: Definition.STORE_GETTER_CURRENT,
            }),
        },

        methods: {
            ...mapActions('menu',{
                get: Definition.STORE_ACTION_GET,
            }),
        },
        mounted() {
            this.get(this.$route.params.id);
        },
        beforeRouteUpdate (to, from, next) {
            this.get(this.$route.params.id);
            next();
        }
    }
</script>

<style scoped>

</style>