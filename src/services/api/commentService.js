import mockComments from '@/services/mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let comments = [...mockComments];

export const commentService = {
  async getAll() {
    await delay(300);
    return [...comments];
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find(c => c.Id === parseInt(id, 10));
    if (!comment) {
      throw new Error('Comment not found');
    }
    return { ...comment };
  },

  async getByPostId(postId) {
    await delay(300);
    return comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(commentData) {
    await delay(400);
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      ...commentData,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, commentData) {
    await delay(300);
    const index = comments.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Comment not found');
    }
    const updatedComment = {
      ...comments[index],
      ...commentData,
      Id: comments[index].Id
    };
    comments[index] = updatedComment;
    return { ...updatedComment };
  },

  async delete(id) {
    await delay(300);
    const index = comments.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Comment not found');
    }
    comments.splice(index, 1);
    return true;
  },

  async likeComment(id) {
    await delay(200);
    const index = comments.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Comment not found');
    }
    comments[index].likes += 1;
    return { ...comments[index] };
  }
};

export default commentService;