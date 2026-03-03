import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ContactFormEntry, ProductDetail, Order, NewOrderInput, OrderStatus } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phoneNumber: string;
      message: string;
      userType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(
        data.name,
        data.email,
        data.phoneNumber,
        data.message,
        data.userType
      );
    },
  });
}

export function useGetAllContactForms() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormEntry[]>({
    queryKey: ['contactForms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactForms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllProductDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail[]>({
    queryKey: ['productDetails'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductDetails();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductDetail(productId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail | null>({
    queryKey: ['productDetail', productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === undefined) return null;
      return actor.getProductDetail(productId);
    },
    enabled: !!actor && !isFetching && productId !== undefined,
  });
}

export function useGetProductsByCategory(category: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail[]>({
    queryKey: ['productsByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      const results = await actor.getProductsByCategory(category);
      return results;
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetProductByCategory(category: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail | null>({
    queryKey: ['productByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return null;
      try {
        const result = await actor.getProductByCategory(category);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useAddProductDetail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productName: string;
      category: string;
      description: string;
      specifications: Array<{ key: string; value: string }>;
      price: bigint;
      nutritionData: {
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        iron: number;
        zinc: number;
        vitamins: string;
        minerals: string;
      };
      imageUrl: string;
      variants: Array<{ name: string; imageUrl: string }>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProductDetail(
        data.productName,
        data.category,
        data.description,
        data.specifications,
        data.price,
        data.nutritionData,
        data.imageUrl,
        data.variants
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productDetails'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['productByCategory'] });
    },
  });
}

// E-commerce hooks

export function usePlaceOrder() {
  const { actor } = useActor();

  return useMutation<Order, Error, NewOrderInput>({
    mutationFn: async (input: NewOrderInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(input);
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrderById(orderId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === undefined) return null;
      return actor.getOrderById(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== undefined,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { orderId: bigint; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
