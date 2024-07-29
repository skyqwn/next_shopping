import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";

const Nav = async () => {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            <Link href={"/"}>NEXT_SHOPPING</Link>
          </li>
          {!session ? (
            <li>
              <Button>
                <Link className="flex gap-2" href="/auth/login">
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
