//TODO: Please write code in this file.

function printInventory(inputs) {
  var carItems = countCarItems(inputs);
  var carItemsAfterPromotion = updateCarItems(carItems, loadPromotions()[0].barcodes);
  var listItems = updateListItems(carItemsAfterPromotion, loadAllItems());
  var sum_save = countSumAndSave(listItems);

  printListInfo(listItems, sum_save);
}

function printListInfo(listItems, sum_save) {
  var info = "***<没钱赚商店>购物清单***\n";
  info += getItemsInfo(listItems);
  info += "----------------------\n";
  info += "挥泪赠送商品：\n";
  info += getPromotionInfo(listItems);
  info += "----------------------\n";
  info += getSumAndSaveInfo(sum_save);
  info += "**********************";
  console.log(info);
}

function getSumAndSaveInfo(sum_save) {
  var sumAndSaveInfoTemple = "总计：{0}(元)\n节省：{1}(元)\n";
  return sumAndSaveInfoTemple.format(formatDigitWithTwoPoints(sum_save.sum), formatDigitWithTwoPoints(sum_save.save));
}

function getPromotionInfo(listItems) {
  var info = "";
  var promotionInfoTemple = "名称：{0}，数量：{1}{2}\n";
  for (var i = 0; i < listItems.length; i++) {
    if (listItems[i].promotionAmount > 0) {
      info += promotionInfoTemple.format(listItems[i].name, listItems[i].promotionAmount, listItems[i].unit);
    }
  }
  return info;
}

function getItemsInfo(listItems) {
  var info = "";
  var itemInfoTemple = "名称：{0}，数量：{1}{2}，单价：{3}(元)，小计：{4}(元)\n";
  for (var i = 0; i < listItems.length; i++) {
    info += itemInfoTemple.format(listItems[i].name, listItems[i].amount, listItems[i].unit, formatDigitWithTwoPoints(listItems[i].price), formatDigitWithTwoPoints(listItems[i].totalPrice));
  }
  return info;
}

function countSumAndSave(listItems) {
  var result = {};
  var sum = 0;
  var save = 0;
  for (var i = 0; i < listItems.length; i++) {
    if (listItems[i].promotionAmount > 0) {
      save += listItems[i].price * listItems[i].promotionAmount;
    }
    sum += listItems[i].totalPrice;
  }
  result.sum = sum;
  result.save = save;
  return result;
}

function updateListItems(oldItems, allItems) {
  var result = oldItems;
  for (var i = 0; i < result.length; i++) {
    var pos = inArrayForKey(result[i].barcode, allItems);
    if (pos >= 0) {
      result[i].name = allItems[pos].name;
      result[i].unit = allItems[pos].unit;
      result[i].price = allItems[pos].price;
      result[i].totalPrice = result[i].price * result[i].actualAmount;
    }
  }
  return result;
}

function updateCarItems(oldItems, promotionItems) {
  var result = oldItems;
  for (var i = 0; i < result.length; i++) {
    if (inArray(result[i].barcode, promotionItems) >= 0) {
      result[i].promotionAmount = countPromotion(result[i].amount);
      result[i].actualAmount = result[i].amount - result[i].promotionAmount;
    } else {
      result[i].promotionAmount = 0;
      result[i].actualAmount = result[i].amount;
    }
  }
  return result;
}

function countPromotion(count) {
  return (count - count % 3) / 3;
}

function countCarItems(inputs) {
  var input;
  var carItems = [];
  for (var i = 0; i < inputs.length; i++) {
    input = analyzeInput(inputs[i]);
    var item = {};
    if (inArrayForKey(input.barcode, carItems) < 0) {
      item.barcode = input.barcode;
      item.amount = input.amount;
      carItems.push(item);
    } else {
      carItems[inArrayForKey(input.barcode, carItems)].amount += input.amount;
    }
  }
  return carItems;
}

function analyzeInput(input) {
  var result = {
    barcode: "barcode",
    amount: 1
  };
  if (input.indexOf("-") < 0) {
    result.barcode = input;
    result.amount = 1;
  } else {
    result.barcode = input.substring(0, input.length - 2);
    result.amount = input.charAt(input.length - 1);
  }
  return result;
}

function inArrayForKey(item, array) {
  for (var i = 0; i < array.length; i++) {
    if (item == array[i].barcode) {
      return i;
    }
  }
  return -1;
}

function inArray(item, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) {
      return i;
    }
  }
  return -1;
}

String.prototype.format = function() {
  var args = arguments;
  args['{'] = '{';
  args['}'] = '}';
  return this.replace(
    /{({|}|-?[0-9]+)}/g,
    function(item) {
      var result = args[item.substring(1, item.length - 1)];
      return typeof result == 'undefined' ? '' : result;
    }
  );
};

function formatDigitWithTwoPoints(number) {
  var num = new Number(number);
  return "" + num.toFixed(2);
}
