import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import authenticationService from 'components/Authentication/RoleBaseAuth/services/AuthenticationService.js';
import history from "components/Authentication/RoleBaseAuth/helper/History"
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
          {/* <Dropdown.Item href="/info-staff/profile" tag={Link}>
            Profile
        </Dropdown.Item> */}
          <Dropdown.Item href="/info-staff/edit-profile" tag={Link}>
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

function ask() {
  var r = confirm("Bạn muốn đăng xuất?");
  if (r == true) {
    logout()
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listNotification: [],
      count: 0,
    }
  }

  async componentDidMount() {
    const currentUser = authenticationService.currentUserValue.accessToken;
    this.setState({ isLoading: true });
    const response = await fetch('http://13.212.33.166/info/location/request/pending', {
      method: "get",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + currentUser,
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await response.json();
    if (data !== null)
      this.setState({ listNotification: data.data });
    console.log(this.state.listNotification)
    this.setState({ count: this.state.listNotification.length })
  }


  render() {
    const { listNotification } = this.state
    const showNotification = listNotification.map(item => {
      return (
        <Dropdown.Item href={"/info-staff/list/request/" + item.id}>
          <p>{item.name} sent request</p>
        </Dropdown.Item>

      )
    })

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

    return (
      <Navbar bg="light" expand="lg">
        {this.state.item}
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

            </Nav>
            <Nav className="ml-auto" navbar>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  aria-expanded={false}
                  aria-haspopup={true}
                  data-toggle="dropdown"
                  as={Nav.Link}
                  id="dropdown-67443507"
                  variant="default"
                  className="m-0"
                >
                  <i className="nc-icon nc-bell-55"></i>
                  <span className="notification">{this.state.count}</span>
                  <span className="d-lg-none ml-1">Notification</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {showNotification}
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Item>{auth()}</Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
