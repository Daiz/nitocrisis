declare module "awesome-typescript-loader" {
  interface CheckerOptions {
    /** Default: `false` */
    silent?: boolean;
    /** Default: `"typescript"` */
    compiler?: string;
    /** Default: `false` */
    useTranspileModule?: boolean;
    /** Default: `"at-loader"` */
    instance?: string;
    /** Default: `"tsconfig.json"` */
    configFileName?: string;
    /** Default: `false` */
    transpileOnly?: boolean;
    /** Default: `[]` */
    ignoreDiagnostics?: number[];
    /** Default: `false` */
    useBabel?: boolean;
    /** Default: `undefined` */
    babelCore?: string;
    /** Default: `null` */
    babelOptions?: object;
    /** Default: `false` */
    useCache?: boolean;
    /** Default: `false` */
    usePreCompiledFiles?: false;
    /** Default: `".awcache"` */
    cacheDirectory?: string;
    /** Default: `[]` */
    reportFiles?: string[];
  }
  interface PathsOptions {
    /** Default: `"tsconfig.json"` */
    configFileName?: string;
    /** Default: `"typescript"` */
    compiler?: string;
  }
  import { Plugin } from "webpack";
  export class CheckerPlugin extends Plugin {
    constructor(opts?: CheckerOptions);
  }
  export class TsConfigPathsPlugin extends Plugin {
    constructor(opts?: PathsOptions);
  }
}
