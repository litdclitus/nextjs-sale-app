import envConfig from "@/config";
import Profile from "./profile";
import { cookies } from "next/headers";

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  console.log(sessionToken);

  const response = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const payload = await response.json();
  const data = {
    status: response.status,
    payload,
  };
  console.log(data);

  if (!response.ok) {
    throw data;
  }

  return (
    <div>
      <Profile data={data} />
    </div>
  );
}
