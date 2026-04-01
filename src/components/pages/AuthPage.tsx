import { useState } from 'react';
import Input from "../customElements/Input"
export default function AuthPage(){
    const [mode, setMode] = useState('login')
    //dubug line
    setMode('login')
    return(
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <h1 className="text-[18px] font-medium lg:text-[32px]">Strike the 100% every day.</h1>
            <p className="text-[14px] font-light lg:text-[16px]">Visual Plan View - planning less, doing more, achieving higher.</p>
            <div 
              className="
              w-full h-auto p-[10px] mt-[20px] 
              lg:w-[400px] lg:h-[350px] lg:mt-[30px] lg:p-[20px]
              bg-[#1B1B1B] rounded-md"
            >
                {mode == 'login'?
                 <div>
                    <Input placeholder='Email'/>
                    <div className='mt-3'>
                      <Input placeholder='Password' isSecret={true}/>
                    </div>
                 </div> :
                 <div>register stuff</div>
                 
                }
            </div>
        </div>
    )
}