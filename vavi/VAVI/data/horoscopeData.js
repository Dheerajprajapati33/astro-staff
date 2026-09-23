export const RASHIS = [
  {
    id: "mesh",
    name: "Aries",
    hindiName: "मेष",
    symbol: "♈",
    element: "Fire",
    dates: "Mar 21 - Apr 19",
  },
  {
    id: "vrishabh",
    name: "Taurus",
    hindiName: "वृषभ",
    symbol: "♉",
    element: "Earth",
    dates: "Apr 20 - May 20",
  },
  {
    id: "mithun",
    name: "Gemini",
    hindiName: "मिथुन",
    symbol: "♊",
    element: "Air",
    dates: "May 21 - Jun 20",
  },
  {
    id: "kark",
    name: "Cancer",
    hindiName: "कर्क",
    symbol: "♋",
    element: "Water",
    dates: "Jun 21 - Jul 22",
  },
  {
    id: "singh",
    name: "Leo",
    hindiName: "सिंह",
    symbol: "♌",
    element: "Fire",
    dates: "Jul 23 - Aug 22",
  },
  {
    id: "kanya",
    name: "Virgo",
    hindiName: "कन्या",
    symbol: "♍",
    element: "Earth",
    dates: "Aug 23 - Sep 22",
  },
  {
    id: "tula",
    name: "Libra",
    hindiName: "तुला",
    symbol: "♎",
    element: "Air",
    dates: "Sep 23 - Oct 22",
  },
  {
    id: "vrishchik",
    name: "Scorpio",
    hindiName: "वृश्चिक",
    symbol: "♏",
    element: "Water",
    dates: "Oct 23 - Nov 21",
  },
  {
    id: "dhanu",
    name: "Sagittarius",
    hindiName: "धनु",
    symbol: "♐",
    element: "Fire",
    dates: "Nov 22 - Dec 21",
  },
  {
    id: "makar",
    name: "Capricorn",
    hindiName: "मकर",
    symbol: "♑",
    element: "Earth",
    dates: "Dec 22 - Jan 19",
  },
  {
    id: "kumbh",
    name: "Aquarius",
    hindiName: "कुंभ",
    symbol: "♒",
    element: "Air",
    dates: "Jan 20 - Feb 18",
  },
  {
    id: "meen",
    name: "Pisces",
    hindiName: "मीन",
    symbol: "♓",
    element: "Water",
    dates: "Feb 19 - Mar 20",
  },
];

