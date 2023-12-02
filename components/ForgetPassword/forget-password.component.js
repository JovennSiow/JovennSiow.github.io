import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      emailConfirmed: false,
      password: "",
      confirmPassword: "",
      user: {},
    };
  }

  componentDidMount() {
    document.title = "Forget Password | Roku";
  }

  // Check if entered username exists in the database
  // If yes, check if email matches the email associated with that username
  // If yes, update password

  handleInputChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleUsernameSubmit = (e) => {
    e.preventDefault();
    const username = e.target.value;
    this.checkUsername(username);
  };

  checkUsername = () => {
    const { username } = this.state;
    axios
      .get(`http://localhost:5000/user/search/${username}`)
      .then((response) => {
        if (response.data) {
          this.setState({ user: response.data });
          toast.success("User found!");
        } else {
          toast.error("User not found!");
        }
      })
      .catch((error) => {
        console.error("Error searching user:", error);
      });
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleEmailConfirmation = (event) => {
    event.preventDefault();
    const { user } = this.state;
    if (this.state.email === user.email) {
      toast.success("Email matches!");
      this.setState({ emailConfirmed: true });
      this.renderPasswordConfirmation();
    } else {
      toast.error("Email does not match!");
    }
  };

  renderEmailConfirmation = () => {
    const { user } = this.state;
    if (user && Object.keys(user).length !== 0) {
      // Check if the email entered matches the email associated with the username
      return (
        <Row>
          <Col>
            <hr />
            <form onSubmit={this.handleEmailConfirmation}>
              <div className="d-flex flex-column gap-1">
                <Label>
                  Confirm the email address belonging to this account.
                </Label>
                <Input
                  type="email"
                  placeholder="Confirm Email Address"
                  className="form-control"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
                <Button type="submit" color="dark">
                  Confirm Email
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleConfirmPasswordChange = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  resetPassword = (event) => {
    event.preventDefault();
    const { user, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
    } else {
      axios
        .put(`http://localhost:5000/forgot-password/${user._id}`, {
          password: password,
        })
        .then((response) => {
          toast.success("Password reset successfully!");
          window.location = "/login";
        })
        .catch((error) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            console.error("Error resetting password:", error);
          }
        });
    }
  };

  renderPasswordConfirmation = () => {
    const { emailConfirmed } = this.state;

    if (emailConfirmed) {
      return (
        <div className="d-flex flex-column gap-1">
          <hr />
          <form onSubmit={this.resetPassword}>
            <Row className="mb-3">
              <Col>
                <div>
                  <Label>Change Password</Label>
                  <Input
                    type="password"
                    className="form-control"
                    placeholder="Change Password"
                    onChange={this.handlePasswordChange}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={this.handleConfirmPasswordChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button type="submit" className="w-100" color="dark">
                  Change Password
                </Button>
              </Col>
            </Row>
          </form>
        </div>
      );
    } else return null;
  };

  render() {
    const { username } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-3">
            <Col className="d-flex flex-row justify-content-center align-items-center">
              <Card className="w-50 py-5">
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1 text-center">
                        <span className="fw-bold">Forgot your password?</span>
                        <span className="text-muted">
                          No problem. Just let us know your username.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <form onSubmit={this.handleUsernameSubmit}>
                        <div className="d-flex flex-column gap-1">
                          <Label>Username</Label>
                          <Input
                            type="text"
                            className="form-control"
                            placeholder="Enter Username"
                            value={username}
                            onChange={this.handleInputChange}
                          />
                          <Button color="dark" type="submit">
                            Look for User
                          </Button>
                        </div>
                      </form>
                    </Col>
                  </Row>
                  {this.renderEmailConfirmation()}
                  {this.renderPasswordConfirmation()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgetPassword;
