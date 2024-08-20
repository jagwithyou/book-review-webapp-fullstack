import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createUser } from "../services/userService";
import AlertMessage from "../components/AlertMessage";
import { useNavigate } from "react-router-dom";
import "../components/common.css";

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUser(fullName, displayName, email, password);
      setAlert({
        show: true,
        message: "User created successfully!",
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      setAlert({
        show: true,
        message: "Error creating user",
        variant: "danger",
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-4 min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Sign Up</Card.Title>
              <Form onSubmit={handleSignUp}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Sign Up
                </Button>
              </Form>
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {alert.show && (
        <AlertMessage
          show={alert.show}
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert({ show: false, message: "", variant: "" })}
        />
      )}
    </Container>
  );
}

export default SignUp;
