import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
  const { user } = useSelector((store) => store.auth);
  const { t } = useTranslation();

  return (
    <div
      className={`${
        openNav ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-800 px-8 pb-6 pt-16 text-black dark:text-gray-100 md:hidden rounded-r-xl shadow-md transition-all`}
    >
      {/* User Section */}
      <div>
        <div className="flex items-center justify-start gap-3">
          {user ? (
            <Avatar className="w-14 h-14">
              <AvatarImage src={user.photoUrl || "/user.jpg"} size={50} />
            </Avatar>
          ) : (
            <FaUserCircle size={50} className="" />
          )}

          <div>
            <h1>
              {t("hello")}, {user?.firstName || t("user")}
            </h1>
            <h1 className="text-sm text-slate-500">{t("premiumUser")}</h1>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="mt-12">
          <ul className="flex flex-col gap-7 text-2xl font-semibold">
            <Link to="/" onClick={() => setOpenNav(false)}>
              <li className="cursor-pointer">{t("menu.home")}</li>
            </Link>
            <Link to="/blogs" onClick={() => setOpenNav(false)}>
              <li className="cursor-pointer">{t("menu.blogs")}</li>
            </Link>
            <Link to="/about" onClick={() => setOpenNav(false)}>
              <li className="cursor-pointer">{t("menu.about")}</li>
            </Link>

            {user ? (
              <Button
                onClick={() => {
                  logoutHandler();
                  setOpenNav(false);
                }}
              >
                {t("menu.logout")}
              </Button>
            ) : (
              <Link to={"/signup"} onClick={() => setOpenNav(false)}>
                <Button>{t("menu.signup")}</Button>
              </Link>
            )}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="pb-20">
        <h1>{t("madeWith")} ❤️ Heni</h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
