import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type ContactFormEntry = {
    name : Text;
    userType : Text;
    email : Text;
    phoneNumber : Text;
    message : Text;
  };

  public type Specification = {
    key : Text;
    value : Text;
  };

  public type NutritionData = {
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

  public type ProductVariant = {
    name : Text;
    imageUrl : Text;
  };

  public type ProductDetail = {
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

  public type OrderItem = {
    productId : Nat;
    productName : Text;
    variantName : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  public type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
    country : Text;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    orderId : Nat;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : Address;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  public type NewOrderInput = {
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : Address;
    items : [OrderItem];
  };

  let contactFormEntries = List.empty<ContactFormEntry>();
  let productDetails = Map.empty<Nat, ProductDetail>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Nat, Order>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact form entries");
    };
    if (index >= contactFormEntries.size()) {
      Runtime.trap("Index out of bounds.");
    };
    contactFormEntries.at(index);
  };

  public query ({ caller }) func getAllContactForms() : async [ContactFormEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all contact forms");
    };
    contactFormEntries.toArray();
  };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add product details");
    };

    let newProductId = productDetails.size();
    let newProduct : ProductDetail = {
      productId = newProductId;
      productName;
      category;
      description;
      specifications;
      price;
      nutritionData;
      imageUrl;
      variants;
    };

    productDetails.add(newProductId, newProduct);
    newProductId;
  };

  public query func getProductDetail(productId : Nat) : async ?ProductDetail {
    productDetails.get(productId);
  };

  public query func getAllProductDetails() : async [ProductDetail] {
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

  public query ({ caller }) func getProductByCategory(category : Text) : async ?ProductDetail {
    switch (category) {
      case ("rice") { productDetails.get(0) };
      case ("wheat") { productDetails.get(1) };
      case ("pulses") { productDetails.get(2) };
      case ("spices") { productDetails.get(3) };
      case ("processed-food-products") { productDetails.get(4) };
      case ("makhana") { productDetails.get(5) };
      case (_) { null };
    };
  };

  public shared ({ caller }) func placeOrder(input : NewOrderInput) : async Order {
    let totalAmount = input.items.foldLeft(
      0,
      func(sum, item) {
        sum + (item.quantity * item.unitPrice);
      },
    );

    let newOrderId = orders.size();
    let newOrder : Order = {
      orderId = newOrderId;
      buyerName = input.buyerName;
      buyerEmail = input.buyerEmail;
      buyerPhone = input.buyerPhone;
      shippingAddress = input.shippingAddress;
      items = input.items;
      totalAmount;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(newOrderId, newOrder);
    newOrder;
  };

  public query ({ caller }) func getOrderById(orderId : Nat) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        false;
      };
      case (?existingOrder) {
        let updatedOrder = { existingOrder with status };
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };
};
