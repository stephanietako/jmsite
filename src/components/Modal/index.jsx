import Cardsimg from "../../components/Cardsimg";
// import ScrollToBottom from "../../components/ScrollToBottom";
// import ScrollToTop from "../../components/ScrollToTop";
// Styles
import styles from "./styles.module.scss";

const Modal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.__modalContainer}>
        <div className={styles.__modal_content}>
          <div onClick={onClose} className={styles.__closeBtn}>
            <p>fermer</p>
          </div>
          <div className={styles.__content}>
            {" "}
            <Cardsimg />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
