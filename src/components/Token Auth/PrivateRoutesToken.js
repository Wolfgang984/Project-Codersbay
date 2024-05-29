import React, { Suspense } from "react";
import { UserProviderToken } from "./UserContextToken.js";
import Fallback from "../Fallback.js";
import { Outlet } from "react-router-dom";

export default function PrivateRoutesToken() {
  return (
    <UserProviderToken>
      <Suspense fallback={<Fallback />}>
          <Outlet />
      </Suspense>
    </UserProviderToken>
  );
}
