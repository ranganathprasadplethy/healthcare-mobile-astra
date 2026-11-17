import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getToken, setToken } from './storage';
import api from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { user, patient }
  const [loading, setLoading] = useState(true);

  const refresh = async () => setAuth((await api.get('/auth/me')).data);

  useEffect(() => {
    (async () => {
      try { if (await getToken()) await refresh(); }
      catch { await clearToken(); }
      setLoading(false);
    })();
  }, []);

  const start = async ({ token, ...session }) => {
    if (session.user.role !== 'patient') throw new Error('This app is for patients only. Please use the web app.');
    await setToken(token);
    setAuth(session);
  };
  const login = async (email, password) => start((await api.post('/auth/login', { email, password })).data);
  const register = async (form) => start((await api.post('/auth/register', form)).data);
  const logout = async () => { await clearToken(); setAuth(null); };

  return <AuthContext.Provider value={{ auth, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
