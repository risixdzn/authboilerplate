"use client";

import React, { FormEvent } from "react";
import { Button, ButtonProps } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@pheralb/toast";
import { useRouter } from "next/navigation";

const SignOutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => {
        const router = useRouter();

        const onSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const fetchSignout = async () => {
                const response = await fetch("/api/auth/signout", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.redirected) {
                    router.push(response.url);
                }
            };

            toast.loading({
                text: "Signing you out, hold tight...",
                options: {
                    promise: fetchSignout(),
                    success: "See you later!",
                    error: "Error signing out, try again.",
                    autoDismiss: false,
                },
            });
        };

        return (
            <form onSubmit={(e) => onSubmit(e)}>
                <Button ref={ref} {...props}>
                    {children}
                    <LogOut />
                </Button>
            </form>
        );
    }
);
SignOutButton.displayName = "SignOutButton";

export { SignOutButton };
