"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SessionData {
    accessToken: string;
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
}

interface SessionContextType {
    session: SessionData | null;
    isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient();
    const [session, setSession] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
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

    return <SessionContext.Provider value={{ session, isLoading }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
