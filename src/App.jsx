import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import ShowAllKinkun from "./page/ShowAllKinkun";
import Addkinkun from "./page/Addkinkun";
import Edit from "./page/Edit";

export default function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/All" element={<ShowAllKinkun />} />
          <Route path="/Add" element={<Addkinkun />} />
          <Route path="/Edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}