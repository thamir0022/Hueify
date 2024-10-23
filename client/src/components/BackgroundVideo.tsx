import { Link } from "react-router-dom";
import Header from "./Header";

const BackgroundVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header varient="light"/>
      <video
        autoPlay
        muted
        loop
        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-[-1]"
      >
        <source src="/background-color.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Add any overlay content */}
      <div className="relative z-10 text-white text-center flex flex-col justify-center items-center h-full">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-purple-400">Hueify</span>
        </h1>
        <p className="text-xl mt-4 font-semibold">
          Personalize Your Color Palette: Tailor Perfect Matches to Your Images
          with Ease.
        </p>
        <Link to={'/menu'} type="button" className="btn">
          <strong>Discover</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BackgroundVideo;