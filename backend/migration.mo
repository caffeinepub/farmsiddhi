import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

module {
  type Specification = {
    key : Text;
    value : Text;
  };

  type NutritionData = {
    calories : Float;
    protein : Float;
    carbohydrates : Float;
    fat : Float;
    fiber : Float;
    iron : Float;
    zinc : Float;
    vitamins : Text;
    minerals : Text;
  };

  type ProductVariant = {
    name : Text;
    imageUrl : Text;
  };

  type ProductDetail = {
    productId : Nat;
    productName : Text;
    category : Text;
    description : Text;
    specifications : [Specification];
    price : Nat;
    nutritionData : NutritionData;
    imageUrl : Text;
    variants : [ProductVariant];
  };

  type LegacyUserProfile = {
    name : Text;
    email : Text;
  };

  type LegacyOrder = {
    orderId : Nat;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : {
      street : Text;
      city : Text;
      state : Text;
      pincode : Text;
      country : Text;
    };
    items : [
      {
        productId : Nat;
        productName : Text;
        variantName : Text;
        quantity : Nat;
        unitPrice : Nat;
      }
    ];
    totalAmount : Nat;
    status : { #pending; #confirmed; #processing; #shipped; #delivered; #cancelled };
    createdAt : Time.Time;
  };

  type ContactFormEntry = {
    name : Text;
    userType : Text;
    email : Text;
    phoneNumber : Text;
    message : Text;
  };

  type Order = {
    orderId : Nat;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : {
      street : Text;
      city : Text;
      state : Text;
      pincode : Text;
      country : Text;
    };
    items : [
      {
        productId : Nat;
        productName : Text;
        variantName : Text;
        quantity : Nat;
        unitPrice : Nat;
      }
    ];
    totalAmount : Nat;
    status : { #pending; #confirmed; #processing; #shipped; #delivered; #cancelled };
    createdAt : Time.Time;
  };

  type Actor = {
    contactFormEntries : List.List<ContactFormEntry>;
    productDetails : Map.Map<Nat, ProductDetail>;
    userProfiles : Map.Map<Principal, LegacyUserProfile>;
    orders : Map.Map<Nat, LegacyOrder>;
  };

  type NewActor = {
    contactFormEntries : List.List<ContactFormEntry>;
    productDetails : Map.Map<Nat, ProductDetail>;
    userProfiles : Map.Map<Principal, LegacyUserProfile>;
    orders : Map.Map<Nat, Order>;
  };

  public func run(old : Actor) : NewActor {
    let riceProduct : ProductDetail = {
      productId = 0;
      productName = "Double Polished Rice";
      category = "rice";
      description = "Our Double Polished Rice undergoes a meticulous two-stage polishing process, resulting in grains of exceptional purity and brilliance. Experience the difference with every grain – pristine, flavorful, and perfect for elevating your favorite dishes.";
      specifications = [
        { key = "Type"; value = "Grain" },
        { key = "Usage"; value = "Culinary/baking" },
        { key = "Texture"; value = "Fine, powdery" },
      ];
      price = 100;
      nutritionData = {
        calories = 200.0;
        protein = 4.0;
        carbohydrates = 45.0;
        fat = 0.5;
        fiber = 1.0;
        iron = 1.2;
        zinc = 0.8;
        vitamins = "Fortified with essential vitamins";
        minerals = "Iron, zinc";
      };
      imageUrl = "rice_image_url";
      variants = [
        { name = "Variant A"; imageUrl = "variant_a_image_url" },
        { name = "Variant B"; imageUrl = "variant_b_image_url" },
      ];
    };

    let wheatProduct : ProductDetail = {
      productId = 1;
      productName = "Advanced Double Polished Wheat Flour";
      category = "wheat";
      description = "Our Advanced Double Polished Wheat Flour represents the pinnacle of refinement and quality. Through a cutting-edge double-stage polishing process, we ensure each grain retains its essential nutrients while achieving a smooth, pristine finish. Perfect for all your culinary needs, our wheat flour delivers superior taste, texture, and nutritional value in every batch.";
      specifications = [
        { key = "Type"; value = "Wheat flour" },
        { key = "Processing"; value = "Double polished" },
        { key = "Quality"; value = "Superior" },
      ];
      price = 199;
      nutritionData = {
        calories = 200.0;
        protein = 4.0;
        carbohydrates = 45.0;
        fat = 0.5;
        fiber = 1.0;
        iron = 1.2;
        zinc = 0.8;
        vitamins = "Fortified with essential vitamins";
        minerals = "Calcium, magnesium, potassium";
      };
      imageUrl = "wheat_image_url";
      variants = [
        { name = "Soft Wheat"; imageUrl = "soft_wheat_image_url" },
        { name = "Hard Wheat"; imageUrl = "hard_wheat_image_url" },
      ];
    };

    let pulsesProduct : ProductDetail = {
      productId = 2;
      productName = "Premium Dried Pulses";
      category = "pulses";
      description = "Explore our premium selection of high-quality dried pulses, including lentils, beans, chickpeas, and peas. Packed with essential nutrients and bursting with flavor, our pulses are meticulously sourced to bring you the finest quality for your kitchen. Perfect for a wide range of culinary creations, from hearty soups to flavorful curries, our pulses are a versatile addition to any pantry.";
      specifications = [
        { key = "Type"; value = "Lentils, beans, peas, chickpeas" },
        { key = "Packaging"; value = "Standard" },
      ];
      price = 150;
      nutritionData = {
        calories = 150.0;
        protein = 8.0;
        carbohydrates = 30.0;
        fat = 1.0;
        fiber = 5.0;
        iron = 2.0;
        zinc = 1.5;
        vitamins = "Rich in B vitamins";
        minerals = "Calcium, magnesium, potassium";
      };
      imageUrl = "pulses_image_url";
      variants = [
        { name = "Red Lentils"; imageUrl = "red_lentils_image_url" },
        { name = "Chickpeas"; imageUrl = "chickpeas_image_url" },
      ];
    };

    let spicesProduct : ProductDetail = {
      productId = 3;
      productName = "Aromatic Whole Spices";
      category = "spices";
      description = "Elevate your culinary creations with our wide range of aromatic whole spices. Carefully sourced and expertly blended, our spice collection promises to enhance every dish with rich flavors and captivating aromas. From classic seasonings to exotic blends, our spices are the secret ingredient to a world of taste experiences.";
      specifications = [
        { key = "Type"; value = "Herbs and spices" },
        { key = "Aroma"; value = "Aromatic" },
      ];
      price = 70;
      nutritionData = {
        calories = 0.5;
        protein = 0.1;
        carbohydrates = 0.2;
        fat = 0.05;
        fiber = 0.0;
        iron = 0.02;
        zinc = 0.01;
        vitamins = "Varies by product";
        minerals = "Calcium, magnesium, potassium";
      };
      imageUrl = "spices_image_url";
      variants = [
        { name = "Whole Spices"; imageUrl = "whole_spices_image_url" },
        { name = "Ground Spices"; imageUrl = "ground_spices_image_url" },
      ];
    };

    let processedFoodProduct : ProductDetail = {
      productId = 4;
      productName = "Convenient Packaged Processed Foods";
      category = "processed-food-products";
      description = "Explore our range of convenient packaged processed foods, meticulously crafted for quality and taste. From ready-to-eat snacks to meal kits, our processed food products offer a perfect blend of nutrition and convenience, making mealtime easy and enjoyable.";
      specifications = [
        { key = "Convenience"; value = "Ready-to-eat" },
        { key = "Packaging"; value = "Packaged" },
        { key = "Shelf Life"; value = "Varies by product" },
      ];
      price = 125;
      nutritionData = {
        calories = 180.0;
        protein = 7.0;
        carbohydrates = 17.0;
        fat = 8.0;
        fiber = 1.5;
        iron = 0.5;
        zinc = 0.1;
        vitamins = "Varies by product";
        minerals = "Varies by product";
      };
      imageUrl = "processed_food_image_url";
      variants = [];
    };

    let makhanaProduct : ProductDetail = {
      productId = 5;
      productName = "Premium Roasted Makhana";
      category = "makhana";
      description = "Indulge in the ultimate snacking experience with our Premium Roasted Makhana. Sourced from the finest quality lotus seeds and expertly roasted to perfection, our makhana offers a light, crunchy texture and irresistible flavor. Packed with nutrients and gluten-free, it's the perfect wholesome snack for any occasion.";
      specifications = [
        { key = "Quality"; value = "Premium" },
        { key = "Preparation"; value = "Roasted" },
      ];
      price = 80;
      nutritionData = {
        calories = 110.0;
        protein = 3.0;
        carbohydrates = 20.0;
        fat = 1.5;
        fiber = 2.0;
        iron = 0.5;
        zinc = 0.1;
        vitamins = "Vitamin E, B-complex";
        minerals = "Calcium, magnesium, potassium";
      };
      imageUrl = "makhana_image_url";
      variants = [
        { name = "Classic"; imageUrl = "classic_makhana_image_url" },
        { name = "Masala"; imageUrl = "masala_makhana_image_url" },
      ];
    };

    let defaultProductDetails = Map.empty<Nat, ProductDetail>();
    defaultProductDetails.add(0, riceProduct);
    defaultProductDetails.add(1, wheatProduct);
    defaultProductDetails.add(2, pulsesProduct);
    defaultProductDetails.add(3, spicesProduct);
    defaultProductDetails.add(4, processedFoodProduct);
    defaultProductDetails.add(5, makhanaProduct);

    if (old.productDetails.size() >= 6) {
      return {
        old with
        orders = old.orders;
      };
    };

    let mergedProductDetails = if (old.productDetails.size() > 0) {
      let copiedProductDetails = Map.empty<Nat, ProductDetail>();
      copiedProductDetails.add(0, riceProduct);
      copiedProductDetails.add(1, wheatProduct);
      for ((id, product) in old.productDetails.entries()) {
        copiedProductDetails.add(id, product);
      };
      copiedProductDetails;
    } else {
      defaultProductDetails;
    };

    {
      old with
      productDetails = mergedProductDetails;
      orders = old.orders;
    };
  };
};
