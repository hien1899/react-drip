import React, { Component, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import Role from "components/Authentication/RoleBaseAuth/helper/Role";
import Login from "components/Authentication/Login"
import Modal from 'react-awesome-modal';
function auth() {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser === null || currentUser === undefined || !currentUser) {
    const [visible, setVisible] = useState(false)
    function openModal() {
      setVisible(true)
    }

    function closeModal() {
      setVisible(false)
    }
    return (
      <Nav.Item>
        <Nav.Link className="m-0" href="#" onClick={() => openModal()}>
          Đăng nhập
          </Nav.Link>
        <div>
          <Modal visible={visible} width="400" height="310" effect="fadeInLeft" onClickAway={() => closeModal()} style={{ backgroundColor: "aqua" }}>
            <div align="center">
              <Login />
            </div>
          </Modal>
        </div>
      </Nav.Item>
    );
  }
}

function ask() {
  var r = confirm("Bạn muốn đăng xuất?");
  if (r == true) {
    logout()
  }
}

const roleToProfile = () => {
  const currentUser = authenticationService.currentUserValue.roleId;
  if (currentUser === Role.Admin) {
    return "/admin"
  } else if (currentUser === Role.AccStaff) {
    return "/acc-staff"
  } else if (currentUser === Role.InfoStaff) {
    return "/info-staff"
  } else if (currentUser === Role.Rescuer) {
    return "/rescuer"
  } else if (currentUser === Role.Warehouse) {
    return "/warehouse"
  } else {
    return ""
  }
}

function userMenu() {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser) {
    return (
      <Dropdown as={Nav.Item} style={{paddingRight: 20}}>
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
          {
            currentUser.roleId === Role.Admin ? <Dropdown.Item href={roleToProfile() + "/table"} tag={Link}> Trang quản trị </Dropdown.Item>
              : currentUser.roleId === Role.AccStaff ? <Dropdown.Item href={roleToProfile() + "/table"} tag={Link}> Trang quản trị </Dropdown.Item>
                : currentUser.roleId === Role.InfoStaff ? <Dropdown.Item href={roleToProfile() + "/list/location"} tag={Link}> Trang quản trị </Dropdown.Item>
                  : currentUser.roleId === Role.Warehouse ? <Dropdown.Item href={roleToProfile() + "/view"} tag={Link}> Trang quản trị </Dropdown.Item>
                    : currentUser.roleId === Role.Rescuer ? <Dropdown.Item href={roleToProfile() + "/map"} tag={Link}> Trang quản trị </Dropdown.Item>
                      : ""
          }
          <Dropdown.Item href={roleToProfile() + "/edit-profile"} tag={Link}>
            Thay đổi thông tin cá nhân
          </Dropdown.Item>
          <Dropdown.Item onClick={ask} style={{ color: "red" }}>
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

function Header() {
  const currentUser = authenticationService.currentUserValue;
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
    return (
      <div>
        <img
          className="justify-content-center text-center align-content-center"
          style={{
            maxWidth: 80,
            maxHeight: 40,
            marginTop: 0,
          }}
          src={require("assets/img/test-brand.png").default}
          alt="..."
        />
      </div>
    );
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
            <Nav.Item>
              <Nav.Link href="/home/news" className="m-0">
                <i className="nc-icon nc-paper-2" style={{ fontSize: 20 }}></i>
                <span style={{ marginLeft: 5 }}>Tin tức</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/home/map" className="m-0">
                <i className="nc-icon nc-map-big" style={{ fontSize: 20 }}></i>
                <span style={{ marginLeft: 5 }}>Điểm cứu trợ</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/home/request/" className="m-0">
                <i className="nc-icon nc-email-83" style={{ fontSize: 20 }}></i>
                <span style={{ marginLeft: 5 }}>Yêu cầu cứu trợ</span>
              </Nav.Link>
            </Nav.Item>
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