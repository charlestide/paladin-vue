<template>
    <el-header id="breadcrumb" height="50px">
        <div class="float-left title-wrapper">
            <div class="d-inline-block text-center icon">
                <i v-if="page.icon" :class="iconClass"></i>
            </div>
            <span class="title">{{page.title}}</span>
            <i class="summary text-muted">{{page.summary}}</i>
        </div>
        <div class="float-right">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-wrapper float-right">
                <el-breadcrumb-item v-for="(breadcrumb,index) in page.breadcrumb" :key="index" :to="breadcrumb.to">
                    {{breadcrumb.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
            <i class="float-right">您在这里：</i>
        </div>
    </el-header>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "pvc-bread-crumb",
        computed: {
            ...mapGetters('layout',['mainPage']),
            iconClass() {
                if (this.page.icon.indexOf('as-') === 0) {
                    return "as " + this.page.icon;
                } else if (this.page.icon.indexOf('el-') === 0) {
                    return this.page.icon;
                } else {
                    return "fa fa-" + this.page.icon;
                }
            },
            page() {
                return {
                    title: this.$route.meta.title,
                    icon:  this.$route.meta.icon,
                    summary: this.$route.meta.summary,
                    breadcrumb: _.map(_.clone(this.$route.matched),(route) => {
                        return {
                            title: _.get(route,'meta.title'),
                            to: route.path
                        }
                    })
                };
            }
        }
    }
</script>

<style scoped lang="scss">


</style>