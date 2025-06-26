import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ProgressBar from "../ProgressBar";
import SkeletonHorizontalCard from "./SkeletonHorizontalCard";
import SkeletonButtonGroup from "./SkeletonButtonGroup";

const SkeletonScreenBarber = () => {
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
            <Skeleton width={350} height={40} />
          </h2>
          <ProgressBar currentStep={3} />
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonHorizontalCard key={index} />
            ))}
          </div>
          <SkeletonButtonGroup/>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonScreenBarber;
