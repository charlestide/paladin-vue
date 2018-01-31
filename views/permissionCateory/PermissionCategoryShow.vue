<template>
    <el-card>
        <div slot="header">
            <div class="float-left">
                <p>
                    #{{$route.params.id}} <b>{{category.name}}</b>
                </p>
            </div>
            <div class="float-right">
                <i class="el-icon-time"></i> {{category.updated_at}}
            </div>
            <br/>
        </div>
        <el-row>
            <el-col :span="24">
                <div  style="min-height: 300px">
                    <h5 class="mb-lg-3">包含以下权限：</h5>
                    <div  class="card-deck">
                        <div class="card" v-for="permission in category.permissions">
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
                </div>
            </el-col>
        </el-row>
        <pvc-button type="primary" :url="'/permission-category/'+$route.params.id + '/edit'" icon="el-icon-edit" :autofocus="true">修改</pvc-button>
        <pvc-button type="primary" url="/permission-category" icon="fa fa-list">列表</pvc-button>

    </el-card>
</template>

<script>
    import {mapActions,mapGetters} from "vuex";
    import Definition from "../../store/definition";

    export default {
        name: "pvc-permission-category-show",
        computed: {
            ...mapGetters('permission-category',{category:Definition.STORE_GETTER_CURRENT})
        },
        methods: {
            ...mapActions('permission-category',{get: Definition.STORE_ACTION_GET}),
        },
        mounted() {
            this.get(this.$route.params.id);
        },
        beforeRouteUpdate (to, from, next) {
            this.get(this.$route.params.id);
            next();
        }
    }
</script>

<style scoped>

</style>