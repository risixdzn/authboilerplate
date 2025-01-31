"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axios } from "@/lib/auth/axios";
import { ApiResponse } from "@repo/schemas/utils";
import { api } from "@/lib/utils";
import { fallbackMessages, messages } from "@/lib/messages";
import { toast } from "@pheralb/toast";
import { AxiosError } from "axios";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "../ui/form";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

export function DeleteAccount() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const requestAccountDeletionSchema = z.object({
        confirmPhrase: z.string().regex(/^delete my account$/, {
            message: "Invalid phrase.",
        }),
    });

    const form = useForm<z.infer<typeof requestAccountDeletionSchema>>({
        resolver: zodResolver(requestAccountDeletionSchema),
        defaultValues: { confirmPhrase: "" },
        mode: "all",
    });

    const { formState } = form;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function onSubmit(_: z.infer<typeof requestAccountDeletionSchema>) {
        setLoading(true);
        try {
            const res = await axios.client.post<ApiResponse>(api("/account/request-deletion"), {
                withCredentials: true,
            });
            if (res.status === 201) {
                const message = messages[res.data.code] ?? fallbackMessages.success;
                setOpen(false);

                toast.success({
                    text: message.title,
                    description: message.description,
                });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorData = error.response?.data as ApiResponse;
                const message = messages[errorData.code] ?? fallbackMessages.error;

                toast.error({
                    text: message.title,
                    description: message.description,
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size={"sm"} variant={"destructive"}>
                    Request deletion
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form id='change_password' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='confirmPhrase'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Please type &quot;delete my account&quot; to continue
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            required
                                            placeholder='Type it here'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant={"destructive"}
                        type='submit'
                        disabled={loading || !formState.isValid}
                        form='change_password'
                    >
                        {!loading ? <>Delete</> : <Loader2 className='animate-spin size-4' />}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
