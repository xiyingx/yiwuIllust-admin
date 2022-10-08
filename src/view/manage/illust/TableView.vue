<template>
    <div class="tableView-box">
        <el-button type="danger" :disabled="delButState" @click="delMulti">多项删除</el-button>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column label="缩略图" width="200" header-align="center">
                <template slot-scope="scope">
                    <el-image :preview-src-list="['http://localhost/'+scope.row.src]"
                        :src="'http://localhost/'+scope.row.src"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id" width="300">
            </el-table-column>
            <el-table-column prop="name" label="标题" width="120">
            </el-table-column>
            <el-table-column prop="description" label="描述" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="作者" width="220" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-row>
                        <el-col :span="5">昵称:</el-col>
                        <el-col :span="19">{{scope.row.author}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">UID:</el-col>
                        <el-col :span="19">{{scope.row.authorUID}}</el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="countLikeUser" label="点赞人数" width="100">
            </el-table-column>
            <el-table-column prop="countStarUser" label="收藏人数" width="100">
            </el-table-column>
            <el-table-column prop="createdDate" label="创建日期" width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link type="primary" icon="el-icon-edit" @click="open(scope.row,1)">修改</el-link>
                    <el-link type="danger" icon="el-icon-delete" @click="open(scope.row.id,2)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage" :page-sizes="[4,8, 16, 32, 64]" :page-size="page.size"
            layout="sizes, prev, pager, next" :total="page.total">
        </el-pagination>

        <el-dialog title="修改插画" :visible.sync="editDialogVisible" width="30%" center>
            <edit-wind ref="editWind" :illust="currentIllust">
            </edit-wind>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close(1)">取 消</el-button>
                <el-button type="primary" @click="close(2)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import EditWind from '@/components/EditWind.vue'
import { getIllustByPage, updateIllust, delIllust, delIllustMulti } from '@/api/illustApi'
export default {
    name: 'TableView',
    components: {
        EditWind
    },
    data() {
        return {
            tableData: [],
            page: {
                currentPage: 1,
                total: 0,
                size: 4
            },
            multipleSelection: [],
            currentIllust: { tags: [] },
            currentIllustRef: {},
            editDialogVisible: false,

        }
    },
    computed: {
        delButState() {
            return (this.multipleSelection.length == 0) ? true : false
        }
    },
    created() {
        this.get()
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
            this.page.size = val
            this.get()
            console.log(this.page.size)
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.get()
            console.log(`当前页: ${val}`)
        },
        async handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection = this.multipleSelection.map(obj => { return obj.id })
            console.log(this.multipleSelection)
            console.log(val)
        },
        async get() {
            const { data: res } = await getIllustByPage(this.page.currentPage, this.page.size);
            this.tableData = res.data.illust
            this.page.total = res.data.total
        },
        open(illust, op) {
            switch (op) {
                case 1:
                    this.currentIllustRef = illust
                    this.currentIllust = JSON.parse(JSON.stringify(illust))
                    this.editDialogVisible = true
                    break;
                case 2:
                    this.delOne(illust)
                    break;

            }
        },
        async delOne(id) {
            const { data: res } = await delIllust(id);
            if (res.data) {
                this.$message.success(res.code.msg)
                this.get()
            } else {
                this.$message.error(res.code.msg)
            }
        },
        async delMulti() {
            const { data: res } = await delIllustMulti(this.multipleSelection)
            if (res.data) {
                this.$message.success(res.code.msg)
                this.get()
            } else {
                this.$message.error(res.code.msg)
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
                        this.currentIllustRef.name = editRes.name;
                        this.currentIllustRef.description = editRes.description;
                        this.currentIllustRef.tags = editRes.tags;
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

    },
}
</script>
  
<style scoped>
.el-pagination {
    margin-top: 20px;
    text-align: center;
}

.el-link {
    margin-right: 10px;
}

/* 动态标签样式 */
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
  