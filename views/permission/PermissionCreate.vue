<template>
    <el-card header="创建一个新的权限">
        <el-form :model="permission" :rules="rules" ref="form">
            <el-form-item label="名称" prop="name">
                <el-input v-model="permission.name"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</el-button>
                <pvc-button type="primary" url="/permission" icon="fa fa-list">列表</pvc-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import {mapGetters,mapActions} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-permission-create",
        computed: {
            ...mapGetters('permission',{
                permission: Definition.STORE_GETTER_EMPTY,
                rules: Definition.STORE_GETTER_RULES
            }),
        },
        methods: {
            ...mapActions('permission',{create: Definition.STORE_ACTION_CREATE}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate( valid => {
                    if (valid) {
                        this.create(this.permission)
                            .then((permission) => this.$router.push('/permission/'+permission.id))
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>