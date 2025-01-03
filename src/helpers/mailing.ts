import { resend } from "../config/resend";
import { renderEmail as renderDeletionEmail } from "../emails/AccountDeletion";
import { renderEmail as renderVerificationEmail } from "../emails/Verification";
import { env } from "../env";

export async function sendAccountVerificationEmail({
    to,
    verificationUrl,
    displayName,
}: {
    to: string;
    verificationUrl: string;
    displayName: string;
}) {
    const appName = env.APP_NAME;
    const emailDomain = env.EMAIL_DOMAIN;

    const { data, error } = await resend.emails.send({
        from: `${appName} - Auth <no-reply@${emailDomain}>`,
        to: [to],
        subject: `Verify your email, @${displayName}!`,
        html: renderVerificationEmail({
            verificationUrl: verificationUrl,
            displayName: displayName,
            appName,
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
    const appName = env.APP_NAME;
    const emailDomain = env.EMAIL_DOMAIN;

    const { data, error } = await resend.emails.send({
        from: `${appName} - Auth <no-reply@${emailDomain}>`,
        to: [to],
        subject: `${displayName}'s account delete confirmation.`,
        html: renderDeletionEmail({
            verificationUrl: verificationUrl,
            displayName: displayName,
            appName,
        }),
    });

    if (error) {
        return console.error({ error });
    }

    return data;
}

export function emailDisplayName(email: string) {
    return email.split("@")[0];
}
