import { SportShoe } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { Link } from "react-router";
import AuthButton from "@/components/AuthButton.tsx";

const Header = () => {
    const { authenticated, username, role } = useContext(AuthContext);

    console.log("Authenticated:", authenticated);
    console.log("Username:", username);
    console.log("Role:", role);

    return (
        <header className="fixed top-0 left-0 w-full bg-light-gray z-50">
            <div className="container border mx-auto px-auto flex items-center text-center justify-between">

                <Link to="/" className="h-[10vh] flex items-center justify-center">
                    <SportShoe className="h-[60%] w-auto text-dark-blue pl-8" />
                    <h1 className="font-mono text-small text-dark-blue text-shadow-dark-blue font-bold tracking-wide translate-y-4 -ml-1">
                        MileFlow
                    </h1>
                </Link>

                <nav className="flex items-center gap-4 text-dark-blue font-medium pr-8">
                    <Link to="/">Home</Link>

                    {authenticated && role === "SUPERADMIN" && (
                        <>
                            <Link to="/admin/coaches">Coaches</Link>
                            <Link to="/admin/athletes">Athletes</Link>
                        </>
                    )}

                    {authenticated && role === "COACH" && (
                        <>
                            <Link to="/coach/athletes">My Athletes</Link>
                            <Link to="/coach/program">Program</Link>
                            <Link to="/coach/performance">Performance</Link>
                        </>
                    )}

                    {authenticated && role === "ATHLETE" && (
                        <>
                            <Link to="/athlete/program">My Program</Link>
                            <Link to="/athlete/performance">Performance</Link>
                        </>
                    )}

                    <AuthButton />
                </nav>
            </div>
        </header>
    );
};

export default Header;