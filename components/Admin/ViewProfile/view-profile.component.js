import React, { Component } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      profile: {},
    };
  }

  componentDidMount() {
    document.title = "View Profile | Roku";
    const id = this.props.params.id; // Access id from the route params
    this.setState({ id }, () => {
      this.getUserProfile();
    });
  }

  getUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/profile/${this.state.id}` // Use this.state.id instead of this.state.userId
      );
      const profile = response.data;
      this.setState({ profile: profile });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { profile } = this.state;
    console.log("Profile:", profile)
    return (
      <div className="mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>User Profile</CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div>
                        <span>Welcome to {profile?.user?.firstName}'s profile!</span>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-semibold">
                          {profile?.user?.firstName} {profile?.user?.lastName}
                        </span>
                        <span>@{profile?.user?.username}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-semibold">Contact</span>
                        <span>{profile?.user?.email}</span>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mb-3">
                    <Col>
                        <div className="d-flex flex-column gap-1">
                            <span className="fw-semibold">Role</span>
                            <span>{profile?.role?.role}</span>
                        </div>
                    </Col>
                    <Col>
                    <div className="d-flex flex-column gap-1">
                            <span className="fw-semibold">Role Description</span>
                            <span>{profile?.role?.roleDescription}</span>
                        </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Link to="/admin/profiles">
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

export default withRouteParams(ViewProfile);
