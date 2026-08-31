export interface KnowledgeItem {
  id: string
  keywords: string[]
  question: {
    en: string
    si: string
    ta: string
  }
  answer: {
    en: string
    si: string
    ta: string
  }
  category: 'highway_code' | 'roundabouts' | 'dmt_regulations' | 'maneuvers' | 'general'
}

export const COPILOT_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    keywords: ['roundabout', 'right of way', 'priority', 'vathura', 'wawata'],
    question: {
      en: 'Who has right of way at a roundabout in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ වටරවුමකදී ප්‍රමුඛතාවය හිමිවන්නේ කාටද?',
      ta: 'இலங்கையில் வட்டாரப் பாதையில் யாருக்கு முன்னுரிமை உண்டு?',
    },
    answer: {
      en: 'In Sri Lanka, you must give way to traffic approaching from your RIGHT within the roundabout, unless signs or road markings indicate otherwise. Always signal your intentions before entering and exiting.',
      si: 'ශ්‍රී ලංකාවේදී වටරවුම තුළ ඔබේ දකුණු පසින් පැමිණෙන රථවාහන සඳහා ප්‍රමුඛතාව ලබාදිය යුතුය. වටරවුමට ඇතුළු වීමට හා පිටවීමට පෙර සංඥා (Indicators) නිවැරදිව භාවිත කරන්න.',
      ta: 'இலங்கையில் வட்டாரப் பாதையில் உங்கள் வலதுபுறத்திலிருந்து வரும் வாகனங்களுக்கு முன்னுரிமை அளிக்க வேண்டும். உள்நுழையும்போதும் வெளியேறும்போதும் சரியான சைகை காட்டவும்.',
    },
    category: 'roundabouts',
  },
  {
    id: 'kb-2',
    keywords: ['hill start', 'gradient', 'clutch', 'rollback', 'kandu'],
    question: {
      en: 'How do I perform a perfect Hill Start without rolling back?',
      si: 'රථය පසුපසට නොගොස් කඳු නැගීම (Hill Start) නිවැරදිව කරන්නේ කෙසේද?',
      ta: 'வாகனம் பின்னோக்கிச் செல்லாமல் மேடேறுவது (Hill Start) எப்படி?',
    },
    answer: {
      en: '1. Secure vehicle with handbrake.\n2. Depress clutch and select 1st gear.\n3. Gently press accelerator (approx. 1500-2000 RPM).\n4. Slowly raise clutch to biting point until engine note deepens.\n5. Check blind spots, release handbrake smoothly, and maintain steady accelerator pressure.',
      si: '1. හෑන්ඩ්බ්‍රේක් (Handbrake) යොදන්න.\n2. ක්ලච් පාගා 1 වන ගියරය යොදන්න.\n3. ඇක්සලරේටරය සුළු වශයෙන් පාගන්න (1500-2000 RPM).\n4. ක්ලච් එක බයිටිං පොයින්ට් (Biting point) තෙක් සෙමින් උඩට ගන්න.\n5. දෙපස බලා හෑන්ඩ්බ්‍රේක් එක මුදාහැර ඉදිරියට ධාවනය කරන්න.',
      ta: '1. ஹேண்ட்பிரேக்கை உறுதியாகப் பூட்டவும்.\n2. கிளட்சை அழுத்தி 1வது கியரில் போடவும்.\n3. எக்ஸிலேட்டரை மெதுவாக அழுத்தவும் (1500-2000 RPM).\n4. கிளட்சை பைட்டிங் பாயிண்ட் (Biting point) வரை மெதுவாக விடுங்கள்.\n5. ஹேண்ட்பிரேக்கை விடுவித்து மெதுவாக முன்னோக்கி நகருங்கள்.',
    },
    category: 'maneuvers',
  },
  {
    id: 'kb-3',
    keywords: ['permit', 'validity', '6 months', 'expiry', 'kallawunu'],
    question: {
      en: 'How long is a DMT Learner Permit valid in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ DMT ආධුනික රියදුරු බලපත්‍රයක් වලංගු වන්නේ කොපමණ කාලයක්ද?',
      ta: 'இலங்கையில் DMT பயிலுனர் சாரதி அனுமதிப்பத்திரம் எவ்வளவு காலம் செல்லுபடியாகும்?',
    },
    answer: {
      en: 'A DMT Learner Permit is valid for exactly 6 months (180 days) from the date of issue. If it expires before your practical trial, you must renew it at the DMT (e.g. Werahera or District DMT office) before appearing for the trial.',
      si: 'DMT ආධුනික රියදුරු බලපත්‍රය නිකුත් කළ දින සිට මාස 6ක් (දින 180ක්) පමණක් වලංගු වේ. ප්‍රායෝගික පරීක්ෂණයට පෙර එය කල් ඉකුත් වුවහොත්, DMT කාර්යාලයෙන් (වේරහැර හෝ දිස්ත්‍රික් කාර්යාලයෙන්) එය අලුත් කරගත යුතුය.',
      ta: 'DMT பயிலுனர் சாரதி அனுமதிப்பத்திரம் வழங்கப்பட்ட திகதியிலிருந்து 6 மாதங்களுக்கு (180 நாட்கள்) செல்லுபடியாகும். காலாவதியானால் DMT அலுவலகத்தில் புதுப்பிக்க வேண்டும்.',
    },
    category: 'dmt_regulations',
  },
  {
    id: 'kb-4',
    keywords: ['reverse', 's bend', 'serpentine', 'reverse s'],
    question: {
      en: 'What are the examiner checkpoints for the Reverse S-Bend maneuver?',
      si: 'ප්‍රතිවිරුද්ධ S-වංගුව (Reverse S-Bend) පරීක්ෂණයේදී පරීක්ෂකවරයා අවධානය යොමුකරන්නේ මොනවාටද?',
      ta: 'ரிவர்ஸ் S-வளைவு (Reverse S-Bend) சோதனையில் பரீட்சகர் கவனிக்கும் விடயங்கள் யாவை?',
    },
    answer: {
      en: 'Examiners check for: (1) Slow, controlled clutch crawl speed, (2) No touching or hitting boundary cones, (3) Smooth steering transitions between left and right arcs, and (4) Proper observation using side mirrors without opening doors or unfastening seatbelts.',
      si: 'පරීක්ෂකවරයා පරීක්ෂා කරන්නේ: (1) ක්ලච් එක මඟින් පාලනය වන අඩු වේගය, (2) කෝන් (Cones) හෝ සීමා ඉරිවල නොගැටීම, (3) සුක්කානම (Steering) සුමටව හැසිරවීම, (4) දෙපස කණ්නාඩි (Side mirrors) නිවැරදිව භාවිත කිරීමයි.',
      ta: 'பரீட்சகர்கள் கவனிப்பது: (1) குறைந்த வேகக் கட்டுப்பாடு, (2) எல்லைக் கூம்புகளில் முட்டாமல் இருப்பது, (3) சீரான ஸ்டீயரிங் கட்டுப்பாடு, (4) பக்கவாட்டுக் கண்ணாடிகளைச் சரியாகப் பயன்படுத்துதல்.',
    },
    category: 'maneuvers',
  },
  {
    id: 'kb-5',
    keywords: ['road signs', 'circle', 'triangle', 'red', 'mandatory'],
    question: {
      en: 'What is the difference between circular and triangular road signs?',
      si: 'වෘත්තාකාර සහ ත්‍රිකෝණාකාර මාර්ග සංඥා අතර වෙනස කුමක්ද?',
      ta: 'வட்ட மற்றும் முக்கோண போக்குவரத்து அடையாளங்களுக்கு இடையிலான வேறுபாடு என்ன?',
    },
    answer: {
      en: '• Circular signs with red rings = MANDATORY / PROHIBITIVE (You MUST obey them, e.g. No Entry, Speed Limit).\n• Triangular signs with red borders = WARNING / HAZARD (They warn you of danger ahead, e.g. Sharp Bend, Pedestrian Crossing).',
      si: '• රතු වටරවුම් සහිත වෘත්තාකාර සංඥා = අනිවාර්ය / තහනම් නියෝග (නොපැමිණිය යුතුයි, වේග සීමා).\n• රතු මායිම් සහිත ත්‍රිකෝණාකාර සංඥා = අනතුරු ඇඟවීමේ සංඥා (ඉදිරියේ ඇති අනතුරුදායක ස්ථාන).',
      ta: '• சிவப்பு வட்ட அடையாளங்கள் = கட்டாய / தடை உத்தரவுகள் (கட்டாயம் பின்பற்ற வேண்டும்).\n• சிவப்பு முக்கோண அடையாளங்கள் = எச்சரிக்கை அடையாளங்கள் (முன்னால் உள்ள ஆபத்துகள்).',
    },
    category: 'highway_code',
  },
]
