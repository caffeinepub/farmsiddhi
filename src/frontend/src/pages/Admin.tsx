import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Loader2, Lock, Package, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProductDetail,
  useGetAllContactForms,
  useGetAllOrders,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const ORDER_STATUSES = [
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.confirmed, label: "Confirmed" },
  { value: OrderStatus.processing, label: "Processing" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function getStatusKey(status: unknown): string {
  if (typeof status === "string") return status;
  if (typeof status === "object" && status !== null) {
    return Object.keys(status as Record<string, unknown>)[0] || "pending";
  }
  return "pending";
}

const SEED_PRODUCTS = [
  {
    productName: "Premium Rice",
    category: "rice",
    description:
      "High-quality rice sourced directly from farmers across India. Available in multiple varieties to suit every culinary need.",
    specifications: [
      { key: "Moisture Content", value: "≤14%" },
      { key: "Broken Grains", value: "≤5%" },
      { key: "Foreign Matter", value: "≤0.1%" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    price: BigInt(4500),
    nutritionData: {
      calories: 130,
      protein: 2.7,
      carbohydrates: 28.2,
      fat: 0.3,
      fiber: 0.4,
      iron: 0.2,
      zinc: 0.5,
      vitamins: "B1, B3, B6",
      minerals: "Magnesium, Phosphorus",
    },
    imageUrl: "/assets/generated/rice-detail.dim_800x600.png",
    variants: [
      {
        name: "Basmati Rice",
        imageUrl: "/assets/generated/rice-basmati.dim_400x300.png",
      },
      {
        name: "Sona Masoori",
        imageUrl: "/assets/generated/rice-sona-masoori.dim_400x300.png",
      },
      {
        name: "IR64 Rice",
        imageUrl: "/assets/generated/rice-ir64.dim_400x300.png",
      },
      {
        name: "Brown Rice",
        imageUrl: "/assets/generated/rice-brown.dim_400x300.png",
      },
      {
        name: "Broken Rice",
        imageUrl: "/assets/generated/rice-broken.dim_400x300.png",
      },
    ],
  },
  {
    productName: "Premium Wheat",
    category: "wheat",
    description:
      "Premium quality wheat sourced from the fertile plains of India. Ideal for flour milling, bread making, and various food processing applications.",
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Protein Content", value: "11-13%" },
      { key: "Test Weight", value: "76-80 kg/hl" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    price: BigInt(2800),
    nutritionData: {
      calories: 340,
      protein: 13.2,
      carbohydrates: 72.0,
      fat: 2.5,
      fiber: 10.7,
      iron: 3.6,
      zinc: 2.8,
      vitamins: "B1, B2, B3, E",
      minerals: "Iron, Zinc, Magnesium",
    },
    imageUrl: "/assets/generated/wheat-detail.dim_800x600.png",
    variants: [
      {
        name: "Durum Wheat",
        imageUrl: "/assets/generated/wheat-durum.dim_400x300.png",
      },
      {
        name: "Whole Wheat",
        imageUrl: "/assets/generated/wheat-whole.dim_400x300.png",
      },
      {
        name: "Semolina (Suji)",
        imageUrl: "/assets/generated/wheat-semolina.dim_400x300.png",
      },
    ],
  },
  {
    productName: "Premium Pulses",
    category: "pulses",
    description:
      "High-protein pulses and lentils sourced from across India. Rich in nutrients and perfect for domestic consumption and export markets.",
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Admixture", value: "≤1%" },
      { key: "Protein Content", value: "20-25%" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    price: BigInt(6500),
    nutritionData: {
      calories: 350,
      protein: 24.0,
      carbohydrates: 60.0,
      fat: 1.2,
      fiber: 15.0,
      iron: 6.5,
      zinc: 3.2,
      vitamins: "B1, B6, Folate",
      minerals: "Iron, Potassium, Magnesium",
    },
    imageUrl: "/assets/generated/pulses-detail.dim_800x600.png",
    variants: [
      {
        name: "Chana Dal",
        imageUrl: "/assets/generated/pulses-chana-dal.dim_400x300.png",
      },
      {
        name: "Moong Dal",
        imageUrl: "/assets/generated/pulses-moong-dal.dim_400x300.png",
      },
      {
        name: "Masoor Dal",
        imageUrl: "/assets/generated/pulses-masoor-dal.dim_400x300.png",
      },
      {
        name: "Urad Dal",
        imageUrl: "/assets/generated/pulses-urad-dal.dim_400x300.png",
      },
      {
        name: "Toor Dal",
        imageUrl: "/assets/generated/pulses-toor-dal.dim_400x300.png",
      },
      {
        name: "Rajma",
        imageUrl: "/assets/generated/pulses-rajma.dim_400x300.png",
      },
      {
        name: "Kabuli Chana",
        imageUrl: "/assets/generated/pulses-kabuli-chana.dim_400x300.png",
      },
    ],
  },
  {
    productName: "Premium Spices",
    category: "spices",
    description:
      "Aromatic and flavorful spices sourced from the finest growing regions of India. Available in whole and ground forms for culinary and industrial use.",
    specifications: [
      { key: "Moisture Content", value: "≤10%" },
      { key: "Ash Content", value: "≤7%" },
      { key: "Volatile Oil", value: "≥2%" },
      { key: "Packaging", value: "1kg, 5kg, 25kg bags" },
      { key: "Origin", value: "India" },
    ],
    price: BigInt(12000),
    nutritionData: {
      calories: 354,
      protein: 12.7,
      carbohydrates: 65.0,
      fat: 9.9,
      fiber: 21.1,
      iron: 55.0,
      zinc: 4.4,
      vitamins: "C, B6, K",
      minerals: "Iron, Manganese, Potassium",
    },
    imageUrl: "/assets/generated/spices-detail.dim_800x600.png",
    variants: [
      {
        name: "Turmeric Powder",
        imageUrl: "/assets/generated/spices-turmeric.dim_400x400.png",
      },
      {
        name: "Red Chilli Powder",
        imageUrl: "/assets/generated/spices-red-chilli.dim_400x400.png",
      },
      {
        name: "Coriander Powder",
        imageUrl: "/assets/generated/spices-coriander.dim_400x400.png",
      },
      {
        name: "Cumin Seeds",
        imageUrl: "/assets/generated/spices-cumin.dim_400x300.png",
      },
      {
        name: "Black Pepper",
        imageUrl: "/assets/generated/spices-black-pepper.dim_400x300.png",
      },
      {
        name: "Cardamom",
        imageUrl: "/assets/generated/spices-cardamom.dim_400x300.png",
      },
      {
        name: "Ginger Powder",
        imageUrl: "/assets/generated/spices-ginger.dim_400x300.png",
      },
      {
        name: "Fenugreek Seeds",
        imageUrl: "/assets/generated/spices-fenugreek.dim_400x300.png",
      },
    ],
  },
  {
    productName: "Processed Food Products",
    category: "processed-food-products",
    description:
      "Value-added processed food products made from premium quality grains and pulses. Ideal for retail, food service, and export markets.",
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Ash Content", value: "≤1.5%" },
      { key: "Protein Content", value: "8-12%" },
      { key: "Packaging", value: "1kg, 5kg, 25kg bags" },
      { key: "Origin", value: "India" },
    ],
    price: BigInt(5500),
    nutritionData: {
      calories: 360,
      protein: 10.0,
      carbohydrates: 75.0,
      fat: 1.5,
      fiber: 3.0,
      iron: 2.5,
      zinc: 1.8,
      vitamins: "B1, B2, B3",
      minerals: "Iron, Calcium, Phosphorus",
    },
    imageUrl: "/assets/generated/processed-detail.dim_800x600.png",
    variants: [
      {
        name: "Rice Flour",
        imageUrl: "/assets/generated/processed-rice-flour.dim_400x300.png",
      },
      {
        name: "Wheat Flour (Atta)",
        imageUrl: "/assets/generated/processed-wheat-flour.dim_400x300.png",
      },
      {
        name: "Besan (Gram Flour)",
        imageUrl: "/assets/generated/processed-besan.dim_400x300.png",
      },
      {
        name: "Poha (Flattened Rice)",
        imageUrl: "/assets/generated/processed-poha.dim_400x300.png",
      },
      {
        name: "Roasted Chana",
        imageUrl: "/assets/generated/processed-roasted-chana.dim_400x300.png",
      },
      {
        name: "Vermicelli",
        imageUrl: "/assets/generated/processed-vermicelli.dim_400x300.png",
      },
    ],
  },
  {
    productName: "Premium Makhana",
    category: "makhana",
    description:
      "Premium quality Makhana (Fox Nuts) sourced from Bihar, India. Rich in nutrients and perfect for snacking, cooking, and export markets.",
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Size", value: "4-6 Suta (Grade A)" },
      { key: "Purity", value: "≥98%" },
      { key: "Packaging", value: "5kg, 10kg, 25kg bags" },
      { key: "Origin", value: "Bihar, India" },
    ],
    price: BigInt(18000),
    nutritionData: {
      calories: 347,
      protein: 9.7,
      carbohydrates: 76.9,
      fat: 0.1,
      fiber: 14.5,
      iron: 1.4,
      zinc: 0.5,
      vitamins: "B1, B2",
      minerals: "Calcium, Magnesium, Potassium",
    },
    imageUrl: "/assets/generated/makhana-detail.dim_800x600.png",
    variants: [
      {
        name: "Regular Makhana",
        imageUrl: "/assets/generated/makhana.dim_400x300.png",
      },
      {
        name: "Premium Makhana",
        imageUrl: "/assets/generated/makhana.dim_400x300.png",
      },
      {
        name: "Roasted Makhana",
        imageUrl: "/assets/generated/makhana-roasted.dim_400x300.png",
      },
      {
        name: "Makhana Powder",
        imageUrl: "/assets/generated/makhana-powder.dim_400x300.png",
      },
    ],
  },
];

export default function Admin() {
  const { identity, login, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = loginStatus === "success" && !!identity;

  const { data: contactForms = [], isLoading: loadingContacts } =
    useGetAllContactForms();
  const {
    data: orders = [],
    isLoading: loadingOrders,
    refetch: refetchOrders,
  } = useGetAllOrders();
  const { mutateAsync: updateStatus } = useUpdateOrderStatus();
  const { mutateAsync: addProduct, isPending: seeding } = useAddProductDetail();
  const [seedingDone, setSeedingDone] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: bigint, status: OrderStatus) => {
    const orderIdStr = orderId.toString();
    setUpdatingOrderId(orderIdStr);
    try {
      await updateStatus({ orderId, status });
      toast.success("Order status updated");
      refetchOrders();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSeedProducts = async () => {
    try {
      for (const product of SEED_PRODUCTS) {
        await addProduct(product);
      }
      setSeedingDone(true);
      toast.success("All 6 product categories seeded successfully!");
    } catch {
      toast.error("Failed to seed products. You may need admin permissions.");
    }
  };

  // Auth gate — show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center" data-ocid="admin.panel">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Admin Access Required
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            This page is restricted to FarmSiddhi administrators. Please log in
            with your Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            size="lg"
            className="w-full gap-2"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting…
              </>
            ) : (
              "Login to Admin Panel"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Only authorised principals can access admin features. Contact the
            system administrator if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage orders, contact submissions, and product catalog.
          </p>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6" data-ocid="admin.tab">
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              Orders
              {orders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {orders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contacts" data-ocid="admin.contacts.tab">
              Contact Submissions
              {contactForms.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {contactForms.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" data-ocid="admin.products.tab">
              Product Catalog
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  All Orders
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchOrders()}
                  className="gap-2"
                  data-ocid="admin.secondary_button"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              {loadingOrders ? (
                <div
                  className="flex items-center justify-center py-16"
                  data-ocid="admin.orders.loading_state"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="admin.orders.empty_state"
                >
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No orders yet.</p>
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
                        <TableHead>Total (₹)</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const statusKey = getStatusKey(order.status);
                        const orderIdStr = order.orderId.toString();
                        const isUpdating = updatingOrderId === orderIdStr;
                        const orderDate = new Date(
                          Number(order.createdAt) / 1_000_000,
                        );
                        return (
                          <TableRow key={orderIdStr}>
                            <TableCell className="font-medium">
                              #{orderIdStr}
                            </TableCell>
                            <TableCell>{order.buyerName}</TableCell>
                            <TableCell>{order.buyerEmail}</TableCell>
                            <TableCell>{order.buyerPhone}</TableCell>
                            <TableCell>
                              ₹
                              {Number(order.totalAmount).toLocaleString(
                                "en-IN",
                              )}
                            </TableCell>
                            <TableCell>
                              {Number.isNaN(orderDate.getTime())
                                ? "N/A"
                                : orderDate.toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[statusKey] || "bg-gray-100 text-gray-800"}`}
                              >
                                {statusKey.charAt(0).toUpperCase() +
                                  statusKey.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={statusKey}
                                  onValueChange={(val) =>
                                    handleStatusChange(
                                      order.orderId,
                                      val as OrderStatus,
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <SelectTrigger className="w-36 h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ORDER_STATUSES.map((s) => (
                                      <SelectItem
                                        key={s.value}
                                        value={s.value}
                                        className="text-xs"
                                      >
                                        {s.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {isUpdating && (
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Contact Form Submissions
                </h2>
              </div>
              {loadingContacts ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : contactForms.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No contact form submissions yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactForms.map((entry, index) => (
                        <TableRow key={`contact-${entry.email}-${index}`}>
                          <TableCell className="text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {entry.name}
                          </TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{entry.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.userType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p
                              className="truncate text-sm text-muted-foreground"
                              title={entry.message}
                            >
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
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Product Catalog Management
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seed the backend with all 6 product categories and their
                    variants.
                  </p>
                </div>
                <Button
                  onClick={handleSeedProducts}
                  disabled={seeding}
                  className="gap-2"
                  data-ocid="admin.primary_button"
                >
                  {seeding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Seeding...
                    </>
                  ) : seedingDone ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Re-seed Products
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Seed / Re-seed Products
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SEED_PRODUCTS.map((product) => (
                  <div
                    key={product.category}
                    className="border border-border rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-foreground mb-1">
                      {product.productName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Category: {product.category}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {product.variants.length} variants · ₹
                      {Number(product.price).toLocaleString("en-IN")}/quintal
                    </p>
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
