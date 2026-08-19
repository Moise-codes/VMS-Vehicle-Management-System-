"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {getCurrentAdmin,logoutAdmin} from "../lib/auth";
const AuthContext = createContext(null);
export function AuthProvider({children}){
    const [admin,setAdmin] = useState(null);
    const [loading,setLoading] = useState(true);
    
    const loadAdmin = async () =>{
        try {
            const response = await getCurrentAdmin();
            setAdmin(response.admin);

        } catch {
            setAdmin(null);

        } finally {
            setLoading(false);

        }
    };
    useEffect(()=>{
        loadAdmin();
    },[]);
    const logout = async() => {
        try {
            await logoutAdmin();
        } finally {
            setAdmin(null);
        }
    };
    return (
        <AuthContext.Provider
        value={{
            admin,
            setAdmin,
            loading,
            logout,
            refreshAdmin: loadAdmin,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}