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
} from "reactstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

function withRouteParams(WrappedComponent) {
  return function Wrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class StaffWorkslots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: JSON.parse(localStorage.getItem("user")),
      approvedWorkSlots: null,
      bids: null,
    };
  }

  componentDidMount() {
    document.title = "My Work Slots | Roku";
    this.loadBids();
    this.loadApprovedWorkslots();
  }

  loadWorkSlotData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/work-slot/${id}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  loadBids = async () => {
    const { activeUser } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/bids/user/${activeUser._id}`
      );
      const bidData = response.data;
      // Map through the bids to get the work slot data
      const workSlotDataPromises = bidData.map((bid) =>
        this.loadWorkSlotData(bid.workSlot)
      );
      const workSlotData = await Promise.all(workSlotDataPromises);
      const bidsWithWorkSlot = bidData.map((bid, index) => ({
        ...bid,
        workSlot: workSlotData[index],
      }));

      this.setState({ bids: bidsWithWorkSlot });
    } catch (err) {
      console.error(err);
    }
  };

  loadApprovedWorkslots = async () => {
    const { activeUser } = this.state;
    try {
      const response = await axios.get(
        `http://localhost:5000/work-slot/approved/${activeUser._id}`
      );
      const approvedWorkSlots = response.data;
      this.setState({ approvedWorkSlots: approvedWorkSlots });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { approvedWorkSlots, bids } = this.state;
    return (
      <div className="d-flex flex-row justify-content-center align-items-center mt-5">
        <Container>
          <Row className="mb-3">
            <Col>
              <Breadcrumb>
                <BreadcrumbItem>Work Slots</BreadcrumbItem>
                <BreadcrumbItem active>My Work Slots</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <CardHeader>My Work Slots</CardHeader>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">My Active Work Slots</span>
                        <span className="text-muted">
                          These are all your work slots that have been approved
                          and you will be working.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-striped table-hover table-bordered align-middle">
                        <thead>
                          <tr>
                            <th>Work Slot Date</th>
                            <th style={{ width: "110px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvedWorkSlots && approvedWorkSlots.length > 0 ? (
                            approvedWorkSlots.map((workSlot, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    {moment(workSlot.date).format(
                                      "DD MMMM YYYY"
                                    )}
                                  </td>
                                  <td>
                                    {/* If workSlot.date has past, show completed else show not started */}
                                    {moment(workSlot.date).isBefore(
                                      moment()
                                    ) ? (
                                      <Badge className="w-100" color="success">Completed</Badge>
                                    ) : (
                                      <Badge className="w-100" color="warning">Not Started</Badge>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="2">No work slots assigned yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold">My Bids</span>
                        <span className="text-muted">
                          These are your bids and the status of your bids.
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Table className="table table-striped table-hover table-bordered align-middle">
                        <thead>
                          <tr>
                            <th>Work Slot Date</th>
                            <th>Date of Bid</th>
                            <th style={{ width: "110px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bids && bids.length > 0 ? (
                            bids.map((bid, index) => {
                              if (bid && bid.workSlot) {
                                return (
                                  <tr key={index}>
                                    {/* Format date in moment js */}
                                    <td>
                                      {moment(bid.workSlot.date).format(
                                        "DD MMMM YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {moment(bid.date).format("DD MMMM YYYY")}
                                    </td>
                                    <td>
                                      <Badge color="dark" className="w-100">{bid.status}</Badge>
                                    </td>
                                  </tr>
                                );
                              } else {
                                return null;
                              }
                            })
                          ) : (
                            <tr>
                              <td colSpan="3">No bids created yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
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

export default withRouteParams(StaffWorkslots);
