import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

module {
  type ContactFormEntry = {
    name : Text;
    userType : Text;
    email : Text;
    phoneNumber : Text;
    message : Text;
  };

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
    contactFormEntries : List.List<ContactFormEntry>;
    productDetails : Map.Map<Nat, ProductDetail>;
  };

  type NewActor = {
    contactFormEntries : List.List<ContactFormEntry>;
    productDetails : Map.Map<Nat, ProductDetail>;
  };

  public func run(old : OldActor) : NewActor {
    let productDetails = Map.fromIter<Nat, ProductDetail>(
      [
        (
          0,
          {
            productId = 0;
            productName = "Rice";
            category = "rice";
            description = "High quality rice with different variants such as Basmati, Sona Masoori, and IR-64 Parboiled.";
            specifications = [
              { key = "Type"; value = "Whole grain" },
              { key = "Color"; value = "Creamy white, varies by type" },
              { key = "Grain Length"; value = "Both long and medium grain varieties" },
              { key = "Purity"; value = "Up to 99.9%" },
              { key = "Moisture Content"; value = "12-14%" },
            ];
            price = 60;
            nutritionData = {
              calories = 130.0;
              protein = 2.7;
              carbohydrates = 28.0;
              fat = 0.3;
              fiber = 0.4;
              iron = 1.0;
              zinc = 0.7;
              vitamins = "B vitamins present";
              minerals = "Calcium, magnesium, phosphorus";
            };
            imageUrl = "/assets/generated/hero-rice.png";
            variants = [
              { name = "Basmati Rice"; imageUrl = "/assets/generated/rice-basmati.png" },
              { name = "Sona Masoori"; imageUrl = "/assets/generated/rice-sona-masoori.png" },
              { name = "IR-64 Parboiled Rice"; imageUrl = "/assets/generated/rice-ir-64-parboiled.png" },
              { name = "Brown Rice"; imageUrl = "/assets/generated/rice-brown.png" },
              { name = "Broken Rice"; imageUrl = "/assets/generated/rice-broken.png" },
            ];
          },
        ),
        (
          1,
          {
            productId = 1;
            productName = "Wheat";
            category = "wheat";
            description = "Best quality wheat including durum and whole wheat for various food products.";
            specifications = [
              { key = "Type"; value = "Whole grain" },
              { key = "Color"; value = "Golden Brown" },
              { key = "Grain Size"; value = "Hard and medium varieties" },
              { key = "Moisture Content"; value = "12-14%" },
              { key = "Organic"; value = "Available" },
            ];
            price = 50;
            nutritionData = {
              calories = 339.0;
              protein = 13.7;
              carbohydrates = 73.5;
              fat = 1.9;
              fiber = 10.7;
              iron = 3.5;
              zinc = 2.8;
              vitamins = "B vitamins, vitamin E";
              minerals = "Calcium, magnesium, potassium";
            };
            imageUrl = "/assets/generated/hero-wheat.png";
            variants = [
              { name = "Durum Wheat"; imageUrl = "/assets/generated/wheat-durum.png" },
              { name = "Whole Wheat"; imageUrl = "/assets/generated/wheat-whole.png" },
              { name = "Semolina"; imageUrl = "/assets/generated/wheat-semolina.png" },
            ];
          },
        ),
        (
          2,
          {
            productId = 2;
            productName = "Pulses (Dal)";
            category = "pulses";
            description = "High quality pulses including chana dal, moong dal, and masoor dal. Includes both whole and split variants like kabuli chana and rajma.";
            specifications = [
              { key = "Type"; value = "Whole grain" },
              { key = "Color"; value = "Ranges from yellow to orange" },
              { key = "Grain Size"; value = "Small, medium, and large" },
              { key = "Purity"; value = "Up to 99.9%" },
              { key = "Moisture Content"; value = "12-14%" },
            ];
            price = 70;
            nutritionData = {
              calories = 347.0;
              protein = 25.0;
              carbohydrates = 61.0;
              fat = 1.7;
              fiber = 17.4;
              iron = 7.2;
              zinc = 3.2;
              vitamins = "B vitamins, folate";
              minerals = "Calcium, magnesium, iron";
            };
            imageUrl = "/assets/generated/hero-pulses.png";
            variants = [
              { name = "Chana Dal"; imageUrl = "/assets/generated/pulses-chana-dal.png" },
              { name = "Moong Dal"; imageUrl = "/assets/generated/pulses-moong-dal.png" },
              { name = "Masoor Dal"; imageUrl = "/assets/generated/pulses-masoor-dal.png" },
              { name = "Urad Dal"; imageUrl = "/assets/generated/pulses-urad-dal.png" },
              { name = "Toor Dal"; imageUrl = "/assets/generated/pulses-toor-dal.png" },
              { name = "Rajma"; imageUrl = "/assets/generated/pulses-rajma.png" },
              { name = "Kabuli Chana"; imageUrl = "/assets/generated/pulses-kabuli-chana.png" },
            ];
          },
        ),
        (
          3,
          {
            productId = 3;
            productName = "Spices";
            category = "spices";
            description = "Premium spices including turmeric, red chilli, cumin, and cardamom.";
            specifications = [
              { key = "Type"; value = "Ground and whole" },
              { key = "Color"; value = "Varies by spice" },
              { key = "Purity"; value = "Up to 99.9%" },
              { key = "Origin"; value = "Himalayan region" },
              { key = "Moisture Content"; value = "8-10%" },
            ];
            price = 180;
            nutritionData = {
              calories = 251.0;
              protein = 8.5;
              carbohydrates = 55.5;
              fat = 3.3;
              fiber = 22.7;
              iron = 41.1;
              zinc = 4.7;
              vitamins = "Vitamins E, B6, C";
              minerals = "Calcium, magnesium, potassium";
            };
            imageUrl = "/assets/generated/hero-spices.png";
            variants = [
              { name = "Turmeric"; imageUrl = "/assets/generated/spices-turmeric.png" },
              { name = "Red Chilli"; imageUrl = "/assets/generated/spices-red-chilli.png" },
              { name = "Coriander"; imageUrl = "/assets/generated/spices-coriander.png" },
              { name = "Cumin"; imageUrl = "/assets/generated/spices-cumin.png" },
              { name = "Black Pepper"; imageUrl = "/assets/generated/spices-black-pepper.png" },
              { name = "Cardamom"; imageUrl = "/assets/generated/spices-cardamom.png" },
              { name = "Ginger Powder"; imageUrl = "/assets/generated/spices-ginger-powder.png" },
              { name = "Fenugreek"; imageUrl = "/assets/generated/spices-fenugreek.png" },
            ];
          },
        ),
        (
          4,
          {
            productId = 4;
            productName = "Processed Food Products";
            category = "processed-food-products";
            description = "Range of processed products including wheat flour, besan, and various snacks.";
            specifications = [
              { key = "Type"; value = "Processed food" },
              { key = "Base Ingredient"; value = "Wheat, rice, lentils, etc." },
              { key = "Purity"; value = "High quality" },
              { key = "Organic"; value = "Available" },
              { key = "Shelf Life"; value = "Varies by product" },
            ];
            price = 70;
            nutritionData = {
              calories = 350.0;
              protein = 12.0;
              carbohydrates = 78.0;
              fat = 2.0;
              fiber = 7.0;
              iron = 2.5;
              zinc = 1.0;
              vitamins = "Various B vitamins";
              minerals = "Calcium, magnesium, iron";
            };
            imageUrl = "/assets/generated/hero-processed-foodproducts.png";
            variants = [
              { name = "Rice Flour"; imageUrl = "/assets/generated/processed-food-products-rice-flour.png" },
              { name = "Wheat Flour / Atta"; imageUrl = "/assets/generated/processed-food-products-wheat-flour.png" },
              { name = "Besan / Gram Flour"; imageUrl = "/assets/generated/processed-food-products-besan.png" },
              { name = "Poha / Flattened Rice"; imageUrl = "/assets/generated/processed-food-products-poha.png" },
              { name = "Roasted Chana"; imageUrl = "/assets/generated/processed-food-products-roasted-chana.png" },
              { name = "Vermicelli"; imageUrl = "/assets/generated/processed-food-products-vermicelli.png" },
            ];
          },
        ),
        (
          5,
          {
            productId = 5;
            productName = "Makhana (Fox Nut)";
            category = "makhana";
            description = "High quality Makhana with various populations and roasts.";
            specifications = [
              { key = "Type"; value = "Snack" },
              { key = "Origin"; value = "Himalayan foothills" },
              { key = "Variants"; value = "Whole, roasted, flavored" },
              { key = "Gluten-Free"; value = "Yes" },
              { key = "Fat Content"; value = "Low" },
            ];
            price = 90;
            nutritionData = {
              calories = 350.0;
              protein = 9.7;
              carbohydrates = 76.9;
              fat = 0.1;
              fiber = 7.0;
              iron = 1.4;
              zinc = 1.1;
              vitamins = "Thiamin present";
              minerals = "Calcium, magnesium, potassium";
            };
            imageUrl = "/assets/generated/hero-makhana.png";
            variants = [
              { name = "Fox Nut Regular"; imageUrl = "/assets/generated/makhana-regular.png" },
              { name = "Fox Nut Premium"; imageUrl = "/assets/generated/makhana-premium.png" },
              { name = "Roasted Makhana"; imageUrl = "/assets/generated/makhana-roasted.png" },
              { name = "Makhana Powder"; imageUrl = "/assets/generated/makhana-powder.png" },
            ];
          },
        ),
      ].values(),
    );
    {
      old with
      productDetails
    };
  };
};
