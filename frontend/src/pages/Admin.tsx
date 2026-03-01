import React, { useState } from 'react';
import { useGetAllContactForms, useGetAllOrders, useUpdateOrderStatus, useAddProductDetail } from '../hooks/useQueries';
import { OrderStatus } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Package, CheckCircle } from 'lucide-react';

const ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
  OrderStatus.cancelled,
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'processing': return 'bg-purple-100 text-purple-800';
    case 'shipped': return 'bg-indigo-100 text-indigo-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getOrderStatusString(status: any): string {
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && status !== null) return Object.keys(status)[0];
  return 'pending';
}

const PRODUCT_CATALOG = [
  {
    productName: 'Rice',
    category: 'rice',
    description: 'High-quality basmati rice sourced directly from farmers.',
    specifications: [{ key: 'Type', value: 'Basmati' }, { key: 'Weight', value: '1kg' }],
    price: BigInt(120),
    nutritionData: { calories: 365, protein: 7.1, carbohydrates: 79.5, fat: 0.6, fiber: 2.4, iron: 0.8, zinc: 1.2, vitamins: 'B1, B3', minerals: 'Phosphorus' },
    imageUrl: '/assets/generated/rice-detail.dim_800x600.png',
    variants: [{ name: 'Long Grain', imageUrl: '/assets/generated/basmati-premium.dim_400x300.png' }, { name: 'Short Grain', imageUrl: '/assets/generated/basmati-regular.dim_400x300.png' }],
  },
  {
    productName: 'Wheat',
    category: 'wheat',
    description: 'Premium quality wheat grains for various culinary uses.',
    specifications: [{ key: 'Type', value: 'Hard Wheat' }, { key: 'Weight', value: '2kg' }],
    price: BigInt(200),
    nutritionData: { calories: 340, protein: 13.2, carbohydrates: 71.2, fat: 2.5, fiber: 12.2, iron: 3.6, zinc: 2.7, vitamins: 'B Vitamins', minerals: 'Magnesium' },
    imageUrl: '/assets/generated/wheat-detail.dim_800x600.png',
    variants: [{ name: 'Whole Grain', imageUrl: '/assets/generated/wheat-whole.dim_400x300.png' }, { name: 'Cracked Wheat', imageUrl: '/assets/generated/wheat-detail.dim_800x600.png' }],
  },
  {
    productName: 'Pulses',
    category: 'pulses',
    description: 'Nutritious and protein-rich pulses from Indian farms.',
    specifications: [{ key: 'Type', value: 'Mixed Variety' }, { key: 'Weight', value: '500g' }],
    price: BigInt(150),
    nutritionData: { calories: 350, protein: 23.5, carbohydrates: 60.2, fat: 1.7, fiber: 16.5, iron: 8.5, zinc: 3.2, vitamins: 'Folate', minerals: 'Potassium' },
    imageUrl: '/assets/generated/pulses-detail.dim_800x600.png',
    variants: [{ name: 'Red Lentils', imageUrl: '/assets/generated/moong-green.dim_400x300.png' }, { name: 'Chickpeas', imageUrl: '/assets/generated/moong-yellow.dim_400x300.png' }],
  },
  {
    productName: 'Spices',
    category: 'spices',
    description: 'Aromatic and flavorful spices from premium Indian farms.',
    specifications: [{ key: 'Type', value: 'Mixed Varieties' }, { key: 'Weight', value: '250g Pack' }],
    price: BigInt(180),
    nutritionData: { calories: 260, protein: 12.4, carbohydrates: 60.8, fat: 4.2, fiber: 30.2, iron: 19.2, zinc: 4.1, vitamins: 'A, C, B6', minerals: 'Calcium, Iron' },
    imageUrl: '/assets/generated/spices-detail.dim_800x600.png',
    variants: [{ name: 'Turmeric', imageUrl: '/assets/generated/turmeric-powder.dim_400x300.png' }, { name: 'Cumin', imageUrl: '/assets/generated/chili-powder.dim_400x300.png' }],
  },
  {
    productName: 'Processed Food Products',
    category: 'processed-food-products',
    description: 'Convenient and delicious processed food products.',
    specifications: [{ key: 'Type', value: 'Ready-to-Eat' }, { key: 'Weight', value: '500g Pack' }],
    price: BigInt(300),
    nutritionData: { calories: 420, protein: 12.8, carbohydrates: 70.5, fat: 10.2, fiber: 8.6, iron: 5.3, zinc: 2.8, vitamins: 'D, E, B12', minerals: 'Calcium, Magnesium' },
    imageUrl: '/assets/generated/processed-detail.dim_800x600.png',
    variants: [{ name: 'Pasta', imageUrl: '/assets/generated/processed-detail.dim_800x600.png' }, { name: 'Noodles', imageUrl: '/assets/generated/processed-foods.dim_400x300.png' }],
  },
  {
    productName: 'Makhana (Fox Nuts)',
    category: 'makhana',
    description: 'Nutritious and crunchy flavored makhana from Bihar.',
    specifications: [{ key: 'Type', value: 'Flavored' }, { key: 'Weight', value: '200g' }],
    price: BigInt(250),
    nutritionData: { calories: 350, protein: 9.7, carbohydrates: 77.2, fat: 0.5, fiber: 7.6, iron: 1.4, zinc: 0.7, vitamins: 'B1, B2, B3', minerals: 'Iron, Potassium' },
    imageUrl: '/assets/generated/makhana-detail.dim_800x600.png',
    variants: [{ name: 'Peri Peri', imageUrl: '/assets/generated/makhana-flavored.dim_400x300.png' }, { name: 'Cheese', imageUrl: '/assets/generated/makhana-roasted.dim_400x300.png' }],
  },
];

