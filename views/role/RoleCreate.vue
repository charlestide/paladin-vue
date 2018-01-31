<template>
    <el-form :model="role" :rules="rules" ref="form" label-position="top">
        <el-card :header="'创建新的角色：'+role.name">
            <el-tabs>
                <el-tab-pane label="基本信息">
                    <pvc-form-item label="名称" prop="name">
                        <el-input v-model="role.name"/>
                    </pvc-form-item>
                    <pvc-form-item label="显示名称" prop="display_name">
                        <el-input v-model="role.display_name"/>
                    </pvc-form-item>
                </el-tab-pane>
                <el-tab-pane label="分配权限" prop="permission">
                    <el-form-item>
                        <el-transfer filterable v-model="role.permissionNames" :titles="['可选择','已分配']"
                                     :data="permissions" :props="{key:'name',label:'name'}"/>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-form-item>
                <pvc-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</pvc-button>
                <pvc-button type="primary" icon="fa fa-list" url="/role">列表</pvc-button>
            </el-form-item>
        </el-card>
    </el-form>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from "vuex";
    import Definition from "../../store/definition";


    export default {
        name: "pvc-role-create",
        computed: {
            ...mapGetters('role',{
                role: Definition.STORE_GETTER_EMPTY,
                rules: Definition.STORE_GETTER_RULES
            }),
            ...mapGetters('permission',{permissions:Definition.STORE_GETTER_LIST,permissionQuery:Definition.STORE_GETTER_QUERY}),
        },
        methods: {
            ...mapActions('role',{get: Definition.STORE_ACTION_GET,create: Definition.STORE_ACTION_CREATE}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate()
                    .then( valid => {
                        if (valid) {
                            this.create(this.role)
                                .then((role) => {
                                    this.$router.push('/role/'+role.id)
                                })
                        }
                });
            },
        },
        mounted() {
            this.resetPermissions();
            this.getPermissions();
        },
        beforeRouteUpdate (to, from, next) {
            this.resetPermissions();
            this.getPermissions();
            next();
        }

    }
</script>

<style scoped>

</style>