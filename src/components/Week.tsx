import WeekDay from "./WeekDay"
export default function Week(){
    return(
      <div className="w-full flex justify-between items-center">
        <WeekDay day="Monday" percentage={90}/>
        <WeekDay day="Tuesday" percentage={70}/>
        <WeekDay day="Wednesday" percentage={100}/>
        <WeekDay day="Thursday" percentage={85}/>
        <WeekDay day="Friday" percentage={100}/>
        <WeekDay day="Saturday" percentage={100}/>
        <WeekDay day="Sunday" percentage={80}/>
      </div>
    )
}