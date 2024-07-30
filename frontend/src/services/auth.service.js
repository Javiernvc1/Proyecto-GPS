/* <----------------------- MODULOS --------------------------> */
import axios from './root.service';
import cookies from 'js-cookie';

/* <----------------------- FUNCIONES --------------------------> */
import { jwtDecode } from 'jwt-decode';

export const login = async( { email, password } ) => {
    try {
        const response = await axios.post('auth/login', {
            email,
            password
        });

        const { status, data } = response;
        if (status === 200) {
            const { email, role, id } = await jwtDecode(data.data.accessToken);
            localStorage.setItem('user', JSON.stringify( { email, role, id } ));
            axios.defaults.headers.common[ 'Authorization'] = `Bearer ${ data.data.accessToken }`;
            cookies.set('jwt-auth', data.data.accessToken, { path: '/' });
        }
        console.log("Has iniciado sesion.");
    } catch (error) {
        console.log("No pudiste iniciar sesion.");
        console.log(error);
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    cookies.remove('jwt-auth');
};

export const forgotPassword = async({ email }) => {
    try {
        await axios.post('auth/forgotPassword', { email });
        console.log("Solicitud de restablecimiento de contraseña enviada.");
    } catch (error) {
        console.error("Error al enviar la solicitud de restablecimiento de contraseña", error);
    }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        console.error("Las contraseñas no cumplen con los requisitos o no coinciden.");
        return; // Detiene la ejecución si hay un problema con las contraseñas
    }

    try {
        await axios.post(`auth/resetPassword/${token}`, { newPassword, confirmPassword });
        console.log("Contraseña restablecida con éxito.");
    } catch (error) {
        console.error("Error al restablecer la contraseña", error);
        throw error; // Lanza el error para manejarlo en el componente que llama a esta función
    }
};