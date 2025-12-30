// Assets
import logo from "@/assets/logo/jmlogo.jpg";
import linkedin from "@/assets/icon/linkedin.svg";
import email from "@/assets/icon/email.svg";
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
      <div className={styles.left}>
        <a href="/" className={styles.logo} aria-label="Accueil">
          <img src={logo} alt="Logo Jean-Marc" />
        </a>
      </div>
      <div className={styles.right}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                aria-label={item.alt}
              >
                <img src={item.icon} alt={item.alt} className={styles.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
