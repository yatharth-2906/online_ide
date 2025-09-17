import { useState, useEffect } from 'react';
import styles from './styles/ProjectPage.module.css';

function FileExplorer({ fileTree, activeFile, setActiveFile, handleSelectFile }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const renderFileTree = (node, depth = 0, path = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;

    return (
      <ul className={styles.fileList} style={{ paddingLeft: `${depth * 15}px` }} key={currentPath}>
        <li>
          {node.type === 'folder' ? (
            <>
              <div
                className={styles.folder}
                onClick={() => toggleFolder(currentPath)}
              >
                <span className={styles.folderIcon}>
                  {expandedFolders[currentPath] ? '📂' : '📁'}
                </span>
                {node.name}
              </div>
              {expandedFolders[currentPath] && node.children && node.children.length > 0 && (
                <div className={styles.folderContents}>
                  {node.children.map((child) =>
                    renderFileTree(child, depth + 1, currentPath)
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              className={`${styles.file} ${activeFile === currentPath ? styles.activeFile : ''}`}
              onClick={() => {
                const pathToFetch = node.relative_path || currentPath;
                setActiveFile("." + pathToFetch);
                handleSelectFile(pathToFetch);
              }}
              key={currentPath} // key for file divs is fine
            >
              <span className={styles.fileIcon}>📄</span>
              {node.name}
            </div>
          )}
        </li>
      </ul>
    );
  };


  if (!fileTree) {
    return (
      <div className={styles.fileExplorer}>
        <div className={styles.explorerHeader}>
          <h3>PROJECT FILES</h3>
        </div>
        <div className={styles.loading}>Loading files...</div>
      </div>
    );
  }

  return (
    <div className={styles.fileExplorer}>
      <div className={styles.explorerHeader}>
        <h3>PROJECT FILES</h3>
      </div>
      <div className={styles.fileTree}>
        {/* Skip the root "my_app" folder and render its children directly */}
        {fileTree.children && fileTree.children.map((child, index) =>
          renderFileTree(child, 0, fileTree.name)
        )}
      </div>
    </div>
  );
}

export default FileExplorer;