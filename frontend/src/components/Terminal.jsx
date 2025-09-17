import { useEffect, useRef } from 'react';
import { Terminal as Xterminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';

function Terminal({ socket }) {
    const terminalRef = useRef(null);
    const terminalInstance = useRef(null);
    const fitAddon = useRef(new FitAddon());

    useEffect(() => {
        if (terminalInstance.current) return;

        const term = new Xterminal({
            cursorBlink: true,
            fontSize: 16,
            rows: 12,
            fontFamily: "'Fira Code', monospace",
            theme: {
                background: '#0a0a0a',
                foreground: '#e5e7eb',
                cursor: '#6366f1',
                selection: 'rgba(99, 102, 241, 0.3)',
            },
        });

        terminalInstance.current = term;
        term.loadAddon(fitAddon.current);
        term.open(terminalRef.current);
        fitAddon.current.fit();

        term.onData(data => {
            socket.emit('terminal:write', data);
        });

        socket.on('terminal:data', (data) => {
            term.write(data);
        });

        socket.on('terminal:error', (error) => {
            term.write(`\r\nError: ${error}\r\n`);
        });

        const handleResize = () => {
            fitAddon.current.fit();
            socket.emit('terminal:resize', {
                cols: term.cols,
                rows: term.rows
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    return <div id="terminal" ref={terminalRef} />;
}

export default Terminal;

// function Terminal({ socket }) {
//     const terminalRef = useRef(null);
//     const terminalInstance = useRef(null);
//     const fitAddon = useRef(new FitAddon());

//     useEffect(() => {
//         if (terminalInstance.current) return;

//         const term = new Xterminal({
//             cursorBlink: true,
//             fontSize: 16,
//             rows: 12,
//             fontFamily: "'Fira Code', monospace",
//             theme: {
//                 background: '#0a0a0a',
//                 foreground: '#e5e7eb',
//                 cursor: '#6366f1',
//                 selection: 'rgba(99, 102, 241, 0.3)',
//             },
//         });

//         terminalInstance.current = term;
//         term.loadAddon(fitAddon.current);
//         term.open(terminalRef.current);
//         fitAddon.current.fit();

//         let currentInput = '';
//         let isCommandRunning = false;

//         term.onData(data => {
//             // If a command is running, allow Ctrl+C to interrupt
//             if (isCommandRunning && data === '\x03') { // Ctrl+C
//                 socket.emit('terminal:write', data);
//                 isCommandRunning = false;
//                 return;
//             }

//             if (!isCommandRunning) {
//                 socket.emit('terminal:write', data);
//             }

//             // Detect Enter key to track command execution
//             if (data === '\r') {
//                 const command = currentInput.trim();
//                 currentInput = '';

//                 // Check if this is a long-running command
//                 if (command.startsWith('npm run') ||
//                     command.startsWith('node ') ||
//                     command.startsWith('python ') ||
//                     command.startsWith('npm start')) {
//                     isCommandRunning = true;

//                     // Add a message indicating the terminal is busy
//                     term.write('\r\n\x1b[33m[Command running - use Ctrl+C to interrupt]\x1b[0m\r\n');
//                 }
//             } else {
//                 currentInput += data;
//             }
//         });

//         socket.on('terminal:data', (data) => {
//             term.write(data);

//             // Check if command has finished (look for prompt patterns)
//             if (data.includes('$ ') || data.includes('# ') || data.includes('> ')) {
//                 isCommandRunning = false;
//             }
//         });

//         socket.on('terminal:error', (error) => {
//             term.write(`\r\nError: ${error}\r\n`);
//             isCommandRunning = false;
//         });

//         const handleResize = () => {
//             fitAddon.current.fit();
//             socket.emit('terminal:resize', {
//                 cols: term.cols,
//                 rows: term.rows
//             });
//         };

//         window.addEventListener('resize', handleResize);
//         handleResize();

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };

//     }, [socket]);

//     return <div id="terminal" ref={terminalRef} />;
// }

// export default Terminal;