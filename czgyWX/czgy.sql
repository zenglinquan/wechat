/*
Navicat MySQL Data Transfer

Source Server         : Blong
Source Server Version : 50633
Source Host           : localhost:3306
Source Database       : czgy

Target Server Type    : MYSQL
Target Server Version : 50633
File Encoding         : 65001

Date: 2017-08-01 20:41:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for authority
-- ----------------------------
DROP TABLE IF EXISTS `authority`;
CREATE TABLE `authority` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `authority_name` varchar(10) DEFAULT NULL,
  `authority_url` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of authority
-- ----------------------------
INSERT INTO `authority` VALUES ('1', '管理库存', '/admin/inventory/**');
INSERT INTO `authority` VALUES ('2', '管理出库', '/admin/removalInventory/**');
INSERT INTO `authority` VALUES ('3', '管理订单', '/admin/orderGoods/**');
INSERT INTO `authority` VALUES ('4', '管理销量', '/admin/saleVolume/**');
INSERT INTO `authority` VALUES ('5', '管理用户', '/admin/user/**');
INSERT INTO `authority` VALUES ('6', '商城管理', '/admin/storeProduct/**');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_guid` varchar(40) NOT NULL,
  `category_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`category_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('0B9DAE3A610244C39144E97335E31FB2', '办公');
INSERT INTO `category` VALUES ('1', '玩具');
INSERT INTO `category` VALUES ('2', '化妆品');
INSERT INTO `category` VALUES ('235A33F93B99427990AC78A020E561DA', '文具');
INSERT INTO `category` VALUES ('3', '手工艺');
INSERT INTO `category` VALUES ('4', '厨具');

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `guid` varchar(40) NOT NULL DEFAULT '',
  `product_version` varchar(20) NOT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `material_color` varchar(10000) DEFAULT NULL,
  `quantity` int(20) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `category` varchar(40) DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`guid`,`product_version`),
  KEY `fk_inventory_category` (`category`),
  KEY `fk_inventory_user` (`user_id`),
  CONSTRAINT `fk_inventory_category` FOREIGN KEY (`category`) REFERENCES `category` (`category_guid`),
  CONSTRAINT `fk_inventory_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of inventory
-- ----------------------------
INSERT INTO `inventory` VALUES ('4D1EC8DBCB864AA6847ABFCEEDF63C3A', '4', 'st', '[{\"id\":\"113B00C146A34FAF83989F160E5CBCC4\",\"color\":\"红色\",\"number\":2}]', '2', '', '2017-07-12 20:33:28', '2', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('5202AFC4015C49F28D8AA7F321BF36BA', 'tu', '兔子', '[{\"id\":\"3D143ED3F6614D2D809910C617179CEF\",\"color\":\"金色\",\"number\":659},{\"id\":\"482A63E5F7264D968A6080E93DD5E955\",\"color\":\"橘色\",\"number\":330}]', '989', '5558', '2017-07-11 14:27:27', '1', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('68AA9BDC7BCA46589E5C06EF059DB268', 'tsh0001', '头饰', '[{\"id\":\"482A63E5F7264D968A6080E93DD5E955\",\"color\":\"橘色\",\"number\":800},{\"id\":\"92EF31475FCC4F488D330B02B9E48AE0\",\"color\":\"银色\",\"number\":2780},{\"id\":\"CF28AFEED2A540CE87A3782C35A3CCEB\",\"color\":\"粉色\",\"number\":80},{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":500}]', '4160', '8764', '2017-07-25 15:42:02', '1', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('BA0753021B8540139391D07EF4A7420F', 'tl0001', '陀螺1', '[{\"id\":\"46764FC354084AA0A51E673D679398B0\",\"color\":\"蓝色\",\"number\":1000},{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":200},{\"id\":\"3D143ED3F6614D2D809910C617179CEF\",\"color\":\"金色\",\"number\":\"200\"},{\"id\":\"B833C4859BD34DB38EACE32AED936E5B\",\"color\":\"灰色\",\"number\":400},{\"id\":\"5922A04BB29A4180BC20D1AE9A298C6D\",\"color\":\"黑色\",\"number\":500}]', '2300', '', '2017-07-11 14:05:50', '1', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('D6BB0D25CC8342F79194FF74B361801E', '2', '1', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":1}]', '1', '', '2017-07-25 15:45:27', '0B9DAE3A610244C39144E97335E31FB2', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('E338BFCDBEC64AB294739B7404F19238', '1', '1', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":\"1\"}]', '1', '11', '2017-07-25 19:27:06', '0B9DAE3A610244C39144E97335E31FB2', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `inventory` VALUES ('E472C80CAF8C42E9999F96F5A8ABC252', 'bds', '指尖陀螺', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":\"10\"}]', '10', '', '2017-07-12 21:44:22', '1', '783CDC8DA1D04E89B37C0AE0EA099908');

-- ----------------------------
-- Table structure for material_color_info
-- ----------------------------
DROP TABLE IF EXISTS `material_color_info`;
CREATE TABLE `material_color_info` (
  `id` varchar(40) NOT NULL,
  `material_color_name` varchar(40) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of material_color_info
-- ----------------------------
INSERT INTO `material_color_info` VALUES ('09BBA90BBAA441F1A1C1EBF53097E1D2', '绿色', null);
INSERT INTO `material_color_info` VALUES ('113B00C146A34FAF83989F160E5CBCC4', '红色', null);
INSERT INTO `material_color_info` VALUES ('46764FC354084AA0A51E673D679398B0', '蓝色', null);
INSERT INTO `material_color_info` VALUES ('482A63E5F7264D968A6080E93DD5E955', '橘色', null);
INSERT INTO `material_color_info` VALUES ('545FA7AC0D194BC285CA982C1AD93A79', '银色', null);
INSERT INTO `material_color_info` VALUES ('5922A04BB29A4180BC20D1AE9A298C6D', '黑色', null);
INSERT INTO `material_color_info` VALUES ('87727254D00F431DA98961B553850566', '花色', null);
INSERT INTO `material_color_info` VALUES ('92EF31475FCC4F488D330B02B9E48AE0', '银色', null);
INSERT INTO `material_color_info` VALUES ('94EECD7DCB2041B5AC059B95C36A4668', '天空蓝', null);
INSERT INTO `material_color_info` VALUES ('A3F0529D40E441C48E6CE7864CCBDF66', '橙色', null);
INSERT INTO `material_color_info` VALUES ('B833C4859BD34DB38EACE32AED936E5B', '灰色', null);
INSERT INTO `material_color_info` VALUES ('B8E38E7FB83A4311A6CC20AFD9FA96F1', '蓝红色', null);
INSERT INTO `material_color_info` VALUES ('CD25F54EC5894862B5B0A3CE500B52E0', '白色', null);
INSERT INTO `material_color_info` VALUES ('CF28AFEED2A540CE87A3782C35A3CCEB', '粉色', null);
INSERT INTO `material_color_info` VALUES ('F94CA92CFCF242DB9F0C868CE4801371', '银色', null);

-- ----------------------------
-- Table structure for order_goods
-- ----------------------------
DROP TABLE IF EXISTS `order_goods`;
CREATE TABLE `order_goods` (
  `guid` varchar(40) NOT NULL,
  `product_version` varchar(20) DEFAULT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `material_color` varchar(10000) DEFAULT NULL,
  `quantity` int(20) DEFAULT '0',
  `price` double(10,2) DEFAULT NULL,
  `total` double(10,2) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `contact_person` varchar(20) DEFAULT NULL,
  `organization` varchar(20) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `billing_information` varchar(255) DEFAULT NULL,
  `supply_date` datetime DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `category` varchar(40) DEFAULT NULL,
  `is_paid` int(4) DEFAULT '0',
  `is_send` int(4) DEFAULT '0',
  `is_receiving` int(4) DEFAULT '0',
  `order_type` int(4) DEFAULT '0' COMMENT '3是普通订单，6是商城订单',
  `user_id` varchar(40) DEFAULT NULL,
  `wx_user_id` varchar(40) DEFAULT NULL,
  `courier_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_order_user` (`user_id`),
  KEY `fk_order_wx_user` (`wx_user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`guid`),
  CONSTRAINT `fk_order_wx_user` FOREIGN KEY (`wx_user_id`) REFERENCES `store_wx_user` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order_goods
-- ----------------------------
INSERT INTO `order_goods` VALUES ('63BC11B01E31426B84F0D1F6B1D1D60F', 'tl0001', '陀螺仪', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":500},{\"id\":\"46764FC354084AA0A51E673D679398B0\",\"color\":\"蓝色\",\"number\":\"500\"},{\"id\":\"5922A04BB29A4180BC20D1AE9A298C6D\",\"color\":\"黑色\",\"number\":800},{\"id\":\"B833C4859BD34DB38EACE32AED936E5B\",\"color\":\"灰色\",\"number\":100}]', '1900', '3.50', '6650.00', '', '郝庄', '金华艺术中心', '浙江省金华市八一南路186号', '1378787878', '金华艺术中心', '2017-09-11 18:05:20', '2017-07-26 16:09:50', '1', null, null, '0', null, '783CDC8DA1D04E89B37C0AE0EA099908', null, null);
INSERT INTO `order_goods` VALUES ('D40DD960C0D04F1C8C341008C0EF4FE1', 'tl0001', '陀螺仪', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":500},{\"id\":\"46764FC354084AA0A51E673D679398B0\",\"color\":\"蓝色\",\"number\":\"500\"},{\"id\":\"5922A04BB29A4180BC20D1AE9A298C6D\",\"color\":\"黑色\",\"number\":800}]', '1800', '3.50', '6300.00', '', '郝庄', '金华艺术中心', '浙江省金华市八一南路186号', '1378787878', '金华艺术中心', '2017-01-18 17:20:41', '2017-07-11 21:54:29', '3', null, null, '0', null, '783CDC8DA1D04E89B37C0AE0EA099908', null, null);
INSERT INTO `order_goods` VALUES ('F78667FA4B22491B84293EBAF9BC0122', 'tl0001', '陀螺仪', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":500},{\"id\":\"46764FC354084AA0A51E673D679398B0\",\"color\":\"蓝色\",\"number\":\"500\"},{\"id\":\"5922A04BB29A4180BC20D1AE9A298C6D\",\"color\":\"黑色\",\"number\":800}]', '1800', '3.50', '6300.00', '', '郝庄', '金华艺术中心', '浙江省金华市八一南路186号', '1378787878', '金华艺术中心', '2017-11-11 00:00:00', '2017-07-11 21:54:57', '1', null, null, '0', null, '783CDC8DA1D04E89B37C0AE0EA099908', null, null);

-- ----------------------------
-- Table structure for removal_inventory
-- ----------------------------
DROP TABLE IF EXISTS `removal_inventory`;
CREATE TABLE `removal_inventory` (
  `guid` varchar(40) NOT NULL,
  `product_version` varchar(20) DEFAULT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `material_color` varchar(10000) DEFAULT NULL,
  `quantity` int(20) DEFAULT NULL,
  `price` double(10,2) DEFAULT NULL,
  `total` double(10,2) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `category` varchar(40) DEFAULT NULL,
  `contact_person` varchar(20) DEFAULT NULL,
  `organization` varchar(20) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_removal_user` (`user_id`),
  CONSTRAINT `fk_removal_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of removal_inventory
-- ----------------------------
INSERT INTO `removal_inventory` VALUES ('448D9F45C9D74F429C5E96A3724D11A9', 'tsh0001', '饰品', '[{\"id\":\"CF28AFEED2A540CE87A3782C35A3CCEB\",\"color\":\"粉色\",\"number\":220},{\"id\":\"92EF31475FCC4F488D330B02B9E48AE0\",\"color\":\"银色\",\"number\":220},{\"id\":\"482A63E5F7264D968A6080E93DD5E955\",\"color\":\"橘色\",\"number\":\"200\"}]', '640', '1.50', '960.00', '', '2', '李华山', '上海大埔公司', '上海市闵行区浦江镇大西路123号', '13811223344', '2017-07-25 22:22:45', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `removal_inventory` VALUES ('AD9F59ACEAE74576941A02B522896C31', '2', '1', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":\"1\"}]', '1', '1.00', '1.00', '1', '0B9DAE3A610244C39144E97335E31FB2', '1', '1', '1', '11', '2017-07-26 16:05:00', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `removal_inventory` VALUES ('F5E21F38A739411CBB59BC5CF20D0F23', '1sdf', '1', '[{\"id\":\"09BBA90BBAA441F1A1C1EBF53097E1D2\",\"color\":\"绿色\",\"number\":\"1\"}]', '1', '1.00', '1.00', '', '0B9DAE3A610244C39144E97335E31FB2', '1', '1', '1', '1', '2017-07-26 16:01:47', '70304B307FC84AD9809858E4C0D7F2DF');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_guid` varchar(40) NOT NULL,
  `role_name` varchar(10) DEFAULT NULL,
  `authority_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`role_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('administrator', '管理员', '1,2,3,4,5,6,');
INSERT INTO `role` VALUES ('inventory', '库管', '1,');
INSERT INTO `role` VALUES ('saler', '销售', '4,');

-- ----------------------------
-- Table structure for sales_volume
-- ----------------------------
DROP TABLE IF EXISTS `sales_volume`;
CREATE TABLE `sales_volume` (
  `guid` varchar(40) NOT NULL,
  `product_version` varchar(20) DEFAULT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `material_color` varchar(10000) DEFAULT NULL,
  `quantity` int(20) DEFAULT NULL,
  `price` double(10,2) DEFAULT NULL,
  `total` double(10,2) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `category` varchar(40) DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_sales_user` (`user_id`),
  CONSTRAINT `fk_sales_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sales_volume
-- ----------------------------
INSERT INTO `sales_volume` VALUES ('asdf', 'tl0001', '我的', '[{\"id\":\"A3F0529D40E441C48E6CE7864CCBDF66\",\"color\":\"橙色\",\"number\":\"886\"},{\"id\":\"B8E38E7FB83A4311A6CC20AFD9FA96F1\",\"color\":\"蓝红色\",\"number\":3544},{\"id\":\"CF28AFEED2A540CE87A3782C35A3CCEB\",\"color\":\"粉色\",\"number\":6152}]', '10582', '1289.00', '13640198.00', '88', '2017-07-11 14:32:53', '2', '783CDC8DA1D04E89B37C0AE0EA099908');
INSERT INTO `sales_volume` VALUES ('sdfsafs', '4', '1', '[{\"id\":\"tip\",\"color\":\"请选择颜色\",\"number\":\"1\"}]', '1', '1.00', '1.00', '1', '2017-07-26 00:25:55', '1', '783CDC8DA1D04E89B37C0AE0EA099908');

-- ----------------------------
-- Table structure for store_cart
-- ----------------------------
DROP TABLE IF EXISTS `store_cart`;
CREATE TABLE `store_cart` (
  `guid` varchar(40) NOT NULL,
  `material_color` varchar(1000) DEFAULT NULL,
  `product_id` varchar(40) DEFAULT NULL,
  `wx_user_id` varchar(40) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `is_click_pay` int(4) DEFAULT '0',
  PRIMARY KEY (`guid`),
  KEY `fk_cart_product` (`product_id`),
  KEY `fk_cart_wx_user` (`wx_user_id`),
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`guid`),
  CONSTRAINT `fk_cart_wx_user` FOREIGN KEY (`wx_user_id`) REFERENCES `store_wx_user` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_cart
-- ----------------------------
INSERT INTO `store_cart` VALUES ('F7CBCAE0A56B4A16910E7F23D57B03D5', '[{\"id\":\"113B00C146A34FAF83989F160E5CBCC4\",\"color\":\"红色\",\"number\":110}]', 'CF1F061C4B8D4B448EB27E3A98474A09', 'test', '2017-07-29 10:48:09', '0');
INSERT INTO `store_cart` VALUES ('test1', '[{\"id\":\"113B00C146A34FAF83989F160E5CBCC4\",\"color\":\"红色\",\"number\":110}]', 'CF1F061C4B8D4B448EB27E3A98474A09', 'test', '2017-07-31 16:35:22', '0');

-- ----------------------------
-- Table structure for store_delivery_address
-- ----------------------------
DROP TABLE IF EXISTS `store_delivery_address`;
CREATE TABLE `store_delivery_address` (
  `guid` varchar(40) NOT NULL,
  `consignee` varchar(10) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `address_info` varchar(60) DEFAULT NULL,
  `wx_user_id` varchar(40) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_address_wx_user` (`wx_user_id`),
  CONSTRAINT `fk_address_wx_user` FOREIGN KEY (`wx_user_id`) REFERENCES `store_wx_user` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_delivery_address
-- ----------------------------
INSERT INTO `store_delivery_address` VALUES ('test1', 'test4', 'test4', 'test4', 'test4', 'test', '2017-07-29 10:45:20');

-- ----------------------------
-- Table structure for store_favorite
-- ----------------------------
DROP TABLE IF EXISTS `store_favorite`;
CREATE TABLE `store_favorite` (
  `guid` varchar(40) NOT NULL,
  `product_id` varchar(40) DEFAULT NULL,
  `wx_user_id` varchar(40) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_favorite_wx_user` (`wx_user_id`),
  KEY `fk_favorite_product` (`product_id`),
  CONSTRAINT `fk_favorite_product` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`guid`),
  CONSTRAINT `fk_favorite_wx_user` FOREIGN KEY (`wx_user_id`) REFERENCES `store_wx_user` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_favorite
-- ----------------------------
INSERT INTO `store_favorite` VALUES ('test1', 'CF1F061C4B8D4B448EB27E3A98474A09', 'test', '2017-07-29 11:08:25');

-- ----------------------------
-- Table structure for store_product
-- ----------------------------
DROP TABLE IF EXISTS `store_product`;
CREATE TABLE `store_product` (
  `guid` varchar(40) NOT NULL,
  `product_version` varchar(40) DEFAULT NULL,
  `pic1` varchar(100) DEFAULT NULL,
  `pic2` varchar(100) DEFAULT NULL,
  `pic3` varchar(100) DEFAULT NULL,
  `pic4` varchar(100) DEFAULT NULL,
  `pic5` varchar(100) DEFAULT NULL,
  `pic6` varchar(100) DEFAULT NULL,
  `pic7` varchar(100) DEFAULT NULL,
  `pic8` varchar(100) DEFAULT NULL,
  `pic9` varchar(100) DEFAULT NULL,
  `price` double(10,2) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  KEY `fk_product_inventory` (`product_version`),
  KEY `fk_product_user` (`user_id`),
  CONSTRAINT `fk_product_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_product
-- ----------------------------
INSERT INTO `store_product` VALUES ('CF1F061C4B8D4B448EB27E3A98474A09', 'tl0001', 'productImage/CF1F061C4B8D4B448EB27E3A98474A09/pic0.png', null, null, null, null, null, null, null, null, '1.00', '2017-07-26 12:43:50', '5215F269C44D484D9F278C6AF4F85631');
INSERT INTO `store_product` VALUES ('E504C3185ECB49048D3C667F9A801D15', '4', 'productImage/E504C3185ECB49048D3C667F9A801D15/pic0.png', 'productImage/E504C3185ECB49048D3C667F9A801D15/pic1.png', null, null, null, null, null, null, null, '222.00', '2017-07-26 16:18:15', '783CDC8DA1D04E89B37C0AE0EA099908');

-- ----------------------------
-- Table structure for store_wx_user
-- ----------------------------
DROP TABLE IF EXISTS `store_wx_user`;
CREATE TABLE `store_wx_user` (
  `open_id` varchar(40) NOT NULL,
  `session_key` varchar(30) DEFAULT NULL,
  `gender` int(4) DEFAULT NULL,
  `province` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `avatar_url` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_wx_user
-- ----------------------------
INSERT INTO `store_wx_user` VALUES ('A12ECE8C100048EC934018A0C3D591BE', 'test', '1', 'test', 'test', 'test', '2017-07-28 21:34:13', null);
INSERT INTO `store_wx_user` VALUES ('test', 'test', '1', 'test', 'test', 'test', '2017-07-29 09:27:56', null);
INSERT INTO `store_wx_user` VALUES ('test1', 'test2', '1', 'test2', 'test2', 'test2', '2017-07-29 10:26:26', 'test2');
INSERT INTO `store_wx_user` VALUES ('test4', 'test', '1', 'test', 'test', 'test', '2017-07-29 10:33:35', 'test');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `guid` varchar(40) NOT NULL,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `role_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`guid`,`user_name`),
  KEY `fk_authority_role_id` (`role_id`),
  CONSTRAINT `fk_authority_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('5215F269C44D484D9F278C6AF4F85631', '来咯', '111', '2017-07-23 11:47:49', 'administrator');
INSERT INTO `user` VALUES ('569153879EC041F387989209E36A4D88', '老板', '1234', '2017-07-11 10:27:40', 'administrator');
INSERT INTO `user` VALUES ('61A53D1F110E4ED087257DF5F0955EDF', '张老师', '1234', '2017-07-27 13:40:41', 'administrator');
INSERT INTO `user` VALUES ('70304B307FC84AD9809858E4C0D7F2DF', '刘总', '123456', '2017-07-12 21:35:10', 'administrator');
INSERT INTO `user` VALUES ('783CDC8DA1D04E89B37C0AE0EA099908', '1', '1', '2017-07-24 11:23:13', 'administrator');
INSERT INTO `user` VALUES ('A837B04715ED4344A8AA8BD8223412C2', '韩国红', '123', '2017-07-14 15:27:33', 'administrator');
INSERT INTO `user` VALUES ('D399344742FE4260A0FD0B2C88F54FF5', '胡老师', '1234', '2017-07-27 13:40:03', 'administrator');
INSERT INTO `user` VALUES ('D4A616EAA2694D2784DD988C9E0215F1', '1111', '1', '2017-07-26 01:25:53', 'administrator');
SET FOREIGN_KEY_CHECKS=1;
