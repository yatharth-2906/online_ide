import { io } from "socket.io-client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor';
import XTerminal from '../components/Terminal';
import styles from '../components/styles/ProjectPage.module.css';

let socket;

function ProjectPage() {
  const { project_id } = useParams();

  const [containerData, setContainerData] = useState(null);
  const [activeFile, setActiveFile] = useState('index.js');
  const [code, setCode] = useState('// Start coding here...\nconsole.log("Hello World!");');

  const initialized = useRef(false);

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
    // This would now be handled through the real terminal
    console.log('Code execution would happen in the real terminal');
  };

  useEffect(() => {
    if (initialized.current) 
      return;
    
    initialized.current = true;
    socket = io(import.meta.env.VITE_LOCAL_BACKEND_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log(`Connected to WebSocket server: ${socket.id}`);
      socket.emit('join_project', project_id);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from WebSocket`);
    });

    async function run_project() {
      try {
        const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ project_id }),
          credentials: 'include'
        });

        const details = await response.json();;
        setContainerData(details.data); 
      } catch (error) {
        console.error("Error fetching project files:", error);
      }
    }

    run_project();
  }, [project_id]);


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
        <XTerminal socket={socket} containerData={containerData} />
      </div>
    </div>
  );
}

export default ProjectPage;