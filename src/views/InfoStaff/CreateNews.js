import React from "react";
import {
    Input,
} from "reactstrap";
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
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";

class CreateNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.listNews,
            isLoading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    listNews = {
        genreId: "",
        title: "",
        content: "",
        creator: "",
        imageBase64: "",
        shortDescription: ""
    }

    async handleSubmit(event) {
        event.preventDefault();
        const currentUser = authenticationService.currentUserValue.accessToken
        const res = await fetch(
            'http://localhost:8080/news/create',
            {
                method: "post",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + currentUser,
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(this.state.item)
            }
        );
        if (res.ok) {
            return (
                alert("Create successfully"),
                history.push('/info-staff/list/news')
            )
        } else {
            return alert("Create failed")
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;   
        const files = target.files;
        let item = { ...this.state.item };
        if(name==="imageBase64"){            
            let reader = new FileReader();
            reader.readAsDataURL(files[0])
            reader.onload = (event) => {
                item[name] = reader.result
            }
            console.log(value)
        }
        else item[name] = value;
        this.setState({ item });
        console.log(this.state.item)
    }

    render() {
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col md="8">
                            <Card>
                                <Card.Header>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Tiêu đề</label>
                                                    <Input
                                                        name="title"
                                                        className="form-control-alternative"
                                                        placeholder="Tiêu đề"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Tóm tắt</label>
                                                    <Input
                                                        name="shortDescription"
                                                        className="form-control-alternative"
                                                        placeholder="Tóm tắt"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Người tạo</label>
                                                    <Input
                                                        name="creator"
                                                        className="form-control-alternative"
                                                        placeholder="Người tạo"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Thể loại</label>
                                                    <select name="genreId" className="form-control" onBlur={this.handleChange}>
                                                        <option value="1">Chính sách-Quyết định</option>
                                                        <option value="2">Thông tin cứu trợ</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Hình ảnh</label>
                                                    <Input
                                                        name="imageBase64"
                                                        className="form-control-alternative btn-fill btn-light"
                                                        placeholder="Hình ảnh"
                                                        type="file"
                                                        onChange={this.handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group>
                                                    <label>Content</label>
                                                    <Form.Control
                                                        name="content"
                                                        placeholder="Here can be your content"
                                                        rows="10"
                                                        as="textarea"
                                                        onBlur={this.handleChange}
                                                    ></Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button className="btn-fill pull-right" type="submit" variant="info">Thêm tin tức</Button>
                                        <div className="clearfix"></div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </>
        );
    }
}

export default CreateNews;
