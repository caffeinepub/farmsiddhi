import React, { useState } from 'react';
import { useGetAllContactForms, useGetAllOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Users, ShoppingBag } from 'lucide-react';
import { OrderStatus } from '../backend';

const statusOptions = [
  { value: OrderStatus.pending, label: 'Pending' },
  { value: OrderStatus.confirmed, label: 'Confirmed' },
  { value: OrderStatus.processing, label: 'Processing' },
  { value: OrderStatus.shipped, label: 'Shipped' },
  { value: OrderStatus.delivered, label: 'Delivered' },
  { value: OrderStatus.cancelled, label: 'Cancelled' },
];

const statusColors: Record<string, string> = {
  [OrderStatus.pending]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.confirmed]: 'bg-blue-100 text-blue-800',
  [OrderStatus.processing]: 'bg-purple-100 text-purple-800',
  [OrderStatus.shipped]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.delivered]: 'bg-green-100 text-green-800',
  [OrderStatus.cancelled]: 'bg-red-100 text-red-800',
};

function getStatusKey(status: OrderStatus | object): string {
  if (typeof status === 'object' && status !== null) {
    return Object.keys(status)[0];
  }
  return String(status);
}

export default function Admin() {
  const { data: contactForms, isLoading: contactLoading, isError: contactError } = useGetAllContactForms();
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const [activeTab, setActiveTab] = useState('orders');

  const handleStatusChange = (orderId: bigint, newStatus: string) => {
    const statusValue = newStatus as OrderStatus;
    updateStatus.mutate({ orderId, status: statusValue });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage orders and contact submissions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Orders
            {orders && orders.length > 0 && (
              <Badge variant="secondary" className="ml-1">{orders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contact Submissions
            {contactForms && contactForms.length > 0 && (
              <Badge variant="secondary" className="ml-1">{contactForms.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : ordersError ? (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 rounded-xl p-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Failed to load orders</p>
                <p className="text-sm text-red-500 mt-1">You may not have admin access. Please log in as an admin.</p>
              </div>
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm mt-1">Orders placed by customers will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Buyer Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Total (₹)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => {
                      const statusKey = getStatusKey(order.status);
                      return (
                        <tr key={order.orderId.toString()} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-mono text-gray-700">#{order.orderId.toString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{order.buyerName}</td>
                          <td className="px-4 py-3 text-gray-600">{order.buyerEmail}</td>
                          <td className="px-4 py-3 text-gray-600">{order.buyerPhone}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[statusKey] || 'bg-gray-100 text-gray-800'}`}>
                              {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={statusKey}
                              onChange={e => handleStatusChange(order.orderId, e.target.value)}
                              className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                              disabled={updateStatus.isPending}
                            >
                              {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Contact Submissions Tab */}
        <TabsContent value="contacts">
          {contactLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contactError ? (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 rounded-xl p-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Failed to load contact submissions</p>
                <p className="text-sm text-red-500 mt-1">You may not have admin access. Please log in as an admin.</p>
              </div>
            </div>
          ) : !contactForms || contactForms.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-medium">No contact submissions yet</p>
              <p className="text-sm mt-1">Contact form submissions will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">User Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactForms.map((entry, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{entry.name}</td>
                        <td className="px-4 py-3 text-gray-600">{entry.email}</td>
                        <td className="px-4 py-3 text-gray-600">{entry.phoneNumber}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">{entry.userType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <p className="truncate" title={entry.message}>{entry.message}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
