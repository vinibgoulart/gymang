import { getLoaderRegistry } from "@gymang/graphql";
import { UserLoader } from "@gymang/user";

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);

export { getDataloaders, registerLoader };
