import world from './img/world.jpg'
import './App.css';
import WorldMapImage from './components/WorldMapImage';
import Clock from './components/Clock';
import { useState } from 'react';

function App() {
  const [date,setDate] = useState(()=> new Date());
  return (
    <div className="App isColumn">
        <Clock date={date}/>
        <WorldMapImage src={world} date={date}/>
      
    </div>
  );
}

export default App;
