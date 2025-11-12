import React, { useState, useEffect } from 'react';
import food from '../assets/food.png';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Supabase } from '../lib/supabaseClient';

export default function Edit() {
  const { id } = useParams();

  const [food_name, setFood_name] = useState('');
  const [food_where, setFood_where] = useState('');
  const [food_pay, setFood_pay] = useState('');
  const [foodFile, setFoodFile] = useState(null);
  const [foodImageUrl, setFoodImageUrl] = useState('');
  const [oldImageUrl, setOldImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ดึงข้อมูลเดิมจาก Supabase เมื่อ component โหลด
  useEffect(() => {
    const fetchKinkun = async () => {
      try {
        const { data, error } = await Supabase
          .from("kinkun_tb")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          showWarningAlert('เกิดข้อผิดพลาดในการดึงข้อมูล');
          console.error('Error fetching kinkun:', error);
          setIsLoading(false);
          return;
        }

        // ตั้งค่าข้อมูลเดิมลงใน state
        setFood_name(data.food_name);
        setFood_where(data.food_where);
        setFood_pay(String(data.food_pay)); // Convert เป็น string สำหรับ input
        setFoodImageUrl(data.food_image_url || '');
        setOldImageUrl(data.food_image_url || '');
        setIsLoading(false);
      } catch (ex) {
        showWarningAlert('เกิดข้อผิดพลาด: ' + ex.message);
        console.error('Error:', ex);
        setIsLoading(false);
      }
    };

    fetchKinkun();
  }, [id]);

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

    let food_image_url = oldImageUrl; // ใช้รูปเดิมหากไม่มีการเลือกรูปใหม่

    // ถ้ามีการเลือกรูปใหม่
    if (foodFile) {
      try {
        // ลบรูปเดิมออก
        if (oldImageUrl && oldImageUrl !== '') {
          const oldImageName = oldImageUrl.split('/').pop();
          await Supabase.storage
            .from('kinkun_bk')
            .remove([oldImageName]);
        }

        // อัปโหลดรูปใหม่
        const newFileName = Date.now() + '_' + foodFile.name;
        
        const { error: uploadError } = await Supabase.storage
          .from('kinkun_bk')
          .upload(newFileName, foodFile);
        
        if (uploadError) {
          showWarningAlert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          return;
        }

        const { data } = Supabase.storage
          .from('kinkun_bk')
          .getPublicUrl(newFileName);
        
        food_image_url = data.publicUrl;
      } catch (error) {
        showWarningAlert('เกิดข้อผิดพลาด: ' + error.message);
        return;
      }
    }

    // อัปเดตข้อมูลในตาราง kinkun_tb
    try {
      const { error } = await Supabase
        .from('kinkun_tb')
        .update({
          food_name: food_name,
          food_where: food_where,
          food_pay: parseInt(food_pay), // Convert เป็น number
          food_image_url: food_image_url
        })
        .eq('id', id);

      if (error) {
        showWarningAlert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        console.error('Error updating kinkun:', error);
        return;
      }

      showSuccessAlert('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      showWarningAlert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className='w-10/12 mx-auto border-gray-300 p-4 shadow-md text-center'>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div> 
      <div className='w-10/12 mx-auto border-gray-300 p-4 shadow-md'>
        <h1 className='text-2xl font-bold text-center text-blue-700'> Kinkun APP (supabase)</h1>
        <h1 className='text-2xl font-bold text-center text-blue-700'> แก้ไขข้อมูลการกิน</h1>
        <img src={food} alt="กินกัน" className='block mx-auto w-30 mt-5'/>
        <form onSubmit={handleSaveClick}>
          <div className='mt-4'>
            <label>กินอะไร </label>
            <input value={food_name} onChange={(e) => setFood_name(e.target.value)} placeholder='เช่น pizza,KFC' 
            type='text' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div className='mt-4'>
            <label>กินที่ไหน </label>
            <input value={food_where} onChange={(e) => setFood_where(e.target.value)} placeholder='เช่น big C,เซ็นทรัล' 
            type='text' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div className='mt-4'>
            <label>กินไปเท่าไหร่ </label>
            <input value={food_pay} onChange={(e) => setFood_pay(e.target.value)} placeholder='เช่น 100,200,299,500' 
            type='number' className='border border-gray-400 w-full p-2 mt-1 rounded'/>
          </div>
          <div className='mt-4'>
            <label>รูปกิน? เลือกรูป </label>
            <input onChange={handleSelectImageAndPreview} type='file' className="hidden" id="selectImage" accept='image/*'/>
            <label htmlFor="selectImage" className='py-2 px-4 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white rounded block w-30 text-center mt-2'>
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
              บันทึกแก้ไขการกิน
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