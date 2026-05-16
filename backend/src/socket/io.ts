import type { Server } from "socket.io";

let socketServer: Server | undefined;

export function setIo(io: Server) {
  socketServer = io;
}

export const io = {
  to(room: string) {
    return {
      emit(event: string, payload: unknown) {
        socketServer?.to(room).emit(event, payload);
      }
    };
  }
};
