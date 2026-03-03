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
    description: 'High-quality rice varieties sourced directly from farmers across India, including premium Basmati and non-Basmati options.',
    specifications: [
      { key: 'Origin', value: 'India' },
      { key: 'Available Forms', value: 'Raw, Parboiled, Brown' },
      { key: 'Packaging', value: '1kg, 5kg, 25kg, 50kg' },
      { key: 'Moisture', value: 'Max 14%' },
    ],
    price: BigInt(120),
    nutritionData: { calories: 365, protein: 7.1, carbohydrates: 79.5, fat: 0.6, fiber: 2.4, iron: 0.8, zinc: 1.2, vitamins: 'B1, B3', minerals: 'Phosphorus, Magnesium' },
    imageUrl: '/assets/generated/rice-detail.dim_800x600.png',
    variants: [
      { name: 'Basmati Rice', imageUrl: '/assets/generated/rice-basmati.dim_400x400.png' },
      { name: 'Sona Masoori', imageUrl: '/assets/generated/rice-sona-masoori.dim_400x400.png' },
      { name: 'IR-64 Parboiled Rice', imageUrl: '/assets/generated/rice-ir64.dim_400x400.png' },
      { name: 'Brown Rice', imageUrl: '/assets/generated/rice-brown.dim_400x400.png' },
      { name: 'Broken Rice', imageUrl: '/assets/generated/rice-broken.dim_400x400.png' },
    ],
  },
  {
    productName: 'Wheat',
    category: 'wheat',
    description: 'Premium quality wheat grains for various culinary and industrial uses, sourced from the best wheat-growing regions of India.',
    specifications: [
      { key: 'Origin', value: 'Punjab, Haryana, MP' },
      { key: 'Available Forms', value: 'Whole, Semolina, Flour' },
      { key: 'Packaging', value: '2kg, 10kg, 50kg' },
      { key: 'Protein Content', value: '11–14%' },
    ],
    price: BigInt(200),
    nutritionData: { calories: 340, protein: 13.2, carbohydrates: 71.2, fat: 2.5, fiber: 12.2, iron: 3.6, zinc: 2.7, vitamins: 'B Vitamins, E', minerals: 'Magnesium, Phosphorus' },
    imageUrl: '/assets/generated/wheat-detail.dim_800x600.png',
    variants: [
      { name: 'Durum Wheat', imageUrl: '/assets/generated/wheat-durum.dim_400x400.png' },
      { name: 'Whole Wheat', imageUrl: '/assets/generated/wheat-whole.dim_400x400.png' },
      { name: 'Semolina', imageUrl: '/assets/generated/wheat-semolina.dim_400x400.png' },
    ],
  },
  {
    productName: 'Pulses',
    category: 'pulses',
    description: 'Nutritious and protein-rich pulses from Indian farms, available in a wide range of varieties for domestic and export markets.',
    specifications: [
      { key: 'Origin', value: 'Madhya Pradesh, Rajasthan' },
      { key: 'Available Forms', value: 'Whole, Split, Dehusked' },
      { key: 'Packaging', value: '500g, 1kg, 25kg, 50kg' },
      { key: 'Protein Content', value: '20–25%' },
    ],
    price: BigInt(150),
    nutritionData: { calories: 350, protein: 23.5, carbohydrates: 60.2, fat: 1.7, fiber: 16.5, iron: 8.5, zinc: 3.2, vitamins: 'Folate, B1', minerals: 'Potassium, Iron' },
    imageUrl: '/assets/generated/pulses-detail.dim_800x600.png',
    variants: [
      { name: 'Chana Dal', imageUrl: '/assets/generated/pulses-chana-dal.dim_400x400.png' },
      { name: 'Moong Dal', imageUrl: '/assets/generated/pulses-moong-dal.dim_400x400.png' },
      { name: 'Masoor Dal', imageUrl: '/assets/generated/pulses-masoor-dal.dim_400x400.png' },
      { name: 'Urad Dal', imageUrl: '/assets/generated/pulses-urad-dal.dim_400x400.png' },
      { name: 'Toor Dal', imageUrl: '/assets/generated/pulses-toor-dal.dim_400x400.png' },
      { name: 'Rajma', imageUrl: '/assets/generated/pulses-rajma.dim_400x400.png' },
      { name: 'Kabuli Chana', imageUrl: '/assets/generated/pulses-kabuli-chana.dim_400x400.png' },
    ],
  },
  {
    productName: 'Spices',
    category: 'spices',
    description: 'Aromatic and flavorful spices from premium Indian farms, processed to retain natural oils and freshness.',
    specifications: [
      { key: 'Origin', value: 'Kerala, Rajasthan, Gujarat' },
      { key: 'Available Forms', value: 'Whole, Powder, Blended' },
      { key: 'Packaging', value: '100g, 250g, 500g, 1kg' },
      { key: 'Shelf Life', value: '12–24 months' },
    ],
    price: BigInt(180),
    nutritionData: { calories: 260, protein: 12.4, carbohydrates: 60.8, fat: 4.2, fiber: 30.2, iron: 19.2, zinc: 4.1, vitamins: 'A, C, B6', minerals: 'Calcium, Iron, Manganese' },
    imageUrl: '/assets/generated/spices-detail.dim_800x600.png',
    variants: [
      { name: 'Turmeric', imageUrl: '/assets/generated/spices-turmeric.dim_400x400.png' },
      { name: 'Red Chilli', imageUrl: '/assets/generated/spices-red-chilli.dim_400x400.png' },
      { name: 'Coriander', imageUrl: '/assets/generated/spices-coriander.dim_400x400.png' },
      { name: 'Cumin', imageUrl: '/assets/generated/spices-cumin.dim_400x400.png' },
      { name: 'Black Pepper', imageUrl: '/assets/generated/spices-black-pepper.dim_400x400.png' },
      { name: 'Cardamom', imageUrl: '/assets/generated/spices-cardamom.dim_400x400.png' },
      { name: 'Ginger Powder', imageUrl: '/assets/generated/spices-ginger-powder.dim_400x400.png' },
      { name: 'Fenugreek', imageUrl: '/assets/generated/spices-fenugreek.dim_400x400.png' },
    ],
  },
  {
    productName: 'Processed Food Products',
    category: 'processed-food-products',
    description: 'Convenient and high-quality processed food products including flours, flakes, and ready-to-cook items from premium agricultural produce.',
    specifications: [
      { key: 'Type', value: 'Value-Added Products' },
      { key: 'Packaging', value: '500g, 1kg, 5kg, 25kg' },
      { key: 'Shelf Life', value: '6–12 months' },
      { key: 'Processing', value: 'Hygienic, FSSAI Certified' },
    ],
    price: BigInt(300),
    nutritionData: { calories: 380, protein: 10.5, carbohydrates: 75.2, fat: 3.8, fiber: 5.4, iron: 4.2, zinc: 2.1, vitamins: 'B1, B2, B3', minerals: 'Calcium, Phosphorus' },
    imageUrl: '/assets/generated/processed-detail.dim_800x600.png',
    variants: [
      { name: 'Rice Flour', imageUrl: '/assets/generated/processed-rice-flour.dim_400x400.png' },
      { name: 'Wheat Flour (Atta)', imageUrl: '/assets/generated/processed-wheat-flour.dim_400x400.png' },
      { name: 'Besan (Gram Flour)', imageUrl: '/assets/generated/processed-besan.dim_400x400.png' },
      { name: 'Poha (Flattened Rice)', imageUrl: '/assets/generated/processed-poha.dim_400x400.png' },
      { name: 'Roasted Chana', imageUrl: '/assets/generated/processed-roasted-chana.dim_400x400.png' },
      { name: 'Vermicelli', imageUrl: '/assets/generated/processed-vermicelli.dim_400x400.png' },
    ],
  },
  {
    productName: 'Makhana (Fox Nuts)',
    category: 'makhana',
    description: 'Premium quality Fox Nuts (Makhana) sourced from Bihar — a superfood rich in protein, calcium, and antioxidants.',
    specifications: [
      { key: 'Origin', value: 'Bihar, India' },
      { key: 'Available Forms', value: 'Raw, Roasted, Powder' },
      { key: 'Packaging', value: '100g, 200g, 500g, 1kg' },
      { key: 'Shelf Life', value: '6–12 months' },
    ],
    price: BigInt(250),
    nutritionData: { calories: 350, protein: 9.7, carbohydrates: 77.2, fat: 0.5, fiber: 7.6, iron: 1.4, zinc: 0.7, vitamins: 'B1, B2, B3', minerals: 'Iron, Potassium, Calcium' },
    imageUrl: '/assets/generated/makhana-detail.dim_800x600.png',
    variants: [
      { name: 'Fox Nut Regular', imageUrl: '/assets/generated/makhana-regular.dim_400x400.png' },
      { name: 'Fox Nut Premium', imageUrl: '/assets/generated/makhana-premium.dim_400x400.png' },
      { name: 'Roasted Makhana', imageUrl: '/assets/generated/makhana-roasted.dim_400x400.png' },
      { name: 'Makhana Powder', imageUrl: '/assets/generated/makhana-powder.dim_400x400.png' },
    ],
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
                Seed all 6 product categories into the backend with full sub-category variants. Use this if products are not showing up on the Products page.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {PRODUCT_CATALOG.map((p) => (
                  <div key={p.category} className="bg-muted/40 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-foreground mb-1">{p.productName}</p>
                    <p className="text-muted-foreground text-xs mb-2">{p.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.variants.map((v) => (
                        <span key={v.name} className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                          {v.name}
                        </span>
                      ))}
                    </div>
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
