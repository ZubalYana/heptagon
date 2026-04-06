import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeksProps{
    weekNumber: number;
    year: number;
    startDate: Date | string;
    endDate: Date | string;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

export default function WeeksSwitch({weekNumber, year, startDate, endDate}: WeeksProps){

    return(
        <div className='lg:mt-10 flex gap-x-4 items-center'>
            <ChevronLeft className='cursor-pointer'/>
            <div className='flex flex-col items-center'>
                <h4 className='lg:text-[20px] font-medium'>Week {weekNumber} of {year}</h4>
                <p className='lg:text-[14px] font-normal'>{formatDate(startDate)} - {formatDate(endDate)}</p>
            </div>
            <ChevronRight className='cursor-pointer'/>
        </div>
    )
}