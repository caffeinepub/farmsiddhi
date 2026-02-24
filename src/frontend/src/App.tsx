import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import FarmerNetwork from './pages/FarmerNetwork';
import Exports from './pages/Exports';
import ContactUs from './pages/ContactUs';
import Admin from './pages/Admin';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

// Layout component with Navigation and Footer
function Layout() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutUs,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: Products,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetail,
});

const farmerNetworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/farmer-network',
  component: FarmerNetwork,
});

const exportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exports',
  component: Exports,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUs,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  productsRoute,
  productDetailRoute,
  farmerNetworkRoute,
  exportsRoute,
  contactRoute,
  adminRoute,
]);

// Create router
const router = createRouter({ routeTree });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <div className="relative min-h-screen">
          {/* Fixed watermark background */}
          <div className="watermark-container" />
          
          {/* Main content */}
          <div className="relative z-10">
            <RouterProvider router={router} />
          </div>
          
          {/* Toast notifications */}
          <Toaster />
        </div>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
