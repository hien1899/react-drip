import React from "react"
import { Link } from "react-router-dom"
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
import { Markup } from 'interweave';
import NewsDetail from "../../views/Home/NewsDetail"

class HomeSidebar extends React.Component {
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
            showDetail: false
        };
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const response = await fetch('http://localhost:8080/news/guest/view/top', {
            method: "get",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

        const data = await response.json();
        if (data !== null)
            this.setState({ news: data.data?.pageData, isLoading: false });
    }

    render() {

        const topNews = this.state.news.map((news, index) => {
            return (
                <>
                    <Row key={index}>
                        <Nav.Link className="news_link_top" href={"/home/tin-tuc/" + news.newsId} tag={Link}>
                            {news.title}
                        </Nav.Link>
                        <Markup content={news.shortDescription} />
                    </Row>
                    {index === this.state.news.length - 1 ? "" : <hr />}
                </>
            )
        })

        return (
            <Container fluid>
                <Card style={{ padding: "0 10px" }}>
                    <Card.Body>
                        <label style={{ fontSize: 20 }}>3 điều cần ghi nhớ</label>
                        <p>An toàn la trên hết</p>
                        <p>Luôn giữ lạc với mọi người</p>
                        <p>Luôn tận tình hỗ trợ người dân</p>
                        <hr></hr>
                        <Row>
                            <label style={{ fontSize: 20 }}>Thông tin liên hệ</label>
                        </Row>
                        <br />
                        <Row style={{ fontWeight: "bold" }}>
                            <Col>Số điện thoại</Col>
                            <Col>Tổng đài viên</Col>
                        </Row>
                        <Row>
                            <Col>0964 437 021</Col>
                            <Col>Nguyễn Ngọc Hiển</Col>
                        </Row>
                        <Row>
                            <Col>0399 919 992</Col>
                            <Col>Trần Đức Nam</Col>
                        </Row>
                        <Row>
                            <Col>0963 728 627</Col>
                            <Col>Nguyễn Tuấn Anh</Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <label style={{ fontSize: 20 }}>Tin tức được xem nhiều</label>

                        </Row>
                        <br />
                        {topNews}
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default HomeSidebar