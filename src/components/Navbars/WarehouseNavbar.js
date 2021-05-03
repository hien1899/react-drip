import React, { Component } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Route, Router, Switch, Link } from "react-router-dom";
import routes from "../Sidebar/WarehouseSidebarRoutes";
import Map from "views/Home/Map.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import Role from "components/Authentication/RoleBaseAuth/helper/Role";
import AdminLayout from "../../layouts/Admin.js";

function auth() {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser === null || currentUser === undefined) {
    return (
      <Nav.Item>
        <Nav.Link className="m-0" href="/login">
          <i
            className="nc-icon nc-lock-circle-open"
            style={{ fontSize: 20 }}
          ></i>
          <span style={{ marginLeft: 5 }}>
            <b>Đăng nhập</b>
          </span>
        </Nav.Link>
      </Nav.Item>
    );
  }
}

function userMenu() {
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
          <Dropdown.Item href="/warehouse/edit-profile" tag={Link}>
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

function logout() {
  authenticationService.logout();
  history.push("/home/news");
}

function ask() {
  var r = confirm("Bạn muốn đăng xuất?");
  if (r == true) {
    logout()
  }
}

function Header() {
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
    return "";
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-7"
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
              <Nav.Link href="/warehouse/map/" className="m-0">
                <i className="nc-icon nc-map-big" style={{ fontSize: 20 }}></i>
                <span style={{ marginLeft: 5 }}>Bản đồ</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/warehouse/view" className="m-0">
                <i className="nc-icon nc-paper-2" style={{ fontSize: 20 }}></i>
                <span style={{ marginLeft: 5 }}>Kho hàng</span>
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
          <Nav className="ml-auto" navbar>
            <Nav.Item>{userMenu()}</Nav.Item>
            <Nav.Item>{auth()}</Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
