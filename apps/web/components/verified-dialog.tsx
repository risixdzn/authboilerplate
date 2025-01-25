"use client";

import { Dialog, DialogContent } from "./ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@pheralb/toast";
import { ArrowRight, GalleryVerticalEnd } from "lucide-react";

export default function VerifiedDialog({ open }: { open: boolean }) {
    const [openDialog, setOpenDialog] = useState(open);

    if (open) {
        document.cookie = "showVerifiedDialog=; max-age=0; path=/";
    }

    const openChangeHandler = (bool: boolean) => {
        setOpenDialog(bool);
        toast.info({
            text: "Login to explore the app.",
            description: "We are waiting for you!",
        });
    };

    return (
        <Dialog open={openDialog} onOpenChange={(bool) => openChangeHandler(bool)}>
            <DialogContent>
                <div className='flex flex-col gap-4 items-center'>
                    <div className='flex items-center justify-center rounded-md bg-primary text-primary-foreground p-2'>
                        <GalleryVerticalEnd className='size-5' />
                    </div>
                    <div className='text-foreground space-y-1 text-center'>
                        <h2 className='font-bold tracking-tight text-2xl'>Account Verified! 🎉</h2>
                        <p className='text-muted-foreground'>
                            Your account verification is complete.
                        </p>
                    </div>
                    <div className='text-foreground space-y-1 text-center'>
                        <p className='text-muted-foreground text-sm'>
                            Your email has been successfully verified, and your account is ready to
                            go. Click below to log in and start exploring.
                        </p>
                    </div>
                    <Button className='w-full' size={"sm"} onClick={() => setOpenDialog(false)}>
                        Start <ArrowRight />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
