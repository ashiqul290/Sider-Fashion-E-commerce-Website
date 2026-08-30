import { CategorySizeChart, FAQItem, SizeRecommendationInput, SizeRecommendationResult } from '../types';

export const CATEGORY_SIZE_CHARTS: Record<string, CategorySizeChart> = {
  'mens-shirts': {
    id: 'chart-mens-shirts',
    categoryId: 'mens-shirts',
    categoryName: "Men's Shirts (কটন ও ফরমাল শার্ট)",
    categoryNameBn: 'পুরুষদের কটন ও ক্যাজুয়াল শার্ট সাইজ চার্ট',
    description: 'Tailored for standard South Asian body proportions with balanced armholes and chest ease.',
    descriptionBn: 'সাভার ফ্যাক্টরি স্ট্যান্ডার্ড মেজারমেন্ট — দেশীয় শারীরিক গঠনের সাথে শতভাগ সামঞ্জস্যপূর্ণ।',
    chartRows: [
      {
        size: 'S',
        chestInches: 36,
        chestCm: 91.4,
        lengthInches: 27,
        lengthCm: 68.6,
        shoulderInches: 16.5,
        shoulderCm: 41.9,
        sleeveInches: 23.5,
        sleeveCm: 59.7,
        collarInches: 14.5,
        collarCm: 36.8,
        recommendedWeightKg: '48 – 56 kg',
        recommendedHeightFt: '5\'2" – 5\'5"'
      },
      {
        size: 'M',
        chestInches: 38,
        chestCm: 96.5,
        lengthInches: 28,
        lengthCm: 71.1,
        shoulderInches: 17.5,
        shoulderCm: 44.5,
        sleeveInches: 24,
        sleeveCm: 61.0,
        collarInches: 15.0,
        collarCm: 38.1,
        recommendedWeightKg: '57 – 66 kg',
        recommendedHeightFt: '5\'5" – 5\'8"'
      },
      {
        size: 'L',
        chestInches: 40,
        chestCm: 101.6,
        lengthInches: 29,
        lengthCm: 73.7,
        shoulderInches: 18.5,
        shoulderCm: 47.0,
        sleeveInches: 24.5,
        sleeveCm: 62.2,
        collarInches: 15.5,
        collarCm: 39.4,
        recommendedWeightKg: '67 – 76 kg',
        recommendedHeightFt: '5\'7" – 5\'11"'
      },
      {
        size: 'XL',
        chestInches: 42,
        chestCm: 106.7,
        lengthInches: 30,
        lengthCm: 76.2,
        shoulderInches: 19.5,
        shoulderCm: 49.5,
        sleeveInches: 25,
        sleeveCm: 63.5,
        collarInches: 16.0,
        collarCm: 40.6,
        recommendedWeightKg: '77 – 87 kg',
        recommendedHeightFt: '5\'9" – 6\'1"'
      },
      {
        size: 'XXL',
        chestInches: 44,
        chestCm: 111.8,
        lengthInches: 31,
        lengthCm: 78.7,
        shoulderInches: 20.5,
        shoulderCm: 52.1,
        sleeveInches: 25.5,
        sleeveCm: 64.8,
        collarInches: 16.5,
        collarCm: 41.9,
        recommendedWeightKg: '88 – 100+ kg',
        recommendedHeightFt: '5\'10" – 6\'3"'
      }
    ],
    fitTips: [
      'If you prefer a Slim Fit silhouette, pick your exact chest size.',
      'For a Regular/Office comfortable drape, our shirts have 2-3 inches built-in breathing room.',
      'Measurements are taken of the finished garment laid flat on a smooth surface.'
    ],
    fitTipsBn: [
      'স্লিম ফিট পছন্দ করলে আপনার সঠিক বডি মাপের সাথে মিলিয়ে সাইজ নির্বাচন করুন।',
      'অফিস বা ক্যাজুয়াল ব্যবহারের জন্য আমাদের শার্টে পর্যাপ্ত ব্রিদিং স্পেস (২-৩ ইঞ্চি) রাখা হয়েছে।',
      'টেবিলে ফ্ল্যাট করে বিছিয়ে পোশাকের মাপ নেওয়া হয়েছে।'
    ]
  },

  'mens-katua': {
    id: 'chart-mens-katua',
    categoryId: 'mens-katua',
    categoryName: "Men's Katua (কতুয়া কালেকশন)",
    categoryNameBn: 'পুরুষদের কতুয়া ও শর্ট পাঞ্জাবি সাইজ চার্ট',
    description: 'Designed for effortless cultural elegance with relaxed shoulders and traditional side-slit ease.',
    descriptionBn: 'আরামদায়ক চাইনিজ কলার, হ্যান্ডক্রাফট বোতাম ও সাইড পকেট কমফোর্ট কাটিং।',
    chartRows: [
      {
        size: 'M',
        chestInches: 40,
        chestCm: 101.6,
        lengthInches: 38,
        lengthCm: 96.5,
        shoulderInches: 18.0,
        shoulderCm: 45.7,
        sleeveInches: 22.5,
        sleeveCm: 57.2,
        collarInches: 15.5,
        collarCm: 39.4,
        recommendedWeightKg: '55 – 68 kg',
        recommendedHeightFt: '5\'4" – 5\'8"'
      },
      {
        size: 'L',
        chestInches: 42,
        chestCm: 106.7,
        lengthInches: 40,
        lengthCm: 101.6,
        shoulderInches: 19.0,
        shoulderCm: 48.3,
        sleeveInches: 23.0,
        sleeveCm: 58.4,
        collarInches: 16.0,
        collarCm: 40.6,
        recommendedWeightKg: '69 – 78 kg',
        recommendedHeightFt: '5\'7" – 5\'11"'
      },
      {
        size: 'XL',
        chestInches: 44,
        chestCm: 111.8,
        lengthInches: 42,
        lengthCm: 106.7,
        shoulderInches: 20.0,
        shoulderCm: 50.8,
        sleeveInches: 23.5,
        sleeveCm: 59.7,
        collarInches: 16.5,
        collarCm: 41.9,
        recommendedWeightKg: '79 – 89 kg',
        recommendedHeightFt: '5\'9" – 6\'2"'
      },
      {
        size: 'XXL',
        chestInches: 46,
        chestCm: 116.8,
        lengthInches: 44,
        lengthCm: 111.8,
        shoulderInches: 21.0,
        shoulderCm: 53.3,
        sleeveInches: 24.0,
        sleeveCm: 61.0,
        collarInches: 17.0,
        collarCm: 43.2,
        recommendedWeightKg: '90 – 105+ kg',
        recommendedHeightFt: '5\'10" – 6\'4"'
      }
    ],
    fitTips: [
      'Katua is traditionally cut slightly roomier than formal shirts for comfort.',
      'Check both Chest and Length if you have specific height preferences for knee or mid-thigh coverage.',
      'Crafted from pre-washed cotton and jacquard weaves to prevent post-wash shrinkage.'
    ],
    fitTipsBn: [
      'কতুয়া সাধারণত শার্টের চেয়ে সামান্য ঢিলেঢালাভাবে পরা আরামদায়ক।',
      'দৈর্ঘ্য (লম্বা) আপনার হাঁটু বা উরু পর্যন্ত কেমন ঝুল চান সে অনুযায়ী চেক করুন।',
      'প্রি-ওয়াশড কটন ব্যবহার করায় ধোয়ার পর সংকুচিত (shrink) হবে না।'
    ]
  }
};

