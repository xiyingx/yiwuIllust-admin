import http from "@/utils/http"

export const getIllustByPage =(page)=>http.get("/illust/get/"+page);
// export const getIllustBypage = ()=>http.get("")
export const getOneIllust = (id)=>http.get("/illust/getOne/"+id);