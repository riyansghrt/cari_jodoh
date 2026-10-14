/**
 * @format
 */

import "react-native-reanimated";
import "react-native-gesture-handler";

import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

const defaultGlobalErrorHandler = global.ErrorUtils?.getGlobalHandler?.();

global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
  console.log("Global JS Error:", {
    message: error?.message,
    stack: error?.stack,
    isFatal,
  });

  if (defaultGlobalErrorHandler) {
    defaultGlobalErrorHandler(error, isFatal);
  }
});

if (__DEV__) {
  global.__reanimatedLayoutReanimationDisabled = true;
}

// Load the application after startup globals and handlers are registered.
const App = require("./App").default;

AppRegistry.registerComponent(appName, () => App);
