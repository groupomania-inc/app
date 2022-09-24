import Image from "next/image";
import { signOut } from "next-auth/react";
import { FunctionComponent, useEffect, useState } from "react";

import LoadingSpinner from "../spinners/LoadingSpinner";

const UserMenu: FunctionComponent = () => {
    const [loadingSignout, setLoadingSignout] = useState<boolean>(false);
    const [userMenuExpanded, setUserMenuExpanded] = useState<boolean>(false);

    const handleToggleUserMenu = () => setUserMenuExpanded(!userMenuExpanded);
    const handleSignOut = async () => {
        setLoadingSignout(true);
        await signOut();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (!target.closest("#user-menu")) setUserMenuExpanded(false);
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return (
        <div className="relative ml-8" id="user-menu">
            <button
                type="button"
                className="mr-3 flex rounded-full text-sm focus:ring-4 focus:ring-gray-300"
                onClick={handleToggleUserMenu}
            >
                <Image
                    className="rounded-full shadow"
                    width={40}
                    height={40}
                    src="https://res.cloudinary.com/stevancorre/image/upload/v1664060971/default-user.jpg"
                    alt="User photo"
                />
            </button>
            {userMenuExpanded && (
                <div className="absolute right-0 top-12 z-10 w-44 divide-y divide-gray-100 rounded border bg-white font-normal shadow">
                    <ul className="py-1 text-sm text-gray-700">
                        <li>
                            <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                                Profile
                            </a>
                        </li>
                    </ul>
                    <div className="py-1">
                        <button
                            onClick={handleSignOut}
                            disabled={loadingSignout}
                            className="block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:text-center"
                        >
                            {loadingSignout ? <LoadingSpinner className="h-4" /> : "Se déconnecter"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
