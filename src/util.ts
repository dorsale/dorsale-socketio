import { Handler } from "./handler";
import { Server, Socket } from "socket.io";

export function addHandler(
  handler: Handler,
  socketIOElementConstructor: Function,
  instance: object,
  io: Server,
) {
  io.on(handler.event, (socket: Socket, ...args: any[]) => {
    const method = instance[handler.callbackMethodName];
    method.apply(instance, args);
  });
}
