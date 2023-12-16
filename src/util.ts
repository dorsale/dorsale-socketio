import { Handler } from "./handler";
import { Server, Socket } from "socket.io";

export function addHandlers(handlers: Handler[], instance: object, io: Server) {
  io.on("connect", (socket: Socket) => {
    handlers.forEach((handler) => {
      socket.on(handler.event, (...args: any[]) => {
        const method = instance[handler.callbackMethodName];
        method.call(instance, socket, ...args);
      });
    });
  });
}
