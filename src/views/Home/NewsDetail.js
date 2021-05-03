import React from "react";
// react-bootstrap components
import HomeSidebar from "components/Sidebar/HomeSidebar.js"
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
class newsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsDetail: "",
            id: "",
            message: "",
            img: "",
            noNews: false,
        }
    }

    async componentDidMount() {
        const id = window.location.pathname.split('/')[(window.location.pathname.split('/').length - 1)];
        this.setState({ id: id });
        const response = await fetch(
            `http://localhost:8080/news/guest/detail?id=${id}`,
            {
                method: "get",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
        const detail = await response.json();

        if (detail.message !== "Server error!!!") {
            this.setState({ newsDetail: detail.data, noNews: false }, () => {
                const image = 'data:image/png;base64,'+ this.state.newsDetail.image
                this.setState({ img: image })
            });
        }
        else {
            this.setState({ newsDetail: "", noNews: true, message: detail.message });
        }
        console.log(this.state.img);
    }

    render() {
        const { newsDetail, noNews, img } = this.state
        return (
            <Container fluid>
                <Row>
                    <Col lg="9">
                        <Container>
                            {this.state.noNews === false
                                ? <div>
                                    <p className="text-center" style={{ fontWeight: 700, fontSize: 36 }}>{newsDetail.title}</p>
                                    <p className="text-black-50" style={{ fontWeight: 600, fontSize: 28 }}><Markup content={newsDetail.shortDescription} /></p>
                                    <br />
                                    <div className="text-center">
                                        <img
                                            style={{
                                                maxWidth: "100%",
                                                marginTop: 0,
                                            }}
                                            src={this.state.img}
                                            alt="..."
                                        />
                                    </div>
                                    <br />
                                    <br />
                                    <div style={{fontSize: "20px"}}>
                                        <Markup content={newsDetail.content} />
                                    </div>
                                </div>
                                : <div><p>Không tìm thấy tin tức bạn cần</p></div>}
                        </Container>
                    </Col>
                    <Col lg="3">
                        <HomeSidebar />
                    </Col>
                </Row>

            </Container >
        )
    }
}
export default newsDetail