
CREATE TABLE "cart" (
	"id_cart" integer NOT NULL,
	"timestamp" varchar(50) NOT NULL,
	PRIMARY KEY ("id_cart")
);

CREATE TABLE "cart_detail" (
	"id_cart_detail" integer NOT NULL,
	"fk_product" integer NOT NULL,
	"fk_cart" integer NOT NULL,
	"qty" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total_price" integer NOT NULL,
	PRIMARY KEY (id_cart_detail)
  foreign key("fk_product") references "product"("id_product") on delete cascade on update cascade
  foreign key("fk_cart") references "product"("id_cart") on delete cascade on update cascade
);

CREATE TABLE "product" (
	"id_product" integer NOT NULL,
	"timestamp" varchar(255) DEFAULT 'NULL',
	"title" varchar(255) DEFAULT 'NULL',
	"description" varchar(255) DEFAULT 'NULL',
	"code" varchar(255) DEFAULT 'NULL',
	"thumbnail" varchar(255) DEFAULT 'NULL',
	"price" integer DEFAULT NULL,
	"stock" integer DEFAULT NULL,
	PRIMARY KEY (id_product)
);