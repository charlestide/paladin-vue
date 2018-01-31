<template>
    <el-card :header="'#'+menu.id+' 更新菜单的信息'" v-loading="loading">
        <el-form :model="menu" :rules="rules" label-position="top">
            <pvc-form-item label="菜单名称" required prop="name">
                <el-input v-model="menu.name" :required="true"/>
            </pvc-form-item>
            <pvc-form-item label="URL" prop="url">
                <el-input v-model="menu.url">
                    <template slot="prepend">请以/开头</template>
                </el-input>
            </pvc-form-item>
            <pvc-form-item label="图标" prop="icon">
                <el-input v-model="menu.icon"/>
            </pvc-form-item>
            <pvc-form-item label="权限" prop="permission_id">
                <el-select v-model="menu.permission_id" default-first-option class="d-flex"
                           filterable remote :remote-method="searchPermission" :loading="loading" >
                    <el-option v-for="permission in permissions" :key="permission.id"
                               :label="permission.name" :value="permission.id">
                            <span class="float-left">{{permission.name}}</span>
                            <span class="float-right">{{permission.description}}</span>
                    </el-option>
                </el-select>
                <span class="text-muted">如果留空，将自动为菜单创建一个同名权限</span>
            </pvc-form-item>
            <pvc-form-item label="上层菜单" prop="parent_path">
                <el-cascader v-model="menu.parent_path" :props="menuProps" :options="menus" expand-trigger="hover"
                             change-on-select v-loading="loading" class="d-flex" clearable placeholder="清空表示选择顶层菜单">
                </el-cascader>
            </pvc-form-item>
            <el-form-item>
                <pvc-button type="primary" @click="onSubmit" icon="fa fa-save" :autofocus="true">保存</pvc-button>
                <pvc-button type="primary" icon="fa fa-list" url="/menu">列表</pvc-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>

    import Definition from "../../store/definition";
    import {mapGetters,mapMutations,mapActions} from "vuex";

    export default {
        name: "pvc-menu-edit",
        data() {
            return {
                permissionIds: [],
                menuProps: {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                },
            }
        },
        computed: {
            ...mapGetters({loading: Definition.COMMON_GETTER_LOADING}),
            ...mapGetters('menu',{
                menus: Definition.TREE_GETTER_TREE,
                query: Definition.STORE_GETTER_QUERY,
                menu: Definition.STORE_GETTER_CURRENT,
                rules: Definition.STORE_GETTER_RULES
            }),
            ...mapGetters('permission',{
                permissions: Definition.STORE_GETTER_LIST,
                permissionQuery: Definition.STORE_GETTER_QUERY,
            }),
        },
        methods: {
            ...mapActions('menu',{
                getParent: Definition.STORE_ACTION_LIST,
                get: Definition.STORE_ACTION_GET,
                save: Definition.STORE_ACTION_UPDATE
            }),
            ...mapMutations('menu',{resetParent: Definition.STORE_MUTATION_RESET_QUERY}),
            ...mapActions('permission',{getPermissions: Definition.STORE_ACTION_LIST}),
            ...mapMutations('permission',{resetPermissions: Definition.STORE_MUTATION_RESET_QUERY}),

            onSubmit(event) {
                event.preventDefault();
                let menu = _.clone(this.menu);
                delete menu['parent'];
                delete menu['permission'];
                this.save(menu);
            },
            searchPermission(keyword) {
                this.permissionQuery.addSearch('name',keyword);
                this.resetPermissions();
                this.getPermissions();
            },

            init() {
                this.query.addExcept('id',this.$route.params.id);
                this.resetParent();
                this.resetPermissions();
                this.getPermissions();
                this.getParent();
                this.get(this.$route.params.id);
            },
        },
        created() {
            this.init();
        },
        beforeRouteUpdate (to, from, next) {
            this.init();
            next();
        },
        beforeRouteLeave(to, from, next) {
            this.resetParent();
            next();
        }
    }
</script>

<style scoped>
</style>