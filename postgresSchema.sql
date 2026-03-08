
-- to drop the previous schema
-- drop schema public cascade;
-- create schema public;


CREATE TABLE userTable(
    userId uuid PRIMARY KEY,
    userName varchar(100) NOT NULL,
    phone char(10) NOT NULL,
    userPassword text NOT NULL,
    UNIQUE(userName,phone)
);

CREATE TABLE userAddress(
    addressId uuid PRIMARY KEY,
    userId uuid,
    addressString text NOT NULL,
    UNIQUE(userId,addressString),
    CONSTRAINT fk_userAddress_userTable FOREIGN KEY (addressId) REFERENCES userTable(userId)
);

CREATE TABLE product(
    productId uuid primary key,
    quantity INT,
    productName VARCHAR(200) NOT NULL,
    produtctDescription TEXT,
    price REAL NOT NULL,
    UNIQUE(productName)
);

CREATE TABLE productImage(
    imageId uuid PRIMARY KEY,
    productId uuid,
    imageS3Url text NOT NULL,
    CONSTRAINT fk_productImages_product FOREIGN KEY(productId) REFERENCES product(productId)
);

CREATE TABLE cart(
    cartId uuid PRIMARY KEY,
    userId uuid UNIQUE,
    totalPrice real NOT NULL,
    deliveryFee real,
    CONSTRAINT fk_cart_userTable FOREIGN KEY(userId) REFERENCES userTable(userId)
);

CREATE TABLE cartProduct(
    cartId  uuid ,
    productId uuid , 
    quantity int,
    PRIMARY KEY(cartId,productId),
    CONSTRAINT fk_cartProduct_cart FOREIGN KEY(cartId) REFERENCES cart(cartId) ,
    CONSTRAINT fk_cartProduct_product FOREIGN KEY(productId) REFERENCES product(productId)
);

CREATE TABLE deliveryPartner(
    deliveryPartnerId uuid PRIMARY KEY,
    deliveryPartnerName varchar(200) NOT NULL,
    phone char(10) NOT NULL,
    deliveryPartnerPassword text NOT NULL
);

CREATE TYPE order_status as ENUM('placed','packaged','shipped','readyfordelivery','deliveryPartnerAssigned','outfordelivery','delivered');


CREATE TABLE orderTable(
    orderId uuid PRIMARY KEY,
    userId uuid NOT NULL,
    deliveryFee real,
    totalAmount real NOT NULL,
    orderStatus order_status,
    CONSTRAINT fk_order_userTable FOREIGN KEY(userId) REFERENCES userTable(userId)
);

CREATE TABLE orderProducts(
    orderId uuid,
    productId uuid,
    quantity int NOT NULL,
    PRIMARY KEY(orderId,productId),
    CONSTRAINT fk_orderProducts_order FOREIGN KEY (orderId) REFERENCES orderTable(orderId),
    CONSTRAINT fk_orderProducts_product FOREIGN KEY (productId) REFERENCES product(productId) 
);

CREATE TABLE assignedOrder(
    assignedOrderId uuid PRIMARY KEY,
    deliveryPartnerId uuid,
    orderId uuid,
    UNIQUE(deliveryPartnerId,orderId),
    CONSTRAINT fk_assignedOrder_deliveryPartner FOREIGN KEY(deliveryPartnerId) REFERENCES deliveryPartner(deliveryPartnerId),
    CONSTRAINT fk_assignedOrder_order FOREIGN KEY(orderId) REFERENCES orderTable(orderId)
);

CREATE TABLE admin(
    adminId uuid PRIMARY KEY,
    adminName varchar(100) NOT NULL,
    phone char(10) NOT NULL,
    adminPassword text NOT NULL
);