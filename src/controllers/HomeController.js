class HomeController {
  async healthCheck(req, res) {
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Service is running' });
  }
}

module.exports = HomeController;
