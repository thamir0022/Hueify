import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
// import { useCustomization } from "./Customization";

// Define prop types for the Configurator component
interface ConfiguratorProps {
  onBodyColorChange: (color: string) => void;
  onAccessoriesColorChange: (color: string) => void;
  onRimsColorChange: (color: string) => void;
  onMaterialChange: (materialPath: string) => void;
}

export default function Configurator({
  onBodyColorChange,
  onAccessoriesColorChange,
  onRimsColorChange,
  onMaterialChange,
}: ConfiguratorProps) {
  const [bodyColor, setBodyColor] = useState<string>("#ff0000");
  const [accessoriesColor, setAccessoriesColor] = useState<string>("#0000");
  const [rimsColor, setRimsColor] = useState<string>("#0000");
  // const { material, setMaterial } = useCustomization();

  return (
    <div className="fixed right-7 w-80 bottom-24 text-white p-4">
      <h2 className="font-sans font-semibold text-lg font">Pick Your Color</h2>
      <div className="flex flex-col">
        {/* Body Color Picker */}
        <div className="flex flex-row mt-3">
          <Input
            className="h-10 w-14 p-0 border-0"
            type="color"
            id="bodyColor"
            name="bodyColor"
            value={bodyColor}
            onChange={(e) => {
              setBodyColor(e.target.value);
              onBodyColorChange(e.target.value);
            }}
          />
          <Label className="inline-flex ml-4 items-center" htmlFor="bodyColor">
            Body
          </Label>
        </div>

        {/* Accessories Color Picker */}
        <div className="flex flex-row mt-3">
          <Input
            className="h-10 w-14 p-0 border-0"
            type="color"
            id="accessoriesColor"
            name="accessoriesColor"
            value={accessoriesColor}
            onChange={(e) => {
              setAccessoriesColor(e.target.value);
              onAccessoriesColorChange(e.target.value);
            }}
          />
          <Label
            className="inline-flex ml-4 items-center"
            htmlFor="accessoriesColor"
          >
            Accessories
          </Label>
        </div>

        {/* Rims Color Picker */}
        <div className="flex flex-row mt-3">
          <Input
            className="h-10 w-14 p-0 border-0"
            type="color"
            id="rimsColor"
            name="rimsColor"
            value={rimsColor}
            onChange={(e) => {
              setRimsColor(e.target.value);
              onRimsColorChange(e.target.value);
            }}
          />
          <Label className="inline-flex ml-4 items-center" htmlFor="rimsColor">
            Rims
          </Label>
        </div>
      </div>

      <h2 className="font-sans font-bold text-lg mt-4">Car Wrap</h2>
      {/* Material Selector */}
      <div className="mt-3 flex flex-row">
        <span
          onClick={() => onMaterialChange("null")}
          className="bg-white w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
        ></span>
        <img
          onClick={() => onMaterialChange("/galaxyMaterial.png")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../galaxyMaterial.png"
          alt="Galaxy Material"
        />
        <img
          onClick={() => onMaterialChange("/material1.png")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material1.png"
          alt="Material 1"
        />
        <img
          onClick={() => onMaterialChange("/material2.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material2.jpg"
          alt="Material 2"
        />
        <img
          onClick={() => onMaterialChange("/material3.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material3.jpg"
          alt="Material 3"
        />
        {/* <img
          onClick={() => onMaterialChange("../material4.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material4.jpg"
          alt="Material 4"
        /> */}
      </div>

      <div className="mt-3 flex flex-row">
        <img
          onClick={() => onMaterialChange("../material5.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material5.jpg"
          alt="Material 5"
        />
        <img
          onClick={() => onMaterialChange("../material6.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material6.jpg"
          alt="Material 6"
        />
        <img
          onClick={() => onMaterialChange("../material7.webp")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material7.webp"
          alt="Material 7"
        />
        <img
          onClick={() => onMaterialChange("../material8.webp")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material8.webp"
          alt="Material 8"
        />
        <img
          onClick={() => onMaterialChange("../material9.jpg")}
          className="w-8 h-8 rounded-full border-solid border-gray-700 mr-3 cursor-pointer"
          src="../material9.jpg"
          alt="Material 9"
        />
      </div>
    </div>
  );
}
