import http from "@/utils/http"

export const getIllustByPage =(page,size)=>http.get("/illust/get",{params:{page:page,size:size}});
export const getIllustByPageFixSize10 =(page)=>http.get("/illust/get/"+page);
export const getOneIllust = (id)=>http.get("/illust/getOne/"+id);

export const updateIllust = (illust)=>http.put("/illust",illust)

export const delIllust = (id)=>http.delete("/illust/"+id)

export const delIllustMulti = (idsArray)=>http.post("/illust/delMultiple",idsArray)