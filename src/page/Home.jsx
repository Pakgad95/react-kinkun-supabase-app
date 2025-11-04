import React from 'react'
import food from '../assets/food.png'
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Footer from '../components/Footer';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function Home() {
    const navigate = useNavigate();
    const [secureCode, setSecureCode] = useState('');

    const handleAcessAppclick = () => {
        if (secureCode === '') {
            alert ('กรุณากรอกรหัสเข้าใช้งาน');
             Swal.fire({
                icon: 'warning',
                iconColor: 'red',
                title: 'กรุณากรอกรหัสเข้าใช้งาน',
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
            return;
    }

    if (secureCode.toUpperCase() === 'SAU') {
        navigate ('/All');
    } else {
        alert ('รหัสไม่ถูกต้อง');
    
    }
    
}
  return (
    <div> 
        <div className='w-10/12 mx-auto border-gray-300 p-4 shadow-md'>Home</div>
        <h1 className='text-2xl font-bold text-center text-blue-700'> Kinkun APP (supabase)</h1>
        <h1 className='text-2xl font-bold text-center text-blue-700'> บันทึกการกิน</h1>
        <img src={food} alt="กินกัน"  className='block mx-auto w-30 mt-5'/>
        <input type="text" placeholder='Enter secure code'
        value={secureCode}
        onChange={(e) => setSecureCode (e.target.value)}
        className='p-3 border border-gray-400 round-md mt-5 w-full' />

        <button onClick={handleAcessAppclick} className=' w-full bg-blue-700 p-3 round-md text-white mt-5 curser-pointer hover:bg-blue-500'>
            เข้าใชงาน
        </button>
        <div className='mt-5 flex justify-center gap-5'>
            <a href="#"> <FaFacebook  className=' text-2xl text-gray-500 hover:text-red-500'/> </a>
            <a href="#"> < FaLine className=' text-2xl text-gray-500 hover:text-red-500'/></a>
            <a href="#"> < FaGithub className=' text-2xl text-gray-500 hover:text-red-500'/></a>
           

        </div>
        <Footer />

        </div>
   
  )
}
 