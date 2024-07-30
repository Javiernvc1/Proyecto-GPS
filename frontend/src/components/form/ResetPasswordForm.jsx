import { useState } from 'react';
import { useRouter } from 'next/router';
import { FormControl, InputLabel, OutlinedInput, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from "../../services/auth.service.js"; 

const ResetPasswordForm = () => {
    const router = useRouter();
    const { token } = router.query;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        try {
            await resetPassword(token, password, confirmPassword);
            alert("Tu contraseña ha sido restablecida exitosamente.");
            router.push('/auth');
        } catch (error) {
            console.error("Error al restablecer la contraseña", error);
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='py-12 px-12 bg-white rounded-2xl shadow-xl z-20'>
                <div className='flex flex-col items-center'>
                    <h1 className="text-3xl font-bold text-center mb-4">Restablecer contraseña</h1>
                    <form onSubmit={handleSubmit} className="w-full max-w-xs">
                        <FormControl variant="outlined" margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Nueva contraseña</InputLabel>
                            <OutlinedInput
                                required
                                id="password"
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                label="Nueva contraseña"
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl variant="outlined" margin="normal" fullWidth>
                            <InputLabel htmlFor="confirmPassword">Confirmar contraseña</InputLabel>
                            <OutlinedInput
                                required
                                id="confirmPassword"
                                name='confirmPassword'
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Confirmar contraseña"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" className="mt-4 py-2 normal-case">
                            Restablecer contraseña
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;