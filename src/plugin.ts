import {
  HANDLERS_PROPERTY_KEY,
  PLUGIN_NAME,
  SOCKET_IO_HANDLER_KEY,
} from "./constants";
import "reflect-metadata";
import { Server } from "socket.io";
import { FastifyInstance } from "fastify";
import { Handler } from "./handler";
import { addHandlers } from "./util";

export const plugin = {
  name: PLUGIN_NAME,
  customElements: [SOCKET_IO_HANDLER_KEY],
  register: ({
    pluginData,
    server,
  }: {
    pluginData: any;
    server: FastifyInstance;
  }) => {
    pluginData.io = new Server(server.server);
    server.addHook("onClose", (fastify: FastifyInstance, done) => {
      pluginData.io.close();
      done();
    });
  },
  onMount: {
    [SOCKET_IO_HANDLER_KEY]: (
      target: Function,
      runtime: object,
      pluginData: any,
    ) => {
      const handlers: Handler[] =
        Reflect.getOwnMetadata(HANDLERS_PROPERTY_KEY, target.prototype) || [];
      addHandlers(handlers, runtime, pluginData.io);
    },
  },
};
