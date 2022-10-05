<template>
    <div class="login-box">
        <div class="login-form">
            <h1>管理员登录</h1>
            <el-form :label-position="'left'"  label-width="0px" :model="loginForm">
                <el-form-item>
                    <el-input placeholder="邮箱" prefix-icon="el-icon-user-solid" v-model="loginForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="密码" prefix-icon="el-icon-lock" show-password v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="验证码" prefix-icon="el-icon-paperclip" v-model="loginForm.checkCode"></el-input>
                </el-form-item>
            </el-form>
            <img :src="checkCodeSrc" style=" display: block;margin: 0 auto;margin-bottom: 20px;" @click="getCode">
            <el-button type="primary" @click="goLogin">登录</el-button>
        </div>
    </div>
</template>
  
<script>
import {getCheckCode} from '@/api/codeApi'
import {login} from '@/api/userApi'
import { mapMutations } from 'vuex'
export default {
    name: 'Login',
    data() {
        return {
            loginForm:{ email: '', password: '',checkCode:'',userType:'管理员'},
            checkCodeSrc:""
        }
    },
    created() {
        this.getCode()
    },
    methods: {
        ...mapMutations("user",["setUserID","setIsLogin","setToken"]),
        async goLogin(){
            const {data:res} = await login(this.loginForm)
            if (res.data.isSuccess) {
                this.setIsLogin(true)
                this.setToken(res.data.token)
                this.setUserID(res.data.UID)
                localStorage.setItem("UID",res.data.UID)
                localStorage.setItem("token",res.data.token)
                this.$message.success(res.code.msg)
                this.$router.push("/main")
            } else {
                this.getCode()
                this.$message.error(res.code.msg)
            }
        },
        async getCode(){
           const {data:res} = await getCheckCode()
           this.checkCodeSrc = 'data:image/png;base64,' + res.data
        }
    },
}
</script>
  
<style scoped>
    .login-box{
        display: flex;
        width: 100%;
        height: 100vh;
        background-color: #2d3a4b;
        
    }
    h1{
        color: #fff;
        line-height: 70px;
        text-align: center;
    }
    .el-form-item /deep/ .el-input__inner{
        border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #fff;
    height: 52px;
    }   
    .el-form-item /deep/ .el-form-item__label{
        color: #fff;
    }
    .login-form{
        width: 490px;
        margin: 0 auto;
        margin-top: 200px;
    }
    .el-button{
        
        width: 100%;
        height: 40px;
    }
</style>
  