import axios from 'axios';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { directusBaseUrl, directusToken },
} = getConfig();

export async function updateSegment(options: any, itemData: any) {
  const instance = axios.create({
    baseURL: directusBaseUrl,
    headers: { Authorization: `Bearer ${directusToken}` },
  });
  const { collection, key } = options;
  const url = `/items/${collection}/${key}`;
  const { 
    name, activity_type, distance, average_grade, maximum_grade, elevation_high, elevation_low,
    climb_category, city, state, country, created_at, updated_at, 
    total_elevation_gain, effort_count, athlete_count, geojson 
  } = itemData;

  const data = {
    name,
    activity_type,
    distance,
    average_grade,
    maximum_grade,
    elevation_high,
    elevation_low,
    climb_category,
    city,
    state,
    country,
    created_at,
    updated_at,
    total_elevation_gain, effort_count, athlete_count,
    geojson,
  }
  const res = await instance.patch(url, data);
  if (res.status !== 200) {
    return {};
  }
  return res.data;
}

export async function getItem(url: string) {
  const instance = axios.create({
    baseURL: directusBaseUrl,
    headers: { Authorization: `Bearer ${directusToken}` },
  });
  const res = await instance.get(url);
  if (res.status !== 200) {
    return {};
  }
  return res.data;
}

export async function createItem(url: string, data: any) {
  const instance = axios.create({
    baseURL: directusBaseUrl,
    headers: { 
      Authorization: `Bearer ${directusToken}`,
      "Content-Type": "application/json",
    },
  });

  const res = await instance.post(url, data);
  if (res.status !== 200) {
    return {};
  }
  return res.data;
}

export async function updateItem(url: string, data: any) {
  const instance = axios.create({
    baseURL: directusBaseUrl,
    headers: { 
      Authorization: `Bearer ${directusToken}`,
      "Content-Type": "application/json",
    },
  });

  const res = await instance.patch(url, data);
  if (res.status !== 200) {
    return {};
  }
  return res.data;
}
