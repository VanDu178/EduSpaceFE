import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  connectSocket: () => { },
  disconnectSocket: () => { }
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, []);

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '');

    if (!token) {
      disconnectSocket();
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socketInstance = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });
  }, [disconnectSocket]);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useSocketEvent = <T,>(eventName: string, callback: (data: T) => void) => {
  const { socket } = useSocket();
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: T) => {
      savedCallback.current(data);
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);
};
