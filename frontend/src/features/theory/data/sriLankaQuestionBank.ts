import type { TheoryQuestion } from '../types/theory'

export const SRI_LANKA_DMT_QUESTION_BANK: TheoryQuestion[] = [
  // -------------------------------------------------------------
  // 1. Regulatory Road Signs
  // -------------------------------------------------------------
  {
    id: 'q-reg-01',
    category: 'road_signs_regulatory',
    question_text:
      'What does an octagonal red sign with the word "STOP" mean to a driver in Sri Lanka?',
    image_url: '🛑',
    options: [
      'Slow down and proceed if the road is clear',
      'Come to a complete stop before the stop line and yield right of way to all traffic',
      'Stop only if there is a traffic police officer present',
      'Stop for 5 seconds and then accelerate',
    ],
    correct_option_index: 1,
    explanation:
      'The STOP sign is an absolute mandatory regulatory sign. The driver must come to a complete stop before the line and proceed only when clear.',
    translations: {
      en: {
        question_text:
          'What does an octagonal red sign with the word "STOP" mean to a driver in Sri Lanka?',
        options: [
          'Slow down and proceed if the road is clear',
          'Come to a complete stop before the stop line and yield right of way to all traffic',
          'Stop only if there is a traffic police officer present',
          'Stop for 5 seconds and then accelerate',
        ],
        explanation:
          'The STOP sign is an absolute mandatory regulatory sign. The driver must come to a complete stop before the line and proceed only when clear.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ රියදුරෙකුට "STOP" (නවත්වන්න) යනුවෙන් සඳහන් අෂ්ටාස්‍රාකාර රතු සංඥාවෙන් අදහස් වන්නේ කුමක්ද?',
        options: [
          'වේගය අඩු කර මාර්ගය පැහැදිලි නම් ඉදිරියට ධාවනය කිරීම',
          'නැවතුම් රේඛාවට පෙර වාහනය සම්පූර්ණයෙන්ම නවතා ප්‍රමුඛතාව ලබා දීම',
          'රථවාහන පොලිස් නිලධාරියෙකු සිටී නම් පමණක් නැවැත්වීම',
          'තත්පර 5ක් නවතා නැවත වේගයෙන් ධාවනය කිරීම',
        ],
        explanation:
          'STOP සංඥාව අනිවාර්ය නියාමන සංඥාවකි. රියදුරු නැවතුම් රේඛාවට පෙර වාහනය සම්පූර්ණයෙන්ම නවත්වා මාර්ගය ආරක්ෂිත වූ විට පමණක් ඉදිරියට යා යුතුය.',
      },
      ta: {
        question_text:
          'இலங்கையில் "STOP" (நிறுத்துக) என எழுதப்பட்ட எண்கோண சிவப்பு சைகை சாரதிக்கு எதனைக் குறிக்கிறது?',
        options: [
          'வேகத்தை குறைத்து வீதி தெளிவாக இருந்தால் முன்னோக்கி செல்லவும்',
          'நிறுத்தக் கோட்டுக்கு முன் வாகனத்தை முழுமையாக நிறுத்தி அனைத்து வாகனங்களுக்கும் வழிவிடவும்',
          'போக்குவரத்து பொலிஸ் அதிகாரி இருந்தால் மட்டுமே நிறுத்தவும்',
          '5 வினாடிகள் நிறுத்தி பின்னர் வேகமாக செல்லவும்',
        ],
        explanation:
          'STOP சைகை ஒரு கட்டாய ஒழுங்குமுறை சைகையாகும். சாரதி கோட்டுக்கு முன் முழுமையாக வாகனத்தை நிறுத்தி வீதி பாதுகாப்பான பின்பே முன்னோக்கி செல்ல வேண்டும்.',
      },
    },
  },
  {
    id: 'q-reg-02',
    category: 'road_signs_regulatory',
    question_text:
      'What is the meaning of an inverted triangular sign with a red border reading "GIVE WAY"?',
    image_url: '▽',
    options: [
      'You have the priority over all other vehicles',
      'You must slow down or stop to give way to traffic on the major road',
      'No entry for heavy vehicles',
      'Parking allowed for 15 minutes',
    ],
    correct_option_index: 1,
    explanation:
      'The GIVE WAY sign instructs the driver to yield to vehicles approaching on the main road before joining or crossing.',
    translations: {
      en: {
        question_text:
          'What is the meaning of an inverted triangular sign with a red border reading "GIVE WAY"?',
        options: [
          'You have the priority over all other vehicles',
          'You must slow down or stop to give way to traffic on the major road',
          'No entry for heavy vehicles',
          'Parking allowed for 15 minutes',
        ],
        explanation:
          'The GIVE WAY sign instructs the driver to yield to vehicles approaching on the main road before joining or crossing.',
      },
      si: {
        question_text:
          '"GIVE WAY" (ප්‍රමුඛතාව දෙන්න) යනුවෙන් සඳහන් රතු මායිමක් සහිත උඩුයටිකුරු ත්‍රිකෝණාකාර සංඥාවේ තේරුම කුමක්ද?',
        options: [
          'අනෙක් සියලුම වාහන වලට වඩා ඔබට ප්‍රමුඛතාවය හිමිවේ',
          'ප්‍රධාන මාර්ගයේ ගමන් කරන වාහන වලට ප්‍රමුඛතාවය ලබා දීමට වේගය අඩු කිරීම හෝ නැවැත්වීම',
          'බර වාහන ඇතුළුවීම තහනම්',
          'විනාඩි 15ක් වාහන නැවැත්වීමට අවසර ඇත',
        ],
        explanation:
          'GIVE WAY සංඥාව මගින් ප්‍රධාන මාර්ගයට ඇතුළු වීමට පෙර එහි ගමන් ගන්නා රථවාහන වලට ප්‍රමුඛතාවය ලබා දෙන ලෙස රියදුරුට නියෝග කරයි.',
      },
      ta: {
        question_text:
          '"GIVE WAY" (வழி விடுக) என்று எழுதப்பட்ட சிவப்பு எல்லையுடன் கூடிய தலைகீழ் முக்கோண சைகையின் அர்த்தம் யாது?',
        options: [
          'மற்றைய அனைத்து வாகனங்களுக்கும் முன் உங்களுக்கே முன்னுரிமை உண்டு',
          'பிரதான வீதியில் வரும் வாகனங்களுக்கு வழிவிட வேகத்தை குறைக்கவும் அல்லது நிறுத்தவும்',
          'கனரக வாகனங்கள் நுழைய தடை',
          '15 நிமிடங்களுக்கு வாகனத்தை நிறுத்த அனுமதி',
        ],
        explanation:
          'GIVE WAY சைகை பிரதான வீதியில் நுழையும் போது அங்கு செல்லும் வாகனங்களுக்கு முன்னுரிமை வழங்கி செல்லுமாறு கட்டளையிடுகிறது.',
      },
    },
  },
  {
    id: 'q-reg-03',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a red border containing the number "50" inside indicates:',
    image_url: '⑯ 50',
    options: [
      'Minimum speed limit of 50 km/h',
      'Maximum speed limit of 50 km/h in this road zone',
      'Highway distance to the next town is 50 km',
      'Weight limit of 5.0 tonnes',
    ],
    correct_option_index: 1,
    explanation:
      'Circular signs with red borders indicate prohibitions or maximum restrictions. "50" represents a maximum speed limit of 50 km/h.',
    translations: {
      en: {
        question_text:
          'A circular sign with a red border containing the number "50" inside indicates:',
        options: [
          'Minimum speed limit of 50 km/h',
          'Maximum speed limit of 50 km/h in this road zone',
          'Highway distance to the next town is 50 km',
          'Weight limit of 5.0 tonnes',
        ],
        explanation:
          'Circular signs with red borders indicate prohibitions or maximum restrictions. "50" represents a maximum speed limit of 50 km/h.',
      },
      si: {
        question_text:
          'රතු මායිමක් සහිත වෘත්තාකාර සංඥාවක "50" අංකය ඇතුළත්ව ඇති විට ඉන් අදහස් වන්නේ:',
        options: [
          'අවම වේග සීමාව පැයට කිලෝමීටර් 50 කි',
          'මෙම මාර්ග කලාපයේ උපරිම වේග සීමාව පැයට කිලෝමීටර් 50 කි',
          'ඊළඟ නගරයට ඇති දුර කිලෝමීටර් 50 කි',
          'බර සීමාව ටොන් 5.0 කි',
        ],
        explanation:
          'රතු මායිමක් සහිත වෘත්තාකාර සංඥා මගින් උපරිම සීමා පනවනු ලැබේ. "50" යනු පැයට කි.මී. 50ක උපරිම වේග සීමාවයි.',
      },
      ta: {
        question_text:
          'சிவப்பு எல்லையுடன் கூடிய வட்ட சைகையினுள் "50" என்ற எண் காணப்படுமாயின் அது குறிப்பது:',
        options: [
          'குறைந்தபட்ச வேகம் 50 km/h',
          'இந்த வீதிப் பிரிவில் அதிகபட்ச வேக வரம்பு 50 km/h',
          'அடுத்த நகரத்திற்கான தூரம் 50 km',
          'வாகன எடை வரம்பு 5.0 தொன்',
        ],
        explanation:
          'சிவப்பு எல்லையுடைய வட்ட சைகைகள் அதிகபட்ச கட்டுப்பாடுகளை குறிக்கின்றன. "50" என்பது மணிக்கு 50 கி.மீ அதிகபட்ச வேக வரம்பாகும்.',
      },
    },
  },
  {
    id: 'q-reg-04',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a white horizontal bar on a solid red background means:',
    image_url: '⛔',
    options: [
      'No Entry for all vehicles',
      'One way road ahead',
      'Road works in progress',
      'Dead end street',
    ],
    correct_option_index: 0,
    explanation:
      'The solid red circle with a horizontal white bar is the international and Sri Lankan "No Entry" sign.',
    translations: {
      en: {
        question_text:
          'A circular sign with a white horizontal bar on a solid red background means:',
        options: [
          'No Entry for all vehicles',
          'One way road ahead',
          'Road works in progress',
          'Dead end street',
        ],
        explanation:
          'The solid red circle with a horizontal white bar is the international and Sri Lankan "No Entry" sign.',
      },
      si: {
        question_text:
          'රතු පසුබිමක සුදු පැහැති තිරස් තීරුවක් සහිත වෘත්තාකාර සංඥාවෙන් අදහස් වන්නේ:',
        options: [
          'සියලුම වාහන ඇතුළුවීම තහනම් (No Entry)',
          'ඉදිරියෙන් එක් මංතීරු මාර්ගයකි',
          'මාර්ග සංවර්ධන කටයුතු සිදුවේ',
          'ඉදිරියෙන් මාර්ගය අවසන් වේ',
        ],
        explanation:
          'රතු පසුබිමේ ඇති සුදු තිරස් තීරුව මගින් සියලුම වාහන සඳහා "ඇතුළුවීම තහනම්" බව නියාමනය කරයි.',
      },
      ta: {
        question_text:
          'சிவப்பு பின்னணியில் வெள்ளை கிடைமட்ட கோடு உள்ள வட்ட சைகை குறிப்பது:',
        options: [
          'எந்தவொரு வாகனமும் நுழைய தடை (No Entry)',
          'ஒரு வழிப்பாதை',
          'வீதி புனரமைப்பு வேலைகள் நடைபெறுகின்றன',
          'முட்டுச் சந்து',
        ],
        explanation:
          'சிவப்பு பின்னணியில் வெள்ளை கிடைமட்ட கோடு உள்ள சைகையானது சகல வாகனங்களும் "நுழைய தடை" என்பதைக் குறிக்கிறது.',
      },
    },
  },

  // -------------------------------------------------------------
  // 2. Warning Road Signs
  // -------------------------------------------------------------
  {
    id: 'q-warn-01',
    category: 'road_signs_warning',
    question_text:
      'An equilateral triangular sign with a red border showing a pedestrian on a zebra crossing indicates:',
    image_url: '⚠️ 🚶',
    options: [
      'Pedestrian crossing (Zebra Crossing) ahead; prepare to slow down and stop',
      'Pedestrians prohibited on this road',
      'School playground area',
      'Bus halt ahead',
    ],
    correct_option_index: 0,
    explanation:
      'Warning signs in Sri Lanka are triangular with red borders. This sign warns of an approaching pedestrian crossing.',
    translations: {
      en: {
        question_text:
          'An equilateral triangular sign with a red border showing a pedestrian on a zebra crossing indicates:',
        options: [
          'Pedestrian crossing (Zebra Crossing) ahead; prepare to slow down and stop',
          'Pedestrians prohibited on this road',
          'School playground area',
          'Bus halt ahead',
        ],
        explanation:
          'Warning signs in Sri Lanka are triangular with red borders. This sign warns of an approaching pedestrian crossing.',
      },
      si: {
        question_text:
          'පදික මාරුවක් සහිත රතු මායිම් ත්‍රිකෝණාකාර අනතුරු ඇඟවීමේ සංඥාවෙන් දැක්වෙන්නේ:',
        options: [
          'ඉදිරියෙන් පදික මාරුවකි (Zebra Crossing); වේගය අඩු කර නැවැත්වීමට සූදානම් වන්න',
          'මෙම මාර්ගයේ පදිකයින්ට ගමන් කිරීම තහනම්ය',
          'පාසල් ක්‍රීඩා පිටියක් ඉදිරියෙන් ඇත',
          'බස් නැවතුම්පොළකි',
        ],
        explanation:
          'ත්‍රිකෝණාකාර රතු මායිම් සංඥා අනතුරු ඇඟවීම් වේ. මෙමගින් ඉදිරියෙන් ඇති පදික මාරුවක් පිළිබඳ අනතුරු අඟවයි.',
      },
      ta: {
        question_text:
          'பாதசாரி கடவையை காட்டும் சிவப்பு எல்லையுடன் கூடிய முக்கோண சைகை எச்சரிப்பது:',
        options: [
          'முன்னால் பாதசாரி கடவை (Zebra Crossing); வேகத்தை குறைத்து நிறுத்த தயாராகுக',
          'இந்த வீதியில் பாதசாரிகள் செல்ல தடை',
          'பாடசாலை விளையாட்டு மைதானம்',
          'பஸ் நிறுத்தம்',
        ],
        explanation:
          'சிவப்பு எல்லை கொண்ட முக்கோண சைகைகள் எச்சரிக்கை சைகைகளாகும். இது முன்னால் உள்ள பாதசாரி கடவையை குறிக்கிறது.',
      },
    },
  },
  {
    id: 'q-warn-02',
    category: 'road_signs_warning',
    question_text:
      'What action should a driver take when approaching a warning sign showing a circular arrow clockwise?',
    image_url: '⚠️ 🔄',
    options: [
      'Accelerate to merge quickly',
      'Prepare for a roundabout ahead; slow down and give way to traffic from the right',
      'Make an immediate U-turn',
      'Turn on hazard warning lights',
    ],
    correct_option_index: 1,
    explanation:
      'The roundabout warning sign advises drivers to slow down and prepare to yield to vehicles approaching from the right at the upcoming roundabout.',
    translations: {
      en: {
        question_text:
          'What action should a driver take when approaching a warning sign showing a circular arrow clockwise?',
        options: [
          'Accelerate to merge quickly',
          'Prepare for a roundabout ahead; slow down and give way to traffic from the right',
          'Make an immediate U-turn',
          'Turn on hazard warning lights',
        ],
        explanation:
          'The roundabout warning sign advises drivers to slow down and prepare to yield to vehicles approaching from the right at the upcoming roundabout.',
      },
      si: {
        question_text:
          'වටරවුමක් (Roundabout) පිළිබඳ අනතුරු ඇඟවීමේ සංඥාවක් දුටු විට රියදුරෙකු ගත යුතු පියවර කුමක්ද?',
        options: [
          'වේගය වැඩිකර ඉක්මනින් මංතීරුවට ඇතුළු වීම',
          'ඉදිරියෙන් වටරවුමක් ඇත; වේගය අඩු කර දකුණෙන් එන වාහන වලට ප්‍රමුඛතාවය දීමට සූදානම් වීම',
          'වහාම යූ-හැරවුමක් (U-Turn) ගැනීම',
          'හදිසි ආපදා ලාම්පු (Hazard Lights) දැල්වීම',
        ],
        explanation:
          'වටරවුම් සංඥාව මගින් වේගය අඩු කර වටරවුමට ඇතුළු වීමේදී දකුණෙන් පැමිණෙන රථවාහන වලට ප්‍රමුඛතාව දීමට අනතුරු අඟවයි.',
      },
      ta: {
        question_text:
          'சுற்றுவட்டம் (Roundabout) எச்சரிக்கை சைகையை நெருங்கும் போது சாரதி செய்ய வேண்டியது யாது?',
        options: [
          'வேகத்தை அதிகரித்து விரைவாக இணையவும்',
          'முன்னால் சுற்றுவட்டம் உள்ளது; வேகத்தை குறைத்து வலமிருந்து வரும் வாகனங்களுக்கு வழிவிட தயாராகுக',
          'உடனடியாக U-வளைவு எடுக்கவும்',
          'ஆபத்து சமிக்ஞை விளக்குகளை (Hazard Lights) ஒளிரவிடவும்',
        ],
        explanation:
          'சுற்றுவட்ட சைகை வேகத்தை குறைத்து வலதுபுறமிருந்து வரும் வாகனங்களுக்கு முன்னுரிமை வழங்க தயாராகுமாறு எச்சரிக்கிறது.',
      },
    },
  },

  // -------------------------------------------------------------
  // 3. Priority & Junctions
  // -------------------------------------------------------------
  {
    id: 'q-prio-01',
    category: 'priority_and_junctions',
    question_text:
      'At an uncontrolled junction or roundabout in Sri Lanka (left-hand driving), who has the right of way?',
    options: [
      'The vehicle travelling at the highest speed',
      'Traffic approaching from your right-hand side',
      'The larger vehicle or bus',
      'Traffic approaching from your left-hand side',
    ],
    correct_option_index: 1,
    explanation:
      'Under the Sri Lanka Motor Traffic Act, drivers must give way to traffic approaching from their right at roundabouts and equal priority intersections.',
    translations: {
      en: {
        question_text:
          'At an uncontrolled junction or roundabout in Sri Lanka (left-hand driving), who has the right of way?',
        options: [
          'The vehicle travelling at the highest speed',
          'Traffic approaching from your right-hand side',
          'The larger vehicle or bus',
          'Traffic approaching from your left-hand side',
        ],
        explanation:
          'Under the Sri Lanka Motor Traffic Act, drivers must give way to traffic approaching from their right at roundabouts and equal priority intersections.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ වටරවුමකදී හෝ පාලනය නොකළ මංසන්ධියකදී ප්‍රමුඛතාවය හිමිවන්නේ කාටද?',
        options: [
          'වැඩිම වේගයෙන් ධාවනය වන වාහනයට',
          'ඔබේ දකුණු පසින් පැමිණෙන රථවාහන වලට',
          'විශාල වාහන හෝ බස් රථ වලට',
          'ඔබේ වම් පසින් පැමිණෙන රථවාහන වලට',
        ],
        explanation:
          'මෝටර් රථ පනතට අනුව වටරවුම් සහ මංසන්ධි වලදී සෑම විටම දකුණෙන් පැමිණෙන වාහන වලට ප්‍රමුඛතාවය ලබා දිය යුතුය.',
      },
      ta: {
        question_text:
          'இலங்கையில் கட்டுப்பாடற்ற சந்திப்பு அல்லது சுற்றுவட்டத்தில் யாருக்கு முன்னுரிமை உண்டு?',
        options: [
          'அதிக வேகத்தில் செல்லும் வாகனத்திற்கு',
          'உங்கள் வலதுபுறமிருந்து வரும் வாகனங்களுக்கு',
          'பெரிய வாகனம் அல்லது பஸ்களுக்கு',
          'உங்கள் இடதுபுறமிருந்து வரும் வாகனங்களுக்கு',
        ],
        explanation:
          'இலங்கை மோட்டார் போக்குவரத்து சட்டத்தின் கீழ் சுற்றுவட்டங்களில் எப்போதும் வலமிருந்து வரும் வாகனங்களுக்கே முன்னுரிமை வழங்க வேண்டும்.',
      },
    },
  },
  {
    id: 'q-prio-02',
    category: 'priority_and_junctions',
    question_text:
      'When are you allowed to enter a yellow criss-cross box junction on the road?',
    options: [
      'At any time if traffic lights are green',
      'Only when your exit road is clear and you can cross without stopping inside the box',
      'Whenever following a public bus',
      'If you plan to turn right and wait for oncoming traffic',
    ],
    correct_option_index: 1,
    explanation:
      'You must NOT enter a yellow box junction unless your exit is completely clear, except when turning right and waiting only for oncoming vehicles.',
    translations: {
      en: {
        question_text:
          'When are you allowed to enter a yellow criss-cross box junction on the road?',
        options: [
          'At any time if traffic lights are green',
          'Only when your exit road is clear and you can cross without stopping inside the box',
          'Whenever following a public bus',
          'If you plan to turn right and wait for oncoming traffic',
        ],
        explanation:
          'You must NOT enter a yellow box junction unless your exit is completely clear, except when turning right and waiting only for oncoming vehicles.',
      },
      si: {
        question_text:
          'මාර්ගයක ඇති කහ පැහැති කොටු සලකුණු කළ පෙට්ටියකට (Yellow Box Junction) ඇතුළු විය හැක්කේ කවදාද?',
        options: [
          'කොළ පැහැති සංඥා ලාම්පුව දැල්වී ඇති ඕනෑම වේලාවක',
          'පිටවීමේ මාර්ගය සම්පූර්ණයෙන්ම පැහැදිලිව ඇති විට හා කොටුව තුළ නොනැවතී යා හැකි විට පමණි',
          'බස් රථයක් පසුපසින් ගමන් කරන විට',
          'දකුණට හැරවීමට බලාපොරොත්තු වන්නේ නම් පමණි',
        ],
        explanation:
          'පිටවීමේ මාර්ගය පැහැදිලිව නොමැති නම් කහ කොටුව තුළ වාහනය නැවැත්වීම නීතියෙන් තහනම් වේ.',
      },
      ta: {
        question_text:
          'மஞ்சள் பெட்டி சந்திப்பில் (Yellow Box Junction) நீங்கள் எப்போது நுழையலாம்?',
        options: [
          'பச்சை விளக்கு எரியும் எந்த நேரத்திலும்',
          'வெளியேறும் பாதை தெளிவாக இருந்து பெட்டிக்குள் நிற்காமல் கடக்க முடியும் போது மட்டுமே',
          'பஸ்ஸின் பின்னால் செல்லும் போது',
          'வலதுபுறம் திரும்ப காத்திருக்கும் போது',
        ],
        explanation:
          'வெளியேறும் பாதை தெளிவாக இல்லாவிட்டால் மஞ்சள் பெட்டிக்குள் வாகனத்தை நிறுத்துவது சட்டவிரோதமாகும்.',
      },
    },
  },

  // -------------------------------------------------------------
  // 4. General Road Safety & DMT Laws
  // -------------------------------------------------------------
  {
    id: 'q-law-01',
    category: 'general_road_safety',
    question_text:
      'What is the minimum safe following distance rule in normal dry driving conditions?',
    options: [
      '1 second distance behind the vehicle ahead',
      'The 2-Second Rule (increasing to 4 seconds in wet conditions)',
      '1 meter for every 10 km/h speed',
      'Stay as close as possible to prevent other vehicles from cutting in',
    ],
    correct_option_index: 1,
    explanation:
      'The 2-second rule provides adequate reaction time and braking distance in normal conditions.',
    translations: {
      en: {
        question_text:
          'What is the minimum safe following distance rule in normal dry driving conditions?',
        options: [
          '1 second distance behind the vehicle ahead',
          'The 2-Second Rule (increasing to 4 seconds in wet conditions)',
          '1 meter for every 10 km/h speed',
          'Stay as close as possible to prevent other vehicles from cutting in',
        ],
        explanation:
          'The 2-second rule provides adequate reaction time and braking distance in normal conditions.',
      },
      si: {
        question_text:
          'සාමාන්‍ය වියළි කාලගුණික තත්ත්වයන් යටතේ රිය පැදවීමේදී තබාගත යුතු අවම ආරක්ෂිත පරතරය පිළිබඳ නීතිය කුමක්ද?',
        options: [
          'ඉදිරි වාහනයට තත්පර 1ක පරතරයක් තබා ගැනීම',
          'තත්පර 2 නීතිය (The 2-Second Rule) - වැසි සහිත අවස්ථාවල තත්පර 4 දක්වා වැඩි කළ යුතුය',
          'සෑම පැයට කි.මී. 10ක වේගයකට මීටර් 1ක පරතරයක්',
          'වෙනත් වාහන ඇතුළු වීම වැළැක්වීමට හැකි තරම් ළඟින් ධාවනය කිරීම',
        ],
        explanation:
          'තත්පර 2 නීතිය මගින් හදිසි අවස්ථාවකදී තිරිංග යෙදීමට සහ ප්‍රතිචාර දැක්වීමට ප්‍රමාණවත් කාලයක් සහ ආරක්ෂිත දුරක් ලබා දේ.',
      },
      ta: {
        question_text:
          'சாதாரண உலர்ந்த காலநிலையில் முன்னால் செல்லும் வாகனத்திற்கும் உங்களுக்குமிடையிலான குறைந்தபட்ச பாதுகாப்பு இடைவெளி யாது?',
        options: [
          'முன்னால் செல்லும் வாகனத்திலிருந்து 1 வினாடி இடைவெளி',
          '2-வினாடி விதி (The 2-Second Rule) - மழைக்காலத்தில் 4 வினாடிகளாக அதிகரிக்க வேண்டும்',
          'ஒவ்வொரு 10 km/h வேகத்திற்கும் 1 மீட்டர்',
          'மற்ற வாகனங்கள் நுழைவதை தடுக்க நெருக்கமாக செலுத்துதல்',
        ],
        explanation:
          '2-வினாடி விதி திடீர் நிறுத்தங்களின் போது போதிய பிரதிபலிப்பு நேரத்தையும் தூரத்தையும் வழங்குகிறது.',
      },
    },
  },
  {
    id: 'q-law-03',
    category: 'general_road_safety',
    question_text:
      'What is the legal blood alcohol concentration (BAC) limit for driving a motor vehicle in Sri Lanka?',
    options: [
      '0.06 grams per 100 milliliters of blood (0.06% BAC)',
      '0.15 grams per 100 milliliters of blood',
      '0.50 grams per 100 milliliters of blood',
      'There is no legal limit if driving carefully',
    ],
    correct_option_index: 0,
    explanation:
      'Under the Sri Lanka Motor Traffic Act, the legal threshold for blood alcohol concentration is 0.06g/100ml. Driving above this limit is a criminal offense.',
    translations: {
      en: {
        question_text:
          'What is the legal blood alcohol concentration (BAC) limit for driving a motor vehicle in Sri Lanka?',
        options: [
          '0.06 grams per 100 milliliters of blood (0.06% BAC)',
          '0.15 grams per 100 milliliters of blood',
          '0.50 grams per 100 milliliters of blood',
          'There is no legal limit if driving carefully',
        ],
        explanation:
          'Under the Sri Lanka Motor Traffic Act, the legal threshold for blood alcohol concentration is 0.06g/100ml. Driving above this limit is a criminal offense.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ මෝටර් රථයක් පැදවීමේදී රුධිරයේ තිබිය හැකි උපරිම නීත්‍යානුකූල මධ්‍යසාර සාන්ද්‍රණය (BAC) කොපමණද?',
        options: [
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.06 (0.06% BAC)',
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.15',
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.50',
          'ප්‍රවේශමෙන් ධාවනය කරන්නේ නම් සීමාවක් නොමැත',
        ],
        explanation:
          'මෝටර් රථ පනතට අනුව නීත්‍යානුකූල මධ්‍යසාර සීමාව 0.06g/100ml වේ. ඊට වඩා මධ්‍යසාර ප්‍රමාණයක් සහිතව රිය පැදවීම දඬුවම් ලැබිය හැකි වරදකි.',
      },
      ta: {
        question_text:
          'இலங்கையில் மோட்டார் வாகனத்தை செலுத்தும் போது அனுமதிக்கப்பட்ட இரத்த மதுபான செறிவு (BAC) வரம்பு யாது?',
        options: [
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.06 கிராம் (0.06% BAC)',
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.15 கிராம்',
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.50 கிராம்',
          'கவனமாக செலுத்தினால் சட்ட வரம்பு இல்லை',
        ],
        explanation:
          'மோட்டார் போக்குவரத்து சட்டத்தின் கீழ் சட்டப்பூர்வ மதுபான வரம்பு 0.06g/100ml ஆகும். இதற்கு மேல் வாகனம் செலுத்துவது குற்றமாகும்.',
      },
    },
  },
]
