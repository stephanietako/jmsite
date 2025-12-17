import { useState, lazy, Suspense } from "react";
//Styles
import styles from "./styles.module.scss";

const Modal = lazy(() => import("../../components/Modal"));
const HeroAnim = lazy(() => import("../HeroAnim"));

const HeroSection = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleItemClick = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <section className={styles.hero_section} aria-labelledby="hero-title">
      <div className={styles.__container}>
        <div className={styles.__anim_wrapper}>
          <div className={styles.__hero_anim_bg}>
            <Suspense>
              <HeroAnim />
              <Modal id="hero-modal" isOpen={openModal} onClose={handleClose} />
            </Suspense>
          </div>

          <div className={styles.__hero_text_overlay}>
            <span className={styles.__hero_text_content}>
              <h1 id="hero-title">jean-marc eliette</h1>
              <p>directeur artistique + motion design</p>
              <p>corporate / digital</p>
            </span>
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
      </div>
    </section>
  );
};

export default HeroSection;
