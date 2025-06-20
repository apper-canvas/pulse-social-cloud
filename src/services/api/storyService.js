import { toast } from 'react-toastify';
import storiesData from '@/services/mockData/stories.json';
import { userService } from '@/services/api/userService';

let stories = [...storiesData];
let nextId = Math.max(...stories.map(s => s.Id)) + 1;

// Clean up expired stories
const cleanupExpiredStories = () => {
  const now = new Date();
  const initialCount = stories.length;
  stories = stories.filter(story => new Date(story.expiresAt) > now);
  
  if (stories.length < initialCount) {
    console.log(`Cleaned up ${initialCount - stories.length} expired stories`);
  }
};

// Initialize cleanup
cleanupExpiredStories();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const storyService = {
  async getAll() {
    await delay(300);
    cleanupExpiredStories();
    
    // Get user data for each story
    const storiesWithUsers = await Promise.all(
      stories.map(async (story) => {
        const user = await userService.getById(story.userId);
        return {
          ...story,
          user
        };
      })
    );
    
    return storiesWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    cleanupExpiredStories();
    
    const story = stories.find(s => s.Id === parseInt(id));
    if (!story) return null;
    
    const user = await userService.getById(story.userId);
    return {
      ...story,
      user
    };
  },

  async getByUserId(userId) {
    await delay(250);
    cleanupExpiredStories();
    
    const userStories = stories.filter(s => s.userId === parseInt(userId));
    const storiesWithUsers = await Promise.all(
      userStories.map(async (story) => {
        const user = await userService.getById(story.userId);
        return {
          ...story,
          user
        };
      })
    );
    
    return storiesWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(storyData) {
    await delay(400);
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const newStory = {
      Id: nextId++,
      userId: storyData.userId,
      content: storyData.content || '',
      mediaUrl: storyData.mediaUrl || '',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      viewedBy: []
    };
    
    stories.unshift(newStory);
    
    const user = await userService.getById(newStory.userId);
    const storyWithUser = {
      ...newStory,
      user
    };
    
    toast.success('Story created successfully!');
    return storyWithUser;
  },

  async markAsViewed(storyId, viewerId) {
    await delay(150);
    
    const story = stories.find(s => s.Id === parseInt(storyId));
    if (!story) {
      throw new Error('Story not found');
    }
    
    if (!story.viewedBy.includes(parseInt(viewerId))) {
      story.viewedBy.push(parseInt(viewerId));
    }
    
    return { ...story };
  },

  async delete(id) {
    await delay(300);
    
    const index = stories.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    stories.splice(index, 1);
    toast.success('Story deleted successfully!');
    return true;
  },

  // Check if user has viewed a story
  hasViewed(story, viewerId) {
    return story.viewedBy.includes(parseInt(viewerId));
  },

  // Check if story belongs to user
  isOwner(story, userId) {
    return story.userId === parseInt(userId);
  },

  // Get time remaining for story
  getTimeRemaining(story) {
    const now = new Date();
    const expiresAt = new Date(story.expiresAt);
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
};

export default storyService;