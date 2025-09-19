import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  credentials: true,
}));

// Logger middleware
app.use('*', logger(console.log));

// Create Supabase client for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// User signup endpoint
app.post('/make-server-db77e5b0/signup', async (c: any) => {
  try {
    const { email, password, name, studentId } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, studentId },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      studentId,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user data
app.get('/make-server-db77e5b0/user/:id', async (c: any) => {
  try {
    const userId = c.req.param('id');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${userId}`);
    return c.json({ user: userData });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save travel destination votes
app.post('/make-server-db77e5b0/votes', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { pollId, destination, vote } = await c.req.json();
    
    const voteKey = `vote:${pollId}:${user.id}`;
    const pollKey = `poll:${pollId}`;
    
    // Save user's vote
    await kv.set(voteKey, {
      userId: user.id,
      destination,
      vote,
      timestamp: new Date().toISOString()
    });

    // Update poll totals
    const pollData = await kv.get(pollKey) || { destinations: {}, totalVotes: 0 };
    if (!pollData.destinations[destination]) {
      pollData.destinations[destination] = 0;
    }
    pollData.destinations[destination] += vote;
    pollData.totalVotes += vote;
    
    await kv.set(pollKey, pollData);

    return c.json({ success: true });
  } catch (error) {
    console.log('Vote error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get poll results
app.get('/make-server-db77e5b0/polls/:pollId', async (c: any) => {
  try {
    const pollId = c.req.param('pollId');
    const pollData = await kv.get(`poll:${pollId}`) || { destinations: {}, totalVotes: 0 };
    
    return c.json({ poll: pollData });
  } catch (error) {
    console.log('Get poll error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save booking data
app.post('/make-server-db77e5b0/bookings', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = crypto.randomUUID();
    
    await kv.set(`booking:${bookingId}`, {
      id: bookingId,
      userId: user.id,
      ...bookingData,
      createdAt: new Date().toISOString()
    });

    return c.json({ bookingId, success: true });
  } catch (error) {
    console.log('Booking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user bookings
app.get('/make-server-db77e5b0/bookings', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookings = await kv.getByPrefix(`booking:`);
    const userBookings = bookings.filter((booking: any) => booking.userId === user.id);
    
    return c.json({ bookings: userBookings });
  } catch (error) {
    console.log('Get bookings error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save feedback
app.post('/make-server-db77e5b0/feedback', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const feedbackData = await c.req.json();
    const feedbackId = crypto.randomUUID();
    
    await kv.set(`feedback:${feedbackId}`, {
      id: feedbackId,
      userId: user.id,
      ...feedbackData,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Feedback error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save itinerary
app.post('/make-server-db77e5b0/itinerary', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const itineraryData = await c.req.json();
    
    await kv.set(`itinerary:${user.id}`, {
      userId: user.id,
      ...itineraryData,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Itinerary error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user itinerary
app.get('/make-server-db77e5b0/itinerary', async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const itinerary = await kv.get(`itinerary:${user.id}`);
    return c.json({ itinerary });
  } catch (error) {
    console.log('Get itinerary error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-db77e5b0/health', (c: any) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// For Node.js, use a standard server
import { serve } from '@hono/node-server';
serve({ fetch: app.fetch, port: process.env.PORT ? Number(process.env.PORT) : 3000 });