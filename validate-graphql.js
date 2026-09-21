const fs = require("fs");
const path = require("path");
const { buildSchema, parse, validate } = require("graphql");

const schema = buildSchema(fs.readFileSync("hesperomys.graphql", "utf8"));
const artifactPattern = /"text": ("(?:\\.|[^"\\])*")/;
let checked = 0;
const failures = [];

function validateArtifacts(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const artifactPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      validateArtifacts(artifactPath);
      continue;
    }
    if (!entry.name.endsWith(".graphql.ts")) {
      continue;
    }

    const source = fs.readFileSync(artifactPath, "utf8");
    const match = source.match(artifactPattern);
    if (!match) {
      continue;
    }

    checked += 1;
    const operation = JSON.parse(match[1]);
    const errors = validate(schema, parse(operation));
    if (errors.length > 0) {
      failures.push({ artifactPath, errors });
    }
  }
}

validateArtifacts("src");

if (failures.length > 0) {
  for (const { artifactPath, errors } of failures) {
    console.error(`${artifactPath}:`);
    for (const error of errors) {
      console.error(`  ${error.message}`);
    }
  }
  process.exitCode = 1;
} else {
  console.log(`Validated ${checked} compiled GraphQL operations.`);
}
