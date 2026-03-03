import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductDetail, ContactFormEntry, Order, OrderStatus, UserProfile, NewOrderInput } from '../backend';

export function useGetProductByCategory(category: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ProductDetail | null>({
    queryKey: ['productByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return null;
      const result = await actor.getProductByCategory(category);
      return result ?? null;
    },
    enabled: !!actor && !actorFetching && !!category,
    retry: 1,
  });

  const isNotFound = !query.isLoading && !actorFetching && query.isFetched && query.data === null;

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isNotFound,
  };
}

export function useGetAllProductDetails() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductDetail[]>({
    queryKey: ['allProductDetails'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductDetails();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddProductDetail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
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
        params.productName,
        params.category,
        params.description,
        params.specifications,
        params.price,
        params.nutritionData,
        params.imageUrl,
        params.variants,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProductDetails'] });
      queryClient.invalidateQueries({ queryKey: ['productByCategory'] });
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      phoneNumber: string;
      message: string;
      userType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(
        params.name,
        params.email,
        params.phoneNumber,
        params.message,
        params.userType,
      );
    },
  });
}

export function useGetAllContactForms() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactFormEntry[]>({
    queryKey: ['allContactForms'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllContactForms();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(params.orderId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (input: NewOrderInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(input);
    },
  });
}

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
