import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider( { children }){
    const router = useRouter();
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || "" : "";
    const isAuthenticated = user ? true : false;
    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
      // Obtener la ruta actual
      const path = router.pathname;

      // Verificar si la ruta actual es la de restablecer contraseña
      const isResetPasswordRoute = path.startsWith('/auth/resetPassword');

      // Solo redirigir si el usuario no está autenticado, no ha sido redirigido aún, y no está en la ruta de restablecer contraseña
      if (!isAuthenticated && !redirected && !isResetPasswordRoute) {
          router.push('/auth');
          setRedirected(true);
      }
    }, [isAuthenticated, redirected, router]);

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}