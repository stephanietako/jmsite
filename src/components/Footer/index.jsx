// Styles
import styles from "./styles.module.scss";
// Assets
import logo from "../../assets/logo/jmlogo.jpg";

const Footer = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const takodevURL = import.meta.env.VITE_TAKO_URL;
  return (
    <div className={styles.footer}>
      <footer className={styles.__container}>
        <ul>
          <li>
            <a href="/">
              <img
                className={styles.__logo}
                src={logo}
                alt="Jean-Marc graphiste motion design logo"
              />
            </a>
          </li>
          <li>
            <div className={styles.__copyright}>
              &#169; Copyright {currentYear}
            </div>
          </li>
          <li>
            <span className={styles.__takodev}>
              <a href={takodevURL} rel="noopener noreferrer">
                <p> | Tako Dev</p>
              </a>
            </span>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
