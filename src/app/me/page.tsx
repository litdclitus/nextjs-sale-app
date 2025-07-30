import Profile from "./profile";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequests/account";
import AuthTest from "@/components/AuthTest";

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log(sessionToken);

  const response = await accountApiRequest.me({
    sessionToken: sessionToken?.value || "",
  });

  console.log(response);

  return (
    <div>
      <Profile data={response} />
      <AuthTest />
    </div>
  );
}
