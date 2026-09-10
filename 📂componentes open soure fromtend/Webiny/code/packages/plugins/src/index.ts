import { PluginsContainer } from "./PluginsContainer.js";
import { AsyncPluginsContainer } from "./AsyncPluginsContainer.js";
import { Plugin } from "./Plugin.js";

const plugins = new PluginsContainer();

export { Plugin, PluginsContainer, plugins, AsyncPluginsContainer };
