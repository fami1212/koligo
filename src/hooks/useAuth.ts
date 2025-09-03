import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, getCurrentProfile } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthUser extends User {
  profile?: Profile;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          try {
            const profile = await getCurrentProfile();
            setUser({ ...session.user, profile: profile || undefined });
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            setUser(session.user); // Set user without profile if profile fetch fails
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          try {
            const profile = await getCurrentProfile();
            setUser({ ...session.user, profile: profile || undefined });
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
            setUser(session.user); // Set user without profile
          }
        } else {
          setUser(null);
        }
        
        // Don't set loading to false here as it's handled by initial load
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'client' | 'transporteur';
  }) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role,
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.user.identities?.length) {
        toast.error('Un compte avec cet email existe déjà');
        return { data: null, error: new Error('User already exists') };
      }

      if (data.user && data.user.identities?.length) {
        toast.success('Compte créé avec succès! Vérifiez votre email.');
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Connexion réussie!');
      return { data, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Email ou mot de passe incorrect');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  const updateUser = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => prev ? { ...prev, profile: data } : null);
      toast.success('Profil mis à jour');
      return { data, error: null };
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  return {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser
  };
};