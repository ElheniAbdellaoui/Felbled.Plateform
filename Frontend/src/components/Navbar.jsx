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
import { ChartColumnBig, LogOut, Search, User } from "lucide-react";

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
import { FaMoon, FaRegEdit, FaSun } from "react-icons/fa";
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
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ role sécurisé (évite "userRole is not defined")
  const userRole = user?.role || "guest";

  const onChangeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `https://felblad-plateform.onrender.com/api/v1/user/logout`,
        {
          withCredentials: true,
        }
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

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  useEffect(() => {
    for (
      let index = 0;
      index < document.getElementsByClassName("lang").length;
      index++
    ) {
      const element = document.getElementsByClassName("lang")[index];
      if (element.value === i18n.language) {
        element.setAttribute("selected", "true");
      }
    }
  }, [i18n.language]);

  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* Logo + Search */}
        <div className="flex gap-7 items-center">
          <Link to={"/"}>
            <div className="flex gap-2 items-center">
              <img
                src={Logo}
                alt="Logo"
                className="w-7 h-7 md:w-10 md:h-10 dark:invert"
              />
              <h1 className="font-bold text-3xl md:text-4xl">Kinvest</h1>
            </div>
          </Link>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search"
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0" onClick={handleSearch}>
              <Search />
            </Button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <NavLink to={"/"} className="cursor-pointer">
              <li>{t("menu.home")}</li>
            </NavLink>
            <NavLink to={"/blogs"} className="cursor-pointer">
              <li>{t("menu.blogs")}</li>
            </NavLink>
            <NavLink to={"/about"} className="cursor-pointer">
              <li>{t("menu.about")}</li>
            </NavLink>
            {/* ✅ Exemple: accès admin */}
            {userRole === "admin" && (
              <NavLink to={"/dashboard/admin"} className="cursor-pointer">
                <li>{t("menu.admin")}</li>
              </NavLink>
            )}
          </ul>

          <div className="flex">
            {/* Theme Switch */}
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {/* Lang Selector */}
            <div className="flex">
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
            </div>

            {/* User Menu */}
            {user ? (
              <div className="ml-7 flex gap-3 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoUrl || userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dark:bg-gray-800">
                    <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        <User />
                        <span>{t("Profile")}</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/your-blog")}
                      >
                        <ChartColumnBig />
                        <span>Your Blog</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/comments")}
                      >
                        <LiaCommentSolid />
                        <span>Comments</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/write-blog")}
                      >
                        <FaRegEdit />
                        <span>Write Blog</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      <LogOut />
                      <span>{t("menu.logout")}</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="hidden md:block" onClick={logoutHandler}>
                  {t("menu.logout")}
                </Button>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2 ">
                <Link to={"/login"}>
                  <Button>{t("menu.login")}</Button>
                </Link>
                <Link className="hidden md:block" to={"/signup"}>
                  <Button>{t("menu.signup")}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Responsive Menu */}
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>

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
