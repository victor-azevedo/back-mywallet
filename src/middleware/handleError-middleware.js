export default function handleErrorMiddleware() {
  return (err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send("Internal server error");
  };
}
