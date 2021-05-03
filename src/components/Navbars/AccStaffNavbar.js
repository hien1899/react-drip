import React, { Component } from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import routes from "routes.js";

import history from "components/Authentication/RoleBaseAuth/helper/History.js"
import authenticationService from 'components/Authentication/RoleBaseAuth/services/AuthenticationService.js';

function logout() {
  authenticationService.logout();
  history.push("/home/news");
}

function ask(){
  var r = confirm("Bạn muốn đăng xuất?");
  if (r == true) {
    logout()
  }
}

function auth() {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser) {
    return (
      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle
          aria-expanded={false}
          aria-haspopup={true}
          as={Nav.Link}
          data-toggle="dropdown"
          id="navbarDropdownMenuLink"
          variant="default"
          className="m-0"
        >
          <span className="no-icon">{currentUser.email}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu aria-label="navbarDropdownMenuLink">
          {/* <Dropdown.Item href="/acc-staff/profile" tag={Link}>
            Profile
        </Dropdown.Item> */}
          <Dropdown.Item href="/acc-staff/edit-profile" tag={Link}>
            Thay đổi thông tin cá nhân
        </Dropdown.Item>
        <Dropdown.Item onClick={ask} style={{color: "red"}}>
            <span className="nc-icon nc-button-power" /><span>{" "}Đăng xuất</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

function AccStaffNavbar() {
  const location = useLocation();
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            {/* <Nav.Item>
              <Nav.Link
                data-toggle="dropdown"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="m-0"
              >
                <i className="nc-icon nc-palette"></i>
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item> */}
            {/* <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                data-toggle="dropdown"
                id="dropdown-67443507"
                variant="default"
                className="m-0"
              >
                <i className="nc-icon nc-planet"></i>
                <span className="notification">5</span>
                <span className="d-lg-none ml-1">Notification</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 1
                </Dropdown.Item>
                <Dropdown.Item
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Notification 2
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            {/* <Nav.Item>
              <Nav.Link
                className="m-0"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <i className="nc-icon nc-zoom-split"></i>
                <span className="d-lg-block"> Search</span>
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
          <Nav className="ml-auto" navbar>
            <Nav.Item>{auth()}</Nav.Item>
            {/* <Nav.Item>
              <Nav.Link className="m-0" href="#" onClick={ask}>
                <span className="no-icon">Log out</span>
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AccStaffNavbar;
