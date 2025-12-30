import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// Styles
import styles from "./styles.module.scss";

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
