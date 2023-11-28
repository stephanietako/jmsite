import React from "react";

// Styles
import styles from "./styles.module.scss";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className={styles.home}>
        <HeroSection />
        <div className={styles.__container}>
          <p>HOME</p>
        </div>
      </div>
    </>
  );
};

export default Home;
