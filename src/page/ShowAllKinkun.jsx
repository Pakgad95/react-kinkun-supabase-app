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
    try {
      //โค้ดที่จะทำงานเมื่อมี effect เกิดขึ้นกับ คอมโพเนนต์นี้
      // ตัวอย่าง: ดึงข้อมูลจากdatabase หรือ ตั้งค่าการสมัครสมาชิก
      const fetchKinkuns = async () => {
        const { data, error } = await Supabase.from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน");
          console.error("Error fetching kinkuns:", error);
          return;
        }
        setKinkuns(data);

        console.log(data); // ดูข้อมูลใน console
        // หรือจะ setState เช่น setKinkuns(data);
      };

      fetchKinkuns();
    } catch (ex) {
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน");
      console.error("Error fetching kinkuns:", ex);
    }
  }, []);
  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          บันทึกการกิน
        </h1>
        <img src={food} alt="กินกัน" className="block mx-auto w-30 mt-5" />

        {/*ส่วนแสดงปุ่มเพิ่ม เพื่อเปืดหน้าจอ /addkinkun */}
        <div className="my-8 flex justify-end">
          <Link
            to="/addkinkun"
            className="bg-blue-700 p-3 rounded text-white
              hover:bg-blue-800"
          >
            เพิ่มการกิน
          </Link>
        </div>

        {/*ส่วนแสดงข้อมูลการกินทั้งหมดที่ดึงมาจาก supabase */}
        <table className="w-full border border-gray-700 text-sm ">
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
                  {new Date(kinkun.food_created_at).toLocaleDateString("th-TH")}
                </td>

                <td className="border border-gray-700 p-2">แก้ไข | ลบ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
