<template>
    <div class="editWind-box">
        <el-form :label-position="'left'" label-width="80px" :model="currentIllust">
                <el-form-item label="标题">
                    <el-input v-model="currentIllust.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="currentIllust.description"></el-input>
                </el-form-item>
                <el-form-item label="标签" v-if="loadTag">
                    <el-tag :key="tag" v-for="tag in currentIllust.tags" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                        size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
export default {
    name: 'EditWind',
    props:{
        illust:{
            type:Object
        },
    },
    data() {
        return {
            currentIllust: { tags: [] },
            inputVisible:false,
            inputValue:"",
            loadTag:true
        }
    },
    computed:{
    },
    created(){
        if (this.illust) {
            this.currentIllust = JSON.parse(JSON.stringify(this.illust))
        }
    },
    watch:{
        //*监听变化 进行深拷贝 否则currentIllust无法响应式
        illust:function(val) {
            //*序列化
            this.currentIllust = JSON.parse(JSON.stringify(val))
            //!刷新一次 否则会乱跑 去掉后会造成添加标签的按钮乱动！！！
            this.loadTag = false;
            this.$nextTick(function () {
                this.loadTag = true;
            });
        }
    },
    methods: {
        // 动态标签
        //动态标签 引用自elementUI
        handleClose(tag) {
            this.currentIllust.tags.splice(this.currentIllust.tags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.currentIllust.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    },
}
</script>
  
<style scoped>
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
  