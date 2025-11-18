import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    const orders = statements.getOrdersByUserId.all(parseInt(userId));

    // Get order items for each order
    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: statements.getOrderItems.all(order.id)
    }));

    return json(ordersWithItems);
  } catch (error) {
    console.error('Get orders error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userId, items, total, shippingAddress, paymentMethod } = await request.json();

    if (!userId || !items || !total) {
      return json({ error: 'User ID, items, and total are required' }, { status: 400 });
    }

    // Create order
    const orderResult = statements.createOrder.run(
      userId,
      total,
      shippingAddress || '',
      paymentMethod || 'card'
    );

    const orderId = orderResult.lastInsertRowid;

    // Create order items
    for (const item of items) {
      statements.createOrderItem.run(
        orderId,
        item.product.id,
        item.quantity,
        item.product.price
      );
    }

    const order = statements.getOrderById.get(orderId) as any;
    const orderItems = statements.getOrderItems.all(orderId);

    return json({ ...order, items: orderItems }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};