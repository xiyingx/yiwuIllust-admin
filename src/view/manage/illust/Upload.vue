<template>
    <div class="upload-box">
        <div>
            <el-upload class="upload-demo" 
            drag action="http://localhost/illust/add" 
            :headers="{token:token1}" 
            :multiple="false"
            :on-success="uploadSuccess" 
            :on-remove="handleRemove" 
                :auto-upload="false" 
                :limit="1" ref="upload" 
                :on-change="uploadChange"
                :data="param"
                >
                <div>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传单个jpg/png文件,且不超过500kb</div>
                </div>
            </el-upload>
            <transition name="fade">
                <div v-show="editWindVisible" style="margin: 20px;">
                    <edit-wind ref="editWind" >
                </edit-wind>
                <el-button type="primary" @click="onUpload">上传</el-button>
                </div>
                
            </transition>
            
        </div>
        <div>
            <transition name="fade">
                    <el-image v-show="preViewVisible" :src="uploadIllustSrc" :preview-src-list="[uploadIllustSrc]"
                        class="img-1" />
            </transition>
        </div>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
import EditWind from '@/components/EditWind.vue'
export default {
    name: 'Upload',
    components: {
        EditWind
    },
    data() {
        return {
            uploadIllustSrc: "",
            fileList: [],
            preViewVisible: false,
            editWindVisible:false,
            isNotUploding:true,
            param:{}
        }
    },
    computed: {
        ...mapGetters("user", { token1: ["getToken"] }),
    },
    created() {

    },
    methods: {
        uploadChange(file, fileList) {
            if (this.isNotUploding) {
                this.editWindVisible = true
                setTimeout(() => {
                    this.uploadIllustSrc = URL.createObjectURL(file.raw)
                    this.preViewVisible = true;
                }, 200)
            }
            this.isNotUploding = true
        },
        onUpload(){
            this.param.illustName = this.$refs.editWind.currentIllust.name
            this.param.description = this.$refs.editWind.currentIllust.description
            this.param.picTags = this.$refs.editWind.currentIllust.tags
            this.$refs.upload.submit();
            this.isNotUploding = false
        },
        handleRemove(file, fileList) {
            this.preViewVisible = false
            this.editWindVisible = false
        },
        uploadSuccess(response, file, fileList){
            this.preViewVisible = false
            this.editWindVisible = false
        }

    },
}
</script>
  
<style scoped>
    .upload-box{
        display: flex;
        
    }
.img-1 {

    margin-left: 20px;
    display: block;
    width: 336px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .18);
}



/** */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
}
</style>
  