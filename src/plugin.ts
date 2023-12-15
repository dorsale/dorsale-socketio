import { HANDLERS_PROPERTY_KEY, PLUGIN_NAME } from "./constants";
import "reflect-metadata";
import { Server } from "socket.io";
import { FastifyInstance } from "fastify";
import { Handler } from "./handler";
import { getReflectPropertyOfElement } from "@dorsale/plugin-toolbox";
import { addHandler } from "./util";

export const plugin = {
  name: PLUGIN_NAME,
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
    SOCKET_IO_HANDLER_KEY: (
      target: Function,
      runtime: object,
      pluginData: any,
    ) => {
      const handlers: Handler[] =
        getReflectPropertyOfElement(target, HANDLERS_PROPERTY_KEY) || [];
      handlers.forEach((handler) => {
        addHandler(handler, target, runtime, pluginData.io);
      });
    },
  },
};
