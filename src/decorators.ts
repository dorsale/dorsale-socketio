import {
  addCustomElement,
  addReflectPropertyToElement,
  addReflectPropertyToElementMethod,
  getReflectPropertyOfElement,
} from "@dorsale/plugin-toolbox";
import "reflect-metadata";
import {
  HANDLER_PARAMETERS_PROPERTY_KEY,
  HANDLERS_PROPERTY_KEY,
  PLUGIN_NAME,
  SOCKET_IO_HANDLER_KEY,
  SOCKET_IO_NAMESPACE_PROPERTY_KEY,
} from "./constants";
import { Handler } from "./handler";
import acorn from "acorn";

export function SocketIOHandler(
  options: { namespace: string } | undefined = undefined,
) {
  return function (target: Function) {
    if (options?.namespace)
      addReflectPropertyToElement(
        target,
        SOCKET_IO_NAMESPACE_PROPERTY_KEY,
        options.namespace,
      );
    addCustomElement(PLUGIN_NAME, SOCKET_IO_HANDLER_KEY, target);
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
    addReflectPropertyToElementMethod(
      HANDLER_PARAMETERS_PROPERTY_KEY,
      params,
      target,
      propertyKey,
    );
    const handlers: Handler[] =
      getReflectPropertyOfElement(target, HANDLERS_PROPERTY_KEY) || [];
    handlers.push({
      event,
      callbackMethodName: propertyKey,
    });
    addReflectPropertyToElement(target, HANDLERS_PROPERTY_KEY, handlers);
  };
}
