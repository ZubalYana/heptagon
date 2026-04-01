import { useState } from 'react';
import Input from "../customElements/Input"
import PrimaryButton from '../customElements/PrimaryButton';
export default function AuthPage(){
    const [mode, setMode] = useState<'login' | 'signup'>('login')

    return(
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <h1 className="text-[18px] font-medium lg:text-[32px]">Strike the 100% every day.</h1>
            <p className="text-[14px] font-light lg:text-[16px]">Visual Plan View - planning less, doing more, achieving higher.</p>
            <div 
              className="
              w-full h-auto p-[10px] mt-[20px] 
              lg:w-[400px] lg:mt-[30px] lg:p-[20px]
              bg-[#1B1B1B] rounded-md"
            >
                {mode == 'login'?
                 <div className='w-full flex flex-col items-center'>
                    <Input placeholder='Email'/>
                    <div className='mt-3 w-full'>
                      <Input placeholder='Password' isSecret={true}/>
                    </div>
                    <div className='w-full mt-6 flex flex-col items-center'>
                      <PrimaryButton children={'Log in'} className='w-[55%]'/>
                      <p
                        className='
                        text-[#707070] font-semibold text-[14px] 
                        cursor-pointer mt-2
                        hover:text-[#c4c4c4] hover:scale-97
                        transition-all duration-300'
                        onClick={()=>{setMode('signup')}}
                      >Sign up</p>
                    </div>
                 </div> :
                 <div className='w-full flex flex-col items-center'>
                    <Input placeholder='Name'/>
                    <div className='mt-3 w-full'>
                      <Input placeholder='Email'/>
                    </div>
                    <div className='mt-3 w-full'>
                    <Input placeholder='Password' isSecret={true}/>
                    </div>
                    <div className='w-full mt-6 flex flex-col items-center'>
                      <PrimaryButton children={'Sign up'} className='w-[55%]'/>
                      <p
                        className='
                        text-[#707070] font-semibold text-[14px] 
                        cursor-pointer mt-2
                        hover:text-[#c4c4c4] hover:scale-97
                        transition-all duration-300'
                        onClick={()=>{setMode('login')}}
                      >Log in</p>
                    </div>
                 </div>
                 
                }
            </div>
        </div>
    )
}