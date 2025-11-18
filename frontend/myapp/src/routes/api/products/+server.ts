import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async () => {
  try {
    const products = statements.getAllProducts.all();
    return json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, description, price, image, category, inStock, brand, features } = await request.json();

    if (!name || !price) {
      return json({ error: 'Name and price are required' }, { status: 400 });
    }

    const result = statements.createProduct.run(
      name,
      description || '',
      price,
      image || '',
      category || 'General',
      inStock || 0,
      brand || '',
      features || ''
    );

    const product = statements.getProductById.get(result.lastInsertRowid);
    return json(product, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};