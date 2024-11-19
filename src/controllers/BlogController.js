class BlogController {
  async index(req, res) {
    const items = await DB.collection('blogs').find({}).toArray();
    res.status(HTTP_STATUS_CODE.OK).json(items);
  }

  async store(req, res) {
    try {
        const { title, description } = req.body;

        const result = await DB.collection('blogs').insertOne({
        title,
        description,
        });

        if (result.acknowledged) {
            const newPost = await DB.collection('blogs').findOne({
                _id: result.insertedId,
            });
            res.status(HTTP_STATUS_CODE.CREATED).json(newPost);
        } else {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST)
                .json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: error.message });
    }
  }
}

module.exports = BlogController;
