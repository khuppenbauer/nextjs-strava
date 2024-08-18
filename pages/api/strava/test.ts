import type { NextApiRequest, NextApiResponse } from "next";
import { getStravaToken } from "../../../lib/strava";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse | any
) {
  const { method, body: { data } } = req;
  switch (method) {
    case 'POST':
      const token = await getStravaToken();
      console.log(token);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send(token);
    case 'OPTIONS':
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send('Ok');
    default:
      return res.status(500);
  }
}