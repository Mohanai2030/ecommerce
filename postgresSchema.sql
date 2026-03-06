CREATE TABLE user(
    userId uuid PRIMARY KEY,
    userName varchar(100) NOT NULL,
    phone char(10) NOT NULL,
    userPassword text NOT NULL,
    UNIQUE(userName,phone),
);

CREATE TABLE userAddress(
    addressId uuid PRIMARY KEY,
    userId uuid,
    addressString text NOT NULL,
    UNIQUE(userId,addressString),
    CONSTRAINT fk_userAddress_user FOREIGN KEY (addressId) REFERENCES user(userId)
);

CREATE TABLE product(
    productId uuid primary key,
    quantity INT,
    productName VARCHAR(200) NOT NULL,
    produtctDescription TEXT,
);

CREATE TABLE productImage(
    imageId uuid PRIMARY KEY,
    productId uuid,
    imageS3Url text NOT NULL,
    CONSTRAINT fk_productImages_product FOREIGN KEY(productId) REFERENCES product(productId)
);

CREATE TABLE cart(
    cartId uuid PRIMARY KEY,
    userId uuid,
    totalPrice real NOT NULL,
    deliveryFee real,
    CONSTARINT fk_cart_user FOREIGN KEY(userId) REFERENCES user(userId)
);

CREATE TABLE cartProduct(
    cartId  uuid ,
    productId uuid , 
    quantity int,
    CONSTRAINT fk_cartProduct_cart FOREIGN KEY(cartId) REFERENCES user(userId) ,
    CONSTRAINT fk_cartProduct_product FOREIGN KEY(productId) REFERENCES user(userId),
);

CREATE TABLE deliveryPartner(
    deliveryPartnerId uuid PRIMARY KEY,
    deliveryPartnerName varchar(200) NOT NULL,
    phone char(10) NOT NULL,
    deliveryPartnerPassword text NOT NULL,
);

CREATE TYPE order_status as ENUM('placed','packaged','shipped','readyfordelivery','deliveryPartnerAssigned','outfordelivery','delivered');


CREATE TABLE order(
    orderId uuid PRIMARY KEY,
    userId uuid,
    deliveryFee real,
    totalAmount real NOT NULL,
    orderStatus order_status,
    CONSTRAINT fk_order_user FOREIGN KEY(userId) REFERENCES user(userId),
);

CREATE TABLE orderProducts(
    orderId uuid,
    productId uuid,
    quantity int NOT NULL,
    UNIQUE(orderId,productId),
    CONSTRAINT fk_orderProducts_order FOREIGN KEY (orderId) REFERENCES order(orderId),
    CONSTRAINT fk_orderProducts_product FOREIGN KEY (productId) REFERENCES product(productId) 
);

CREATE TABLE assignedOrder(
    assignedOrderId PRIMARY KEY,
    deliveryPartnerId uuid,
    orderId uuid,
    UNIQUE(deliveryPartnerId,orderId),
    CONSTRAINT fk_assignedOrder_deliveryPartner FOREIGN KEY(deliveryPartnerId) REFERENCES deliveryPartner(deliveryPartnerId),
    CONSTRAINT fk_assignedOrder_order FOREIGN KEY(orderId) REFERENCES order(orderId),
);

CREATE TABLE admin(
    adminId uuid PRIMARY KEY,
    adminName varchar(100) NOT NULL,
    phone char(10) NOT NULL,
    adminPassword text NOT NULL,
);