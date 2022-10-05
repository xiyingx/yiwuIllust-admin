import http from "@/utils/http"

export const login = (user)=>http.post("/user/login",{user:JSON.stringify(user)})