import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const Analtics = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");
  return <div>Analtics</div>;
};

export default Analtics;
