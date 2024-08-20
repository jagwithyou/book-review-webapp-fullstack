import React from "react";
import { Container } from "react-bootstrap";
import "./common.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-3 mt-4">
      <Container className="text-center">
        <p className="mb-0">© 2024 Book Review App. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;