export const HOROSCOPE_DATA = {
  mesh: [
    // 0: Sunday (रविवार)
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "ऊर्जा और उत्साह से भरा दिन",
      prediction:
        "आज का दिन आपके लिए आत्मविश्वास और नई ऊर्जा लेकर आएगा। पारिवारिक मामलों में सुख-शांति रहेगी। रुके हुए कार्य पूरे करने के लिए दिन उत्तम है। आर्थिक स्थिति में सुधार होगा।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "08:00 AM - 10:00 AM",
      mood: "उत्साही ✨",
      remedy:
        "सूर्य देव को तांबे के लोटे से जल अर्पित करें और 'ॐ सूर्याय नमः' का 11 बार जाप करें।",
      ratings: { career: 85, love: 75, health: 90, finance: 80 },
    },
    // 1: Monday (सोमवार)
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "मानसिक शांति और नए अवसर",
      prediction:
        "कार्यक्षेत्र में वरिष्ठ अधिकारियों का सहयोग मिलेगा। आज कोई महत्वपूर्ण निर्णय लेने से पहले बड़ों की सलाह अवश्य लें। मन को शांत रखें और सकारात्मक सोच बनाए रखें।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "10:30 AM - 12:00 PM",
      mood: "शांत 🧘",
      remedy: "शिवलिंग पर कच्चा दूध व जल चढ़ाएं और 'ॐ नमः शिवाय' का जाप करें।",
      ratings: { career: 80, love: 85, health: 80, finance: 75 },
    },
    // 2: Tuesday (मंगलवार)
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "साहस और विजय का दिन",
      prediction:
        "मंगल के प्रभाव से आपके पराक्रम में वृद्धि होगी। व्यापार में नए लाभदायक समझौते हो सकते हैं। प्रतिस्पर्धियों पर विजय प्राप्त होगी, लेकिन क्रोध पर नियंत्रण रखें।",
      luckyNumber: 1,
      luckyColor: "केसरिया (Saffron)",
      luckyTime: "02:00 PM - 04:00 PM",
      mood: "जोशीला ⚡",
      remedy: "हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।",
      ratings: { career: 90, love: 70, health: 85, finance: 85 },
    },
    // 3: Wednesday (बुधवार)
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "बुद्धि और व्यापारिक लाभ",
      prediction:
        "संवाद और बुद्धि-कौशल से आपके काम आसान होंगे। छात्रों और व्यापारियों के लिए बहुत अनुकूल समय है। नए मित्रों से मुलाकात लाभदायक सिद्ध हो सकती है।",
      luckyNumber: 5,
      luckyColor: "हरा (Green)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "प्रसन्न 😊",
      remedy: "गाय को हरी घास या पालक खिलाएं और गणेश जी को दूर्वा अर्पित करें।",
      ratings: { career: 85, love: 80, health: 85, finance: 90 },
    },
    // 4: Thursday (गुरुवार)
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "भाग्य और आध्यात्मिकता में वृद्धि",
      prediction:
        "गुरु कृपा से भाग्य का पूरा साथ मिलेगा। धर्म-कर्म में रुचि बढ़ेगी। आर्थिक मामलों में कोई अच्छी खबर मिल सकती है। मान-सम्मान में वृद्धि होगी।",
      luckyNumber: 3,
      luckyColor: "पीला (Yellow)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "संतोषजनक 🌟",
      remedy:
        "केले के पेड़ में जल दें और मस्तक पर हल्दी या चंदन का तिलक लगाएं।",
      ratings: { career: 90, love: 85, health: 80, finance: 85 },
    },
    // 5: Friday (शुक्रवार)
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "सुख-सुविधा और प्रेम संबंध",
      prediction:
        "घर-परिवार में सुख-समृद्धि का वातावरण रहेगा। भौतिक सुख-साधनों की प्राप्ति हो सकती है। पार्टनर के साथ खुशनुमा समय बीतेगा। रचनात्मक कार्यों में सफलता मिलेगी।",
      luckyNumber: 6,
      luckyColor: "गुलाबी (Pink)",
      luckyTime: "04:00 PM - 06:30 PM",
      mood: "रोमांटिक 💖",
      remedy:
        "मां लक्ष्मी की आराधना करें और कन्याओं को मिश्री या खीर का प्रसाद बांटें।",
      ratings: { career: 80, love: 95, health: 85, finance: 80 },
    },
    // 6: Saturday (शनिवार)
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "धैर्य और कर्म का फल",
      prediction:
        "कड़ी मेहनत का सुखद परिणाम मिलेगा। पुरानी समस्याओं से मुक्ति मिल सकती है। यात्रा का योग बन सकता है। किसी भी दस्तावेज पर हस्ताक्षर करने से पहले ध्यान से पढ़ें।",
      luckyNumber: 8,
      luckyColor: "नीला (Blue)",
      luckyTime: "05:00 PM - 07:00 PM",
      mood: "संतुलित ⚖️",
      remedy:
        "शनि मंदिर में सरसों के तेल का दीपक जलाएं और जरूरतमंदों को दान दें।",
      ratings: { career: 85, love: 75, health: 75, finance: 80 },
    },
  ],

  vrishabh: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "विश्राम और पारिवारिक सौहार्द",
      prediction:
        "आज का दिन परिवार के साथ सुकून से बिताने के लिए श्रेष्ठ है। घर के किसी पुराने विवाद का समाधान होगा। धन लाभ के योग बन रहे हैं।",
      luckyNumber: 6,
      luckyColor: "हल्का पीला (Light Yellow)",
      luckyTime: "09:00 AM - 11:00 AM",
      mood: "प्रसन्न 🌸",
      remedy: "सूर्य को अर्घ्य देकर माता-पिता का आशीर्वाद लें।",
      ratings: { career: 75, love: 90, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "स्थिरता और मानसिक स्पष्टता",
      prediction:
        "वित्तीय योजनाओं पर अमल करने के लिए बढ़िया दिन है। कार्यक्षेत्र में आपकी लगन की सराहना होगी। मन शांत रहेगा और तनाव में कमी आएगी।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "शांत 🍃",
      remedy: "शिवजी को श्वेत पुष्प अर्पित करें।",
      ratings: { career: 85, love: 80, health: 90, finance: 85 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "कार्यक्षेत्र में प्रगति",
      prediction:
        "आलस्य छोड़कर सक्रिय रहें। आपके प्रयास फलदायी साबित होंगे। मित्रों का पूरा सहयोग मिलेगा। निवेश के फैसले सोच-समझकर लें।",
      luckyNumber: 9,
      luckyColor: "नारंगी (Orange)",
      luckyTime: "03:00 PM - 05:00 PM",
      mood: "सक्रिय 🚀",
      remedy: "सुंदरकांड का पाठ करें या हनुमान चालीसा पढ़ें।",
      ratings: { career: 80, love: 75, health: 80, finance: 80 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "व्यापार में नया विस्तार",
      prediction:
        "आज किए गए संपर्क भविष्य में बड़ा लाभ देंगे। वाणी की मधुरता से बिगड़े काम भी बन जाएंगे। रचनात्मक कार्यों में मन लगेगा।",
      luckyNumber: 5,
      luckyColor: "हल्का हरा (Light Green)",
      luckyTime: "10:00 AM - 12:30 PM",
      mood: "सृजनात्मक 🎨",
      remedy: "गणपति बप्पा को मोदक या लड्डू का भोग लगाएं।",
      ratings: { career: 90, love: 85, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "ज्ञान और धन वृद्धि",
      prediction:
        "गुरुजनों और वरिष्ठों का मार्गदर्शन आपको सही दिशा देगा। अटका हुआ पैसा वापस मिलने की प्रबल संभावना है। स्वास्थ्य उत्तम रहेगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Golden Yellow)",
      luckyTime: "01:00 PM - 03:00 PM",
      mood: "आत्मविश्वासी ✨",
      remedy:
        "विष्णु सहस्रनाम का पाठ करें अथवा ॐ नमो भगवते वासुदेवाय का जाप करें।",
      ratings: { career: 85, love: 85, health: 85, finance: 95 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "आकर्षण और सुख-समृद्धि",
      prediction:
        "शुक्र आपकी राशि का स्वामी होने से आज का दिन अत्यंत शुभ है। सौंदर्य, कला और विलासिता से जुड़ी चीजों में आकर्षण बढ़ेगा। दांपत्य जीवन मधुर रहेगा।",
      luckyNumber: 6,
      luckyColor: "सिल्वर/सफेद (Silver White)",
      luckyTime: "05:00 PM - 07:30 PM",
      mood: "आनंदित 💖",
      remedy: "सफेद मिठाई का दान करें या मां दुर्गा को इत्र अर्पित करें।",
      ratings: { career: 90, love: 95, health: 90, finance: 90 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "दृढ़ संकल्प और सफलता",
      prediction:
        "कठिन कार्यों को भी आप अपनी लगन से पूरा कर लेंगे। पुराने कर्जों से मुक्ति का मार्ग निकलेगा। शाम के समय हल्का भोजन करें।",
      luckyNumber: 8,
      luckyColor: "गहरा नीला (Dark Blue)",
      luckyTime: "06:00 PM - 08:00 PM",
      mood: "गंभीर 🧐",
      remedy: "पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।",
      ratings: { career: 80, love: 75, health: 80, finance: 85 },
    },
  ],

  mithun: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "सामाजिक मेलजोल और मनोरंजन",
      prediction:
        "आज मित्रों और रिश्तेदारों से मेलजोल बढ़ेगा। नई जानकारी और ज्ञान हासिल करने का मौका मिलेगा। मन प्रसन्न रहेगा।",
      luckyNumber: 1,
      luckyColor: "नारंगी (Orange)",
      luckyTime: "08:30 AM - 10:30 AM",
      mood: "उमंग भरा 🌈",
      remedy: "तांबे के बर्तन में जल भरकर सूर्य को अर्पित करें।",
      ratings: { career: 80, love: 85, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "भावनात्मक संतुलन की आवश्यकता",
      prediction:
        "काम का दबाव थोड़ा रह सकता है, लेकिन धैर्य से सब संभाल लेंगे। किसी पुराने मित्र से बातचीत मन को हल्का करेगी।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "संवेदनशील 💭",
      remedy: "शिवजी का अभिषेक जल और अक्षत (चावल) से करें।",
      ratings: { career: 75, love: 80, health: 80, finance: 75 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "लक्ष्य प्राप्ति की दिशा में कदम",
      prediction:
        "आपके विचार स्पष्ट होंगे और निर्णय लेने की क्षमता मजबूत होगी। किसी नई योजना की शुरुआत के लिए समय अच्छा है।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "02:30 PM - 04:30 PM",
      mood: "दृढ़निश्चयी 🎯",
      remedy: "हनुमान जी को गुड़ और चने का भोग लगाएं।",
      ratings: { career: 85, love: 75, health: 85, finance: 80 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "सर्वोत्तम दिन - वाणी और व्यापार",
      prediction:
        "बुध की शुभ दृष्टि से आपकी बातचीत का प्रभाव लोगों पर गहरा पड़ेगा। इंटरव्यू, मीटिंग या प्रेजेंटेशन में शानदार सफलता मिलेगी।",
      luckyNumber: 5,
      luckyColor: "पन्ना हरा (Emerald Green)",
      luckyTime: "09:30 AM - 12:00 PM",
      mood: "शानदार 🌟",
      remedy: "गणेश अथर्वशीर्ष का पाठ करें और हरी मूंग दाल का दान करें।",
      ratings: { career: 95, love: 90, health: 90, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "शुभ समाचार और तरक्की",
      prediction:
        "करियर में पदोन्नति या नए प्रोजेक्ट के अवसर मिल सकते हैं। परिवार के साथ धार्मिक स्थल की यात्रा संभव है।",
      luckyNumber: 3,
      luckyColor: "केसरिया पीला (Saffron)",
      luckyTime: "10:00 AM - 12:00 PM",
      mood: "उत्साहित ☀️",
      remedy: "चने की दाल और गुड़ किसी ब्राह्मण या जरूरतमंद को दें।",
      ratings: { career: 90, love: 85, health: 80, finance: 85 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "रचनात्मकता और प्रेम संबंध",
      prediction:
        "कला, लेखन, मीडिया और संगीत से जुड़े लोगों को खास सफलता मिलेगी। जीवनसाथी के साथ रिश्ते में मिठास बढ़ेगी।",
      luckyNumber: 6,
      luckyColor: "गुलाबी (Pink)",
      luckyTime: "03:00 PM - 05:30 PM",
      mood: "खुशमिजाज 🎶",
      remedy: "मां लक्ष्मी को कमल का फूल या लाल गुलाब अर्पित करें।",
      ratings: { career: 85, love: 95, health: 85, finance: 85 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "रणनीतिक योजना और बचत",
      prediction:
        "भविष्य की वित्तीय योजनाओं को अंतिम रूप देने के लिए दिन उपयुक्त है। व्यर्थ के खर्चों पर लगाम लगाने में सफलता मिलेगी।",
      luckyNumber: 8,
      luckyColor: "स्लेटी / ग्रे (Grey)",
      luckyTime: "05:00 PM - 07:00 PM",
      mood: "गंभीर 📊",
      remedy: "काली उड़द की दाल का दान करें या पक्षियों को दाना डालें।",
      ratings: { career: 80, love: 75, health: 80, finance: 90 },
    },
  ],

  kark: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "आत्मबल और नई उम्मीदें",
      prediction:
        "परिवार का सहयोग आपको मानसिक संबल देगा। सेहत में अच्छा सुधार महसूस होगा। किसी पुराने मित्र से शुभ संदेश मिलेगा।",
      luckyNumber: 1,
      luckyColor: "केसरिया (Saffron)",
      luckyTime: "09:00 AM - 11:00 AM",
      mood: "सकारात्मक ☀️",
      remedy: "तांबे के पात्र से सूर्य को जल दें।",
      ratings: { career: 80, love: 85, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "चंद्र कृपा - मानसिक प्रसन्नता",
      prediction:
        "चंद्रमा आपकी राशि का स्वामी है। आज आपकी अंतर्दृष्टि (Intuition) बहुत सटीक रहेगी। माता का आशीर्वाद मिलेगा और अटके काम बनेंगे।",
      luckyNumber: 2,
      luckyColor: "दूधिया सफेद (Pearl White)",
      luckyTime: "08:00 AM - 10:30 AM",
      mood: "परम शांति 🕊️",
      remedy:
        "शिवजी को दूध मिश्रित जल अर्पित करें और चांदी का छल्ला धारण करें।",
      ratings: { career: 90, love: 90, health: 90, finance: 85 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "ऊर्जावान और निर्णय क्षमता",
      prediction:
        "जमीन-जायदाद या वाहन से जुड़े मामलों में प्रगति होगी। परिवार में किसी मांगलिक कार्यक्रम की चर्चा हो सकती है।",
      luckyNumber: 9,
      luckyColor: "लाल (Crimson Red)",
      luckyTime: "01:00 PM - 03:00 PM",
      mood: "ऊर्जावान ⚡",
      remedy: "हनुमान मंदिर में लाल ध्वज या सिंदूर दान करें।",
      ratings: { career: 85, love: 80, health: 85, finance: 80 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "बौद्धिक कार्यों में सफलता",
      prediction:
        "विद्यार्थियों के लिए अध्ययन में एकाग्रता बढ़ेगी। कार्यस्थल पर आपके विचारों का स्वागत होगा। लेन-देन में सावधानी रखें।",
      luckyNumber: 5,
      luckyColor: "हरा (Green)",
      luckyTime: "10:30 AM - 12:30 PM",
      mood: "जागरूक 📚",
      remedy: "गणेश जी को 21 दूर्वा की गांठ चढ़ाएं।",
      ratings: { career: 80, love: 80, health: 80, finance: 85 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "आध्यात्मिक सुख और सम्मान",
      prediction:
        "गुरु की कृपा से मान-सम्मान में चार चांद लगेंगे। सामाजिक कार्यों में सहभागिता बढ़ेगी। आर्थिक स्थिति सुदृढ़ रहेगी।",
      luckyNumber: 3,
      luckyColor: "पीला (Bright Yellow)",
      luckyTime: "11:30 AM - 01:30 PM",
      mood: "प्रसन्नचित्त 🌼",
      remedy: "केसर का तिलक लगाएं और भगवान विष्णु को पीले फूल चढ़ाएं।",
      ratings: { career: 90, love: 85, health: 85, finance: 90 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "सुख-सुविधा और मिठास",
      prediction:
        "घर में साज-सज्जा या नए सामान की खरीदारी हो सकती है। प्रेम जीवन में आपसी समझ और रोमांस बढ़ेगा।",
      luckyNumber: 6,
      luckyColor: "क्रीम / सफेद (Cream White)",
      luckyTime: "04:00 PM - 06:00 PM",
      mood: "मधुर 💖",
      remedy: "देवी मां को मिश्री और मखाने का भोग लगाएं।",
      ratings: { career: 80, love: 95, health: 85, finance: 80 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "कर्तव्यनिष्ठा और कार्यसिद्धि",
      prediction:
        "आज पुराने लंबित कार्य पूरे होंगे। सेहत के प्रति सजग रहें और योग-प्राणायाम करें। शाम को मानसिक शांति मिलेगी।",
      luckyNumber: 8,
      luckyColor: "गहरा नीला (Navy Blue)",
      luckyTime: "05:30 PM - 07:30 PM",
      mood: "गंभीर व शांत 🌌",
      remedy: "शनि चालीसा का पाठ करें और काले तिल जल में प्रवाहित करें।",
      ratings: { career: 85, love: 75, health: 80, finance: 80 },
    },
  ],

  singh: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "सूर्य देव की विशेष कृपा - नेतृत्व और तेज",
      prediction:
        "सूर्य आपकी राशि के स्वामी हैं। आज आपका तेज और प्रभाव सबसे ऊपर रहेगा। अधिकारियों का पूरा सहयोग मिलेगा। रुके हुए सरकारी काम पूरे होंगे।",
      luckyNumber: 1,
      luckyColor: "सुनहरा (Golden / Orange)",
      luckyTime: "07:30 AM - 09:30 AM",
      mood: "तेजस्वी 👑",
      remedy: "आदित्य हृदय स्तोत्र का पाठ करें और सूर्य नमस्कार करें।",
      ratings: { career: 95, love: 85, health: 95, finance: 90 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "भावुकता पर नियंत्रण रखें",
      prediction:
        "कार्यक्षेत्र में योजनाओं पर ध्यान केंद्रित रखें। दूसरों की बातों में आकर अपना मूड खराब न करें। परिवार का साथ मिलेगा।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "10:00 AM - 12:00 PM",
      mood: "संयमित 🧘‍♂️",
      remedy: "शिवलिंग पर जल चढ़ाएं और ॐ सोम सोमाय नमः का जाप करें।",
      ratings: { career: 80, love: 80, health: 80, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "साहस और विजय का दिन",
      prediction:
        "कोर्ट-कचहरी या विवादित मामलों में आपके पक्ष में परिणाम आ सकते हैं। खेलकूद या प्रतिस्पर्धी परीक्षाओं में अच्छा प्रदर्शन रहेगा।",
      luckyNumber: 9,
      luckyColor: "लाल (Bright Red)",
      luckyTime: "01:30 PM - 03:30 PM",
      mood: "विजयी 🏆",
      remedy: "बजरंग बाण का पाठ करें और सिंदूर लगाएं।",
      ratings: { career: 90, love: 75, health: 90, finance: 85 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "नेटवर्किंग और वित्तीय अवसर",
      prediction:
        "व्यापार में नए साझेदार मिल सकते हैं। आपकी योजनाएं तेजी से आगे बढ़ेंगी। किसी वरिष्ठ व्यक्ति से मूल्यवान मार्गदर्शन मिलेगा।",
      luckyNumber: 5,
      luckyColor: "हल्का हरा (Light Green)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "प्रभावी 💡",
      remedy: "गणेश जी को मोदक चढ़ाएं और 'ॐ गं गणपतये नमः' का जाप करें।",
      ratings: { career: 85, love: 80, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "मान-सम्मान और पद प्रतिष्ठा",
      prediction:
        "समाज में आपकी प्रतिष्ठा में वृद्धि होगी। उच्च अधिकारियों या गुरुजनों की कृपा से तरक्की का मार्ग खुलेगा। धन लाभ होगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Royal Gold)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "गौरवान्वित 🌟",
      remedy: "केसर मिश्रित दूध का भोग भगवान विष्णु को लगाएं।",
      ratings: { career: 90, love: 85, health: 85, finance: 95 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "आनंद, प्रेम और विलासिता",
      prediction:
        "पार्टनर के साथ घूमने-फिरने का प्रोग्राम बन सकता है। घर में सुख-शांति बनी रहेगी। खरीदारी में धन व्यय हो सकता है।",
      luckyNumber: 6,
      luckyColor: "गुलाबी / सफेद (Pink/White)",
      luckyTime: "03:30 PM - 06:00 PM",
      mood: "रोमांटिक 💖",
      remedy: "मां दुर्गा को लाल चुनरी या फूल अर्पित करें।",
      ratings: { career: 80, love: 95, health: 85, finance: 80 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "धैर्य से काम लें",
      prediction:
        "आज जल्दबाजी में कोई फैसला न लें। काम को योजनाबद्ध तरीके से करें। पुराने कर्मों का सकारात्मक फल प्राप्त होगा।",
      luckyNumber: 8,
      luckyColor: "गहरा नीला (Dark Navy)",
      luckyTime: "06:00 PM - 08:00 PM",
      mood: "धैर्यवान 🛡️",
      remedy: "शनि चालीसा पढ़ें और काले कुत्ते को रोटी खिलाएं।",
      ratings: { career: 80, love: 75, health: 80, finance: 80 },
    },
  ],

  kanya: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "आराम और स्वास्थ्य पर ध्यान",
      prediction:
        "काम की व्यस्तता से थोड़ा ब्रेक लेकर आराम करें। खान-पान में पौष्टिकता का ध्यान रखें। परिजनों के साथ विचार साझा करें।",
      luckyNumber: 1,
      luckyColor: "हल्का नारंगी (Soft Orange)",
      luckyTime: "08:00 AM - 10:00 AM",
      mood: "सुकून भरा 🌿",
      remedy: "सूर्य देव को तांबे के लोटे से जल दें।",
      ratings: { career: 75, love: 80, health: 90, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "कार्यक्षेत्र में फोकस",
      prediction:
        "आज आपकी कार्यकुशलता चरम पर रहेगी। जटिल समस्याओं का सरल समाधान निकाल लेंगे। सहकर्मियों से तालमेल अच्छा रहेगा।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "10:30 AM - 12:30 PM",
      mood: "केंद्रित 🎯",
      remedy: "शिवलिंग पर जल और बेलपत्र अर्पित करें।",
      ratings: { career: 90, love: 80, health: 85, finance: 85 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "उत्साह और नई ऊर्जा",
      prediction:
        "लंबे समय से रुका हुआ काम गति पकड़ेगा। आत्मविश्वास में वृद्धि होगी। किसी अनजान व्यक्ति पर अत्यधिक भरोसा न करें।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "02:00 PM - 04:00 PM",
      mood: "स्फूर्तिवान ⚡",
      remedy: "हनुमान जी को सिंदूर और चमेली का तेल चढ़ाएं।",
      ratings: { career: 85, love: 75, health: 85, finance: 80 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "बुध की राशि - व्यापार में उछाल",
      prediction:
        "बुध आपकी राशि के स्वामी हैं। आज विश्लेषण, एकाउंट्स, कोडिंग और बिजनेस में अभूतपूर्व सफलता मिलेगी। धन आगमन के स्रोत बनेंगे।",
      luckyNumber: 5,
      luckyColor: "गहरा हरा (Forest Green)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "अति प्रसन्न 🌟",
      remedy: "गणपति को दूर्वा की 21 पत्तियां चढ़ाएं और हरी मूंग दान करें।",
      ratings: { career: 95, love: 85, health: 90, finance: 95 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "विद्या और ज्ञान का लाभ",
      prediction:
        "शिक्षा और अनुसंधान से जुड़े लोगों के लिए आज का दिन विशेष फलदायी रहेगा। किसी महत्वपूर्ण योजना में सफलता मिलेगी।",
      luckyNumber: 3,
      luckyColor: "पीला (Lemon Yellow)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "विद्वान 📖",
      remedy:
        "भगवान विष्णु को तुलसी पत्र अर्पित करें और 'ॐ नमो भगवते वासुदेवाय' का जाप करें।",
      ratings: { career: 85, love: 85, health: 85, finance: 85 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "सौंदर्य, कला और रिश्ते",
      prediction:
        "घर-परिवार में मांगलिक माहौल रहेगा। दोस्तों के साथ हंसी-मजाक में समय बीतेगा। आर्थिक स्थिति मजबूत रहेगी।",
      luckyNumber: 6,
      luckyColor: "गुलाबी (Pink)",
      luckyTime: "04:00 PM - 06:30 PM",
      mood: "प्रसन्न 🌸",
      remedy: "मां लक्ष्मी को खीर का भोग लगाएं।",
      ratings: { career: 80, love: 95, health: 85, finance: 85 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "स्थिरता और समझदारी",
      prediction:
        "भविष्य की बचत योजनाओं पर काम करें। किसी भी विवाद में अपनी तटस्थता बनाए रखें। सेहत का ध्यान रखें।",
      luckyNumber: 8,
      luckyColor: "नीला (Steel Blue)",
      luckyTime: "05:00 PM - 07:00 PM",
      mood: "संतुलित ⚖️",
      remedy: "सरसों के तेल का दीया पीपल वृक्ष के समीप रखें।",
      ratings: { career: 85, love: 75, health: 80, finance: 80 },
    },
  ],

  tula: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "संतुलन और सामाजिक सम्मान",
      prediction:
        "जीवन में संतुलन बनाए रखने में सफल होंगे। सामाजिक आयोजनों में आपकी उपस्थिति की सराहना होगी। मन शांत रहेगा।",
      luckyNumber: 1,
      luckyColor: "सुनहरा (Golden)",
      luckyTime: "08:30 AM - 10:30 AM",
      mood: "सद्भाव 🕊️",
      remedy: "सूर्य को जल में थोड़ा रोली डालकर अर्घ्य दें।",
      ratings: { career: 80, love: 85, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "मानसिक शांति और साझेदारी",
      prediction:
        "साझेदारी के काम में लाभ होगा। जीवनसाथी के साथ सामंजस्य बढ़ेगा। कार्यस्थल पर वातावरण सुखद रहेगा।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "शांत 🌊",
      remedy: "शिवजी को सफेद फूल और कच्चा दूध अर्पित करें।",
      ratings: { career: 85, love: 90, health: 85, finance: 85 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "ऊर्जा और साहस",
      prediction:
        "आर्थिक निर्णयों में तेजी लाएं। आलस्य को हावी न होने दें। कानूनी मामलों में स्थिति आपके पक्ष में होगी।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "01:30 PM - 03:30 PM",
      mood: "सक्रिय ⚡",
      remedy: "हनुमान चालीसा का पाठ करें।",
      ratings: { career: 85, love: 75, health: 85, finance: 80 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "रचनात्मक विचार और संचार",
      prediction:
        "मार्केटिंग, मीडिया और कम्युनिकेशन से जुड़े लोगों को बेहतरीन अवसर मिलेंगे। नए लोगों से संपर्क लाभदायक होगा।",
      luckyNumber: 5,
      luckyColor: "हरा (Turquoise Green)",
      luckyTime: "10:00 AM - 12:00 PM",
      mood: "उत्सुक 💡",
      remedy: "गणेश जी को हरी इलायची अर्पित करें।",
      ratings: { career: 85, love: 85, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "गुरु कृपा और सौभाग्य",
      prediction:
        "अध्यात्म और धर्म में रुचि बढ़ेगी। धन लाभ के नए साधन बनेंगे। परिवार के वरिष्ठ सदस्यों का आशीर्वाद मिलेगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Bright Yellow)",
      luckyTime: "09:30 AM - 11:30 AM",
      mood: "आनंदित 🌟",
      remedy: "विष्णु मंदिर में पीले फल या बेसन के लड्डू चढ़ाएं।",
      ratings: { career: 90, love: 85, health: 85, finance: 90 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "शुक्र का दिन - आकर्षण और वैभव",
      prediction:
        "शुक्र आपकी राशि के स्वामी हैं। आज व्यक्तित्व में जबरदस्त निखार आएगा। प्रेम संबंध और दांपत्य जीवन में गहरा प्यार रहेगा।",
      luckyNumber: 6,
      luckyColor: "चमकीला सफेद / गुलाबी (Shimmer Pink)",
      luckyTime: "04:00 PM - 07:00 PM",
      mood: "मनमोहक 💖",
      remedy: "सफेद गाय को रोटी खिलाएं या मां लक्ष्मी की आरती करें।",
      ratings: { career: 90, love: 95, health: 90, finance: 90 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "शनि कृपा - कर्म का शुभ फल",
      prediction:
        "तुला राशि के लिए शनि योगकारक ग्रह हैं। आज आपकी मेहनत का पूरा श्रेय आपको मिलेगा। रियल एस्टेट और तकनीकी कार्यों में लाभ।",
      luckyNumber: 8,
      luckyColor: "नीला (Royal Blue)",
      luckyTime: "05:00 PM - 07:30 PM",
      mood: "संतुष्ट 🎯",
      remedy: "शनि देव के बीज मंत्र 'ॐ शं शनैश्चराय नमः' का जाप करें।",
      ratings: { career: 90, love: 80, health: 80, finance: 85 },
    },
  ],

  vrishchik: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "आत्मविश्वास और आंतरिक शक्ति",
      prediction:
        "आज आप मानसिक रूप से अत्यंत मजबूत महसूस करेंगे। नई योजनाओं को शुरू करने के लिए दिन अच्छा है। स्वास्थ्य उत्तम रहेगा।",
      luckyNumber: 9,
      luckyColor: "केसरिया (Saffron)",
      luckyTime: "08:00 AM - 10:00 AM",
      mood: "प्रबल 🦁",
      remedy: "सूर्य देव को लाल फूल डालकर जल अर्पित करें।",
      ratings: { career: 85, love: 80, health: 90, finance: 85 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "अंतर्ज्ञान और रहस्य सुलझेंगे",
      prediction:
        "आपकी सोच गहरी और सटीक रहेगी। अनुसंधान और गुप्त विद्याओं में रुचि बढ़ेगी। माता का सहयोग मिलेगा।",
      luckyNumber: 2,
      luckyColor: "दूधिया सफेद (Milky White)",
      luckyTime: "10:30 AM - 12:30 PM",
      mood: "गंभीर 🔮",
      remedy: "शिवलिंग पर जल चढ़ाएं और 'ॐ नमः शिवाय' का 108 बार जाप करें।",
      ratings: { career: 80, love: 85, health: 85, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "मंगल की राशि - असीम पराक्रम",
      prediction:
        "मंगल आपकी राशि के स्वामी हैं। आज कोई भी चुनौती आपको रोक नहीं पाएगी। व्यापार में बड़ा जोखिम भी लाभदायक रहेगा।",
      luckyNumber: 1,
      luckyColor: "लाल (Deep Red)",
      luckyTime: "01:00 PM - 03:30 PM",
      mood: "अजेय ⚡",
      remedy: "हनुमान बाहुक या सुंदरकांड का पाठ करें।",
      ratings: { career: 95, love: 80, health: 90, finance: 90 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "चतुराई और वित्तीय लाभ",
      prediction:
        "व्यवसाय में चातुर्य से लाभ कमाएंगे। शेयर बाजार या निवेश से जुड़े मामलों में सकारात्मक संकेत मिलेंगे।",
      luckyNumber: 5,
      luckyColor: "हरा (Green)",
      luckyTime: "09:30 AM - 11:30 AM",
      mood: "तेज 🧠",
      remedy: "गणपति बप्पा को 5 मोदक का भोग लगाएं।",
      ratings: { career: 85, love: 80, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "भाग्य और गुरु कृपा",
      prediction:
        "धार्मिक यात्रा का योग बन सकता है। उच्च शिक्षा और करियर में उन्नति होगी। धन का प्रवाह सुगम रहेगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Yellow)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "आध्यात्मिक 🌟",
      remedy:
        "बृहस्पति देव के मंत्र 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' का जाप करें।",
      ratings: { career: 90, love: 85, health: 85, finance: 90 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "सुख-साधन और आकर्षण",
      prediction:
        "प्रेम जीवन में आकर्षण और गहरा जुड़ाव महसूस होगा। परिवार में खुशियों का माहौल रहेगा। खरीदारी पर खर्च हो सकता है।",
      luckyNumber: 6,
      luckyColor: "गुलाबी (Pastel Pink)",
      luckyTime: "03:30 PM - 06:00 PM",
      mood: "रोमांटिक 💖",
      remedy: "मां लक्ष्मी को सुगन्धित धूप और लाल पुष्प अर्पित करें।",
      ratings: { career: 80, love: 95, health: 85, finance: 80 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "धैर्य और गोपनीयता बनाए रखें",
      prediction:
        "अपनी योजनाओं को गुप्त रखें। जल्दबाजी में प्रतिक्रिया देने से बचें। शाम को मनपसंद संगीत सुनकर तनाव दूर करें।",
      luckyNumber: 8,
      luckyColor: "काला / गहरा नीला (Dark Blue)",
      luckyTime: "06:00 PM - 08:00 PM",
      mood: "गंभीर 🤫",
      remedy: "शनि देव को सरसों का तेल चढ़ाएं और गरीबों की मदद करें।",
      ratings: { career: 80, love: 75, health: 80, finance: 80 },
    },
  ],

  dhanu: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "ऊर्जा, उत्साह और लक्ष्य",
      prediction:
        "दूरगामी लक्ष्यों को तय करने के लिए शानदार दिन है। आत्मविश्वास से भरे रहेंगे। सामाजिक प्रतिष्ठा बढ़ेगी।",
      luckyNumber: 1,
      luckyColor: "केसरिया (Saffron)",
      luckyTime: "08:30 AM - 10:30 AM",
      mood: "उमंग भरा 🏹",
      remedy: "सूर्य को रोली और चावल मिलाकर अर्घ्य दें।",
      ratings: { career: 85, love: 80, health: 90, finance: 85 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "मानसिक शांति और परिवार",
      prediction:
        "घर-परिवार में सुख-शांति रहेगी। माता के स्वास्थ्य में सुधार होगा। वित्तीय मामलों में स्थिरता बनी रहेगी।",
      luckyNumber: 2,
      luckyColor: "क्रीम (Cream)",
      luckyTime: "10:00 AM - 12:00 PM",
      mood: "प्रशांत 🕊️",
      remedy: "शिवजी को पंचामृत से स्नान कराएं।",
      ratings: { career: 80, love: 85, health: 85, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "साहस और ऊर्जा का संचार",
      prediction:
        "कार्यक्षेत्र में आपकी नेतृत्व क्षमता की प्रशंसा होगी। पुराने विवाद सुलझेंगे। मित्रों से भरपूर सहयोग मिलेगा।",
      luckyNumber: 9,
      luckyColor: "लाल (Bright Red)",
      luckyTime: "01:30 PM - 03:30 PM",
      mood: "साहसी ⚡",
      remedy: "हनुमान जी को सिंदूर लगाएं और बूंदी का प्रसाद बांटें।",
      ratings: { career: 90, love: 80, health: 85, finance: 85 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "ज्ञान, अध्ययन और संवाद",
      prediction:
        "विद्यार्थियों के लिए उत्तम दिन है। नई भाषा या स्किल सीखने का अवसर मिलेगा। व्यापार में नए ग्राहक जुड़ेंगे।",
      luckyNumber: 5,
      luckyColor: "हल्का हरा (Light Green)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "जिज्ञासु 📚",
      remedy: "गणेश जी को दूर्वा चढ़ाएं और मूंग के लड्डू का भोग लगाएं।",
      ratings: { career: 85, love: 80, health: 85, finance: 85 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "गुरु की राशि - भाग्योदय का दिन",
      prediction:
        "गुरु आपकी राशि के स्वामी हैं। आज आपका हर कार्य सफल होगा। धन, सम्मान, यश और सुख-शांति में अप्रत्याशित वृद्धि होगी।",
      luckyNumber: 3,
      luckyColor: "पीला / स्वर्णिम (Gold/Yellow)",
      luckyTime: "09:30 AM - 12:00 PM",
      mood: "आनंद विभोर 🌟",
      remedy: "केले के पेड़ की पूजा करें और माथे पर केसर/चंदन का तिलक लगाएं।",
      ratings: { career: 95, love: 90, health: 90, finance: 95 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "मनोरंजन और प्रेम संबंध",
      prediction:
        "पार्टनर के साथ सुखद और यादगार समय बीतेगा। कला और संगीत में रुचि बढ़ेगी। नया वस्त्र या आभूषण खरीद सकते हैं।",
      luckyNumber: 6,
      luckyColor: "गुलाबी (Pink)",
      luckyTime: "03:30 PM - 06:00 PM",
      mood: "प्रसन्न 💖",
      remedy: "मां महालक्ष्मी की पूजा करें और श्वेत मिठाई का भोग लगाएं।",
      ratings: { career: 80, love: 95, health: 85, finance: 85 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "अनुशासन और योजनाबद्ध कार्य",
      prediction:
        "योजना बनाकर काम करेंगे तो बड़ी सफलता हासिल होगी। पुराने निवेश से अप्रत्याशित लाभ मिल सकता है।",
      luckyNumber: 8,
      luckyColor: "नीला (Navy Blue)",
      luckyTime: "05:00 PM - 07:30 PM",
      mood: "अनुशासित 🎯",
      remedy: "शनि चालीसा का पाठ करें और काले तिल का दान करें।",
      ratings: { career: 85, love: 75, health: 80, finance: 90 },
    },
  ],

  makar: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "लक्ष्य प्राप्ति और आत्मबल",
      prediction:
        "आज अपने लक्ष्यों पर पुनर्विचार करने का सही समय है। सरकारी क्षेत्र से लाभ मिलने के आसार हैं। स्वास्थ्य अच्छा रहेगा।",
      luckyNumber: 1,
      luckyColor: "तांबई नारंगी (Copper Orange)",
      luckyTime: "08:00 AM - 10:00 AM",
      mood: "दृढ़ 🏛️",
      remedy:
        "सूर्य देव को तांबे के लोटे से जल दें और गायत्री मंत्र का जाप करें।",
      ratings: { career: 85, love: 75, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "मानसिक शांति और सौहार्द",
      prediction:
        "कार्यक्षेत्र में धैर्य से काम लें। परिवार के साथ बैठकर बातचीत करने से तनाव दूर होगा। खानपान में हल्का भोजन लें।",
      luckyNumber: 2,
      luckyColor: "सफेद (White)",
      luckyTime: "10:30 AM - 12:30 PM",
      mood: "शांत 🧘",
      remedy: "शिवजी को जल और अक्षत चढ़ाएं।",
      ratings: { career: 80, love: 80, health: 80, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "कार्य में गति और दृढ़ता",
      prediction:
        "रुके हुए प्रोजेक्ट्स में तेजी आएगी। संपत्ति और रियल एस्टेट से जुड़े मामलों में शुभ संकेत मिलेंगे।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "02:00 PM - 04:00 PM",
      mood: "ऊर्जावान ⚡",
      remedy: "हनुमान जी के दर्शन करें और लाल सिंदूर का तिलक लगाएं।",
      ratings: { career: 85, love: 75, health: 85, finance: 85 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "व्यापारिक सूझबूझ और लाभ",
      prediction:
        "बुद्धि-चातुर्य से कठिन काम भी सरलता से पूर्ण कर लेंगे। व्यावसायिक यात्रा लाभदायक रहेगी।",
      luckyNumber: 5,
      luckyColor: "हरा (Emerald Green)",
      luckyTime: "09:30 AM - 11:30 AM",
      mood: "सटीक 🎯",
      remedy: "गणपति बप्पा को हरी घास (दूर्वा) चढ़ाएं।",
      ratings: { career: 90, love: 80, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "गुरु कृपा और ज्ञान संचय",
      prediction:
        "वरिष्ठजनों से सीखने का अवसर मिलेगा। समाज में प्रतिष्ठा बढ़ेगी। आर्थिक स्थिति में सुधार होगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Mustard Yellow)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "संतुलित 🌟",
      remedy: "भगवान विष्णु को पीले पुष्प अर्पित करें।",
      ratings: { career: 85, love: 85, health: 85, finance: 85 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "वैभव और प्रेम संबंध",
      prediction:
        "घर-परिवार में खुशियों का माहौल रहेगा। भौतिक साधनों में वृद्धि होगी। साथी का भरपूर प्यार मिलेगा।",
      luckyNumber: 6,
      luckyColor: "सफेद / हल्का नीला (Sky Blue)",
      luckyTime: "03:30 PM - 06:00 PM",
      mood: "प्रसन्न 💖",
      remedy: "मां लक्ष्मी को खीर का भोग लगाएं और कन्याओं का आदर करें।",
      ratings: { career: 85, love: 90, health: 85, finance: 85 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "शनि की राशि - कर्म का संपूर्ण फल",
      prediction:
        "शनि आपकी राशि के स्वामी हैं। आज की गई मेहनत लंबे समय तक लाभ देगी। करियर में नए आयाम स्थापित होंगे।",
      luckyNumber: 8,
      luckyColor: "नीला / काला (Royal Navy)",
      luckyTime: "05:00 PM - 08:00 PM",
      mood: "विजयी 👑",
      remedy:
        "शनि मंदिर में तेल का दीपक जलाएं और 'ॐ शं शनैश्चराय नमः' का जाप करें।",
      ratings: { career: 95, love: 80, health: 85, finance: 90 },
    },
  ],

  kumbh: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "नवाचार और रचनात्मक विचार",
      prediction:
        "आज नए और अनोखे विचार आपके मन में आएंगे। सामाजिक कार्यों में रुचि बढ़ेगी। मित्रों का साथ मिलेगा।",
      luckyNumber: 1,
      luckyColor: "नारंगी (Bright Orange)",
      luckyTime: "08:30 AM - 10:30 AM",
      mood: "रचनात्मक 💡",
      remedy: "सूर्य को तांबे के पात्र से अर्घ्य दें।",
      ratings: { career: 80, love: 80, health: 85, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "भावनात्मक संतुलन और शांति",
      prediction:
        "मन को स्थिर रखकर काम करें। किसी विवाद से दूर रहें। शाम को ध्यान या योग से शांति मिलेगी।",
      luckyNumber: 2,
      luckyColor: "सफेद (Pearl White)",
      luckyTime: "10:00 AM - 12:00 PM",
      mood: "शांत 🌊",
      remedy: "शिवलिंग पर जल और सफेद चंदन अर्पित करें।",
      ratings: { career: 80, love: 85, health: 80, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "साहसिक निर्णय और सफलता",
      prediction:
        "तकनीकी और रचनात्मक कार्यों में बड़ी सफलता मिलने के योग हैं। आत्मविश्वास से भरे रहेंगे।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "01:30 PM - 03:30 PM",
      mood: "ऊर्जावान ⚡",
      remedy: "हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।",
      ratings: { career: 85, love: 75, health: 85, finance: 85 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "नेटवर्किंग और वित्तीय प्रगति",
      prediction:
        "इंटरनेट, मीडिया और संचार से जुड़े लोगों को शानदार लाभ होगा। नए मित्र और व्यावसायिक सहयोगी बनेंगे।",
      luckyNumber: 5,
      luckyColor: "हरा (Teal Green)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "सक्रिय 🌐",
      remedy: "गणपति जी को दूर्वा अर्पित करें।",
      ratings: { career: 90, love: 85, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "अध्यात्म और उच्च सोच",
      prediction:
        "ज्ञान और अनुभव का सही उपयोग करेंगे। आर्थिक स्थिति मजबूत होगी। परिवार में खुशी का माहौल रहेगा।",
      luckyNumber: 3,
      luckyColor: "पीला (Yellow)",
      luckyTime: "11:00 AM - 01:00 PM",
      mood: "आनंदित 🌟",
      remedy: "भगवान विष्णु को पीले फूल चढ़ाएं और चने की दाल का दान करें।",
      ratings: { career: 85, love: 85, health: 85, finance: 90 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "कला, प्रेम और सुख-सुविधा",
      prediction:
        "प्रेम संबंधों में प्रगाढ़ता आएगी। कलात्मक कार्यों में प्रशंसा मिलेगी। मनपसंद भोजन का आनंद लेंगे।",
      luckyNumber: 6,
      luckyColor: "गुलाबी / आसमानी (Pink/Sky Blue)",
      luckyTime: "03:30 PM - 06:00 PM",
      mood: "रोमांटिक 💖",
      remedy: "मां लक्ष्मी की पूजा करें और इत्र का उपयोग करें।",
      ratings: { career: 85, love: 95, health: 85, finance: 85 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "शनि की राशि - अप्रत्याशित सफलता",
      prediction:
        "शनि आपकी राशि के स्वामी हैं। आज आपकी योजनाएं पूर्णता प्राप्त करेंगी। समाज में मान-सम्मान बढ़ेगा।",
      luckyNumber: 8,
      luckyColor: "गहरा नीला / जामुनी (Purple/Navy)",
      luckyTime: "05:00 PM - 07:30 PM",
      mood: "विजयी 👑",
      remedy: "पीपल के नीचे सरसों के तेल का दीपक लगाएं और छाया दान करें।",
      ratings: { career: 95, love: 80, health: 85, finance: 90 },
    },
  ],

  meen: [
    // 0: Sunday
    {
      day: "Sunday",
      dayHindi: "रविवार",
      title: "आध्यात्मिक शांति और आत्मचिंतन",
      prediction:
        "आज का दिन आत्म-अवलोकन और शांति के लिए श्रेष्ठ है। परिवार के साथ सुखद समय बीतेगा। सकारात्मक ऊर्जा महसूस होगी।",
      luckyNumber: 1,
      luckyColor: "नारंगी (Golden Orange)",
      luckyTime: "08:00 AM - 10:00 AM",
      mood: "शांत व ध्यानमग्न 🧘‍♀️",
      remedy: "सूर्य को जल अर्पित करें और 'ॐ घृणि सूर्याय नमः' का जाप करें।",
      ratings: { career: 80, love: 85, health: 90, finance: 80 },
    },
    // 1: Monday
    {
      day: "Monday",
      dayHindi: "सोमवार",
      title: "संवेदनशीलता और अंतर्दृष्टि",
      prediction:
        "आपकी कल्पनाशीलता और अंतर्ज्ञान मजबूत रहेगा। संगीत, कला या लेखन में मन लगेगा। माता का विशेष स्नेह मिलेगा।",
      luckyNumber: 2,
      luckyColor: "दूधिया सफेद (Pearl White)",
      luckyTime: "10:30 AM - 12:30 PM",
      mood: "भावुक व सहज 🌊",
      remedy: "शिवलिंग पर कच्चा दूध और जल चढ़ाएं।",
      ratings: { career: 85, love: 90, health: 85, finance: 80 },
    },
    // 2: Tuesday
    {
      day: "Tuesday",
      dayHindi: "मंगलवार",
      title: "पराक्रम और रुकावटों का अंत",
      prediction:
        "कठिन से कठिन बाधा को आप अपनी समझदारी और साहस से पार कर लेंगे। मित्रों का भरपूर साथ मिलेगा।",
      luckyNumber: 9,
      luckyColor: "लाल (Red)",
      luckyTime: "01:30 PM - 03:30 PM",
      mood: "उत्साही ⚡",
      remedy: "हनुमान मंदिर में दर्शन करें और लाल फूल चढ़ाएं।",
      ratings: { career: 85, love: 80, health: 85, finance: 85 },
    },
    // 3: Wednesday
    {
      day: "Wednesday",
      dayHindi: "बुधवार",
      title: "व्यापार में नया अनुबंध",
      prediction:
        "व्यापारियों के लिए नए समझौतों का दिन है। बुद्धि-कौशल से धन लाभ होगा। छात्रों को पढ़ाई में सफलता मिलेगी।",
      luckyNumber: 5,
      luckyColor: "हरा (Sea Green)",
      luckyTime: "09:30 AM - 11:30 AM",
      mood: "प्रसन्न 📚",
      remedy: "गणपति को मोदक और दूर्वा अर्पित करें।",
      ratings: { career: 85, love: 80, health: 85, finance: 90 },
    },
    // 4: Thursday
    {
      day: "Thursday",
      dayHindi: "गुरुवार",
      title: "गुरु की राशि - परम सौभाग्य और धन लाभ",
      prediction:
        "बृहस्पति आपकी राशि के स्वामी हैं। आज आपका दिन अत्यंत फलदायी रहेगा। करियर में पदोन्नति, धन लाभ और मान-सम्मान की प्राप्ति होगी।",
      luckyNumber: 3,
      luckyColor: "पीला / केसरिया (Bright Yellow/Saffron)",
      luckyTime: "09:00 AM - 11:30 AM",
      mood: "परम आनंद 🌟",
      remedy:
        "भगवान विष्णु को बेसन के लड्डू चढ़ाएं और 'ॐ नमो भगवते वासुदेवाय' का 108 बार जाप करें।",
      ratings: { career: 95, love: 90, health: 90, finance: 95 },
    },
    // 5: Friday
    {
      day: "Friday",
      dayHindi: "शुक्रवार",
      title: "रोमांस और सौंदर्य",
      prediction:
        "मीन राशि में शुक्र उच्च के होते हैं। आज आपका आकर्षण और प्रेम संबंध शिखर पर रहेंगे। वैवाहिक जीवन में मधुरता आएगी।",
      luckyNumber: 6,
      luckyColor: "गुलाबी / सफेद (Soft Pink)",
      luckyTime: "04:00 PM - 06:30 PM",
      mood: "रोमांटिक 💖",
      remedy:
        "मां लक्ष्मी को कमल या गुलाब का फूल अर्पित करें और खीर का भोग लगाएं।",
      ratings: { career: 85, love: 95, health: 90, finance: 90 },
    },
    // 6: Saturday
    {
      day: "Saturday",
      dayHindi: "शनिवार",
      title: "धैर्य और दीर्घकालिक लाभ",
      prediction:
        "आज जल्दबाजी के बजाय धैर्य से काम लें। लंबी अवधि के निवेश में लाभ होगा। आध्यात्मिक कार्यों से मन को शांति मिलेगी।",
      luckyNumber: 8,
      luckyColor: "नीला (Navy Blue)",
      luckyTime: "05:00 PM - 07:30 PM",
      mood: "गंभीर व शांत 🌌",
      remedy: "शनि चालीसा का पाठ करें और काले तिल का दान करें।",
      ratings: { career: 85, love: 75, health: 80, finance: 85 },
    },
  ],
};
