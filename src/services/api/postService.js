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
  }
};

export default postService;