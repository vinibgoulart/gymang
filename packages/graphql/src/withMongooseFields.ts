import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const removedAtMongooseField = {
  removedAt: {
    type: Date,
    index: true,
    default: null,
  },
};

export const langMongooseField = {
  lang: {
    type: String,
    description: 'Language field',
    default: 'pt-BR',
  },
};

export const companyMongooseField = {
  company: {
    type: ObjectId,
    ref: 'Company',
    description: 'Company that this document belongs to',
    required: true,
    index: true,
  },
};

export const tagsMongooseField = {
  tags: {
    type: [String],
    description:
      "Mixed tags related to this document. A tag is always something that describes an attribute. It can be a simple string or even a 'key:value' stringified.",
    index: true,
    default: [],
  },
};

export const scheduledPublishingMongooseFields = {
  publishDate: {
    type: Date,
    description: 'When this will be/was published',
  },
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  publishJob: {
    type: String,
    description: 'Publish bull job number',
  },
};

export const timezoneFields = {
  timezone: {
    type: String,
    default: 'America/Sao_Paulo',
  },
};

export const locationMongooseField = {
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
};

export const timeStampsMongooseField = {
  createdAt: {
    type: Date,
    index: true,
  },
  updatedAt: {
    type: Date,
    index: true,
  },
};

export const createdAtMongooseField = {
  createdAt: {
    type: Date,
    index: true,
  },
};
