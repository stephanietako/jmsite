import Scene from "../Scene";
import Taurus from "../Taurus";
// Styles
import styles from "./styles.module.scss";
import background from "../../assets/images/wolf_transp.png";
const HeroSection = () => {
  return (
    <div className={styles.hero_section}>
      <div className={styles.__container}>
        <div className={styles.__hero_text}>
          <h1>I am John Doe</h1>
          <p>And I'm an digital artist</p>
          <button>Hire me</button>
        </div>
        <div
          className={styles.__hero_image}
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className={styles.__hero_anime}>
            {/* <Scene /> */}
            <Taurus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
