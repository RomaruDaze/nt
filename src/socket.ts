import { io } from "socket.io-client";

const socket = io("http://172.16.232.96:5000"); // Replace with your server URL

export default socket;