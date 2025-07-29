"use client";

import { useEffect, useState } from "react";
import { AccountResType } from "@api/schemaValidations/account.schema";

type ProfileData = {
  id: number;
  name: string;
  email: string;
};

type ProfileProps = {
  data: AccountResType;
};

const Profile = ({ data }: ProfileProps) => {
  const [profile, setProfile] = useState<ProfileData>(data.data);

  useEffect(() => {
    setProfile(data.data);
  }, [data]);
  return (
    <div>
      <h1>Profile</h1>
      <p>Hello {profile.name}</p>
    </div>
  );
};

export default Profile;
