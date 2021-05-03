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
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import "../../assets/css/home/map.css"
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import Footer from '../../components/Footer/HomeFooter.js'
import { Markup } from 'interweave';
import Modal from 'react-awesome-modal';

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
            zoom: 20,
            locationDetail: "",
            supply: [],
            loadMap: false
        };
        this.mapContainer = React.createRef();
    }

    async componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/jamenguyen/ckl9i6g1v0yfg17nrsaexw4om',
            center: [this.state.lngCenter, this.state.latCenter],
            zoom: 18,
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
                        zoom: 18,
                    });
                }
            )
        } else {
            error => console.log(error)
        }
        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken
        })
        map.addControl(directions, 'top-left')

        map.on('load', () => {
            directions.setOrigin([this.state.lngCenter, this.state.latCenter]);
        })
        const currentUser = authenticationService.currentUserValue;
        this.setState({ isLoading: true });
        const response = await fetch("http://13.212.33.166/location/guest/view", {
            method: "get",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
        const data = await response.json();
        if (data !== null) {
            this.setState({ locations: data.data.pageData, isLoading: false, });
        }

        this.state.locations.forEach(
            maker => {
                if (maker.bookingStatus === "pending") {
                    var el = document.createElement('div');
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
                        if (maker.locationId != this.state.locationDetail.locationId) this.setState({ locationDetail: maker, supply: maker.productResponses, loadMap: true })
                        else this.setState({ locationDetail: "", loadMap: false })
                    });
                } else if (maker.bookingStatus === "in_progress") {
                    var el = document.createElement('div');
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
                        if (maker.locationId != this.state.locationDetail.locationId) this.setState({ locationDetail: maker, supply: maker.productResponses, loadMap: true })
                        else this.setState({ locationDetail: "", loadMap: false })
                    });
                }
            }
        );
    };

    render() {

        const supplies = this.state.supply.map(list => {
            return (
                <tr key={list.categoryId}>
                    <td className="border-0">{list.categoryId == 1 ? "Nước" : list.categoryId == 2 ? "Thực phẩm" : list.categoryId == 3 ? "Y tế" : list.categoryId == 4 ? "Quần áo" : "Khác"}</td>
                    <td className="border-0">{list.productName}</td>
                    <td className="border-0">{list.productQuantity}</td>
                </tr>
            );
        });

        const clickMarkerOnMap = () => {
            return (
                <Row>
                    <Col lg="12">
                        <div ref={this.mapContainer} className="map-container" />
                    </Col>
                    <Col style={{ marginLeft: 30 }}>
                        <Card className="striped-tabled-with-hover border-0">
                            <Card.Body className="table-full-width table-responsive px-0">
                                {/* {this.state.locationDetail ?
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
                                                    <td className="border-0">

                                                        <thead>
                                                            <tr>
                                                                <th className="border-0">Category</th>
                                                                <th className="border-0">Product</th>
                                                                <th className="border-0">Quantity</th>
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
                                } */}

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>)
        }
        return (
            <Container fluid>
                <div style={{ margin: 0, paddingBottom: 0, }}>
                    {clickMarkerOnMap()}
                </div>
            </Container>
        )
    }
}
export default MapPage;