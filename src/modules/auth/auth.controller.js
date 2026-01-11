const service = require("./auth.service");

exports.register = async (req,res) => {
  const data = await service.register(req.body);
  res.json(data);
};

exports.login = async (req,res) => {
  const data = await service.login(req.body);
  res.json(data);
};
