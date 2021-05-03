import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer absolute px-0 px-lg-3" style={{backgroundColor: "#343A40"}}>
        <Container fluid>
          <nav>
           
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              DRIP, Where everyone gets relief
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
