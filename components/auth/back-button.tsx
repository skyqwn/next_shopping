"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProsp {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProsp) => {
  return (
    <Button variant={"link"} className="font-medium w-full">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};

export default BackButton;
