"use client";

import { RegisterForm } from "@/components/register-form";
import RegisterSuccess from "@/components/register-success";
import { useState } from "react";

export default function RegisterPage() {
    const [success, setSuccess] = useState(false);

    return !success ? <RegisterForm onSuccess={setSuccess} /> : <RegisterSuccess />;
}
