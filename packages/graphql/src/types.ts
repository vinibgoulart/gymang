import mongoose, { Model } from 'mongoose';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

type Ctx = any;
export type LoaderFn = (ctx: Ctx, id: string | ObjectId | object) => any;
