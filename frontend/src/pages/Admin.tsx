import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetAllContactForms,
  useGetAllOrders,
  useUpdateOrderStatus,
  useAddProductDetail,
} from '../hooks/useQueries';
import { OrderStatus } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, RefreshCw, ShieldAlert, Database } from 'lucide-react';

const ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
  OrderStatus.cancelled,
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [OrderStatus.confirmed]: 'bg-blue-100 text-blue-800 border-blue-200',
  [OrderStatus.processing]: 'bg-purple-100 text-purple-800 border-purple-200',
  [OrderStatus.shipped]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [OrderStatus.delivered]: 'bg-green-100 text-green-800 border-green-200',
  [OrderStatus.cancelled]: 'bg-red-100 text-red-800 border-red-200',
};

function formatDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}

// Full product catalog data for seeding
const PRODUCT_CATALOG = [
  {
    productName: 'Premium Rice Collection',
    category: 'rice',
    description:
      'Our premium rice collection offers the finest varieties sourced directly from top-producing regions. Each variety is carefully selected for its aroma, texture, and nutritional value.',
    specifications: [
      { key: 'Type', value: 'Grain' },
      { key: 'Processing', value: 'Double Polished' },
      { key: 'Moisture', value: '< 14%' },
      { key: 'Broken Grains', value: '< 2%' },
    ],
    price: BigInt(85),
    nutritionData: {
      calories: 130,
      protein: 2.7,
      carbohydrates: 28.2,
      fat: 0.3,
      fiber: 0.4,
      iron: 0.2,
      zinc: 0.5,
      vitamins: 'Thiamine (B1), Niacin (B3)',
      minerals: 'Iron, Zinc, Magnesium',
    },
    imageUrl: '/assets/generated/rice-detail.dim_800x600.png',
    variants: [
      { name: 'Basmati Rice', imageUrl: 'rice-basmati.png' },
      { name: 'Sona Masoori', imageUrl: 'rice-sona-masoori.png' },
      { name: 'IR64 Rice', imageUrl: 'rice-ir64.png' },
      { name: 'Brown Rice', imageUrl: 'rice-brown.png' },
      { name: 'Broken Rice', imageUrl: 'rice-broken.png' },
    ],
  },
  {
    productName: 'Premium Wheat Collection',
    category: 'wheat',
    description:
      'Our premium wheat collection features carefully selected varieties for superior baking and cooking. From hard durum wheat to soft whole wheat, each variety delivers exceptional quality.',
    specifications: [
      { key: 'Type', value: 'Wheat' },
      { key: 'Processing', value: 'Cleaned & Graded' },
      { key: 'Moisture', value: '< 12%' },
      { key: 'Protein Content', value: '10-14%' },
    ],
    price: BigInt(45),
    nutritionData: {
      calories: 340,
      protein: 13.2,
      carbohydrates: 72.0,
      fat: 2.5,
      fiber: 10.7,
      iron: 3.6,
      zinc: 2.8,
      vitamins: 'Vitamin B1, B2, B3, B6, Folate',
      minerals: 'Calcium, Magnesium, Potassium, Phosphorus',
    },
    imageUrl: '/assets/generated/wheat-detail.dim_800x600.png',
    variants: [
      { name: 'Durum Wheat', imageUrl: 'wheat-durum.png' },
      { name: 'Whole Wheat', imageUrl: 'wheat-whole.png' },
      { name: 'Semolina (Suji)', imageUrl: 'wheat-semolina.png' },
    ],
  },
  {
    productName: 'Premium Pulses Collection',
    category: 'pulses',
    description:
      'Explore our premium selection of high-quality dried pulses. Packed with essential nutrients and bursting with flavor, our pulses are meticulously sourced for the finest quality.',
    specifications: [
      { key: 'Type', value: 'Lentils, Beans, Peas, Chickpeas' },
      { key: 'Processing', value: 'Cleaned & Sorted' },
      { key: 'Moisture', value: '< 12%' },
      { key: 'Packaging', value: 'Food-grade bags' },
    ],
    price: BigInt(120),
    nutritionData: {
      calories: 116,
      protein: 9.0,
      carbohydrates: 20.1,
      fat: 0.4,
      fiber: 7.9,
      iron: 3.3,
      zinc: 1.3,
      vitamins: 'Folate, Vitamin B1, B6',
      minerals: 'Iron, Potassium, Magnesium, Phosphorus',
    },
    imageUrl: '/assets/generated/pulses-detail.dim_800x600.png',
    variants: [
      { name: 'Chana Dal', imageUrl: 'pulses-chana-dal.png' },
      { name: 'Moong Dal', imageUrl: 'pulses-moong-dal.png' },
      { name: 'Masoor Dal', imageUrl: 'pulses-masoor-dal.png' },
      { name: 'Urad Dal', imageUrl: 'pulses-urad-dal.png' },
      { name: 'Toor Dal', imageUrl: 'pulses-toor-dal.png' },
      { name: 'Rajma', imageUrl: 'pulses-rajma.png' },
      { name: 'Kabuli Chana', imageUrl: 'pulses-kabuli-chana.png' },
    ],
  },
  {
    productName: 'Aromatic Spices Collection',
    category: 'spices',
    description:
      'Elevate your culinary creations with our wide range of aromatic spices. Carefully sourced and expertly processed, our spice collection promises to enhance every dish with rich flavors.',
    specifications: [
      { key: 'Type', value: 'Herbs and Spices' },
      { key: 'Processing', value: 'Cleaned & Ground' },
      { key: 'Aroma', value: 'Aromatic' },
      { key: 'Packaging', value: 'Airtight bags' },
    ],
    price: BigInt(200),
    nutritionData: {
      calories: 354,
      protein: 12.7,
      carbohydrates: 65.0,
      fat: 4.4,
      fiber: 21.1,
      iron: 29.6,
      zinc: 4.7,
      vitamins: 'Vitamin C, Vitamin A, Vitamin K',
      minerals: 'Iron, Calcium, Manganese, Potassium',
    },
    imageUrl: '/assets/generated/spices-detail.dim_800x600.png',
    variants: [
      { name: 'Turmeric Powder', imageUrl: 'spices-turmeric.png' },
      { name: 'Red Chilli Powder', imageUrl: 'spices-red-chilli.png' },
      { name: 'Coriander Powder', imageUrl: 'spices-coriander.png' },
      { name: 'Cumin Seeds', imageUrl: 'spices-cumin.png' },
      { name: 'Black Pepper', imageUrl: 'spices-black-pepper.png' },
      { name: 'Cardamom', imageUrl: 'spices-cardamom.png' },
      { name: 'Ginger Powder', imageUrl: 'spices-ginger-powder.png' },
      { name: 'Fenugreek Seeds', imageUrl: 'spices-fenugreek.png' },
    ],
  },
  {
    productName: 'Processed Food Products',
    category: 'processed-food-products',
    description:
      'Explore our range of convenient packaged processed foods, meticulously crafted for quality and taste. From flours to ready-to-cook products, our range offers perfect nutrition and convenience.',
    specifications: [
      { key: 'Type', value: 'Processed Grains & Flours' },
      { key: 'Packaging', value: 'Food-grade sealed bags' },
      { key: 'Shelf Life', value: '6-12 months' },
      { key: 'Storage', value: 'Cool, dry place' },
    ],
    price: BigInt(95),
    nutritionData: {
      calories: 364,
      protein: 10.3,
      carbohydrates: 76.3,
      fat: 1.0,
      fiber: 2.7,
      iron: 1.2,
      zinc: 0.8,
      vitamins: 'Vitamin B1, B2, B3',
      minerals: 'Iron, Calcium, Potassium',
    },
    imageUrl: '/assets/generated/processed-detail.dim_800x600.png',
    variants: [
      { name: 'Rice Flour', imageUrl: 'processed-rice-flour.png' },
      { name: 'Wheat Flour (Atta)', imageUrl: 'processed-wheat-flour.png' },
      { name: 'Besan (Gram Flour)', imageUrl: 'processed-besan.png' },
      { name: 'Poha (Flattened Rice)', imageUrl: 'processed-poha.png' },
      { name: 'Roasted Chana', imageUrl: 'processed-roasted-chana.png' },
      { name: 'Vermicelli', imageUrl: 'processed-vermicelli.png' },
    ],
  },
  {
    productName: 'Premium Makhana Collection',
    category: 'makhana',
    description:
      'Indulge in the ultimate snacking experience with our Premium Makhana. Sourced from the finest quality lotus seeds and expertly processed, our makhana offers a light, crunchy texture and irresistible flavor.',
    specifications: [
      { key: 'Type', value: 'Fox Nuts (Lotus Seeds)' },
      { key: 'Quality', value: 'Premium Grade' },
      { key: 'Processing', value: 'Roasted / Raw' },
      { key: 'Packaging', value: 'Airtight bags' },
    ],
    price: BigInt(350),
    nutritionData: {
      calories: 347,
      protein: 9.7,
      carbohydrates: 76.9,
      fat: 0.1,
      fiber: 14.5,
      iron: 1.4,
      zinc: 0.5,
      vitamins: 'Vitamin B1, B2, Vitamin E',
      minerals: 'Calcium, Magnesium, Potassium, Phosphorus',
    },
    imageUrl: '/assets/generated/makhana-detail.dim_800x600.png',
    variants: [
      { name: 'Fox Nut Regular', imageUrl: 'makhana-regular.png' },
      { name: 'Fox Nut Premium', imageUrl: 'makhana-premium.png' },
      { name: 'Roasted Makhana', imageUrl: 'makhana-roasted.png' },
      { name: 'Makhana Powder', imageUrl: 'makhana-powder.png' },
    ],
  },
];

