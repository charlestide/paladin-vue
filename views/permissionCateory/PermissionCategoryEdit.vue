<template>
    <el-form :model="category" :rules="rules" label-position="top" ref="form">
        <el-card :header="'#'+category.id+' '+category.name">
            <pvc-form-item label="名称" prop="name">
                <el-input v-model="category.name"/>
            </pvc-form-item>
            <pvc-form-item label="显示名称" prop="display_name">
                <el-input v-model="category.display_name"/>
            </pvc-form-item>
            <el-form-item>
                <el-transfer filterable v-model="category.permissionNames" :titles="['可选择','已分配']"
                             :data="permissions" :props="{key:'name',label:'name'}"/>
            </el-form-item>
            <el-form-item>
                <pvc-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</pvc-button>
                <pvc-button type="primary" icon="fa fa-list" url="/permission-category">列表</pvc-button>
            </el-form-item>
        </el-card>
    </el-form>
</template>

<script>

    import {mapActions,mapMutations,mapGetters} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-permission-category-edit",
        computed: {
            ...mapGetters('permission-category',{
                category:Definition.STORE_GETTER_CURRENT,
                rules: Definition.STORE_GETTER_RULES
            }),
            ...mapGetters('permission',{
                permissions:Definition.STORE_GETTER_LIST,
                permissionQuery:Definition.STORE_GETTER_QUERY
            }),
        },
        methods: {
            ...mapActions('permission-category',{get: Definition.STORE_ACTION_GET,save: Definition.STORE_ACTION_UPDATE}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate( valid => {
                    if (valid) {
                        this.save(this.category);
                    }
                });
            }
        },
        mounted() {
            this.get(this.$route.params.id);
            this.resetPermissions();
            this.getPermissions(true);
        },
        beforeRouteUpdate (to, from, next) {
            this.get(to.$route.params.id);
            this.resetPermissions();
            this.getPermissions();
            next();
        }
    }
</script>

<style scoped>

</style>