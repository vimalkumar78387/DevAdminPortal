"use server";

import { cookies } from "next/headers";
import { validateAdminCredentials, setAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginFormState = { error: string };

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const username = ((formData.get("username") as string) || "").trim();
  const password = (formData.get("password") as string) || "";

  if (!validateAdminCredentials(username, password)) {
    return { error: "Invalid credentials. Check username/password." };
  }

  const jar = await cookies();
  await setAdminSession(username, jar);
  redirect("/admin");
}
