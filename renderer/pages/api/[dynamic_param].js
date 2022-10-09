export default function handler(req, res) {
  const { dynamic_param } = req.query;
  res.status(200).json({ post: dynamic_param, query: req.query, body: req.body });
}
