import sha1 from 'sha1';
import dbClient from '../utils/db.js';

class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const usersCollection = dbClient.db.collection('users');

      // Check if user already exists
      const userExists = await usersCollection.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const sha1Password = sha1(password)

      // Create new user
      const newUser = {
        email,
        password: sha1Password,
      };

      const result = await usersCollection.insertOne(newUser);

      // Return the new user with the id and email only
      return res.status(201).json({
        id: result.insertedId,
        email: newUser.email,
      });
    } catch (error) {
      console.error(`Error creating new user: ${error}`);
      return res.status(500).json({ error: 'Error creating new user' });
    }
  }
}

export default UserController