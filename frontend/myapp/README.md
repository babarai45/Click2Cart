# Click2Cart - Full E-commerce Application

A complete e-commerce application built with SvelteKit, TypeScript, and Tailwind CSS. Features include user authentication, product management, shopping cart, checkout, and admin panel.

## Features

### User Features

- User registration and login
- Browse products with categories
- Add products to shopping cart
- Checkout with order placement
- View order history
- Responsive design with Tailwind CSS

### Admin Features

- Admin dashboard with analytics
- Add new products
- Manage product inventory
- View and manage all orders
- Update order status (pending → shipped → delivered)

## Tech Stack

- **Frontend**: SvelteKit 2, Svelte 5, TypeScript
- **Styling**: Tailwind CSS with forms and typography plugins
- **Icons**: Lucide Svelte
- **State Management**: Svelte stores
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd frontend/myapp
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```text
src/
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── stores.ts         # Svelte stores for state management
│   ├── Nav.svelte        # Navigation component
│   └── assets/           # Static assets
├── routes/
│   ├── +layout.svelte    # Root layout
│   ├── +page.svelte      # Home page (product listing)
│   ├── signin/           # Sign in page
│   ├── signup/           # Sign up page
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout process
│   ├── orders/           # Order history
│   └── admin/            # Admin panel
│       ├── +page.svelte          # Admin dashboard
│       ├── add-product/          # Add product form
│       ├── products/             # Manage products
│       └── orders/               # Manage orders
```

## Demo Accounts

### Admin Account

- Email: `admin@example.com`
- Password: `admin`

### Regular User Account

- Email: `user@example.com`
- Password: `user`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking
- `npm run lint` - Linting

## Key Components

### Stores

- `user` - Current user state
- `products` - Product catalog
- `cart` - Shopping cart items
- `orders` - Order history

### Types

- `User` - User interface
- `Product` - Product interface
- `CartItem` - Cart item interface
- `Order` - Order interface

## Features in Detail

### Authentication

- Simple email/password authentication
- Session management with Svelte stores
- Protected admin routes

### Product Management

- CRUD operations for products
- Category-based organization
- Stock management

### Shopping Cart

- Add/remove items
- Quantity management
- Persistent cart state

### Order Management

- Order placement
- Status tracking
- Order history

### Admin Panel

- Dashboard with key metrics
- Product management interface
- Order management interface

## Styling

The application uses Tailwind CSS for styling with:

- Responsive design
- Modern UI components
- Consistent color scheme
- Hover and focus states

## Future Enhancements

- Real backend API integration
- Payment gateway integration
- User profile management
- Product reviews and ratings
- Advanced search and filtering
- Email notifications
- Inventory alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
