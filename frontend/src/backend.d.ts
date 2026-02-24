import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductDetail {
    specifications: Array<Specification>;
    description: string;
    productId: bigint;
    productName: string;
    variants: Array<ProductVariant>;
    nutritionData: NutritionData;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface NutritionData {
    fat: number;
    fiber: number;
    carbohydrates: number;
    calories: number;
    minerals: string;
    vitamins: string;
    protein: number;
}
export type Time = bigint;
export interface ContactFormEntry {
    userType: string;
    name: string;
    email: string;
    message: string;
    phoneNumber: string;
}
export interface OrderItem {
    variantName: string;
    productId: bigint;
    productName: string;
    quantity: bigint;
    unitPrice: bigint;
}
export interface NewOrderInput {
    buyerEmail: string;
    buyerPhone: string;
    shippingAddress: string;
    items: Array<OrderItem>;
    buyerName: string;
}
export interface Specification {
    key: string;
    value: string;
}
export interface ProductVariant {
    name: string;
    imageUrl: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Order {
    status: OrderStatus;
    buyerEmail: string;
    createdAt: Time;
    buyerPhone: string;
    orderId: bigint;
    totalAmount: bigint;
    shippingAddress: string;
    items: Array<OrderItem>;
    buyerName: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProductDetail(productName: string, category: string, description: string, specifications: Array<Specification>, price: bigint, nutritionData: NutritionData, imageUrl: string, variants: Array<ProductVariant>): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllContactForms(): Promise<Array<ContactFormEntry>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProductDetails(): Promise<Array<ProductDetail>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFormEntry(index: bigint): Promise<ContactFormEntry>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getProductDetail(productId: bigint): Promise<ProductDetail | null>;
    getProductsByCategory(category: string): Promise<Array<ProductDetail>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(input: NewOrderInput): Promise<Order>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, phoneNumber: string, message: string, userType: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<boolean>;
}
