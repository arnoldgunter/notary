import styles from "../css/splash.module.css";

export default function Splash() {
  return (
    <div className={styles.splashContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo.svg" alt="Notary Logo" className={styles.logo} />
      </div>
      <div className={styles.loaderContainer}>
        <span className={styles.loader}></span>
      </div>
    </div>
  );
}
