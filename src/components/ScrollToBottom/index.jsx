import React, { useCallback, useEffect, useState } from "react";
import arrow from "@/assets/icon/arrow-down.png";
// Styles
import styles from "./styles.module.scss";

const SCROLL_THRESHOLD = 200;

const ScrollToBottom = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;
      setVisible(maxScroll - scrolled > SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const goToBottom = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const bottom = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    if (prefersReduced) {
      window.scrollTo(0, bottom);
    } else {
      window.scrollTo({ top: bottom, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={`${styles.scrollBtn} ${visible ? styles.visible : ""}`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        className={styles.__icon_position}
        onClick={goToBottom}
        aria-label="Aller en bas de la page"
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

export default React.memo(ScrollToBottom);
