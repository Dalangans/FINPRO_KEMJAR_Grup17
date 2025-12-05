class User {
  constructor(userId, username, email, passwordHash) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
  }

  toJSON() {
    const { passwordHash, ...user } = this;
    return user;
  }
}

module.exports = User;
