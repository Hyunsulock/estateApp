import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthData = {
  session: Session | null;
  profile: any,
  loading: boolean;
  setProfile: any, 
  setChecking: any,
  setSession: any,

};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  setProfile: null,
  setChecking: null,
  setSession : null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(null);
  const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        // fetch profile
        console.log('seion')
        console.log('profile',profile)
        console.log('checking', !profile)

        console.log('dad')
          const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

          console.log('data_profile1', data)
          setProfile(data);
          console.log(profile)

          /*
          while (!profile) {
              console.log(profile)
                const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
                if (error) {
                    console.error('Error fetching profile:', error);
                } else {
                    console.log(data)
                    setProfile({...data});
                    console.log(profile) // Set the profile if data exists
                }
            }
          */
        
      }
      setLoading(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [checking]);

  return (
    <AuthContext.Provider
      value={{ session, loading, profile, setProfile, setChecking, setSession}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);