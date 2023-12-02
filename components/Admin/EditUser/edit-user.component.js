import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  FormFeedback,
  Label,
  Row,
} from "reactstrap";
import { initialValues, schema, populateValues } from "../constants";
import axios from "axios";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userId: null,
      initialValues: {},
    };
  }

  initialiseValues = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${this.state.userId}`
      );
      const populatedValues = populateValues(response.data);
      this.setState({ initialValues: populatedValues });
    } catch (err) {
      toast.error("Error retrieving user!");
      console.error(err);
    }
  };

  handleSubmit = (values) => {
    const updatedUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role,
    };
    try {
      axios.put(`http://localhost:5000/user/${this.state.userId}`, updatedUser);
      toast.success("User updated successfully!");
      window.location.href = "/admin/users";
    } catch (err) {
      toast.error("Error updating user!");
      console.error(err);
    }
  };

  componentDidMount() {
    const userId = this.props.params.id;
    this.setState({ userId: userId }, () => {
      this.initialiseValues();
    });
    document.title = "Edit User | Roku";
  }

  render() {
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Admin</BreadcrumbItem>
                <BreadcrumbItem>Edit User</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader className="h5 py-3">Edit User</CardHeader>
                <Formik
                  validateOnBlur
                  validateOnChange={false}
                  validationSchema={schema}
                  initialValues={this.state.initialValues}
                  enableReinitialize={true}
                  onSubmit={this.handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <CardBody>
                        <Row className="mb-3">
                          <Col lg={4}>
                            <div>
                              <Label>First Name</Label>
                              <Field
                                name="firstName"
                                placeholder="Enter First Name"
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
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label>Last Name</Label>
                              <Field
                                name="lastName"
                                placeholder="Enter Last Name"
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
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label>Username</Label>
                              <Field
                                name="username"
                                placeholder="Enter Username"
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
                            </div>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col lg={4}>
                            <div>
                              <Label>Email Address</Label>
                              <Field
                                name="email"
                                placeholder="Enter Email"
                                className={`form-control ${
                                  errors.email && touched.email
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {errors.email && touched.email && (
                                <FormFeedback type="invalid">
                                  {errors.email}
                                </FormFeedback>
                              )}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label>Password</Label>
                              <Field
                                name="password"
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
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label>Confirm Password</Label>
                              <Field
                                name="confirmPassword"
                                type="password"
                                className={`form-control ${
                                  errors.confirmPassword &&
                                  touched.confirmPassword
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {errors.confirmPassword &&
                                touched.confirmPassword && (
                                  <FormFeedback type="invalid">
                                    {errors.confirmPassword}
                                  </FormFeedback>
                                )}
                            </div>
                          </Col>
                        </Row>
                        <Row className="mb-3" hidden>
                          <Col lg={4}>
                            <div>
                              <Label>Role</Label>
                              <Field
                                name="role"
                                className={`form-control ${
                                  errors.role && touched.role
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {errors.role && touched.role && (
                                <FormFeedback type="invalid">
                                  {errors.role}
                                </FormFeedback>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="d-flex flex-row gap-3">
                        <Button type="submit" color="primary">
                          Save User
                        </Button>
                        <Link to="/admin/users">
                          <Button type="button" color="secondary">
                            Cancel
                          </Button>
                        </Link>
                      </CardFooter>
                    </Form>
                  )}
                </Formik>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouteParams(EditUser);
