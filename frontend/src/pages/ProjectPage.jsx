import { AppContext } from '../AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor';
import Terminal from "../components/Terminal";
import styles from '../components/styles/ProjectPage.module.css';

function ProjectPage() {
  const { user } = useContext(AppContext);
  const { project_id } = useParams();
  const navigate = useNavigate();

  const [containerData, setContainerData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  // Start project and fetch container_id
  useEffect(() => {
    if (!user) return; // Don't start if user is not logged in

    const handleStartProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/start`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ project_id }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to start project');
        }

        const data = await response.json();
        setContainerData(data.data);
      } catch (error) {
        console.error("Start Project error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleStartProject();
  }, [project_id, user]);

  // Initialize socket only when containerData is ready
  useEffect(() => {
    if (containerData?.container_id) {
      console.log('Connecting socket with container_id:', containerData.container_id);

      const newSocket = io(import.meta.env.VITE_LOCAL_BACKEND_URL, {
        query: {
          container_id: containerData.container_id
        },
        transports: ['websocket', 'polling'] // Add fallback transport
      });

      setSocket(newSocket);
    }
  }, [containerData]);

  const [activeFile, setActiveFile] = useState('index.js');
  const [code, setCode] = useState('// Start coding here...\nconsole.log("Hello World!");');

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

  };

  if (loading) {
    return <div className="loader_container"><div className="loader"></div></div>;
  }
  
  return (
    socket && containerData && (
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
          <Terminal socket={socket} />
        </div>
      </div>
    )
  );

}

export default ProjectPage;