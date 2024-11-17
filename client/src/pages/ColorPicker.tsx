import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, ImageUp, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Layout from "@/components/Layout";
import { usePDF } from "react-to-pdf";

interface Color {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  luminance: number;
  bestContrast: string;
}

interface ColorInspiration {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  theme: string;
  group: string;
}

interface Color {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  lab: { l: number; a: number; b: number };
  luminance: number;
  luminanceWCAG: number;
  bestContrast: string;
  swatchImg: { svgNamed: string; svg: string };
}

interface ColorDataResponse {
  colors: Color[];
  error?: { message: string };
}

// Helper function to create a lighter or darker shade of a hex color
const adjustBrightness = (hex: string, factor: number) => {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));

  // Convert hex to RGB
  const rgb = parseInt(hex.slice(1), 16);
  let r = (rgb >> 16) & 0xff;
  let g = (rgb >> 8) & 0xff;
  let b = rgb & 0xff;

  // Use a factor that makes lighter/darker adjustments more natural
  if (factor > 0) {
    // Lighten the color by blending it with white
    r = clamp(Math.round(r + (255 - r) * (factor / 100)));
    g = clamp(Math.round(g + (255 - g) * (factor / 100)));
    b = clamp(Math.round(b + (255 - b) * (factor / 100)));
  } else {
    // Darken the color by reducing RGB values proportionally
    r = clamp(Math.round(r * (1 + factor / 100)));
    g = clamp(Math.round(g * (1 + factor / 100)));
    b = clamp(Math.round(b * (1 + factor / 100)));
  }

  // Convert back to hex and return the new color
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

