import {io} from 'socket.io-client';

const socket = io(import.meta.env.VITE_LOCAL_BACKEND_URL);

export default socket;