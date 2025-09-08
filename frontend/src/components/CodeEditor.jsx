import { useRef } from "react";
import AceEditor from "react-ace";
import styles from './styles/ProjectPage.module.css';

// Import all the languages you want supported
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";

// Import themes & tools
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function CodeEditor({ activeFile, code, setCode, handleSaveFile }) {
  const editorRef = useRef(null);

  const getModeFromFile = (name) => {
    if (!name) return "text";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".c")) return "c_cpp";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".html")) return "html";
    return "text";
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <div className={styles.tabBar}>
          <div className={styles.activeTab}>{activeFile}</div>
        </div>
        <button className={styles.runButton} onClick={() => { setCode(code); handleSaveFile(activeFile, editorRef.current.editor.getValue())}}>
          Save
        </button>
      </div>
      <div className={styles.codeEditor}>
        <AceEditor
          ref={editorRef}
          key={code}
          mode={getModeFromFile(activeFile)}
          theme="monokai"
          value={code}
          name="editor"
          width="100%"
          height="100%"
          fontSize={16}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            useWorker: false, 
            showLineNumbers: true,
            tabSize: 4,
          }}
          style={{
            backgroundColor: "transparent",
            color: "#d4d4d4",
            fontFamily: "'Fira Code', monospace",
            lineHeight: 1.6,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
