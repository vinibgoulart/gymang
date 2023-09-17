import jwt from "jsonwebtoken";

import { getObjectId } from "@gymang/graphql";
import { config } from "@gymang/config";

import { User, UserLoader } from "@gymang/user";

type GetUserFromCookieArgs = {
  sessionCookie?: string;
  dataloaders: Record<string, unknown>;
};

export const getUserFromCookie = async ({
  sessionCookie,
  dataloaders,
}: GetUserFromCookieArgs) => {
  if (!sessionCookie) {
    return { user: null };
  }

  try {
    const token = jwt.verify(
      sessionCookie?.replace("JWT", "").trim(),
      config.JWT_KEY
    );

    const userToken = await User.findOne({
      _id: getObjectId(token.id),
      removedAt: null,
    });

    if (!userToken) {
      return { user: null };
    }

    const user = await UserLoader.load(
      {
        dataloaders,
      },
      userToken!._id,
      true
    );

    return { user };
  } catch (err) {
    console.log("error while verifying token ", err);
    return { user: null };
  }
};
