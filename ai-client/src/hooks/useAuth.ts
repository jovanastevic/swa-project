import { useEffect, useState } from "react";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }, []);

    return { isLoggedIn };
}