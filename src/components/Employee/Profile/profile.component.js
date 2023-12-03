import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: JSON.parse(localStorage.getItem("user")) || {},
      profile: {},
      userData: {},
      profileLoaded: false,
    };
  }

  loadProfile = async () => {
    const { activeUser } = this.state;
    try {
      await axios
        .get(`http://localhost:5000/profile/user/${activeUser._id}`)
        .then((response) => {
          this.setState({ profile: response.data, profileLoaded: true });
        })
        .catch((err) => {
          this.setState({ profileLoaded: false });
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    document.title = "Profile | Roku";
    this.loadProfile();
    this.renderProfile();
    this.renderProfileNull();
  }

  renderProfileNull = () => {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>Profile</CardHeader>
                <CardBody className="pb-5">
                  <Row>
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">
                          Welcome to your profile!
                        </span>
                        <span>
                          Please contact your system administrator to activate
                          your profile for you.
                        </span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  renderProfile = () => {
    const { profile } = this.state;
    console.log("Profile", profile);
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardHeader>Profile</CardHeader>
                <CardBody className="p-4">
                  <Row>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <span className="h5">Welcome to your profile!</span>
                      <Link to="/settings">
                        <Button color="primary">Edit Profile</Button>
                      </Link>
                    </div>
                  </Row>
                  <hr />
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-semibold">
                          {profile?.user?.firstName} {profile?.user?.lastName}
                        </span>
                        <span className="text-muted">@{profile?.user?.username}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-semibold">Contact</span>
                        <span>{profile?.user?.email}</span>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mb-3">
                    <Col>
                      <span className="fw-semibold">Employee Information</span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-semibold">Role </span>
                        <span>
                          {profile?.role?.role ? profile?.role?.role : "N/A"}{" "}
                        </span>
                      </div>
                    </Col>
                    <Col lg={8}>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-semibold">Role Information</span>
                        <span>
                          {profile?.role
                            ? profile?.role?.roleDescription
                            : "N/A"}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="d-flex flex-column gap-1 mb-3">
                        <span className="fw-semibold">Work Slots per Week </span>
                        <span>
                          {profile?.user?.shiftsPerWeek
                            ? profile?.user?.shiftsPerWeek
                            : "N/A"}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  render() {
    const { profileLoaded } = this.state;
    return (
      <div className="mt-5">
        {profileLoaded ? this.renderProfile() : this.renderProfileNull()}
      </div>
    );
  }
}

export default Profile;
