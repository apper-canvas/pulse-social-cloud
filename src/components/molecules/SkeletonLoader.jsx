import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'post' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);
  
  const PostSkeleton = ({ index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface/40 border border-gray-700/50 rounded-xl p-6 mb-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
      </div>
      <div className="h-48 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
      <div className="flex items-center gap-6">
        <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
      </div>
    </motion.div>
  );
  
  const CommentSkeleton = ({ index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface/30 border border-gray-700/30 rounded-lg p-4 mb-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-3 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <div key={index}>
          {type === 'post' ? (
            <PostSkeleton index={index} />
          ) : (
            <CommentSkeleton index={index} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;