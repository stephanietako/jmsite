import logo from "../../assets/logo/jmlogo.jpg";
import linkedin from "../../assets/icon/linkedin-clear.png";
import email from "../../assets/icon/at-clear.png";
// Styles
import styles from "./styles.module.scss";

const Navbar = () => {
  const menuItems = [
    {
      id: 1,
      icon: linkedin,
      link: import.meta.env.VITE_LINKEDIN_URL,
      alt: "LinkedIn",
    },
    {
      id: 2,
      icon: email,
      link: `mailto:${import.meta.env.VITE_EMAIL_URL}`,
      alt: "Email",
    },
  ];

  return (
    <nav className={styles.navbar} aria-label="Navigation principale">
      <a href="/" className={styles.logo}>
        <img src={logo} alt="Logo Jean-Marc" />
      </a>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img src={item.icon} alt={item.alt} className={styles.icon} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
