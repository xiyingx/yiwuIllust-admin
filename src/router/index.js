import Vue from "vue";
import VueRouter from "vue-router";
import Main from "@/view/Main.vue";
import ManageIndex from "@/view/manage/Index.vue";
import IllustTableView from "@/view/manage/illust/TableView";
import IllustPicView from "@/view/manage/illust/PicView"
import Upload from '../view/manage/illust/Upload.vue'
import UserTableView from "@/view/manage/user/TableView"
import AddUser from '@/view/manage/user/AddUser'
import Login from "@/view/manage/Login";
import store from "@/store/index";
import {checkToken} from '@/api/codeApi'

//关闭重复点击路由的警告信息

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  //定义hash地址与组件的关系
  //路由规则
  routes: [
    { path: "/", redirect: "/main" },
    // ! 注意不要给子路由加 "/"
    {
      path: "/main",
      component: Main,
      children: [
        { path: "", component: ManageIndex },
        {
          path: "illustTableView",
          name: "IllustTableView",
          component: IllustTableView,
        },
        { path: "illustPicView", name:'IllustPicView',component: IllustPicView },
        { path: "upload", name:'Upload',component: Upload },
        { path: "userTableView", name:'UserTableView',component: UserTableView },
        { path: "addUser", name:'addUser',component: AddUser },
      ],
    },
    { path: "/login", component: Login, name: "Login" },
  ],
});
//定义路由守卫
//先为用户检查token，是否有效，有效就继续，无效弹出登录窗口
router.beforeEach((to, from, next) => {
  let url = to.path;
  // console.log(store.getters['user/getToken']);
  if (url === "/login") {
    next();
  } else {
    if (store.state.user.islogin) {
      next();
    } else {
      if (store.getters['user/getToken']) {
        checkToken().then((res)=>{
          if (res.data.data) {
            next();
          }else next({ path: "/login" });
        }).catch((erro)=>{
          next({ path: "/login" });
        })
      }else next({ path: "/login" });
    }
  }
});
export default router;
