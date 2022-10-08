<template>
    <div id="userTableView-box">
        <el-button type="danger" :disabled="delButState" @click="delMulti">多项删除</el-button>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column label="头像" width="60">
                <template slot-scope="scope">
                    <img :src="'http://localhost/'+scope.row.profile" class="img">
                </template>
            </el-table-column>
            <el-table-column prop="id" label="UID" width="180">
            </el-table-column>
            <el-table-column prop="name" label="昵称" width="180">
            </el-table-column>
            <el-table-column prop="userType" label="用户类型" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="description" label="简介" width="180" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="createdDate" label="创建日期" width="180">
            </el-table-column>
            <el-table-column prop="modifyDate" label="最后修改日期">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link type="primary" icon="el-icon-edit" @click="open(scope.row,1)">修改</el-link>
                    <el-link type="danger" icon="el-icon-delete" @click="open(scope.row.id,2)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage" :page-sizes="[2,4,8, 16, 32, 64]" :page-size="page.size"
            layout="sizes, prev, pager, next" :total="page.total">
        </el-pagination>

        <el-dialog title="修改" :visible.sync="editDialogVisible" width="30%" center>
            <el-form :label-position="'left'" label-width="80px" :model="currentUser">
                <el-form-item label="UID">
                    <el-input v-model="currentUser.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="currentUser.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="currentUser.email"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="currentUser.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="currentUser.state"></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                    <el-date-picker v-model="currentUser.createdDate" align="right" type="date" placeholder="选择日期"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editClose">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import { getUserByPage, delMultUser, updateUser, delUser } from '@/api/userApi'
export default {
    name: 'UserTableView',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            page: {
                currentPage: 1,
                total: 0,
                size: 4
            },
            editDialogVisible: false,
            currentUserRef: {},
            currentUser: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },

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
        },

        async get() {
            const { data: res } = await getUserByPage(this.page.currentPage, this.page.size)
            this.page.total = Number(res.data.total)
            this.tableData = res.data.users
        },
        open(user, op) {
            switch (op) {
                case 1:
                    this.currentUserRef = user
                    this.currentUser = JSON.parse(JSON.stringify(user))
                    this.editDialogVisible = true
                    break;
                case 2:
                    this.delOne(user)
                    break;
            }
        },
        async delMulti() {
            const { data: res } = await delMultUser(this.multipleSelection)
            if (res.data) {
                this.$message.success(res.code.msg)
                this.get()
            } else {
                this.$message.error(res.code.msg)
            }
        },
        async delOne(id) {
            const { data: res } = await delUser(id)
            if (res.data) {
                this.$message.success(res.code.msg)
                this.get()
            } else {
                this.$message.error(res.code.msg)
            }
        },
        editClose(){
            this.edit()
        },
        async edit() {
            this.currentUser.createdDate = this.convertTime(this.currentUser.createdDate)
            console.log(this.currentUser.createdDate);
            const { data: res } = await updateUser(this.currentUser)
            if (res.data) {
                this.$message.success(res.code.msg)
                this.currentUserRef.id = this.currentUser.id
                this.currentUserRef.name = this.currentUser.name
                this.currentUserRef.description = this.currentUser.description
                this.currentUserRef.email = this.currentUser.email
                this.currentUserRef.state = this.currentUser.state
                this.currentUserRef.createdDate = this.currentUser.createdDate
                this.editDialogVisible = false
            } else {
                this.$message.error(res.code.msg)
            }
        },
        convertTime(time) {
            const date = new Date(time)
            const Y = date.getFullYear()
            const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
            const D = date.getDate()
            const hours = date.getHours()
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            return `${Y}-${M}-${D} ${hours}:${minutes}:${seconds}`
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
.img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
  