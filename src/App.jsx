import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import All from "./page/ShowAllKinkun";
import Add from "./page/Addkinkun";
import Edit from "./page/Edit";

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Add" element={<Add/>} />
        <Route path="/Edit" element={<Edit/>} />
        <Route path="/All" element={<All/>} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}
