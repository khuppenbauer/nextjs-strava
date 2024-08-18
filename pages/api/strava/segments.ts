import type { NextApiRequest, NextApiResponse } from "next";
import { getStravaData, getStravaToken, streamToGeoJson } from "../../../lib/strava";
import { updateSegment } from "../../../lib/directus";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse | any
) {
  const { method, body: { data } } = req;
  switch (method) {
    case 'POST':
      const { payload: { segment_id } } = data;
      const dataEndpoint = `segments/${segment_id}`;
      const streamEndpoint = `${dataEndpoint}/streams?key_by_type=true&resolution=low`;
      const token = await getStravaToken();
      const itemData = await getStravaData(dataEndpoint, token);
      const stream = await getStravaData(streamEndpoint, token);
      itemData['geojson'] = await streamToGeoJson(stream, data.name);
      await updateSegment(data, itemData);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send(itemData);
    case 'OPTIONS':
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send('Ok');
    default:
      return res.status(500);
  }
}