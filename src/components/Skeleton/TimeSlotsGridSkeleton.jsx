import SkeletonTimeSlot from './SkeletonTimeSlot';
const TimeSlotsGridSkeleton = () => (

            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonTimeSlot key={index} />
              ))}
            </div>
     
);
export default TimeSlotsGridSkeleton;