import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function RegisterSuccess() {
    return (
        <div className='flex flex-col items-center space-y-6'>
            <div className='p-4 bg-foreground rounded-lg'>
                <CircleCheck className='text-background' />
            </div>
            <div className='text-center space-y-1'>
                <h1 className='text-2xl font-semibold tracking-tight'>Check your inbox!</h1>
                <p className='text-muted-foreground text-sm'>
                    Your account was created successfully!🎉
                </p>
            </div>
            <p className='text-center'>
                We sent you a confirmation email. Click the link and you are ready to go!
            </p>
            <Link href='/auth/login'>
                <Button>
                    Go to login <ArrowRight />
                </Button>
            </Link>
        </div>
    );
}
