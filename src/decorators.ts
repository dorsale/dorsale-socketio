import "reflect-metadata";
import {
  HANDLER_PARAMETERS_PROPERTY_KEY,
  HANDLERS_PROPERTY_KEY,
  PLUGIN_NAME,
  SOCKET_IO_HANDLER_KEY,
  SOCKET_IO_NAMESPACE_PROPERTY_KEY,
} from "./constants";
import { Handler } from "./handler";
import * as acorn from "acorn";
import {
  CUSTOM_ELEMENT_NAME_PROPERTY_KEY,
  PLUGIN_NAME_PROPERTY_KEY,
} from "@dorsale/commons";

export function SocketIOHandler(
  options: { namespace: string } | undefined = undefined,
) {
  return (target: Function) => {
    if (options?.namespace)
      Reflect.defineProperty(target, SOCKET_IO_NAMESPACE_PROPERTY_KEY, {
        value: options.namespace,
      });
    Reflect.defineMetadata(PLUGIN_NAME_PROPERTY_KEY, PLUGIN_NAME, target);
    Reflect.defineMetadata(
      CUSTOM_ELEMENT_NAME_PROPERTY_KEY,
      SOCKET_IO_HANDLER_KEY,
      target,
    );
  };
}

export function MessageHandler(event: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const methodAst = acorn.parseExpressionAt(descriptor.value.toString(), 0, {
      ecmaVersion: 2020,
    });
    // @ts-ignore
    const params = methodAst.arguments.map((param) => param.name);
    Reflect.defineMetadata(
      HANDLER_PARAMETERS_PROPERTY_KEY,
      params,
      target,
      propertyKey,
    );
    const handlers: Handler[] =
      Reflect.getOwnMetadata(HANDLERS_PROPERTY_KEY, target) || [];
    handlers.push({
      event,
      callbackMethodName: propertyKey,
    });
    Reflect.defineMetadata(HANDLERS_PROPERTY_KEY, handlers, target);
  };
}
