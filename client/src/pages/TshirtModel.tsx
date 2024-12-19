import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Loader } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

interface ApiResponse {
  history: string[];
  message?: string;
}

function TshirtModel({ color }: { color: string }) {
  const { nodes } = useGLTF("/models/Tshirt.glb") as any;

  // Set the material color dynamically for the T-shirt meshes
  const material = new MeshStandardMaterial({ color });

  return (
    <group dispose={null} scale={[1, 1, 1]}>
      {/* Outer T-Shirt Mesh */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_exterieur_ext_0.geometry}
        material={material}
      />
      {/* Inner T-Shirt Mesh */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_int_int_0.geometry}
        material={material}
      />
    </group>
  );
}

export default function TShirtColorModel() {
  const [color, setColor] = useState<string>("#ffffff");
  const [colors, setColors] = useState<string[]>([]);

  // Fetch color history (optional API call to demonstrate saved colors)
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
        console.error(error);
      }
    };
    fetchColors();
  }, []);

  return (
    <Layout>
      <div className="relative w-screen h-[calc(100vh-4rem)]">
        {/* Canvas for 3D T-Shirt Model */}
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center backdrop-invert-0">
              <Loader className="size-8 animate-spin" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 1, 5], fov: 50 }}
            style={{ height: "100%", width: "100%" }}
          >
            <color attach="background" args={["#101010"]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Stage environment="city" intensity={0.6}>
              <TshirtModel color={color} />
            </Stage>
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </Suspense>

        {/* Display Saved Colors */}
        {colors.length > 0 && (
          <div className="fixed bottom-4 left-4 p-4 rounded-lg backdrop-blur-md bg-gray-100/10 space-y-2 shadow-md">
            <h2 className="text-lg font-semibold text-white text-center">
              My Color Collections
            </h2>
            <div className="flex justify-between items-center">
              <Input
                id="colorPicker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-1/2 rounded-lg border-none cursor-pointer"
              />
              <span className="font-semibold">{color}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setColor(color)}
                  style={{ backgroundColor: color }}
                  className="cursor-pointer w-8 h-8 rounded-full hover:scale-110 duration-200 border border-gray-700"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

useGLTF.preload("/models/Tshirt.glb");
