// // lib/middleware/authMiddleware.js
// import js
// const secret = process.env.NEXTAUTH_SECRET;

// export const authMiddleware = (handler) => async (req, res) => {
//   const token = await getToken({ req, secret });

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   req.user = token; // you can access user info in the handler
//   return handler(req, res);
// };
