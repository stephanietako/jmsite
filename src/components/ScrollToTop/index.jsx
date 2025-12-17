import React, { useCallback, useEffect, useState } from "react";
import arrow from "@/assets/icon/arrow-up.png";
// Styles
import styles from "./styles.module.scss";

const SCROLL_THRESHOLD = 200;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrolled > SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const goToTop = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className={`${styles.scrollBtn} ${visible ? styles.visible : ""}`}>
      <button
        type="button"
        className={styles.__icon_position}
        onClick={goToTop}
        aria-label="Retour en haut de la page"
      >
        <img
          className={styles.__icon_style}
          src={arrow}
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default React.memo(ScrollToTop);
