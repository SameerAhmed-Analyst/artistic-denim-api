import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Powerhouses",
    path: "/",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
    subItems: [
      {
        title: "Powerhouse 1",
        path: "/powerhouse1", // Path for Powerhouse 1
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
      },
      {
        title: "Powerhouse 2",
        path: "/powerhouse2", // Path for Powerhouse 2
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
      },
      // Add more powerhouse sub-items as needed
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Team",
    path: "/team",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Settings",
    path: "/support",
    icon: <IoIcons.IoIosSettings />,
    cName: "nav-text",
  },
  {
    title: "Logout",
    path: "/support",
    icon: <IoIcons.IoIosLogOut  />,
    cName: "nav-text",
  },
];
