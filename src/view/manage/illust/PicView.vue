<template>
    <div class="picView-box">
        <picture-print :illustList="illustList" :enableScale="true">
            <template #header="scope">
                <div class="list-head">
                    <el-link type="primary" icon="el-icon-edit" @click="op(scope,1)">修改</el-link>
                    <el-link type="success" icon="el-icon-view" @click="op(scope,2)">详情</el-link>
                    <el-popconfirm title="确定永久删除？" @confirm="op(scope,3)">
                        <el-link slot="reference" type="danger" icon="el-icon-delete">删除</el-link>
                    </el-popconfirm>
                </div>
            </template>

        </picture-print>
        <!-- 设置一个加载动画 -->
        <div class="temp" v-loading="loading"></div>

        <el-dialog title="修改插画" :visible.sync="editDialogVisible" width="30%" center>
            <edit-wind ref="editWind" :illust="currentIllust">
            </edit-wind>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close(1)">取 消</el-button>
                <el-button type="primary" @click="close(2)">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="详情" :visible.sync="detailDialogVisible" width="30%" center>
            <el-row>
                <el-col :span="4">ID:</el-col>
                <el-col :span="20">{{currentIllust.id}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">标题:</el-col>
                <el-col :span="20">{{currentIllust.name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">作者:</el-col>
                <el-col :span="20">{{currentIllust.author}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">作者ID:</el-col>
                <el-col :span="20">{{currentIllust.authorUID}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">描述ID:</el-col>
                <el-col :span="20">{{currentIllust.description}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">创建日期:</el-col>
                <el-col :span="20">{{currentIllust.createdDate}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">标签:</el-col>
                <el-col :span="20">
                    <el-tag type="primary" v-for="(item,index) in currentIllust.tags" :key="index">
                        {{item}}
                    </el-tag>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getIllustByPageFixSize10, getOneIllust, updateIllust, delIllust } from '@/api/illustApi'
import PicturePrint from '@/components/PicturePrint';
import EditWind from '@/components/EditWind.vue'
export default {
    name: 'PicView',
    components: {
        PicturePrint, EditWind
    },
    data() {
        return {
            illustList: [],
            currentPage: 1,
            MaxPage: 1,
            pageSize: 10,
            loading: true,
            isRouterAlive: true,
            rollderHist: 0,
            editDialogVisible: false,
            detailDialogVisible: false,
            currentIllust: { tags: [] },
            curretnIllustIndex: -1
        }
    },
    created() {
        this.getIndex();
    },
    mounted() {
        document.getElementById("content").onscroll = this.handleScroll;
    },
    activated() {
        // this.reload();
    },
    deactivated() {
        // window.onscroll = null;
    },
    destroyed() {
        document.getElementById("content").onscroll = null;
    },
    methods: {
        //滚动条滚动函数
        handleScroll() {
            let content = document.getElementById("content")
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            var scrollTop = content.scrollTop
            //变量windowHeight是可视区的高度
            this.rollderHist = scrollTop;
            var cententHeight = content.clientHeight
            //变量scrollHeight是滚动条的总高度
            var scrollHeight = content.scrollHeight
            //滚动条到底部的条件
            if (scrollTop + cententHeight == scrollHeight) {
                if (this.currentPage >= this.MaxPage) {
                    console.log("触底了");
                } else {
                    this.loading = true;
                    this.currentPage++;
                    //防止请求过快
                    setTimeout(() => {
                        this.getIndex();
                    }, 500);
                }
            }
        },
        async getIndex() {
            const { data: res } = await getIllustByPageFixSize10(this.currentPage);
            if (res.data.illust) {
                this.illustList = this.illustList.concat(res.data.illust);
                this.MaxPage = res.data.totalPage;
                this.loading = false;
            }

        },
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
            //必须设置延迟 因为前面异步了 nextTick比setTimeout先执行
            //此时只需要让设置滚动条比刷新后执行即可
            setTimeout(() => {
                document.documentElement.scrollTop = this.rollderHist;
                document.body.scrollTop = this.rollderHist;
                window.onscroll = this.handleScroll;
            });
        },
        async op(data, code) {
            let res = null
            this.curretnIllustIndex = data.index
            switch (code) {
                case 1:
                    res = await getOneIllust(data.illust.id);
                    this.currentIllust = res.data.data.illustRes.illust
                    this.editDialogVisible = true
                    break;
                case 2:
                    res = await getOneIllust(data.illust.id);
                    this.currentIllust = res.data.data.illustRes.illust
                    this.detailDialogVisible = true;
                    break;
                case 3:
                    this.delOne(data.illust.id)
                    this.illustList.splice(data.index, 1)
                    break;
            }
        },
        async close(op) {
            let res = {}
            let editRes = this.$refs.editWind.currentIllust
            switch (op) {
                case 1:
                    this.editDialogVisible = false;
                    break;
                case 2:
                    console.log(editRes);
                    res = await updateIllust(editRes);
                    if (res.data.data) {
                        this.illustList[this.curretnIllustIndex].name = editRes.name
                        this.$message.success(res.data.code.msg)
                        this.editDialogVisible = false;
                    } else {
                        this.$message.error(res.data.code.msg)
                        return
                    }
                    break;
            }
            this.currentIllust = { tags: [] }
        },
        async delOne(id) {
            const { data: res } = await delIllust(id)
            if (res.data) {
                this.$message.success(res.code.msg)
            } else {
                this.$message.error(res.code.msg)
            }
        },

    },
}
</script>

<style scoped>
#cc1 {
    margin: 0 auto;
}

.temp {
    height: 100px;
}

.list-head {
    padding: 10px;
}
.el-col{
    line-height: 50px;
}
.el-col .el-tag{
    margin-left: 10px;
}
.el-link {
    margin-right: 10px;
}
</style>
  