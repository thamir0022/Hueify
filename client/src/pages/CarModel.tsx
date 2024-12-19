import { Suspense, useEffect, useState } from "react";
import Model from "../components/Mclaren720";
import { CustomizationProvider } from "@/components/Customization";
import { Canvas } from "@react-three/fiber";
import { MeshReflectorMaterial, OrbitControls, Stage } from "@react-three/drei";
import Configurator from "@/components/Configurator";
import Layout from "@/components/Layout";
import { Loader } from "lucide-react";

interface ApiResponse {
  history: string[];
  message?: string;
}

const CarModel: React.FC = () => {
  const [bodyColor, setBodyColor] = useState<string>("#ff0000");
  const [accessoriesColor, setAccessoriesColor] = useState<string>("#000000");
  const [rimsColor, setRimsColor] = useState<string>("#000000");
  const [material, setMaterial] = useState<string>("null");
  const [colors, setColors] = useState<string[]>([]);
  // const [modelLoading, setModelLoading] = useState<boolean>(true);

  const handleBodyColorChange = (color: string): void => {
    setBodyColor(color);
  };

  const handleMaterialChange = (newMaterial: string): void => {
    setMaterial(newMaterial);
  };

  const handleAccessoriesColorChange = (color: string): void => {
    setAccessoriesColor(color);
  };

  const handleRimsColorChange = (color: string): void => {
    setRimsColor(color);
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("/api/user/get-history");
        const data: ApiResponse = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error fetching color history");
        }
        setColors(data.history);
      } catch (error) {
        console.log(error);
      }
    };
    fetchColors();
  }, []);

  return (
    <Layout>
      <CustomizationProvider>
        <div className="w-screen h-[calc(100vh-4rem)]">
          <Suspense
            fallback={
              <div className="h-screen w-screen flex items-center justify-center backdrop-invert-0">
                <Loader className="size-8 animate-spin" />
              </div>
            }
          >
            <Canvas>
              <color attach="background" args={["#101010"]} />
              <fog attach="fog" args={["#101010", 10, 30]} />

              <OrbitControls maxPolarAngle={Math.PI / 2} />
              <Stage environment="city" intensity={0.6} contactShadow={false}>
                <Suspense fallback={null}>
                  <Model
                    position={[0, -0.6, 0]}
                    customColors={{
                      body: bodyColor,
                      accesoriesColor: accessoriesColor,
                      rimsColor: rimsColor,
                    }}
                    material={material}
                  />
                </Suspense>
              </Stage>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-0.5}>
                <planeGeometry args={[170, 170]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={40}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#101010"
                  metalness={0.5}
                />
              </mesh>
            </Canvas>

            <Configurator
              onBodyColorChange={handleBodyColorChange}
              onAccessoriesColorChange={handleAccessoriesColorChange}
              onRimsColorChange={handleRimsColorChange}
              onMaterialChange={handleMaterialChange}
            />
            {colors.length > 0 && (
              <div className="fixed bottom-4 w-1/3 mx-3 backdrop-blur-sm space-y-2">
              <h2 className="text-xl text-center font-semibold text-gray-200">My Color Collections</h2>
                <div className="grid grid-cols-6 grid-rows-2 gap-2 h-20">
                  {colors.map((color) => (
                    <div onClick={() => setBodyColor(color)} style={{backgroundColor: color}} className="cursor-pointer rounded-lg text-transparent hover:text-white hover:scale-110 duration-200">{color}</div>
                  ))}
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </CustomizationProvider>
    </Layout>
  );
};

export default CarModel;
