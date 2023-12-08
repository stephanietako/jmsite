// import Scene from "../Scene";
import HeroAnim from "../HeroAnim";
// Styles
import styles from "./styles.module.scss";
const HeroSection = () => {
  return (
    <div className={styles.hero_section}>
      <div className={styles.__container}>
        <div className={styles.__hero_text}>
          <h1>jean-marc eliette</h1>
          <p>directeur artistique + motion design</p>
          <p>corporate / digital</p>
          <button id={styles.__btn_hero}>
            <p>entrer</p>
          </button>
        </div>
        <div className={styles.__hero_anime}>
          <HeroAnim />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
