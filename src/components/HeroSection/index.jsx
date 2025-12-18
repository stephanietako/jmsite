import { useState, lazy, Suspense } from "react";
import styles from "./styles.module.scss";

const Modal = lazy(() => import("../../components/Modal"));
const HeroAnim = lazy(() => import("../HeroAnim"));

const HeroSection = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleItemClick = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <section className={styles.hero_section} aria-labelledby="hero-title">
      <div className={styles.canvas_wrapper}>
        <Suspense>
          <HeroAnim />
        </Suspense>
      </div>

      {/* Overlay texte et bouton au-dessus */}
      <div className={styles.__content_wrapper}>
        <div className={styles.__hero_text_overlay}>
          <div className={styles.__hero_text_title}>
            <h1 id="hero-title">jean-marc eliette</h1>
          </div>

          <div className={styles.__hero_text_body}>
            <p>directeur artistique + motion design</p>
            <p>corporate / digital</p>
          </div>

          <div className={styles.__hero_text_actions}>
            <button
              type="button"
              className={styles.__btn_hero}
              onClick={handleItemClick}
              aria-haspopup="dialog"
              aria-expanded={openModal}
              aria-controls="hero-modal"
            >
              Voir l’œuvre
            </button>
          </div>
        </div>

        <Suspense>
          <Modal id="hero-modal" isOpen={openModal} onClose={handleClose} />
        </Suspense>
      </div>
    </section>
  );
};

export default HeroSection;
