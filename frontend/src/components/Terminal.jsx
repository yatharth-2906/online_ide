import styles from './styles/ProjectPage.module.css';

function Terminal({ terminalOutput }) {
  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <h4>TERMINAL</h4>
      </div>
      <div className={styles.terminalContent}>
        {terminalOutput.map((line, i) => (
          <div key={i} className={styles.terminalLine}>{line}</div>
        ))}
      </div>
      <div className={styles.terminalInput}>
        <span>$</span>
        <input type="text" placeholder="Enter command..." />
      </div>
    </div>
  );
}

export default Terminal;