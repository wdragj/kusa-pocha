import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  } else {
    console.log("Successfully signed out");
  }
};
