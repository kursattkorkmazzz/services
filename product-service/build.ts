import esbuild from "esbuild";

(async () => {
  await esbuild.build({
    platform: "node",
    entryPoints: ["./src/**/*.ts"],
    outdir: "./dist",
    allowOverwrite: true,
    //packages: "external",
    target: "node20",
    bundle: true,
  });
})();
