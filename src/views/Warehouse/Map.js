import React, {
    useRef,
    useEffect,
    useState
} from "react";
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
import { Input } from "reactstrap";
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

import "../../assets/css/home/map.css"

import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZW5ndXllbiIsImEiOiJja2w5aTFsOWQwbThuMm5sYmsxOGpvMXZvIn0.iKP_IXCBVX04R5oAfJrnmQ';


var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};
function success(pos) {
    var crd = pos.coords;
}

function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

class MapPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            isLoading: false,
            lngCenter: "105.83773801627488",
            latCenter: "21.039877103455883",
            zoom: 17,
            locationDetail: "",
            supply: [],
            productIdRequest: {
                productIds: [],
            }

        };
        this.mapContainer = React.createRef();
        this.handleBookClick = this.handleBookClick.bind(this);
        this.handleFinishClick = this.handleFinishClick.bind(this);
        this.handleReport = this.handleReport.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lngCenter, this.state.latCenter],
            zoom: this.state.zoom,
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        latCenter: position.coords.latitude,
                        lngCenter: position.coords.longitude
                    });
                    const userCoordinates = [position.coords.longitude, position.coords.latitude];

                    map.flyTo({
                        center: userCoordinates,
                        zoom: this.state.zoom
                    });
                }
            )
        } else {
            error => console.log(error)
        }

        const currentUser = authenticationService.currentUserValue;
        this.setState({ isLoading: true });
        const response = await fetch('http://13.212.33.166/location/view', {
            method: "get",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + currentUser.accessToken,
                'Access-Control-Allow-Origin': '*',
            },
        });

        const data = await response.json();
        if (data !== null) {
            this.setState({ locations: data.data.pageData, isLoading: false, });
        }

        //add direction to map
        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken
        })
        map.addControl(directions, 'top-left')

        map.on('load', () => {
            directions.setOrigin([this.state.lngCenter, this.state.latCenter]);
        })
        //end add direction to map

        this.state.locations.forEach(
            maker => {
                var el = document.createElement('div');
                if (maker.bookingStatus === "pending") {
                    el.className = 'marker-not-book';
                    const mapB = new mapboxgl.Marker(el)
                        .setLngLat(maker.geo)
                        .setPopup(new AnimatedPopup({
                            offset: 25,
                            openingAnimation: {
                                duration: 1000,
                                easing: 'easeOutBounce'
                            },
                            closingAnimation: {
                                duration: 500,
                                easing: 'easeInOutBack'
                            }
                        }).setText(
                            maker.address
                        )
                        )
                        .addTo(map);
                    mapB.getElement().addEventListener('click', () => {
                        if (maker.locationId != this.state.locationDetail.locationId) this.setState({ locationDetail: maker, supply: maker.productResponses })
                        else this.setState({ locationDetail: "" })
                    });
                } else if (maker.bookingStatus === "in_progress") {
                    el.className = 'marker-book';
                    const mapB = new mapboxgl.Marker(el)
                        .setLngLat(maker.geo)
                        .setPopup(new AnimatedPopup({
                            offset: 25,
                            openingAnimation: {
                                duration: 1000,
                                easing: 'easeOutBounce'
                            },
                            closingAnimation: {
                                duration: 500,
                                easing: 'easeInOutBack'
                            }
                        }).setText(
                            maker.address
                        )
                        )
                        .addTo(map);
                    mapB.getElement().addEventListener('click', () => {
                        if (maker.locationId != this.state.locationDetail.locationId) this.setState({ locationDetail: maker, supply: maker.productResponses })
                        else this.setState({ locationDetail: "" })
                    });
                }
            }
        );
    };

    async handleReport(event) {
        const currentUser = authenticationService.currentUserValue
        const { productIdRequest } = this.state;
        const res = await fetch(
            "http://13.212.33.166/location/report?location_id=" + this.state.locationDetail.locationId,
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken,
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(productIdRequest),
            }
        );
        if (res.ok) {
            return window.location.reload(false);
        } else {
            return alert("Send failed")
        }
    }

    handleClick(event) {
        const checked = event.target.checked
        const value = event.target.value
        if (checked == true) {
            this.setState({
                productIdRequest: {
                    ...this.state.productIdRequest,
                    productIds: [...this.state.productIdRequest.productIds, value]
                }
            })
        } else {
            var array = [...this.state.productIdRequest.productIds]; // make a separate copy of the array
            var index = array.indexOf(value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ productIdRequest: { productIds: array } });
            }
        }
    }

    async handleBookClick(event) {
        const currentUser = authenticationService.currentUserValue
        const res = await fetch(
            "http://13.212.33.166/location/book?account_id=" + currentUser.id + "&location_id=" + this.state.locationDetail.locationId,
            {
                method: "post",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken,
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
        if (res.ok) {
            return window.location.reload(false);
        } else {
            return alert("Send failed")
        }
    }

    async handleFinishClick(event) {
        event.preventDefault()
        const currentUser = authenticationService.currentUserValue
        const res = await fetch(
            "http://13.212.33.166/location/finish?location_id=" + this.state.locationDetail.locationId,
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken,
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
        if (res.ok) {
            return window.location.reload(false);
        } else {
            return alert("Send failed")
        }

    }

    render() {
        const buttonBook = () => {
            return (
                <Row className="d-flex">
                    <Col md="12" className="mr-auto ml-auto">
                        <Button className="btn-fill pull-right mx-auto d-block" onClick={this.handleBookClick} variant="primary" style={{ width: "100%" }}>Book</Button>
                    </Col>
                </Row>

            )
        }

        const buttonFinish = () => {
            return (
                <div style={{ marginLeft: 20 }}>
                    <Row className="d-flex justify-content-center text-center">
                        <Col md="6">
                            <Button className="btn-fill pull-right" onClick={this.handleFinishClick} variant="success" style={{ width: "100%" }} >Finish</Button>
                        </Col>
                        <Col md="6">
                            <Button className="btn-fill pull-right" onClick={this.handleReport} variant="info" style={{ width: "100%" }} >Report</Button>
                        </Col>
                    </Row>
                </div>
            )
        }

        const supplies = this.state.supply.map(list => {
            return (
                <tr key={list.categoryId}>
                    <td className="border-0">{list.categoryId == 1 ? "Nước" : list.categoryId == 2 ? "Thực phẩm" : list.categoryId == 3 ? "Y tế" : list.categoryId == 4 ? "Quần áo" : "Khác"}</td>
                    <td className="border-0">{list.productName}</td>
                    <td className="border-0">{list.productQuantity}</td>
                    {this.state.locationDetail.bookingStatus === "in_progress" ? <td className="border-0"><Input type="checkbox" value={list.productId} onClick={this.handleClick} /></td> : ""}
                </tr>
            );
        });

        return (
            <Container fluid>
                <div style={{ margin: 0, paddingBottom: 0, }}>
                    <Row style={{ width: "100%", height: "850px" }}>
                        <Col lg="9">
                            <div ref={this.mapContainer} style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }} />
                        </Col>
                        <Col style={{ marginLeft: 10 }}>
                            <Card className="striped-tabled-with-hover border-0">
                                <Card.Body className="table-full-width table-responsive px-0">
                                    {this.state.locationDetail ?
                                        <div>
                                            <Table className="table-hover table-striped">
                                                <tbody>
                                                    <tr>
                                                        <th className="border-0">Name</th>
                                                        <td className="border-0">{this.state.locationDetail.representativeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border-0">Phone</th>
                                                        <td className="border-0">{this.state.locationDetail.representativePhone}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border-0">Address</th>
                                                        <td className="border-0">{this.state.locationDetail.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border-0">People</th>
                                                        <td className="border-0">{this.state.locationDetail.numberOfPeople}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border-0">Supply</th>
                                                        <td className="border-0" style={{ fontSize: 12 }} className="text-center">

                                                            <thead>
                                                                <tr>
                                                                    <th className="border-0">Loại</th>
                                                                    <th className="border-0">Sản phẩm</th>
                                                                    <th className="border-0">Số lượng</th>
                                                                    {this.state.locationDetail.bookingStatus == "in_progress" ? <th className="border-0">Hoàn thành</th> : ""}
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {supplies}
                                                            </tbody>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border-0">Status</th>
                                                        <td className="border-0">{this.state.locationDetail.bookingStatus === "in_progress" ? "In Progress" : this.state.locationDetail.bookingStatus === "pending" ? "Pending" : "Completed"}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            {this.state.locationDetail.bookingStatus === 'pending' ? buttonBook() : buttonFinish()}
                                        </div>
                                        :
                                        <div>
                                            <span>
                                                <b>Quy tắc khi chọn địa điểm: </b>
                                                <ul>
                                                    <li>Chuẩn bị đầy đủ kĩ năng, xử lý khi gặp trường hợp bất ngờ</li>
                                                    <li>Chọn địa điểm gần với vị trí bản thân</li>
                                                    <li>Chuẩn bị đầy đủ vật tư cần thiết</li>
                                                    <li>Cố gắng ưu tiên địa điểm có độ ưu tiên cao</li>
                                                </ul>
                                            </span>
                                            <hr></hr>
                                            <span>
                                                <b>Quy tắc ứng xử: </b>
                                                <ul>
                                                    <li>Vui vẻ, nhiệt tình với đồng đội</li>
                                                    <li>Sẵn sàng giúp đỡ bất kể khó khăn</li>
                                                    <li>Đem lại hy vọng và niềm tin cho mọi người</li>
                                                </ul>
                                            </span>
                                        </div>
                                    }

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div >
            </Container >
        )
    }
}
export default MapPage;