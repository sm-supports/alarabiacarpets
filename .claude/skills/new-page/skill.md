# Add a New Page

## Step 1: Create the Page File

Create `src/pages/<PageName>.tsx` using PascalCase.

Follow this template (based on existing pages):

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PageName = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Page Title
            </h1>
            <p className="font-poppins max-w-2xl mx-auto">
              Page description text.
            </p>
          </div>
        </div>

        {/* Page Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content here */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PageName;
```

## Step 2: Register the Route

Open `src/App.tsx` and:

1. Add a lazy import at the top with the other page imports:
   ```tsx
   const PageName = lazy(() => import("./pages/PageName"));
   ```

2. Add the route ABOVE the catch-all `"*"` route (look for the comment):
   ```tsx
   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
   ```
   Insert:
   ```tsx
   <Route path="/page-name" element={<PageName />} />
   ```

Route paths use lowercase kebab-case.

## Step 3: Add Navigation Link (if applicable)

Open `src/components/Navbar.tsx` and add the link to the navigation items. The Navbar uses React Router `Link` components.

## Step 4: Verify

```bash
npx tsc --noEmit
npm run dev
```

Navigate to the new route and confirm:
- Page loads with Navbar and Footer
- Hero banner displays correctly
- Content renders on mobile and desktop
- Browser back/forward navigation works

## Rules

- All pages MUST use the `<Navbar />` + `<Footer />` wrapper pattern
- All pages MUST be lazy-loaded via `React.lazy()` in App.tsx
- The Suspense fallback (PageLoader) is already configured globally — do not add another
- Route paths use lowercase kebab-case

## Canonical Example

Read `src/pages/About.tsx` for the simplest page template.
