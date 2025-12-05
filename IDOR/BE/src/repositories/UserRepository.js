class UserRepository {
  constructor() {
    this.users = new Map();
    this.emailIndex = new Map();
    this.counter = 0;
  }

  async create(username, email, passwordHash) {
    if (this.emailIndex.has(email.toLowerCase())) {
      throw {
        statusCode: 409,
        message: 'Email already registered'
      };
    }

    const userId = ++this.counter;
    const user = {
      userId,
      username,
      email,
      passwordHash,
      createdAt: new Date()
    };

    this.users.set(userId, user);
    this.emailIndex.set(email.toLowerCase(), userId);

    return user;
  }

  async findByEmail(email) {
    const userId = this.emailIndex.get(email.toLowerCase());
    return userId ? this.users.get(userId) : null;
  }

  async findById(userId) {
    return this.users.get(userId) || null;
  }

  async getAll() {
    return Array.from(this.users.values());
  }
}

module.exports = UserRepository;
