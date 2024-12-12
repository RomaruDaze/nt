import React, { createContext, useContext, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

// const socket = io("http://192.168.182.140:5000");
const SOCKET_URL = import.meta.env.PROD
  ? window.location.origin // Production URL
  : "http://192.168.182.140:5000"; // Development URL

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
