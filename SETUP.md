# Backlog Store - Next.js Ecommerce

A modern, fully-featured ecommerce store built with Next.js 16, shadcn/ui, and TypeScript.

## 🎉 Features

- ✅ **shadcn/ui** - Beautiful, accessible UI components
- ✅ **Dark Mode** - Light/dark theme toggle with `next-themes`
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **TypeScript** - Type-safe development
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Modern Components** - Button, Card, Input, Badge, and more
- ✅ **Custom Hooks** - Reusable React hooks
- ✅ **Utility Functions** - Helper functions for formatting
- ✅ **Type Definitions** - Complete TypeScript types

## 📁 Project Structure

```
backlogstore/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with ThemeProvider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with shadcn theme
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── header.tsx        # Site header with navigation
│   ├── footer.tsx        # Site footer
│   ├── theme-provider.tsx # Theme provider wrapper
│   └── theme-toggle.tsx  # Dark mode toggle button
├── lib/                  # Utility functions
│   ├── utils.ts         # cn() helper and more
│   ├── constants.ts     # App constants
│   └── formatters.ts    # Formatting utilities
├── hooks/               # Custom React hooks
│   ├── use-is-mounted.ts
│   └── use-media-query.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Theme Customization

The color scheme can be customized in `app/globals.css`. The theme uses HSL color variables for easy customization:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

## 🧩 Adding shadcn/ui Components

To add more shadcn/ui components, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Theme:** next-themes
- **State Management:** React Hooks

## 📚 Key Files

- `tailwind.config.ts` - Tailwind configuration with shadcn theme
- `components.json` - shadcn/ui configuration
- `lib/utils.ts` - Utility functions including the `cn()` helper
- `app/layout.tsx` - Root layout with theme provider
- `components/theme-provider.tsx` - Next-themes wrapper

## 🎯 Next Steps

1. **Connect to Backend API** - Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. **Add More Components** - Install additional shadcn/ui components as needed
3. **Create Product Pages** - Build out product listing and detail pages
4. **Add Shopping Cart** - Implement cart functionality
5. **Payment Integration** - Set up Stripe or other payment provider
6. **Authentication** - Add user login/registration
7. **Database Integration** - Connect to your backend database

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 📝 License

MIT

---

Built with ❤️ using Next.js and shadcn/ui
