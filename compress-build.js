const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const COMPRESSIBLE_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".svg",
  ".txt",
  ".xml",
]);
const buildDirectory = path.join(__dirname, "build");

function* walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(entryPath);
    } else if (entry.isFile()) {
      yield entryPath;
    }
  }
}

let compressedAssets = 0;
for (const assetPath of walk(buildDirectory)) {
  if (!COMPRESSIBLE_EXTENSIONS.has(path.extname(assetPath))) {
    continue;
  }

  const contents = fs.readFileSync(assetPath);
  fs.writeFileSync(
    `${assetPath}.gz`,
    zlib.gzipSync(contents, { level: zlib.constants.Z_BEST_COMPRESSION }),
  );
  fs.writeFileSync(
    `${assetPath}.br`,
    zlib.brotliCompressSync(contents, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }),
  );
  compressedAssets += 1;
}

console.log(`Precompressed ${compressedAssets} build assets with gzip and Brotli.`);
