import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Navbar.module.css';
import { AppContext } from '../AppContext';

function Navbar() {
  const { user } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoHighlight}>Cloud</span>IDE
      </Link>

      {/* Hamburger menu button - visible only on mobile */}
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Navigation links - hidden on mobile when menu is closed */}
      <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.navLinks}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/features" onClick={() => setIsMenuOpen(false)}>Features</Link></li>
          <li><Link to="/templates" onClick={() => setIsMenuOpen(false)}>Templates</Link></li>
          <li><Link to="/docs" onClick={() => setIsMenuOpen(false)}>Docs</Link></li>

          {user ? (
            <>
              <li className={styles.userGreeting}>
                <span>Welcome, {user.name}</span>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
              <li><Link to="/signup" className={styles.primaryButton} onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;