import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSiteSession, SITE_SESSION_COOKIE } from "@/lib/siteAuth";

export default async function LoginPage() {
  if (isValidSiteSession((await cookies()).get(SITE_SESSION_COOKIE)?.value)) {
    redirect("/");
  }
  return null;
}
