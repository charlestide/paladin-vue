<template>
    <el-form :model="admin" :rules="rules" ref="form">
        <el-card :header="'#'+$route.params.id+' '+admin.name" v-loading="loading">
            <el-tabs>
                <el-tab-pane label="基本信息">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="admin.name"/>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="admin.email"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="admin.password"/>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="admin.description" type="textarea"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch v-model="admin.status"/>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="分配角色">
                    <el-form-item>
                        <el-transfer filterable v-model="admin.roleNames" :titles="['可选择','已分配']"
                                     :data="roles" :props="{key:'name',label:'name'}"/>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="分配权限">
                    <el-form-item>
                        <el-transfer filterable v-model="admin.permissionNames" :titles="['可选择','已分配']"
                                     :data="permissions" :props="{key:'name',label:'name'}"/>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-form-item>
                <pvc-button type="primary" @click="onSubmit" icon="fa fa-save">保存</pvc-button>
                <pvc-button type="primary" icon="el-icon-view" :url="'/admin/'+$route.params.id">查看</pvc-button>
                <pvc-button type="primary" icon="fa fa-list" url="/admin">列表</pvc-button>
            </el-form-item>
        </el-card>
    </el-form>
</template>

<script>
    import {mapGetters,mapActions,mapMutations} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-admin-edit",
        computed: {
            ...mapGetters({loading:Definition.COMMON_GETTER_LOADING}),
            ...mapGetters('admin',{admin:Definition.STORE_GETTER_CURRENT,rules: Definition.STORE_GETTER_RULES}),
            ...mapGetters('role',{roles:Definition.STORE_GETTER_LIST,roleQuery:Definition.STORE_GETTER_QUERY}),
            ...mapGetters('permission',{permissions:Definition.STORE_GETTER_LIST,permissionQuery:Definition.STORE_GETTER_QUERY}),
        },
        methods: {
            ...mapActions('admin',{get:Definition.STORE_ACTION_GET,save: Definition.STORE_ACTION_UPDATE}),
            ...mapActions('role',{getRoles: Definition.STORE_ACTION_LIST}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('role',{resetRoles: Definition.STORE_MUTATION_RESET_QUERY}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate()
                    .then( valid => {
                        if (valid) {
                            this.save(this.admin)
                                .then((admin) => {
                                    this.$router.push('/admin/' + admin.id);
                                })
                        }
                    });

            },
            init() {
                this.get(this.$route.params.id);
                this.resetRoles();
                this.getRoles();
                this.resetPermissions();
                this.getPermissions();
                this.$refs.form.resetFields();
            }
        },
        mounted() {
            this.init();
        },
        beforeRouteUpdate (to, from, next) {
            this.init();
            next();
        }
    }
</script>

<style scoped>

</style>