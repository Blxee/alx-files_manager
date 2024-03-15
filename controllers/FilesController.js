const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const localPath = process.env.FOLDER_PATH || '/tmp/files_manager/';

exports.postUpload = async function postUpload(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const token = req.headers['x-token'];
  const val = await redisClient.get(`auth_${token}`);

  if (val == null) {
    res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
  }
  const user = JSON.parse(val);

  const {
    name, type, parentId, isPublic, data,
  } = { parentId: '0', isPublic: false, ...req.body };

  if (name == null) {
    return res.status(400).end(JSON.stringify({ error: 'Missing name' }));
  }

  if (type == null || !['folder', 'file', 'image'].includes(type)) {
    return res.status(400).end(JSON.stringify({ error: 'Missing type' }));
  }

  if (data == null && type !== 'folder') {
    return res.status(400).end(JSON.stringify({ error: 'Missing data' }));
  }

  if (parentId !== '0') {
    const folder = await dbClient.getFile({ parentId });
    if (folder == null) {
      return res.status(400).end(JSON.stringify({ error: 'Parent not found' }));
    }
    if (folder.type !== 'folder') {
      return res.status(400).end(JSON.stringify({ error: 'Parent is not a folder' }));
    }
  }

  const file = await dbClient.createFile({
    userId: user._id, name, type, isPublic, parentId, localPath, data,
  });

  return res.status(201).end(JSON.stringify(file));
};
