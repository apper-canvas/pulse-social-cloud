import mockUsers from '@/services/mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let users = [...mockUsers];

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id, 10));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async getByUsername(username) {
    await delay(200);
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData,
      followers: 0,
      following: 0
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...users[index],
      ...userData,
      Id: users[index].Id
    };
    users[index] = updatedUser;
    return { ...updatedUser };
  },

  async delete(id) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    users.splice(index, 1);
    return true;
  },

  async searchUsers(query) {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return users.filter(u => 
      u.username.toLowerCase().includes(lowerQuery) ||
      u.displayName.toLowerCase().includes(lowerQuery)
    );
  },

  async getCurrentUser() {
    await delay(200);
    // Return the first user as the current user for demo purposes
    return { ...users[0] };
  }
};

export default userService;