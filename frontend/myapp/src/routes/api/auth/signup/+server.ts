import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { statements } from '$lib/database';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = statements.getUserByEmail.get(email);
    if (existingUser) {
      return json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = statements.createUser.run(email, hashedPassword, name);

    // Get the created user
    const user = statements.getUserById.get(result.lastInsertRowid) as any;

    return json({ user: { ...user, isAdmin: !!user.is_admin } }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};