import * as nodePath from "node:path";
import * as nodeFS from "node:fs/promises";
import envPaths from "env-paths";
export function PathBuilder(...args) {
    function build(...subargs) {
        return nodePath.join(...args, ...subargs);
    }
    return Object.assign(build, {
        partial: (...subargs) => PathBuilder(...args, ...subargs),
    });
}
export const path = {
    ...nodePath,
};
export const fs = {
    ...nodeFS,
    readTextFile: (p) => fs.readFile(p, "utf-8"),
    mkdirp: (p) => nodeFS.mkdir(p, { recursive: true }),
    tryReadTextFile: ((p, fb) => fs.readTextFile(p).catch(() => fb)),
    writeFilep: (p, s) => fs.mkdirp(nodePath.dirname(p)).then(() => fs.writeFile(p, s)),
};
export function AppPathBuilders(appName, opts = {}) {
    const suffix = opts.suffix || "";
    const asDataSubdir = opts.asDataSubdir || new Set();
    const paths = envPaths(appName, { suffix });
    function getBuilder(k) {
        const isSubdir = asDataSubdir.has(k);
        return isSubdir ? PathBuilder(paths.data, paths[k]) : PathBuilder(paths[k]);
    }
    return {
        config: getBuilder("config"),
        log: getBuilder("log"),
        data: getBuilder("data"),
        temp: getBuilder("temp"),
        cache: getBuilder("cache"),
    };
}
//# sourceMappingURL=index.js.map