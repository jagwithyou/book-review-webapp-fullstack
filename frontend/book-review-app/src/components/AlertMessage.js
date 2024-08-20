import React, { useEffect, useState } from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";
import "./AlertMessage.css";

const AlertMessage = ({ show, onClose, message, variant }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <ToastContainer className="custom-toast-container" position="top-end">
      <Toast show={visible} bg={variant} className="slide-in">
        <Toast.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>{message}</div>
            <Button
              variant="link"
              onClick={handleClose}
              className="text-white p-0 ms-3"
              style={{ fontSize: "1.2rem", lineHeight: "1" }}
              aria-label="Close"
            >
              &times;
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AlertMessage;
