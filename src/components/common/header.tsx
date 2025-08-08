"use client";

// Next
import Link from "next/link";
import Image from "next/image";

// UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Icons
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";

// Auth Client
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Helpers
import { capitalizeName } from "@/helpers/capitalize";

const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between p-4">
      <Sheet>
        <div className="flex w-full justify-between">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo of App"
              width={120}
              height={40}
              priority
            />
          </Link>

          <SheetTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            {session?.user ? (
              <div className="flex justify-between space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={session.user?.image || undefined}
                      alt={session.user.name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {session.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-xs font-semibold">
                      {session?.user?.name && capitalizeName(session.user.name)}
                    </h3>
                    <span className="text-muted-foreground block text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    toast.warning("Você saiu da sua conta!");
                    return authClient.signOut();
                  }}
                >
                  <LogOutIcon size={12} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Olá. Faça seu login!</h2>
                <Button size="icon" variant="outline" asChild>
                  <Link href="/authentication">
                    <LogInIcon size={12} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
