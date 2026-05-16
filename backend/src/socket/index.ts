import type { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import { setIo } from "./io.js";

export function registerSockets(io: Server) {
  setIo(io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) return next(new Error("Authentication required"));
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.user.sub}`);

    socket.on("project:join", (projectId: string) => {
      socket.join(projectId);
    });

    socket.on("project:leave", (projectId: string) => {
      socket.leave(projectId);
    });
  });
}
