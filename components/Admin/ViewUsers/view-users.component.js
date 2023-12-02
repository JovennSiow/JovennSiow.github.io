import React, { Component } from "react";
import {
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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isModalOpen: false,
      selectedUser: null,
    };
  }

  componentDidMount() {
    this.loadUsers();
    document.title = "Users | Roku";
  }

  loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      this.setState({ users: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  handleSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery.length > 0) {
      this.searchUsers(searchQuery);
    } else {
      this.loadUsers();
    }
  };

  searchUsers = async (searchQuery) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/search?firstName=${searchQuery}`
      );
      console.log(response.data);
      this.setState({ users: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  toggleModal = (id) => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
      selectedUser: id,
    }));
  };

  suspendUser = async () => {
    const selectedUser = this.state.selectedUser;
    try {
      await axios.delete(`http://localhost:5000/user/${selectedUser}`);
      this.loadUsers();
      this.toggleModal(null);
      toast.success("User suspended successfully!");
    } catch (err) {
      toast.error("Error deleting user!");
      this.toggleModal(null);
      console.error(err);
    }
  };

  render() {
    const { isModalOpen, selectedUser, users, searchQuery } = this.state;

    return (
      <div className="mt-5">
        <Container>
          <Card>
            <CardHeader className="d-flex flex-column gap-2">
              User Accounts
            </CardHeader>
            <CardBody>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-column gap-1">
                    <span className="fw-semibold">
                      View all existing staff and users in this system.
                    </span>
                    <span className="text-danger">
                      Notice: To create profiles, please view the individual
                      user to begin activating.
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-row gap-2">
                    <Link to="/admin/register">
                      <Button className="btn btn-dark">Register Staff</Button>
                    </Link>
                    <Link to="/admin/profiles">
                      <Button className="btn btn-dark">View Profiles</Button>
                    </Link>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="form-control"
                    onChange={this.handleSearch}
                    value={searchQuery}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Table className="table table-bordered table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ width: "190px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={index}>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.role ? user.role.role : "Not Available"}
                            </td>
                            <td className="d-flex flex-row gap-1">
                              <Link to={`/admin/user/${user._id}`}>
                                <Button color="primary">View</Button>
                              </Link>

                              <Link to={`/admin/user/${user._id}/edit`}>
                                <Button color="warning">Edit</Button>
                              </Link>

                              <Button
                                color="danger"
                                onClick={() => this.toggleModal(user._id)}
                              >
                                Suspend
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>No user accounts found.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Modal
                    isOpen={isModalOpen}
                    toggle={() => this.toggleModal(null)}
                  >
                    <ModalHeader>Are you sure?</ModalHeader>
                    <ModalBody>You are trying to suspend this user.</ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={this.suspendUser}>
                        Suspend
                      </Button>
                      <Button onClick={() => this.toggleModal(null)}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default ViewUsers;
