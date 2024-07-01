import React, { useState, useEffect } from "react";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import useAuth from "../Hooks/UseAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shownav, setshowNav] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const { t } = useTranslation();

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  };
  useEffect(() => {
    switch (location.pathname) {
      case "/freelancerpage/Messenger":
        case "/Messenger":
          case "/Interview":
          case "/room/:roomId":
      case "/employerpage/Freelancerdetails":
        setshowNav(false);
        break;
      default:
        setshowNav(true);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  const ConfirmLink = ({ to, children, message }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (window.confirm(message)) {
        logOut();
        navigate(to);
      }
    };

    return (
      <RouterLink to={to} onClick={handleClick}>
        {children}
      </RouterLink>
    );
  };

  const renderNavLinks = () => {
    switch (location.pathname) {
      case "/freelancerpage":
      case "/freelancerpage/Taskmanager":
      case "/freelancerpage/Apply":
        case "/freelancerpage/Offer":
        return (
          <>
            <li>
              <RouterLink to="/freelancerpage">{t("Home")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/freelancerpage/Taskmanager">
                {t("Task Manager")}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/freelancerpage/Offer">
                {t("Offer")}
              </RouterLink>
            </li>
            <li>
              <ConfirmLink to="/" message="Are you sure you want to log out?">
                {t("LogOut")}
              </ConfirmLink>
            </li>
          </>
        );
      case "/employerpage":
      case "/employerpage/Post":
      case "/employerpage/Applicantsdetails":
      case "/employerpage/Applicantsdetails/more":
        return (
          <>
            <li>
              <RouterLink to="/employerpage">{t("Home")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/employerpage/Post">{t("Post")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/employerpage/Applicantsdetails">
                {t("Applicants")}
              </RouterLink>
            </li>
            <li>
              <ConfirmLink to="/" message="Are you sure you want to log out?">
                {t("LogOut")}
              </ConfirmLink>
            </li>
          </>
        );
      case "/":
        return (
          <>
            <li>
              <Link to="main" smooth={true} duration={500}>
                {t("Home")}
              </Link>
            </li>
            <li>
              <Link to="service" smooth={true} duration={500}>
                {t("Service")}
              </Link>
            </li>
            <li>
              <Link to="about" smooth={true} duration={500}>
                {t("About")}
              </Link>
            </li>
            <li>
              <Link to="contact" smooth={true} duration={500}>
                {t("Contact")}
              </Link>
            </li>
            <li>
              <Link to="register" smooth={true} duration={500}>
                {t("Register")}
              </Link>
            </li>
            <LanguageSwitcher />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {shownav && (
        <nav className={nav ? "nav active" : "nav"}>
          <RouterLink to="" className="logo">
            <img src="/image/logo.png" alt="" />
          </RouterLink>
          <input className="menu-btn" type="checkbox" id="menu-btn" />
          <label className="menu-icon" htmlFor="menu-btn">
            <span className="nav-icon"></span>
          </label>
          <ul className="menu">{renderNavLinks()}</ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
