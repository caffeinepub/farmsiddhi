import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
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

  type OrderItem = {
    productId : Nat;
    productName : Text;
    variantName : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
    country : Text;
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
    shippingAddress : Address;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  type NewOrderInput = {
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    shippingAddress : Address;
    items : [OrderItem];
  };

  public type MandiPrice = {
    id : Nat;
    commodity : Text;
    variety : Text;
    market : Text;
    state : Text;
    category : Text;
    minPrice : Float;
    maxPrice : Float;
    modalPrice : Float;
    unit : Text;
    lastUpdated : Int;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let contactFormEntries = List.empty<ContactFormEntry>();
  let productDetails = Map.empty<Nat, ProductDetail>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let mandiPrices = List.empty<MandiPrice>();
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

  public shared ({ caller }) func submitContactForm(
    name : Text,
    email : Text,
    phoneNumber : Text,
    message : Text,
    userType : Text,
  ) : async () {
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

  public query func getAllMandiPrices() : async [MandiPrice] {
    mandiPrices.toArray();
  };

  public query func getMandiPricesByCommodity(commodity : Text) : async [MandiPrice] {
    mandiPrices.toArray().filter(
      func(price) {
        Text.compare(price.commodity, commodity) == #equal;
      }
    );
  };

  public query func getMandiPricesByState(state : Text) : async [MandiPrice] {
    mandiPrices.toArray().filter(
      func(price) {
        Text.compare(price.state, state) == #equal;
      }
    );
  };

  public query func getMandiPricesByCategory(category : Text) : async [MandiPrice] {
    mandiPrices.toArray().filter(
      func(price) {
        Text.compare(price.category, category) == #equal;
      }
    );
  };

  public query func getMandiPricesByMarket(market : Text) : async [MandiPrice] {
    mandiPrices.toArray().filter(
      func(price) {
        Text.compare(price.market, market) == #equal;
      }
    );
  };

  public shared ({ caller }) func seedMandiPrices() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed mandi prices");
    };

    mandiPrices.clear();

    let newPrices : [MandiPrice] = [
      // Rice Products
      {
        id = 0;
        commodity = "Rice";
        variety = "Basmati";
        market = "Delhi";
        state = "Delhi";
        category = "rice";
        minPrice = 35.0;
        maxPrice = 48.0;
        modalPrice = 42.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 1;
        commodity = "Rice";
        variety = "Sona Masoori";
        market = "Bangalore";
        state = "Karnataka";
        category = "rice";
        minPrice = 30.0;
        maxPrice = 42.0;
        modalPrice = 37.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 2;
        commodity = "Rice";
        variety = "Ponni";
        market = "Chennai";
        state = "Tamil Nadu";
        category = "rice";
        minPrice = 36.0;
        maxPrice = 47.0;
        modalPrice = 41.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // Wheat Products
      {
        id = 3;
        commodity = "Wheat";
        variety = "MP Sharbati";
        market = "Indore";
        state = "Madhya Pradesh";
        category = "wheat";
        minPrice = 40.0;
        maxPrice = 50.0;
        modalPrice = 44.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 4;
        commodity = "Wheat";
        variety = "Broken";
        market = "Delhi";
        state = "Delhi";
        category = "wheat";
        minPrice = 21.0;
        maxPrice = 26.0;
        modalPrice = 23.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 5;
        commodity = "Flour";
        variety = "Maida";
        market = "Mumbai";
        state = "Maharashtra";
        category = "wheat";
        minPrice = 24.0;
        maxPrice = 30.0;
        modalPrice = 27.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // Pulses
      {
        id = 6;
        commodity = "Dal";
        variety = "Chana Dal";
        market = "Kanpur";
        state = "Uttar Pradesh";
        category = "pulses";
        minPrice = 83.0;
        maxPrice = 93.0;
        modalPrice = 87.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 7;
        commodity = "Dal";
        variety = "Toor Dal";
        market = "Hyderabad";
        state = "Telangana";
        category = "pulses";
        minPrice = 111.0;
        maxPrice = 121.0;
        modalPrice = 115.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 8;
        commodity = "Dal";
        variety = "Masoor Dal";
        market = "Kolkata";
        state = "West Bengal";
        category = "pulses";
        minPrice = 109.0;
        maxPrice = 117.0;
        modalPrice = 113.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // Spices
      {
        id = 9;
        commodity = "Spices";
        variety = "Garam Masala";
        market = "Mumbai";
        state = "Maharashtra";
        category = "spices";
        minPrice = 234.0;
        maxPrice = 336.0;
        modalPrice = 283.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 10;
        commodity = "Spices";
        variety = "Cardamom";
        market = "Kochi";
        state = "Kerala";
        category = "spices";
        minPrice = 2210.0;
        maxPrice = 2555.0;
        modalPrice = 2370.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 11;
        commodity = "Spices";
        variety = "Cloves";
        market = "Chennai";
        state = "Tamil Nadu";
        category = "spices";
        minPrice = 1140.0;
        maxPrice = 1238.0;
        modalPrice = 1195.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 12;
        commodity = "Spices";
        variety = "Cinnamon";
        market = "Delhi";
        state = "Delhi";
        category = "spices";
        minPrice = 209.0;
        maxPrice = 264.0;
        modalPrice = 239.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // Processed Foods
      {
        id = 13;
        commodity = "Processed Food";
        variety = "Poha";
        market = "Mumbai";
        state = "Maharashtra";
        category = "processed-food-products";
        minPrice = 31.0;
        maxPrice = 48.0;
        modalPrice = 41.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 14;
        commodity = "Processed Food";
        variety = "Ragi Flour";
        market = "Kochi";
        state = "Kerala";
        category = "processed-food-products";
        minPrice = 67.0;
        maxPrice = 73.0;
        modalPrice = 71.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 15;
        commodity = "Processed Food";
        variety = "Oats";
        market = "Bangalore";
        state = "Karnataka";
        category = "processed-food-products";
        minPrice = 62.0;
        maxPrice = 79.0;
        modalPrice = 73.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // Makhana (Lotus Seeds)
      {
        id = 16;
        commodity = "Makhana";
        variety = "Makhana";
        market = "Patna";
        state = "Bihar";
        category = "makhana";
        minPrice = 420.0;
        maxPrice = 480.0;
        modalPrice = 445.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 17;
        commodity = "Makhana";
        variety = "Makhana";
        market = "Delhi";
        state = "Delhi";
        category = "makhana";
        minPrice = 435.0;
        maxPrice = 485.0;
        modalPrice = 458.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Rice products
      {
        id = 18;
        commodity = "Rice";
        variety = "Sella Basmati";
        market = "Kolkata";
        state = "West Bengal";
        category = "rice";
        minPrice = 42.0;
        maxPrice = 51.0;
        modalPrice = 46.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 19;
        commodity = "Rice";
        variety = "Brown Basmati";
        market = "Delhi";
        state = "Delhi";
        category = "rice";
        minPrice = 49.0;
        maxPrice = 55.0;
        modalPrice = 51.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Spices
      {
        id = 20;
        commodity = "Spices";
        variety = "Dry Mango Powder";
        market = "Indore";
        state = "Madhya Pradesh";
        category = "spices";
        minPrice = 249.0;
        maxPrice = 290.0;
        modalPrice = 277.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 21;
        commodity = "Spices";
        variety = "Turmeric Powder";
        market = "Bangalore";
        state = "Karnataka";
        category = "spices";
        minPrice = 187.0;
        maxPrice = 221.0;
        modalPrice = 210.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Wheat products
      {
        id = 22;
        commodity = "Wheat";
        variety = "Aashirvaad Select";
        market = "Delhi";
        state = "Delhi";
        category = "wheat";
        minPrice = 34.0;
        maxPrice = 41.0;
        modalPrice = 36.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 23;
        commodity = "Wheat";
        variety = "Suji";
        market = "Mumbai";
        state = "Maharashtra";
        category = "wheat";
        minPrice = 27.0;
        maxPrice = 37.0;
        modalPrice = 31.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Processed Foods
      {
        id = 24;
        commodity = "Processed Food";
        variety = "Chia Seeds";
        market = "Delhi";
        state = "Delhi";
        category = "processed-food-products";
        minPrice = 87.0;
        maxPrice = 131.0;
        modalPrice = 112.0;
        unit = "INR/250g";
        lastUpdated = 1717613000000;
      },
      // More Pulses (Dals)
      {
        id = 25;
        commodity = "Dal";
        variety = "Mixed Dal";
        market = "Delhi";
        state = "Delhi";
        category = "pulses";
        minPrice = 88.0;
        maxPrice = 101.0;
        modalPrice = 92.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      {
        id = 26;
        commodity = "Dal";
        variety = "Split Urad Dal";
        market = "Delhi";
        state = "Delhi";
        category = "pulses";
        minPrice = 130.0;
        maxPrice = 199.0;
        modalPrice = 181.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Makhana
      {
        id = 27;
        commodity = "Makhana";
        variety = "Makhana";
        market = "Mumbai";
        state = "Maharashtra";
        category = "makhana";
        minPrice = 399.0;
        maxPrice = 495.0;
        modalPrice = 457.0;
        unit = "INR/kg";
        lastUpdated = 1717613000000;
      },
      // More Processed Foods
      {
        id = 28;
        commodity = "Processed Food";
        variety = "Nachni Chips";
        market = "Kochi";
        state = "Kerala";
        category = "processed-food-products";
        minPrice = 76.0;
        maxPrice = 88.0;
        modalPrice = 84.0;
        unit = "INR/250g";
        lastUpdated = 1717613000000;
      },
      {
        id = 29;
        commodity = "Processed Food";
        variety = "Multigrain Chips";
        market = "Mumbai";
        state = "Maharashtra";
        category = "processed-food-products";
        minPrice = 81.0;
        maxPrice = 92.0;
        modalPrice = 88.0;
        unit = "INR/200g";
        lastUpdated = 1717613000000;
      },
    ];

    for (price in newPrices.values()) {
      mandiPrices.add(price);
    };
  };
};
