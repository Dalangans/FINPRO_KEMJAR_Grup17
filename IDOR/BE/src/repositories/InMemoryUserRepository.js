class InMemoryUserRepository {
  constructor() {
    this.users = new Map();
    this.idCounter = 1;
  }

  async create(username, email, passwordHash) {
    try {
      // Check duplicate
      if (this.userExists(email, username)) {
        throw {
          statusCode: 409,
          message: `Email atau username sudah terdaftar`
        };
      }

      const userId = `user_${this.idCounter++}`;
      const user = {
        _id: userId,
        userId,
        username,
        email: email.toLowerCase(),
        passwordHash,
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.users.set(email.toLowerCase(), user);
      return this.toJSON(user);
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email) {
    return this.users.get(email.toLowerCase()) || null;
  }

  async findByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findById(userId) {
    for (const user of this.users.values()) {
      if (user.userId === userId || user._id === userId) {
        return user;
      }
    }
    return null;
  }

  async emailExists(email) {
    return this.users.has(email.toLowerCase());
  }

  async usernameExists(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return true;
      }
    }
    return false;
  }

  async getAll() {
    const users = Array.from(this.users.values());
    return users.map(u => this.toJSON(u));
  }

  userExists(email, username) {
    const emailExists = this.users.has(email.toLowerCase());
    const usernameExists = Array.from(this.users.values()).some(u => u.username === username);
    return emailExists || usernameExists;
  }

  toJSON(user) {
    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = InMemoryUserRepository;
