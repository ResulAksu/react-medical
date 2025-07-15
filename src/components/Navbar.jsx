import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroLink } from "@heroui/react";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  return (
    <Navbar className="bg-gradient-to-r from-[#1a1333] via-[#2d1a4d] to-[#3c2066] border-b border-[#6d28d9] shadow-lg">
      <NavbarBrand>
        <span className="ml-2 font-bold text-[#a78bfa] text-xl tracking-wide">MedicalUI</span>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <HeroLink as={Link} to="/" className="text-[#a78bfa]" color="foreground">Home</HeroLink>
        </NavbarItem>
        <NavbarItem>
          <HeroLink as={Link} to="/dashboard" className="text-[#a78bfa]" color="foreground">Dashboard</HeroLink>
        </NavbarItem>
        <NavbarItem>
          <HeroLink as={Link} to="/uploads" className="text-[#a78bfa]" color="foreground">Uploads</HeroLink>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
