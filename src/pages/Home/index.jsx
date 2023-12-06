// Styles
import styles from "./styles.module.scss";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className={styles.home}>
        <HeroSection />

        <Footer />
      </div>
    </>
  );
};

export default Home;
