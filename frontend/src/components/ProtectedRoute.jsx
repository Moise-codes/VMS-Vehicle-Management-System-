"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "../context/AuthContext";
export default function ProtectedRoute({children}){
    const {admin, loading} = useAuth();
    const router = useRouter();
    useEffect(()=>{
        if (!loading && !admin){
            router.replace("/login");
        }

    }, [admin,loading,router]);
    if (loading) {
        return (
             <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
      </div>
        );
    }
    if (!admin){
        return null;
    }
    return children;
}