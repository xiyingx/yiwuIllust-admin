import http from "@/utils/http";

export const login = (user) =>
  http.post("/user/login", { user: JSON.stringify(user) });

export const getUserByPage = (page, size) =>
  http.get("/user/getUsersByPage", { params: { page: page, size: size } });

//*该方法支持更改全部字段 
//!UID慎重修改！
export const updateUser = (user) => http.post("/user/updateUser", user);

export const delMultUser = (userArray) =>
  http.post("/user/delUsers", userArray);

export const delUser = (userID) => http.get("/user/delUser/"+userID);
