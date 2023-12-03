import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { DateHelper } from "../Common/DateHelper";
import moment from "moment";

class Home extends Component {
  constructor(props) {
    super(props);
    this.dateHelper = new DateHelper();
    this.state = {
      activeUser: JSON.parse(localStorage.getItem("user")) || {},
      isRoleModalOpen: true,
      selectedRole: {},
      workSlots: [],
      unfulfilledWorkslots: [],
      roles: [],
      users: [],
      profiles: [],
      selectedDate: "",
    };
    console.log(this.state.activeUser);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeUser !== this.state.activeUser) {
      console.log(this.state.activeUser);
    }
  }

  componentDidMount() {
    document.title = "Home | Roku";
    this.getActiveUserDetails();
    this.loadWorkSlots();
    this.loadUnfulfilledWorkSlots();
    this.loadRoles();
    this.loadUsers();
    this.loadProfiles();
  }

  loadUnfulfilledWorkSlots = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/work-slot/unfulfilled"
      );
      this.setState({ unfulfilledWorkslots: response.data });
    } catch (error) {
      toast.error("Error loading unfulfilled work slots.");
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

  loadWorkSlots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/work-slots");
      this.setState({ workSlots: response.data });
    } catch (err) {
      toast.error("Error loading work slots.");
    }
  };

  loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      this.setState({ users: response.data });
    } catch (error) {
      toast.error("Error loading users.");
    }
  };

  loadProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/profiles");
      const allProfiles = response.data;
      this.setState({ profiles: allProfiles });
    } catch (error) {
      toast.error("Error loading profiles.");
    }
  };

  handleDateSelection = (event) => {
    this.setState({ selectedDate: event.target.value });
    console.log(event.target.value);
  };

  createWorkSlot = async () => {
    const { selectedDate } = this.state;
    const dateRequest = {
      date: selectedDate,
    };
    try {
      await axios
        .post("http://localhost:5000/work-slot/create", dateRequest)
        .then((res) => {
          toast.success("Work slot created successfully!");
          this.loadWorkSlots();
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Error creating work slot.");
          }
        });
    } catch (error) {
      toast.error("Error creating work slot.");
      console.log(error);
    }
  };

  toggleRoleModal = () => {
    this.setState((prevState) => ({
      isRoleModalOpen: !prevState.isRoleModalOpen,
    }));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  getActiveUserDetails = async () => {
    const { activeUser } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${activeUser._id}`
      );
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  handleRoleUpdate = async () => {
    const { activeUser, selectedRole } = this.state;
    try {
      if (!selectedRole) {
        toast.error("Please select a role.");
        return;
      }
      await axios.put(`http://localhost:5000/user/${activeUser._id}`, {
        role: selectedRole,
      });
      this.getActiveUserDetails();
      this.toggleRoleModal();
      toast.success("Role updated successfully.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error updating role.");
    }
  };

  // Render User Role Content
  renderUserRoleContent() {
    const { activeUser } = this.state;

    if (
      activeUser.role &&
      (activeUser.role.role === "Waiter" ||
        activeUser.role.role === "Cashier" ||
        activeUser.role.role === "Chef")
    ) {
      return (
        <>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col className="fw-bold">Role</Col>
                  </Row>
                  <Row>
                    <Col>
                      {activeUser.role.role ? (
                        activeUser.role.role
                      ) : (
                        <span>Please set your role before continuing.</span>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col className="fw-bold">Work Slots per Week</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      View or modify the number of days you would like to work
                      in a week.
                    </Col>
                  </Row>
                  {activeUser.shiftsPerWeek && activeUser.shiftsPerWeek > 0 ? (
                    <div>
                      <Row className="mb-3">
                        <Col>
                          <span>
                            You are working {activeUser.shiftsPerWeek} work
                            slot(s) per week.
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Link to={`/user/update-workslots`}>
                            <Button color="primary">
                              Modify No. Work Slots
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div>
                      <Row className="mb-3">
                        <Col>
                          <span>
                            Please set the number of days you would like to work
                            in a week.
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Link to={`/user/update-workslots`}>
                            <Button color="primary">
                              Modify No. Work Slots
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col className="fw-bold">Your Work Slots</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>View your approved and bidded work slots here.</Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link to={`/workslot/${activeUser._id}`}>
                        <Button color="primary">My Work Slots</Button>
                      </Link>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      );
    }

    // Return null if the user's role doesn't match any condition
    return null;
  }

  // Render Owner Content
  renderOwnerContent = () => {
    const { activeUser, selectedDate } = this.state;

    if (activeUser.role && activeUser.role.role === "Owner") {
      return (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col>
                    <span className="fw-bold">
                      Pending Work Slots to Create
                    </span>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <span className="text-primary">
                      Notice: Please create work slots for the next week.
                    </span>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Input
                      type="date"
                      className="form-control w-25"
                      value={selectedDate}
                      onChange={this.handleDateSelection}
                    />
                    <Button
                      color="primary"
                      className="mt-3 w-25"
                      onClick={this.createWorkSlot}
                    >
                      Create Work Slot
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    }

    return null;
  };

  // Render Admin Content
  renderAdminContent = () => {
    const { activeUser, users } = this.state;

    if (activeUser.role && activeUser.role.role === "Admin") {
      return (
        <div>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <span className="fw-bold">Number of Users in Cafe</span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <span>{users.length}</span>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-1">
                    <Col>
                      <span className="fw-bold">User Accounts & Profiles</span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <span className="tetx-muted">
                      View and manage user accounts and profiles.
                    </span>
                  </Row>
                  <Row>
                    <Col>
                      <div className="d-flex flex-row gap-2">
                        <Link to="/admin/users">
                          <Button color="primary">View Accounts</Button>
                        </Link>
                        <Link to="/admin/profiles">
                          <Button color="primary" className="ms-3">
                            View Profiles
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
  };

  // Render Manager Content
  renderManagerContent = () => {
    const { activeUser, unfulfilledWorkslots } = this.state;
    // const allWorkSlotsFilled = workSlots.every(
    //   (workSlot) => !workSlot.isAvailable
    // );

    if (activeUser.role && activeUser.role.role === "Manager") {
      return (
        <div>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">Work Slots</span>
                        <span>View and manage work slots here.</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link to="/workslots">
                        <Button color="primary" className="w-25">
                          Work Slots
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">
                          Work Slots Still Available to Fill
                        </span>
                        <span>
                          Here are the work slots that are still available for
                          employees to bid for.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table className="table table-striped table-bordered table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th style={{ width: "90px" }}>Status</th>
                            <th style={{ width: "120px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unfulfilledWorkslots &&
                          unfulfilledWorkslots?.length > 0 ? (
                            unfulfilledWorkslots?.map((workSlot, index) => (
                              <tr key={index}>
                                <td>
                                  {moment(workSlot?.date).format(
                                    "DD MMMM YYYY"
                                  )}
                                </td>
                                <td>
                                  {workSlot?.isAvailable ? (
                                    <Badge color="success" className="w-100">Available</Badge>
                                  ) : (
                                    <Badge color="danger" className="w-100">Unavailable</Badge>
                                  )}
                                </td>
                                <td>
                                  <Link to={`/workslot/${workSlot?._id}`}>
                                    <Button
                                      color="primary"
                                      className="btn btn-sm w-100"
                                    >
                                      View Work Slot
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3}>All work slots filled!</td>
                            </tr>
                          )}
                          {/* {unfulfilledWorkslots &&
                            unfulfilledWorkslots.map((workSlot) => {
                              if (!allWorkSlotsFilled) {
                                if (workSlot.isAvailable) {
                                  return (
                                    <tr>
                                      <td>
                                        {moment(workSlot.date).format(
                                          "DD MMMM YYYY"
                                        )}
                                      </td>
                                      <td>
                                        <Badge
                                          color="success"
                                          className="w-100"
                                        >
                                          Available
                                        </Badge>
                                      </td>
                                      <td>
                                        <Link to={`/workslot/${workSlot._id}`}>
                                          <Button
                                            color="primary"
                                            className="btn btn-sm w-100"
                                          >
                                            View Work Slot
                                          </Button>
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                }
                              } else {
                                return (
                                  <tr>
                                    <td colSpan="3">All work slots filled.</td>
                                  </tr>
                                );
                              }
                            })} */}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
  };

  render() {
    const { activeUser, isRoleModalOpen, roles, selectedRole } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <span className="display-6">
                Welcome back, {activeUser?.firstName} {activeUser?.lastName}!
              </span>
            </Col>
          </Row>

          {activeUser.role === null ? (
            <Modal
              fullscreen
              isOpen={isRoleModalOpen}
              toggle={this.toggleRoleModal}
            >
              <ModalHeader>Let's set up your role!</ModalHeader>
              <ModalBody>
                <Row className="mb-3">
                  <Col>
                    <Label>Pick a Role</Label>
                    <Input
                      type="select"
                      name="selectedRole"
                      value={selectedRole}
                      onChange={this.handleChange}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key="role._id" value={role._id}>
                          {role.role}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleRoleUpdate}>
                  Set Role
                </Button>
              </ModalFooter>
            </Modal>
          ) : (
            <>
              {this.renderUserRoleContent()}
              {this.renderOwnerContent()}
              {this.renderAdminContent()}
              {this.renderManagerContent()}
            </>
          )}
        </Container>
      </div>
    );
  }
}

export default Home;
