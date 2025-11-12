import React from "react";
import food from "../assets/food.png";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Supabase } from "../lib/supabaseClient";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);
  
  useEffect(() => {
    const fetchKinkuns = async () => {
      try {
        const { data, error } = await Supabase.from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน");
          console.error("Error fetching kinkuns:", error);
          return;
        }
        setKinkuns(data);
        console.log(data);
      } catch (ex) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน");
        console.error("Error fetching kinkuns:", ex);
      }
    };

    fetchKinkuns();
  }, []);

  const handleDeleteClick = async (id, food_image_url) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?',
      text: "ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเดี๋ยวนี้!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        // ลบรูปภาพจาก storage ถ้ามี
        if (food_image_url && food_image_url !== '') {
          const imageName = food_image_url.split('/').pop();
          const { error: storageError } = await Supabase.storage
            .from('kinkun_bk')
            .remove([imageName]);
          
          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
          }
        }

        // ลบข้อมูลในตาราง kinkun_tb
        const { error: dbError } = await Supabase
          .from('kinkun_tb')
          .delete()
          .eq('id', id);

        if (dbError) {
          alert('เกิดข้อผิดพลาดในการลบข้อมูล');
          console.error('Error deleting kinkun:', dbError);
          return;
        }

        // อัพเดต state
        setKinkuns(kinkuns.filter((kinkun) => kinkun.id !== id));
        Swal.fire('สำเร็จ!', 'ลบข้อมูลสำเร็จ', 'success');
      } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลการกิน
        </h1>
        <img src={food} alt="กินกัน" className="block mx-auto w-30 mt-5" />

        <div className="my-8 flex justify-end">
          <Link
            to="/Add"
            className="bg-blue-700 p-3 rounded text-white hover:bg-blue-800"
          >
            เพิ่มการกิน
          </Link>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-700 p-2">รูป</th>
              <th className="border border-gray-700 p-2">กินอะไร</th>
              <th className="border border-gray-700 p-2">กินที่ไหน</th>
              <th className="border border-gray-700 p-2">กินไปเท่าไหร่</th>
              <th className="border border-gray-700 p-2">วันไหน</th>
              <th className="border border-gray-700 p-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {kinkuns.map((kinkun) => (
              <tr key={kinkun.id}>
                <td className="border border-gray-700 p-2 text-center">
                  {kinkun.food_image_url == "" ||
                  kinkun.food_image_url == null ? (
                    "-"
                  ) : (
                    <img
                      src={kinkun.food_image_url}
                      alt={kinkun.food_name}
                      className="w-20 mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_name}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_where}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_pay}
                </td>
                <td className="border border-gray-700 p-2">
                  {new Date(kinkun.created_at).toLocaleDateString("th-TH")}
                </td>
                <td className="border border-gray-700 p-2">
                  <Link 
                    to={'/Edit/' + kinkun.id}
                    className="text-blue-500 underline hover:text-blue-700 cursor-pointer"

                  >
                    แก้ไข

                  </Link>
                  |
                  <button 
                    className="text-red-500 underline mx-2 hover:text-red-700 cursor-pointer" 
                    onClick={() => handleDeleteClick(kinkun.id, kinkun.food_image_url)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}