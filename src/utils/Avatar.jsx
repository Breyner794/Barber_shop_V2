import { useState } from "react";
import { User } from "lucide-react";

const Avatar = ({ src, alt, size = 14 }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!src || imageError) {
    return (
      <div className={`h-${size} w-${size} rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center`}>
        <User className={`w-${size - 6} h-${size - 6} text-gray-400`} />
      </div>
    );
  }

  return (
    <img
      className={`h-${size} w-${size} rounded-full object-cover border-2 border-gray-600`}
      src={src}
      alt={alt || ""}
      onError={() => setImageError(true)}
    />
  );
  
  };

  export default Avatar;