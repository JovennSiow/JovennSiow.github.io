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
import { Formik, Field, Form } from "formik";
import { initialValues, schema } from "../constants";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

class CreateWorkslot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = async (values) => {
    const newWorkslot = {
      date: values.date,
      employees: [],
    };

    try {
      await axios.post("http://localhost:5000/work-slot/create", newWorkslot);
      toast.success("Work slot created successfully!");
      window.location.href = "/";
    } catch (err) {
      toast.error("Error creating work slot!");
      console.error("Error creating work slot:", err);
    }
  };

  componentDidMount() {
    document.title = "Create Work Slot | Roku";
  }

  render() {
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Work Slots</BreadcrumbItem>
                <BreadcrumbItem active>Create Work Slot</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>Create New Work Slot</CardHeader>
                <Formik
                  validateOnBlur
                  validateOnChange={false}
                  validationSchema={schema}
                  initialValues={initialValues}
                  onSubmit={this.handleSubmit}
                >
                  {({ errors, touched, resetForm }) => (
                    <Form>
                      <CardBody>
                        <Row>
                          <Col>
                            <Label>Date</Label>
                            <Field
                              name="date"
                              type="date"
                              className={`form-control ${
                                errors.date && touched.date ? "is-invalid" : ""
                              }`}
                            />
                            {errors.date && touched.date && (
                              <FormFeedback type="invalid">
                                {errors.date}
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="d-flex flex-row gap-3">
                        <Button
                          color="secondary"
                          type="button"
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                        <Link to="/">
                          <Button color="warning" type="button">
                            Cancel
                          </Button>
                        </Link>
                        <Button color="primary" type="submit">
                          Create Work Slot
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

export default CreateWorkslot;
