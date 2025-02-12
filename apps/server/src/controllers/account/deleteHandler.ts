import { FastifyReply, FastifyRequest } from "fastify";

import { emailDisplayName, sendAccountDeletionEmail } from "../../helpers/mailing";
import { queryUserById } from "../../services/account.services";
import { deleteUser } from "../../services/auth.services";
import {
    createOneTimeToken,
    deleteUserExpiredTokensByUserId,
    getUserOneTimeTokens,
    queryOneTimeToken,
} from "../../services/tokens.services";
import { apiResponse } from "@/src/helpers/response";
import { env } from "@/src/env";

export async function requestAccountDeletionHandler({
    userId,
    request,
    response,
}: {
    userId: string;
    request: FastifyRequest;
    response: FastifyReply;
}) {
    await deleteUserExpiredTokensByUserId(userId);
    const oneTimeTokens = await getUserOneTimeTokens(userId);

    for (const token of oneTimeTokens) {
        if (token.tokenType === "account_deletion") {
            return response.status(409).send(
                apiResponse({
                    status: 409,
                    error: "Conflict",
                    code: "existing_deletion_request",
                    message:
                        "Deletion request already exists. Finish it or wait until expiration to request a new one.",
                    data: null,
                })
            );
        }
    }

    const user = await queryUserById(userId);

    const oneTimeToken = await createOneTimeToken({
        userId: userId,
        email: user.email,
        tokenType: "account_deletion",
    });

    const redirectUrl = `${env.FRONTEND_URL}/auth/login`;

    const verificationUrl = `${request.protocol}://${request.host}/account/confirm-deletion?token=${encodeURIComponent(oneTimeToken.token)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

    await sendAccountDeletionEmail({
        to: user.email,
        verificationUrl: verificationUrl,
        displayName: user.displayName ?? emailDisplayName(user.email),
    });

    return response.status(201).send(
        apiResponse({
            status: 201,
            error: null,
            code: "deletion_request_accepted",
            message: "Deletion request accepted, confirm email.",
            data: null,
        })
    );
}

export async function confirmAccountDeletionHandler({
    token,
    redirectUrl,
    response,
}: {
    token: string;
    redirectUrl?: string;
    response: FastifyReply;
}) {
    const oneTimeToken = await queryOneTimeToken(token);

    //Checks if the token exists, if it's not expired and if it's a deletion token
    if (!oneTimeToken) {
        return response.status(404).send(
            apiResponse({
                status: 404,
                error: "Not Found",
                code: "token_not_found",
                message: "Token not found",
                data: null,
            })
        );
    }
    if (oneTimeToken.expiresAt < new Date()) {
        return response.status(410).send(
            apiResponse({
                status: 410,
                error: "Gone",
                code: "token_expired",
                message: "Token expired",
                data: null,
            })
        );
    }
    if (oneTimeToken.tokenType !== "account_deletion") {
        return response.status(400).send(
            apiResponse({
                status: 400,
                error: "Bad Request",
                code: "invalid_token",
                message: "Invalid token",
                data: null,
            })
        );
    }

    //If all checks succeed, delete the user and the token will be automatically cascade deleted
    await deleteUser(oneTimeToken.user.id);

    if (redirectUrl) {
        return response
            .setCookie("showDeletedDialog", "true", {
                path: "/",
                httpOnly: false,
                sameSite: "none",
                secure: true,
            })
            .status(302)
            .redirect(decodeURIComponent(redirectUrl));
    }

    return response.status(200).send(
        apiResponse({
            status: 200,
            error: null,
            code: "account_deletion_success",
            message: "Account deleted sucessfully",
            data: null,
        })
    );
}
