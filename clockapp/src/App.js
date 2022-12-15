import world from './img/earth-equirectangular.png';
import sun from './img/sun.png';
import './App.css';
import WorldMapImage from './components/WorldMapImage';
import Clock from './components/Clock';
import { useState } from 'react';

function App() {
  const [date,setDate] = useState(()=> new Date());
  return (
    <div className="App isColumn isPositionRelative">
        <Clock date={date}/>
        <WorldMapImage earth={world} sun={sun} date={date}/>
      
    </div>
  );
}

export default App;
