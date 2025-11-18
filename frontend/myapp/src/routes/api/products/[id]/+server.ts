import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const productId = parseInt(params.id!);
    const product = statements.getProductById.get(productId);

    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const productId = parseInt(params.id!);
    const { name, description, price, image, category, inStock, brand, features } = await request.json();

    if (!name || !price) {
      return json({ error: 'Name and price are required' }, { status: 400 });
    }

    const result = statements.updateProduct.run(
      name,
      description || '',
      price,
      image || '',
      category || 'General',
      inStock || 0,
      brand || '',
      features || '',
      productId
    );

    if (result.changes === 0) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    const product = statements.getProductById.get(productId);
    return json(product);

  } catch (error) {
    console.error('Update product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const productId = parseInt(params.id!);

    const result = statements.deleteProduct.run(productId);

    if (result.changes === 0) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};