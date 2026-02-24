import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactFormEntry, ProductDetail } from '../backend';

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
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitContactForm(
        data.name,
        data.email,
        data.phoneNumber,
        data.message,
        data.userType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactForms'] });
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

export function useGetFormEntry(index: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormEntry>({
    queryKey: ['contactForm', index.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getFormEntry(index);
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

export function useGetProductDetail(productId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail | null>({
    queryKey: ['productDetail', productId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductDetail(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductDetail[]>({
    queryKey: ['productsByCategory', category],
    queryFn: async () => {
      if (!actor) {
        console.log('useGetProductsByCategory: Actor not initialized');
        return [];
      }
      
      console.log('useGetProductsByCategory: Fetching products for category:', category);
      
      try {
        const result = await actor.getProductsByCategory(category);
        console.log('useGetProductsByCategory: Result:', result);
        return result;
      } catch (error) {
        console.error('useGetProductsByCategory: Error fetching products:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}
