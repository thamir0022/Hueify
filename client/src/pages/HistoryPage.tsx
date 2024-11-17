import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Loader } from "lucide-react";

interface ColorData {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  luminance: String;
}

interface ColorApiResponse {
  colors: ColorData[];
}

export default function ColorHistory() {
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchColorHistory();
  }, []);

  useEffect(() => {
    if (colorHistory.length > 0) {
      fetchColorData(colorHistory);
    }
  }, [colorHistory]);

  const fetchColorHistory = async () => {
    try {
      const response = await fetch("/api/user/get-history");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch color history");
      setColorHistory(data.history);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchColorData = async (colors: string[]) => {
    try {
      const colorValues = colors
        .map((color) => color.replace("#", ""))
        .join(",");
      const response = await fetch(
        `https://api.color.pizza/v1/?values=${colorValues}`
      );
      if (!response.ok) throw new Error("Failed to fetch color data");
      const data: ColorApiResponse = await response.json();
      setColorData(data.colors);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load color data");
      setIsLoading(false);
    }
  };

  // const handleColorClick = (hex: string) => {
  //   navigate(`/color/${hex.replace('#', '')}`)
  // }

  return (
    <Layout>
      {isLoading ? (
        <Loader className="size-8 backdrop-invert-0 animate-spin" />
      ) : error ? (
        <span>{error}</span>
      ) : colorData.length === 0 ? (
        <div className="items-center justify-center flex flex-col gap-3">
          <p className="text-xl font-semibold text-muted-foreground">
            You Have No Color History
          </p>
          <Button variant={"outline"}>
            <Link to={"/colors"}>Browse Colors</Link>
          </Button>
        </div>
      ) : (
        <div className="container mx-auto p-4 min-h-[80vh]">
          <h1 className="text-2xl text-center font-bold mb-4">
            Your Color History
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colorData.map((color, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="h-32 w-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-4">
                    <h2 className="font-semibold">{color.name}</h2>
                    <p className="text-sm text-gray-600">Hex {color.hex}</p>
                    <p className="text-sm text-gray-600">
                      Luminance {color.luminance}
                    </p>
                    {/* <Button
                    className="mt-2 w-full"
                    onClick={() => handleColorClick(color.hex)}
                  >
                    View Details
                  </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
