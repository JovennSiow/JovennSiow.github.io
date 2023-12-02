import axios from "axios";
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
  Label,
  Row,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userId: null,
      profile: {},
      profileExists: true,
    };
  }

  loadUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${this.state.userId}`
      );
      this.setState({ user: response.data });
    } catch (err) {
      console.error(err);
    }
  };

  loadProfile = async () => {
    try {
      await axios
        .get(`http://localhost:5000/profile/user/${this.state.userId}`)
        .then((response) => {
          this.setState({ profile: response.data });
          this.setState({ profileExists: true });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ profileExists: false });
        });
    } catch (err) {
      console.error(err);
    }
  };

  createProfile = async () => {
    const userData = this.state.user._id;
    const roleData = this.state.user.role._id;
    const profileData = { user: userData, role: roleData };
    try {
      await axios
        .post("http://localhost:5000/profile/create", profileData)
        .then((response) => {
          this.setState({ profile: response.data });
          this.setState({ profileExists: true });
          toast.success("Profile created successfully!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error creating profile!");
        });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    const userId = this.props.params.id;
    this.setState({ userId }, () => {
      this.loadUser();
      this.loadProfile();
    });
    document.title = "User | Roku";
  }

  render() {
    const { user } = this.state;
    return (
      <div className="mt-5">
        <Container>
          <Row className="mb-3">
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Admin</BreadcrumbItem>
                <BreadcrumbItem active>View User</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardHeader>User Account Details</CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">First Name</Label>
                        <span>{user.firstName}</span>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">Last Name</Label>
                        <span>{user.lastName}</span>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">Username</Label>
                        <span>{user.username}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">Email</Label>
                        <span>{user.email}</span>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">Role</Label>
                        <span>{user.role ? user.role.role : "N/A"}</span>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">No. Work Slots per Week</Label>
                        <span>
                          {user.shiftsPerWeek ? user.shiftsPerWeek : "N/A"}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <Label className="fw-bold">Password</Label>
                        <span>{user.password}</span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="d-flex flex-row justify-content-between">
                    <Link to="/admin/users">
                      <Button type="button" color="dark">
                        Back
                      </Button>
                    </Link>
                    {!this.state.profileExists && (
                      <Button
                        color="primary"
                        type="button"
                        onClick={this.createProfile}
                      >
                        Activate Profile
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouteParams(ViewUser);
