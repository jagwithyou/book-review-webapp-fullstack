import React, { useEffect, useState } from "react";
import BookGrid from "../components/Book/BookGrid";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";

function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) {
    return null;
  }
  return (
    <div className="container mt-4">
      <BookGrid />
    </div>
  );
}

export default HomePage;
