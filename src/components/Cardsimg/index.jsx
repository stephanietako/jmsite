import { useState, useRef, useEffect } from "react";
import ContentLoader from "react-content-loader";
import wolf from "../../assets/images/mutation_wolf_origin.webp";
import styles from "./styles.module.scss";

const CardSkeleton = ({ imageRef }) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: "100%", height: "100%", backgroundColor: "silver" }}
  >
    <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
  </ContentLoader>
);

const Cardsimg = () => {
  const [loading, setLoading] = useState(true);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current.complete) {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.cards}>
      <img
        ref={imageRef}
        id={styles.__wolf}
        src={wolf}
        alt="Oeuvre originale 'Mutation Wolf' par Jean-Marc Eliette"
        onLoad={() => setLoading(false)}
        style={{
          display: loading ? "none" : "block",
        }}
      />
      {loading && <CardSkeleton imageRef={imageRef} />}
      <div className={styles.__card_info}>
        <p>Oeuvre originale "Mutation Wolf" par Jean-Marc Eliette</p>
      </div>
    </div>
  );
};

export default Cardsimg;
