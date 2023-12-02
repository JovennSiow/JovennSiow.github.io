import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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
import { Formik, Form, Field } from "formik";
import { roleSchema, populateRoleValues } from "./constants";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      profile: {},
      initialValues: {},
    };
  }

  componentDidMount() {
    document.title = "Update Profile | Roku";
    const id = this.props.params.id; // Access id from the route params
    this.setState({ id }, () => {
      this.loadProfile();
    });
  }

  loadProfile = async () => {
    const { id } = this.state;

    try {
      const response = await axios.get(`http://localhost:5000/profile/${id}`);
      const profile = response.data;
      this.setState({
        profile: profile,
        initialValues: populateRoleValues(profile.role),
      });
    } catch (err) {
      console.error(err);
    }
  };

  updateRoleDetails = async (values) => {
    const { profile } = this.state;
    const updatedRole = {
      role: values.role,
      roleDescription: values.roleDescription,
    };
    try {
      await axios
        .put(`http://localhost:5000/role/${profile?.role?._id}`, updatedRole)
        .then((response) => {
          toast.success("Role updated successfully!");
          console.log(response.data);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error("Error updating role.");
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { initialValues } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>Profile Update</CardHeader>
                <Formik
                  validateOnBlur
                  validateOnChange={false}
                  validationSchema={roleSchema}
                  initialValues={initialValues}
                  enableReinitialize={true}
                  onSubmit={this.updateRoleDetails}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <CardBody>
                        <Row className="mb-3" hidden>
                          <Col>
                            <div className="d-flex flex-column gap-1">
                              <Label>Role</Label>
                              <Field
                                name="role"
                                placeholder="Enter Role Name"
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
                        <Row className="mb-3">
                          <Col>
                            <div className="d-flex flex-column gap-1">
                              <Label>Role Description</Label>
                              <Field
                                name="roleDescription"
                                component="textarea"
                                placeholder="Enter Role Description"
                                className={`form-control ${
                                  errors.roleDescription &&
                                  touched.roleDescription
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {errors.roleDescription &&
                                touched.roleDescription && (
                                  <FormFeedback type="invalid">
                                    {errors.roleDescription}
                                  </FormFeedback>
                                )}
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="d-flex flex-row gap-3">
                        <Link to="/admin/profiles">
                          <Button type="button" color="dark">
                            Cancel
                          </Button>
                        </Link>

                        <Button type="submit" color="primary">
                          Save Changes
                        </Button>
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

export default withRouteParams(EditProfile);
