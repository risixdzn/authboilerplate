import { SignOutButton } from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/auth/axios";
import Link from "next/link";

export default async function ServerPage() {
    const res = await axios.server.get("/account");

    return (
        <>
            This was rendered on the server <pre>{JSON.stringify(res.data, null, 3)}</pre>
            <div className='flex gap-2'>
                <Link href='/dashboard/client'>
                    <Button>Client</Button>
                </Link>
                <SignOutButton>Signout</SignOutButton>
            </div>
        </>
    );
}
