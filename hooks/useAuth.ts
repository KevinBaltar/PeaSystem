import { useState, useEffect } from "react";
import { createClient } from "../src/utils/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkSession();

    // Escutar mudanças na sessão (importante para OAuth)
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session);

        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name,
          });
          setAccessToken(session.access_token);
        } else {
          setUser(null);
          setAccessToken(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check error:", error);
        setUser(null);
        setAccessToken(null);
      } else if (data.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.name,
        });
        setAccessToken(data.session.access_token);
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name,
        });
        setAccessToken(data.session?.access_token || null);
      }

      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.name,
        });
        setAccessToken(data.session.access_token);
      }

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        // Provide helpful error message if Google OAuth is not configured
        if (
          error.message.includes("provider") ||
          error.message.includes("not enabled")
        ) {
          throw new Error(
            "Google OAuth não está configurado. Veja o arquivo GOOGLE_OAUTH_SETUP.md para instruções."
          );
        }
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    accessToken,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut,
  };
}
