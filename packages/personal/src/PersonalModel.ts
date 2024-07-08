import { writeConcern } from '@gymang/graphql';
import { hashSync, compareSync } from 'bcryptjs';
import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

type Personal = {
  _id: Types.ObjectId;
  firstName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
  authenticate: (password: string) => boolean;
  encryptPassword: (password: string) => string;
};

export type IPersonal = Document & Personal;

const PersonalSchema = new Schema<IPersonal>(
  {
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      hidden: true,
      required: true,
    },
    removedAt: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    collection: 'Personal',
    writeConcern,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

PersonalSchema.methods = {
  authenticate(plainTextPassword: string) {
    return compareSync(plainTextPassword, this.password);
  },

  encryptPassword(password: string) {
    return hashSync(password);
  },
};

PersonalSchema.pre('save', function encryptPasswordHook(next) {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

const PersonalModel = model<IPersonal>('Personal', PersonalSchema);

export default PersonalModel;
