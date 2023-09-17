import SES from 'aws-sdk/clients/ses';
import { set } from 'lodash';
import { parse } from 'node-html-parser';

export type SesCall = {
  Destination: {
    ToAddresses: string[];
  };
  Message: {
    Body: {
      Html: {
        Data: string;
      };
      Text: {
        Data: string;
      };
    };
    Subject: {
      Data: string;
    };
  };
  Source: string;
  ReplyToAddresses: string[];
  ReturnPath: string;
};

export const getEmailFromSes = (): SesCall[] => {
  let emails: SesCall = [];

  SES.mock.results.map((result) => {
    result.value.sendEmail.mock.calls.map((call) => {
      if (Array.isArray(call) && call.length > 0) {
        emails = [...emails, call[0]];
      }
    });
  });

  return emails;
};

export const getEmailDestinationEmails = (email: SesCall): string[] =>
  email.Destination.ToAddresses;

export const getEmailReplyTo = (email: SesCall): string[] =>
  email.ReplyToAddresses;

export const getEmailSubject = (email: SesCall): string =>
  email.Message.Subject.Data;

export const getEmailSource = (email: SesCall): string => email.Source;

export const getRawEmailFromSes = (): SesCall[] => {
  let emails: SesCall = [];

  // TODO - this is not SES
  SES.mock.results.map((result) => {
    result.value.sendRawEmail.mock.calls.map((call) => {
      if (Array.isArray(call) && call.length > 0) {
        emails = [...emails, call[0]];
      }
    });
  });

  return emails;
};

export const getRawEmailDestinationEmails = (email: SesCall): string[] =>
  email.Destinations;

export const frozenEmailPaths = [
  'Message.Body.Html.Data',
  'Message.Body.Text.Data',
];

export const getEmailBody = (email: SesCall) => email.Message.Body.Html.Data;

export const emailHasText = (email: SesCall, text: string) => {
  const emailData = email.Message.Body.Html.Data;

  return emailData.includes(text);
};

// Email data can change, so we make it fixed for now
export const sanitizeEmail = (calls: SesCall[]) => {
  if (!calls || !Array.isArray(calls)) {
    return calls;
  }

  const sanitized = calls.map((call) => {
    // TODO: SET mutates the object, use immutable later on
    frozenEmailPaths.map((path) => {
      set(call, path, 'FIXED_DATA');
    });

    return call;
  });

  return sanitized;
};

export const getUserEmail = (user: IUser) => {
  if (user.emails && user.emails.length > 0) {
    return user.emails[0].email;
  }

  return user.email;
};

export const checkEmails = ({
  targets,
  url,
}: {
  targets: { user: IUser; hasAction: boolean }[];
  url: string;
}) => {
  const emails = getEmailFromSes(SES) || [];
  const sortedEmails = emails.sort(
    (a, b) => getEmailDestinationEmails(a)[0] < getEmailDestinationEmails(b)[0],
  );

  const sortedTargets = targets.sort(
    (a, b) => getUserEmail(a.user) < getUserEmail(b.user),
  );

  expect(emails.length).toBe(targets.length);

  sortedTargets.forEach((target, index) => {
    const email = sortedEmails[index];

    expect(getEmailDestinationEmails(email)[0]).toBe(target.user.email);
    expect(emailHasText(email, url)).toBe(target.hasAction);
  });
};

export const assertGymangEmail = (email: SesCall, subject = 'Gymang') => {
  expect(getEmailReplyTo(email)[0]).toBe('naoresponda@gymang.com.br');
  expect(getEmailSource(email).includes('naoresponda@gymang.com.br')).toBe(
    true,
  );

  expect(getEmailSubject(email).includes(subject)).toBe(true);
};

export const getWholeUrlFromEmail = (
  email: SesCall,
  aTagPosition: number,
): string => {
  const emailBody = getEmailBody(email);

  const emailBodyHtml = parse(emailBody);

  const aTags = emailBodyHtml.querySelectorAll('a');

  const rawAttrs = aTags[aTagPosition]?.rawAttrs;

  if (!rawAttrs) {
    return '';
  }

  const href = rawAttrs.split(' ')[0];

  const urlComplete = href.split('"')[1];

  return urlComplete;
};

export const getUrlFromEmail = (
  email: SesCall,
  aTagPosition: number,
): string | null => {
  const urlComplete = getWholeUrlFromEmail(email, aTagPosition);

  if (!urlComplete) {
    return '';
  }

  const url = urlComplete.split('?')[0];

  return url;
};

export const getParamSearchUrlFromEmail = (
  email: SesCall,
  param: string,
  aTagPosition: number,
): string | null => {
  const urlComplete = getWholeUrlFromEmail(email, aTagPosition);

  if (!urlComplete) {
    return '';
  }

  const searchString = urlComplete.split('?')[1];

  const urlParams = new URLSearchParams(searchString);

  const paramFromUrl = urlParams.get(param);

  return paramFromUrl;
};

export const getUrlAndParamSearchFromEmail = (
  email: SesCall,
  param: string,
  aTagPosition: number,
) => {
  const url = getUrlFromEmail(email, aTagPosition);
  const paramFromUrl = getParamSearchUrlFromEmail(email, param, aTagPosition);

  return {
    url,
    paramFromUrl,
  };
};

export const assertLinkInEmail = (element: HTMLElement, href: string) => {
  expect(element).toHaveAttribute('href', href);
};
