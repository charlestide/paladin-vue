<template>
    <el-form :model="admin" :rules="rules" ref="form" :status-icon="true">
        <el-card  v-loading="loading">
            <el-steps slot="header" :active="currentStep+1">
                <el-step title="基本信息" description="填写管理员的基本信息，如名称等" />
                <el-step title="分配角色" description="可以为管理员分配角色，每个角色拥有不同的权限"/>
                <el-step title="分配权限" description="您可以为管理员分配特别的权限"/>
            </el-steps>
            <el-tabs tab-position="right" :value="currentStep.toString()">
                <el-tab-pane label="基本信息" >
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
                    <el-form-item>
                        <el-button type="primary" @click="next()" icon="el-icon-arrow-right"
                                    :autofocus="true">下一步</el-button>
                        <pvc-button type="primary" icon="fa fa-list" url="/admin">列表</pvc-button>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="分配角色" >
                    <el-form-item>
                        <el-transfer filterable v-model="admin.roleNames" :titles="['可选择','已分配']"
                                     :data="roles" :props="{key:'name',label:'name'}"/>
                    </el-form-item>
                    <el-button type="primary" @click="prev()" icon="el-icon-arrow-left"
                               :autofocus="true">下一步</el-button>
                    <el-button type="primary" @click="next()" icon="el-icon-arrow-right"
                                :autofocus="true">下一步</el-button>
                    <pvc-button type="primary" icon="fa fa-list" url="/admin">列表</pvc-button>
                </el-tab-pane>
                <el-tab-pane label="分配权限" >
                    <el-form-item>
                        <el-transfer filterable v-model="admin.permissionNames" :titles="['可选择','已分配']"
                                     :data="permissions" :props="{key:'name',label:'name'}"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="prev()" icon="el-icon-arrow-left"
                                   :autofocus="true">下一步</el-button>
                        <pvc-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</pvc-button>
                        <pvc-button type="primary" icon="fa fa-list" url="/admin">列表</pvc-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>

        </el-card>
    </el-form>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-admin-create",
        data() {
            return {
                currentStep: 0,
                adminData:null,
            }
        },
        computed: {
            ...mapGetters('admin',{empty:Definition.STORE_GETTER_EMPTY,rules: Definition.STORE_GETTER_RULES}),
            ...mapGetters({loading: Definition.COMMON_GETTER_LOADING}),
            ...mapGetters('role',{roles:Definition.STORE_GETTER_LIST,roleQuery:Definition.STORE_GETTER_QUERY}),
            ...mapGetters('permission',{permissions:Definition.STORE_GETTER_LIST,permissionQuery:Definition.STORE_GETTER_QUERY}),
            admin: {
                get() {
                    if (!this.adminData) {
                        this.adminData = _.clone(this.empty);
                    }
                    return this.adminData;
                },
                set(admin) {
                    this.adminData = admin;
                }
            }
        },
        methods: {
            ...mapActions('admin',{create: Definition.STORE_ACTION_CREATE}),
            ...mapActions('role',{getRoles: Definition.STORE_ACTION_LIST}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('role',{resetRoles: Definition.STORE_MUTATION_RESET_QUERY}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();

                this.$refs.form.validate()
                    .then(valid => {
                        //判断验证结果
                        if (valid) {
                            //创建
                            this.create(this.admin)
                                //跳转
                                .then((admin) =>{
                                        this.$router.push('/admin/'+admin.id);
                                    }
                                )
                        } else {
                            this.$notify({
                                title: '检查',
                                message: '填写的信息有问题，请切换标签检查',
                                type: 'warning'
                            });
                        }
                    })

            },
            next() {
                this.currentStep++;
            },
            prev() {
                this.currentStep--;
            },

            init() {
                this.adminData = null;
                this.resetRoles();
                this.getRoles();
                this.resetPermissions();
                this.getPermissions();
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