import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '@/components/molecules/PostCard';
import CommentCard from '@/components/molecules/CommentCard';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services/api/postService';
import { commentService } from '@/services/api/commentService';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const postData = await postService.getById(id);
        setPost(postData);
        
        // Load comments
        setCommentsLoading(true);
        const commentsData = await commentService.getByPostId(id);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || 'Failed to load post');
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    
    loadPost();
  }, [id]);
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const commentData = {
        postId: id,
        userId: "1", // Current user ID
        content: newComment.trim()
      };
      
      const createdComment = await commentService.create(commentData);
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
      
      // Update post comment count
      const updatedPost = await postService.update(id, {
        comments: post.comments + 1
      });
      setPost(updatedPost);
      
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <SkeletonLoader count={1} type="post" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <EmptyState
          title="Post not found"
          description="The post you're looking for doesn't exist or has been deleted"
          actionLabel="Go Home"
          onAction={() => navigate('/')}
          icon="FileX"
        />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-2xl mx-auto"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon="ArrowLeft"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      
      {/* Post */}
      <div className="mb-8">
        <PostCard post={post} showActions={true} />
      </div>
      
      {/* Comment Form */}
      <div className="mb-8">
        <form onSubmit={handleSubmitComment} className="bg-surface/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex gap-3">
            <Avatar 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              alt="Your Avatar"
              size="sm"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                rows="3"
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  loading={isSubmitting}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Comments Section */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-white mb-4">
          Comments ({comments.length})
        </h3>
        
        {commentsLoading ? (
          <SkeletonLoader count={3} type="comment" />
        ) : comments.length === 0 ? (
          <EmptyState
            title="No comments yet"
            description="Be the first to share your thoughts!"
            icon="MessageCircle"
          />
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.Id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostDetail;