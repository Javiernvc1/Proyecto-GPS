// pages/auth/resetPassword/[token].jsx
import { useRouter } from 'next/router';
import ResetPasswordForm from '../../../components/form/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;