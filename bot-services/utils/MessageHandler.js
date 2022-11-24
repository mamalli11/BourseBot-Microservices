const moment = require("jalali-moment");

const { addUnit } = require("./MathUtils");

const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مهرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const time = moment().locale("fa");

module.exports.startMessage = (pelan = "Bronze") => {
  let num = 0;
  const emoji = ["🥉", "🥈", "🥇"];
  switch (pelan) {
    case "Bronze":
      num = 0;
      pelan = "برنزی";
      break;
    case "Silver":
      num = 1;
      pelan = "نقره ای";
      break;
    case "Golden":
      num = 2;
      pelan = "طلایی";
      break;

    default:
      num = 0;
      pelan = "برنزی";
      break;
  }

  return `سلام
من ربات سهامجو هستم
اسم هر سهامی که دلت خواست رو هرزمانی میتونی برام بفرستی و من اطلاعاتشو بهت برگردونم

پنل فعلی شما ${pelan} ${emoji[num]}

لیست قابلیات های من 
/symbol_list
/groups_list
/comp_symbol
@IAUKhShBurse_bot`;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.symbolDetail = (data) => {
  return `
    📊 سهام : ${data.symbol}
    🛒 مارکت : ${data.market}

    حجم معاملات : ${addUnit(data.volume)}
    آخرین قیمت : ${numberWithCommas(data.price)}

    تغییر : ${Math.floor(data.change)}%  ${data.change > 0 ? "🟢" : "🔴"}
    درصد تغییر : ${data.percent.substring(3, 6)}%  ${data.percent > 0 ? "🟢" : "🔴"}

    ارزش : ${addUnit(data.value)}
    باز : ${numberWithCommas(data.openPrice)}
    بیشترین : ${numberWithCommas(data.highPrice)}
    کمترین : ${numberWithCommas(data.lowPrice)}
   
    تعداد تقاضا : ${numberWithCommas(data.askVolume)}
    قیمت تقاضا : ${numberWithCommas(data.askPrice)}
    
    قیمت عرضه : ${numberWithCommas(data.bidPrice)}
    تعداد عرضه : ${numberWithCommas(data.bidVolume)}

    استراتژی : ${data.strategy}

    حجم فروش حقیقی : ${addUnit(data.volumeSellerPerson)}
    حجم خرید حقیقی : ${addUnit(data.volumeBuyerPerson)}
    تعداد فروشنده حقیقی : ${data.sellerNumberPerson}
    تعداد خریدار حقیقی : ${data.buyerNumberPerson}


    📅 ${time.format("D")} ${months[time.format("M") - 1]}
    ⏱ ${time.format("HH:mm")}

    @IAUKhShBurse_bot`;
};

module.exports.groupDetail = (data, companie) => {
  const sherkat = `شرکت ها : \n${companie.map(
    (i) => `${i.index} : ${i.item} \n`
  )}`;
  const msg = `*هیچ شرکتی در این دسته ثبت نشده است*`;

  return `
🗂 دسته بندی : ${data.GroupName}
نام لاتین : ${addUnit(data.GroupNameEnglish)}

نام صنعت : ${data.IndustryName}
نام لاتین صنعت : ${data.IndustryNameEnglish}

${companie.length > 0 ? sherkat : msg}

📅 ${time.format("D")} ${months[time.format("M") - 1]}
⏱ ${time.format("HH:mm")}

@IAUKhShBurse_bot`;
};

module.exports.compSymbols = (symbol1, symbol2) => {
  function compGenerator(key, propertyTitle) {
    if (symbol1[key] > symbol2[key])
      return `${propertyTitle} ${symbol1.symbol} از ${symbol2.symbol} بیشتر است`;
    else
      return `${propertyTitle} ${symbol2.symbol} از ${symbol1.symbol} بیشتر است`;
  }

  return `
📊 سهام اول: ${symbol1.symbol}
📊 سهام دوم: ${symbol2.symbol}

مقایسه بین این دو سهم:
${compGenerator("volume", "حجم معاملات")}

${compGenerator("realBuyPercent", "درصد خرید حقیقی")}
${compGenerator("realSellPercent", "درصد فروش حقیقی")}

${compGenerator("enter/exit", "ورود و خروج پول حقیقی")}
${compGenerator("monthVolumeAvg", "حجم میانگین ماه")}

${compGenerator("buyS", "سرانه خرید")}
${compGenerator("sellS", "سرانه فروش")}
${compGenerator("power", "قدرت خریدار به فروشنده")}

${compGenerator("percent", "درصد معاملات")}
${compGenerator("finalPercent", "درصد پایانی")}

📅 ${time.format("D")} ${months[time.format("M") - 1]}
⏱ ${time.format("HH:mm")}

@IAUKhShBurse_bot`;
};
