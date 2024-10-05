import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  // GET /status
  static async getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();

    console.log(redisStatus)

    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  // GET /stats
  static async getStats(req, res) {
    try {
      const nbUsers = await dbClient.nbUsers();
      const nbFiles = await dbClient.nbFiles();

      res.status(200).json({ users: nbUsers, files: nbFiles });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  }
}

export default AppController;
