import { useState } from 'react';
import styles from './styles/ProjectPage.module.css';

function FileExplorer({ files, activeFile, setActiveFile }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const renderFiles = (files, depth = 0) => {
    return (
      <ul className={styles.fileList} style={{ paddingLeft: `${depth * 15}px` }}>
        {files.map((file, index) => (
          <li key={index}>
            {file.type === 'folder' ? (
              <>
                <div 
                  className={styles.folder} 
                  onClick={() => toggleFolder(file.name)}
                >
                  <span className={styles.folderIcon}>
                    {expandedFolders[file.name] ? '📂' : '📁'}
                  </span>
                  {file.name}
                </div>
                {expandedFolders[file.name] && file.children && (
                  <div className={styles.folderContents}>
                    {renderFiles(file.children, depth + 1)}
                  </div>
                )}
              </>
            ) : (
              <div
                className={`${styles.file} ${activeFile === file.name ? styles.activeFile : ''}`}
                onClick={() => setActiveFile(file.name)}
              >
                <span className={styles.fileIcon}>📄</span>
                {file.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.fileExplorer}>
      <div className={styles.explorerHeader}>
        <h3>PROJECT FILES</h3>
      </div>
      <div className={styles.fileTree}>
        {renderFiles(files)}
      </div>
    </div>
  );
}

export default FileExplorer;