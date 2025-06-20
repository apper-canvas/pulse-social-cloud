import mockPosts from '@/services/mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let posts = [...mockPosts];

export const postService = {
  async getAll() {
    await delay(300);
    return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id, 10));
    if (!post) {
      throw new Error('Post not found');
    }
    return { ...post };
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      ...postData,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      hashtags: postData.content?.match(/#\w+/g) || []
    };
    posts.unshift(newPost);
    return { ...newPost };
  },

  async update(id, postData) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Post not found');
    }
    const updatedPost = {
      ...posts[index],
      ...postData,
      Id: posts[index].Id,
      hashtags: postData.content?.match(/#\w+/g) || posts[index].hashtags
    };
    posts[index] = updatedPost;
    return { ...updatedPost };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Post not found');
    }
    posts.splice(index, 1);
    return true;
  },

  async likePost(id) {
    await delay(200);
    const index = posts.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Post not found');
    }
    posts[index].likes += 1;
    return { ...posts[index] };
  },

  async getByUserId(userId) {
    await delay(300);
    return posts.filter(p => p.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async searchPosts(query) {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return posts.filter(p => 
      p.content.toLowerCase().includes(lowerQuery) ||
p.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
},

async getHashtagTrends() {
  await delay(300);
  
  // Extract all hashtags with their post data
  const hashtagData = {};
  posts.forEach(post => {
    post.hashtags.forEach(hashtag => {
      const tag = hashtag.toLowerCase();
      if (!hashtagData[tag]) {
        hashtagData[tag] = {
          name: hashtag,
          posts: [],
          totalCount: 0
        };
      }
      hashtagData[tag].posts.push({
        date: post.createdAt,
        count: 1
      });
      hashtagData[tag].totalCount++;
    });
  });

  // Generate sparkline data (7 days of activity)
  const trends = Object.values(hashtagData)
    .filter(tag => tag.totalCount >= 3) // Only show hashtags with at least 3 posts
    .map(tag => {
      // Create 7-day sparkline data
      const now = new Date();
      const sparklineData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayCount = tag.posts.filter(post => {
          const postDate = new Date(post.date);
          return postDate >= dayStart && postDate <= dayEnd;
        }).length;
        
        sparklineData.push(dayCount);
      }
      
      return {
        name: tag.name,
        totalCount: tag.totalCount,
        sparklineData,
        trend: sparklineData[sparklineData.length - 1] > sparklineData[0] ? 'up' : 'down'
      };
    })
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 5); // Top 5 trending hashtags

  return trends;
}
};

export default postService;