import './App.css'
import {useState, useEffect} from 'react';
import WeekPage from './components/pages/WeekPage'
import AuthPage from './components/pages/AuthPage'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if(savedToken && savedUser){
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //To be replaced with a proper loader later
  if (loading) return <div>Loading...</div>

  return (
    <div className='w-full h-full p-[20px] lg:p-[40px] flex justify-center items-center'>
      {user? 
      <WeekPage/>:
      <AuthPage/>
      }
    </div>
  )
}

export default App
