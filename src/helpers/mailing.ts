import { resend } from '../config/resend';
import { renderEmail as renderDeletionEmail } from '../emails/AccountDeletion';
import { renderEmail as renderVerificationEmail } from '../emails/Verification';

export async function sendAccountVerificationEmail({
    to,
    verificationUrl,
    displayName,
}: {
    to: string;
    verificationUrl: string;
    displayName: string;
}) {
    const { data, error } = await resend.emails.send({
        from: "Auth <no-reply@emails.ricardo.gg>",
        to: [to],
        subject: `Verify your email, @${displayName}!`,
        html: renderVerificationEmail({
            verificationUrl: verificationUrl,
            displayName: displayName,
        }),
    });

    if (error) {
        return console.error({ error });
    }

    return data;
}

export async function sendAccountDeletionEmail({
    to,
    verificationUrl,
    displayName,
}: {
    to: string;
    verificationUrl: string;
    displayName: string;
}) {
    const { data, error } = await resend.emails.send({
        from: "Auth <no-reply@emails.ricardo.gg>",
        to: [to],
        subject: `@${displayName}'s account delete confirmation.`,
        html: renderDeletionEmail({ verificationUrl: verificationUrl, displayName: displayName }),
    });

    if (error) {
        return console.error({ error });
    }

    return data;
}

export function emailDisplayName(email: string) {
    return email.split("@")[0];
}
