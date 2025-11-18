import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { statements } from '$lib/database';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = statements.getUserByEmail.get(email) as any;

    if (!user) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return json({ user: { ...userData, isAdmin: !!userData.is_admin } });

  } catch (error) {
    console.error('Signin error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};