<template>
    <el-card header="创建一个新的权限类别">
        <el-form :model="category" :rules="rules" ref="form">
            <pvc-form-item label="名称" prop="name">
                <el-input v-model="category.name"/>
            </pvc-form-item>
            <pvc-form-item label="描述">
                <el-input v-model="category.description" type="textarea"/>
            </pvc-form-item>
            <el-form-item>
                <el-form-item>
                    <el-transfer filterable v-model="category.permissionNames" :titles="['可选择','已分配']"
                                 :data="permissions" :props="{key:'name',label:'name'}"/>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</el-button>
                <pvc-button type="primary" url="/permission-category" icon="fa fa-list">列表</pvc-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import {mapGetters,mapActions,mapMutations} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-permission-category-create",
        data() {
            return {
                categoryData: null
            }
        },
        computed: {
            ...mapGetters('permission-category',{
                empty: Definition.STORE_GETTER_EMPTY,
                rules: Definition.STORE_GETTER_RULES
            }),
            ...mapGetters('permission',{
                permissions:Definition.STORE_GETTER_LIST,
                permissionQuery:Definition.STORE_GETTER_QUERY
            }),
            category: {
                get() {
                    if (!this.categoryData) {
                        this.categoryData = _.clone(this.empty);
                    }
                    return this.categoryData;
                },
                set(admin) {
                    this.adminData = admin;
                }
            }
        },
        methods: {
            ...mapActions('permission-category',{create: Definition.STORE_ACTION_CREATE}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),
            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate( valid => {
                    if (valid) {
                        this.create(this.category)
                            .then((category) => this.$router.push('/permission-category/'+category.id))
                    }
                });
            },
            init() {
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