"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../AppProvider";

type ProfileData = {
  id: number;
  name: string;
  email: string;
};

type ProfileProps = {
  data: {
    status: number;
    payload: {
      data: ProfileData;
    };
  };
};

const Profile = ({ data }: ProfileProps) => {
  const [profile, setProfile] = useState<ProfileData>(data.payload.data);
  const { sessionToken } = useAppContext();
  console.log(sessionToken);

  useEffect(() => {
    setProfile(data.payload.data);
  }, [data]);
  return (
    <div>
      <h1>Profile</h1>
      <p>Hi {profile.name}</p>
    </div>
  );
};

export default Profile;
