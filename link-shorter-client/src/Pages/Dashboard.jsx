import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthUserContext } from "../Contexts/AutUserProvider";
import styles from "../styles/dashboard.module.css";
import { TbSmartHome } from "react-icons/tb";
import { GoLink } from "react-icons/go";
import { IoMdAdd, IoMdTrendingUp } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BsSunFill } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { TbSunMoon } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import AddLink from "./AddLink";
import { getLinkData } from "../services/dashboardApi";
import Loader from "../components/Loader";
import { MdLogout } from "react-icons/md";

const Dashboard = () => {
  const { userAuth, setUserAuth } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showCreateModel, setShowCreateModel] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [userName, setUsername] = useState("");
  const [dateWiseClicks, setDatewiseClicks] = useState();
  const [deviceWiseClicks, setDeviceWiseClicks] = useState();
  const [totalClick, setTotalClicks] = useState(0);
  const [allLinksData, setAllLinksData] = useState();
  const [showLogout, setShowLogout] = useState(false);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const getFormattedDate = () => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    const today = new Date();
    return new Intl.DateTimeFormat("en-US", options).format(today);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getLinksData = async () => {
    try {
      setLoading(true);
      const res = await getLinkData();
      const data = await res.json();
      if (res.status == 401) {
        alert(data.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
      if (res.status == 404) {
        alert(data.message);
        navigate("/login");
        localStorage.removeItem("token");
      }
      if (res.status === 200) {
        // console.log(data.LinkData);
        setAllLinksData(data.LinkData);
        setTotalClicks(data.totalClicks);
        setDatewiseClicks(data.dateWiseClicks);
        setDeviceWiseClicks(data.deviceWiseClicks);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelLogout = () => {
    localStorage.removeItem("token");
    alert("Logout Succesfully");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setUserAuth(false);
      navigate("/");
    }
    getLinksData();
    let userInfo = jwtDecode(localStorage.getItem("token"));
    setUsername(userInfo.username);
    setGreeting(getGreeting());
  }, [location]);

  useEffect(() => {
    if (!userAuth) {
      navigate("/");
    }
  }, [userAuth, setUserAuth]);

  let maxDateWiseClicks = null;
  let maxDeviceWiseClicks = null;
  if (dateWiseClicks) {
    maxDateWiseClicks = Math.max(
      ...dateWiseClicks.map((item) => item.totalClicks),
      0
    );
  }
  if (deviceWiseClicks && Array.isArray(deviceWiseClicks)) {
    const deviceClickValues = deviceWiseClicks.map((item) => {
      if (item && typeof item.clicks === "number") {
        return item.clicks;
      }
      return 0;
    });

    maxDeviceWiseClicks = Math.max(...deviceClickValues);
  }

  const isDashboardActive = location.pathname === "/dashboard";

  return (
    <>
      <div className={styles.main}>
        <div className={styles.sideBar}>
          <h2>Easy link-Shorter</h2>
          <div className={styles.sideContainer}>
            <nav className={styles.sidenavbar}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : "")}
                end
              >
                <TbSmartHome size={25} /> Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/links"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                <GoLink /> Links
              </NavLink>
              <NavLink
                to="/dashboard/analytics"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                <IoMdTrendingUp /> Analytics
              </NavLink>
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                <FiSettings /> Settings
              </NavLink>
            </nav>
          </div>
        </div>
        <div className={styles.board}>
          <div className={styles.topNav}>
            <div className={styles.greetings}>
              <div>
                {greeting === "Good Good Evening" ? (
                  <TbSunMoon
                    size={25}
                    color="#FFC72C"
                    className={styles.greetIcon}
                  />
                ) : (
                  <BsSunFill
                    size={25}
                    color="#FFC72C"
                    className={styles.greetIcon}
                  />
                )}
                <div className={styles.greetingDiv}>
                  <h3>
                    {getGreeting()}, {userName}
                  </h3>
                  <p>{getFormattedDate()}</p>
                </div>
              </div>
              <button className={styles.LogoutBtnV2} onClick={handelLogout}>
                Logout <MdLogout />
              </button>
            </div>
            <div className={styles.userCtrl}>
              <div className={styles.ctrls}>
                <button onClick={() => setShowCreateModel(true)}>
                  <IoMdAdd color="#fff" size={20} /> Create new
                </button>
                <div>
                  <IoSearchOutline size={20} color="#878BA9" />
                  <input type="text" placeholder="Search by remarks" value={search} onChange={(e)=> setSearch(e.target.value)} />
                </div>
              </div>
              <div
                className={styles.userSymbol}
                onClick={() => setShowLogout(!showLogout)}
              >
                {userName.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <button
              className={styles.LogoutBtn}
              style={{ display: showLogout ? "block" : "none" }}
              onClick={handelLogout}
            >
              Logout
            </button>
          </div>
          <div className={styles.sideBarV2}>
            <div className={styles.sideContainer}>
              <nav className={styles.sidenavbar}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  end
                >
                  <TbSmartHome size={25} /> 
                  <span>Dashboard</span>                
                </NavLink>
                <NavLink
                  to="/dashboard/links"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  <GoLink /> 
                  <span>Links</span>
                </NavLink>
                <NavLink
                  to="/dashboard/analytics"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  <IoMdTrendingUp /> 
                  <span>Analytics</span>
                </NavLink>
                <NavLink
                  to="/dashboard/settings"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  <FiSettings /> 
                  <span>Settings</span>
                </NavLink>
              </nav>
            </div>
          </div>
          {isDashboardActive ? (
            <div className={styles.defaultDash}>
              <div className={styles.totalClick}>
                <h2>
                  Total Clicks : <span>{totalClick}</span>
                </h2>
              </div>
              <>
                {" "}
                {loading ? (
                  <Loader />
                ) : (
                  <div className={styles.clicksContinaer}>
                    <div className={styles.dateClick}>
                      <p className={styles.title}>Date-wise Clicks</p>
                      <div className={styles.dateDataCont}>
                        {dateWiseClicks &&
                          dateWiseClicks.map((date) => (
                            <div key={date.date} className={styles.datatoFill}>
                              <p>{date.date}</p>
                              <div className={styles.bardbox}>
                                <div
                                  style={{
                                    width: `${
                                      (date.totalClicks / maxDateWiseClicks) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <p>{date.totalClicks}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className={styles.deviceClick}>
                      <p className={styles.title}>Click Devices</p>
                      <div className={styles.deviceDataCont}>
                        {deviceWiseClicks &&
                          deviceWiseClicks.map(({ device, clicks }) => (
                            <div key={device} className={styles.datatoFill}>
                              <p className={styles.deviceName}>{device}</p>
                              <div className={styles.bardbox}>
                                <div
                                  style={{
                                    width: `${
                                      (clicks / maxDeviceWiseClicks) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <p>{clicks}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}{" "}
              </>
            </div>
          ) : (
            <Outlet context={{ search }} />
          )}
        </div>
        <div className={styles.mobAddbtn}>
          <button onClick={() => setShowCreateModel(true)}><IoMdAdd color="#fff" size={30} /></button>
        </div>
      </div>
      {showCreateModel && (
        <AddLink
          onClose={() => setShowCreateModel(false)}
          onLoad={getLinksData}
        />
      )}
    </>
  );
};

export default Dashboard;
