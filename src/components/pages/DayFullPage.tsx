import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import type Day from '../../interfaces/Day';
export default function DayFullPage() {
  const { dayId } = useParams();
  const [day, setDay] = useState<Day | null>(null);
  
  useEffect(()=>{
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/days/${dayId}`, ({
      method: 'GET',
      headers: {Authorization: `Bearer: ${token}`}
    }))
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
      setDay(data);
    })
  }, [])

  if(!day) return <div>Loading your day...</div>
  
  return (
    <div>Full day view for day</div>
  );
}