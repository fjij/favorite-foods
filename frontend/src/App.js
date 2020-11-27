import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [food, setFood] = useState();
  useEffect(async () => {
    const response = await axios.get('/api/food');
    setFood(response.data);
  }, []);
  return (
    <div className="App">
      <h1>Food</h1>
      { food && food.map(({name, emoji, popularity}) => 
        <div key={name}>
         {emoji} {name} - {popularity} people like this.
        </div>
      )}
    </div>
  );
}

export default App;
