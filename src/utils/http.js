import axios from "axios";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
const http = axios.create({
  baseURL: "http://localhost/",
  withCredentials: true,
  headers: { token: localStorage.getItem("token") },
  timeout: 3000,
});
//!增加拦截器 解决token不刷新的问题
http.interceptors.request.use(
  (config) => {
    nProgress.start()
    let token = localStorage.getItem("token");
    token && (config.headers.token = token);
    return config;
  },
  (error) => {
    return Promise.reject("error");
  }
);

http.interceptors.response.use(
  (res) => {
    //*纯属看效果
    setTimeout(()=>{
      nProgress.done()
    },500)
    return res
  },
  (error) => {
    return Promise.reject("error");
  }
);
export default http;
