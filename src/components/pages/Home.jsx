import { useState } from 'react';
import { motion } from 'framer-motion';
import Feed from '@/components/organisms/Feed';
import StoriesBar from '@/components/organisms/StoriesBar';
import CreateStoryModal from '@/components/organisms/CreateStoryModal';

const Home = () => {
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  const handleCreateStory = () => {
    setIsCreateStoryOpen(true);
  };

  const handleCloseCreateStory = () => {
    setIsCreateStoryOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <StoriesBar onCreateStory={handleCreateStory} />
      <Feed />
      
      <CreateStoryModal 
        isOpen={isCreateStoryOpen}
        onClose={handleCloseCreateStory}
      />
    </motion.div>
  );
};

export default Home;