const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const localPath = process.env.FOLDER_PATH || '/tmp/files_manager/';

exports.postUpload = async function postUpload(req, res) {
  const token = req.headers['x-token'];
  const val = await redisClient.get(`auth_${token}`);

  if (val == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = JSON.parse(val);

  const {
    name, type, parentId, isPublic, data,
  } = { parentId: '0', isPublic: false, ...req.body };

  if (name == null) {
    return res.status(400).json({ error: 'Missing name' });
  }

  if (type == null || !['folder', 'file', 'image'].includes(type)) {
    return res.status(400).json({ error: 'Missing type' });
  }

  if (data == null && type !== 'folder') {
    return res.status(400).json({ error: 'Missing data' });
  }

  if (parentId !== '0') {
    const folder = await dbClient.getFile({ parentId });
    if (folder == null) {
      return res.status(400).json({ error: 'Parent not found' });
    }
    if (folder.type !== 'folder') {
      return res.status(400).json({ error: 'Parent is not a folder' });
    }
  }

  const file = await dbClient.createFile({
    userId: user._id, name, type, isPublic, parentId, localPath, data,
  });

  file.parentId = file.parentId === '0' ? 0 : file.parentId;
  return res.status(201).json(file);
};
