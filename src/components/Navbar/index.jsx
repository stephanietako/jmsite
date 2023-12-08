import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import logo from "../../assets/logo/jmlogo.jpg";
import menu from "../../assets/icon/menu-clear.png";
import cross from "../../assets/icon/cross-clear.png";
import linkedin from "../../assets/icon/linkedin-clear.png";
import email from "../../assets/icon/at-clear.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const linkedinURL = process.env.REACT_APP_LINKEDIN_URL;
  const emailAdress = process.env.REACT_APP_EMAIL_URL;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 980);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Menu
  const menuItems = [
    { id: 1, icon: linkedin, link: linkedinURL, alt: "linkedin icon" },
    { id: 2, icon: email, link: `mailto:${emailAdress}`, alt: "email icon" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.__logo}>
        <a href="/">
          <img className={styles.__logo} src={logo} alt="Tako dev logo" />
        </a>
      </div>

      {/* Desktop */}
      {!isMobile && (
        <ul className={styles.__nav_menu}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <a href={item.link} rel="noopener noreferrer">
                <img
                  className={styles.__icons_link}
                  src={item.icon}
                  alt={item.alt}
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Mobile */}
      {isMobile && (
        <div className={styles.__nav_burger_menu}>
          <button className={styles.__burger_btn} onClick={toggleMenu}>
            <img src={isOpen ? cross : menu} alt={isOpen ? "Menu" : "Cross"} />
          </button>
          {isOpen && (
            <ul className={styles.__menu_mobile}>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a href={item.link} rel="noopener noreferrer">
                    <img
                      className={styles.__icons_link}
                      src={item.icon}
                      alt={item.alt}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
