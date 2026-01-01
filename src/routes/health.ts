import { Router } from 'express';


const route = Router();

route.get('/health', (_req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'OK', message: 'Hello from GraphQL Practice!' });
});

export default route;