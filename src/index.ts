import * as nodePath from "node:path";
import * as nodeFS from "node:fs/promises";
import envPaths from "env-paths";

export type PathBuilder = ((...args: string[]) => string) & {
  partial: (...args: string[]) => PathBuilder;
};

export function PathBuilder(...args: string[]): PathBuilder {
  function build(...subargs: string[]) {
    return nodePath.join(...args, ...subargs);
  }
  return Object.assign(build, {
    partial: (...subargs: string[]) => PathBuilder(...args, ...subargs),
  });
}

export const path: typeof nodePath = {
  ...nodePath,
};

type Fn_tryReadTextFile = {
  (
    p: string,
    fb: string,
  ): Promise<string>;
  (p: string): Promise<string | undefined>;
};

export const fs: typeof nodeFS & {
  readTextFile: (p: string) => Promise<string>;
  mkdirp: (p: string) => Promise<string | undefined>;
  writeFilep: (p: string, s: string) => Promise<void>;
  tryReadTextFile: Fn_tryReadTextFile;
} = {
  ...nodeFS,
  readTextFile: (p) => fs.readFile(p, "utf-8"),
  mkdirp: (p) => nodeFS.mkdir(p, { recursive: true }),
  tryReadTextFile:
    ((p, fb) => fs.readTextFile(p).catch(() => fb)) as Fn_tryReadTextFile,
  writeFilep: (p, s) =>
    fs.mkdirp(nodePath.dirname(p)).then(() => fs.writeFile(p, s)),
};

export type AppPathBuilders = {
  config: PathBuilder;
  log: PathBuilder;
  data: PathBuilder;
  temp: PathBuilder;
  cache: PathBuilder;
};
type AppPathOpts = {
  suffix?: string;
  asDataSubdir?: Set<keyof AppPathBuilders>;
};
export function AppPathBuilders(
  appName: string,
  opts: AppPathOpts = {},
): AppPathBuilders {
  const suffix = opts.suffix || "";
  const asDataSubdir = opts.asDataSubdir || new Set();
  const paths = envPaths(appName, { suffix });
  function getBuilder(k: keyof AppPathBuilders) {
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
