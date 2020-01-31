import chokidar, { FSWatcher } from "chokidar";
import path from "path";

import { Config, WatcherListeners } from "./interfaces";

import { generateBasePathRelativeToRoot } from "./utils";

/**
 * The base watcher class, that handles all file watches and fires events accordingly.
 */
export class Watcher {
    /**
     * The paths generated by this `Watcher` instance, using the config.
     */
    private paths: string | string[];
    /**
     * The instance of the `chokidar` watcher that powers this wrapper class.
     */
    private instance: FSWatcher;

    /**
     * Create an instance of the `Watcher`.
     * @param {Config} config The base configuration for the watcher.
     * @param {WatcherListeners} [listeners] Optional listeners than can be passed to run custom functions before or after emitted events.
     */
    constructor(
        private config: Config,
        private listeners: WatcherListeners = {
            onBeforeStart: null,
            onStart: null,
            onBeforeChange: null,
            onChange: null,
            onBeforeStop: null,
            onStop: null
        }
    ) {
        const { paths, root, watcher } = this.config;

        this.paths = generateBasePathRelativeToRoot(
            path.join(__dirname, "../", root),
            paths
        );

        this.instance = chokidar.watch(this.paths, {
            ...watcher,
            persistent: true,
            ignoreInitial: true
        });
    }

    public getInstance(): FSWatcher {
        return this.instance;
    }
}