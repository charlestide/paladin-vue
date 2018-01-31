<template>
    <el-card :header="'#'+$route.params.id+' 更新权限的信息'" >
        <el-form :model="permission" :rules="rules" ref="form" label-position="top">
            <pvc-form-item label="名称" prop="name">
                <el-input v-model="permission.name"/>
            </pvc-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="permission.description" type="textarea"/>
            </el-form-item>
            <pvc-form-item label="分类" prop="category_id" >
                <el-select v-model="permission.category_id" default-first-option class="d-flex"
                           filterable remote :remote-method="searchCategory" :loading="loading" >
                    <el-option v-for="category in categories" :key="category.id"
                               :label="category.name" :value="category.id">
                        <span class="float-left">{{category.name}}</span>
                        <span class="float-right">{{category.description}}</span>
                    </el-option>
                </el-select>
                <span class="text-muted">如果留空，将自动为菜单创建一个同名权限</span>
            </pvc-form-item>
            <el-form-item>
                <pvc-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</pvc-button>
                <pvc-button type="primary" icon="fa fa-list" url="/permission">列表</pvc-button>
                <pvc-button type="primary" icon="el-icon-arrow-right" :url="'/permission/'+(this.$route.params.id+1)+'/edit'">修改下一个</pvc-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import {mapActions,mapGetters,mapMutations} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-permission-edit",
        computed: {
            ...mapGetters({loading: Definition.COMMON_GETTER_LOADING}),
            ...mapGetters('permission',{
                permission:Definition.STORE_GETTER_CURRENT,
                rules: Definition.STORE_GETTER_RULES
            }),
            ...mapGetters('permission-category',{
                categories: Definition.STORE_GETTER_LIST,
                categoriesQuery: Definition.STORE_GETTER_QUERY,
            }),
        },
        methods: {
            ...mapActions('permission',{get:Definition.STORE_ACTION_GET,save:Definition.STORE_ACTION_UPDATE}),
            ...mapActions('permission-category',{getCategories: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission-category',{resetCategories: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.save(this.permission)
                    }
                });
            },
            init() {
                this.get(this.$route.params.id);
                this.resetCategories();
                this.getCategories();
            },
            searchCategory(keyword) {
                this.categoriesQuery.addSearch('name',keyword);
                this.resetCategories();
                this.getCategories();
            },
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