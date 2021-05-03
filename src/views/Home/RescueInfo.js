import React from "react";
import {
  CardBody,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { Link } from "react-router-dom";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "../../assets/css/home/news.css";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import { Markup } from 'interweave';
import Modal from 'react-awesome-modal';

class RescueInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      isLoading: false,
      pageId: 1,
      totalPage: "",
      listPage: [],
      renderChildren: false,
      visible: false,
      image: [],
    };
    this.handleClickPagination = this.handleClickPagination.bind(this);
    this.handleClickNextPagination = this.handleClickNextPagination.bind(this);
    this.handleClickPreviousPagination = this.handleClickPreviousPagination.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    const currentUser = authenticationService.currentUserValue;
    this.setState({ isLoading: true });
    const response = await fetch('http://13.212.33.166/news/guest/view/rescue?page=' + this.state.pageId, {
      method: "get",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await response.json();
    if (data !== null)
      this.setState({ news: data.data.pageData, isLoading: false, totalPage: data.data.totalPage });
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
  }

  async handleClickPagination(index) {
    const response = await fetch(`http://13.212.33.166/news/guest/view/rescue?page=${index}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (data !== null)
      this.setState({ news: data.data.pageData, isLoading: false, pageId: index });
  }

  async handleClickNextPagination(index) {
    if (!index) index = 1;
    if (index < this.state.totalPage) {
      const nextPageId = index + 1;
      const response = await fetch(`http://13.212.33.166/news/guest/view/rescue?page=${nextPageId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (data !== null)
        this.setState({ news: data.data.pageData, isLoading: false, pageId: nextPageId });
    }
  }

  async handleClickPreviousPagination(index) {
    if (index > 1) {
      const nextPageId = index - 1;
      const response = await fetch(`http://13.212.33.166/news/guest/view/rescue?page=${nextPageId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (data !== null)
        this.setState({ news: data.data.pageData, isLoading: false, pageId: nextPageId });
    }
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  render() {
    const { news, isLoading, totalPage } = this.state;

    const newsList = news.map((news, index) => {
      return (
        <Col lg="12" key={index}>
          <Row>
            <Col md="3">
              <img
                className="justify-content-center text-center align-content-center"
                style={{
                  maxWidth: "80%",
                  marginTop: 0,
                  float: "right"
                }}
                src={'data:image/png;base64,'+ news.image}
                alt="..."
              />
            </Col>
            <Col md="7">
              <div>
                {/* <Link className="news_link" onClick={() => this.openModal()}> */}
                <Nav.Link className="news_link" href={"/home/tin-tuc/" + news.newsId} tag={Link}>
                  {news.title}
                </Nav.Link>
                <div className="content">
                  <Markup content={news.shortDescription} />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      )
    })

    const showPage = this.state.listPage.map((index) => {
      return (
        <PaginationItem className={this.state.pageId == index ? "active" : ""} key={index}>
          <PaginationLink
            to={"/home/news"}
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
            to={"/home/news"}
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
            to={"/home/news"}
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
      <div>
        <Row className="row-row">
          {newsList}
          {this.state.image.forEach(i => {
            <div>{i}</div>
          })}
        </Row>
        <Pagination
          className="pagination justify-content-end mb-0"
          listClassName="justify-content-end mb-0"
        >
          {previousPagination()}
          {showPage}
          {nextPagination()}
        </Pagination>
      </div>
    );
  }
}
export default RescueInfo;
