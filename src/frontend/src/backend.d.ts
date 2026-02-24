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
export interface Specification {
    key: string;
    value: string;
}
export interface ProductVariant {
    name: string;
    imageUrl: string;
}
export interface ContactFormEntry {
    userType: string;
    name: string;
    email: string;
    message: string;
    phoneNumber: string;
}
export interface backendInterface {
    addProductDetail(productName: string, category: string, description: string, specifications: Array<Specification>, price: bigint, nutritionData: NutritionData, imageUrl: string, variants: Array<ProductVariant>): Promise<bigint>;
    getAllContactForms(): Promise<Array<ContactFormEntry>>;
    getAllProductDetails(): Promise<Array<ProductDetail>>;
    getFormEntry(index: bigint): Promise<ContactFormEntry>;
    getProductDetail(productId: bigint): Promise<ProductDetail | null>;
    getProductsByCategory(category: string): Promise<Array<ProductDetail>>;
    submitContactForm(name: string, email: string, phoneNumber: string, message: string, userType: string): Promise<void>;
}
