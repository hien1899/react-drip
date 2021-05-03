import React from "react";
import { CardBody, Input } from "reactstrap";
import { Link } from "react-router-dom";
// react-bootstrap components
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "../../assets/css/home/news.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Policy from './Policy.js'
import RescuerInfo from './RescueInfo.js'
import Modal from 'react-awesome-modal';
import HomeSidebar from "components/Sidebar/HomeSidebar.js"
import SwiftSlider from 'react-swift-slider'

const data = [
  { 'id': '1', 'src': 'https://img.nhandan.com.vn/Files/Images/2020/11/05/nhadanngap-1604591414304.jpg' },
  { 'id': '2', 'src': 'https://img.nhandan.com.vn/Files/Images/2020/11/09/a1-1604910872771.jpg' },
  { 'id': '3', 'src': 'https://img.nhandan.com.vn/Files/Images/2020/10/20/IMG_E7249-1603180104808.JPG' },
];

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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
    return (
      <div className="container-fluid">
        <Row>
          <Col lg="9">
            <div style={{ margin: 0, paddingBottom: 0, }}>
              <Row style={{ paddingTop: 30 }}>
                <Col lg="12">
                    <SwiftSlider data={data} height="600" showDots={true}/>
                    <br/>
                    <br/>       
                </Col>
              </Row>
              <Row className="row-row">
                <Col lg="12" className="border-top">
                  <Tabs>
                    <TabList>
                      <Tab>Chính sách</Tab>
                      <Tab>Thông tin cứu trợ</Tab>
                    </TabList>
                    <TabPanel>
                      <div>
                        <Policy />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <RescuerInfo />
                    </TabPanel>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg="3">
            <HomeSidebar />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
