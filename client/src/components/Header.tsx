import { useUser } from "@/context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ModeToggle } from "./mode-toggle";

const Header = ({ varient = "dark" }: { varient?: "dark" | "light" }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

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
        varient && varient === "dark" ? "text-black" : "text-white"
      } "w-full h-14 px-5 flex items-center justify-between bg-transparent"`}
    >
      <span className="text-2xl">Hueify</span>
      <div className="w-1/4 min-w-[200px] flex px-5 py-2 font-semibold items-center justify-between">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="#">Help</Link>
      </div>
      {user && (
        <div className="w-1/5 flex justify-end">
          <Popover>
            <PopoverTrigger>
              <span className="border-4 border-t-green-600 border-b-purple-600 border-l-pink-700 border-r-yellow-500  cursor-pointer size-11 text-xl rounded-full bg-blue-500 font-semibold flex items-center justify-center antialiased">
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
                  <Button variant={"outline"} onClick={() => handleSignout()}>Log Out</Button>
                  <Button variant={"default"}>Edit</Button>
                  <Button variant={"destructive"}>Delete</Button>
                  <ModeToggle />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
};

export default Header;
