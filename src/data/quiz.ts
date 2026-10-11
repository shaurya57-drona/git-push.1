import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    mathTopic: 'Eccentricity of Conics',
    questionEn: 'Which mathematical condition strictly defines a Parabolic conic section, such as the vertical cross-section of the Gateway Arch?',
    questionHi: 'कौन सी गणितीय शर्त परवलयिक शंकु परिच्छेद (जैसे गेटवे आर्च) को सख्ती से परिभाषित करती है?',
    optionsEn: [
      'Eccentricity e = 0',
      'Eccentricity 0 < e < 1',
      'Eccentricity e = 1',
      'Eccentricity e > 1',
    ],
    optionsHi: [
      'उत्केंद्रता e = 0',
      'उत्केंद्रता 0 < e < 1',
      'उत्केंद्रता e = 1',
      'उत्केंद्रता e > 1',
    ],
    correctIndex: 2,
    explanationEn:
      'A parabola is uniquely defined by an eccentricity e = 1, where the cutting plane is exactly parallel to the cone slant generator. Every point is equidistant from the focus and directrix (PF = PM).',
    explanationHi:
      'परवलय की उत्केंद्रता सदैव e = 1 होती है, जहाँ काटने वाला समतल शंकु की जनरेटर रेखा के ठीक समानांतर होता है। प्रत्येक बिंदु नाभि और नियता से समान दूरी पर होता है।',
  },
  {
    id: 2,
    mathTopic: 'Whispering Gallery Property of Ellipse',
    questionEn: "Why can a person whispering at one focus in St. Paul's Cathedral be heard clearly at the second focus 33 meters away?",
    questionHi: "सेंट पॉल्स कैथेड्रल में एक नाभि पर फुसफुसाने वाला व्यक्ति 33 मीटर दूर दूसरी नाभि पर स्पष्ट क्यों सुनाई देता है?",
    optionsEn: [
      'Sound speed accelerates along curved masonry',
      'The normal to the ellipse bisects the angle formed by lines from the point to both foci, reflecting all rays from F₁ directly into F₂',
      'Air pressure at the perimeter is higher due to air currents',
      'The dome acts as an active acoustic amplifier through resonance chambers',
    ],
    optionsHi: [
      'घुमावदार दीवारों पर ध्वनि की गति बढ़ जाती है',
      'दीर्घवृत्त का अभिलंब दोनों नाभियों से खींची गई रेखाओं के कोण को समद्विभाजित करता है, जिससे F₁ से निकलने वाली सभी तरंगें परावर्तित होकर F₂ पर मिलती हैं',
      'हवा के बहाव के कारण परिधि पर हवा का दबाव बढ़ जाता है',
      'गुंबद अनुनाद कक्षों के माध्यम से एक सक्रिय एम्पलीफायर का कार्य करता है',
    ],
    correctIndex: 1,
    explanationEn:
      'Due to the focal reflection theorem of the ellipse: the angle of incidence equals the angle of reflection relative to the tangent, ensuring all rays radiating from focus F₁ reflect directly to focus F₂.',
    explanationHi:
      'दीर्घवृत्त के नाभि परावर्तन गुण के कारण: आपतन कोण परावर्तन कोण के बराबर होता है, जिससे F₁ से निकलने वाली किरणें परिधि से टकराकर सीधे F₂ पर केंद्रित होती हैं।',
  },
  {
    id: 3,
    mathTopic: 'Doubly-Ruled Hyperboloid Surfaces',
    questionEn: 'How was Vladimir Shukhov able to build the 160-meter Shukhov Tower in Moscow using exclusively straight steel beams despite its curving waist?',
    questionHi: 'व्लादिमीर शुखोव ने मॉस्को के 160 मीटर ऊंचे शुखोव टॉवर को घुमावदार होने के बावजूद केवल सीधी स्टील बीम से कैसे बनाया?',
    optionsEn: [
      'He heated and bent the beams manually on site',
      'A hyperboloid of one sheet is a doubly-ruled surface with two families of straight ruling lines intersecting at every point',
      'The tower was composed of modular circular rings stacked vertically',
      'Telescopic hydraulic jacks distorted the steel after installation',
    ],
    optionsHi: [
      'उन्होंने साइट पर बीम को गर्म करके हाथ से मोड़ा था',
      'एक-शीट वाला अतिपरवलयज (Hyperboloid) एक द्वि-रूल्ड सतह है, जिसके प्रत्येक बिंदु से दो सीधी रेखाएं गुजरती हैं',
      'टॉवर लंबवत रूप से लगाए गए वृत्ताकार छल्लों से बना था',
      'हाइड्रोलिक जैक ने निर्माण के बाद स्टील को विकृत कर दिया था',
    ],
    correctIndex: 1,
    explanationEn:
      'A hyperboloid of one sheet (x²/a² + y²/a² - z²/c² = 1) is a doubly-ruled surface: through every point on the surface pass two intersecting straight lines that lie completely within the surface, allowing construction with straight linear beams.',
    explanationHi:
      'एक-शीट अतिपरवलयज एक द्वि-रूल्ड सतह होती है: सतह के प्रत्येक बिंदु पर दो सीधी रेखाएं स्थित होती हैं, इसलिए इसे बिना किसी बीम को मोड़े केवल सीधी छड़ों से बनाया जा सकता है।',
  },
  {
    id: 4,
    mathTopic: 'General Second-Degree Discriminant',
    questionEn: 'Given the general equation Ax² + Bxy + Cy² + Dx + Ey + F = 0, what does the discriminant condition B² - 4AC < 0 represent geometrically (with B=0, A ≠ C, A·C > 0)?',
    questionHi: 'समीकरण Ax² + Bxy + Cy² + Dx + Ey + F = 0 में, यदि B² - 4AC < 0 हो (और B=0, A ≠ C, A·C > 0), तो यह क्या दर्शाता है?',
    optionsEn: [
      'Parabola',
      'Hyperbola',
      'Ellipse',
      'Intersecting pair of straight lines',
    ],
    optionsHi: [
      'परवलय (Parabola)',
      'अतिपरवलय (Hyperbola)',
      'दीर्घवृत्त (Ellipse)',
      'प्रतिच्छेदी सरल रेखा युग्म',
    ],
    correctIndex: 2,
    explanationEn:
      'When Δ = B² - 4AC < 0 and A ≠ C with AC > 0, the equation defines an ellipse. If A = C, it simplifies to a circle (e = 0). If Δ = 0 it is a parabola, and if Δ > 0 it is a hyperbola.',
    explanationHi:
      'जब विविक्तकर Δ = B² - 4AC < 0 और A ≠ C तथा AC > 0 हो, तो यह एक दीर्घवृत्त दर्शाता है। यदि A = C हो तो यह वृत्त बन जाता है। Δ = 0 परवलय और Δ > 0 अतिपरवलय होता है।',
  },
  {
    id: 5,
    mathTopic: 'Colosseum Oval Geometry',
    questionEn: 'The Colosseum in Rome has a major outer axis 2a = 189m and minor axis 2b = 156m. What is its approximate eccentricity e?',
    questionHi: 'रोम के कोलोसियम का दीर्घ अक्ष 2a = 189m और लघु अक्ष 2b = 156m है। इसकी अनुमानित उत्केंद्रता e क्या है?',
    optionsEn: [
      'e ≈ 0.000 (Circle)',
      'e ≈ 0.564 (Ellipse)',
      'e ≈ 1.000 (Parabola)',
      'e ≈ 1.732 (Hyperbola)',
    ],
    optionsHi: [
      'e ≈ 0.000 (वृत्त)',
      'e ≈ 0.564 (दीर्घवृत्त)',
      'e ≈ 1.000 (परवलय)',
      'e ≈ 1.732 (अतिपरवलय)',
    ],
    correctIndex: 1,
    explanationEn:
      'a = 94.5m, b = 78.0m. e = √(1 - b²/a²) = √(1 - 78²/94.5²) = √(1 - 6084/8930.25) = √(1 - 0.681) = √0.319 ≈ 0.564.',
    explanationHi:
      'a = 94.5m, b = 78.0m। e = √(1 - b²/a²) = √(1 - 78²/94.5²) ≈ 0.564, जो दीर्घवृत्त (0 < e < 1) के दायरे में आता है।',
  },
  {
    id: 6,
    mathTopic: 'Parabolic Load Compression',
    questionEn: 'Why is an inverted parabolic arch considered the ideal funicular form for bridges and roofs carrying uniformly distributed vertical load?',
    questionHi: 'समान रूप से वितरित ऊर्ध्वाधर भार उठाने वाले मेहराबों और छतों के लिए उलटा परवलय आदर्श क्यों माना जाता है?',
    optionsEn: [
      'It creates decorative aesthetic shadows',
      'The resultant line of thrust coincides exactly with the centroidal axis, inducing pure axial compression with zero bending moments',
      'It doubles the structural tension in steel rebar',
      'It requires only two supports without foundations',
    ],
    optionsHi: [
      'यह सुंदर छायाएं उत्पन्न करता है',
      'थ्रस्ट रेखा मेहराब के केंद्रक अक्ष से बिल्कुल मेल खाती है, जिससे शून्य बेंडिंग मोमेंट के साथ केवल शुद्ध अक्षीय संपीड़न पैदा होता है',
      'यह स्टील सरिया में तनाव को दोगुना करता है',
      'इसके लिए नींव के बिना केवल दो सपोर्ट की आवश्यकता होती है',
    ],
    correctIndex: 1,
    explanationEn:
      'Under a uniform vertical gravity load w, the bending moment equation M(x) = 0 when the arch shape follows y = (w / 2H)·x², which is a pure parabola. The arch experiences zero flexural bending stresses.',
    explanationHi:
      'समान गुरुत्वाकर्षण भार के तहत, जब मेहराब का आकार y = cx² (परवलय) होता है, तो बेंडिंग मोमेंट शून्य हो जाता है। संरचना केवल शुद्ध संपीड़न तनाव अनुभव करती है।',
  },
  {
    id: 7,
    mathTopic: 'Circle Symmetry in Pantheon',
    questionEn: 'The Pantheon rotunda in Rome has an internal diameter and interior height that both equal exactly 43.3 meters. What geometric symmetry does this represent?',
    questionHi: 'रोम के पैनथियन का आंतरिक व्यास और आंतरिक ऊंचाई दोनों ठीक 43.3 मीटर हैं। यह किस ज्यामितीय सममिति को दर्शाता है?',
    optionsEn: [
      'A golden ratio rectangle of 1 : 1.618',
      'An exact 1:1 proportion where an entire inscribed sphere of diameter 43.3m fits perfectly within the rotunda',
      'A hyperbola with vertical asymptotes',
      'A tri-axial ellipsoid with eccentricity 0.8',
    ],
    optionsHi: [
      '1 : 1.618 का स्वर्ण अनुपात आयत',
      '1:1 का सटीक अनुपात जहाँ 43.3 मीटर व्यास का एक संपूर्ण अंतःगोला इसके अंदर पूरी तरह समा सकता है',
      'लंबवत अनंतस्पर्शी वाला एक अतिपरवलय',
      '0.8 उत्केंद्रता वाला त्रि-अक्षीय दीर्घवृत्तज',
    ],
    correctIndex: 1,
    explanationEn:
      'The interior space is a hemisphere mounted on a cylinder of identical radius (r = 21.65m), producing a total height equal to the diameter (43.3m). An ideal sphere touches the floor, perimeter, and the oculus ring.',
    explanationHi:
      'पैनथियन का आंतरिक भाग समान त्रिज्या (r = 21.65m) के बेलन पर रखे अर्धगोले से बना है, जिससे कुल ऊंचाई व्यास (43.3m) के बराबर होती है और एक संपूर्ण 3D गोला अंदर समा जाता है।',
  },
  {
    id: 8,
    mathTopic: 'Hyperbolic Waist Aerodynamics',
    questionEn: 'What aerodynamic advantage does the hyperbolic narrow waist provide to mega-tall skyscrapers like the 604-meter Canton Tower during typhoons?',
    questionHi: '604 मीटर ऊंचे कैंटन टॉवर जैसे गगनचुंबी भवनों को तूफानों के दौरान संकीर्ण अतिपरवलयिक कमर क्या वायुगतिकीय लाभ प्रदान करती है?',
    optionsEn: [
      'It traps hot air to create thermal updrafts',
      'It disrupts synchronized vortex shedding, preventing destructive resonant crosswind oscillations',
      'It reflects sound waves away from the observation deck',
      'It increases wind resistance to slow down air currents',
    ],
    optionsHi: [
      'यह गर्म हवा को फंसाकर थर्मल अपड्राफ्ट बनाती है',
      'यह हवा के समकालिक भंवरों (vortex shedding) को तोड़ती है, जिससे विनाशकारी दोलन और कंपन रुक जाते हैं',
      'यह डेक से ध्वनि तरंगों को दूर परावर्तित करती है',
      'यह वायु प्रतिरोध को बढ़ाती है',
    ],
    correctIndex: 1,
    explanationEn:
      'Because the cross-section diameter continuously changes along the hyperbolic curve, von Kármán wind vortex shedding frequencies vary at each height level, preventing dangerous coherent vortex resonance.',
    explanationHi:
      'अतिपरवलयिक वक्र के कारण टॉवर का व्यास हर ऊंचाई पर बदलता रहता है, जिससे हवा के भंवरों की आवृत्ति एक समान नहीं बन पाती और टॉवर में खतरनाक कंपन नहीं होता।',
  },
];
