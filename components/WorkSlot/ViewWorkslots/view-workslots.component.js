import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { Link } from "react-router-dom";

class ViewWorkslots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workSlots: [],
      roles: [],
      bids: [],
      approvedWorkSlots: 0,
      isDeleteModalOpen: false,
      isBidModalOpen: false,
      isWithdrawModalOpen: false,
      selectedWorkSlot: null,
      activeUser: JSON.parse(localStorage.getItem("user")) || {},
    };
  }

  componentDidMount() {
    this.loadWorkSlots();
    this.loadRoles();
    this.loadBids();
    this.getEmpoyeeWorkSlots();

    document.title = "Work Slots | Roku";
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeUser !== this.state.activeUser) {
      console.log(this.state.activeUser);
    }
  }

  loadWorkSlots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/work-slots");
      this.setState({ workSlots: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  loadRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      this.setState({ roles: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  handleSearchQuery = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery.length > 0) {
      this.searchWorkSlots(e);
    } else {
      this.loadWorkSlots();
    }
  };

  searchWorkSlots = async (e) => {
    const searchQuery = e.target.value;
    try {
      const response = await axios.get(
        `http://localhost:5000/work-slot/search?date=${searchQuery}`
      );
      this.setState({ workSlots: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  getEmployee = async (employee) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${employee}`
      );
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  getEmpoyeeWorkSlots = async () => {
    const userId = this.state.activeUser._id;
    let numWorkSlot = 0;

    try {
      const response = await axios.get(
        `http://localhost:5000/work-slot/approved/${userId}`
      );
      // Get the number of work slots that they user has been included in workSlot.employees
      const approvedWorkSlots = response.data;
      approvedWorkSlots.map((workSlot) => {
        workSlot.employees.map((employee) => {
          if (employee.employee === userId) {
            numWorkSlot += 1;
          }
        });
      });
      this.setState({ approvedWorkSlots: numWorkSlot });
    } catch (err) {
      console.error(err);
    }
  };

  toggleDeleteModal = (id) => {
    this.setState((prevState) => ({
      isDeleteModalOpen: !prevState.isDeleteModalOpen,
      selectedWorkSlot: id,
    }));
  };

  toggleBidModal = (workSlot) => {
    this.setState((prevState) => ({
      isBidModalOpen: !prevState.isBidModalOpen,
      selectedWorkSlot: workSlot,
    }));
  };

  toggleWithdrawModal = (workSlot) => {
    this.setState((prevState) => ({
      isWithdrawModalOpen: !prevState.isWithdrawModalOpen,
      selectedWorkSlot: workSlot,
    }));
  };

  loadBids = async () => {
    const { activeUser } = this.state;
    try {
      await axios
        .get(`http://localhost:5000/bids/user/${activeUser._id}`)
        .then((response) => {
          this.setState({ bids: response.data });
          console.log("Bids LoadBids:", response.data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  bidWorkSlot = async () => {
    const { selectedWorkSlot, activeUser } = this.state;
    const newBid = {
      userID: activeUser._id,
      workSlotID: selectedWorkSlot,
    };
    try {
      await axios.post(`http://localhost:5000/bid/create`, newBid);

      this.toggleBidModal(null);
      toast.success("Bid created successfully!");
      this.loadBids();
      this.loadWorkSlots();
    } catch (err) {
      toast.error("Error creating bid!");
      this.toggleBidModal(null);
      console.error(err);
    }
  };

  withdrawBid = async () => {
    const { selectedWorkSlot } = this.state;

    try {
      await axios.delete(`http://localhost:5000/bid/${selectedWorkSlot._id}`);
      this.loadWorkSlots();
      this.loadBids();
      this.toggleWithdrawModal(null);
      toast.success("Bid withdrawn successfully!");
    } catch (err) {
      toast.error("Error withdrawing bid!");
      console.error(err);
    }
  };

  deletedWorkSlot = async () => {
    const selectedWorkSlot = this.state.selectedWorkSlot;
    try {
      await axios.delete(`http://localhost:5000/work-slot/${selectedWorkSlot}`);
      this.loadWorkSlots();
      this.toggleDeleteModal(null);
      toast.success("Work Slot deleted successfully!");
    } catch (err) {
      toast.error("Error deleting work slot!");
      this.toggleDeleteModal(null);
      console.error(err);
    }
  };

  render() {
    const {
      isDeleteModalOpen,
      isWithdrawModalOpen,
      isBidModalOpen,
      activeUser,
      approvedWorkSlots,
      workSlots,
      bids,
      searchQuery,
    } = this.state;
    const user = this.state.activeUser._id;
    const selectedWorkSlotObj = this.state.workSlots.find(
      (workSlot) => workSlot._id === this.state.selectedWorkSlot
    );

    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <span className="h5">Work Slots</span>
                </CardHeader>
                <CardBody>
                  {(activeUser.role.role === "Chef" ||
                    activeUser.role.role === "Waiter" ||
                    activeUser.role.role === "Cashier") && (
                    <div className="border border-1 rounded p-3 mb-3">
                      <Row className="mb-3">
                        <Col>
                          <div className="d-flex flex-column gap-1">
                            <span className="h5 fw-semibold">
                              Hi, {activeUser.firstName}!
                            </span>
                            <span>Here are all the work slots this week.</span>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col>
                          <Table className="table table-bordered table-striped table-hover aligm-middle">
                            <thead>
                              <tr>
                                <th>Work Slots Per Week</th>
                                <th>Assigned No. Work Slots</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{activeUser?.shiftsPerWeek}</td>
                                <td>{approvedWorkSlots}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col>
                          <span className="text-danger">
                            Notice: Only your manager can decide which work slot
                            you will be working.
                          </span>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col>
                          <div className="d-flex flex-row gap-2">
                            <Link to={`/workslot/${user}`}>
                              <Button color="primary">My Work Slots</Button>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Search for Work Slots */}
                  <Row className="mb-3">
                    <Col>
                      <Input
                        className="form-control"
                        placeholder="Search work slots by date.."
                        value={searchQuery}
                        onChange={this.handleSearchQuery}
                      />
                    </Col>
                  </Row>

                  {/* Table Overview for All Work Slots */}
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th style={{ width: "100px" }}>Status</th>
                            <th style={{ width: "170px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workSlots && workSlots.length > 0 ? (
                            workSlots.map((workSlot) => {
                              return (
                                <tr>
                                  <td>
                                    {moment(workSlot?.date).format(
                                      "DD MMMM YYYY"
                                    )}
                                  </td>

                                  <td>
                                    {workSlot?.isAvailable ? (
                                      <Badge color="success" className="w-100">
                                        Available
                                      </Badge>
                                    ) : (
                                      <Badge color="danger" className="w-100">
                                        Unavailable
                                      </Badge>
                                    )}
                                  </td>
                                  <td>
                                    {/* Check if the Active User is a Manager */}
                                    {activeUser?.role?.role === "Manager" && (
                                      <>
                                        <Link to={`/workslot/${workSlot?._id}`}>
                                          <Button
                                            color="primary"
                                            className="btn btn-sm w-100"
                                          >
                                            View
                                          </Button>
                                        </Link>
                                      </>
                                    )}
                                    {/* Check if the Active User is an Owner */}
                                    {activeUser?.role?.role === "Owner" && (
                                      <div className="d-flex flex-row gap-2">
                                        <Button
                                          color="danger"
                                          onClick={() =>
                                            this.toggleDeleteModal(
                                              workSlot?._id
                                            )
                                          }
                                        >
                                          Delete
                                        </Button>
                                        <Link
                                          to={`/workslot/${workSlot?._id}/edit`}
                                        >
                                          <Button color="warning">Edit</Button>
                                        </Link>
                                      </div>
                                    )}
                                    {/* Check if the Active User Role is one of the Staffs */}
                                    {(activeUser?.role?.role === "Chef" ||
                                      activeUser?.role?.role === "Waiter" ||
                                      activeUser?.role?.role === "Cashier") &&
                                      (workSlot?.isAvailable ? (
                                        workSlot?.employees.some(
                                          (employee) =>
                                            employee?.employee ===
                                            activeUser?._id
                                        ) ? (
                                          <Button
                                            color="success"
                                            disabled
                                            className="btn btn-sm w-100"
                                          >
                                            Assigned
                                          </Button>
                                        ) : bids.some(
                                            (bid) =>
                                              bid?.workSlot === workSlot?._id &&
                                              bid?.employee ===
                                                activeUser?._id &&
                                              bid?.status === "Pending"
                                          ) ? (
                                          <Button
                                            color="warning"
                                            onClick={() =>
                                              this.toggleWithdrawModal(workSlot)
                                            }
                                            className="btn btn-sm w-100"
                                          >
                                            Withdraw Bid
                                          </Button>
                                        ) : bids.some(
                                            (bid) =>
                                              bid?.workSlot === workSlot?._id &&
                                              bid?.employee ===
                                                activeUser?._id &&
                                              bid?.status === "Rejected"
                                          ) ? (
                                          <Button
                                            color="danger"
                                            className="btn btn-sm w-100"
                                          >
                                            Rejected
                                          </Button>
                                        ) : (
                                          <Button
                                            color="primary"
                                            className="btn btn-sm w-100"
                                            onClick={() =>
                                              this.toggleBidModal(workSlot?._id)
                                            }
                                          >
                                            Bid Work Slot
                                          </Button>
                                        )
                                      ) : (
                                        <Button
                                          className="btn btn-sm w-100"
                                          color="dark"
                                          disabled
                                        >
                                          Unavailable
                                        </Button>
                                      ))}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={3}>No work slots found.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      {/* Delete Modal */}
                      <Modal
                        isOpen={isDeleteModalOpen}
                        toggle={() => this.toggleDeleteModal(null)}
                      >
                        <ModalHeader>Are you sure?</ModalHeader>
                        <ModalBody>
                          You are trying to delete this work slot.
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" onClick={this.deletedWorkSlot}>
                            Delete
                          </Button>
                          <Button onClick={() => this.toggleDeleteModal(null)}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>

                      {/* Bid Modal */}
                      <Modal
                        isOpen={isBidModalOpen}
                        toggle={() => this.toggleBidModal(null)}
                        centered
                      >
                        <ModalHeader>Bid for Work Slot</ModalHeader>
                        <ModalBody>
                          <Row className="mb-3">
                            <Col>
                              You are requesting to bid for the following work
                              slot!
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col className="d-flex flex-column gap-1">
                              <span>
                                Work Slot Date:
                                {selectedWorkSlotObj &&
                                  moment(selectedWorkSlotObj?.date).format(
                                    "DD MMMM YYYY"
                                  )}
                              </span>
                              <span>
                                Work Slot Role: {activeUser?.role.role}
                              </span>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="warning"
                            onClick={() => this.toggleBidModal(null)}
                          >
                            Cancel
                          </Button>
                          <Button color="primary" onClick={this.bidWorkSlot}>
                            Confirm Bid
                          </Button>
                        </ModalFooter>
                      </Modal>

                      {/* Withdraw Modal */}
                      <Modal
                        isOpen={isWithdrawModalOpen}
                        toggle={() => this.toggleWithdrawModal(null)}
                        centered
                      >
                        <ModalHeader>Withdraw Bid</ModalHeader>
                        <ModalBody>
                          <Row className="mb-3">
                            <Col>
                              You are withdrawing your request for the following
                              work slot!
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col className="d-flex flex-column gap-1">
                              <span>
                                Work Slot Date:
                                {selectedWorkSlotObj &&
                                  moment(selectedWorkSlotObj?.date).format(
                                    "DD MMMM YYYY"
                                  )}
                              </span>
                              <span>
                                Work Slot Role: {activeUser?.role?.role}
                              </span>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="warning"
                            onClick={() => this.toggleWithdrawModal(null)}
                          >
                            Cancel
                          </Button>
                          <Button color="primary" onClick={this.withdrawBid}>
                            Confirm Withdraw
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ViewWorkslots;