const ColorPalette = ({ baseColor }: { baseColor: string }) => {
  // Generate an array of shades from light to dark
  const shades = [
    adjustBrightness(baseColor, 60),
    adjustBrightness(baseColor, 40),
    adjustBrightness(baseColor, 20),
    baseColor, // Original color
    adjustBrightness(baseColor, -20),
    adjustBrightness(baseColor, -40),
    adjustBrightness(baseColor, -60),
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 font-sans">
        Color Palette for{" "}
        <span className="underline font-mono">{baseColor}</span>
      </h2>
      <div className="flex items-center gap-2">
        {shades.map((shade, index) => (
          <div key={index} className="text-center">
            <div
              style={{ backgroundColor: shade }}
              className="mx-auto size-10 border rounded-lg mb-2"
            />
            <p className="text-sm font-semibold">{shade.toLocaleLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ColorPaletteApp() {
  const [colorInput, setColorInput] = useState("#87cefa");
  const [colorData, setColorData] = useState<Color | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inspirations, setInspirations] = useState<ColorInspiration[]>([]);
  const [loadingColorData, setLoadingColorData] = useState(true);
  const [loadingInspiration, setLoadingInspiration] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const colorsPerPage = 9;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { toPDF, targetRef } = usePDF({ filename: "hueify.pdf",page: {margin: 10}});

  useEffect(() => {
    const addToHistory = async () => {
      const res = await fetch("/api/user/color-history", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({hex: colorData?.hex})
      })

      const data = await res.json();

      if(res.ok){
        console.log(data.message);
      }
    }

    addToHistory();
  },[colorData]);

  const fetchColorData = async (input: string) => {
    try {
      setLoadingColorData(true);

      // Determine if the input is a hex code
      const isHexCode = /^#[0-9A-F]{6}$/i.test(input);
      const endpoint = isHexCode
        ? `https://api.color.pizza/v1/?values=${input.replace("#", "")}`
        : `https://api.color.pizza/v1/names/?name=${encodeURIComponent(input)}`;

      const response = await fetch(endpoint);
      const data: ColorDataResponse = await response.json();

      if ("error" in data) {
        setError(data.error?.message as string);
        setColorData(null);
      } else {
        // Check if an exact match is available
        const exactMatch = data.colors.find((color) =>
          isHexCode
            ? color.hex.toLowerCase() === input.toLowerCase()
            : color.name.toLowerCase() === input.toLowerCase()
        );

        // Set color data to the exact match if found, otherwise to the first color in the array
        setColorData(exactMatch || data.colors[0]);
        setError(null);
      }
    } catch (err) {
      setError("An error occurred while fetching color data.");
      setColorData(null);
    } finally {
      setLoadingColorData(false);
    }
  };

  const fetchColorInspirations = async () => {
    try {
      setLoadingInspiration(true);
      const response = await fetch("https://api.color.pizza/v1/?list=html");
      const data = await response.json();

      // Select 99 random colors from the array
      const getRandomColors = (colors: any[], count: number) => {
        const shuffled = colors.slice(); // Create a shallow copy to avoid mutating original data
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }
        return shuffled.slice(0, count);
      };

      // Use the helper function to pick 99 colors
      setInspirations(getRandomColors(data.colors, 99));
    } catch (err) {
      setError("An error occurred while fetching color inspirations.");
    } finally {
      setLoadingInspiration(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchColorInspirations();
      await fetchColorData("#87cefa"); // Replace with any initial hex color or handle it based on `colorInput` state
    };
    initializeData(); // Only runs on initial mount
  }, []);

  const handleColorChange = (value: string) => {
    setColorInput(value);
    setError(null);

    const isHexCode = /^#[0-9A-F]{6}$/i.test(value);
    const isNonEmptyName = value.trim().length > 0 && !isHexCode;

    if (isHexCode || isNonEmptyName) {
      fetchColorData(value);
    } else {
      setColorData(null);
    }
  };

  const handleColorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const color = colorInput;
    const isHexCode = /^#[0-9A-F]{6}$/i.test(color);
    const isNonEmptyName = color.trim().length > 0 && !isHexCode;

    if (isHexCode || isNonEmptyName) {
      fetchColorData(color);
    } else {
      setColorData(null);
      setError("Please enter a valid hex code or a non empty name");
    }
  };

  const getCurrentColors = () => {
    const startIndex = (currentPage - 1) * colorsPerPage;
    const endIndex = startIndex + colorsPerPage;
    return inspirations.slice(startIndex, endIndex);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(inspirations.length / colorsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const extractColorFromImage = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!canvasRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Calculate scale factor between the displayed image and the canvas image
    const imgElement = event.currentTarget;
    const scaleX = canvas.width / imgElement.width;
    const scaleY = canvas.height / imgElement.height;

    // Get the click coordinates on the displayed image
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;

    // Convert coordinates to match canvas scaling
    const canvasX = clickX * scaleX;
    const canvasY = clickY * scaleY;

    // Get pixel data from the scaled coordinates on the canvas
    const pixel = context.getImageData(canvasX, canvasY, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
      .toString(16)
      .slice(1)}`;

    setColorInput(hex);
    fetchColorData(hex);
  };

  useEffect(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [selectedImage]);

  // Handle drag over to prevent default behavior
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Trigger file input click
  const handleDivClick = () => {
    inputRef?.current?.click();
  };

  // Handle pasting image
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setSelectedImage(file);
        }
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-8">
        <div className="w-full flex justify-between">
          <Card className="w-1/2 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Color Picker</CardTitle>
              <CardDescription>
                Enter a hex code or use the color picker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <form onSubmit={handleColorSubmit} className="flex-grow">
                    <Label htmlFor="colorInput">Color</Label>
                    <Input
                      id="colorInput"
                      name="colorInput"
                      type="text"
                      value={colorInput}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="Enter hex code (e.g., #ff0000)"
                      aria-describedby="colorInputHelp"
                    />
                    <p
                      id="colorInputHelp"
                      className="text-sm text-muted-foreground mt-1"
                    >
                      Enter a valid hex color code or color name (e.g., #ff0000
                      or sky blue)
                    </p>
                  </form>
                  <div>
                    <Label htmlFor="colorPicker">Pick</Label>
                    <Input
                      id="colorPicker"
                      type="color"
                      value={colorInput}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-10 w-10 p-0 border-0"
                      aria-label="Color picker"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {loadingColorData ? (
                  <Loader className="mx-auto backdrop-invert-0 size-5 animate-spin" />
                ) : colorData ? (
                  <div className="size-full">
                    <div ref={targetRef} className="space-y-2 font-mono">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-16 rounded-md h-10  border"
                          style={{ backgroundColor: colorData.hex }}
                          aria-hidden="true"
                        ></div>
                        <span className="font-semibold">{colorData.name}</span>
                      </div>
                      <p>Hex: {colorData.hex}</p>
                      <p>
                        RGB:{" "}
                        {`${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}`}
                      </p>
                      <p>
                        HSL:{" "}
                        {`${Math.round(colorData.hsl.h)}°, ${Math.round(
                          colorData.hsl.s
                        )}%, ${Math.round(colorData.hsl.l)}%`}
                      </p>
                      <p>Luminance: {colorData.luminance.toFixed(2)}</p>
                      <p>Best Contrast: {colorData.bestContrast}</p>
                      <ColorPalette baseColor={colorData.hex} />
                    </div>
                    <div className="flex gap-3">
                    <Button className="font-sans" onClick={() => {setColorData(null); setColorInput("");}}>Clear</Button>
                    <Button variant="outline" onClick={() => toPDF()}>Download</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center font-semibold text-muted-foreground">
                    {colorInput && `No color found with ${colorInput}`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Image Color Picker */}
          <Card className="w-1/2 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Image Color Picker</CardTitle>
              <CardDescription>Pick a color from your image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer mx-auto w-60 h-28 border-2 rounded-xl border-dashed"
                onClick={handleDivClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
              >
                <ImageUp className="size-10 text-muted-foreground" />
                <span className="text-muted-foreground text-xs font-semibold">
                  Upload A Image
                </span>
                <span className="text-muted-foreground text-xs font-semibold">
                  Or Drag And Drop Or Paste
                </span>
              </div>
              {selectedImage && (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width={300}
                    height={300}
                  />
                  <img
                    className="max-w-full max-h-[300px] rounded-xl shadow-md cursor-crosshair"
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    onClick={extractColorFromImage}
                  />
                  <Button
                    className="mt-5"
                    onClick={() => setSelectedImage(null)}
                  >
                    Clear Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color Inspirations</CardTitle>
            <CardDescription>Discover beautiful color palettes</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingInspiration ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="backdrop-invert-0 size-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getCurrentColors().map((color, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div
                      className="h-24"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    ></div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold capitalize">{color.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {color.hex}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        RGB: {`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Theme: {color.theme}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Group: {color.group}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handlePrevious} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                currentPage === Math.ceil(inspirations.length / colorsPerPage)
              }
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
