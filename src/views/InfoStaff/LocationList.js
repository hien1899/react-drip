import React from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Input,
} from "reactstrap";

// react-bootstrap components
import {
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";

import "../../assets/css/light-bootstrap-dashboard-react.css"
import Moment from 'moment';

import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";

class ListLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      isLoading: false,
      pageId: 1, totalPage: "",
      listPage: [],
      item: {
        filter_name: "",
        filter_email: "",
        filter_start_date: "",
        filter_end_date: ""
      }
    };
    this.remove = this.remove.bind(this);
    this.handleClickPagination = this.handleClickPagination.bind(this);
    this.handleClickNextPagination = this.handleClickNextPagination.bind(this);
    this.handleClickPreviousPagination = this.handleClickPreviousPagination.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    const currentUser = authenticationService.currentUserValue;
    this.setState({ isLoading: true });
    const response = await fetch('http://13.212.33.166/info/location/all?page=' + this.state.pageId, {
      method: "get",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + currentUser.accessToken,
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await response.json();
    if (data !== null)
      this.setState({ accounts: data.data.pageData, isLoading: false, totalPage: data.data.totalPage });

    const x = [];
    for (let index = 1; index <= this.state.totalPage; index++) {
      x.push(index)
    }
    this.setState({ listPage: x })
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    const currentUser = authenticationService.currentUserValue;
    event.preventDefault();
    const { item } = this.state;
    const response = await fetch(
      "http://13.212.33.166/admin/account/view/filter?name=" + this.state.item.filter_name + "&email=" + this.state.item.filter_email +
      "&start_date=" + this.state.item.filter_start_date + "&end_date=" + this.state.item.filter_end_date,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + currentUser.accessToken,
          "Access-Control-Allow-Origin": "*",
        }
      }
    );
    const data = await response.json();
    if (data !== null)
      this.setState({ accounts: data.data.pageData, isLoading: false, totalPage: data.data.totalPage });
    const x = [];
    for (let index = 1; index <= this.state.totalPage; index++) {
      x.push(index)
    }
    this.setState({ listPage: x })
    var options = {
      body: 'Do you like my body?',
      renotify: true
    }
    
    var n = new Notification('Test notification',options);
  }
  
  async handleClickPagination(index) {
    const currentUser = authenticationService.currentUserValue;
    const response = await fetch(`http://13.212.33.166/info/location/all?page=${index}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Authorization': "Bearer " + currentUser.accessToken,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (data !== null)
      this.setState({ accounts: data.data.pageData, isLoading: false, pageId: index });
  }

  async handleClickNextPagination(index) {
    if (!index) index = 1;
    if (index < this.state.totalPage) {
      const currentUser = authenticationService.currentUserValue;
      const nextPageId = index + 1;
      const response = await fetch(`http://13.212.33.166/info/location/all?page=${nextPageId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Authorization': "Bearer " + currentUser.accessToken,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (data !== null)
        this.setState({ accounts: data.data.pageData, isLoading: false, pageId: nextPageId });
    }
  }

  async handleClickPreviousPagination(index) {
    if (index > 1) {
      const currentUser = authenticationService.currentUserValue;
      const nextPageId = index - 1;
      const response = await fetch(`http://13.212.33.166/info/location/all?page=${nextPageId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Authorization': "Bearer " + currentUser.accessToken,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (data !== null)
        this.setState({ accounts: data.data.pageData, isLoading: false, pageId: nextPageId });
    }
  }

  async remove(id) {
    const currentUser = authenticationService.currentUserValue;
    await fetch(`http://13.212.33.166/info/location/delete/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Authorization': "Bearer " + currentUser.accessToken,
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedAccounts = [...this.state.accounts].filter(i => i.accountId !== id);
      this.setState({ accounts: updatedAccounts });
    });
  }

  render() {
    const { accounts, isLoading, totalPage } = this.state;
    const locationList = accounts.map(location => {
      return (
        <tr key={location.accountId} className="text-center justify-content-center align-content-center" >
          <td className="border-0" hidden>{location.locationId}</td>
          <td className="border-0">{location.representativeName}</td>
          <td className="border-0">{location.representativePhone}</td>
          <td className="border-0">{location.numberOfPeople}</td>
          <td className="border-0">{location.address}</td>
          <td className="border-0">{location.priority == 1 ? "High" : location.priority == 2 ? "Medium" : "Normal"}</td>
          <td className="border-0">{location.bookingStatus}</td>
          <td className="border-0">{location.rescuingStatus}</td>
          <td className="border-0">{location.createdDate}</td>
          <td className="border-0">{location.updatedDate}</td>
          <td className="border-0">
          <a style={{ fontWeight: 500, color: "green" }} href={"/info-staff/edit/location/" + location.locationId} tag={Link}>S???a</a>
          </td>
        </tr>
      );
    });

    const showPage = this.state.listPage.map((index) => {
      return (
        <PaginationItem className={this.state.pageId == index ? "active" : ""} key={index}>
          <PaginationLink
            to={"/info-staff/list/location"}
            onClick={() => this.handleClickPagination(index)}
            tag={Link}
          >
            {index}
          </PaginationLink>
        </PaginationItem>
      )
    })

    const nextPagination = () => {
      return (
        <PaginationItem hidden={this.state.pageId == this.state.totalPage ? "hidden" : ""}>
          <PaginationLink
            to={"/info-staff/list/location"}
            onClick={() => this.handleClickNextPagination(this.state.pageId)}
            tag={Link}
          >
            <i className="fas fa-angle-right" />
            <span className="sr-only">Next</span>
          </PaginationLink>
        </PaginationItem>
      )
    }

    const previousPagination = () => {
      return (
        <PaginationItem hidden={this.state.pageId == 1 ? "hidden" : ""}>
          <PaginationLink
            to={"/info-staff/list/location"}
            onClick={() => this.handleClickPreviousPagination(this.state.pageId)}
            tag={Link}
          >
            <i className="fas fa-angle-left" />
            <span className="sr-only">Previous</span>
          </PaginationLink>
        </PaginationItem>
      )
    }
    return (
      <>
        <Container fluid>
          {/* <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col md="3">
                <Form.Group>
                  <label>Name</label>
                  <Input type="text" name="filter_name" placeholder="Name" className="form-control-alternative" onChange={this.handleChange} />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group>
                  <label>Email</label>
                  <Input type="text" name="filter_email" placeholder="Email" className="form-control-alternative" onChange={this.handleChange} />
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <label>Start Date</label>
                  <Input type="date" name="filter_start_date" className="form-control-alternative" onChange={this.handleChange} />
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <label>End Date</label>
                  <Input type="date" name="filter_end_date" className="form-control-alternative" onChange={this.handleChange} />
                </Form.Group>
              </Col>
              <Col md="2" className="row justify-content-center align-content-center" style={{ paddingTop: 10 }}>
                <Button className="btn-fill pull-right" type="submit" variant="info" >Filter</Button>
              </Col>
            </Row>
          </Form> */}
          <div className="clearfix"></div>
          <Row >
            <Col md="12">
              <Card className="striped-tabled-with-hover border-0">
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0" hidden>ID</th>
                        <th className="border-0">Ng?????i ?????i di???n</th>
                        <th className="border-0">S??? ??i???n tho???i</th>
                        <th className="border-0">S??? l?????ng</th>
                        <th className="border-0">?????a ch???</th>
                        <th className="border-0">????? ??u ti??n</th>
                        <th className="border-0">Tr???ng th??i</th>
                        <th className="border-0">Tr???ng th??i h??? tr???</th>
                        <th className="border-0">Ng??y t???o</th>
                        <th className="border-0">Ng??y c???p nh???t</th>
                        <th className="border-0">T??c v???</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationList}
                    </tbody>
                  </Table>
                </Card.Body>
                <CardFooter className="py-4">
                  <nav aria-label="...">

                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      {previousPagination()}
                      {showPage}
                      {nextPagination()}
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

}

export default ListLocation;
