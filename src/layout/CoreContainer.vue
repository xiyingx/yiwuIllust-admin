<template>
    <div class="core-box">
        <el-container>
            <el-aside width="fit-content">
                <el-menu default-active="2" 
                class="el-menu-vertical-demo" 
                :collapse="isCollapse"
                :router="true"
                    background-color="#304156" 
                    text-color="#fff" active-text-color="rgb(64, 158, 255)">
                    <el-menu-item index="/main">
                        <i class="el-icon-house"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-picture-outline"></i>
                            <span>插画管理</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">视图</template>
                            <el-menu-item index="/main/illustTableView">表格</el-menu-item>
                            <el-menu-item index="/main/illustPicView">大图</el-menu-item>
                        </el-menu-item-group>

                        <el-menu-item-group>
                            <template slot="title">操作</template>
                            <el-menu-item index="/main/upload">添加</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </template>
                            <el-menu-item index="/main/userTableView">全部用户</el-menu-item>
                            <el-menu-item index="/main/addUser">添加用户</el-menu-item>
                            <el-menu-item index="1-2">用户收藏夹</el-menu-item>
                    </el-submenu>

                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">系统配置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                        <i :class="iconClass" @click="collapse"></i>
                    
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-header>
                <el-main id="content">
                    <!-- 内容区 -->
                    <slot>

                    </slot>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script>
export default {
    name: 'CoreContainer',
    components: {
    },
    data() {
        return {
            isCollapse:false,
            iconClass:"el-icon-arrow-left"
        }
    },
    methods: {
        collapse() {
            if (this.isCollapse) {
                this.iconClass = "el-icon-arrow-left"
                this.isCollapse = false
            } else {
                this.iconClass = "el-icon-arrow-right"
                this.isCollapse = true
            }
        }
    },
}
</script>
  
<style scoped>
.core-box {
    height: 100vh;
}

.el-header {
    display: flex;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    justify-items: center;
    align-items: center;
}
.el-icon-arrow-right{
    cursor: pointer;
    margin-right: 20px;
    font-size: 20px;
}
.el-icon-arrow-left{
    cursor: pointer;
    margin-right: 20px;
    font-size: 20px;
}
.el-breadcrumb {
    line-height: 60px;

}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

.el-menu {
    height: 100%;
    
}

.el-main {}

.core-box .el-container {
    height: 100%;
}
</style>
  