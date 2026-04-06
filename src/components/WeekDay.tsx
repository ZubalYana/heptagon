import CircularProgressbar from "./CircularProgressbar";

interface WeekDayProps{
    day: string;
    date: Date | string;
    percentage: number;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

export default function WeekDay({day, date, percentage}: WeekDayProps){
    return(
        
        <div 
          className="
          lg:w-[140px] 
          w-full
          flex flex-col items-center
          "
        >
            <CircularProgressbar percentage={percentage} />
            <div
              className="
                lg:h-[120px] mt-4
                w-full h-auto
                bg-[#1B1B1B] rounded-md"
            >
            </div>
            <h4 className="first-letter:uppercase mt-2">{day}</h4>
            <p className="text-[12px] font-light text-[#ccc] -mt-[4px]">{formatDate(date)}</p>
        </div>
    )
}