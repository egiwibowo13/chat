import io from 'socket.io-client';

// Replace 'http://localhost:3000' with your server address
const URL = 'http://103.82.92.193:3000'; // 192.168.1.8 -> local // 103.82.92.193 -> vm
export const socket = io(URL, {autoConnect: false});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
export default socket;
