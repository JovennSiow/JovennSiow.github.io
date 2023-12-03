import React, { Component } from "react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Input,
} from "reactstrap";
import moment from "moment";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class ViewWorkslot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workSlot: {},
      roles: [],
      bids: [],
      employeesByRole: [],
      approvedWorkSlots: 0,
      employees: [],
      workSlotId: null,
      employeeWorkSlot: {},
      selectedRole: "",
    };
  }

  async componentDidMount() {
    document.title = "Work Slot Details | Roku";
    const workSlotId = this.props.params.id;
    this.setState({ workSlotId }, () => {
      this.loadWorkSlot();
      this.loadRoles();
      this.loadEmployees();
      this.getBidByWorkSlotId();
    });
  }

  loadWorkSlot = async () => {
    const { workSlotId } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/work-slot/${workSlotId}`
      );
      const workSlot = response.data;
      this.setState({ workSlot: workSlot });
    } catch (err) {
      console.error(err);
    }
  };

  loadRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      const filteredRoles = response.data.filter(
        (role) =>
          role.role !== "Admin" &&
          role.role !== "Manager" &&
          role.role !== "Owner"
      );
      this.setState({ roles: filteredRoles });
    } catch (error) {
      toast.error("Error loading roles.");
    }
  };

  loadEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users`);
      const employees = response.data;
      const employeeWorkSlots = {};
      for (const employee of employees) {
        employeeWorkSlots[employee._id] = await this.getEmployeeWorkSlot(
          employee._id
        );
      }
      this.setState({ employees, employeeWorkSlots });
    } catch (err) {
      console.error(err);
    }
  };

  loadEmployeeData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      const employee = response.data;
      return employee;
    } catch (err) {
      console.error(err);
    }
  };

  getEmployeeWorkSlot = async (userId) => {
    let numWorkSlot = 0;

    try {
      const response = await axios.get(
        `http://localhost:5000/work-slot/approved/${userId}`
      );
      const approvedWorkSlots = response.data;
      approvedWorkSlots.map((workSlot) => {
        workSlot.employees.map((employee) => {
          if (employee.employee === userId) {
            numWorkSlot += 1;
          }
        });
      });
    } catch (err) {
      console.error(err);
    }

    return numWorkSlot;
  };

  getBidByWorkSlotId = async () => {
    const { workSlotId } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/bids/work/${workSlotId}`
      );
      const bids = response.data;
      this.setState({ bids: bids });
    } catch (err) {
      console.error(err);
    }
  };

  handleApproveReject = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/bid/${requestId}`, { status });
      this.getBidByWorkSlotId();
      this.loadWorkSlot();
    } catch (err) {
      console.error(err);
    }
  };

  toggleAvailablity = async () => {
    const { workSlotId, workSlot } = this.state;
    try {
      await axios.put(`http://localhost:5000/work-slot/${workSlotId}/status`);
      this.loadWorkSlot();
      toast.success(
        `Work slot set to ${
          workSlot.isAvailable ? "closed" : "opened"
        } successfully.`
      );
    } catch (err) {
      console.error(err);
    }
  };

  handleRoleSelection = (event) => {
    this.setState({ selectedRole: event.target.value }, () => {
      console.log(this.state.selectedRole);
      this.getEmployeeByRole();
    });
  };

  getEmployeeByRole = async () => {
    const { selectedRole } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${selectedRole}`
      );
      const employeesByRole = response.data;
      this.setState({ employeesByRole });
    } catch (err) {
      console.error(err);
    }
  };

  assignWorkSlot = async (employeeId) => {
    const { workSlotId } = this.state;
    try {
      await axios.put(`http://localhost:5000/work-slot/${workSlotId}/assign`, {
        employee: employeeId,
      });
      this.loadWorkSlot();
      toast.success(`Employee assigned to work slot successfully.`);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { workSlot, selectedRole, employeesByRole, bids, employeeWorkSlots } =
      this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Work Slots</BreadcrumbItem>
                <BreadcrumbItem active>Work Slot</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <span>Work Slot Overview</span>
                </CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-bold">Work Slot Date</span>
                        <span>
                          {moment(workSlot?.date).format("DD MMMM YYYY")}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">
                          Work Slot Confirmed Employees
                        </span>
                        <span className="text-muted">
                          View the confirmed employees for this work slot.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-striped table-bordered table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th style={{ width: "120px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workSlot?.employees &&
                          workSlot?.employees?.length > 0 ? (
                            workSlot?.employees?.map(
                              (employee, index) =>
                                // If employee == null
                                employee.employee && (
                                  <tr key={index}>
                                    <td>{employee?.employee?.firstName}</td>
                                    <td>{employee?.employee?.role?.role}</td>
                                    {moment.utc(employee?.date).isBefore() ? (
                                      <td>
                                        <Badge
                                          color="success"
                                          className="w-100"
                                        >
                                          Completed
                                        </Badge>
                                      </td>
                                    ) : (
                                      <td>
                                        <Badge
                                          color="warning"
                                          className="w-100"
                                        >
                                          Hasn't Started
                                        </Badge>
                                      </td>
                                    )}
                                  </tr>
                                )
                            )
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                No approved employees for work slots yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">Work Slot Bids</span>
                        <span className="text-muted">
                          View the bids for this work slot.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-striped table-bordered table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Time Requested</th>
                            <th style={{ width: "200px" }}>
                              No. Work Slots per Week
                            </th>
                            <th style={{ width: "100px" }}>Role</th>
                            <th style={{ width: "100px" }}>Status</th>
                            <th style={{ width: "200px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bids && bids.length > 0 ? (
                            bids?.map(
                              (bid, index) =>
                                bid?.employee && (
                                  <tr key={index}>
                                    <td>{bid?.employee?.firstName}</td>
                                    <td>
                                      {moment(bid?.date).format(
                                        "DD MMMM YYYY, HH:mm:ss"
                                      )}
                                    </td>
                                    <td>{bid?.employee?.shiftsPerWeek}</td>

                                    <td>{bid?.employee?.role?.role}</td>
                                    <td>
                                      {bid?.status === "Approved" && (
                                        <Badge
                                          color="success"
                                          className="w-100"
                                        >
                                          {bid?.status}
                                        </Badge>
                                      )}
                                      {bid?.status === "Rejected" && (
                                        <Badge color="danger" className="w-100">
                                          {bid?.status}
                                        </Badge>
                                      )}
                                      {bid?.status === "Pending" && (
                                        <Badge
                                          color="warning"
                                          className="w-100"
                                        >
                                          {bid?.status}
                                        </Badge>
                                      )}
                                    </td>
                                    <td>
                                      {bid?.status === "Pending" && (
                                        <div className="d-flex flex-row gap-2">
                                          <Button
                                            color="success"
                                            className="btn btn-sm w-50"
                                            onClick={() =>
                                              this.handleApproveReject(
                                                bid?._id,
                                                "Approved"
                                              )
                                            }
                                          >
                                            Approve
                                          </Button>
                                          <Button
                                            color="danger"
                                            className="btn btn-sm w-50"
                                            onClick={() =>
                                              this.handleApproveReject(
                                                bid?._id,
                                                "Rejected"
                                              )
                                            }
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                      {bid?.status === "Approved" && (
                                        <Button
                                          color="success"
                                          className="btn btn-sm w-100"
                                          disabled
                                        >
                                          Assigned
                                        </Button>
                                      )}
                                      {bid?.status === "Rejected" && (
                                        <Button
                                          color="danger"
                                          className="btn btn-sm w-100"
                                          disabled
                                        >
                                          Rejected
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                )
                            )
                          ) : (
                            <tr>
                              <td colSpan={6}>
                                No employees have requested to bid for this work
                                slot yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">
                          Assign Employees to this Work Slot
                        </span>
                        <span className="text-muted">
                          Assign employees to this work slot by selecting the
                          role and clicking on the Assign Work Slot button.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Input
                        type="select"
                        className="form-select"
                        value={selectedRole}
                        onChange={this.handleRoleSelection}
                      >
                        <option value="">Select Role</option>
                        {this.state.roles.map((role) => {
                          return (
                            <option key={role?._id} value={role?._id}>
                              {role?.role}
                            </option>
                          );
                        })}
                      </Input>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-striped table-bordered table-hover align-middle">
                        <thead>
                          <tr>
                            <th style={{ width: "200px" }}>Name</th>
                            <th>No. Work Slots per Week</th>
                            <th>No. Days Working</th>
                            <th style={{ width: "170px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeesByRole && employeesByRole.length > 0 ? (
                            employeesByRole?.map(
                              (employee, index) =>
                                employee?.shiftsPerWeek > 0 &&
                                !workSlot?.employees?.find(
                                  (e) => e?.employee?._id === employee?._id
                                ) &&
                                !bids.find(
                                  (bid) => bid?.employee?._id === employee?._id
                                ) && (
                                  <tr key={index}>
                                    <td>{employee?.firstName}</td>
                                    <td>{employee?.shiftsPerWeek}</td>
                                    <td>{employeeWorkSlots[employee?._id]}</td>
                                    <td>
                                      <Button
                                        className="w-100 btn btn-sm"
                                        color="dark"
                                        onClick={() =>
                                          this.assignWorkSlot(employee._id)
                                        }
                                        disabled={
                                          !workSlot?.isAvailable ||
                                          employeeWorkSlots[employee?._id] >=
                                            employee?.shiftsPerWeek
                                        }
                                      >
                                        Assign Work Slot
                                      </Button>
                                    </td>
                                  </tr>
                                )
                            )
                          ) : (
                            <tr>
                              <td colSpan={4}>Please select a role.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">Work Slot Availability</span>
                        <span className="text-muted">
                          Set the availability of the work slot.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {workSlot.isAvailable ? (
                        <Button color="danger" onClick={this.toggleAvailablity}>
                          Close Work Slot
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          onClick={this.toggleAvailablity}
                        >
                          Open Work Slot
                        </Button>
                      )}
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Link to="/workslots">
                    <Button color="dark">Back</Button>
                  </Link>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouteParams(ViewWorkslot);
