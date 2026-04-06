import { useState, useEffect } from "react";
import type InterfaceWeek from "../../interfaces/Week";
import Week from "../Week";
import WeeksSwitch from "../WeeksSwitch";

export default function WeekPage() {
  const [week, setWeek] = useState<InterfaceWeek | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/weeks/current", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer: ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setWeek(data);
        console.log(data);
      });
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Week week={week} />
      {week && (
        <WeeksSwitch
          weekNumber={week.weekNumber}
          year={week.year}
          startDate={week.startDate}
          endDate={week.endDate}
        />
      )}
    </div>
  );
}
