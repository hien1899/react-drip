import React from "react"
import authenticationService from "../../components/Authentication/RoleBaseAuth/services/AuthenticationService.js"
import { Input } from "reactstrap";
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

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: this.profile,
        }
    }

    profile = {
        profileId: "",
        firstname: "",
        address: "",
        email: "",
        lastname: "",
        city: "",
        country: "",
        description: "",
        phone: "",
        gender: "",
        birthday: ""
    }

    async componentDidMount() {
        const currentUser = authenticationService.currentUserValue;
        this.setState({ isLoading: true });
        const response = await fetch('http://13.212.33.166/common/profile?id=' + currentUser.id, {
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
            this.setState({ profile: data.data });
        console.warn(this.state.profile)
    }


    render() {
        return (
            <Container fluid>
                <Row min-vh-100 m-0 d-flex flex-column justify-content-center>
                    <Col md="6" className="mr-auto ml-auto">
                        <Card className="card-user">
                            <div className="card-image">
                                <img
                                    alt="..."
                                    src={
                                        require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                                            .default
                                    }
                                ></img>
                            </div>
                            <Card.Body>
                                <div className="author">
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        <img
                                            alt="..."
                                            className="avatar border-gray"
                                            src={require("assets/img/faces/face-3.jpg").default}
                                        ></img>
                                        <p className="text-center">MSNV: {this.state.profile.profileId}</p>
                                        <p className="title" style={{ fontSize: 22 }}>{this.state.profile.firstname} {this.state.profile.lastname}</p>
                                    </a>
                                </div>
                                <Row>
                                    <Col md="6">
                                        <p className="text-center"><label>Ngày sinh: </label> {this.state.profile.birthday}</p>
                                    </Col>
                                    <Col md="6">
                                        <p className="text-center"><label>Giới tính</label> {this.state.profile.gender == true ? "Nam" : "Nữ"}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <p className="text-center"><label>Email: </label> {this.state.profile.email}</p>
                                    </Col>
                                    <Col md="6">
                                        <p className="text-center"><label>Số điện thoại: </label> {this.state.profile.phone}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className="text-center"><label>Address:{" "}</label> {this.state.profile.address}, {this.state.profile.city}, {this.state.profile.country}</p>
                                    </Col>
                                </Row>
                                <p className="description text-center">
                                    {this.state.profile.description}
                                </p>
                            </Card.Body>
                            <hr></hr>
                            <div className="button-container mr-auto ml-auto">
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-facebook-square"></i>
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-twitter"></i>
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-google-plus-square"></i>
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Profile