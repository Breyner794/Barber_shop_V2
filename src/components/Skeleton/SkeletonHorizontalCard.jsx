import Skeleton from "react-loading-skeleton";

const SkeletonHorizontalCard = () => {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6 flex items-center gap-6">
      <Skeleton circle={true} height={40} width={40} />

      <div className="flex-grow">
        <p className="text-xl font-bold text-white">
          <Skeleton width="40%" height={30} />
        </p>
        <p className="text-sm text-gray-400 mt-1">
          <Skeleton width="20%" height={20} />
        </p>
      </div>
    </div>
  );
};

export default SkeletonHorizontalCard;
