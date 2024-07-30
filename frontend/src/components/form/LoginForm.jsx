/* <----------------------- FUNCIONES --------------------------> */
import { useState } from 'react';
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import { FormControl, FormGroup, InputLabel, OutlinedInput, InputAdornment, IconButton, Button } from '@mui/material';

/* <----------------------- ICONOS --------------------------> */
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

/* <----------------------- SERVICIOS  -----------------------> */
import { login } from "../../services/auth.service.js"

import ForgotPasswordForm from './ForgotPasswordForm';

const LoginForm = ({ toggleForm }) => {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [emailError, setEmailError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'email' && value.trim() !== '') {
            const isValidEmail = validateEmail(value);
            setEmailError(!isValidEmail);
        } else {
            setEmailError(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    const isSubmitDisabled = !validateEmail(credentials.email) || credentials.password === '';

    if (showForgotPassword) {
        return <ForgotPasswordForm />;
    }

    return (
        <div className='flex flex-col'>
            <div>
                <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
                    Inicia sesión
                </h1>
                <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
                    Inicia sesión con tu cuenta para acceder a todo el contenido de la plataforma.
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <FormControl component="fieldset" className='w-full'>
                    <FormGroup>
                        <FormControl variant="outlined" margin="normal">
                            <InputLabel error={emailError} htmlFor="email">Correo electrónico</InputLabel>
                            <OutlinedInput 
                                required
                                id="email"
                                name='email'
                                type="text"
                                label="Correo electrónico"
                                onChange={handleChange}
                                value={credentials.email}
                                error={emailError} 
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>}
                            />
                        </FormControl>

                        <FormControl variant="outlined" margin="normal">
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <OutlinedInput
                                required
                                id="password"
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                onChange={handleChange}
                                value={credentials.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>}
                            />
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled} className='mt-4 py-4 normal-case'>
                            Iniciar sesión
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>

            <Button
                color="secondary"
                onClick={() => setShowForgotPassword(true)}
                className='mt-2'
            >
                ¿Olvidaste tu contraseña?
            </Button>

            <div className="mt-4 text-sm">
                ¿No tienes una cuenta?
                <span className="underline cursor-pointer" onClick={toggleForm}>
                    Registrate
                </span>
            </div>
        </div>
    );
};

export default LoginForm;