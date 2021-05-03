import React from "react"
import {
    Input,
} from "reactstrap";
// react-bootstrap components
import {
    Button,
    Card,
    Form,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
const validNumberRegex = RegExp(
    /^[0-9]*$/i
);

const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{1,})$/i
);

const validNameRegex = RegExp(
    /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/i
);
const validPhoneRegex = RegExp(
    /^\d{10,11}$/i
);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
};

class GuestRequest extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            form: [
                {
                    categoryId: "",
                    name: "",
                    quantity: 1,
                },
            ],
            lng: "",
            lat: "",
            list: this.requestList,
            errors: {
                representativeName: "",
                representativePhone: "",
                numberOfPeople: "",
            },
            qa: {
                senderName: "",
                senderPhone: "",
                senderEmail: "",
                content: "",
            }
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleEditFieldOfItem = this.handleEditFieldOfItem.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.remove = this.remove.bind(this)
        this.handleSendQA = this.handleSendQA.bind(this)
        this.handleChangeQA = this.handleChangeQA.bind(this)
    }

    requestList = {
        address: "",
        longitude: "",
        latitude: "",
        numberOfPeople: "",
        representativeName: "",
        representativePhone: "",
        productRequests: [
            {
                categoryId: "",
                productName: "",
                quantity: 1,
            },
        ]
    }

    componentDidMount = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log(position.coords);
                    this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                }
            )
        } else {
            error => console.log(error)
        }
    }

    handleChangeQA(event) {
        const { name, value } = event.target
        let qa = { ...this.state.qa }
        qa[name] = value
        this.setState({ qa }, () => console.log(this.state.qa))
    }

    async handleSendQA(event) {
        event.preventDefault();
        const res = await fetch(
            'http://localhost:8080/common/request/send',
            {
                method: "post",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(this.state.qa)
            }
        );
        if (res.ok) {
            return (
                alert("Cảm ơn góp ý của bạn."),
                this.props.history.push("/home/news")
            )
        } else {
            return alert("Có lỗi xảy ra. Mời bạn thử lại")
        }
    }

    //set value to need
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let errors = this.state.errors;
        switch (name) {
            case "representativeName":
                errors.representativeName = validNameRegex.test(value) ? "" : "Trường không đúng định dạng";
                break;
            case "numberOfPeople":
                errors.numberOfPeople = validNumberRegex.test(value) ? "" : "Trường không đúng định dạng";
                break;
            case "representativePhone":
                errors.representativePhone = validPhoneRegex.test(value) ? "" : "Số điện thoại không đúng";
                break;
            default:
                break;
        }
        const latitude = "latitude"
        const longitude = "longitude"
        let list = { ...this.state.list };
        list[name] = value
        list[latitude] = this.state.lat
        list[longitude] = this.state.lng
        this.setState({ list })
    }

    handleAdd = () => {
        this.setState({
            list: {
                ...this.state.list,
                productRequests: [
                    ...this.state.list.productRequests,
                    {
                        categoryId: "",
                        productName: "",
                        quantity: 1,
                    },
                ]
            }
        });
    };

    remove = (index) => {
        this.setState({
            list: {
                ...this.state.list,
                productRequests: this.state.list.productRequests.filter((_, i) => i !== index)
            }
        });
        // const { list } = this.state;
        // const { productRequests } = list;   

        // const tempList = {
        //     ...list,
        //     productRequests: productRequests.filter((_, i) => i !== index)
        // };
        // //list.productRequests = productRequests.filter((_, i) => i !== index);
        // this.setState({ list: tempList });
    }

    handleEditFieldOfItem = (event, itemIndex, fieldName) => {
        const value = event.target.value;
        const { list } = this.state;
        const { productRequests } = list;
        const item = productRequests[itemIndex];
        item[`${fieldName}`] = value;
        this.setState({ list }, () => console.log(this.state.list.productRequests));

        // this.setState({
        //     list:{
        //         ...this.state.list,
        //         productRequests: this.state.list.productRequests.map((item, index) => {
        //             if (index === itemIndex) {
        //                 return { ...item, [fieldName]: value };

        //             }
        //             return item;              
        //         })
        //     },
        // }, () => console.log(this.state.list));
    };

    async handleSubmit(event) {
        if (validateForm(this.state.errors)) {
            event.preventDefault();
            const res = await fetch(
                'http://localhost:8080/info/location/request/send',
                {
                    method: "post",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify(this.state.list)
                }
            );
            if (res.ok) {
                alert("Send successfully")
            } else {
                alert("Send failed")
            }
        } else alert("Send failed")
    }

    render() {
        const { errors } = this.state;
        console.log(this.state.list.productRequests);
        return (
            <Container fluid>
                <div style={{ margin: 0, paddingBottom: 0, }}>
                    <Row style={{ marginTop: 30 }}>
                        <Col md="8">
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col lg="4">
                                                <Form.Group>
                                                    <label>Họ tên</label>
                                                    <Input
                                                        name="representativeName"
                                                        className="form-control-alternative"
                                                        placeholder="Tên"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                    {errors.representativeName.length > 0 && (
                                                        <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.representativeName}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4">
                                                <Form.Group>
                                                    <label>Số điện thoại</label>
                                                    <Input
                                                        name="representativePhone"
                                                        className="form-control-alternative"
                                                        placeholder="Số điện thoại"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                    {errors.representativePhone.length > 0 && (
                                                        <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.representativePhone}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4">
                                                <Form.Group>
                                                    <label>Số người cần hỗ trợ</label>
                                                    <Input
                                                        name="numberOfPeople"
                                                        className="form-control-alternative"
                                                        placeholder="Số lượng người cần hỗ trợ"
                                                        type="text"
                                                        onBlur={this.handleChange}
                                                        required
                                                    />
                                                    {errors.numberOfPeople.length > 0 && (
                                                        <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.numberOfPeople}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group>
                                            <label>Địa chỉ</label>
                                            <Input
                                                name="address"
                                                className="form-control-alternative"
                                                placeholder="Địa chỉ"
                                                type="text"
                                                onBlur={this.handleChange}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group id="need">
                                            <label>Vật phẩm cần giúp đỡ</label>
                                            <label className="nc-icon nc-simple-add" style={{ marginTop: 13, color: "green", marginLeft: 20 }} onClick={this.handleAdd} >{" "}<a>Thêm</a></label>
                                            {this.state.list.productRequests.map((item, index) => {
                                                return (
                                                    <Row key={index}>
                                                        <Col md="3">
                                                            <select name="categoryId" className="form-control" onBlur={(event) => { this.handleEditFieldOfItem(event, index, 'categoryId'); }}>
                                                                <option>Chọn vật tư cần hỗ trợ</option>
                                                                <option value="1">Nước</option>
                                                                <option value="2">Thực phẩm</option>
                                                                <option value="3">Y tế</option>
                                                                <option value="4">Quần áo</option>
                                                                <option value="5">Khác</option>
                                                            </select>
                                                        </Col>
                                                        <Col md="4">
                                                            <Input
                                                                name="productName"
                                                                className="form-control-alternative"
                                                                placeholder="Tên vật phẩm"
                                                                onChange={(event) => { this.handleEditFieldOfItem(event, index, 'productName'); }}
                                                                type="text"
                                                                required
                                                            />
                                                        </Col>
                                                        <Col md="4">
                                                            <Input
                                                                name="quantity"
                                                                className="form-control-alternative"
                                                                placeholder="Số lượng"
                                                                type="text"
                                                                onChange={(event) => { this.handleEditFieldOfItem(event, index, 'quantity'); }}
                                                                required
                                                            />
                                                        </Col>
                                                        <Col>
                                                            {this.state.list.productRequests.length > 1 ? <span onClick={(event) => { this.remove(index) }} className="row row-space">
                                                                <i className="nc-icon nc-simple-delete" style={{ marginTop: 19, fontWeight: "bolder", color: "red" }} />
                                                                <i style={{ marginTop: 15, fontWeight: "bolder", color: "red" }}> {" "}Xóa</i>
                                                            </span> : ""}
                                                        </Col>
                                                    </Row>
                                                );
                                            })}
                                            <Row>
                                                <Col md="2">
                                                    <Button
                                                        className="btn-fill pull-right"
                                                        type="submit"
                                                        variant="info"
                                                    >  Create </Button>
                                                </Col>
                                            </Row>


                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4" className="text-center">
                            <Card>
                                <Card.Header><strong style={{ fontSize: 20 }}>Góp ý</strong></Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSendQA}>
                                        <Form.Group>
                                            <Row>
                                                <Col lg="3">
                                                    <label style={{ paddingTop: 12 }}>Họ tên</label>
                                                </Col>
                                                <Col lg="9">
                                                    <Input
                                                        type="text"
                                                        name="senderName"
                                                        placeholder="Họ tên"
                                                        onChange={this.handleChangeQA}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <label style={{ paddingTop: 12 }}>Số điện thoại</label>
                                                </Col>
                                                <Col lg="9">
                                                    <Input
                                                        type="text"
                                                        name="senderPhone"
                                                        placeholder="Số điện thoại"
                                                        onChange={this.handleChangeQA}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <label style={{ paddingTop: 12 }}>Email</label>
                                                </Col>
                                                <Col lg="9">
                                                    <Input
                                                        type="text"
                                                        name="senderEmail"
                                                        placeholder="Email"
                                                        onChange={this.handleChangeQA}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <label style={{ paddingTop: 12 }}>Nội dung</label>
                                                </Col>
                                                <Col lg="9">
                                                    <textarea
                                                        className="form-control"
                                                        name="content"
                                                        placeholder="Nội dung"
                                                        rows="3"
                                                        cols="51"
                                                        onChange={this.handleChangeQA}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Button type="submit" className="btn-fill" variant="success">Góp ý</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {/* <MessengerCustomerChat
                        pageId="100007595769967"
                        appId="897082250840822"
                        htmlRef="http://localhost:3000/home/request/"
                    /> */}
                </div>
            </Container>
        )
    }
}

export default GuestRequest