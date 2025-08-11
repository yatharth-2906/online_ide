import { useState } from 'react';
import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor';
import Terminal from '../components/Terminal';
import styles from '../components/styles/ProjectPage.module.css';

function ProjectPage() {
  const [activeFile, setActiveFile] = useState('index.js');
  const [code, setCode] = useState('// Start coding here...\nconsole.log("Hello World!");');
  const [terminalOutput, setTerminalOutput] = useState(['$ Ready for commands...']);

  const files = [
    { name: 'index.js', type: 'file' },
    {
      name: 'styles', type: 'folder', children: [
        { name: 'main.css', type: 'file' },
        { name: 'variables.css', type: 'file' }
      ]
    },
    {
      name: 'components', type: 'folder', children: [
        { name: 'Button.jsx', type: 'file' },
        { name: 'Navbar.jsx', type: 'file' }
      ]
    },
    { name: 'package.json', type: 'file' },
    { name: 'package-lock.json', type: 'file' }
  ];

  const handleRunCode = () => {
    setTerminalOutput(prev => [...prev, '$ Running code...', 'Hello World!', 'Process completed']);
  };

  return (
    <div className={styles.projectContainer}>
      <FileExplorer 
        files={files} 
        activeFile={activeFile} 
        setActiveFile={setActiveFile} 
      />
      
      <div className={styles.mainContent}>
        <CodeEditor 
          activeFile={activeFile} 
          code={code} 
          setCode={setCode}
          handleRunCode={handleRunCode}
        />
        <Terminal terminalOutput={terminalOutput} />
      </div>
    </div>
  );
}

export default ProjectPage;