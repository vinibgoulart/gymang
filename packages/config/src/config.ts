import dotenvSafe from "dotenv-safe";
import path from "path";

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root(".env"),
  sample: root(".env.example"),
});

export const { MONGO_URI, NODE_ENV, GYMANG_ENV, GRAPHQL_PORT, JWT_KEY } =
  process.env;
