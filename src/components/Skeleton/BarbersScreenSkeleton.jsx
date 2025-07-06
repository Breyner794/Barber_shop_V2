import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ProgressBar from "../ProgressBar";
import SkeletonHorizontalCard from "./SkeletonHorizontalCard";
import SkeletonButtonGroup from "./SkeletonButtonGroup";
import Header from "../Header";
import Footer from "../Footer";

const SkeletonScreenBarber = () => {
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
              <Skeleton width={350} height={40} />
            </h2>
            <ProgressBar currentStep={3} />
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonHorizontalCard key={index} />
              ))}
            </div>
            <SkeletonButtonGroup />
          </div>
        </div>
        <Footer />
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonScreenBarber;
