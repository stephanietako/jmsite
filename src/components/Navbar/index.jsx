import { useState } from "react";
import { Link } from "react-router-dom";
//Styles
import styles from "./styles.module.scss";

const Navbar = () => {
  // navbar color state change managment
  const [fix, setFix] = useState(false);
  const setFixed = () => {
    if (window.scrollY >= 142) {
      setFix(true);
    } else {
      setFix(false);
    }
  };
  window.addEventListener("scroll", setFixed);

  return (
    <div
      className={fix ? `${styles.navbar} ${styles.fixed}` : `${styles.navbar}`}
    >
      <div className={styles.__content}>
        <div className={styles.__logo}>
          <a href="/">LOGO</a>
        </div>
        <ul className={styles.__link}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
          <li>
            <Link to="/">Artwork</Link>
          </li>
        </ul>
        <button>Contact</button>
      </div>
    </div>
  );
};

export default Navbar;
