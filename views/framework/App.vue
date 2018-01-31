<template>
    <el-container>
        <pvc-aside ></pvc-aside>
        <el-container>
            <pvc-header></pvc-header>
            <pvc-bread-crumb></pvc-bread-crumb>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer id="footer" height="50px">
                <div class="float-left" >
                    2017 - {{thisYear}} <b class="text-primary">©</b> Paladin Admin. Created by
                    <a href="mailto:charlestide@vip.163.com"><i>Charlestide.Tide</i></a>
                </div>
                <div class="float-right" >
                    {{(new Date()).toDateString()}}
                </div>
            </el-footer>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: "pvc-app",
        data() {
            return {
                thisYear: (new Date).getFullYear()
            }
        }
    }
</script>

<style scoped lang="scss">


</style>