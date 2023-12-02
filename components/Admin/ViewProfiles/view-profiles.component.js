import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

class ViewProfiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      selectedProfile: null,
      search: "",
      isDeleteModalOpen: false,
    };
  }

  componentDidMount() {
    document.title = "View Profiles | Roku";
    this.getProfiles();
  }

  getProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/profiles");
      const profiles = response.data;
      this.setState({ profiles: profiles });
    } catch (err) {
      console.error(err);
    }
  };

  handleSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery.length === 0) {
      this.getProfiles();
      this.setState({ search: "" });
    } else {
      this.setState({ search: e.target.value });
      this.searchProfile();
    }
  };

  searchProfile = async () => {
    const { search } = this.state;

    try {
      const response = await axios.get(
        `http://localhost:5000/search?q=${search}`
      );
      const profiles = response.data;
      this.setState({ profiles: profiles });
    } catch (err) {
      console.error(err);
    }
  };

  toggleDeleteModal = (id) => {
    this.setState((prevState) => ({
      isDeleteModalOpen: !prevState.isDeleteModalOpen,
      selectedProfile: id,
    }));
  };

  handleDeleteProfile = async () => {
    const { selectedProfile } = this.state;
    try {
      await axios.delete(`http://localhost:5000/profile/${selectedProfile}`);
      toast.success("Profile deleted successfully!");
      this.toggleDeleteModal();
      this.getProfiles();
    } catch (err) {
      toast.error("Error deleting profile!");
      this.toggleDeleteModal();
      console.error(err);
    }
  };

  render() {
    const { profiles, isDeleteModalOpen, search } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>User Profiles</CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-row gap-2">
                        <span className="fw-semibold">
                          View all existing profiles in this system.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-row gap-2">
                        <Link to="/admin/users">
                          <Button color="dark">View User Accounts</Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div>
                        <Input
                          placeholder="Search.."
                          className="form-control"
                          value={search}
                          onChange={this.handleSearch}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-bordered table-hover table-striped align-middle">
                        <thead>
                          <tr>
                            <th style={{ width: "140px" }}>Name</th>
                            <th style={{ width: "100px" }}>Role Name</th>
                            <th>Role Description</th>
                            <th style={{ width: "150px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profiles && profiles.length > 0 ? (
                            profiles.map((profile) => (
                              <tr>
                                {/* Get user data */}
                                <td>
                                  {profile?.user?.firstName}{" "}
                                  {profile?.user?.lastName}
                                </td>
                                <td>{profile?.role?.role}</td>
                                <td>{profile?.role?.roleDescription}</td>
                                <td>
                                  <div className="d-flex flex-row gap-1">
                                    <Link to={`/admin/profile/${profile?._id}`}>
                                      <Button color="primary">View</Button>
                                    </Link>
                                    <Link
                                      to={`/admin/profile/${profile?._id}/edit`}
                                    >
                                      <Button color="warning">Edit</Button>
                                    </Link>
                                    <Button
                                      color="danger"
                                      onClick={() =>
                                        this.toggleDeleteModal(profile?._id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>No profiles found.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Delete Profile Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            toggle={() => this.toggleDeleteModal(null)}
            centered
          >
            <ModalHeader>Are you sure?</ModalHeader>
            <ModalBody>You are about to delete this profile.</ModalBody>
            <ModalFooter className="d-flex flex-row gap-2">
              <Button color="danger" onClick={this.handleDeleteProfile}>
                Delete
              </Button>
              <Button
                color="primary"
                onClick={() => this.toggleDeleteModal(null)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    );
  }
}

export default ViewProfiles;
