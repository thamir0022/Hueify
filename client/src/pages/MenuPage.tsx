import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

const MenuPage = () => {
  const [color, setColor] = useState("#FFFFFF");
  const [userFetchcolor, setUserFetchColor] = useState<Color | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [colors, setColors] = useState<Color[]>([]); // Store all fetched colors
  const [loading, setLoading] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const colorsPerPage = 9; // Number of colors to display per page

  const getColors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/colors");
      if (res.ok) {
        const data = await res.json();
        setColors(data.colors); // Store all colors fetched from the API
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  interface Color {
    name: string;
    theme: string;
    group: string;
    hex: string;
    rgb: string;
  }

  // Function to get colors for the current page
  const getCurrentColors = () => {
    const startIndex = (currentPage - 1) * colorsPerPage;
    const endIndex = startIndex + colorsPerPage;
    return colors.slice(startIndex, endIndex); // Slice colors for the current page
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(colors.length / colorsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Convert the query to lowercase and remove all whitespaces (leading, trailing, and inner spaces)
    const modifiedQuery = query.toLowerCase().replace(/\s+/g, "").trim();

    try {
      const res = await fetch(`/api/colors/${modifiedQuery}`);
      const data = await res.json();

      if (res.ok) {
        setUserFetchColor(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (error: any) {
      setError(error.message);
    }finally{
      setQuery("");
    }
  };

  return (
    <section
      style={{
        backgroundImage: "url(/src/assets/bg-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-screen h-fit"
    >
      <Header />
      <div className="w-screen h-[calc(100vh-4rem)] flex flex-col items-center gap-5">
        <div className="h-fit bg-transparent/10 backdrop-blur-sm rounded-3xl mx-auto p-5">
          <h2 className="text-4xl font-bold text-center text-white">
            Discover Beautiful <span className="text-purple-500">Color</span>{" "}
            Palettes
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-xl text-center text-black dark:text-white font-semibold">
              Enter a description or choose a color to find matching palettes
              and variants.
            </p>

            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                type="text"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(e.target.value);
                }}
                placeholder="Enter a color name"
                className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm 
                shadow-sm text-black focus:outline-none focus:border-sky-500 focus:ring-1 
                focus:ring-sky-500 disabled:bg-slate-50"
              />
              <Input
                type="color"
                value={color}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setColor(e.target.value)
                }
                className="w-14 p-1 h-10"
              />
              <Button type="submit">Generate</Button>
            </form>
            {error && <div className="text-center text-red-500">{error}</div>}
            {userFetchcolor && (
              <div className="grid grid-cols-2 gap-2">
                <p className="font-semibold">Color</p>
                <span style={{ backgroundColor: `#${userFetchcolor.hex}` }} className="w-1/3 shadow-md rounded-sm"/>
                <p className="font-semibold">Name</p>
                <span>{userFetchcolor.name}</span>
                <p className="font-semibold">Theme</p>
                <p>{userFetchcolor.theme}</p>
                <p className="font-semibold">Group</p>
                <p>{userFetchcolor.group}</p>
                <p className="font-semibold">Hex Code</p>
                <p>{userFetchcolor.hex}</p>
                <p className="font-semibold">RGB Code</p>
                <p>{userFetchcolor.rgb}</p>
                <Button className="w-1/4" onClick={() => setUserFetchColor(null)}>Clear</Button>
              </div>
            )}
          </div>
        </div>
        <div className="w-5/6 h-1/3 mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-black">Color Inspirations</h2>
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader className="size-14 stroke-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                {getCurrentColors().map(
                  ({ name, hex, rgb, theme, group }, index) => (
                    <div
                      key={index}
                      className="group grid grid-cols-2 h-24 p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                      style={{ backgroundColor: `#${hex}`, color: "black" }}
                    >
                      <span className="group-hover:scale-105 duration-300">
                        <p className="font-semibold">{name}</p>
                        <p>{hex}</p>
                      </span>
                      <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p>RGB: {rgb}</p>
                        <p>Theme: {theme}</p>
                        <p>Group: {group}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="w-full flex justify-between">
                <Button disabled={currentPage === 1} onClick={handlePrevious}>
                  Previous
                </Button>
                <Button
                  disabled={
                    currentPage === Math.ceil(colors.length / colorsPerPage)
                  }
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuPage;
