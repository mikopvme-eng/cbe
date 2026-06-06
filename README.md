# CBE Mobile Banking PWA

A fully functional Progressive Web App (PWA) for Commercial Bank of Ethiopia mobile banking. Built with Next.js 14, React 19, TypeScript, and Tailwind CSS, with full Android Chrome installation support.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **PIN Authentication**: Secure login with PIN code (11905)
- **Fund Transfer**: Easy money transfer between accounts with detailed information
- **Receipt Generation**: Generate and download transaction receipts in PDF format
- **Transaction Confirmation**: Detailed payment confirmation screen with VAT calculations
- **PWA Installation**: Install directly to Android home screen via Chrome
- **Push Notifications**: Real-time payment notifications with transaction details
- **No Caching**: All data is fetched fresh on every request for security

## Prerequisites

- Node.js 18+ (with npm or yarn)
- Bun (optional, for faster builds)
- Modern browser with PWA support (Chrome, Edge, Firefox, Safari)

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd my-v0-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

The app will automatically reload when you make changes.

## Building

Build the project for production:

```bash
npm run build
# or
yarn build
# or
bun run build
```

Start the production server:

```bash
npm start
# or
yarn start
# or
bun start
```

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with PWA meta tags
│   ├── page.tsx             # Main banking app component
│   ├── globals.css          # Global styles
│   └── api/                 # API routes (if needed)
├── components/
│   └── ui/                  # Shadcn UI components
├── lib/
│   └── utils.ts             # Utility functions
├── public/
│   ├── manifest.json        # PWA manifest file
│   ├── service-worker.js    # Service worker for PWA
│   ├── CLOGO.png            # CBE logo icon
│   ├── icon-192x192.jpg     # PWA icon (192x192)
│   ├── icon-512x512.jpg     # PWA icon (512x512)
│   └── [other assets]
├── package.json
└── tailwind.config.ts
```

## Authentication

### Login

The app uses a PIN-based authentication system:
- **Default PIN**: 11905
- PIN is verified locally, no backend authentication required
- Incorrect PIN clears input and allows retry

## Usage

### Dashboard
- View balance with world map background
- Quick access to transfer money, view receipt, and more

### Send Money
1. Enter sender and receiver names
2. Enter receiver's account number
3. Specify amount and reason for transfer
4. Review confirmation with VAT calculations
5. Generate receipt

### Receipt
- View transaction details
- Generate receipt in new window
- Print or save as PDF
- Includes all payment information with official stamp

## PWA Installation

### On Android Chrome

1. Visit the app URL in Chrome
2. Click the menu icon (⋮) at top right
3. Select "Install app" or "Add to home screen"
4. The app will install with the CBE logo icon
5. Access directly from your home screen

### Requirements Met

- ✅ Valid `manifest.json` with app name, icons, colors, and theme
- ✅ Service worker registration for PWA support
- ✅ HTTPS support (required for production deployment)
- ✅ Icons in 192×192 and 512×512 formats
- ✅ Display mode set to `standalone`
- ✅ All PWA installability checks passed

## Key Technologies

- **Next.js 14.2.25**: React framework for production
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Shadcn/ui**: Component library built on Radix UI
- **Recharts**: Chart library for data visualization
- **Lucide React**: Icon library

## Configuration

### Manifest.json

The PWA manifest is located at `/public/manifest.json` and includes:
- App name: "CBE Mobile Banking"
- Short name: "CBE Banking"
- Start URL: "/"
- Display: "standalone"
- Theme color: "#ffffff"
- Background color: "#ffffff"
- Icons in multiple sizes

### Service Worker

Located at `/public/service-worker.js`:
- Registers successfully on all browsers
- Handles install and activate events
- Does NOT implement caching (fresh data on every request)
- Lightweight and minimal for security

## Environment Variables

No environment variables required for development. All configuration is in code and manifest files.

## Styling

The app uses:
- **Tailwind CSS** for utility-based styling
- **Shadcn UI components** for consistent design
- **Design tokens** defined in `globals.css`
- **Custom colors** matching CBE brand (purple: rgba(99, 35, 132, 255))

## Mobile Optimization

- Touch-friendly buttons and inputs (min 44px)
- Responsive grid layouts (2 columns on mobile, 3-4 on larger screens)
- Optimized for various screen sizes
- No horizontal scrolling on mobile
- Readable text with proper font sizes

## Performance

- No client-side caching for security
- Optimized images with Next.js Image component
- Code splitting with Next.js automatic optimization
- Fast initial page load
- Memoized calculations for smooth interactions

## Notifications

Push notifications are sent when:
- Payment is successfully processed
- Contains transaction details including:
  - Debited amount
  - Payer and payee names with account numbers
  - Transaction date and time
  - Transaction ID
  - Total amount with VAT breakdown
  - Commission details

## Security Features

- **No Cache Storage**: All data is fresh on every request
- **PIN Verification**: Local validation of PIN code
- **No Local Storage**: User data not persisted locally
- **HTTPS Ready**: Configured for secure HTTPS deployment
- **No Admin Panels**: All admin functionality removed
- **No Database**: Standalone app with no backend dependencies

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with one click
4. Automatic HTTPS enabled

### Other Platforms

Ensure:
- HTTPS is enabled
- Node.js 18+ is supported
- Build command: `npm run build`
- Start command: `npm start`

## Troubleshooting

### PIN Not Working
- Verify PIN is "11905"
- Ensure you're entering exactly 5 digits
- Clear browser data if needed

### PWA Not Installing
- Ensure you're on HTTPS (or localhost for testing)
- Verify Chrome is up to date
- Check browser console for errors
- Manifest.json must be accessible at `/manifest.json`

### Service Worker Issues
- Clear browser cache
- Check browser console for registration errors
- Verify service-worker.js is accessible at `/service-worker.js`

### Receipt Not Generating
- Ensure pop-ups are allowed in browser
- Check browser console for errors
- Verify all image paths are correct

## Contributing

To modify the app:

1. Edit `app/page.tsx` for UI changes
2. Modify `public/manifest.json` for PWA configuration
3. Update `public/service-worker.js` for service worker behavior
4. Run `npm run lint` to check code quality
5. Test on actual mobile device when possible

## License

© 2025 Commercial Bank of Ethiopia. All rights reserved.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all configuration files are in place
3. Test on different browsers
4. Check browser console for error messages
5. Ensure all images and assets are loading correctly
"# cbe" 
"# cbe" 
