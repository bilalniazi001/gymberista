import { create as createJsonServer } from 'json-server';
import nextConnect from 'next-connect';

// Apni db.json file ka path
const DB_PATH = 'db.json'; 

// JSON Server ka instance banayein
const server = createJsonServer();

// JSON Server ko apni db.json file se load karein
const router = server.router(DB_PATH);

// Next-Connect handler setup karein
const handler = nextConnect();

// Router ko handler mein istemal karein
handler.use(router);

export default handler;