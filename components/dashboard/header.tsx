"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { user, loading: isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
      // signOut now handles the redirect automatically
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
      // Even if signOut fails, try to redirect
      router.push("/");
    }
  };

  const getUserInitials = () => {
    if (!user) return "EM";
    const name = user.user_metadata?.name || user.email || "";
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserName = () => {
    if (!user) return "EventMaster";
    return user.user_metadata?.name || "Usuario";
  };

  const getUserEmail = () => {
    if (!user) return "admin@eventmaster.com";
    return user.email || "usuario@demo.com";
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-cream-light border-b border-beige-soft">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-dark h-4 w-4" />
          <Input
            placeholder="Buscar eventos, invitados..."
            className="pl-10 w-80 bg-white border-beige-soft text-black-soft"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative text-burgundy-dark hover:bg-burgundy-light hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full text-burgundy-dark hover:bg-burgundy-light hover:text-white"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" alt="Usuario" />
                <AvatarFallback className="bg-burgundy text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-black-soft">
                  {isLoading ? "Cargando..." : getUserName()}
                </p>
                <p className="text-xs leading-none text-gray-warm">
                  {isLoading ? "" : getUserEmail()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-black-soft hover:bg-cream hover:text-burgundy-dark">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-black-soft hover:bg-cream hover:text-burgundy-dark cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
