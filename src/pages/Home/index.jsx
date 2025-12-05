import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToBottom from "../../components/ScrollToBottom";
import ScrollToTop from "../../components/ScrollToTop";
// Styles
import styles from "./styles.module.scss";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className={styles.home}>
        <ScrollToBottom />
        <ScrollToTop />
        <HeroSection />
        <Footer />
      </div>
    </>
  );
};

export default Home;
