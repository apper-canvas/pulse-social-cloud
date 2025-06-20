import { motion } from 'framer-motion';
import Feed from '@/components/organisms/Feed';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <Feed />
    </motion.div>
  );
};

export default Home;