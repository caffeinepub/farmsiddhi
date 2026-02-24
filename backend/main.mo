import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
    email : Text;
  };

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

  type OrderItem = {
    productId : Nat;
    productName : Text;
    variantName : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type Order = {
    orderId : Nat;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : Text;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  type NewOrderInput = {
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : Text;
    items : [OrderItem];
  };

  let contactFormEntries = List.empty<ContactFormEntry>();
  let productDetails = Map.empty<Nat, ProductDetail>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Nat, Order>();

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
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

  // Product Functions
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
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
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

  // Order Management
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