/**
 * Intelligent Size Recommendation Algorithm
 * Computes the recommended size based on Height (ft + in), Weight (kg), and Fit Preference.
 * Estimates garment chest circumference with ease factor.
 */
export function calculateRecommendedSize(
  input: SizeRecommendationInput,
  categoryId: string = 'mens-shirts'
): SizeRecommendationResult {
  const totalHeightInches = (input.heightFeet * 12) + input.heightInches;
  const weightKg = input.weightKg;

  // Approximate body chest based on height & weight biometric regression for Bangladeshi men
  // Base chest estimate:
  let estimatedBodyChest = 22 + (weightKg * 0.28) + (totalHeightInches * 0.08);

  // Apply Fit Preference adjustments
  // Slim fit: tight tolerance
  // Regular fit: +1.5 - 2" garment ease
  // Relaxed fit: +3.5 - 4" garment ease
  let targetGarmentChest = estimatedBodyChest;
  if (input.fitPreference === 'slim') {
    targetGarmentChest += 1.0;
  } else if (input.fitPreference === 'regular') {
    targetGarmentChest += 2.5;
  } else if (input.fitPreference === 'relaxed') {
    targetGarmentChest += 4.5;
  }

  // If calculating for Katua, traditional drape is naturally +2 inches wider than shirts
  if (categoryId === 'mens-katua') {
    targetGarmentChest += 1.5;
  }

  let recommendedSize = 'L';
  let alternativeSize: string | undefined = undefined;
  let matchScore = 95;

  if (categoryId === 'mens-katua') {
    if (targetGarmentChest < 40.5) {
      recommendedSize = 'M';
      alternativeSize = 'L';
    } else if (targetGarmentChest < 42.8) {
      recommendedSize = 'L';
      alternativeSize = targetGarmentChest < 41.5 ? 'M' : 'XL';
    } else if (targetGarmentChest < 45.0) {
      recommendedSize = 'XL';
      alternativeSize = targetGarmentChest < 43.8 ? 'L' : 'XXL';
    } else {
      recommendedSize = 'XXL';
      alternativeSize = 'XL';
    }
  } else {
    // Standard Shirts
    if (targetGarmentChest < 36.8) {
      recommendedSize = 'S';
      alternativeSize = 'M';
    } else if (targetGarmentChest < 39.0) {
      recommendedSize = 'M';
      alternativeSize = targetGarmentChest < 37.8 ? 'S' : 'L';
    } else if (targetGarmentChest < 41.2) {
      recommendedSize = 'L';
      alternativeSize = targetGarmentChest < 40.0 ? 'M' : 'XL';
    } else if (targetGarmentChest < 43.5) {
      recommendedSize = 'XL';
      alternativeSize = targetGarmentChest < 42.2 ? 'L' : 'XXL';
    } else {
      recommendedSize = 'XXL';
      alternativeSize = 'XL';
    }
  }

  const fitNameBn = input.fitPreference === 'slim' 
    ? 'স্লিম ফিট (Slim Fit)' 
    : input.fitPreference === 'regular' 
    ? 'রেগুলার ফিট (Regular Fit)' 
    : 'লুজ/রিল্যাক্সড ফিট (Relaxed Fit)';

  const explanation = `Recommended based on your height (${input.heightFeet}'${input.heightInches}"), weight (${weightKg} kg), and ${input.fitPreference} fit preference. Gives an estimated chest coverage of ~${Math.round(targetGarmentChest)}" with optimal movement ease.`;
  
  const explanationBn = `আপনার উচ্চতা (${input.heightFeet} ফুট ${input.heightInches} ইঞ্চি), ওজন (${weightKg} কেজি) এবং ${fitNameBn} পছন্দের উপর ভিত্তি করে ${recommendedSize} সাইজটি আপনার জন্য সবচেয়ে নিখুঁত ও আরামদায়ক হবে।`;

  return {
    recommendedSize,
    alternativeSize,
    fitConfirmed: true,
    chestEstimateInches: Math.round(targetGarmentChest * 10) / 10,
    explanation,
    explanationBn,
    matchScore
  };
}

