# Order Now Button Backup

This file contains backup code for all "Order Now" buttons that previously redirected to `/order` route.

## Hero.js - Main Hero Section Button
```jsx
<Link 
  to="/order" 
  className="w-full md:w-auto inline-block bg-pink-500 border-2 border-transparent text-white font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:bg-pink-600 transform hover:-translate-y-1 transition-all duration-300 text-center"
>
  Order Now
</Link>
```

## Header.js - Navigation Order Button
```jsx
<Link 
  to="/order"
  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition duration-300 font-medium"
>
  Order Now
</Link>
```

## CardLayoutView.js - Order Button (Desktop & Mobile)
```jsx
<Link 
  to="/order"
  className="w-full inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
>
  Order Now
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
</Link>
```

## ProductTabs.js - Order Button
```jsx
<Link
  to="/order"
  className="inline-block bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-300"
>
  Order Now
</Link>
```

## PricingCardLayout.js - Order Button
```jsx
<Link
  to="/order"
  className="inline-block bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-300"
>
  Order Now
</Link>
```

## Order Route Configuration
The `/order` route is configured in `App.js`:
```jsx
<Route path="/order" element={<Order />} />
```

## Notes
- All buttons previously redirected to `/order` route
- The Order.js component provides a full order form with multiple steps
- This functionality remains intact for future use
- Updated buttons now redirect to Facebook page: https://www.facebook.com/arprintservices/
- You can restore any of these buttons by replacing the `<a>` tag with the corresponding `<Link>` component above 