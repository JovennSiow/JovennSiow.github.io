import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavLink,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, NavLink as RRNavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: JSON.parse(localStorage.getItem("user")) || null,
    };

    console.log(this.state.activeUser);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeUser !== this.state.activeUser) {
      console.log(this.state.activeUser);
    }
  }

  componentDidMount() {
    this.getActiveUserDetails();
  }

  getActiveUserDetails = async () => {
    const { activeUser } = this.state;
    try {
      await axios
        .get(`http://localhost:5000/user/${activeUser._id}`)
        .then((res) => {
          this.setState({ activeUser: res.data });
        });
    } catch (err) {
      console.error(err);
    }
  };

  logout = () => {
    try {
      toast.success("Logged out successfully!");
      localStorage.removeItem("user");
      this.setState({ activeUser: null });
      window.location.href = "/login";
    } catch (err) {
      toast.error("Error logging out!", err);
    }
  };

  render() {
    const { activeUser } = this.state;
    return (
      <Navbar className=" border-bottom border-primary">
        <NavbarBrand href="/">
          <img
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            src={require("../../../assets/images/coffee_logo.png")}
          />
          Roku
        </NavbarBrand>
        <Nav>
          {activeUser ? (
            <>
              <NavItem>
                <NavLink tag={RRNavLink} style={{ cursor: "pointer" }} to="/">
                  Home
                </NavLink>
              </NavItem>
              {activeUser.role && activeUser.role.role === "Admin" ? (
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    style={{ cursor: "pointer" }}
                    to="/admin/users"
                  >
                    Admin
                  </NavLink>
                </NavItem>
              ) : null}
              {activeUser.role && activeUser.role.role !== "Admin" && (
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    style={{ cursor: "pointer" }}
                    to="/workslots"
                  >
                    Work Slots
                  </NavLink>
                </NavItem>
              )}

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle
                  nav
                  caret
                  className="text-primary text-decoration-none"
                >
                  {activeUser?.firstName} {activeUser?.lastName}
                </DropdownToggle>
                <DropdownMenu left="true" style={{ maxWidth: "40px" }}>
                  <Link
                    to="/profile"
                    className="text-primary text-decoration-none"
                  >
                    <DropdownItem>Profile</DropdownItem>
                  </Link>
                  <Link
                    to="/settings"
                    className="text-primary text-decoration-none"
                  >
                    <DropdownItem>Settings</DropdownItem>
                  </Link>
                  <DropdownItem onClick={() => this.logout()}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            <>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink tag={RRNavLink} to="/login">
                  Sign In
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>
    );
  }
}

export default NavbarComponent;
