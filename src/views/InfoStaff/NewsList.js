import * as React from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  UncontrolledTooltip,
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
  Form,
  Row,
  Col,
  Collapse,
  Accordion
} from "react-bootstrap";

import { Markup } from 'interweave';
import "../../assets/css/light-bootstrap-dashboard-react.css"
import { Dropdown } from "bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import Moment from 'moment';

class News extends React.Component {
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
      },
      renderChildren: false,
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
    const response = await fetch('http://localhost:8080/news/view?page=' + this.state.pageId, {
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
    console.log(this.state.accounts)
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
      "http://localhost:8080/admin/account/view/filter?name=" + this.state.item.filter_name + "&email=" + this.state.item.filter_email +
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
  }

  async handleClickPagination(index) {
    const currentUser = authenticationService.currentUserValue;
    const response = await fetch(`http://localhost:8080/news/view?page=${index}`, {
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
      const response = await fetch(`http://localhost:8080/news/view?page=${nextPageId}`, {
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
      const response = await fetch(`http://localhost:8080/news/view?page=${nextPageId}`, {
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

  async remove(new_id) {
    const currentUser = authenticationService.currentUserValue;
    await fetch(`http://localhost:8080/news/delete/${new_id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Authorization': "Bearer " + currentUser.accessToken,
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedAccounts = [...this.state.accounts].filter(i => i.accountId !== new_id);
      this.setState({ accounts: updatedAccounts });
    });
  }

  render() {
    const { accounts, isLoading, totalPage } = this.state;
    const newsList = accounts.map(news => {
      return (
        <tr key={news.newsId} className="justify-content-center align-content-center" >
          <td className="border-0 text-center">{news.newsId}</td>
          <td className="border-0" style={{ width: "20%" }}>{news.title}</td>
          <td className="border-0" style={{ width: "50%" }}>
            <Accordion defaultActiveKey="0">
              <span>
                <Accordion.Toggle as={Link} variant="link" eventKey="1"> {news.shortDescription} </Accordion.Toggle>

              </span>
              <Accordion.Collapse eventKey="1">
                <span><Markup content={news.content} /></span>
              </Accordion.Collapse>
            </Accordion>
          </td>
          <td className="border-0 text-center">{news.creator}</td>
          <td className="border-0 text-center">
              {/* <Col>
                <a style={{ fontWeight: 500, color: "green" }} href={"/admin/edit/" + news.newsId} tag={Link}>Edit</a>
              </Col> */}
                <p style={{ fontWeight: 500, color: "red" }} onClick={(event) => this.remove(news.newsId)}>Xóa</p>
          </td>
        </tr>
      );
    });

    const showPage = this.state.listPage.map((index) => {
      return (
        <PaginationItem className={this.state.pageId == index ? "active" : ""} key={index}>
          <PaginationLink
            to={"/info-staff/list/news"}
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
            to={"/info-staff/list/news"}
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
            to={"/info-staff/list/news"}
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
          <div className="clearfix"></div>
          <Row >
            <Col md="12">
              <Card className="striped-tabled-with-hover border-0">
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">Tiêu đề</th>
                        <th className="border-0">Nội dung</th>
                        <th className="border-0">Người tạo</th>
                        <th className="border-0">Tác vụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsList}
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

export default News;
