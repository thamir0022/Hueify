import { useUser } from "@/context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

const Header = ({ varient }: { varient?: "dark" | "light" }) => {
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Prioritize varient prop if provided, otherwise use theme context
  const appliedTheme = varient || theme;

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/user/sign-out", { method: "POST" });
      if (res.ok) {
        logout();
        navigate("/sign-in");
      }
    } catch (error) {
      logout();
      navigate("/");
      console.log(error);
    }
  };


  return (
    <header
      className={`${
        appliedTheme === "light" ? "text-black" : "text-white"
      } w-full h-14 px-14 flex items-center justify-between bg-transparent`}
    >
      <Link to={"/"} className="text-2xl font-semibold">Hueify</Link>
      <div className="gap-14 flex font-semibold">
        <Link className="hover:underline transition-all" to="/">Home</Link>
        <Link className="hover:underline transition-all" to="/menu">Menu</Link>
        <Link className="hover:underline transition-all" to="/colors">Colors</Link>
        <Link className="hover:underline transition-all" to="#">Help</Link>
      </div>
      {user ? (
        <Popover>
          <PopoverTrigger>
            <span className="border-4 border-t-green-600 border-b-purple-600 border-l-pink-700 border-r-yellow-500 cursor-pointer size-11 text-xl rounded-full bg-blue-500 font-semibold flex items-center justify-center antialiased">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Account</h4>
                <p className="text-sm text-muted-foreground">
                  Your Account Details
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="grid grid-cols-2 items-center gap-4">
                <span>First Name</span>
                <p>{user.firstName}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span>Last Name</span>
                <p>{user.lastName}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span>Email</span>
                <p className="line-clamp-1">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Button variant={"outline"} onClick={() => handleSignout()}>
                  Log Out
                </Button>
                <Button variant={"default"}>Edit</Button>
                <Button variant={"destructive"}>Delete</Button>
                <ModeToggle />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Link className="hover:underline" to={"/sign-in"}>Sign In</Link>
      )}
    </header>
  );
};

export default Header;
