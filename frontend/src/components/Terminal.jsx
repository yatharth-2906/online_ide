import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import styles from './styles/ProjectPage.module.css';

function XTerminal({ socket, containerData }) {
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(new FitAddon());

  useEffect(() => {
  const handleResize = () => {
    fitAddon.current.fit();
    const dimensions = fitAddon.current.proposeDimensions();
    if (socket && dimensions) {
      socket.emit('resize', {
        cols: dimensions.cols,
        rows: dimensions.rows
      });
    }
  };

  // Initialize terminal
  terminal.current = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: "'Fira Code', monospace",
    theme: {
      background: '#0a0a0a',
      foreground: '#e5e7eb',
      cursor: '#6366f1',
      selection: 'rgba(99, 102, 241, 0.3)',
    },
    allowProposedApi: true
  });

  // Load addons and open
  terminal.current.loadAddon(fitAddon.current);
  terminal.current.loadAddon(new WebLinksAddon());
  terminal.current.open(terminalRef.current);
  fitAddon.current.fit();

  if (socket && containerData) {
    const { container_id } = containerData;

    // Data handler
    const dataHandler = (data) => {
      terminal.current.write(data);
    };

    // Error handler
    const errorHandler = (error) => {
      terminal.current.writeln(`\r\nError: ${error}`);
    };

    socket.on('terminal_data', dataHandler);
    socket.on('terminal_error', errorHandler);

    // Input handler - REMOVED manual write
    terminal.current.onData((data) => {
      socket.emit('terminal_input', {
        containerId: container_id,
        input: data
      });
    });

    // Start terminal session
    socket.emit('start_terminal', { containerId: container_id });

    // Initial resize
    handleResize();
  }

  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    if (socket) {
      socket.off('terminal_data');
      socket.off('terminal_error');
    }
    terminal.current.dispose();
  };
}, [socket, containerData]);


  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <h4>TERMINAL</h4>
      </div>
      <div ref={terminalRef} className={styles.xtermContainer} />
    </div>
  );
}

export default XTerminal;