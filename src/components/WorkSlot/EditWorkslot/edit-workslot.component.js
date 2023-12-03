import { Field, Form, Formik } from "formik";
import React, { Component } from "react";
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
import { workSlotSchema, populateWorkSlotValues } from "./constants";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class EditWorkslot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      workSlot: {},
      initialValues: {},
    };
  }

  componentDidMount() {
    document.title = "Edit Work Slot - Roku";
    const id = this.props.params.id;
    this.setState({ id }, () => {
      this.loadWorkSlot();
    });
  }

  loadWorkSlot = async () => {
    const { id } = this.state;
    try {
      const response = await axios.get(`http://localhost:5000/work-slot/${id}`);
      const workSlot = response.data;
      this.setState({
        workSlot: workSlot,
        initialValues: populateWorkSlotValues(workSlot.role),
      });
    } catch (err) {
      console.error(err);
    }
  };

  updateWorkSlotDetails = async (values) => {
    const { id } = this.state;
    const updatedWorkSlot = {
      date: values.date,
    };
    try {
      await axios
        .put(`http://localhost:5000/work-slot/${id}`, updatedWorkSlot)
        .then((response) => {
          toast.success("Work Slot updated successfully!");
        })
        .catch((err) => {
          toast.error("Work Slot failed to update!");
        });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { workSlot, initialValues } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-3">
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Work Slots</BreadcrumbItem>
                <BreadcrumbItem active>Edit Work Slot</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardHeader>Edit Work Slot</CardHeader>
                <Formik
                  validateOnBlur
                  validateOnChange={false}
                  validationSchema={workSlotSchema}
                  initialValues={initialValues}
                  enableReinitialize={true}
                  onSubmit={this.updateWorkSlotDetails}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <CardBody>
                        <Row>
                          <Col>
                            <div>
                              <Label>Date</Label>
                              <Field
                                name="date"
                                type="date"
                                className={`form-control ${
                                  errors.date && touched.date
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {errors.date && touched.date && (
                                <FormFeedback type="invalid">
                                  {errors.date}
                                </FormFeedback>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter>
                        <div className="d-flex flex-row gap-3">
                          <Button type="submit" color="primary">
                            Save Changes
                          </Button>
                          <Link to="/workslots">
                            <Button color="danger">Cancel</Button>
                          </Link>
                        </div>
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

export default withRouteParams(EditWorkslot);
