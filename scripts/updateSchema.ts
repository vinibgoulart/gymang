import fs from 'fs';
import { printSchema } from 'graphql';
import path from 'path';
import { promisify } from 'util';

import { schema as schemaWebServer } from '../apps/server/src/graphql/schema/schema';

const writeFileAsync = promisify(fs.writeFile);

const cwd = process.cwd();

(async () => {
  const configs = [
    {
      schema: schemaWebServer,
      path: path.join(cwd, `./apps/web/data/schema.graphql`),
    },
  ];

  await Promise.all([
    ...configs.map(async (config) => {
      console.log(config.path);
      await writeFileAsync(config.path, printSchema(config.schema));
    }),
  ]);

  process.exit(0);
})();
