import { useState, useEffect } from "react";
import type Week from "../interfaces/Week";
import WeekDay from "./WeekDay";


export default function Week(){
    const [week, setWeek] = useState<Week | null>(null);

    useEffect(()=>{
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/weeks/current', {
        method: 'GET',
        headers: {
          'Content-type':'application/json',
          'Authorization':`Bearer: ${token}`
        }
      })
      .then((res)=>{
        return res.json();
      })
      .then((data)=>{
        setWeek(data);
        console.log(data);
      })
    }, [])

    if(!week){
      return <div>Loading your week...</div>
    }
    

    return(
      <div className="w-full flex justify-between items-center">
        {week.days.map((day)=>(
          <WeekDay day={day.dayOfWeek} percentage={0} key={day._id}/>
        ))}
      </div>
    )
}