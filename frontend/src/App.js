import './App.css';
import { useEffect, useState } from 'react';
import { getFood, getAccount, register, login, saveFood } from './api';

function UserSearch() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState();
  return (<>
    <h2>User Search</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      setSearchResults(undefined);
      getAccount(search).then(val => setSearchResults(val));
    }}>
      <input type="text" placeholder="username" value={search} onChange={e => setSearch(e.target.value)}/>
      <input type="submit" value="Search" />
    </form>
    { searchResults && searchResults.map(({name, emoji }) => 
      <p key={name}>
       {emoji} {name}
      </p>
    )}
    { searchResults && searchResults.length === 0 && 
        <p>Nothing found.</p>
    }
  </>);
}

function FoodDisplay() {
  const [food, setFood] = useState();
  useEffect(() => {
    getFood().then(val => setFood(val));
  }, []);
  return (<>
    <h1>Food</h1>
    { food && food.map(({name, emoji, popularity}) => 
      <div key={name}>
       {emoji} {name} - {popularity} people like this.
      </div>
    )}
  </>);
}

function ValidatorErrors({errors}) {
  return (<>
    { errors && errors.map(({param, msg}, idx) => 
      <p key={idx}> Issue with {param}: {msg} </p>
    )}
  </>);
}

function RegisterForm() {
  return <UsernamePasswordForm submit={register}>
    Regsiter
  </UsernamePasswordForm>;
}
function LoginForm() {
  return <UsernamePasswordForm submit={login}>
    Login
  </UsernamePasswordForm>;
}
function UsernamePasswordForm({submit, children}) {
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

function SaveFood() {
  const [name, setName] = useState('');
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  return (<>
    <h2>Save Food</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      saveFood(name)
        .then(() => {
          setSuccess(true)
          setError(undefined)
        })
        .catch(error => {
          setSuccess(false)
          setError(error)
        });
    }}>
      <input type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)}/>
      <br />
      <input type="submit" value="Save" />
    </form>
    <ValidatorErrors {...error} />
    { error && error.message && <p> {error.message} </p> }
    { success && <p>Success :)</p> }
  </>);
}

function App() {
  return (
    <div className="App">
      <FoodDisplay />
      <UserSearch />
      <RegisterForm />
      <LoginForm />
      <SaveFood />
    </div>
  );
}

export default App;
