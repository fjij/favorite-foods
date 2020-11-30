import { useState } from 'react';
import { ValidatorErrors } from '../components';

export default function UsernamePasswordForm({submit, children}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  return (<>
    <h2>{children}</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      submit(username, password)
        .then(() => {
          setSuccess(true)
          setError(undefined)
        })
        .catch(error => {
          setSuccess(false)
          setError(error)
        });
    }}>
      <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)}/>
      <br />
      <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
      <br />
      <input type="submit" value={children} />
    </form>
    <ValidatorErrors {...error} />
    { error && error.message && <p> {error.message} </p> }
    { success && <p>Success :)</p> }
  </>);
}
