"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface SessionData {
    accessToken: string;
    id: string;
    name: string;
    email: string;
    image: string;
    role: string; // Admin/User role
}

interface SessionContextType {
    session: SessionData | null;
    setSession: (session: SessionData | null) => void;
    isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [session, setSession] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            setIsLoading(true);
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                const { data: user, error } = await supabase.from("users").select("role").eq("id", data.session.user.id).single();

                if (error) {
                    console.error("Error fetching user role:", error);
                    setIsLoading(false);
                    return;
                }

                setSession({
                    accessToken: data.session.access_token,
                    id: data.session.user.id,
                    name: data.session.user.user_metadata.full_name,
                    email: data.session.user.user_metadata.email,
                    image: data.session.user.user_metadata.avatar_url,
                    role: user?.role || "user",
                });
            }
            setIsLoading(false);
        };

        fetchSession();
    }, []);

    return <SessionContext.Provider value={{ session, setSession, isLoading }}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
