import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const redirectToCheckout = async (items) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: 1, // Assuming 1 for now, can be adjusted if quantity is supported
          image: item.img,
        })),
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cart`,
      }),
    });

    const session = await response.json();
    
    if (session.url) {
      window.location.href = session.url;
    } else {
      console.error('Failed to create checkout session:', session);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
  }
};
