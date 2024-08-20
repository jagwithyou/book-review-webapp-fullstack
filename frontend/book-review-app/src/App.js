import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/homePage";
import BookDetails from "./pages/bookDetails";
import ProfilePage from "./pages/profilePage";
import SignUp from "./pages/signUp";
import Login from "./pages/loginPage";
import AddBook from "./pages/addBookPage";
import UpdateBook from "./pages/updateBook";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/update/:id" element={<UpdateBook />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
