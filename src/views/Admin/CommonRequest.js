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

import Moment from 'moment';

import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
class CommonRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            accounts: [],
            isLoading: false,
            pageId: 1, totalPage: "",
            listPage: [],
        };
        this.reject = this.reject.bind(this);
        this.accept = this.accept.bind(this);
        this.handleClickPagination = this.handleClickPagination.bind(this);
        this.handleClickNextPagination = this.handleClickNextPagination.bind(this);
        this.handleClickPreviousPagination = this.handleClickPreviousPagination.bind(this);
    }

    async componentDidMount() {
        const currentUser = authenticationService.currentUserValue;
        this.setState({ isLoading: true });
        const response = await fetch('http://localhost:8080/common/request/view?page=' + this.state.pageId, {
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

    async handleClickPagination(index) {
        const currentUser = authenticationService.currentUserValue;
        const response = await fetch(`http://localhost:8080/common/request/view?page=${index}`, {
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
            const response = await fetch(`http://localhost:8080/common/request/view?page=${nextPageId}`, {
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
            const response = await fetch(`http://localhost:8080/common/request/view?page=${nextPageId}`, {
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

    async reject(id) {
        const currentUser = authenticationService.currentUserValue;
        await fetch(`http://localhost:8080/common/request/reject?id=${id}`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + currentUser.accessToken,
                'Content-Type': 'application/json'
            }
        }).then( () => {
            location.reload()
        })
        // }).then(() => {
        //   let updatedAccounts = [...this.state.accounts].filter(i => i.requestId !== id);
        //   this.setState({ accounts: updatedAccounts });
        // });
    }

    async accept(id) {
        const currentUser = authenticationService.currentUserValue;
        await fetch(`http://localhost:8080/common/request/confirm?id=${id}`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + currentUser.accessToken,
                'Content-Type': 'application/json'
            }
        }).then( () => {
            location.reload()
        })
        // }).then(() => {
        //   let updatedAccounts = [...this.state.accounts].filter(i => i.requestId !== id);
        //   this.setState({ accounts: updatedAccounts });
        // });
    }


    render() {
        const { accounts } = this.state;

        const accountList = accounts.map(account => {
            return (

                <tr key={account.requestId} className="text-center justify-content-center align-content-center">
                    <td className="border-0">{account.senderName}</td>
                    <td className="border-0">{account.senderEmail}</td>
                    <td className="border-0">{account.senderPhone}</td>
                    <td className="border-0">{account.content}</td>
                    <td className="border-0">{account.status}</td>
                    {account.status === "pending" ? <td className="border-0">
                        <Row>
                            <Col>
                                <a href="#" style={{ fontWeight: 500, color: "green" }} onClick={(event) => {this.accept(account.requestId)}} >Duyệt</a>
                            </Col>
                            <Col>
                                <a href="#" style={{ fontWeight: 500, color: "red" }} onClick={(event) => {this.reject(account.requestId)}}>Từ chối</a>
                            </Col>
                        </Row>
                    </td> : ""}
                </tr>
            );
        });

        const showPage = this.state.listPage.map((index) => {
            return (
                <PaginationItem className={this.state.pageId == index ? "active" : ""} key={index}>
                    <PaginationLink
                        to={"/admin/common-request"}
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
                        to={"/admin/common-request"}
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
                        to={"/admin/common-request"}
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
                                                <th className="border-0">Họ Tên</th>
                                                <th className="border-0">Email</th>
                                                <th className="border-0">Số điện thoại</th>
                                                <th className="border-0">Nội dung</th>
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
};
export default CommonRequest;
