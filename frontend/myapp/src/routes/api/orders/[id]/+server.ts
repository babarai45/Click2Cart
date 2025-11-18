import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const orderId = params.id;
    const { status } = await request.json();

    if (!orderId || !status) {
      return json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return json({ error: 'Invalid status' }, { status: 400 });
    }

    statements.updateOrderStatus.run(status, parseInt(orderId));

    const order = statements.getOrderById.get(parseInt(orderId)) as any;
    const orderItems = statements.getOrderItems.all(parseInt(orderId));

    return json({ ...order, items: orderItems });

  } catch (error) {
    console.error('Update order error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};