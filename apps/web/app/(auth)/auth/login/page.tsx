import { LoginForm } from "@/components/auth/login-form";
import VerifiedDialog from "@/components/verified-dialog";
import { cookies } from "next/headers";

export default function LoginPage() {
    const cookieStore = cookies();
    const showVerifiedDialog = cookieStore.get("showVerifiedDialog")?.value === "true";

    return (
        <>
            <LoginForm />
            <VerifiedDialog open={showVerifiedDialog} />
        </>
    );
}
