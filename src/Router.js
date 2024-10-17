// Filename - RoutePage.js

import React from "react";
import { Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import HomePage from "./App";
import Details from "./Details";
import BooksDetail from "./BooksDetail"; // Import the BooksDetail component

function RoutePage() {
    return (
        <>
           <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Details/:userId" element={<Details />} />
              <Route path="/books/:bookId" element={<BooksDetail />} /> {/* Add route for BooksDetail */}
           </Routes>
        </>
     );
}

export default RoutePage;

