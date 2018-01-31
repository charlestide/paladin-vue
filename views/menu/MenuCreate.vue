<template>
    <el-form :model="menu" :rules="rules" label-position="top" ref="form">
        <el-card header="创建一个新的菜单">
            <pvc-form-item label="菜单名称" required prop="name">
                <el-input v-model="menu.name" :required="true"/>
            </pvc-form-item>
            <pvc-form-item label="URL" prop="url">
                <el-input v-model="menu.url">
                    <template slot="prepend">请以/开头</template>
                </el-input>
            </pvc-form-item>
            <pvc-form-item label="图标">
                <el-input v-model="menu.icon"/>
            </pvc-form-item>
            <el-form-item label="权限" >
                <el-select v-model="menu.permission_id" default-first-option class="d-flex" clearable
                           filterable remote :remote-method="searchPermission" :loading="loading">
                    <el-option v-for="permission in permissions" :key="permission.id"
                               :label="permission.name" :value="permission.id">
                        <span class="float-left">{{permission.name}}</span>
                        <span class="float-right">{{permission.description}}</span>
                    </el-option>
                </el-select>
                <span class="text-muted">如果留空，将自动为菜单创建一个同名权限</span>
            </el-form-item>
            <pvc-form-item label="上层菜单">
                <el-cascader v-model="menu.parent_path" :props="menuProps" :options="menus" expand-trigger="hover"
                             change-on-select :loading="loading" class="d-flex" clearable placeholder="清空表示选择顶层菜单">
                </el-cascader>
            </pvc-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</el-button>
                <pvc-button type="primary" url="/menu" icon="fa fa-list">列表</pvc-button>
                <pvc-button type="primary" @click="test" icon="fa fa-list">设置</pvc-button>
                <span>permission_id{{menu.permission_id}}</span>
            </el-form-item>
        </el-card>
    </el-form>

</template>

<script>

    import {mapGetters,mapMutations,mapActions} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-menu-create",
        data() {
            return {
                menu: {
                    name: '',
                    url: '',
                    icon: '',
                    permission_id: null,
                    parent_id: 0,
                    parent_path: []
                },
                menuProps: {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                },
            }
        },
        computed: {
            ...mapGetters({loading: Definition.COMMON_GETTER_LOADING}),
            ...mapGetters('permission',{
                permissions: Definition.STORE_GETTER_LIST,
                permissionQuery:Definition.STORE_GETTER_QUERY,
                current: Definition.STORE_GETTER_CURRENT
            }),
            ...mapGetters('menu',{
                menus: Definition.TREE_GETTER_TREE,
                query: Definition.STORE_GETTER_QUERY,
                empty: Definition.STORE_GETTER_EMPTY,
                rules: Definition.STORE_GETTER_RULES
            }),
        },
        methods: {
            ...mapActions('menu',{
                getParent: Definition.STORE_ACTION_LIST,
                get: Definition.STORE_ACTION_GET,
                create: Definition.STORE_ACTION_CREATE
            }),
            ...mapMutations('menu',{resetParent: Definition.STORE_MUTATION_RESET_QUERY}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),

            onSubmit(event) {
                event.preventDefault();
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.create(this.menu)
                            .then((menu) => this.$router.push('/menu/'+menu.id))
                    }
                });
            },

            searchPermission(keyword) {
                this.resetPermissions();
                this.permissionQuery.addSearch('name',keyword);
                this.getPermissions();
            },

            init() {
                this.menu.parent_id = Number(this.$route.params.parent);
                if (!_.isEmpty(this.menu.parent_id)) {
                    this.get(this.menu.parent_id)
                        .then((item) => {
                            this.menu.parent_path = item.parent_path;
                        })
                }

                this.resetParent();
                this.getParent();
                this.resetPermissions();
                this.getPermissions();
            },

            test() {
                if (_.isNumber(this.menu.permission_id)) {
                    this.menu.permission_id++;
                } else {
                    this.menu.permission_id = 1;
                }
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