import Profile from "./profile";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequests/account";
import AuthTest from "@/components/AuthTest";
import SlideSessionTest from "@/components/SlideSessionTest";

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log(sessionToken);

  const response = await accountApiRequest.me({
    sessionToken: sessionToken?.value || "",
  });

  console.log(response);

  return (
    <div className="space-y-6">
      <Profile data={response} />
      <AuthTest />
      <SlideSessionTest />
    </div>
  );
}
