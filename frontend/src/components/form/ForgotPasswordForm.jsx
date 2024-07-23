import { useState } from 'react';
import { FormControl, FormGroup, InputLabel, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { forgotPassword } from "../../services/auth.service.js";

const ParentComponent = () => {
    const [isLogin, setIsLogin] = useState(true); // Estado para controlar qué formulario mostrar

    const toggleForm = () => {
        setIsLogin(!isLogin); // Cambia el estado para alternar entre los formularios
    };

    return (
        <div>
            {isLogin ? (
                <LoginForm toggleForm={toggleForm} />
            ) : (
                <ForgotPasswordForm toggleForm={toggleForm} />
            )}
        </div>
    );
};

const ForgotPasswordForm = ({ toggleForm }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword({ email });
            alert("Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.");
        } catch (error) {
            console.error("Error al solicitar el restablecimiento de contraseña", error);
        }
    };

    return (
        <div className='flex flex-col'>
            <div>
                <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
                    Restablecer contraseña
                </h1>
                <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
                    Ingresa tu correo electrónico para recibir un enlace de restablecimiento.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <FormControl component="fieldset" className='w-full'>
                    <FormGroup>
                        <FormControl variant="outlined" margin="normal">
                            <InputLabel htmlFor="email">Correo electrónico</InputLabel>
                            <OutlinedInput
                                required
                                id="email"
                                name='email'
                                type="email"
                                label="Correo electrónico"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>}
                            />
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" className='mt-4 py-4 normal-case'>
                            Solicitar restablecimiento de contraseña
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>

            <Button
                color="secondary"
                onClick={() => toggleForm()}
                className='mt-2'
            >
                Volver al inicio de sesión
            </Button>
        </div>
    );
};

export default ForgotPasswordForm;
export { ParentComponent };