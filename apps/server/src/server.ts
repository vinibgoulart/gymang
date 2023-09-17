import { createServer } from 'http';
import { connectMongo } from '@gymang/mongo';

import app from './app';
import { config } from '@gymang/config';

export const server = async () => {
  try {
    console.log('connecting to database...');
    await connectMongo({});
  } catch (err) {
    console.log('Could not connect to database', { err });
    throw err;
  }

  const server = createServer(app.callback());

  server.listen(config.GRAPHQL_PORT, () => {
    console.log(`Server running in ${config.GRAPHQL_PORT}`);
    console.log(`See the GraphQL Server at /graphql`);
  });
};
