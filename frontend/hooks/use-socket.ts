"use client";

import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export function useSocket(projectId?: string) {
  const socket = useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    return io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "https://team-task-manager-backend-production-9d3f.up.railway.app", {
  auth: { token }
});
  }, []);

  useEffect(() => {
    if (!socket || !projectId) return;
    socket.emit("project:join", projectId);
    return () => {
      socket.emit("project:leave", projectId);
    };
  }, [socket, projectId]);

  return socket;
}