export default function Admin() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);

  const { data: contactForms = [], isLoading: contactLoading, error: contactError } = useGetAllContactForms();
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const addProductDetail = useAddProductDetail();

  const isAuthenticated = !!identity;

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        orderId,
        status: status as OrderStatus,
      });
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleSeedProducts = async () => {
    if (!isAuthenticated) {
      toast.error('Please login as admin to seed products');
      return;
    }
    setIsSeeding(true);
    try {
      for (const product of PRODUCT_CATALOG) {
        await addProductDetail.mutateAsync(product);
      }
      toast.success('All 6 product categories seeded successfully!');
      queryClient.invalidateQueries({ queryKey: ['allProductDetails'] });
      queryClient.invalidateQueries({ queryKey: ['productByCategory'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Seeding failed: ${msg}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Admin Access Required</h2>
          <p className="text-muted-foreground">
            Please login with your admin account to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage orders, contact submissions, and product catalog
          </p>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="products">Product Catalog</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">All Orders</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['allOrders'] })}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : ordersError ? (
                <div className="p-8 text-center text-muted-foreground">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p>Unable to load orders. Admin access required.</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No orders found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Buyer Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={String(order.orderId)}>
                          <TableCell className="font-mono text-sm">
                            #{String(order.orderId)}
                          </TableCell>
                          <TableCell className="font-medium">{order.buyerName}</TableCell>
                          <TableCell className="text-muted-foreground">{order.buyerEmail}</TableCell>
                          <TableCell className="text-muted-foreground">{order.buyerPhone}</TableCell>
                          <TableCell className="font-semibold">
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                STATUS_COLORS[order.status as OrderStatus] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {String(order.status)}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={String(order.status)}
                              onValueChange={(val) => handleStatusChange(order.orderId, val)}
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Contact Form Submissions</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['allContactForms'] })}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              {contactLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : contactError ? (
                <div className="p-8 text-center text-muted-foreground">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p>Unable to load contact forms. Admin access required.</p>
                </div>
              ) : contactForms.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No contact form submissions found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactForms.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell className="text-muted-foreground">{entry.email}</TableCell>
                          <TableCell className="text-muted-foreground">{entry.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.userType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate" title={entry.message}>
                              {entry.message}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Product Catalog Tab */}
          <TabsContent value="products">
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Product Catalog Management</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Seed or re-seed all 6 product categories with complete variant data
                  </p>
                </div>
                <Button
                  onClick={handleSeedProducts}
                  disabled={isSeeding}
                  className="gap-2"
                >
                  {isSeeding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  {isSeeding ? 'Seeding...' : 'Seed / Re-seed Products'}
                </Button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCT_CATALOG.map((product) => (
                  <div
                    key={product.category}
                    className="border border-border rounded-xl p-4 bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{product.productName}</h3>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <span className="text-primary font-bold text-sm">
                        ₹{Number(product.price)}/kg
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((v) => (
                        <span
                          key={v.name}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {v.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
