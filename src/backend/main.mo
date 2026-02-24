import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

actor {
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

  let contactFormEntries = List.empty<ContactFormEntry>();
  let productDetails = Map.empty<Nat, ProductDetail>();
  var nextProductId = 0;

  // Contact Form Functions

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phoneNumber : Text, message : Text, userType : Text) : async () {
    let newEntry : ContactFormEntry = {
      name;
      email;
      phoneNumber;
      message;
      userType;
    };

    contactFormEntries.add(newEntry);
  };

  public query ({ caller }) func getFormEntry(index : Nat) : async ContactFormEntry {
    if (index >= contactFormEntries.size()) {
      Runtime.trap("Index out of bounds.");
    };
    contactFormEntries.at(index);
  };

  public query ({ caller }) func getAllContactForms() : async [ContactFormEntry] {
    contactFormEntries.toArray();
  };

  // Product Detail Functions

  public shared ({ caller }) func addProductDetail(
    productName : Text,
    category : Text,
    description : Text,
    specifications : [Specification],
    price : Nat,
    nutritionData : NutritionData,
    imageUrl : Text,
    variants : [ProductVariant],
  ) : async Nat {
    let productId = nextProductId;
    let newProduct : ProductDetail = {
      productId;
      productName;
      category;
      description;
      specifications;
      price;
      nutritionData;
      imageUrl;
      variants;
    };

    productDetails.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  public query ({ caller }) func getProductDetail(productId : Nat) : async ?ProductDetail {
    productDetails.get(productId);
  };

  public query ({ caller }) func getAllProductDetails() : async [ProductDetail] {
    productDetails.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [ProductDetail] {
    let iter = productDetails.values();
    let filtered = iter.filter(
      func(product) {
        product.category == category;
      }
    );
    filtered.toArray();
  };
};
