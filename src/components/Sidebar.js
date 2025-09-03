import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../components/sidebar.css";
import { menuItems } from "./Menuitem";
import {
  FaAngleLeft,
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setOpenSubMenus([]);
  };

  const toggleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubMenu = (path, event) => {
    event.preventDefault();
    const isOpen = openSubMenus.includes(path);
    setOpenSubMenus((prev) =>
      isOpen ? prev.filter((item) => item !== path) : [...prev, path]
    );
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.clear();

    toast.success("User Logged Out");
    navigate("/login");
  };

  const renderSubmenus = (submenus, parentPath = "") => {
    return (
      <ul className="submenu">
        {submenus.map((subItem, subIndex) => {
          const fullPath = `${parentPath}${subItem.path}`;
          const isOpen = openSubMenus.includes(fullPath);
          return (
            <li key={subIndex}>
              <Link
                to={subItem.path}
                // className="submenu-link"
                className={`submenu-link ${
                  subItem.type === "single" ? "single-report" : "group-report"
                }`}
                onClick={(event) => {
                  if (subItem.submenus) {
                    event.preventDefault();
                    toggleSubMenu(fullPath, event);
                  } else {
                    navigate(subItem.path);
                  }
                }}>
                <span>{subItem.icon}</span>
                <span className="hidden-text">{subItem.title}</span>
                &nbsp;&nbsp;
                {subItem.submenus && (isOpen ? <FaAngleUp /> : <FaAngleDown />)}
              </Link>
              {subItem.submenus &&
                isOpen &&
                renderSubmenus(subItem.submenus, `${fullPath}/`)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={`grid-container`}>
      <section
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          sidebarOpen ? "open" : ""
        }`}>
        <div className="sidebar-content">
          <div className="toggle">
            <FaAngleLeft
              style={{
                color: "#F3F7EC",
                fontSize: "21px",
                background: "#0a60bd",
                borderRadius: "50%",
                padding: "5px",
              }}
              onClick={toggleSidebar}
            />
          </div>
        </div>

        <div className="sidebar-content-items">
          <div className="sidebar-items">
            <div className="menu-bar">
              <div className="menus">
                <ul className="menu">
                  {menuItems.map((item, index) => (
                    <li className="main-link" key={index}>
                      <div className="menu-item">
                        <Link
                          to={item.path}
                          className="menu-link"
                          onClick={(event) => {
                            if (item.submenus) {
                              event.preventDefault();
                              toggleSubMenu(item.path, event);
                            } else {
                              navigate(item.path);
                            }
                          }}>
                          <i className="menu-icon">{item.icon}</i>
                          <span className="hidden-text">{item.title}</span>
                          &nbsp;
                          {item.submenus &&
                            (openSubMenus.includes(item.path) ? (
                              <FaAngleUp />
                            ) : (
                              <FaAngleDown />
                            ))}
                        </Link>
                        {item.submenus &&
                          openSubMenus.includes(item.path) &&
                          renderSubmenus(item.submenus, `${item.path}/`)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <div className="bottom-content">
              <ul>
                <li>
                  <Link to="/exit" className="logout-link" onClick={handleLogOut}>
                    <FaSignOutAlt className="logout-icon" />
                    <span className="hidden-text">Logout</span>
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
        <div className="sidebar-toggle-btn" onClick={toggleSidebarOpen}>
          <FaBars />
        </div>
      </section>
      <Navbar />

      <main className="main" style={{ height: "85vh" }}>
        {/* {logoutMessage && <div className="logout-message" >User Logged Out!!!</div>} */}

        <Outlet />
      </main>
      {sidebarOpen && (
        <div className="backdrop open" onClick={toggleSidebarOpen}></div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Sidebar;
