<template>
    <div id="main">
        <p class="lead text-right">
            <pvc-button type="primary" icon="el-icon-plus" url="/permission/create">添加</pvc-button>
        </p>
        <pvc-table store="permission" :perPage="perPage">
            <pvc-table-column prop="id" label="ID" :searchable="true" align="center"/>
            <pvc-table-column prop="name" :sortable="true" label="名称" searchable />
            <pvc-table-column prop="category.name" :sortable="true" label="类别" align="center"/>
            <pvc-table-column prop="roles_count" :sortable="true" label="关联角色" align="center"/>
            <pvc-table-column prop="admins_count" :sortable="true" label="关联管理员" align="center"/>
            <el-table-column prop="updated_at" label="更新于"/>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <pvc-button type="primary" :url="'/permission/' + scope.row.id" icon="el-icon-info">详情</pvc-button>
                        <pvc-button type="primary" :url="'/permission/'+scope.row.id+'/edit'" icon="el-icon-edit">修改</pvc-button>
                        <pvc-button type="primary" confirm="删除权限是不可恢复的，你真的知道自己在做什么吗？" @click="handlerDelete(scope.$index, scope.row)" icon="el-icon-delete">删除</pvc-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </pvc-table>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from "vuex";
    import Definition from "../../store/definition";


    export default {
        name: "pvc-permission-index",
        computed: {
            ...mapGetters('permission',{perPage: Definition.STORE_GETTER_PAGE_LENGTH})
        },
        methods: {
            ...mapActions('permission',{delete: Definition.STORE_ACTION_DELETE}),
            handlerDelete(index,row) {
                this.delete(row.id);
            }
        }
    }
</script>

<style scoped>

</style>