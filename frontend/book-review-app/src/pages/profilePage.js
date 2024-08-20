import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { getUserDetails, updateUser } from "../services/userService";
import AlertMessage from "../components/AlertMessage";
import "../components/common.css";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        console.log(userData);
        setFullName(userData.full_name);
        setDisplayName(userData.display_name);
        setEmail(userData.email);
      } catch (error) {
        setAlert({
          show: true,
          message: "Error fetching user data",
          variant: "danger",
        });
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (password !== "") {
        await updateUser(fullName, displayName, email, password);
        setIsEditing(false);
        setAlert({
          show: true,
          message: "Profile updated successfully!",
          variant: "success",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "Error updating profile",
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
              <Card.Title className="text-center mb-4">
                {isEditing ? "Edit Profile" : "Profile"}
              </Card.Title>
              <Form onSubmit={handleSave}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                  />
                </Form.Group>

                <Form.Group controlId="formDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!isEditing}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isEditing}
                  />
                </Form.Group>

                {!isEditing ? (
                  <Button
                    variant="primary"
                    onClick={handleEdit}
                    className="w-100 mt-3"
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Save
                  </Button>
                )}
              </Form>
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

export default ProfilePage;
