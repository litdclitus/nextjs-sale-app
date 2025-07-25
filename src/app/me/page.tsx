import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function MeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const response = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    }
  );

  const payload = await response.json();
  const data = {
    status: response.status,
    payload,
  };

  if (!response.ok) {
    throw data;
  }

  return (
    <div>
      <h1>Hi {payload.data.name}!</h1>
    </div>
  );
}
