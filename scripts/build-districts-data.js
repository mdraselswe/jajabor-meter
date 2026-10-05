const fs = require('fs');
const path = require('path');
const https = require('https');

const GEOJSON_URL = 'https://raw.githubusercontent.com/ahnaf-tahmid-chowdhury/Choropleth-Bangladesh/master/bangladesh_geojson_adm2_64_districts_zillas.json';

const BN_DATA = {
  "Bagerhat": { id: "bagerhat", bn: "বাগেরহাট", divBn: "খুলনা", divEn: "Khulna", food: "বাগদা চিংড়ি ও নারকেল", fact: "ষাট গম্বুজ মসজিদে সেলফি তুলে হিস্ট্রি লাভার সাজা" },
  "Bandarban": { id: "bandarban", bn: "বান্দরবান", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "বাঁশ কোড়ল ও জুমের ফল", fact: "বগালেকে ওঠার পর 'আর জীবনেও পাহাড়ে উঠুম না' বলে শপথ নেওয়া" },
  "Barguna": { id: "barguna", bn: "বরগুনা", divBn: "বরিশাল", divEn: "Barishal", food: "চৈতা শুঁটকি ও নারিকেলের ক্ষীর", fact: "হরিণঘাটার বনে হরিণের বদলে বানর দেখে ফিরে আসা" },
  "Barisal": { id: "barisal", bn: "বরিশাল", divBn: "বরিশাল", divEn: "Barishal", food: "ইলিশ ও গুঠিয়ার সন্দেশ", fact: "লঞ্চের কেবিনের ছাদে শুয়ে নদীর বাতাস উপভোগ করা" },
  "Bhola": { id: "bhola", bn: "ভোলা", divBn: "বরিশাল", divEn: "Barishal", food: "মহিষের দুধের টক দই", fact: "দ্বীপ জেলায় গিয়ে নিজেকে দ্বীপের জমিদার মনে করা" },
  "Bogra": { id: "bogra", bn: "বগুড়া", divBn: "রাজশাহী", divEn: "Rajshahi", food: "ঐতিহ্যবাহী বগুড়ার দই", fact: "মাটির হাঁড়ির দই মুখে দিয়েই নিজেকে ফুড ভ্লগার ভাবা" },
  "Brahmanbaria": { id: "brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "ছানামুখী", fact: "পাড়ার ঝগড়ার খবর পেয়ে দূর থেকেই সাবধানী সেলফি নেওয়া" },
  "Chandpur": { id: "chandpur", bn: "চাঁদপুর", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "পদ্মা-মেঘনার তাজা রুপালী ইলিশ", fact: "তিন নদীর মোহনায় দাঁড়িয়ে মাছের দরদাম করে খালি হাতে ফেরা" },
  "Chittagong": { id: "chattogram", bn: "চট্টগ্রাম", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "মেজ্জানি মাংস ও কালা ভুনা", fact: "পতেঙ্গা বিচে বসে কাঁকড়া ফ্রাই খেয়ে ঝালে অস্থির হওয়া" },
  "Chuadanga": { id: "chuadanga", bn: "চুয়াডাঙ্গা", divBn: "খুলনা", divEn: "Khulna", food: "পান ও পানতোয়া মিষ্টি", fact: "গ্রীষ্মের দিনে গিয়ে গরমে গলে যাওয়ার অভিজ্ঞতা" },
  "Comilla": { id: "cumilla", bn: "কুমিল্লা", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "মাতৃভাণ্ডারের খাঁটি রসমলাই", fact: "আসল নাকি নকল মাতৃভাণ্ডার খুঁজতে গিয়ে মাথা নষ্ট" },
  "Cox's Bazar": { id: "coxs-bazar", bn: "কক্সবাজার", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "রূপচাঁদা ও লইট্টা ফ্রাই", fact: "ঢেউয়ের সাথে লাফাতে গিয়ে সাগরে জুতা হারানো" },
  "Dhaka": { id: "dhaka", bn: "ঢাকা", divBn: "ঢাকা", divEn: "Dhaka", food: "পুরান ঢাকার কাচ্চি ও বোরহানি", fact: "ট্যুর প্ল্যান করতে করতেই ট্রাফিক জ্যামে ২ ঘণ্টা পার" },
  "Dinajpur": { id: "dinajpur", bn: "দিনাজপুর", divBn: "রংপুর", divEn: "Rangpur", food: "কাটারিভোগ চাল ও রসালো লিচু", fact: "কান্তজীউ মন্দিরের টেরাকোটা দেখে মুগ্ধ হওয়া" },
  "Faridpur": { id: "faridpur", bn: "ফরিদপুর", divBn: "ঢাকা", divEn: "Dhaka", food: "খেজুরের গুড় ও পাটালির সন্দেশ", fact: "পল্লীকবির বাড়ি গিয়ে কবিতা আবৃত্তির ব্যর্থ চেষ্টা" },
  "Feni": { id: "feni", bn: "ফেনী", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "মহিষের দুধের ঘি ও খণ্ডলের মিষ্টি", fact: "হাইওয়েতে গাড়ি থামিয়ে এক কাপ গরম চা খাওয়া" },
  "Gaibandha": { id: "gaibandha", bn: "গাইবান্ধা", divBn: "রংপুর", divEn: "Rangpur", food: "রসমঞ্জুরী মিষ্টি", fact: "ব্রহ্মপুত্রের চরে গিয়ে বাতাসের সাথে দৌড়ানো" },
  "Gazipur": { id: "gazipur", bn: "গাজীপুর", divBn: "ঢাকা", divEn: "Dhaka", food: "ভাওয়ালের কাঁঠাল", fact: "রিসোর্টে গিয়ে অফিসের ল্যাপটপ নিয়ে বসে থাকা" },
  "Gopalganj": { id: "gopalganj", bn: "গোপালগঞ্জ", divBn: "ঢাকা", divEn: "Dhaka", food: "তালের পিঠা ও রসুনের রসগোল্লা", fact: "মধুমতী নদীর পাড়ে বসে ঝালমুড়ি খাওয়া" },
  "Habiganj": { id: "habiganj", bn: "হবিগঞ্জ", divBn: "সিলেট", divEn: "Sylhet", food: "সাতকড়া চা ও শুঁটকি শিরা", fact: "রেমা-কালেঙ্গার জঙ্গলে হরিণ খুঁজতে গিয়ে মশা মারা" },
  "Jamalpur": { id: "jamalpur", bn: "জামালপুর", divBn: "ময়মনসিংহ", divEn: "Mymensingh", food: "মেন্দা ও মিল্লি ভাত", fact: "নকশী কাঁথা কেনার জন্য পকেট খালি করা" },
  "Jessore": { id: "jashore", bn: "যশোর", divBn: "খুলনা", divEn: "Khulna", food: "যশোরের জামতলার মিষ্টি ও খেজুর গুড়", fact: "বেনাপোল বর্ডারে গিয়ে ভারতে উঁকিঝুঁকি দেওয়া" },
  "Jhalokati": { id: "jhalokati", bn: "ঝালকাঠি", divBn: "বরিশাল", divEn: "Barishal", food: "ভাসমান পেয়ারা বাজারের পেয়ারা", fact: "নৌকায় পেয়ারা কেনার সময় ভারসাম্য হারিয়ে পড়ার উপক্রম" },
  "Jhenaidah": { id: "jhenaidah", bn: "ঝিনাইদহ", divBn: "খুলনা", divEn: "Khulna", food: "কলা ও মিষ্টি পান", fact: "মরমী কবি পাগলা কানাইয়ের গান খোঁজা" },
  "Joypurhat": { id: "joypurhat", bn: "জয়পুরহাট", divBn: "রাজশাহী", divEn: "Rajshahi", food: "লতিরাজ কচু ও মুরালি", fact: "শান্ত শহর দেখে নিজের গ্রামের মতো অনুভব করা" },
  "Khagrachhari": { id: "khagrachhari", bn: "খাগড়াছড়ি", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "পাহাড়ি পাহাড়ি সবজি ও বাঁশের তরকারি", fact: "আলুটিলা গুহায় মশাল জ্বালিয়ে ভূত খোঁজা" },
  "Khulna": { id: "khulna", bn: "খুলনা", divBn: "খুলনা", divEn: "Khulna", food: "চুইঝাল দিয়ে খাসির মাংস", fact: "চুইঝালের ঝালে কান দিয়ে ধোঁয়া বের হওয়া" },
  "Kishoreganj": { id: "kishoreganj", bn: "কিশোরগঞ্জ", divBn: "ঢাকা", divEn: "Dhaka", food: "নিকলী হাওরের মাছ ও বালিশ মিষ্টি", fact: "হাওরে নৌকায় শুয়ে নিজেকে টাইটানিকের জ্যাক ভাবা" },
  "Kurigram": { id: "kurigram", bn: "কুড়িগ্রাম", divBn: "রংপুর", divEn: "Rangpur", food: "ধরমপুরের মিষ্টি ও ক্ষীর", fact: "১৬টি নদীর এই জেলায় নদী দেখতে দেখতে পথ হারানো" },
  "Kushtia": { id: "kushtia", bn: "কুষ্টিয়া", divBn: "খুলনা", divEn: "Khulna", food: "তিলের খাজা ও কুলফি মালাই", fact: "লালন সাঁইজির আখড়ায় গিয়ে বাউল সুরে হারিয়ে যাওয়া" },
  "Lakshmipur": { id: "lakshmipur", bn: "লক্ষ্মীপুর", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "মহিষের দই ও নারিকেলের মিষ্টি", fact: "সুপারির বাগান দেখে অ্যামাজনের রেইনফরেস্ট ভাবা" },
  "Lalmonirhat": { id: "lalmonirhat", bn: "লালমনিরহাট", divBn: "রংপুর", divEn: "Rangpur", food: "তিস্তার বৈরাতি মাছ", fact: "তিনবিঘা করিডোরে গিয়ে জাতীয় পতাকা হাতে সেলফি" },
  "Madaripur": { id: "madaripur", bn: "মাদারীপুর", divBn: "ঢাকা", divEn: "Dhaka", food: "রসগোল্লা ও খেজুর গুড়", fact: "আড়িয়াল খাঁ নদীর পাড়ে বসে বাতাস খাওয়া" },
  "Magura": { id: "magura", bn: "মাগুরা", divBn: "খুলনা", divEn: "Khulna", food: "সন্দেশ ও খাঁটি ঘি", fact: "সাকিব আল হাসানের হোমটাউনে গিয়ে অলরাউন্ডার ভাব" },
  "Manikganj": { id: "manikganj", bn: "মানিকগঞ্জ", divBn: "ঢাকা", divEn: "Dhaka", food: "ঝিটকার স্পেশাল খেজুরের গুড়", fact: "বালিয়াটি প্রাসাদে গিয়ে জমিদারি পোজ দেওয়া" },
  "Meherpur": { id: "meherpur", bn: "মেহেরপুর", divBn: "খুলনা", divEn: "Khulna", food: "সাবিত্রী ও রসকদম্ব মিষ্টি", fact: "মুজিবনগর স্মৃতিসৌধে গিয়ে ইতিহাসের পাঠ রিভিশন" },
  "Moulvibazar": { id: "moulvibazar", bn: "মৌলভীবাজার", divBn: "সিলেট", divEn: "Sylhet", food: "মণিপুরি খৈ ও সাত রঙের চা", fact: "মাধবকুণ্ড ঝর্ণার নিচে ভিজে সর্দি বাঁধিয়ে আসা" },
  "Munshiganj": { id: "munshiganj", bn: "মুন্সীগঞ্জ", divBn: "ঢাকা", divEn: "Dhaka", food: "ভাগ্যকুলের মিষ্টি ও পাতক্ষীর", fact: "পদ্মা সেতুর এপ্রোচ রোডে দাঁড়িয়ে সেলফি তোলা" },
  "Mymensingh": { id: "mymensingh", bn: "ময়মনসিংহ", divBn: "ময়মনসিংহ", divEn: "Mymensingh", food: "মুক্তাগাছার বিখ্যাত গোপাল পালের মণ্ডা", fact: "ব্রহ্মপুত্রের চরে নৌকা ভ্রমণে গিয়ে গান গাওয়া" },
  "Naogaon": { id: "naogaon", bn: "নওগাঁ", divBn: "রাজশাহী", divEn: "Rajshahi", food: "প্যারাসন্দেশ", fact: "পাহাড়পুর বৌদ্ধবিহারে গিয়ে প্রাচীন রাজাদের মতো হাঁটা" },
  "Narail": { id: "narail", bn: "নড়াইল", divBn: "খুলনা", divEn: "Khulna", food: "চিত্রা নদীর কাঁচকি মাছ", fact: "মাশরাফির শহরে গিয়ে ফাস্ট বোলার হওয়ার স্বপ্ন" },
  "Narayanganj": { id: "narayanganj", bn: "নারায়ণগঞ্জ", divBn: "ঢাকা", divEn: "Dhaka", food: "তোফা মিষ্টি ও বাকরখানি", fact: "পানাম নগরে গিয়ে ভূতুড়ে ফটোশুট করা" },
  "Narsingdi": { id: "narsingdi", bn: "নরসিংদী", divBn: "ঢাকা", divEn: "Dhaka", food: "লটকন ও অমৃতসাগর কলা", fact: "উয়ারী-বটেশ্বরে গিয়ে আড়াই হাজার বছর প্রাচীন ভাব নেওয়া" },
  "Natore": { id: "natore", bn: "নাটোর", divBn: "রাজশাহী", divEn: "Rajshahi", food: "বনলতা সেনের খাঁটি কাঁচাগোল্লা", fact: "কাঁচাগোল্লা খেয়ে চোখের পলকে সব ভুলে যাওয়া" },
  "Nawabganj": { id: "chapai-nawabganj", bn: "চাঁপাইনবাবগঞ্জ", divBn: "রাজশাহী", divEn: "Rajshahi", food: "শিবগঞ্জের চমচম ও খিরসাপাত আম", fact: "আমের মৌসুমে পেটে জায়গা না রেখে আম খাওয়া" },
  "Netrakona": { id: "netrakona", bn: "নেত্রকোনা", divBn: "ময়মনসিংহ", divEn: "Mymensingh", food: "বালিশ মিষ্টি", fact: "বিজয়পুর সাদামাটির পাহাড়ে নীল পানিতে ডুবে থাকা" },
  "Nilphamari": { id: "nilphamari", bn: "নীলফামারী", divBn: "রংপুর", divEn: "Rangpur", food: "ডোমারের চমচম", fact: "নীলসাগর দিঘিতে গিয়ে বাতাসের সাথে আড্ডা" },
  "Noakhali": { id: "noakhali", bn: "নোয়াখালী", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "নারিকেলের নাড়ু ও মহিষের দই", fact: "আঞ্চলিক ভাষা নকল করতে গিয়ে হাসির পাত্র হওয়া" },
  "Pabna": { id: "pabna", bn: "পাবনা", divBn: "রাজশাহী", divEn: "Rajshahi", food: "ঘি ও প্যারা মিষ্টি", fact: "পাবনার নাম শুনে বন্ধুদের অপ্রয়োজনীয় জোকস শোনা" },
  "Panchagarh": { id: "panchagarh", bn: "পঞ্চগড়", divBn: "রংপুর", divEn: "Rangpur", food: "সমতল ভূমির অর্গানিক চা", fact: "তেঁতুলিয়া থেকে কাঞ্চনজঙ্ঘা দেখার জন্য ভোরবেলায় ঠকঠকানি" },
  "Patuakhali": { id: "patuakhali", bn: "পটুয়াখালী", divBn: "বরিশাল", divEn: "Barishal", food: "কুয়াকাটার কাঁকড়া ও সামুদ্রিক মাছ", fact: "একই ঘাটে সূর্যোদয় ও সূর্যাস্ত দেখতে গিয়ে ঘুমিয়ে পড়া" },
  "Pirojpur": { id: "pirojpur", bn: "পিরোজপুর", divBn: "বরিশাল", divEn: "Barishal", food: "বলেশ্বর নদীর ইলিশ ও রসমালাই", fact: "সুপারি গাছের সাঁকো দেখে পার হওয়ার সাহস হারানো" },
  "Rajbari": { id: "rajbari", bn: "রাজবাড়ী", divBn: "ঢাকা", divEn: "Dhaka", food: "রাজবাড়ীর বিখ্যাত চমচম", fact: "গোয়ালন্দ ঘাটের মুরগির ঝোল খাওয়ার লোভ সামলানো" },
  "Rajshahi": { id: "rajshahi", bn: "রাজশাহী", divBn: "রাজশাহী", divEn: "Rajshahi", food: "হিমসাগর আম ও কালাইয়ের রুটি", fact: "পদ্মার পাড়ে বসে কালাইয়ের রুটি আর হাঁসের মাংস চেটেপুটে খাওয়া" },
  "Rangamati": { id: "rangamati", bn: "রাঙামাটি", divBn: "চট্টগ্রাম", divEn: "Chattogram", food: "পাহাড়ি ব্যাম্বু চিকেন", fact: "কাপ্তাই লেকে ঝুলন্ত ব্রিজে লাফিয়ে দোলা খাওয়া" },
  "Rangpur": { id: "rangpur", bn: "রংপুর", divBn: "রংপুর", divEn: "Rangpur", food: "হাড়িভাঙ্গা আম", fact: "তাজহাট জমিদার বাড়িতে রাজা-রানীর পোজে ছবি তোলা" },
  "Satkhira": { id: "satkhira", bn: "সাতক্ষীরা", divBn: "খুলনা", divEn: "Khulna", food: "সুন্দরবনের খাঁটি মধু ও সন্দেশ", fact: "বাঘের খোঁজে গিয়ে হরিণের ডাক শুনেই ভয় পাওয়া" },
  "Shariatpur": { id: "shariatpur", bn: "শরীয়তপুর", divBn: "ঢাকা", divEn: "Dhaka", food: "নড়িয়ার মিষ্টি ও ক্ষীর", fact: "পদ্মার পাড়ে লাইফ জ্যাকেট খুঁজে অস্থির হওয়া" },
  "Sherpur": { id: "sherpur", bn: "শেরপুর", divBn: "ময়মনসিংহ", divEn: "Mymensingh", food: "ছানার পায়েস ও প্যারা সন্দেশ", fact: "গজনী অবকাশ কেন্দ্রে পাহাড়ি ট্রেইল ধরে ক্লান্ত হওয়া" },
  "Sirajganj": { id: "sirajganj", bn: "সিরাজগঞ্জ", divBn: "রাজশাহী", divEn: "Rajshahi", food: "ধানসিঁড়ির দই ও কাঁচাগোল্লা", fact: "যমুনা সেতুর ওপর দিয়ে যাওয়ার সময় ছবি তোলার তাড়া" },
  "Sunamganj": { id: "sunamganj", bn: "সুনামগঞ্জ", divBn: "সিলেট", divEn: "Sylhet", food: "হাওরের বোয়াল ও চালের রুটি", fact: "টাঙ্গুয়ার হাওরে জোছনা রাতে গান গাওয়ার স্মৃতি" },
  "Sylhet": { id: "sylhet", bn: "সিলেট", divBn: "সিলেট", divEn: "Sylhet", food: "সাতকড়া বিরিয়ানি ও চা", fact: "জাফলং গিয়ে পাথরের ওপর পা পিছলে পানিতে পড়া" },
  "Tangail": { id: "tangail", bn: "টাঙ্গাইল", divBn: "ঢাকা", divEn: "Dhaka", food: "পোড়াবাড়ির আসল চমচম", fact: "শাড়ি না কিনে এক বক্স বেশি চমচম খেয়ে ফেলা" },
  "Thakurgaon": { id: "thakurgaon", bn: "ঠাকুরগাঁও", divBn: "রংপুর", divEn: "Rangpur", food: "সূর্যপুরী আম ও গুড়ের জিলাপি", fact: "সবুজ ধানক্ষেতের মাঝ দিয়ে বাতাস গায়ে মেখে হাঁটা" }
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function projectCoord(lon, lat, bounds, width, height) {
  // Mercator Projection
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * width;
  
  const latRad = (lat * Math.PI) / 180;
  const minLatRad = (bounds.minLat * Math.PI) / 180;
  const maxLatRad = (bounds.maxLat * Math.PI) / 180;
  
  const yMerc = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const minYMerc = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
  const maxYMerc = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
  
  const y = height - ((yMerc - minYMerc) / (maxYMerc - minYMerc)) * height;
  return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))];
}

