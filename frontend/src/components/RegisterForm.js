import { UsernamePasswordForm } from '../components';
import { register } from '../api';

export default function RegisterForm() {
  return <UsernamePasswordForm submit={register}>
    Regsiter
  </UsernamePasswordForm>;
}
