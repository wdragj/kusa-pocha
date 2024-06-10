import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

export const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
  });

  if (error) {
    console.error("Error logging in with Kakao:", error);
  } else {
    console.log("Successfully logged in with Kakao:", data);
  }
};
