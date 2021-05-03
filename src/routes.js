//Admin
import StaffList from "views/Admin/StaffList.js";
import Dashboard from "views/Dashboard.js";
import EditStaff from "views/Admin/EditStaff.js";
import CreateStaff from "views/Admin/CreateStaff.js";
import CommonRequest from "views/Admin/CommonRequest.js"
//Account Staff
import AccDashboard from "views/AccStaff/AccDashboard.js";
import CreateRescuer from "views/AccStaff/CreateRescuer.js";
import EditRescuer from "views/AccStaff/EditRescuer.js";
import RescuerList from "views/AccStaff/RescuerList.js";
//Info Staff
import CreateLocation from "views/InfoStaff/CreateLocation";
import CreateNews from "views/InfoStaff/CreateNews.js";
import InfoDashboard from "views/InfoStaff/InfoDashboard.js";
import LocationList from "views/InfoStaff/LocationList.js";
import NewsList from "views/InfoStaff/NewsList.js";
import EditLocation from "views/InfoStaff/EditLocation.js";
import EditNews from "views/InfoStaff/EditNews.js";
import RequestDetail from "views/InfoStaff/RequestDetail.js"
//Authentication
import Login from "components/Authentication/Login.js";
import ForgotPassword from "components/Authentication/ForgotPassword.js";
import ChangePassword from "components/Authentication/ChangePassword.js";
//Home page-Guest
import GuestMap from "views/Home/Map.js"
import HomePage from "views/Home/HomePage.js";
import GuestRequest from "views/Home/Request.js"
import NewsDetail from "views/Home/NewsDetail.js"
//Rescuer
import RescuerMap from "./views/Rescuer/Map.js"
import Register from "./views/Rescuer/RegisterTeam.js"
import RescuerWarehouse from "./views/Rescuer/Warehouse.js"
//Warehouse
import WarehouseMap from "./views/Warehouse/Map.js"
import WarehouseView from "./views/Warehouse/Warehouse.js"
//Common
import AdminProfile from "./views/Admin/Profile.js"
import AdminEditProfile from "./views/Admin/EditProfile.js"
import AccStaffProfile from "./views/AccStaff/Profile.js"
import AccStaffEditProfile from "./views/AccStaff/EditProfile.js"
import InfoStaffProfile from './views/InfoStaff/Profile.js'
import InfoStaffEditProfile from './views/InfoStaff/EditProfile.js'
import RescuerProfile from './views/Rescuer/Profile.js'
import RescuerEditProfile from './views/Rescuer/EditProfile.js'
import WarehouseProfile from './views/Warehouse/Profile.js'
import WarehouseEditProfile from './views/Warehouse/EditProfile.js'
const dashboardRoutes = [
  //Admin
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/edit",
    name: "Sửa thông tin nhân viên",
    icon: "nc-icon nc-notes",
    component: EditStaff,
    layout: "/admin",
  },
  {
    path: "/create",
    name: "Thêm nhân viên",
    icon: "nc-icon nc-bullet-list-67",
    component: CreateStaff,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Danh sách nhân viên",
    icon: "nc-icon nc-bullet-list-67",
    component: StaffList,
    layout: "/admin",
  },
  {
    path: "/common-request",
    name: "Góp ý",
    icon: "nc-icon nc-bullet-list-67",
    component: CommonRequest,
    layout: "/admin",
  },
  //Account Staff
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: AccDashboard,
    layout: "/acc-staff",
  },
  {
    path: "/table",
    name: "Rescuer List",
    icon: "nc-icon nc-bullet-list-67",
    component: RescuerList,
    layout: "/acc-staff",
  },
  {
    path: "/add",
    name: "Create Rescuer",
    icon: "nc-icon nc-bullet-list-67",
    component: CreateRescuer,
    layout: "/acc-staff",
  },
  {
    path: "/edit",
    name: "Edit Rescuer",
    icon: "nc-icon nc-bullet-list-67",
    component: EditRescuer,
    layout: "/acc-staff",
  },
  //Info Staff
  {
    path: "/list/request",
    name: "Request",
    icon: "nc-icon nc-chart-pie-35",
    component: RequestDetail,
    layout: "/info-staff",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: InfoDashboard,
    layout: "/info-staff",
  },
  {
    path: "/list/location",
    name: "Location List",
    icon: "nc-icon nc-bullet-list-67",
    component: LocationList,
    layout: "/info-staff",
  },
  {
    path: "/list/news",
    name: "News List",
    icon: "nc-icon nc-bullet-list-67",
    component: NewsList,
    layout: "/info-staff",
  },
  {
    path: "/add/location",
    name: "Create Location",
    icon: "nc-icon nc-bullet-list-67",
    component: CreateLocation,
    layout: "/info-staff",
  },
  {
    path: "/add/news",
    name: "Create News",
    icon: "nc-icon nc-bullet-list-67",
    component: CreateNews,
    layout: "/info-staff",
  },
  {
    path: "/edit/location",
    name: "Edit Location",
    icon: "nc-icon nc-atom",
    component: EditLocation,
    layout: "/info-staff",
  },
  {
    path: "/edit/news",
    name: "Edit News",
    icon: "nc-icon nc-atom",
    component: EditNews,
    layout: "/info-staff",
  },
  //Authentication
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-atom",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    icon: "nc-icon nc-atom",
    component: ForgotPassword,
    layout: "/auth",
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    icon: "nc-icon nc-atom",
    component: ChangePassword,
    layout: "/auth",
  },
  //Home page
  {
    path: "/news",
    name: "Home",
    icon: "nc-icon nc-atom",
    component: HomePage,
    layout: "/home",
  },
  {
    path: "/map",
    name: "Map",
    icon: "nc-icon nc-map-big",
    component: GuestMap,
    layout: "/home",
  },
  {
    path: "/request",
    name: "Request",
    icon: "nc-icon nc-map-big",
    component: GuestRequest,
    layout: "/home",
  },
  {
    path: "/tin-tuc",
    name: "NewsDetail",
    icon: "nc-icon nc-map-big",
    component: NewsDetail,
    layout: "/home",
  },
  //Rescuer
  {
    path: "/map",
    name: "Map",
    icon: "nc-icon nc-map-big",
    component: RescuerMap,
    layout: "/rescuer"
  },
  {
    path: "/register",
    name: "Register",
    icon: "nc-icon nc-map-big",
    component: Register,
    layout: "/rescuer"
  },
  {
    path: "/warehouse",
    name: "Warehouse",
    icon: "nc-icon nc-map-big",
    component: RescuerWarehouse,
    layout: "/rescuer"
  },
  //Warehouse
  {
    path: "/map",
    name: "Map",
    icon: "nc-icon nc-map-big",
    component: WarehouseMap,
    layout: "/warehouse"
  },
  {
    path: "/view",
    name: "Map",
    icon: "nc-icon nc-map-big",
    component: WarehouseView,
    layout: "/warehouse"
  },
  //Common
  {
    path: "/profile",
    name: "Profile",
    component: AdminProfile,
    layout: "/admin"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: AdminEditProfile,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "Profile",
    component: AccStaffProfile,
    layout: "/acc-staff"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: AccStaffEditProfile,
    layout: "/acc-staff"
  },
  {
    path: "/profile",
    name: "Profile",
    component: InfoStaffProfile,
    layout: "/info-staff"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: InfoStaffEditProfile,
    layout: "/info-staff"
  },
  {
    path: "/profile",
    name: "Profile",
    component: RescuerProfile,
    layout: "/rescuer"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: RescuerEditProfile,
    layout: "/rescuer"
  },
  {
    path: "/profile",
    name: "Profile",
    component: WarehouseProfile,
    layout: "/warehouse"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: WarehouseEditProfile,
    layout: "/warehouse"
  },
];

export default dashboardRoutes;
