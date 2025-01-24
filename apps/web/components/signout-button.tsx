"use client";

import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { LogOut } from "lucide-react";

const SignOutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => {
        return (
            <form action='/api/auth/signout' method='GET'>
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
