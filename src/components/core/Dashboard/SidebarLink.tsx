import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import * as Icons from "react-icons/vsc";

// import { resetCourseState } from "../../../slices/courseSlice";

interface ISidebarLink {
    link: {
        name: string;
        path: string;
    };
    iconName: string;
}

const SidebarLink : React.FC<ISidebarLink> = ({ link, iconName }) => {
  const Icon = (Icons as any)[iconName]; // Get the Icon from the Icons object
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const matchRoute = (route : string) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
    //   onClick={() => dispatch(resetCourseState())}  
      className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center gap-x-2">
        {/* Icon Goes Here */}
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
};

export default SidebarLink;
