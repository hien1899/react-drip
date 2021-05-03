import React from "react";
import { Link } from "react-router-dom";
import {
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
} from "reactstrap";

// react-bootstrap components
import {
  Form,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Moment from 'moment';
import "../../assets/css/light-bootstrap-dashboard-react.css"
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";

class ListRescuer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      isLoading: false,
      pageId: 1,
      totalPage: "",
      listPage: [],
      item: {
        filter_name: "",
        filter_email: "",
        filter_start_date: "",
        filter_end_date: ""
      },
      message: ""
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
    const response = await fetch('http://13.212.33.166/account/rescuer/view?page=' + this.state.pageId, {
      method: "get",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + currentUser.accessToken,
        'Access-Control-Allow-Origin': '*',
      },
    });
    const data = await response.json();
    if (data !== null) { this.setState({ accounts: data.data.pageData, isLoading: false, totalPage: data.data.totalPage }); }
    const x = [];
    for (let index = 1; index <= this.state.totalPage; index++) {
      x.push(index)
    }
    this.setState({ listPage: x })
  }

  async remove(id) {
    const currentUser = authenticationService.currentUserValue;
    await fetch(`http://13.212.33.166/account/rescuer/delete/${id}`, {
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


  async handleClickPagination(index) {
    const currentUser = authenticationService.currentUserValue;
    const response = await fetch(`http://13.212.33.166/account/rescuer/view?page=${index}`, {
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
      const response = await fetch(`http://13.212.33.166/account/rescuer/view?page=${nextPageId}`, {
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

  async handleClickPreviousPagination(index, event) {
    if (index > 1) {
      const currentUser = authenticationService.currentUserValue;
      const nextPageId = index - 1;
      const response = await fetch(`http://13.212.33.166/account/rescuer/view?page=${nextPageId}`, {
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
      "http://13.212.33.166/account/rescuer/view/filter?name=" + this.state.item.filter_name + "&email=" + this.state.item.filter_email +
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
    this.setState({ message: data.message })
    if (this.state.message === "Not found" || this.state.message === "Start Date or End Date was error!!!" || this.state.message === "Data error!!!") alert("Không tìm thấy kết quả phù hợp")
    else {
      if (data !== null)
        this.setState({ accounts: data.data.pageData, isLoading: false, totalPage: data.data.totalPage });
      const x = [];
      for (let index = 1; index <= this.state.totalPage; index++) {
        x.push(index)
      }
      this.setState({ listPage: x })
      console.log(this.state.message)
    }
  }


  render() {
    const { accounts, isLoading } = this.state;

    const showPage = this.state.listPage.map((index) => {
      return (
        <PaginationItem className={this.state.pageId == index ? "active" : ""} key={index}>
          <PaginationLink
            to={"/acc-staff/table"}
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
            to={"/acc-staff/table"}
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
            to={"/acc-staff/table"}
            onClick={() => this.handleClickPreviousPagination(this.state.pageId)}
            tag={Link}
          >
            <i className="fas fa-angle-left" />
            <span className="sr-only">Previous</span>
          </PaginationLink>
        </PaginationItem>
      )
    }


    const accountList = accounts.map(account => {
      return (
        <tr key={account.accountId} className="text-center justify-content-center align-content-center">
          <td className="border-0" hidden>{account.accountId}</td>
          <td className="border-0">{account.personResponse.firstname} {account.personResponse.lastname}</td>
          <td className="border-0">{account.personResponse.gender === "Male" ? "Nam" : "Nữ"}</td>
          <td className="border-0">{Moment(account.personResponse.birthday).format('DD-MM-YYYY')}</td>
          <td className="border-0">{account.email}</td>
          <td className="border-0">{account.phone}</td>
          <td className="border-0">{account.status}</td>
          <td className="border-0">
            <Row>
              <Col>
                <a style={{ fontWeight: 500, color: "green" }} href={"/acc-staff/edit/" + account.accountId} tag={Link}>Sửa</a>
              </Col>
              <Col>
                <a style={{ fontWeight: 500, color: "red" }} onClick={() => this.remove(account.accountId)} >Xóa</a>
              </Col>
            </Row>
          </td>
        </tr>
      );
    });

    const activeRoute = (routeName) => {
      return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    return (
      <><Container fluid>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col md="3">
              <Form.Group>
                <label>Tên</label>
                <Input type="text" name="filter_name" placeholder="Tên" className="form-control-alternative" onBlur={this.handleChange} />
              </Form.Group>
            </Col>
            <Col md="3">
              <Form.Group>
                <label>Email</label>
                <Input type="text" name="filter_email" placeholder="Email" className="form-control-alternative" onBlur={this.handleChange} />
              </Form.Group>
            </Col>
            <Col md="2">
              <Form.Group>
                <label>Ngày khởi tạo</label>
                <Input type="date" name="filter_start_date" className="form-control-alternative" onBlur={this.handleChange} />
              </Form.Group>
            </Col>
            <Col md="2">
              <Form.Group>
                <label>Ngày khởi tạo</label>
                <Input type="date" name="filter_end_date" className="form-control-alternative" onBlur={this.handleChange} />
              </Form.Group>
            </Col>
            <Col md="2" className="row justify-content-center align-content-center" style={{ paddingTop: 10 }}>
              <Button className="btn-fill" type="submit" variant="info" >Lọc kết quả</Button>
            </Col>
          </Row>
        </Form>
        <div className="clearfix"></div>
        <Row>
          <Col md="12">
            <Card className="striped-tabled-with-hover border-0">
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0" hidden>ID</th>
                      <th className="border-0">Tên</th>
                      <th className="border-0">Giới tính</th>
                      <th className="border-0">Ngày sinh</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Số điện thoại</th>
                      <th className="border-0">Trạng thái</th>
                      <th className="border-0">Tác vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountList}
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
                    {/* <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem> */}
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}


export default ListRescuer;
