import React, { Component } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";

import RescuerNavbar from "components/Navbars/RescuerNavbar.js";
import Footer from "components/Footer/HomeFooter";
import Sidebar from "components/Sidebar/Sidebar";

import routes from "routes.js";
import sidebarRoutes from "components/Sidebar/RescuerSidebarRoutes";
import sidebarImage from "assets/img/sidebar-3.jpg";

import userService from "../components/Authentication/RoleBaseAuth/services/UserService.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

function Home() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/rescuer") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={sidebarRoutes} />
        <div className="main-panel" ref={mainPanel}>
          <RescuerNavbar />
          <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </>
    // <div className="container-flex">
    //   <RescuerNavbar />
    //   <div className="" ref={mainPanel}>

    //     <div className="content">
    //       <Switch>{getRoutes(routes)}</Switch>
    //     </div>
    //     {/* <Footer /> */}
    //   </div>
    // </div>
  );
}

export default Home;
