import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services/api/postService';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const maxLength = 280;
  const remainingChars = maxLength - content.length;
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image');
      return;
    }
    
    if (content.length > maxLength) {
      toast.error(`Content must be ${maxLength} characters or less`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        userId: "1", // Current user ID
        content: content.trim(),
        imageUrl: imagePreview // In a real app, this would be uploaded to a server
      };
      
      await postService.create(postData);
      
      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Post created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const backdropInitial = { opacity: 0 };
  const backdropAnimate = { opacity: 1 };
  const backdropExit = { opacity: 0 };
  
  const modalInitial = { opacity: 0, scale: 0.95 };
  const modalAnimate = { opacity: 1, scale: 1 };
  const modalExit = { opacity: 0, scale: 0.95 };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={backdropInitial}
            animate={backdropAnimate}
            exit={backdropExit}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={modalInitial}
            animate={modalAnimate}
            exit={modalExit}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface border border-gray-700 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-heading font-semibold text-white">Create Post</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex gap-3 mb-4">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Your Avatar"
                    size="md"
                  />
                  <div className="flex-1">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's happening?"
                      className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-lg"
                      rows="4"
                      maxLength={maxLength}
                    />
                  </div>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <ApperIcon name="Image" className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${remainingChars < 20 ? 'text-warning' : remainingChars < 0 ? 'text-error' : 'text-gray-400'}`}>
                      {remainingChars}
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={(!content.trim() && !image) || remainingChars < 0 || isSubmitting}
                      loading={isSubmitting}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;