"use client";

import { SignOutButton } from "@/components/signout-button";
import { axios } from "@/lib/auth/axios";
import { useQuery } from "@tanstack/react-query";
import { nonSensitiveUser } from "@repo/schemas/auth";
import { z } from "zod";
import { ApiResponse } from "@repo/schemas/utils";
import { AxiosResponse } from "axios";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientPage() {
    const { isPending, error, data } = useQuery<
        AxiosResponse<ApiResponse<z.infer<typeof nonSensitiveUser>>>
    >({
        queryKey: ["accountData"],
        queryFn: async () => await axios.client.get("/account"),
    });

    if (error) return "An error has occurred: " + error.message;

    const content = data?.data.data;

    return (
        <div className='w-full flex flex-col items-center p-10'>
            <div className='w-full max-w-6xl space-y-10'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Account (client)</h1>
                    <SignOutButton variant={"outline"}>Signout</SignOutButton>
                </div>
                <div className='flex'>
                    <div className='w-full max-w-[20rem] space-y-4'>
                        <div className='w-32 h-32 rounded-full bg-accent flex justify-center items-center'>
                            <User className='size-10 text-muted-foreground' />
                        </div>
                        {!isPending ? (
                            <div className='space-y-1'>
                                <h2
                                    className={`text-3xl tracking-tight ${content?.displayName && "font-semibold"}`}
                                >
                                    {content?.displayName ?? "No display name"}
                                </h2>
                                <p className='text-muted-foreground'>{content?.email}</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                <Skeleton className='w-48 h-8' />
                                <Skeleton className='w-64 h-4' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
