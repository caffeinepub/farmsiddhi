import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

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

  type OldActor = {
    contactFormEntries : List.List<{
      name : Text;
      userType : Text;
      email : Text;
      phoneNumber : Text;
      message : Text;
    }>;
    productDetails : Map.Map<Nat, ProductDetail>;
  };

  type NewActor = {
    contactFormEntries : List.List<{
      name : Text;
      userType : Text;
      email : Text;
      phoneNumber : Text;
      message : Text;
    }>;
    productDetails : Map.Map<Nat, ProductDetail>;
  };

  let expectedCategories : [Text] = [
    "rice",
    "wheat",
    "pulses",
    "spices",
    "processed-food-products",
    "makhana",
  ];

  func hasValidCategory(products : Map.Map<Nat, ProductDetail>, category : Text) : Bool {
    for (product in products.values()) {
      if (product.category == category) {
        return true;
      };
    };
    false;
  };

  public func run(old : OldActor) : NewActor {
    let seededProducts = Map.empty<Nat, ProductDetail>();

    // Preserve all existing products
    for ((k, v) in old.productDetails.entries()) {
      seededProducts.add(k, v);
    };

    let riceProduct : ProductDetail = {
      productId = 0;
      productName = "Rice";
      category = "rice";
      description = "High-quality basmati rice.";
      specifications = [
        { key = "Type"; value = "Basmati" },
        { key = "Weight"; value = "1kg" },
      ];
      price = 120;
      nutritionData = {
        calories = 365;
        protein = 7.1;
        carbohydrates = 79.5;
        fat = 0.6;
        fiber = 2.4;
        iron = 0.8;
        zinc = 1.2;
        vitamins = "B1, B3";
        minerals = "Phosphorus";
      };
      imageUrl = "rice.jpg";
      variants = [
        { name = "Long Grain"; imageUrl = "long-grain.jpg" },
        { name = "Short Grain"; imageUrl = "short-grain.jpg" },
      ];
    };

    let wheatProduct : ProductDetail = {
      productId = 1;
      productName = "Wheat";
      category = "wheat";
      description = "Premium quality wheat grains.";
      specifications = [
        { key = "Type"; value = "Hard Wheat" },
        { key = "Weight"; value = "2kg" },
      ];
      price = 200;
      nutritionData = {
        calories = 340;
        protein = 13.2;
        carbohydrates = 71.2;
        fat = 2.5;
        fiber = 12.2;
        iron = 3.6;
        zinc = 2.7;
        vitamins = "B Vitamins";
        minerals = "Magnesium";
      };
      imageUrl = "wheat.jpg";
      variants = [
        { name = "Whole Grain"; imageUrl = "whole-grain.jpg" },
        { name = "Cracked Wheat"; imageUrl = "cracked-wheat.jpg" },
      ];
    };

    let pulsesProduct : ProductDetail = {
      productId = 2;
      productName = "Pulses";
      category = "pulses";
      description = "Nutritious and protein-rich pulses.";
      specifications = [
        { key = "Type"; value = "Mixed Variety" },
        { key = "Weight"; value = "500g" },
      ];
      price = 150;
      nutritionData = {
        calories = 350;
        protein = 23.5;
        carbohydrates = 60.2;
        fat = 1.7;
        fiber = 16.5;
        iron = 8.5;
        zinc = 3.2;
        vitamins = "Folate";
        minerals = "Potassium";
      };
      imageUrl = "pulses.jpg";
      variants = [
        { name = "Red Lentils"; imageUrl = "red-lentils.jpg" },
        { name = "Chickpeas"; imageUrl = "chickpeas.jpg" },
      ];
    };

    let spicesProduct : ProductDetail = {
      productId = 3;
      productName = "Spices";
      category = "spices";
      description = "Aromatic and flavorful spices.";
      specifications = [
        { key = "Type"; value = "Mixed Varieties" },
        { key = "Weight"; value = "250g Pack" },
      ];
      price = 180;
      nutritionData = {
        calories = 260;
        protein = 12.4;
        carbohydrates = 60.8;
        fat = 4.2;
        fiber = 30.2;
        iron = 19.2;
        zinc = 4.1;
        vitamins = "A, C, B6";
        minerals = "Calcium, Iron";
      };
      imageUrl = "spices.jpg";
      variants = [
        { name = "Turmeric"; imageUrl = "turmeric.jpg" },
        { name = "Cumin"; imageUrl = "cumin.jpg" },
      ];
    };

    let processedFoodProducts : ProductDetail = {
      productId = 4;
      productName = "Processed Food Products";
      category = "processed-food-products";
      description = "Convenient and delicious processed food products.";
      specifications = [
        { key = "Type"; value = "Ready-to-Eat" },
        { key = "Weight"; value = "500g Pack" },
      ];
      price = 300;
      nutritionData = {
        calories = 420;
        protein = 12.8;
        carbohydrates = 70.5;
        fat = 10.2;
        fiber = 8.6;
        iron = 5.3;
        zinc = 2.8;
        vitamins = "D, E, B12";
        minerals = "Calcium, Magnesium";
      };
      imageUrl = "processed-food.jpg";
      variants = [
        { name = "Pasta"; imageUrl = "pasta.jpg" },
        { name = "Noodles"; imageUrl = "noodles.jpg" },
      ];
    };

    let makhanaProduct : ProductDetail = {
      productId = 5;
      productName = "Makhana (Fox Nuts)";
      category = "makhana";
      description = "Nutritious and crunchy flavored makhana.";
      specifications = [
        { key = "Type"; value = "Flavored" },
        { key = "Weight"; value = "200g" },
      ];
      price = 250;
      nutritionData = {
        calories = 350;
        protein = 9.7;
        carbohydrates = 77.2;
        fat = 0.5;
        fiber = 7.6;
        iron = 1.4;
        zinc = 0.7;
        vitamins = "B1, B2, B3";
        minerals = "Iron, Potassium";
      };
      imageUrl = "makhana.jpg";
      variants = [
        { name = "Peri Peri"; imageUrl = "peri-peri.jpg" },
        { name = "Cheese"; imageUrl = "cheese.jpg" },
      ];
    };

    // Seed or overwrite each of the six canonical products to ensure
    // correct category slugs are always present after upgrade.
    seededProducts.add(0, riceProduct);
    seededProducts.add(1, wheatProduct);
    seededProducts.add(2, pulsesProduct);
    seededProducts.add(3, spicesProduct);
    seededProducts.add(4, processedFoodProducts);
    seededProducts.add(5, makhanaProduct);

    { old with productDetails = seededProducts };
  };
};
