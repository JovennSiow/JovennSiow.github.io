import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class UpdateWorkslotsPerWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: null,
      numWorkslots: 1,
    };
  }

  componentDidMount() {
    document.title = "Update Work Slots Per Week | Roku";

    const userObj = localStorage.getItem("user");
    this.setState({
      activeUser: userObj ? JSON.parse(userObj) : null,
    });
  }

  getUser = async () => {
    const { activeUser } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${activeUser._id}`
      );
      const user = response.data;
      return user;
    } catch (err) {
      console.error(err);
    }
  };

  updateWorkslots = async () => {
    const { activeUser, numWorkslots } = this.state;
    if (!activeUser) {
      return;
    }
    const updatedNumWorkslots = {
      shiftsPerWeek: numWorkslots,
    };

    try {
      await axios
        .put(`http://localhost:5000/user/${activeUser._id}`, updatedNumWorkslots)
        .then((res) => {
          const userData = this.getUser();
          userData
            .then((data) => {
              localStorage.setItem("user", JSON.stringify(data));
              this.setState({ activeUser: data });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });

      toast.success("Work slots per week updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  handleNumWorkslotsChange = (e) => {
    this.setState({
      numWorkslots: parseInt(e.target.value),
    });
  };

  render() {
    const { numWorkslots } = this.state;

    return (
      <div className="d-flex flex-start justify-content-center align-items-center mt-5">
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>Set Work Slots Per Week</CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      Please select the number of work slots to work per week.
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Input
                        type="range"
                        name="shiftsPerWeek"
                        id="shiftsPerWeek"
                        min="1"
                        max="7"
                        step="1"
                        value={numWorkslots}
                        onChange={this.handleNumWorkslotsChange}
                      />
                      <div className=" mt-2">
                        <span>You have decided on {numWorkslots}</span>
                        <span>
                          {numWorkslots === 1 ? " work slot" : " work slots"} per week!
                        </span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter className="d-flex flex-row gap-3">
                  <Link to="/workslots">
                    <Button color="dark">Back</Button>
                  </Link>
                  <Button color="primary" onClick={this.updateWorkslots}>
                    Update Work Slots Per Week
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UpdateWorkslotsPerWeek;
