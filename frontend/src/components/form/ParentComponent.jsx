import React, { useState } from 'react';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const ParentComponent = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    return (
        <div>
            {isLoginForm ? (
                <LoginForm toggleForm={toggleForm} />
            ) : (
                <ForgotPasswordForm toggleForm={toggleForm} />
            )}
        </div>
    );
};

export default ParentComponent;