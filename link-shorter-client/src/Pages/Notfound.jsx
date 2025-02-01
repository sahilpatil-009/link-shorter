import React from 'react'
import styles from "../styles/notfound.module.css";
import { Link } from 'react-router-dom';
const Notfound = () => {
  return(
    <div className={styles.notFoundContainer}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default Notfound