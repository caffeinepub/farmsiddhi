import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContactFormEntry,
  MandiPrice,
  NewOrderInput,
  Order,
  OrderStatus,
  ProductDetail,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetProductByCategory(category: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail | null>({
    queryKey: ["product", category],
    queryFn: async () => {
      if (!actor || !category) return null;
      const result = await actor.getProductByCategory(category);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!category && category.length > 0,
  });
}

export function useGetAllProductDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductDetails();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllContactForms() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormEntry[]>({
    queryKey: ["contactForms"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllContactForms();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phoneNumber: string;
      message: string;
      userType: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitContactForm(
        data.name,
        data.email,
        data.phoneNumber,
        data.message,
        data.userType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactForms"] });
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrderById(orderId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ["order", orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === undefined) return null;
      try {
        const result = await actor.getOrderById(orderId);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && orderId !== undefined,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewOrderInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
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
      if (!actor) throw new Error("Actor not available");
      return actor.addProductDetail(
        data.productName,
        data.category,
        data.description,
        data.specifications,
        data.price,
        data.nutritionData,
        data.imageUrl,
        data.variants,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Mandi Price Hooks ───────────────────────────────────────────────────────

export function useGetAllMandiPrices() {
  const { actor, isFetching } = useActor();

  return useQuery<MandiPrice[]>({
    queryKey: ["mandiPrices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMandiPrices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMandiPricesByCommodity(commodity: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MandiPrice[]>({
    queryKey: ["mandiPrices", "commodity", commodity],
    queryFn: async () => {
      if (!actor || !commodity) return [];
      return actor.getMandiPricesByCommodity(commodity);
    },
    enabled: !!actor && !isFetching && !!commodity && commodity.length > 0,
  });
}

export function useGetMandiPricesByState(state: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MandiPrice[]>({
    queryKey: ["mandiPrices", "state", state],
    queryFn: async () => {
      if (!actor || !state) return [];
      return actor.getMandiPricesByState(state);
    },
    enabled: !!actor && !isFetching && !!state && state.length > 0,
  });
}

export function useAddMandiPriceSeed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.seedMandiPrices();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandiPrices"] });
    },
  });
}
