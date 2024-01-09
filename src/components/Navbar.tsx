import Link from "next/link";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import "./Navbar.css";
import { IconContext } from "react-icons";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link href={""} className="menu-bars">
            <FaBars onClick={showSidebar} />
          </Link>
          <Link href={""} className="text-white ">
            Artistic Milliners
          </Link>
        </div>
        {/* <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link href={""} className="menu-bars">
                <AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link href={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav> */}
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">{/* ... (Close button) */}</li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  {item.subItems ? (
                    <>
                      {/* Render main Powerhouses item with a dropdown */}
                      <Link href={item.path} className="dropdown-link">
                        <div>
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                      </Link>
                      {/* Dropdown menu for Powerhouses */}
                      <ul className="sub-menu">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className={subItem.cName}>
                            <Link href={subItem.path}>
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    // Render other items without dropdown
                    <Link href={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
