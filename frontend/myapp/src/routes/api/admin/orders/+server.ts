import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async () => {
  try {
    const orders = statements.getAllOrders.all();

    // Get order items for each order
    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: statements.getOrderItems.all(order.id)
    }));

    return json(ordersWithItems);
  } catch (error) {
    console.error('Get admin orders error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};