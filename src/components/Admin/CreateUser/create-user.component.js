import { Formik, Form, Field } from "formik";
import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  FormFeedback,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { initialValues, schema } from "../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (values) => {
    const newUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
    };

    axios
      .post("http://localhost:5000/register", newUser)
      .then((response) => {
        console.log(response.data);
        toast.success("User registered successfully!");
        window.location.href = "/admin/users";
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Error registering user!");
        }
      });
  };

  componentDidMount() {
    document.title = "Register Staff | Roku";
  }

  render() {
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-3">
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Admin</BreadcrumbItem>
                <BreadcrumbItem active>Register Staff</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Card>
            <CardHeader>Register New Staff</CardHeader>
            <Formik
              validateOnBlur
              validateOnChange={false}
              validationSchema={schema}
              initialValues={initialValues}
              onSubmit={this.handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <CardBody>
                    <Row className="mb-3">
                      <Col>
                        <Label>First Name</Label>
                        <Field
                          name="firstName"
                          placeholder="Enter First Name"
                          type="text"
                          className={`form-control ${
                            errors.firstName && touched.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {errors.firstName && touched.firstName && (
                          <FormFeedback type="invalid">
                            {errors.firstName}
                          </FormFeedback>
                        )}
                      </Col>
                      <Col>
                        <Label>Last Name</Label>
                        <Field
                          name="lastName"
                          placeholder="Enter Last Name"
                          type="text"
                          className={`form-control ${
                            errors.lastName && touched.lastName
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {errors.lastName && touched.lastName && (
                          <FormFeedback type="invalid">
                            {errors.lastName}
                          </FormFeedback>
                        )}
                      </Col>
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
                    <Row className="mb-3">
                      <Col>
                        <Label>Email Address</Label>
                        <Field
                          name="email"
                          placeholder="Enter Email Address"
                          type="email"
                          className={`form-control ${
                            errors.email && touched.email ? "is-invalid" : ""
                          }`}
                        />
                        {errors.email && touched.email && (
                          <FormFeedback type="invalid">
                            {errors.email}
                          </FormFeedback>
                        )}
                      </Col>
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
                      <Col>
                        <Label>Confirm Password</Label>
                        <Field
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          type="password"
                          className={`form-control ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <FormFeedback type="invalid">
                            {errors.confirmPassword}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter className="d-flex flex-row gap-3">
                    <Button type="submit" className="btn btn-primary">
                      Register
                    </Button>
                    <Link to="/admin/users">
                      <Button type="button" className="btn btn-secondary">
                        Cancel
                      </Button>
                    </Link>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </div>
    );
  }
}

export default CreateUser;