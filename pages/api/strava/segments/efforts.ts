import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from 'next/config';
import { getItem, createItem } from "../../../../lib/directus";
import { getStravaData, getStravaToken } from "../../../../lib/strava";
import { getWeatherData } from "../../../../lib/weather";

const {
  publicRuntimeConfig: { directusFlowsTriggerWebhook },
} = getConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;
  switch (method) {
    case 'POST':
      const segment_id = body["segment_id"] || null;
      if (segment_id) {
        const token = await getStravaToken();
        const dataEndpoint = `segments/${segment_id}`;
        const itemData = await getStravaData(dataEndpoint, token);
        const { effort_count, name, city } = itemData;
        const weatherData = await getWeatherData(itemData);
        const effortData = {
          ...weatherData,
          segment_id,
          effort_count,
          name,
          city,
        }
        const url = `/items/strava_segments_efforts?filter={ "segment_id": { "_eq": "${segment_id}" }}&sort=-date_created&limit=1`
        const { data } = await getItem(url);
        if (data.length > 0) {
          const { effort_count: last_effort_count, date_created } = data[0];
          const last_date = Date.parse(date_created);
          const current_date = Date.now();
          effortData['effort_count_interval'] = effort_count - last_effort_count;
          effortData['interval'] = Math.floor((current_date - last_date) / 1000);
        }
        await createItem('/items/strava_segments_efforts', effortData);
      } else {
        const url = '/items/strava_segments?filter={ "status": { "_eq": "published" }}'
        const { data } = await getItem(url);
        await data.reduce(async (lastPromise: any, item: any) => {
          const { segment_id } = item;
          const accum: any = await lastPromise;
          const res = await axios({
            method: 'post',
            url: directusFlowsTriggerWebhook,
            data: {
              segment_id,
            },
          });
          return [...accum, {}];
        }, Promise.resolve([]));
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send('Ok');
    case 'OPTIONS':
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      return res.status(200).send('Ok');
    default:
      return res.status(500);
  }
}