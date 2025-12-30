// Styles
import styles from "./styles.module.scss";
// Assets
import logo from "@/assets/logo/jmlogo.jpg";

const Footer = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const takodevURL = import.meta.env.VITE_TAKO_URL;
  return (
    <div className={styles.footer}>
      <footer className={styles.__container}>
        <div className={styles.left}>
          <a href="/">
            <img
              className={styles.__logo}
              src={logo}
              alt="Jean-Marc graphiste motion design logo"
            />
          </a>
        </div>
        <div className={styles.right}>
          <div className={styles.__text}>
            <span>Jean-Marc graphiste motion design logo</span>
            <span>
              © Copyright {currentYear} |{" "}
              <a
                href={takodevURL}
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Tako Dev — ouvre dans un nouvel onglet"
              >
                Tako Dev
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
