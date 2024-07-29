"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function setSwitchState() {
    switch (theme) {
      case "dark":
        return setChecked(true);
      case "light":
        return setChecked(false);
      case "system":
        return setChecked(false);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.image && (
            <Image
              src={user.image}
              alt={user.name!}
              fill
              className="rounded-full"
            />
          )}
          {!user?.image && (
            <AvatarFallback className="bg-primary/25">
              <div className="font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10">
          {user?.image && (
            <Image
              src={user.image}
              alt={user.name!}
              className="rounded-full"
              width={36}
              height={36}
            />
          )}
          <p className="font-bold text-xs">{user?.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user?.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="group py-2 font-medium cursor-pointer "
        >
          <TruckIcon
            size={14}
            className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />
          My orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="group py-2 font-medium cursor-pointer transition-all duration-500"
        >
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer group">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center "
            >
              <div className="relative flex mr-3">
                <Sun
                  size={14}
                  className="group-hover:text-yellow-600 transition-all duration-500 ease-in-out dark:scale-0 absolute"
                />
                <Moon
                  size={14}
                  className="group-hover:text-blue-500 dark:scale-100  scale-0 transition-all ease-in-out"
                />
              </div>
              <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-500">
                {theme[0].toUpperCase() + theme?.slice(1)} Mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  if (e) setTheme("dark");
                  if (!e) setTheme("light");
                }}
              />
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => signOut()}
          className="py-2 group font-medium cursor-pointer "
        >
          <LogOut
            size={14}
            className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out"
          />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