export const HOW_TO_MEASURE_STEPS = [
  {
    step: 1,
    title: 'Chest Measurement (বুকের মাপ)',
    titleBn: 'বুকের পরিমাপ (Chest)',
    instruction: 'Measure around the fullest part of your chest, keeping the measuring tape horizontal and level under the armpits and across the shoulder blades.',
    instructionBn: 'ফিতাটি বগলের নিচ দিয়ে বুকের সবচেয়ে চওড়া অংশের চারপাশ দিয়ে ঘুরিয়ে সোজাভাবে মাপ নিন। খুব বেশি টাইট করবেন না।',
    flatGarmentTip: 'For a flat shirt: Measure from armpit seam to armpit seam, then multiply by 2.',
    flatGarmentTipBn: 'ফ্ল্যাট শার্টের ক্ষেত্রে: এক বগলের সেলাই থেকে অন্য বগলের সেলাই পর্যন্ত ইঞ্চি মেপে ২ দিয়ে গুণ করুন।',
    icon: 'Ruler'
  },
  {
    step: 2,
    title: 'Length Measurement (পোশাকের দৈর্ঘ্য / লম্বা)',
    titleBn: 'দৈর্ঘ্য / লম্বা পরিমাপ (Length)',
    instruction: 'Measure straight down from the highest point of the shoulder (where the collar seam meets the shoulder) to the bottom hem of the garment.',
    instructionBn: 'কলার ও কাঁধের মিলনস্থল (সর্বোচ্চ অংশ) থেকে শুরু করে শার্ট বা কতুয়ার নিচের প্রান্ত পর্যন্ত সোজা ফিতা ফেলে মাপুন।',
    flatGarmentTip: 'Lay the shirt face down flat on a table and measure down the center back.',
    flatGarmentTipBn: 'শার্টটি টেবিলে সমান করে বিছিয়ে কলারের পিছনের নিচের দিক থেকে সোজা নিচের বর্ডার পর্যন্ত মাপুন।',
    icon: 'Maximize2'
  },
  {
    step: 3,
    title: 'Shoulder Width (কাঁধের মাপ)',
    titleBn: 'কাঁধের পরিমাপ (Shoulder)',
    instruction: 'Measure straight across the back from the tip of the left shoulder bone/seam to the tip of the right shoulder bone/seam.',
    instructionBn: 'পিছনের দিক থেকে এক কাঁধের সেলাইয়ের মাথা থেকে অন্য কাঁধের সেলাইয়ের শেষ মাথা পর্যন্ত মাপ নিন।',
    flatGarmentTip: 'Check the shoulder seam-to-seam span on your best-fitting current shirt.',
    flatGarmentTipBn: 'আপনার ভালো ফিটিং হওয়া শার্টের দুই কাঁধের সেলাইয়ের মধ্যবর্তী দূরত্ব মাপলেই সঠিক কাঁধ পাওয়া যাবে।',
    icon: 'MoveHorizontal'
  },
  {
    step: 4,
    title: 'Sleeve Length (হাতার মাপ)',
    titleBn: 'হাতার পরিমাপ (Sleeve)',
    instruction: 'Measure from the top shoulder seam down along the outer arm to the cuff edge at the wrist bone.',
    instructionBn: 'কাঁধের সেলাইয়ের শুরু থেকে হাতের কব্জির হাড় (কাফ এর শেষ প্রান্ত) পর্যন্ত মাপুন।',
    flatGarmentTip: 'Measure along the top edge of the sleeve from seam to cuff.',
    flatGarmentTipBn: 'শার্টের হাতার ওপরের অংশ বরাবর সেলাই থেকে কাফ পর্যন্ত মাপুন।',
    icon: 'Scissors'
  }
];

