// Styles
import styles from "./styles.module.scss";
// Assets
import logo from "../../assets/logo/jmlogo.jpg";
const Maintenance = () => {
  return (
    <div className={styles.maintenance}>
      <div className={styles.__container}>
        <div className={styles.__logo}>
          <img
            src={logo}
            alt="Jean-Marc Eliette graphiste motion design logo "
          />
        </div>
        <div className={styles.__txt}>
          <p>Bientôt le site de Jean-Marc Eliette</p>
          <p>Développement en cours....</p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
