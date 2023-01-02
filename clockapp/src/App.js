import world from './img/earth-equirectangular.png';
import sun from './img/sun.png';
import './App.css';
import WorldMapImage from './components/WorldMapImage';
import Clock from './components/Clock';
import { useEffect, useState } from 'react';

const now = new Date();
const noon = new Date(/*year*/now.getFullYear(), /*monthIndex*/now.getMonth(), /*day*/now.getDay(), /*hours*/12);
const evening = new Date(/*year*/2022, /*monthIndex*/11, /*day*/20, /*hours*/19, 30);

const IncrementDate = (oldDateObj) => {
  const newDateObj = new Date(oldDateObj.getTime() + 1 * 60 * 1000);
  return newDateObj;
}
  function App() {
    const [date, setDate] = useState(() => now);
    // useEffect(() => {
    //   const interval = setTimeout(() => { setDate(IncrementDate(date)); }, 100);
    //   return () => { clearInterval(interval); };
    // }, [date]);
    return (
      <div className="App isColumn isPositionRelative">
        <Clock date={date} setDate={setDate} />
        <WorldMapImage earth={world} sun={sun} date={date} />
      </div>
    );
  }

  export default App;