export default function Admin() {
  const { data: contactForms, isLoading: formsLoading, error: formsError } = useGetAllContactForms();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const addProduct = useAddProductDetail();

  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [seedMessage, setSeedMessage] = useState('');

  const handleStatusChange = (orderId: bigint, newStatus: string) => {
    const statusEnum = newStatus as OrderStatus;
    updateOrderStatus.mutate({ orderId, status: statusEnum });
  };

  const handleSeedProducts = async () => {
    setSeedingStatus('seeding');
    setSeedMessage('');
    try {
      for (const product of PRODUCT_CATALOG) {
        await addProduct.mutateAsync(product);
      }
      setSeedingStatus('done');
      setSeedMessage('All 6 product categories seeded successfully!');
    } catch (err: any) {
      setSeedingStatus('error');
      setSeedMessage(`Error seeding products: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage orders, contact submissions, and product catalog.</p>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="products">Product Catalog</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Orders</h2>
                <p className="text-sm text-muted-foreground">Manage and update order statuses.</p>
              </div>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : ordersError ? (
                <div className="p-6 text-destructive text-sm">
                  Failed to load orders. Make sure you are logged in as an admin.
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Order ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Buyer Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Total (₹)</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const statusStr = getOrderStatusString(order.status);
                        const createdDate = new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN');
                        return (
                          <tr key={order.orderId.toString()} className="border-t border-border hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs">#{order.orderId.toString()}</td>
                            <td className="px-4 py-3 font-medium">{order.buyerName}</td>
                            <td className="px-4 py-3 text-muted-foreground">{order.buyerEmail}</td>
                            <td className="px-4 py-3 text-muted-foreground">{order.buyerPhone}</td>
                            <td className="px-4 py-3 font-semibold">₹{Number(order.totalAmount)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(statusStr)}`}>
                                {statusStr}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{createdDate}</td>
                            <td className="px-4 py-3">
                              <select
                                value={statusStr}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Contact Submissions</h2>
                <p className="text-sm text-muted-foreground">View all contact form submissions.</p>
              </div>
              {formsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : formsError ? (
                <div className="p-6 text-destructive text-sm">
                  Failed to load contact forms. Make sure you are logged in as an admin.
                </div>
              ) : !contactForms || contactForms.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  <p>No contact submissions yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Phone Number</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Message</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">User Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactForms.map((form, index) => (
                        <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{form.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{form.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{form.phoneNumber}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{form.message}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{form.userType}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Product Catalog Tab */}
          <TabsContent value="products">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">Product Catalog</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Seed all 6 product categories into the backend. This is useful if products are not showing up on the Products page.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {PRODUCT_CATALOG.map((p) => (
                  <div key={p.category} className="bg-muted/40 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-foreground">{p.productName}</p>
                    <p className="text-muted-foreground text-xs">{p.category}</p>
                  </div>
                ))}
              </div>

              {seedingStatus === 'done' && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{seedMessage}</p>
                </div>
              )}
              {seedingStatus === 'error' && (
                <div className="text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4 text-sm">
                  {seedMessage}
                </div>
              )}

              <button
                onClick={handleSeedProducts}
                disabled={seedingStatus === 'seeding'}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {seedingStatus === 'seeding' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Seeding Products...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Seed Product Catalog
                  </>
                )}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
