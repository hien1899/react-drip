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
            'http://13.212.33.166/news/create',
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
                                                    <label>Ti??u ?????</label>
                                                    <Input
                                                        name="title"
                                                        className="form-control-alternative"
                                                        placeholder="Ti??u ?????"
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
                                                    <label>T??m t???t</label>
                                                    <Input
                                                        name="shortDescription"
                                                        className="form-control-alternative"
                                                        placeholder="T??m t???t"
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
                                                    <label>Ng?????i t???o</label>
                                                    <Input
                                                        name="creator"
                                                        className="form-control-alternative"
                                                        placeholder="Ng?????i t???o"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Th??? lo???i</label>
                                                    <select name="genreId" className="form-control" onBlur={this.handleChange}>
                                                        <option value="1">Ch??nh s??ch-Quy???t ?????nh</option>
                                                        <option value="2">Th??ng tin c???u tr???</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>H??nh ???nh</label>
                                                    <Input
                                                        name="imageBase64"
                                                        className="form-control-alternative btn-fill btn-light"
                                                        placeholder="H??nh ???nh"
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
                                        <Button className="btn-fill pull-right" type="submit" variant="info">Th??m tin t???c</Button>
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
