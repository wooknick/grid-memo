import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Routes/Home";
import Header from "./Header";

const Router = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
