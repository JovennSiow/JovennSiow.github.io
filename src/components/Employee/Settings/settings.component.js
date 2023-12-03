import axios from "axios";
import { Formik, Form, Field } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import {
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
import { schema, populateValues } from "../../Admin/constants";
import { Link } from "react-router-dom";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: JSON.parse(localStorage.getItem("user")) || null,
      initialValues: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeUser !== this.state.activeUser) {
      console.log(this.state.activeUser);
    }
  }

  initialiseValues = async () => {
    const { activeUser } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${activeUser._id}`
      );
      const populatedValues = populateValues(response.data);
      this.setState({ initialValues: populatedValues });
    } catch (err) {
      toast.error("Error retrieving user details!", err);
    }
  };

  updateUserDetails = async (values) => {
    const { activeUser } = this.state;
    const updatedDetails = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      role: values.role,
      shiftPerWeek: values.shiftPerWeek,
      password: values.password,
    };

    try {
      await axios
        .put(`http://localhost:5000/user/${activeUser._id}`, updatedDetails)
        .then((response) => {
          toast.success("User details updated successfully!");
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(response.data);
        })
        .catch((err) => {
          if (err.response) {
            toast.error(
              "Error updating user details!",
              err.response.data.error
            );
          }
        });
    } catch (err) {
      toast.error("Error updating user details!", err);
    }
  };

  componentDidMount() {
    document.title = "Settings | Roku";
    this.initialiseValues();
  }

  render() {
    const { activeUser, initialValues } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>Settings</CardHeader>
                <Formik
                  validateOnBlur
                  validateOnChange={false}
                  validationSchema={schema}
                  enableReinitialize={true}
                  initialValues={initialValues}
                  onSubmit={this.updateUserDetails}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <CardBody>
                        <Row className="mb-3">
                          <Col>
                            <div className="d-flex flex-column gap-1">
                              <span className="fw-bold">
                                Settings - Edit Account Information
                              </span>
                              <span>
                                Make changes to your information here.
                              </span>
                            </div>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col lg={4}>
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>First Name</Label>
                              <Field
                                name="firstName"
                                type="text"
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
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Last Name</Label>
                              <Field
                                name="lastName"
                                type="text"
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
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Username</Label>
                              <Field
                                name="username"
                                type="text"
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
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Email Address</Label>
                              <Field
                                name="email"
                                type="email"
                                placeholder="Enter Email Address"
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
                          <Col lg={4} hidden>
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Role</Label>
                              <Field
                                disabled
                                name="role"
                                type="text"
                                placeholder="Enter Role"
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
                          {activeUser.role === "Admin" ||
                          activeUser.role === "Manager" ||
                          activeUser.role === "Owner" ? (
                            <></>
                          ) : (
                            <Col lg={4} hidden>
                              <div className="d-flex flex-column gap-1">
                                <Label>Work Slots per Week</Label>
                                <Field
                                  name="shiftsPerWeek"
                                  type="number"
                                  placeholder="Enter Work Slots per Week"
                                  className={`form-control ${
                                    errors.shiftsPerWeek &&
                                    touched.shiftsPerWeek
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                />
                                {errors.shiftsPerWeek &&
                                  touched.shiftsPerWeek && (
                                    <FormFeedback type="invalid">
                                      {errors.shiftsPerWeek}
                                    </FormFeedback>
                                  )}
                              </div>
                            </Col>
                          )}
                        </Row>
                        <hr />
                        <Row className="mb-3">
                          <Col lg={4}>
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Password</Label>
                              <Field
                                name="password"
                                type="password"
                                placeholder="Enter Password"
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
                            <div className="d-flex flex-column gap-1 mb-3">
                              <Label>Confirm Password</Label>
                              <Field
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
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
                      </CardBody>
                      <CardFooter className="d-flex flex-row gap-3">
                        <Button color="primary" type="submit">
                          Save Changes
                        </Button>
                        <Link to="/profile">
                          <Button color="dark">Cancel</Button>
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

export default Settings;
