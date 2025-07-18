const path = require("path");
const { task, src, dest } = require("gulp");

task("copy", copyStaticFiles);

function copyStaticFiles() {
  const nodeSource = path.resolve("nodes", "**", "*.{png,svg,json}");
  const nodeDestination = path.resolve("dist", "nodes");

  src(nodeSource).pipe(dest(nodeDestination));

  const credSource = path.resolve("credentials", "**", "*.{png,svg}");
  const credDestination = path.resolve("dist", "credentials");

  return src(credSource).pipe(dest(credDestination));
}
