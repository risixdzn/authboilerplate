import { Avatar } from "@/components/account/avatar";
import { Settings } from "@/components/account/settings";
import { SignOutButton } from "@/components/auth/signout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/auth/axios";
import { nonSensitiveUser } from "@repo/schemas/auth";
import { ApiResponse } from "@repo/schemas/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

export default async function ServerPage() {
    const res = await axios.get<ApiResponse<z.infer<typeof nonSensitiveUser>>>("/account");

    const content = res.data.data;

    return (
        <div className='w-full flex flex-col items-center py-6 px-5 md:p-10'>
            <div className='w-full max-w-6xl space-y-10'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>Account (server)</h1>
                        <Button asChild variant={"link"}>
                            <Link href='/dashboard/client/account'>
                                Client <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    <div className='flex gap-2'>
                        <ModeToggle />
                        <SignOutButton variant={"outline"}>Signout</SignOutButton>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row gap-10'>
                    <div className='w-full lg:max-w-[20rem] space-y-4'>
                        <Avatar identiconHash={content?.id} className='size-32' />
                        <div className='space-y-1'>
                            <h2
                                className={`text-3xl w-full tracking-tight truncate ${content?.displayName && "font-semibold"}`}
                            >
                                {content?.displayName ?? "No display name"}
                            </h2>
                            <p className='text-muted-foreground'>{content?.email}</p>
                        </div>
                    </div>
                    <div className='w-full space-y-6'>
                        <Settings displayName={content?.displayName ?? ""} />
                    </div>
                </div>
            </div>
        </div>
    );
}
