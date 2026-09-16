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

  const getSocketUrl = (): string | undefined => {
    const socketEnv = import.meta.env.VITE_SOCKET_URL;
    if (socketEnv) {
      try {
        return new URL(socketEnv).origin;
      } catch {
        if (socketEnv.startsWith('/')) return undefined;
        return socketEnv;
      }
    }
    return undefined;
  };

  const connectSocket = useCallback((forceRefresh = false) => {
    const token = localStorage.getItem('accessToken');
    const socketUrl = getSocketUrl();

    if (!token) {
      disconnectSocket();
      return;
    }

    if (!forceRefresh && socketRef.current && socketRef.current.connected) {
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

    socketInstance.on('connect_error', (err) => {
      console.warn('[SocketContext] Connection error:', err.message);
      setIsConnected(false);
    });
  }, [disconnectSocket]);

  useEffect(() => {
    connectSocket();

    const handleTokenRefreshed = () => {
      // Khi Access Token được refresh thành công, tự động kết nối lại Socket với token mới
      connectSocket(true);
    };

    const handleLogout = () => {
      disconnectSocket();
    };

    window.addEventListener('auth:token_refreshed', handleTokenRefreshed);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:token_refreshed', handleTokenRefreshed);
      window.removeEventListener('auth:logout', handleLogout);
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
