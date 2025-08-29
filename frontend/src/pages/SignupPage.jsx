import { useContext, useEffect } from 'react';
import styles from '../components/styles/LoginPage.module.css';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../AppContext';

function SignupPage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);

    useEffect(() => {
        const checkLoginStatus = () => {
            if (user) {
                navigate('/');
                return null; // Prevent rendering the signup page if user is already logged in
            }
        }

        checkLoginStatus();
    }, []);

    const handleSignup = async (event) => {
        event.preventDefault();

        try {
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok)
                console.info("Signup failed");

            const data = await response.json();

            if (data.status == 'success')
                navigate('/login');
        } catch (error) {
            console.error("Signup failed");
            console.error(error);
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h2 className={styles.loginTitle}>Create Your Account</h2>
                    <p className={styles.loginSubtitle}>Sign up to unlock your personal coding workspace</p>
                </div>

                <form className={styles.loginForm} onSubmit={handleSignup}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
                        <input
                            type="fullName"
                            id="fullName"
                            className={styles.formInput}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.formInput}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.formInput}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginButton}>Sign Up</button>
                </form>

                <div className={styles.loginFooter}>
                    <p>Already have an account? <a href="/login" className={styles.signupLink}>Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;