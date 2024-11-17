import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

type CustomColors = {
  accesoriesColor?: string;
  body?: string;
  rimsColor?: string;
};

type ModelProps = {
  material: string | null;
  customColors: CustomColors;
} & JSX.IntrinsicElements['group']; // Extends group props for three.js components

const Model: React.FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF('/models/mclaren720.gltf') as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  if (props.material !== 'null') {
    const galaxyTexture = useLoader(TextureLoader, props.material as string);

    // Create a new material for the car body with the galaxy texture
    const galaxyMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        map: galaxyTexture,
      });
    }, [galaxyTexture]);

    // Replace the existing 'materials.Paint_Material' with the new 'galaxyMaterial'
    materials.Paint_Material = galaxyMaterial;
  }

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.149}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.Badge_Material}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials.Carbon1M_Material}
          material-color={props.customColors.accesoriesColor}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.DriverMaleGeneric_Material}
          material-color={props.customColors.accesoriesColor}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.Engine_Material}
          material-color={props.customColors.accesoriesColor}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.Interior_Material}
          material-color={props.customColors.accesoriesColor}
        />
        <mesh geometry={nodes.Object_7.geometry} material={materials.Glass_Material} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.Grille4_Material} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.Grille2_Material} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.Grille3_Material} />
        <mesh geometry={nodes.Object_11.geometry} material={materials.InteriorTilling_Material} />
        <mesh geometry={nodes.Object_12.geometry} material={materials.Grille5_Material} />
        <mesh geometry={nodes.Object_13.geometry} material={materials.Grille6_Material} />
        <mesh geometry={nodes.Object_14.geometry} material={materials.NumberPlate_Material} />
        <mesh geometry={nodes.Object_15.geometry} material={materials.SeatBelt_Material} />
        <mesh geometry={nodes.Object_16.geometry} material={materials.Window_Material} />
        <mesh geometry={nodes.Object_17.geometry} material={materials.Light_Material} />
        <mesh geometry={nodes.Object_18.geometry} material={materials.Base_Material} material-color="black" />
        <mesh geometry={nodes.Object_19.geometry} material={materials.Carbon1_Material} />
        <mesh geometry={nodes.Object_20.geometry} material={materials.Coloured_Material} />
        <mesh geometry={nodes.Object_21.geometry} material={materials.Coloured_Material} />
        <mesh geometry={nodes.Object_22.geometry} material={materials.Grille1_Material} />
        <mesh geometry={nodes.Object_23.geometry} material={materials.Paint_Material} material-color={props.customColors.body} />
        <mesh geometry={nodes.Object_24.geometry} material={materials.Paint_Material} />
        <mesh geometry={nodes.Object_25.geometry} material={materials.Paint_Material} />
        <mesh geometry={nodes.Object_26.geometry} material={materials.Paint_Material} />
        <mesh geometry={nodes.Object_27.geometry} material={materials.Paint_Material} />
        <mesh geometry={nodes.Object_28.geometry} material={materials.Paint_Material} />
        <mesh geometry={nodes.Object_29.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_30.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_31.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_32.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_33.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_34.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_35.geometry} material={materials.badge} />
        <mesh geometry={nodes.Object_36.geometry} material={materials.badge} />
        <mesh
          geometry={nodes.Object_37.geometry}
          material={materials.bespoke}
          material-color={props.customColors.rimsColor}
        />
        <mesh geometry={nodes.Object_38.geometry} material={materials.bespoke} />
        <mesh geometry={nodes.Object_39.geometry} material={materials.bespoke} />
        <mesh geometry={nodes.Object_40.geometry} material={materials.bespoke} />
        <mesh geometry={nodes.Object_41.geometry} material={materials.carbon} />
        <mesh geometry={nodes.Object_42.geometry} material={materials.carbon} />
        <mesh geometry={nodes.Object_43.geometry} material={materials.carbon} />
        <mesh
          geometry={nodes.Object_44.geometry}
          material={materials.material}
          material-color={props.customColors.rimsColor}
        />
        <mesh geometry={nodes.Object_45.geometry} material={materials.material} />
        <mesh geometry={nodes.Object_46.geometry} material={materials.material} />
        <mesh geometry={nodes.Object_47.geometry} material={materials.material} />
        <mesh
          geometry={nodes.Object_48.geometry}
          material={materials.rotor}
          material-color={props.customColors.rimsColor}
        />
        <mesh
          geometry={nodes.Object_49.geometry}
          material={materials['spoke.001']}
          material-color={props.customColors.rimsColor}
        />
        <mesh geometry={nodes.Object_50.geometry} material={materials['spoke.001']} />
        <mesh geometry={nodes.Object_51.geometry} material={materials['spoke.001']} />
        <mesh geometry={nodes.Object_52.geometry} material={materials['spoke.001']} />
        <mesh geometry={nodes.Object_53.geometry} material={materials.tire} />
      </group>
    </group>
  );
};

useGLTF.preload('/models/mclaren720.gltf');
export default Model;
