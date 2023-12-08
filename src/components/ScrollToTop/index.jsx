import { useRef } from "react";
import arrow from "../../assets/icon/arrow-up.png";
import styles from "./styles.module.scss";

const ScrollToTop = () => {
  const topRef = useRef(null);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.toTopBtn}>
      <button className={styles.__icon_position} ref={topRef} onClick={goToTop}>
        <img
          className={styles.__icon_style}
          src={arrow}
          alt={"arrow symbol to scroll down"}
        ></img>
      </button>
    </div>
  );
};

export default ScrollToTop;
