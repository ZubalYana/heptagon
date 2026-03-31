interface WeekDayProps{
    day: string;
    percentage: number;
}
export default function WeekDay({day, percentage}: WeekDayProps){
    return(
        
        <div 
          className="
          lg:w-[140px] 
          w-full
          flex flex-col items-center
          gap-y-2
          "
        >
            <div
              className="
               lg:w-[90px] lg:h-[90px]
               w-[70px] h-[70px]
               bg-[#00FF26] 
               flex justify-center items-center
               rounded-full
               shadow-[0_0_10px_rgba(0,255,38,0.8),0_0_30px_rgba(0,255,38,0.4)]
              "
            >
               <div
               className="
                w-[75%] h-[75%]
                bg-[#151515]
                rounded-full
                flex justify-center items-center
                shadow-[inset_0_0_10px_rgba(0,255,38,0.7)]
                font-semibold
               "
            >
                {percentage}%
            </div>
          </div>
            <div
              className="
                lg:h-[180px] 
                w-full h-auto
                bg-[#1B1B1B] rounded-md"
            >
                
            </div>
            <h4 className="first-letter:uppercase">{day}</h4>
        </div>
    )
}