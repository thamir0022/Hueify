import React, { useState } from "react";

const Image: React.FC = () => {
  const [hue, setHue] = useState<number>(0); // Default hue is 0

  const handleHueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHue(Number(event.target.value));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Select a hue to apply to the image:</h3>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={handleHueChange}
        style={{ marginBottom: "20px" }}
      />
      <img
        style={{ filter: `hue-rotate(${hue}deg) saturate(2)` }}
        src="https://img.freepik.com/premium-vector/white-tshirt-unisex-mockup-stylish-lightweight-clothing-with-pleats-sports-everyday-life_573660-392.jpg?w=360"
        alt="T-Shirt Mockup"
      />
    </div>
  );
};

export default Image;
