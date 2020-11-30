import { useState, useEffect } from 'react';
import { getFood } from '../api';

export default function FoodDisplay() {
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

