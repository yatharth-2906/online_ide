import styles from './styles/ProjectPage.module.css';

function CodeEditor({ activeFile, code, setCode, handleRunCode }) {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <div className={styles.tabBar}>
          <div className={styles.activeTab}>{activeFile}</div>
        </div>
        <button className={styles.runButton} onClick={handleRunCode}>
          Run
        </button>
      </div>
      <div className={styles.codeEditor}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default CodeEditor;