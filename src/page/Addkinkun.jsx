import React, { useState } from 'react';
import food from '../assets/food.png';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Supabase } from '../lib/supabaseClient';

export default function Addkinkun() {
  const [food_name, setFood_name] = useState('');
  const [food_where, setFood_where] = useState('');
  const [food_pay, setFood_pay] = useState('');
  const [foodFile, setFoodFile] = useState(null);
  const [foodImageUrl, setFoodImageUrl] = useState('');

  // สร้างฟังก์ชั่น warning alert
  const showWarningAlert = (msg) => {
    Swal.fire({
      icon: 'warning',
      iconColor: 'red',
      title: msg,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    });
  };

  const showSuccessAlert = (msg) => {
    Swal.fire({
      icon: 'success',
      iconColor: 'green',
      title: msg,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    }).then(() => {
      document.location.href = '/All';
    });
  };

  // สร้างฟังชั่นเลือกรูป
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFoodFile(file);
      setFoodImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    if (food_name.trim().length === 0) {
      showWarningAlert('กรุณากรอกข้อมูล กินอะไร'); 
      return;
    } else if (food_where.trim().length === 0) {
      showWarningAlert('กรุณากรอกข้อมูล กินที่ไหน'); 
      return;
    } else if (food_pay === undefined || food_pay === '') {
      showWarningAlert('กรุณากรอกข้อมูล กินไปเท่าไหร่'); 
      return;
    }

    let food_image_url = '';

    if (foodFile) {
      // โค้ดสำหรับอัปโหลดไฟล์ไปยัง Supabase หรือที่อื่น ๆ
      const newFileName = Date.now() + '_' + foodFile.name; // แก้ไขเป็น Date.now()
      
      const { error } = await Supabase.storage
        .from('kinkun_bk')
        .upload(newFileName, foodFile);
      
      if (error) {
        showWarningAlert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        return;
      }

      const { data } = Supabase.storage
        .from('kinkun_bk')
        .getPublicUrl(newFileName);
      
      food_image_url = data.publicUrl;
    }

    // บันทึกข้อมูลลงฐานข้อมูล Supabase

  
    showSuccessAlert('บันทึกข้อมูลสำเร็จ');

    //บันทึกลงtable
    const {error} = await Supabase.from('kinkun_tb').insert ({
      food_name : food_name,
      food_where : food_where,
      food_pay : food_pay,
      food_image_url : food_image_url
    })
    if (error) {
      showWarningAlert ('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      return;
    }
    showSuccessAlert ('บันทึกข้อมูลสำเร็จ')
    //document.location.href = '/All';


    //ลบข้อมูลในฟอร์ม
   
  
  };

  return (
    <div> 
      <div className='w-10/12 mx-auto border-gray-300 p-4 shadow-md'>
        <h1 className='text-2xl font-bold text-center text-blue-700'> Kinkun APP (supabase)</h1>
        <h1 className='text-2xl font-bold text-center text-blue-700'> บันทึกการกิน</h1>
        <img src={food} alt="กินกัน" className='block mx-auto w-30 mt-5'/>
        <form onSubmit={handleSaveClick}>
          <div>
            <label>กินอะไร </label>
            <input value={food_name} onChange={(e) => setFood_name(e.target.value)} placeholder='เช่น pizza,KFC' 
            type='text' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div>
            <label>กินที่ไหน </label>
            <input value={food_where} onChange={(e) => setFood_where(e.target.value)} placeholder='เช่น big C,เซ็นทรัล' 
            type='text' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div>
            <label>กินไปเท่าไหร่ </label>
            <input value={food_pay} onChange={(e) => setFood_pay(e.target.value)} placeholder='เช่น 100,200,299,500' 
            type='number' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div>
            <label>รูปกิน? เลือกรูป </label>
            <input onChange={handleSelectImageAndPreview} type='file' className="hidden" id="selectImage"/>
            <label htmlFor="selectImage" className='py-2 px-4 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white rounded block w-30 text-center'>
              เลือกรูป
            </label>
            <div className='mt-3'> 
              {foodImageUrl && 
                <img src={foodImageUrl} alt="preview" className='w-40'/>
              }
            </div>
          </div>
          <div className='mt-4'>
            <button type="submit" className='w-full bg-blue-500 p-3 rounded-md text-white mt-5 cursor-pointer hover:bg-blue-700'>
              บันทึกข้อมูลการกิน
            </button>
          </div>
        </form>
        <div>
          <Link to="/All" className='block mt-5 text-center text-blue-700 hover:underline'>
            กลับไปหน้าข้อมูลการกิน
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}