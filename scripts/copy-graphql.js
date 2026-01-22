import { readdir, mkdir, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function copyGraphqlFiles(source, destination) {
  await mkdir(destination, { recursive: true });

  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyGraphqlFiles(sourcePath, destinationPath);
    } else if (entry.name.endsWith(".graphql")) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

await copyGraphqlFiles(
  fileURLToPath(new URL("../src/", import.meta.url)),
  fileURLToPath(new URL("../dist/", import.meta.url)),
);