function polygonToPath(rings, bounds, width, height) {
  return rings.map(ring => {
    return ring.map((pt, i) => {
      const [x, y] = projectCoord(pt[0], pt[1], bounds, width, height);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ') + ' Z';
  }).join(' ');
}

async function run() {
  console.log('Downloading GeoJSON...');
  const geojson = await fetchJson(GEOJSON_URL);
  
  // Calculate bounding box across all coordinates
  let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
  
  function scanCoords(coords) {
    if (typeof coords[0] === 'number') {
      const [lon, lat] = coords;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      coords.forEach(scanCoords);
    }
  }
  
  geojson.features.forEach(f => scanCoords(f.geometry.coordinates));
  console.log(`Bounds: Lon [${minLon}, ${maxLon}], Lat [${minLat}, ${maxLat}]`);
  
  // Add 15px padding on viewBox 0 0 600 760
  const SVG_WIDTH = 560;
  const SVG_HEIGHT = 730;
  const OFFSET_X = 20;
  const OFFSET_Y = 15;
  
  const bounds = { minLon, maxLon, minLat, maxLat };
  
  const districts = [];
  
  geojson.features.forEach(feature => {
    const rawName = feature.properties.ADM2_EN;
    const meta = BN_DATA[rawName] || {
      id: rawName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      bn: rawName,
      divBn: feature.properties.ADM1_EN,
      divEn: feature.properties.ADM1_EN,
      food: "বিখ্যাত স্থানীয় খাবার",
      fact: "সুন্দর একটি জেলা ভ্রমণ"
    };
    
    let pathD = '';
    const geom = feature.geometry;
    if (geom.type === 'Polygon') {
      pathD = polygonToPath(geom.coordinates, bounds, SVG_WIDTH, SVG_HEIGHT);
    } else if (geom.type === 'MultiPolygon') {
      pathD = geom.coordinates.map(poly => polygonToPath(poly, bounds, SVG_WIDTH, SVG_HEIGHT)).join(' ');
    }
    
    // Shift by offset
    // Simple regex replacement to add offset to coordinates
    pathD = pathD.replace(/([ML])([0-9.-]+),([0-9.-]+)/g, (_, cmd, x, y) => {
      const nx = (parseFloat(x) + OFFSET_X).toFixed(1);
      const ny = (parseFloat(y) + OFFSET_Y).toFixed(1);
      return `${cmd}${nx},${ny}`;
    });
    
    districts.push({
      id: meta.id,
      nameEn: rawName,
      nameBn: meta.bn,
      divisionEn: meta.divEn,
      divisionBn: meta.divBn,
      food: meta.food,
      fact: meta.fact,
      path: pathD
    });
  });
  
  // Sort districts by division and Bengali name for clean presentation
  districts.sort((a, b) => a.divisionBn.localeCompare(b.divisionBn, 'bn') || a.nameBn.localeCompare(b.nameBn, 'bn'));
  
  const outputCode = `export interface District {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  food: string;
  fact: string;
  path: string;
}

export const DIVISIONS = [
  { id: "all", nameBn: "সব বিভাগ", nameEn: "All" },
  { id: "Dhaka", nameBn: "ঢাকা", nameEn: "Dhaka" },
  { id: "Chattogram", nameBn: "চট্টগ্রাম", nameEn: "Chattogram" },
  { id: "Rajshahi", nameBn: "রাজশাহী", nameEn: "Rajshahi" },
  { id: "Khulna", nameBn: "খুলনা", nameEn: "Khulna" },
  { id: "Barishal", nameBn: "বরিশাল", nameEn: "Barishal" },
  { id: "Sylhet", nameBn: "সিলেট", nameEn: "Sylhet" },
  { id: "Rangpur", nameBn: "রংপুর", nameEn: "Rangpur" },
  { id: "Mymensingh", nameBn: "ময়মনসিংহ", nameEn: "Mymensingh" },
] as const;

export const DISTRICTS: District[] = ${JSON.stringify(districts, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'districts.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outputCode, 'utf8');
  console.log(`Generated ${districts.length} districts in ${outputPath}!`);
}

run().catch(console.error);
