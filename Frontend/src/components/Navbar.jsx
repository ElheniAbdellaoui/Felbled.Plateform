import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import Logo from "../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import userLogo from "../assets/user.jpg";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { ChartColumnBig, LogOut, User, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEdit, FaMoon, FaRegEdit, FaSun } from "react-icons/fa";
import { toggleTheme } from "@/redux/themeSlice";
import { LiaCommentSolid } from "react-icons/lia";
import ResponsiveMenu from "./ResponsiveMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);

  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `https://felblad-plateform.onrender.com/api/v1/user/logout`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const toggleNav = () => setOpenNav(!openNav);

  // Fix sélection auto de la langue
  useEffect(() => {
    const elements = document.getElementsByClassName("lang");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === i18n.language) {
        element.setAttribute("selected", "true");
      }
    }
  }, [i18n.language]);

  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* Logo */}
        <div className="flex gap-7 items-center">
          <Link to="/" className="flex gap-2 items-center">
            <img
              src={Logo}
              alt="Logo"
              className="w-7 h-7 md:w-10 md:h-10 dark:invert"
            />
            <h1 className="font-bold text-3xl md:text-4xl">Kinvest</h1>
          </Link>

          {/* Search bar */}
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder={t("menu.search")}
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0" onClick={handleSearch}>
              <Search />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <NavLink to="/" className="cursor-pointer">
              <li>{t("menu.home")}</li>
            </NavLink>
            <NavLink to="/blogs" className="cursor-pointer">
              <li>{t("menu.blogs")}</li>
            </NavLink>
            <NavLink to="/about" className="cursor-pointer">
              <li>{t("menu.about")}</li>
            </NavLink>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {/* Lang select */}
            <Select onValueChange={onChangeLang} defaultValue={i18n.language}>
              <SelectTrigger className="w-[60px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="ar">AR</SelectItem>
              </SelectContent>
            </Select>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.photoUrl || userLogo} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {user?.firstName || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("Profile")}</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/your-blog")}
                    >
                      <ChartColumnBig className="mr-2 h-4 w-4" />
                      <span>Your Blog</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/comments")}
                    >
                      <LiaCommentSolid className="mr-2 h-4 w-4" />
                      <span>Comments</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/write-blog")}
                    >
                      <FaRegEdit className="mr-2 h-4 w-4" />
                      <span>Write Blog</span>
                    </DropdownMenuItem>

                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}

                    {user?.role === "professeur" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/write-course")}
                      >
                        <FaEdit className="mr-2 h-4 w-4" />
                        <span>Écrire un cours</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("menu.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="ml-7 md:flex gap-2">
                <Link to="/login">
                  <Button>{t("menu.se connecter")}</Button>
                </Link>
                <Link to="/signup" className="hidden md:block">
                  <Button>{t("menu.signup")}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Responsive menu toggle */}
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>

        {/* Mobile menu */}
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Navbar;
