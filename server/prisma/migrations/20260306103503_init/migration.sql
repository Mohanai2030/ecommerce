-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('placed', 'packaged', 'shipped', 'readyfordelivery', 'deliveryPartnerAssigned', 'outfordelivery', 'delivered');

-- CreateTable
CREATE TABLE "admin" (
    "adminid" UUID NOT NULL,
    "adminname" VARCHAR(100) NOT NULL,
    "phone" CHAR(10) NOT NULL,
    "adminpassword" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminid")
);

-- CreateTable
CREATE TABLE "assignedorder" (
    "assignedorderid" UUID NOT NULL,
    "deliverypartnerid" UUID,
    "orderid" UUID,

    CONSTRAINT "assignedorder_pkey" PRIMARY KEY ("assignedorderid")
);

-- CreateTable
CREATE TABLE "cart" (
    "cartid" UUID NOT NULL,
    "userid" UUID,
    "totalprice" REAL NOT NULL,
    "deliveryfee" REAL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cartid")
);

-- CreateTable
CREATE TABLE "cartproduct" (
    "cartid" UUID NOT NULL,
    "productid" UUID NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "cartproduct_pkey" PRIMARY KEY ("cartid","productid")
);

-- CreateTable
CREATE TABLE "deliverypartner" (
    "deliverypartnerid" UUID NOT NULL,
    "deliverypartnername" VARCHAR(200) NOT NULL,
    "phone" CHAR(10) NOT NULL,
    "deliverypartnerpassword" TEXT NOT NULL,

    CONSTRAINT "deliverypartner_pkey" PRIMARY KEY ("deliverypartnerid")
);

-- CreateTable
CREATE TABLE "orderproducts" (
    "orderid" UUID NOT NULL,
    "productid" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "orderproducts_pkey" PRIMARY KEY ("orderid","productid")
);

-- CreateTable
CREATE TABLE "ordertable" (
    "orderid" UUID NOT NULL,
    "userid" UUID,
    "deliveryfee" REAL,
    "totalamount" REAL NOT NULL,
    "orderstatus" "order_status",

    CONSTRAINT "ordertable_pkey" PRIMARY KEY ("orderid")
);

-- CreateTable
CREATE TABLE "product" (
    "productid" UUID NOT NULL,
    "quantity" INTEGER,
    "productname" VARCHAR(200) NOT NULL,
    "produtctdescription" TEXT,

    CONSTRAINT "product_pkey" PRIMARY KEY ("productid")
);

-- CreateTable
CREATE TABLE "productimage" (
    "imageid" UUID NOT NULL,
    "productid" UUID,
    "images3url" TEXT NOT NULL,

    CONSTRAINT "productimage_pkey" PRIMARY KEY ("imageid")
);

-- CreateTable
CREATE TABLE "useraddress" (
    "addressid" UUID NOT NULL,
    "userid" UUID,
    "addressstring" TEXT NOT NULL,

    CONSTRAINT "useraddress_pkey" PRIMARY KEY ("addressid")
);

-- CreateTable
CREATE TABLE "usertable" (
    "userid" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "phone" CHAR(10) NOT NULL,
    "userpassword" TEXT NOT NULL,

    CONSTRAINT "usertable_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignedorder_deliverypartnerid_orderid_key" ON "assignedorder"("deliverypartnerid", "orderid");

-- CreateIndex
CREATE UNIQUE INDEX "product_productname_key" ON "product"("productname");

-- CreateIndex
CREATE UNIQUE INDEX "useraddress_userid_addressstring_key" ON "useraddress"("userid", "addressstring");

-- CreateIndex
CREATE UNIQUE INDEX "usertable_username_phone_key" ON "usertable"("username", "phone");

-- AddForeignKey
ALTER TABLE "assignedorder" ADD CONSTRAINT "fk_assignedorder_deliverypartner" FOREIGN KEY ("deliverypartnerid") REFERENCES "deliverypartner"("deliverypartnerid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignedorder" ADD CONSTRAINT "fk_assignedorder_order" FOREIGN KEY ("orderid") REFERENCES "ordertable"("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_usertable" FOREIGN KEY ("userid") REFERENCES "usertable"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartproduct" ADD CONSTRAINT "fk_cartproduct_cart" FOREIGN KEY ("cartid") REFERENCES "cart"("cartid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartproduct" ADD CONSTRAINT "fk_cartproduct_product" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "fk_orderproducts_order" FOREIGN KEY ("orderid") REFERENCES "ordertable"("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "fk_orderproducts_product" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordertable" ADD CONSTRAINT "fk_order_usertable" FOREIGN KEY ("userid") REFERENCES "usertable"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productimage" ADD CONSTRAINT "fk_productimages_product" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useraddress" ADD CONSTRAINT "fk_useraddress_usertable" FOREIGN KEY ("addressid") REFERENCES "usertable"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;
