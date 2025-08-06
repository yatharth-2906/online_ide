import styles from './styles/LandingPage.module.css';

function LandingPage() {
    return (
        <div className={styles.landing}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        <span className={styles.highlight}>Cloud</span> IDE
                    </h1>
                    <p className={styles.tagline}>Your complete development environment in the cloud</p>
                    <div className={styles.ctaContainer}>
                        <button className={styles.ctaButton}>Start Coding Now</button>
                        <button className={styles.secondaryButton}>Explore Templates</button>
                    </div>
                </div>
                <div className={styles.codePreview}>
                    <div className={styles.codeWindow}>
                        <div className={styles.windowHeader}>
                            <div className={styles.windowButtons}>
                                <span className={styles.red}></span>
                                <span className={styles.yellow}></span>
                                <span className={styles.green}></span>
                            </div>
                            <div className={styles.windowTitle}>app.js</div>
                        </div>
                        <pre className={styles.codeBlock}>
                            {`import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, Cloud IDE!</h1>
    </div>
  );
}

export default App;`}
                        </pre>
                    </div>
                </div>
            </div>

            <div className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>Why Choose Cloud IDE?</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🚀</div>
                        <h3>Instant Setup</h3>
                        <p>No installations or configurations. Start coding in seconds with zero setup.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3>Real Containers</h3>
                        <p>Full Linux environments with root access and persistent storage for your projects.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🌐</div>
                        <h3>Live Preview</h3>
                        <p>Get a public URL to share your work or test across devices instantly.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📦</div>
                        <h3>Templates Gallery</h3>
                        <p>Pre-configured starters for React, Vue, Django, Flask, and more.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🤝</div>
                        <h3>Collaboration</h3>
                        <p>Real-time pair programming with shared editing and terminals.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3>Powerful Performance</h3>
                        <p>Fast compilation and execution with dedicated container resources.</p>
                    </div>
                </div>
            </div>

            <div className={styles.templatesSection}>
                <h2 className={styles.sectionTitle}>Popular Templates</h2>
                <div className={styles.templatesGrid}>
                    <div className={styles.templateCard}>
                        <div className={styles.templateLogo}>⚛️</div>
                        <h3>React.js</h3>
                        <p>Create React App with Tailwind CSS</p>
                    </div>
                    <div className={styles.templateCard}>
                        <div className={styles.templateLogo}>🌿</div>
                        <h3>Vue.js</h3>
                        <p>Vue 3 with Vite and Pinia</p>
                    </div>
                    <div className={styles.templateCard}>
                        <div className={styles.templateLogo}>🐍</div>
                        <h3>Django</h3>
                        <p>Django with PostgreSQL</p>
                    </div>
                    <div className={styles.templateCard}>
                        <div className={styles.templateLogo}>🟨</div>
                        <h3>Node.js</h3>
                        <p>Express API Starter</p>
                    </div>
                </div>
            </div>

            <div className={styles.ctaSection}>
                <h2 className={styles.sectionTitle}>Ready to Code in the Cloud?</h2>
                <p className={styles.ctaText}>Join thousands of developers building projects directly in their browsers</p>
                <button className={styles.ctaButton}>Get Started for Free</button>
            </div>
        </div>
    );
}

export default LandingPage;