export const SIDER_FAQS: FAQItem[] = [
  {
    id: 'faq-size-finder',
    category: 'size',
    question: 'How do I choose the correct size for Sider Fashion shirts or Katua?',
    questionBn: 'আমি কীভাবে সঠিক সাইজ নির্বাচন করব?',
    answer: 'You can use our interactive Size Finder tool located on every product page and in the main menu. Simply input your Height, Weight, and Fit Preference (Slim, Regular, or Relaxed) to see your calculated recommended size. You can also view our detailed Size Chart table with chest, shoulder, length, and sleeve measurements in inches and cm.',
    answerBn: 'আমাদের প্রতিটি প্রোডাক্টের পাশে এবং ওয়েবসাইটের "সাইজ গাইড" অপশনে একটি স্মার্ট সাইজ ফাইন্ডার আছে। আপনার উচ্চতা, ওজন এবং ফিটিং পছন্দ দিলেই সিস্টেম আপনাকে সঠিক সাইজ (M, L, XL, XXL) সাজেস্ট করবে। এছাড়াও মেজারমেন্ট টেবিল দেখে ইঞ্চি বা সেন্টিমিটারে মাপ মিলিয়ে নিতে পারেন।'
  },
  {
    id: 'faq-delivery-check',
    category: 'delivery',
    question: 'Can I open and check the clothing before paying the delivery person?',
    questionBn: 'ডেলিভারি পাওয়ার পর কি পার্সেল খুলে চেক করে দেখা যাবে?',
    answer: 'Yes, absolutely! At Sider Fashion, we encourage you to inspect the fabric, color, stitching, and size in front of the courier delivery executive. If there is any discrepancy or you are not fully satisfied, you may return it immediately right on the spot.',
    answerBn: 'হ্যাঁ, অবশ্যই! ডেলিভারিম্যানের সামনে পার্সেলটি খুলে কাপড়ের কোয়ালিটি, কালার, সাইজ ও সেলাই দেখে নিতে পারবেন। পছন্দ না হলে বা কোনো সমস্যা থাকলে সাথে সাথে রিটার্ন করতে পারবেন।'
  },
  {
    id: 'faq-returns-exchange',
    category: 'return',
    question: 'What is your Return & Exchange Policy if the size doesn\'t fit?',
    questionBn: 'সাইজ না মিললে বা কোনো ত্রুটি থাকলে এক্সচেঞ্জ করার নিয়ম কী?',
    answer: 'We provide a hassle-free 7-Day Exchange Guarantee. If the size does not fit after trying it on, simply notify us via WhatsApp or Phone within 7 days. We will arrange a replacement size delivered to your address. (Product must be unused with original tags).',
    answerBn: 'আমাদের রয়েছে সহজ ৭ দিনের এক্সচেঞ্জ সুবিধা। ট্রায়াল দেওয়ার পর সাইজ ছোট বা বড় হলে আমাদের হোয়াটসঅ্যাপ (01712773063) এ জানালেই আমরা সঠিক সাইজ এক্সচেঞ্জ করে পাঠিয়ে দেব।'
  },
  {
    id: 'faq-wholesale-moq',
    category: 'wholesale',
    question: 'Do you offer Wholesale & Bulk supply? What is the Minimum Order Quantity (MOQ)?',
    questionBn: 'পাইকারি বা বাল্ক অর্ডারের নিয়ম ও সর্বনিম্ন অর্ডার কত?',
    answer: 'Yes! As direct manufacturers based in Ashulia, Savar, we supply wholesale to retail showrooms, boutiques, and online clothing sellers all across Bangladesh. The Minimum Order Quantity (MOQ) for wholesale prices is only 12 pieces (mixed sizes/colors allowed). Contact our wholesale desk via WhatsApp for bulk quotation catalogues.',
    answerBn: 'হ্যাঁ! আশুলিয়া ও সাভারে আমাদের নিজস্ব গার্মেন্টস ম্যানুফ্যাকচারিং থাকায় সারা বাংলাদেশের শোরুম ও অনলাইন সেলারদের পাইকারি সাপ্লাই দিয়ে থাকি। পাইকারি মূল্যে সর্বনিম্ন ১২ পিস অর্ডার করা যায় (সাইজ ও কালার মিক্স করে নেওয়া যাবে)।'
  },
  {
    id: 'faq-payment-methods',
    category: 'payment',
    question: 'What payment methods do you accept?',
    questionBn: 'কী কী মাধ্যমে পেমেন্ট করা যাবে?',
    answer: 'We offer Cash on Delivery (COD) nationwide so you pay only when you receive your parcel. We also accept bKash Personal & Merchant payment, and Nagad. For wholesale bulk orders, bank transfer is available.',
    answerBn: 'আমরা সারা দেশে ক্যাশ অন ডেলিভারি (ক্যাশ অন রিসিভ) সুবিধা দিই। এছাড়াও বিকাশ (bKash) ও নগদ (Nagad) এর মাধ্যমে সহজেই পেমেন্ট করতে পারবেন।'
  },
  {
    id: 'faq-delivery-coverage',
    category: 'delivery',
    question: 'What are your delivery areas and delivery charges?',
    questionBn: 'ডেলিভারি চার্জ কত এবং সারা দেশে কত দিনে ডেলিভারি হয়?',
    answer: 'We deliver to all 64 districts in Bangladesh. Inside Dhaka city delivery charge is ৳70 (takes 24-48 hours). Outside Dhaka delivery charge is ৳120 (takes 48-72 hours via Steadfast/RedX/Pathao/eCourier).',
    answerBn: 'আমরা বাংলাদেশের সকল ৬৪টি জেলায় হোম ডেলিভারি দিই। ঢাকা সিটিতে ডেলিভারি চার্জ মাত্র ৭০ টাকা (২৪-৪৮ ঘণ্টার মধ্যে), এবং ঢাকার বাইরে ১২০ টাকা (২-৩ কার্যদিবসের মধ্যে)।'
  },
  {
    id: 'faq-factory-location',
    category: 'factory',
    question: 'Where is your factory located? Can I visit in person?',
    questionBn: 'আপনাদের কারখানা কোথায়? সরাসরি গিয়ে কেনা যাবে কি?',
    answer: 'Our manufacturing hub is located in the Ashulia Industrial Zone, Savar, Dhaka, Bangladesh (accessible from Savar EPZ & Cantonment area). Showroom buyers and wholesale clients are warmly welcome to visit our production facility by scheduling an appointment via phone or WhatsApp.',
    answerBn: 'আমাদের নিজস্ব কারখানা ঢাকা জেলার সাভার ও আশুলিয়া শিল্পাঞ্চলে অবস্থিত। পাইকারি ক্রেতা ও ব্যবসায়ীরা সরাসরি কারখানায় এসে কাপড় দেখে অর্ডার করতে পারেন।'
  }
];

export const DEFAULT_SIZE_CHARTS: CategorySizeChart[] = Object.values(CATEGORY_SIZE_CHARTS);

