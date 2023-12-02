import { Field, Form, Formik } from "formik";
import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Label,
  Row,
} from "reactstrap";
import { initialValues, schema } from "./constants";
import axios from "axios";
import { toast } from "react-toastify";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "Login | Roku";
  }

  handleSubmit = (values) => {
    axios
      .post("http://localhost:5000/login", values)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userObj", JSON.stringify(response.data.userObj));
        window.location.href = "/";
        toast.success("User logged in successfully!");
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Error logging in user!");
        }
      });
  };
  render() {
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col className="d-flex flex-row align-items-center justify-content-center">
              <Card className="w-50">
                <CardBody>
                  <Row className="my-3">
                    <Col>
                      <div className="d-flex flex-column gap-3 text-center my-3">
                        <span className="display-5">Welcome to Roku!</span>
                        <span>Please login to continue.</span>
                      </div>
                    </Col>
                  </Row>
                  <Formik
                    validateOnBlur
                    validateOnChange={false}
                    validationSchema={schema}
                    initialValues={initialValues}
                    onSubmit={this.handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <Row className="mb-3">
                          <Col>
                            <Label>Username</Label>
                            <Field
                              name="username"
                              placeholder="Enter Username"
                              type="text"
                              className={`form-control ${
                                errors.username && touched.username
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            {errors.username && touched.username && (
                              <FormFeedback type="invalid">
                                {errors.username}
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        <Row className="mb-5">
                          <Col>
                            <Label>Password</Label>
                            <Field
                              name="password"
                              placeholder="Enter Password"
                              type="password"
                              className={`form-control ${
                                errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            {errors.password && touched.password && (
                              <FormFeedback type="invalid">
                                {errors.password}
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col>
                            <Button
                              className="btn btn-dark w-100"
                              type="submit"
                            >
                              Login
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col>
                            <span className="me-1">Forgot password?</span>
                            <a href="/forget-password">Reset Password</a>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
