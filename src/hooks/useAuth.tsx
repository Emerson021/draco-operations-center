
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  numero_placa: string;
  nome_completo: string;
  cargo: 'agente' | 'delegado';
  unidade: string;
  telefone?: string;
  email?: string;
  status_ativo: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile for:', session.user.id);
          // Fetch user profile with a small delay to ensure DB is ready
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              console.log('Profile fetch result:', { profileData, error });
              
              if (profileData) {
                setProfile(profileData);
              } else if (error) {
                console.error('Error fetching profile:', error);
                // Se o perfil não existe, tenta criar um básico
                if (error.code === 'PGRST116') {
                  console.log('Profile not found, will be created by trigger');
                }
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
            }
            setLoading(false);
          }, 100);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "Erro inesperado. Tente novamente.";
        
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "Email ou senha incorretos";
            break;
          case "Email not confirmed":
            errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
            break;
          case "Too many requests":
            errorMessage = "Muitas tentativas. Tente novamente em alguns minutos.";
            break;
          default:
            errorMessage = error.message;
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.id);
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao DRACO!"
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: "Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: { nome_completo?: string; numero_placa?: string; cargo?: 'agente' | 'delegado' }) => {
    try {
      setLoading(true);
      console.log('Attempting to sign up with:', email, userData);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        let errorMessage = "Erro no cadastro. Tente novamente.";
        
        switch (error.message) {
          case "User already registered":
            errorMessage = "Este email já está cadastrado";
            break;
          case "Password should be at least 6 characters":
            errorMessage = "A senha deve ter pelo menos 6 caracteres";
            break;
          default:
            errorMessage = error.message;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        console.log('User signed up successfully:', data.user.id);
        toast({
          title: "Cadastro realizado",
          description: "Conta criada com sucesso!"
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Sign out successful');
        toast({
          title: "Logout realizado",
          description: "Até a próxima!"
        });
      }
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isDelegado: profile?.cargo === 'delegado',
    isAgente: profile?.cargo === 'agente'
  };
};
