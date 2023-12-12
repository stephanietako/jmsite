// Assets
import wolf from "../../assets/images/mutation_wolf_origin.webp";
// Styles
import styles from "./styles.module.scss";

const Cardsimg = () => {
  return (
    <div className={styles.cards}>
      <img
        id={styles.__wolf}
        src={wolf}
        alt={"oeuvre originale mutation wolf par Jean-Marc Eliette"}
      />
      <div className={styles.__card_info}>
        <p> Oeuvre originale "Mutation Wolf" par Jean-Marc Eliette</p>
      </div>
    </div>
  );
};

export default Cardsimg;
