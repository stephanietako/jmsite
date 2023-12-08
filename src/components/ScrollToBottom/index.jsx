import { useRef } from "react";
import arrow from "../../assets/icon/arrow-down.png";
import styles from "./styles.module.scss";

const ScrollToBottom = () => {
  const bottomRef = useRef(null);

  const goToBottom = () => {
    window.scrollTo({
      top: bottomRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.toBottomBtn}>
      <button
        className={styles.__icon_position}
        ref={bottomRef}
        onClick={goToBottom}
      >
        <img
          className={styles.__icon_style}
          src={arrow}
          alt={"arrow symbol to scroll down"}
        ></img>
      </button>
    </div>
  );
};

export default ScrollToBottom;
