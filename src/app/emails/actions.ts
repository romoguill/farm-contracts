'use server';

import { Resend } from 'resend';

export async function sendEmail(
  from: string,
  to: string[],
  subject: string,
  template: JSX.Element
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    react: template,
  });

  return { error };
}
