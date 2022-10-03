// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import Cors from 'cors'
// const cors = Cors({
//   methods: ['POST', 'GET', 'HEAD'],
// })


// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result)
//       }
//       return resolve(result)
//     })
//   })
// }

// export default async function handler(req, res) {
//   //req.method === 'POST'
//   await runMiddleware(req, res, cors)
//   res.status(200).json({ name: "John Doe", query: req.query });
// }
