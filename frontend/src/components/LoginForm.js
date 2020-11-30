import { UsernamePasswordForm } from '../components';
import { login } from '../api';

export default function LoginForm() {
  return <UsernamePasswordForm submit={login}>
    Login
  </UsernamePasswordForm>;
}
