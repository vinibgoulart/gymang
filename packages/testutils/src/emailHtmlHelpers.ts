import { parse } from 'node-html-parser';

import type { SesCall } from './emailHelpers';

export const parseHtmlEmailFromSes = (email: SesCall) =>
  parse(email.Message.Body.Html.Data);
