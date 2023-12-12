import React, { useState } from "react";
import Modal from "../../components/Modal";
import HeroAnim from "../HeroAnim";
// Styles
import styles from "./styles.module.scss";
const HeroSection = () => {
  const [openModal, setOpenModal] = useState(false);

  // Fonction du click ouverture du modal et du texte cortrespondant
  const handleItemClick = () => {
    setOpenModal(true);
  };

  return (
    <div className={styles.hero_section}>
      <div className={styles.__container}>
        <div className={styles.__hero_text}>
          <h1>jean-marc eliette</h1>
          <p>directeur artistique + motion design</p>
          <p>corporate / digital</p>
          <button id={styles.__btn_hero} onClick={() => handleItemClick()}>
            <p>entrer</p>
          </button>
        </div>
        <div className={styles.__hero_anime}>
          <HeroAnim />
        </div>
      </div>
      {/* Appel de l'import Modal*/}
      <Modal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default HeroSection;
