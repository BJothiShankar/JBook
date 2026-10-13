import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",

    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return {
          path: "index.js",
          namespace: "a",
        };
      });

      // Handle React
      build.onResolve({ filter: /^react$/ }, () => {
        return {
          namespace: "a",
          path: "https://unpkg.com/react@17.0.2/index.js",
        };
      });

      // Handle ReactDOM
      build.onResolve({ filter: /^react-dom$/ }, () => {
        return {
          namespace: "a",
          path: "https://unpkg.com/react-dom@17.0.2/index.js",
        };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
