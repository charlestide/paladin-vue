<template>
    <div id="main">
        <p class="lead text-right">
            <pvc-button type="primary" icon="el-icon-plus" url="/permission-category/create">添加</pvc-button>
        </p>
        <pvc-table store="permission-category" :perPage="perPage">
            <el-table-column type="expand" >
                <template slot-scope="props">
                    <div class="card-deck">
                        <div class="card" v-for="permission in props.row.permissions">
                            <div class="card-header">
                                权限 <span>#{{permission.id}}</span>
                            </div>
                            <div class="card-body">
                                <h6 class="card-title">{{permission.name}}</h6>
                                <p class="card-text">{{permission.description || ''}}</p>
                                <pvc-button type="primary" :url="'/permission/' + permission.id">查看</pvc-button>
                            </div>
                            <div class="card-footer">
                                <i class="el-icon-time"></i> {{permission.updated_at | moment('from')}}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <pvc-table-column prop="id" label="ID" :searchable="true" align="center" />
            <pvc-table-column prop="name" :sortable="true" label="名称" searchable />
            <el-table-column prop="updated_at" label="更新于"/>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <pvc-button type="primary" :url="'/permission-category/' + scope.row.id" icon="el-icon-info">详情</pvc-button>
                        <pvc-button type="primary" :url="'/permission-category/'+scope.row.id+'/edit'" icon="el-icon-edit">修改</pvc-button>
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
        name: "pvc-permission-category-index",
        computed: {
            ...mapGetters('permission-category',{perPage: Definition.STORE_GETTER_PAGE_LENGTH})
        },
        methods: {
            ...mapActions('permission-category',{delete: Definition.STORE_ACTION_DELETE}),
            handlerDelete(index,row) {
                this.delete(row.id);
            }
        }
    }
</script>

<style scoped>

</style>