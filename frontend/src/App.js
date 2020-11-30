import './App.css';

import { FoodDisplay, UserSearch, RegisterForm, LoginForm } from './components';

function App() {
  return (
    <div className="App">
      <FoodDisplay />
      <UserSearch />
      <RegisterForm />
      <LoginForm />
    </div>
  );
}

export default App;
