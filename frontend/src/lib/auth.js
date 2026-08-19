import api from "./api"

export const registerAdmin = async(data)=>{

    const response  = await api.post("/auth/register",data);
    return response.data;
};

export const loginAdmin = async(data)=>{
    const response = await api.post("/auth/login",data);
    return response.data;
};
export const getCurrentAdmin = async()=>{
    const response = await api.get("/auth/me");
    return response.data;
}
export const logoutAdmin = async()=>{
    const response = await api.post("/auth/logout");
    return response.data;
}