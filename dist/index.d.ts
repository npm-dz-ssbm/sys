import * as nodePath from "node:path";
import * as nodeFS from "node:fs/promises";
export type PathBuilder = ((...args: string[]) => string) & {
    partial: (...args: string[]) => PathBuilder;
};
export declare function PathBuilder(...args: string[]): PathBuilder;
export declare const path: typeof nodePath;
type Fn_tryReadTextFile = {
    (p: string, fb: string): Promise<string>;
    (p: string): Promise<string | undefined>;
};
export declare const fs: typeof nodeFS & {
    readTextFile: (p: string) => Promise<string>;
    mkdirp: (p: string) => Promise<string | undefined>;
    writeFilep: (p: string, s: string) => Promise<void>;
    tryReadTextFile: Fn_tryReadTextFile;
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
export declare function AppPathBuilders(appName: string, opts?: AppPathOpts): AppPathBuilders;
export {};
//# sourceMappingURL=index.d.ts.map