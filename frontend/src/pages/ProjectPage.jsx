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
  const [fileTree, setFileTree] = useState(null);
  const [activeFile, setActiveFile] = useState('./');
  const [code, setCode] = useState("\n // Select a file to view its content");

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  async function handleSelectFile(relative_path) {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/getFile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project_id, relative_path })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch the file data');
      }

      const data = await response.json();
      setCode(data.data);
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleSaveFile = async (relative_path, new_code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/updateFile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project_id, relative_path, new_code })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch the file data');
      }

      const data = await response.json();
      setCode(new_code);
      if (data.status === 'success') {
        alert("File saved successfully");
      } else {
        alert("Failed to save the file");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  // Start project and fetch container_id
  useEffect(() => {
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
          if (response.status === 409){
            window.location.reload();
          }

          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to start project');
        }

        const data = await response.json();
        setContainerData(data.data);

        // Use the file tree from the initial response if available
        if (data.data.file_tree) {
          setFileTree(data.data.file_tree);
        }
      } catch (error) {
        console.error("Start Project error:", error);
        setError(error.message);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };

    handleStartProject();
  }, [project_id, user]);

  async function getFileTree() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/fileTree`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ "container_id": containerData.container_id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch file tree');
      }

      const data = await response.json();
      setFileTree(data.data);

      // if (activeFile && activeFile !== '/') {
      //   handleSelectFile(activeFile);
      // }
    } catch (error) {
      console.error("File Tree error:", error);
      setError(error.message);
    }
  }

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

      // Only fetch file tree if we don't have it from the initial response
      if (!fileTree) {
        getFileTree();
      }

      return () => {
        newSocket.disconnect();
      };
    }
  }, [containerData]);

  useEffect(() => {
    if (socket && containerData) {
      socket.on("file:refresh", getFileTree);
      return () => {
        socket.off("file:refresh", getFileTree);
      };
    }
  }, [socket, containerData, activeFile]);

  if (!user || loading) {
    return <div className="loader_container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    socket && containerData && (
      <div className={styles.projectContainer}>
        <FileExplorer
          fileTree={fileTree}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          setCode={setCode}
          handleSelectFile={handleSelectFile}
        />

        <div className={styles.mainContent}>
          <CodeEditor
            activeFile={activeFile}
            code={code}
            setCode={setCode}
            handleSaveFile={handleSaveFile}
          />
          <Terminal socket={socket} />
        </div>
      </div>
    )
  );
}

export default ProjectPage;