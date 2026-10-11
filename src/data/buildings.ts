import { Building } from '../types';

export const BUILDINGS_DATA: Building[] = [
  // ==========================================
  // CIRCLES (e = 0)
  // ==========================================
  {
    id: 'pantheon',
    nameEn: 'The Pantheon',
    nameHi: 'द पार्थेनन / पैंथियन',
    conicType: 'circle',
    city: 'Rome',
    country: 'Italy',
    architect: 'Apollodorus of Damascus (attr.) / Emperor Hadrian',
    yearBuilt: '125 AD',
    standardEquation: 'x² + y² = r²',
    realWorldEquation: 'x² + y² + z² = 21.65²  (for z ≥ 0)',
    eccentricity: 0.0,
    eccentricityFormula: 'e = \\sqrt{1 - b^2/a^2} = 0  (a = b = r)',
    parameters: {
      'Radius (r)': '21.65 m',
      'Diameter (2r)': '43.30 m',
      'Oculus Diameter': '8.95 m',
      'Height to Oculus': '43.30 m (1:1 Ratio)',
    },
    keyDimensions: {
      'Internal Diameter': '43.3 m (142 ft)',
      'Oculus Opening': '8.95 m (29.4 ft)',
      'Wall Thickness at Base': '6.4 m tapering to 1.2 m',
      'Dome Material': 'Unreinforced Pozzolana Concrete',
    },
    mathematicalSignificanceEn:
      'The interior encloses an exact sphere of diameter 43.3 meters. The floor plan is an ideal circle (eccentricity e = 0), and the hemispherical dome rests on a circular drum where the vertical cross-section matches the horizontal diameter, yielding an architectural unity of 1:1 proportion.',
    mathematicalSignificanceHi:
      'पैनथियन का आंतरिक भाग 43.3 मीटर व्यास का एक सटीक गोला समाहित करता है। इसका भू-तल लेआउट एक आदर्श वृत्त (उत्केंद्रता e = 0) है। ऊर्ध्वाधर काट क्षैतिज व्यास से बिल्कुल मेल खाती है, जो 1:1 का संपूर्ण ज्यामितीय अनुपात बनाती है।',
    architecturalAdvantageEn:
      'A circular base distributes structural hoop stress symmetrically in 360 degrees, eliminating weak corners and allowing unreinforced volcanic pozzolana concrete to stand crack-free for over 1,900 years.',
    architecturalAdvantageHi:
      'वृत्ताकार आधार 360 डिग्री में हूप तनाव (hoop stress) को पूर्ण समरूपता से वितरित करता है, जिससे नुकीले कोने समाप्त हो जाते हैं और 1900 वर्षों से यह कंक्रीट बिना दरार के खड़ा है।',
    acousticOrStructuralPropertyEn:
      'The central circular aperture (oculus) creates a natural atmospheric pressure differential and acts as a compression ring holding the unreinforced dome ribs in static equilibrium.',
    acousticOrStructuralPropertyHi:
      'मध्यवर्ती वृत्ताकार छिद्र (ओकुलस) संपीडन वलय (compression ring) की तरह कार्य करता है, जो बिना लोहे की छड़ों वाले गुंबद को साम्यावस्था में बांधे रखता है।',
    funFactEn:
      'A perfect sphere of 43.3 m diameter could fit snugly inside the building touching the floor, walls, and dome summit.',
    funFactHi:
      'भवन के भीतर 43.3 मीटर व्यास का एक संपूर्ण गोला ठीक से समा सकता है जो फर्श, दीवारों और गुंबद के शिखर को छूएगा।',
    modelType: 'pantheon',
    accentColor: '#38bdf8',
    formulaNoteEn: 'Circle: plane perpendicular to cone axis; plane angle β = 0°',
    formulaNoteHi: 'वृत्त: शंकु अक्ष के लंबवत तल; तल का कोण β = 0°',
    wikipediaId: 'Pantheon',
  },
  {
    id: 'apple-park',
    nameEn: 'Apple Park ("The Spaceship")',
    nameHi: 'एप्पल पार्क ("द स्पेसशिप")',
    conicType: 'circle',
    city: 'Cupertino, California',
    country: 'United States',
    architect: 'Foster + Partners (Norman Foster)',
    yearBuilt: 2017,
    standardEquation: 'r_inner² ≤ x² + y² ≤ r_outer²',
    realWorldEquation: '177² ≤ x² + y² ≤ 232²  (meters)',
    eccentricity: 0.0,
    eccentricityFormula: 'e = c / a = 0',
    parameters: {
      'Outer Radius': '232 m',
      'Inner Radius': '177 m',
      'Ring Width': '55 m',
      'Circumference': '1,458 m (approx. 1 mile)',
    },
    keyDimensions: {
      'Diameter': '464 m (1,522 ft)',
      'Floor Area': '260,000 m²',
      'Curved Glass Panels': 'Over 3,000 curved sheets',
      'Park Courtyard': '30 acres of drought-resistant trees',
    },
    mathematicalSignificanceEn:
      'The building forms a monumental concentric annulus (ring) bounded by two concentric circles of radius 177m and 232m. It possesses continuous radial symmetry C_∞ broken only by floor circulation joints.',
    mathematicalSignificanceHi:
      'यह इमारत 177 मीटर और 232 मीटर त्रिज्या वाले दो संकेंद्री वृत्तों से बना एक भव्य वलय (annulus) है, जिसमें निरंतर त्रिज्यीय सममिति (radial symmetry) पाई जाती है।',
    architecturalAdvantageEn:
      'The circular geometry maximizes perimeter exposure to natural daylight for 12,000 employees while minimizing the total outer skin surface area relative to the enclosed courtyard volume.',
    architecturalAdvantageHi:
      'वृत्ताकार ज्यामिति 12,000 कर्मचारियों के लिए प्राकृतिक प्रकाश के अधिकतम प्रवेश को सुनिश्चित करती है, जबकि बंद आंगन के अनुपात में बाहरी दीवार क्षेत्र को न्यूनतम रखती है।',
    acousticOrStructuralPropertyEn:
      'Continuous circular base isolation bearings allow the entire 464-meter circular ring structure to move up to 1.2 meters in any horizontal direction during seismic events without torsional stress points.',
    acousticOrStructuralPropertyHi:
      'वृत्ताकार बेस आइसोलेशन भूकंप के दौरान पूरी 464 मीटर संरचना को 1.2 मीटर तक किसी भी दिशा में बिना मुड़न तनाव के सुरक्षित रूप से हिलने की अनुमति देता है।',
    funFactEn:
      'Features the world’s largest sheets of curved architectural structural glass manufactured specifically in Germany.',
    funFactHi:
      'इसमें विशेष रूप से जर्मनी में निर्मित दुनिया के सबसे बड़े घुमावदार संरचनात्मक कांच के पैनल लगे हैं।',
    modelType: 'applepark',
    accentColor: '#38bdf8',
    formulaNoteEn: 'Annular geometry: two concentric circles sharing identical center (0,0)',
    formulaNoteHi: 'वलयाकार ज्यामिति: समान केंद्र (0,0) साझा करने वाले दो संकेंद्री वृत्त',
    wikipediaId: 'Apple_Park',
  },
  {
    id: 'temple-of-heaven',
    nameEn: 'Hall of Prayer for Good Harvests (Temple of Heaven)',
    nameHi: 'स्वर्ग का मंदिर (प्रार्थना भवन)',
    conicType: 'circle',
    city: 'Beijing',
    country: 'China',
    architect: 'Ming Dynasty Architects (Emperor Yongle)',
    yearBuilt: '1420 AD',
    standardEquation: 'x² + y² = r²',
    realWorldEquation: 'x² + y² = 16.0²  (for base rotunda)',
    eccentricity: 0.0,
    eccentricityFormula: 'e = 0',
    parameters: {
      'Base Radius': '16.0 m',
      'Height': '38.0 m',
      'Terrace Tier 1 Radius': '45.0 m',
      'Terrace Tier 3 Radius': '27.0 m',
    },
    keyDimensions: {
      'Height': '38 m (125 ft)',
      'Terrace Levels': '3 concentric circular marble tiers',
      'Pillars': '28 wooden columns arranged in concentric rings',
      'Roofing': 'Triple-eaved circular cone glazed with blue tiles',
    },
    mathematicalSignificanceEn:
      'In traditional Chinese cosmology, Heaven was represented as a circle and Earth as a square. The hall is composed of three nested concentric circular terraces and a triple-gabled circular pavilion built without a single nail.',
    mathematicalSignificanceHi:
      'प्राचीन चीनी ब्रह्मांड विज्ञान में, स्वर्ग को एक वृत्त और पृथ्वी को एक वर्ग के रूप में दर्शाया गया था। यह मंडप तीन संकेंद्री वृत्ताकार संगमरमर चबूतरों पर बिना किसी लोहे की कील के निर्मित है।',
    architecturalAdvantageEn:
      'Concentric circular timber post-and-lintel interlocking brackets (Dougong) distribute roof gravity loads evenly across radial vectors, providing exceptional resilience against typhoon winds and earthquakes.',
    architecturalAdvantageHi:
      'संकेंद्री लकड़ी के इंटरलॉकिंग ब्रैकेट्स (डौगॉन्ग) छत के भार को रेडियल दिशाओं में समान रूप से बांटते हैं, जिससे भूकंप और तूफानी हवाओं में असाधारण स्थिरता मिलती है।',
    acousticOrStructuralPropertyEn:
      'The Circular Mound Altar nearby features an acoustic phenomenon where voice spoken from the center circular stone reflects off balustrades in equal spherical waves with intense resonance.',
    acousticOrStructuralPropertyHi:
      'पास ही स्थित वृत्ताकार चबूतरे पर केंद्र के पत्थर से बोली गई आवाज संगमरमर की रेलिंग से समान गोलीय तरंगों में टकराकर गूंजती है।',
    funFactEn:
      'The number of balusters and steps in each circular tier is strictly a multiple of 9, the imperial celestial number.',
    funFactHi:
      'प्रत्येक वृत्ताकार स्तर पर सीढ़ियों और कटघरे की संख्या नौ (9) की गुणक है, जो स्वर्गीय संख्या मानी जाती है।',
    modelType: 'templeheaven',
    accentColor: '#38bdf8',
    formulaNoteEn: 'Concentric circles with rotational symmetry of order 4 and 12',
    formulaNoteHi: 'ऑर्डर 4 और 12 की घूर्णी सममिति वाले संकेंद्री वृत्त',
    wikipediaId: 'Temple_of_Heaven',
  },
  {
    id: 'sydney-opera-house',
    nameEn: 'Sydney Opera House Shells',
    nameHi: 'सिडनी ओपेरा हाउस (गोलीय खोल)',
    conicType: 'circle',
    city: 'Sydney',
    country: 'Australia',
    architect: 'Jørn Utzon & Ove Arup',
    yearBuilt: 1973,
    standardEquation: 'x² + y² + z² = R²',
    realWorldEquation: 'x² + y² + z² = 75.2²  (spherical circular shells, R = 75.2m)',
    eccentricity: 0.0,
    eccentricityFormula: 'e = 0  (planar cuts through sphere generate exact circles)',
    parameters: {
      'Sphere Radius (R)': '75.2 m (246.7 ft)',
      'Shell Precast Ribs': '1,056 articulated segments',
      'Roof Tile Count': '1,056,006 Swedish glazed ceramic tiles',
      'Max Peak Height': '67 m above sea level',
    },
    keyDimensions: {
      'Podium Length': '183 m (600 ft)',
      'Podium Width': '120 m (394 ft)',
      'Shell Thickness': 'Precast arch ribs tapering from 2.4 m to 0.6 m',
      'Structural Weight': '111,000 tons anchored into harbour granite',
    },
    mathematicalSignificanceEn:
      'Utzon’s legendary breakthrough ("The Spherical Solution") proved all 14 complex vault shells could be cast from triangular segments cut from a single mathematical sphere of constant radius R = 75.2m. Every plane cutting through the sphere yields an exact circle with eccentricity e = 0.',
    mathematicalSignificanceHi:
      'उत्ज़ोन का ऐतिहासिक समाधान ("द स्फेरिकल सॉल्यूशन") यह था कि सभी 14 जटिल खोल 75.2 मीटर त्रिज्या वाले एक ही गणितीय गोले की सतह से काटे जा सकते हैं। इस गोले को काटने वाला कोई भी समतल शुद्ध वृत्त (e = 0) बनाता है।',
    architecturalAdvantageEn:
      'Reduced bespoke formwork from thousands of unique moulds to repetitive prefabricated circular arch segments produced on site from a single master wooden mould, making one of modern history’s most daring structures mathematically buildable.',
    architecturalAdvantageHi:
      'हजारों अलग-अलग सांचों की जगह एक ही मास्टर सांचे से पूर्वनिर्मित वृत्ताकार चाप खंडों के निर्माण की अनुमति दी, जिससे भारी लागत बची और आधुनिक इतिहास की सबसे साहसी संरचना का निर्माण संभव हुआ।',
    acousticOrStructuralPropertyEn:
      'The precast circular ribs act as articulated funicular arches holding massive Swedish ceramic tiles, transferring roof loads directly to the monumental sandstone-faced podium anchored into Sydney Harbour.',
    acousticOrStructuralPropertyHi:
      'पूर्वनिर्मित वृत्ताकार पसलियां मेहराब की तरह कार्य करती हैं, जो छत के भार को सीधे सिडनी बंदरगाह में बने मजबूत पोडियम तक स्थानांतरित करती हैं।',
    funFactEn:
      'Utzon hit upon the spherical solution while peeling an orange and realizing that identical curved triangular segments could be sliced from a single round ball.',
    funFactHi:
      'उत्ज़ोन को यह विचार संतरा छीलते समय आया था जब उन्होंने महसूस किया कि एक ही गोल फल से समान घुमावदार त्रिकोणीय खंड काटे जा सकते हैं।',
    modelType: 'sydneyoperahouse',
    accentColor: '#38bdf8',
    formulaNoteEn: 'Spherical solution: All shells cut from one sphere with constant circular radius R = 75.2m',
    formulaNoteHi: 'गोलीय समाधान: सभी खोल 75.2 मीटर की स्थिर वृत्ताकार त्रिज्या वाले एक ही गोले से काटे गए',
    wikipediaId: 'Sydney_Opera_House',
  },

  // ==========================================
  // ELLIPSES (0 < e < 1)
  // ==========================================
  {
    id: 'st-pauls',
    nameEn: "St. Paul's Cathedral Whispering Gallery",
    nameHi: "सेंट पॉल्स कैथेड्रल (व्हिस्परिंग गैलरी)",
    conicType: 'ellipse',
    city: 'London',
    country: 'United Kingdom',
    architect: 'Sir Christopher Wren',
    yearBuilt: 1710,
    standardEquation: 'x²/a² + y²/b² = 1',
    realWorldEquation: 'x²/16.5² + y²/15.2² = 1  (meters)',
    eccentricity: 0.389,
    eccentricityFormula: 'e = \\sqrt{1 - b^2/a^2} = \\sqrt{1 - 15.2^2/16.5^2} \\approx 0.389',
    parameters: {
      'Semi-major axis (a)': '16.5 m',
      'Semi-minor axis (b)': '15.2 m',
      'Focal Distance (c)': '6.42 m',
      'Focal Separation (2c)': '12.84 m',
    },
    keyDimensions: {
      'Internal Diameter': '34 m base ring',
      'Height of Gallery': '30 m above cathedral floor',
      'Triple-Dome System': 'Outer lead dome, brick cone, inner dome',
      'Circumference': '107 m walking gallery',
    },
    mathematicalSignificanceEn:
      'The gallery is famous for the optical and acoustic reflection theorem of the ellipse: any ray emanating from one focus F1 that strikes the boundary will reflect directly to the second focus F2, because the normal bisects the angle formed by lines to both foci.',
    mathematicalSignificanceHi:
      'यह गैलरी दीर्घवृत्त के परावर्तन प्रमेय के लिए विख्यात है: एक नाभि F1 से निकलने वाली कोई भी ध्वनि तरंग परिधि से टकराकर सीधे दूसरी नाभि F2 पर केंद्रित होती है, क्योंकि अभिलंब दोनों नाभियों के कोण को समद्विभाजित करता है।',
    architecturalAdvantageEn:
      'An elliptical or compound oval dome distributes lateral horizontal thrust along major and minor axes, reducing the necessary mass of supporting buttresses compared to a hemispherical dome of equal volume.',
    architecturalAdvantageHi:
      'दीर्घवृत्ताकार गुंबद पार्श्व क्षैतिज थ्रस्ट को प्रमुख और लघु अक्षों पर बांटता है, जिससे समान आयतन के गोल गुंबद की तुलना में सपोर्टिंग बट्रेस का भार कम हो जाता है।',
    acousticOrStructuralPropertyEn:
      'Lord Rayleigh mathematically proved in 1910 that high-frequency sound waves cling to the curved elliptical perimeter boundary (whispering gallery waves) without spreading into the 3D volume, delivering whispers 33m away.',
    acousticOrStructuralPropertyHi:
      'लॉर्ड रेले ने 1910 में सिद्ध किया कि उच्च-आवृत्ति वाली ध्वनि तरंगें दीवार की वक्रता से चिपकी रहकर बिना बिखरते हुए 33 मीटर दूर फुसफुसाहट को स्पष्ट पहुंचाती हैं।',
    funFactEn:
      'A soft whisper spoken against the wall at one focus can be clearly heard by someone placing their ear against the wall at the opposite focus.',
    funFactHi:
      'एक नाभि पर दीवार के पास धीमी फुसफुसाहट भी दूसरी विपरीत नाभि पर कान लगाने वाले व्यक्ति को साफ सुनाई देती है।',
    modelType: 'stpauls',
    accentColor: '#a855f7',
    formulaNoteEn: 'Ellipse focal ray law: PF₁ + PF₂ = 2a (constant distance sum)',
    formulaNoteHi: 'दीर्घवृत्त नाभि नियम: PF₁ + PF₂ = 2a (नियत दूरी का योग)',
    wikipediaId: "St_Paul's_Cathedral",
  },
  {
    id: 'colosseum',
    nameEn: 'The Colosseum (Flavian Amphitheatre)',
    nameHi: 'द कोलोसियम (फ्लेवियन एम्फीथिएटर)',
    conicType: 'ellipse',
    city: 'Rome',
    country: 'Italy',
    architect: 'Emperor Vespasian & Emperor Titus',
    yearBuilt: '80 AD',
    standardEquation: 'x²/a² + y²/b² = 1',
    realWorldEquation: 'x²/94.5² + y²/78.0² = 1  (outer perimeter)',
    eccentricity: 0.564,
    eccentricityFormula: 'e = \\sqrt{1 - 78.0^2/94.5^2} = \\sqrt{1 - 0.681} \\approx 0.564',
    parameters: {
      'Semi-major axis (a)': '94.5 m (Outer)',
      'Semi-minor axis (b)': '78.0 m (Outer)',
      'Arena Semi-major (a_arena)': '43.5 m',
      'Arena Semi-minor (b_arena)': '27.0 m',
    },
    keyDimensions: {
      'Outer Length': '189 m (620 ft)',
      'Outer Width': '156 m (512 ft)',
      'Arena Floor': '87 m × 54 m ellipse',
      'Perimeter': '545 m',
      'Capacity': '50,000 to 80,000 spectators',
    },
    mathematicalSignificanceEn:
      'With eccentricity e = 0.564, the Colosseum is an elliptical amphitheater (constructed with a 4-centered oval approximation by Roman surveyors). The geometry provides unobstructed sightlines to the center stage for 65,000 spectators.',
    mathematicalSignificanceHi:
      'उत्केंद्रता e = 0.564 के साथ, कोलोसियम एक सुव्यवस्थित दीर्घवृत्ताकार अखाड़ा है। यह ज्यामिति 65,000 दर्शकों को केंद्र में बिना किसी बाधा के बेहतरीन दृश्य कोण प्रदान करती है।',
    architecturalAdvantageEn:
      'The elongated ellipse creates dynamic crowd circulation along multiple foci, allowing all 50,000+ spectators to evacuate the entire structure in under 15 minutes through 80 numbered vomitoria arches.',
    architecturalAdvantageHi:
      'दीर्घवृत्त का आकार 80 मेहराबदार निकास द्वारों (vomitoria) के माध्यम से 50,000 से अधिक दर्शकों को मात्र 15 मिनट में सुरक्षित बाहर निकलने की सुविधा प्रदान करता है।',
    acousticOrStructuralPropertyEn:
      'The continuous ring of barrel and groin vaults arranged radially along the elliptical perimeter directs centrifugal outward thrust into massive travertine piers anchored into a concrete bed.',
    acousticOrStructuralPropertyHi:
      'दीर्घवृत्ताकार परिधि के अनुदिश बने मेहराब बाहरी दबाव को मजबूत ट्रैवर्टीन खंभों में स्थानांतरित करते हैं, जिससे यह संरचना 2000 वर्षों से स्थिर है।',
    funFactEn:
      'Roman surveyors set out the ellipse using a closed loop of rope of length 2a + 2c pegged at the two focal points.',
    funFactHi:
      'रोमन इंजीनियरों ने दोनों नाभियों पर खूंटे गाड़कर और 2a+2c लंबाई की रस्सी के फंदे का उपयोग करके यह दीर्घवृत्त खींचा था।',
    modelType: 'colosseum',
    accentColor: '#a855f7',
    formulaNoteEn: 'Eccentricity e = 0.564 gives optimal sightline depth and width balance',
    formulaNoteHi: 'उत्केंद्रता e = 0.564 दर्शकों की दृष्टि और चौड़ाई का सर्वोत्तम संतुलन बनाती है',
    wikipediaId: 'Colosseum',
  },
  {
    id: 'cybertecture-egg',
    nameEn: 'Cybertecture Egg',
    nameHi: 'साइबरटेक्चर एग (मुंबई)',
    conicType: 'ellipse',
    city: 'Mumbai, Maharashtra',
    country: 'India',
    architect: 'James Law Cybertecture',
    yearBuilt: 2014,
    standardEquation: 'x²/a² + y²/b² + z²/c² = 1',
    realWorldEquation: 'x²/32² + y²/25² + z²/52² = 1  (ellipsoid shell)',
    eccentricity: 0.625,
    eccentricityFormula: 'e = \\sqrt{1 - b^2/a^2} \\approx 0.625',
    parameters: {
      'Height (2c)': '104 m (vertical axis)',
      'Equatorial Span (2a)': '64 m',
      'Transverse Span (2b)': '50 m',
      'Eccentricity (Meridian)': '0.788 (vertical ellipse)',
    },
    keyDimensions: {
      'Building Height': '13 storeys (~65 m occupied)',
      'Floor Area': '33,000 m²',
      'Surface Reduction': '10-20% less surface area than cube',
      'Structural System': 'Diagrid steel shell exoskeleton',
    },
    mathematicalSignificanceEn:
      'The building takes the form of an asymmetric 3D prolate ellipsoid (egg geometry) generated by rotating an eccentric planar ellipse. The curved surface has varying Gaussian curvature that deflects monsoon wind pressures smoothly.',
    mathematicalSignificanceHi:
      'यह इमारत एक दीर्घवृत्तज (ellipsoid) अंडे के आकार में है। इसकी घुमावदार सतह पर बदलते गाऊसी वक्रता के कारण मुंबई की मानसूनी हवाओं का दबाव आसानी से बहकर निकल जाता है।',
    architecturalAdvantageEn:
      'The 3D elliptical form reduces solar heat gain by 10-20% compared to a conventional rectangular high-rise of identical volume, while the diagrid exoskeleton completely eliminates internal columns.',
    architecturalAdvantageHi:
      'समान आयतन की आयताकार इमारत की तुलना में यह दीर्घवृत्तीय आकृति सौर ताप अवशोषण को 10-20% तक कम कर देती है, और बाहरी डायग्रिड कंकाल आंतरिक खंभों की आवश्यकता खत्म कर देता है।',
    acousticOrStructuralPropertyEn:
      'The diagrid structural shell uses triangulated steel members tangent to the elliptical surface, converting bending moments into pure axial tension and compression along the curved skin.',
    acousticOrStructuralPropertyHi:
      'डायग्रिड खोल दीर्घवृत्त की स्पर्शरेखा में त्रिकोणीय स्टील बीम का उपयोग करता है, जो झुकने वाले तनाव को शुद्ध अक्षीय तनाव और संपीडन में बदल देता है।',
    funFactEn:
      'Designed with elevated sky gardens that naturally lower the internal ambient temperature via botanical evapotranspiration.',
    funFactHi:
      'इसमें प्राकृतिक स्काई गार्डन हैं जो पौधों के वाष्पोत्सर्जन के माध्यम से आंतरिक तापमान को स्वाभाविक रूप से ठंडा रखते हैं।',
    modelType: 'cybertecture',
    accentColor: '#a855f7',
    formulaNoteEn: 'Tri-axial ellipsoid: x²/a² + y²/b² + z²/c² = 1',
    formulaNoteHi: 'त्रि-अक्षीय दीर्घवृत्तज: x²/a² + y²/b² + z²/c² = 1',
    wikipediaId: 'Cybertecture_Egg',
  },
  {
    id: 'statuary-hall',
    nameEn: 'National Statuary Hall (U.S. Capitol)',
    nameHi: 'नेशनल स्टैचुअरी हॉल (अमेरिकी संसद भवन)',
    conicType: 'ellipse',
    city: 'Washington, D.C.',
    country: 'United States',
    architect: 'Benjamin Henry Latrobe',
    yearBuilt: 1819,
    standardEquation: 'x²/a² + y²/b² = 1',
    realWorldEquation: 'x²/14.65² + y²/10.67² = 1  (semi-elliptical chamber: 29.3m × 21.3m)',
    eccentricity: 0.680,
    eccentricityFormula: 'e = \\sqrt{1 - b^2/a^2} = \\sqrt{1 - 10.67^2/14.65^2} \\approx 0.680',
    parameters: {
      'Semi-major axis (a)': '14.65 m (48.0 ft)',
      'Semi-minor axis (b)': '10.67 m (35.0 ft)',
      'Focal Distance (c)': '10.02 m (32.9 ft)',
      'Foci Separation (2c)': '20.04 m (65.8 ft)',
    },
    keyDimensions: {
      'Floor Plan Length': '29.3 m (96 ft)',
      'Floor Plan Width': '21.3 m (70 ft)',
      'Ceiling Height': '10.7 m (35 ft) plaster vault',
      'Perimeter Colonnade': 'Breccia marble columns quarried along the Potomac River',
    },
    mathematicalSignificanceEn:
      'Statuary Hall is laid out in a semi-elliptical plan with a curved elliptical barrel vault dome. Because an ellipse satisfies the bifocal reflection condition, sound waves radiating from focus F₁ reflect off the plaster perimeter and converge with intense clarity at the conjugate focus F₂.',
    mathematicalSignificanceHi:
      'स्टैचुअरी हॉल एक अर्ध-दीर्घवृत्ताकार योजना में बना है। चूंकि दीर्घवृत्त दोहरी नाभि परावर्तन शर्त को पूरा करता है, इसलिए नाभि F₁ से निकलने वाली ध्वनि तरंगें दीवारों से टकराकर दूसरी नाभि F₂ पर अत्यंत स्पष्टता से केंद्रित होती हैं।',
    architecturalAdvantageEn:
      'Latrobe utilized the semi-ellipse to maximize floor seating along the perimeter while creating an expansive open central ceremonial hall without obstructing view lines between representatives.',
    architecturalAdvantageHi:
      'लैट्रोब ने परिधि पर अधिकतम सीटें उपलब्ध कराने और प्रतिनिधियों के बीच दृष्टि बाधित किए बिना एक भव्य केंद्रीय हॉल बनाने के लिए अर्ध-दीर्घवृत्त का उपयोग किया।',
    acousticOrStructuralPropertyEn:
      'Former President John Quincy Adams discovered that his desk was situated precisely on one mathematical acoustic focus (F₂). He secretly listened to opposition Whig leaders whispering confidential strategies across the hall at focus F₁!',
    acousticOrStructuralPropertyHi:
      'पूर्व राष्ट्रपति जॉन क्विंसी एडम्स ने पाया कि उनका डेस्क ठीक एक ध्वनिक नाभि (F₂) पर स्थित था। वे हॉल के पार नाभि F₁ पर फुसफुसा रहे विपक्षी नेताओं की गुप्त योजनाएं आसानी से सुन लेते थे!',
    funFactEn:
      'A bronze plaque embedded in the marble floor marks the exact acoustic focus spot where John Quincy Adams sat and conducted his legislative espionage.',
    funFactHi:
      'संगमरमर के फर्श पर लगा एक कांस्य पट्टिका उस सटीक ध्वनिक नाभि बिंदु को दर्शाती है जहाँ जॉन क्विंसी एडम्स बैठते थे।',
    modelType: 'statuaryhall',
    accentColor: '#a855f7',
    formulaNoteEn: 'Semi-ellipse whispering room: Foci separated by 2c = 20.04m, e = 0.680',
    formulaNoteHi: 'अर्ध-दीर्घवृत्त फुसफुसाहट कक्ष: नाभियों के बीच की दूरी 2c = 20.04m, e = 0.680',
    wikipediaId: 'National_Statuary_Hall',
  },

  // ==========================================
  // PARABOLAS (e = 1)
  // ==========================================
  {
    id: 'gateway-arch',
    nameEn: 'Gateway Arch',
    nameHi: 'गेटवे आर्च (सेंट लुइस)',
    conicType: 'parabola',
    city: 'St. Louis, Missouri',
    country: 'United States',
    architect: 'Eero Saarinen & Hannskarl Bandel',
    yearBuilt: 1965,
    standardEquation: 'y = -ax² + h',
    realWorldEquation: 'y = 192 - 0.0052 x²  (parabolic approximation; exact: y = -A cosh(Cx) + B)',
    eccentricity: 1.0,
    eccentricityFormula: 'e = 1.0  (Plane parallel to cone generator line)',
    parameters: {
      'Height (h)': '192 m (630 ft)',
      'Span (2w)': '192 m (630 ft)',
      'Aspect Ratio': '1:1 height-to-width',
      'Eccentricity (e)': '1.000',
    },
    keyDimensions: {
      'Height & Width': '192 m × 192 m (630 ft × 630 ft)',
      'Triangle Cross-Section Base': '16.5 m per side',
      'Triangle Cross-Section Top': '5.1 m per side',
      'Total Stainless Steel': '886 metric tons',
      'Wind Sway Limit': 'Up to 46 cm (18 in) in 240 km/h wind',
    },
    mathematicalSignificanceEn:
      'While Saarinen employed a flattened weighted catenary formula to account for the arch tapering from a 16.5m triangular base to 5.1m at the apex, its curve is intimately tied to the parabola (e = 1). Under uniform vertical deck loads, a parabola is the exact funicular curve that eliminates all bending moments.',
    mathematicalSignificanceHi:
      'शिखर पर 5.1 मीटर और आधार पर 16.5 मीटर की मोटाई के साथ, यह वक्र परवलय (e = 1) और भारित कैटेनरी से संबंधित है। समान लंबवत भार के तहत, परवलय शून्य बेंडिंग मोमेंट सुनिश्चित करता है।',
    architecturalAdvantageEn:
      'In a parabolic arch carrying uniform load, the resultant internal stress vector coincides exactly with the centroid of the arch cross-section at every point, meaning the structure experiences pure axial compression and zero shear failure risk.',
    architecturalAdvantageHi:
      'परवलयिक मेहराब में प्रत्येक बिंदु पर आंतरिक दबाव सीधे जमीन की ओर संपीड़ित होता है, जिससे संरचना केवल शुद्ध संपीड़न (pure compression) अनुभव करती है और मुड़ने का खतरा शून्य रहता है।',
    acousticOrStructuralPropertyEn:
      'The parabolic curve channels gravity thrust directly downward into subterranean concrete anchor caissons sunk 18 meters into solid bedrock.',
    acousticOrStructuralPropertyHi:
      'परवलयिक वक्र गुरुत्वाकर्षण थ्रस्ट को सीधे जमीन में 18 मीटर गहरे ठोस चट्टान में धंसे कंक्रीट एंकरों में पहुंचा देता है।',
    funFactEn:
      'The arch legs were built simultaneously from both sides; when the 2.4-meter final triangular keystone was hoisted into place, water had to be sprayed on the sun-expanded south leg to align the closing gap.',
    funFactHi:
      'दोनों भुजाएं एक साथ बनाई गई थीं; अंतिम की-स्टोन लगाने के लिए धूप से फैली दक्षिणी भुजा पर पानी छिड़क कर ठंडा करना पड़ा था ताकि दोनों सिरे मिल सकें।',
    modelType: 'gatewayarch',
    accentColor: '#10b981',
    formulaNoteEn: 'Parabola: Directrix d: y = h + p, Focus F: (0, h - p), Eccentricity e = 1',
    formulaNoteHi: 'परवलय: नियता d: y = h + p, नाभि F: (0, h - p), उत्केंद्रता e = 1',
    wikipediaId: 'Gateway_Arch',
  },
  {
    id: 'oceanografic-valencia',
    nameEn: "L'Oceanogràfic (Submarine Restaurant)",
    nameHi: "एल'ओशिनोग्राफिक (पनडुब्बी रेस्तरां)",
    conicType: 'parabola',
    city: 'Valencia',
    country: 'Spain',
    architect: 'Félix Candela',
    yearBuilt: 2003,
    standardEquation: 'z = x²/a² - y²/b²',
    realWorldEquation: 'z = x²/8.5² - y²/12.2²  (hyperbolic paraboloid petals)',
    eccentricity: 1.0,
    eccentricityFormula: 'e = 1.0  (parabolic vertical profiles, e=1)',
    parameters: {
      'Petal Count': '8 parabolic lobes',
      'Shell Thickness': '6 cm (2.4 in) ultra-thin concrete',
      'Diameter': '35 m',
      'Height': '14 m',
    },
    keyDimensions: {
      'Roof Span': '35 m diameter without columns',
      'Concrete Thickness': '60 mm to 100 mm',
      'Material': 'Reinforced fiber-mesh gunite concrete',
      'Surrounding Water': 'Lagoon reflecting parabolic petal arches',
    },
    mathematicalSignificanceEn:
      'The roof is composed of eight intersecting hyperbolic paraboloids (hypar shells). Vertical sections parallel to the symmetry axes are exact parabolas (e = 1). As a ruled surface, this doubly curved form can be formed using straight wooden formwork timbers!',
    mathematicalSignificanceHi:
      'इसकी छत आठ परस्पर काटते हुए हाइपरबोलिक पैराबोलोइड्स (hypar) से बनी है। ऊर्ध्वाधर काट शुद्ध परवलय (e = 1) हैं। एक रूल्ड सतह होने के कारण, यह वक्र सीधी लकड़ी की तख्तियों से ढाला जा सकता है!',
    architecturalAdvantageEn:
      'The double parabolic curvature provides membrane action where loads are carried purely by in-plane tension and compression rather than out-of-plane bending, allowing a concrete shell only 6 cm thick to span 35 meters without collapsing.',
    architecturalAdvantageHi:
      'दोहरी परवलयिक वक्रता झिल्ली क्रिया (membrane action) उत्पन्न करती है, जिससे मात्र 6 सेमी मोटी कंक्रीट की परत बिना किसी खंभे के 35 मीटर तक मजबूती से तनी रहती है।',
    acousticOrStructuralPropertyEn:
      'The parabolic petals direct rain water rapidly along their downward curvatures into drainage gargoyles while providing optimal acoustics for the circular dining floor beneath.',
    acousticOrStructuralPropertyHi:
      'परवलयिक पंखुड़ियां बारिश के पानी को तेजी से नीचे बहाती हैं और नीचे भोजन करने वालों के लिए बेहतरीन ध्वनिकी प्रदान करती हैं।',
    funFactEn:
      'Felix Candela was renowned as the "Magician of Concrete Shells" because his mathematical hypars achieved the proportional thinness of an eggshell.',
    funFactHi:
      'फेलिक्स कैंडेला को "कंक्रीट का जादूगर" कहा जाता था क्योंकि उनके गणितीय शैल एक अंडे के छिलके से भी पतले अनुपात में बनाए जाते थे।',
    modelType: 'oceanografic',
    accentColor: '#10b981',
    formulaNoteEn: 'Hyperbolic Paraboloid: vertical parabolic sections with e = 1',
    formulaNoteHi: 'हाइपरबोलिक पैराबोलोइड: e = 1 वाले ऊर्ध्वाधर परवलयिक क्रॉस-सेक्शन',
    wikipediaId: "L'Oceanogràfic",
  },
  {
    id: 'saddledome',
    nameEn: 'Scotiabank Saddledome',
    nameHi: 'स्कॉटियाबैंक सैडल्डोम (कैलगरी)',
    conicType: 'parabola',
    city: 'Calgary, Alberta',
    country: 'Canada',
    architect: 'Graham McCourt Architects & Jan Bobrowski',
    yearBuilt: 1983,
    standardEquation: 'z = x²/a² - y²/b²',
    realWorldEquation: 'z = x²/61.0² - y²/61.0²  (122m span inverted hyperbolic paraboloid saddle)',
    eccentricity: 1.0,
    eccentricityFormula: 'e = 1.0  (principal orthogonal vertical cross-sections are parabolas)',
    parameters: {
      'Span': '122 m (400 ft) clear unobstructed span',
      'Sagitta Sag': '14 m vertical dip at center',
      'Perimeter Ring': 'Precast prestressed concrete ring beam',
      'Eccentricity (e)': '1.000 (parabolic cables)',
    },
    keyDimensions: {
      'Roof Diameter': '122 m (400 ft)',
      'Seating Capacity': '19,289 spectators',
      'Cable Network': 'Precast concrete panels hung on steel cable grid',
      'Enclosed Air Volume': 'Reduced by 33% compared to conventional hemispherical domes',
    },
    mathematicalSignificanceEn:
      'The Saddledome’s roof is a monumental inverse hyperbolic paraboloid (hypar). The vertical profile sagging along the longitudinal axis is a hanging gravity parabola (tension cables), while the arching hogging profile across the transverse axis is an upward compression parabola (e = 1).',
    mathematicalSignificanceHi:
      'सैडल्डोम की छत एक विशाल उलटा हाइपरबोलिक पैराबोलोइड (काठी आकार) है। अनुदैर्ध्य अक्ष पर लटकता हुआ वक्र एक तनाव परवलय है, जबकि अनुप्रस्थ अक्ष पर ऊपर उठा हुआ वक्र एक संपीड़न परवलय (e = 1) है।',
    architecturalAdvantageEn:
      'By draping the roof into a saddle rather than arching upward into a hemisphere, the building eliminated 33% of unnecessary internal air volume, reducing heating and air-conditioning costs by over 40% during sub-zero Canadian winters.',
    architecturalAdvantageHi:
      'छत को गुंबद की तरह ऊपर उठाने के बजाय काठी की तरह नीचे झुकाकर, इमारत ने 33% अनावश्यक आंतरिक हवा की मात्रा को घटा दिया, जिससे कड़ाके की सर्दियों में हीटिंग लागत 40% तक कम हो गई।',
    acousticOrStructuralPropertyEn:
      'The outer reinforced concrete ring beam (122m diameter) acts as a continuous compression ring, counterbalancing the 3,000 tons of tension pulled by the interior suspended parabolic cable net.',
    acousticOrStructuralPropertyHi:
      'बाहरी 122 मीटर कंक्रीट रिंग बीम एक सतत संपीड़न वलय के रूप में कार्य करता है, जो आंतरिक परवलयिक केबल जाल द्वारा खींचे गए 3,000 टन तनाव को संतुलित करता है।',
    funFactEn:
      'Built for the 1988 Winter Olympic Games, it is recognized globally as the world’s largest hyperbolic paraboloid prestressed concrete saddle roof.',
    funFactHi:
      '1988 के शीतकालीन ओलंपिक खेलों के लिए निर्मित, यह दुनिया की सबसे बड़ी हाइपरबोलिक पैराबोलोइड कंक्रीट काठी छत के रूप में विख्यात है।',
    modelType: 'saddledome',
    accentColor: '#10b981',
    formulaNoteEn: 'Hyperbolic Paraboloid saddle: Orthogonal parabolic curves in tension and compression',
    formulaNoteHi: 'हाइपरबोलिक पैराबोलोइड काठी: तनाव और संपीड़न में परस्पर लंबवत परवलयिक वक्र',
    wikipediaId: 'Scotiabank_Saddledome',
  },
  {
    id: 'warm-mineral-springs',
    nameEn: 'Warm Mineral Springs Motel Roof',
    nameHi: 'वार्म मिनरल स्प्रिंग्स मोटल (छत)',
    conicType: 'parabola',
    city: 'North Port, Florida',
    country: 'United States',
    architect: 'Victor Lundy',
    yearBuilt: 1958,
    standardEquation: 'z = c(x² - y²)',
    realWorldEquation: 'z = 0.12(x² - y²)  (cluster of hypar parabolic timber umbrellas)',
    eccentricity: 1.0,
    eccentricityFormula: 'e = 1.0  (parabolic generators in saddle membrane)',
    parameters: {
      'Umbrella Canopy Size': '4.4 m × 4.4 m (14.5 ft) each',
      'Canopy Count': 'Cluster of independent hypar shells',
      'Central Stem': 'Steel pipe column 10 cm diameter',
      'Roof Material': 'Laminated wood timber slats',
    },
    keyDimensions: {
      'Total Canopy Area': 'Over 20 cantilevered hypar units',
      'Shell Thickness': '5 cm double-layer laminated pine',
      'Structure': 'Hyperbolic paraboloid umbrella shells',
      'National Register': 'Added to U.S. National Register of Historic Places',
    },
    mathematicalSignificanceEn:
      'Victor Lundy engineered an exquisite canopy composed of modular hyperbolic paraboloid (hypar) umbrellas. Each umbrella is a saddle surface generated by straight wooden 2x2 tongue-and-groove boards, yet every vertical diagonal slice through the surface yields an exact catenary parabola (e = 1).',
    mathematicalSignificanceHi:
      'विक्टर लुंडी ने मॉड्यूलर हाइपरबोलिक पैराबोलोइड छतरियों की एक अनूठी छतरी डिजाइन की। प्रत्येक छतरी सीधी लकड़ी की पट्टियों से बनी एक काठी सतह है, फिर भी इसके विकर्ण पर हर ऊर्ध्वाधर काट शुद्ध परवलय (e = 1) बनाती है।',
    architecturalAdvantageEn:
      'Because a hyperbolic paraboloid is doubly-ruled, Lundy built soaring dramatic curved canopies using ordinary, inexpensive straight timber boards nailed together in alternating diagonal layers, requiring zero complex curved formwork.',
    architecturalAdvantageHi:
      'चूंकि हाइपरबोलिक पैराबोलोइड एक द्वि-रूल्ड सतह है, लुंडी ने बिना किसी घुमावदार सांचे के साधारण सीधी लकड़ी की तख्तियों को तिरछा जोड़कर यह मनमोहक घुमावदार छत बनाई।',
    acousticOrStructuralPropertyEn:
      'The inverted parabolic slope channels torrential Florida hurricane rainwater directly inward down the hollow central steel pipe stem into underground storm cisterns, preventing roof edge pooling.',
    acousticOrStructuralPropertyHi:
      'उलटा परवलयिक ढलान फ्लोरिडा के तूफानी बारिश के पानी को सीधे बीच के खोखले स्टील खंभे के जरिए नीचे बहा देता है, जिससे छत के किनारों पर पानी नहीं भरता।',
    funFactEn:
      'Lundy designed it to evoke a sacred grove of trees, with the overlapping parabolic wooden umbrellas filtering daylight like a forest canopy.',
    funFactHi:
      'लुंडी ने इसे एक पवित्र उपवन की तरह डिज़ाइन किया था, जहाँ लकड़ी की परवलयिक छतरियां जंगल की शाखाओं की तरह धूप को छानती हैं।',
    modelType: 'warmmineralsprings',
    accentColor: '#10b981',
    formulaNoteEn: 'Hypar umbrella shell: straight timber rulings forming parabolic orthogonal curvature',
    formulaNoteHi: 'हाइपर छतरी शैल: सीधी लकड़ी की रेखाओं से निर्मित परस्पर परवलयिक वक्रता',
    wikipediaId: 'Warm_Mineral_Springs_Motel',
  },

  // ==========================================
  // HYPERBOLAS & HYPERBOLOIDS (e > 1)
  // ==========================================
  {
    id: 'shukhov-tower',
    nameEn: 'Shukhov Tower (Polibino)',
    nameHi: 'शुखोव टॉवर (पोलिबिनो)',
    conicType: 'hyperbola',
    city: 'Polibino, Lipetsk Oblast',
    country: 'Russia',
    architect: 'Vladimir Shukhov',
    yearBuilt: 1896,
    standardEquation: 'x²/a² + y²/a² - z²/c² = 1',
    realWorldEquation: 'x²/4.8² + y²/4.8² - z²/18.0² = 1  (world’s first hyperboloid structure, 1896)',
    eccentricity: 2.15,
    eccentricityFormula: 'e = \\sqrt{1 + c^2/a^2} = \\sqrt{1 + 18.0^2/4.8^2} \\approx 2.15',
    parameters: {
      'Height': '37 m (121 ft) original 1896 diagrid',
      'Base Diameter': '11 m',
      'Waist Throat Diameter': '5.2 m',
      'Ruling Lines Count': '128 straight steel angle bars in diagrid',
    },
    keyDimensions: {
      'Height': '37 m (121 ft)',
      'Water Reservoir Capacity': '9,500 buckets (114 m³) top tank',
      'Structure': 'Doubly-ruled hyperboloid of revolution',
      'Historical Milestone': 'World’s first hyperboloid tower in architectural history',
    },
    mathematicalSignificanceEn:
      'Constructed for the 1896 All-Russia Exhibition in Nizhny Novgorod and relocated to Polibino, this is the world’s very first hyperboloid tower. Shukhov demonstrated that through every point on a hyperboloid of revolution pass two straight ruling lines, allowing an elegant doubly-curved structure to be fabricated from straight steel bars.',
    mathematicalSignificanceHi:
      'निज़नी नोवगोरोड में 1896 की अखिल रूसी प्रदर्शनी के लिए निर्मित और पोलिबिनो में स्थानांतरित, यह दुनिया का पहला अतिपरवलयिक टॉवर है। शुखोव ने साबित किया कि अतिपरवलयज की घुमावदार सतह के हर बिंदु से दो सीधी रेखाएं गुजरती हैं, जिससे पूरी संरचना केवल सीधी छड़ों से बन जाती है।',
    architecturalAdvantageEn:
      'Because the lattice is formed exclusively from straight lines crossing in diagonal triangles, the structure experiences pure tension and compression in its members with zero bending moment and almost zero wind drag.',
    architecturalAdvantageHi:
      'चूंकि जाली पूरी तरह से विकर्ण में मिलने वाली सीधी रेखाओं से बनी है, इसलिए इसमें झुकने वाला तनाव शून्य होता है और हवा का प्रतिरोध लगभग न के बराबर होता है।',
    acousticOrStructuralPropertyEn:
      'The open hyperbolic mesh allows severe Arctic gale winds to pass straight through the tower without inducing dynamic vortex shedding resonance.',
    acousticOrStructuralPropertyHi:
      'खुली अतिपरवलयिक जाली के कारण बर्फीली तेज हवाएं बिना किसी कंपन या नुकसान के टॉवर के आर-पार निकल जाती हैं।',
    funFactEn:
      'Industrialist and art patron Yury Nechaev-Maltsov purchased this revolutionary tower directly from the 1896 exhibition and had it erected on his estate in Polibino, where it still stands today.',
    funFactHi:
      'उद्योगपति यूरी नेचायेव-माल्त्सोव ने 1896 की प्रदर्शनी से इस क्रांतिकारी टॉवर को खरीदा और इसे पोलिबिनो में अपनी संपत्ति पर स्थापित करवाया, जहाँ यह आज भी खड़ा है।',
    modelType: 'shukhov',
    accentColor: '#f59e0b',
    formulaNoteEn: 'Hyperboloid of one sheet: doubly ruled surface formed by two families of straight ruling lines',
    formulaNoteHi: 'एक-शीट अतिपरवलयज: सीधी रेखाओं के दो परिवारों द्वारा निर्मित द्वि-रूल्ड सतह',
    wikipediaId: 'Shukhov_Tower_in_Polibino',
  },
  {
    id: 'canton-tower',
    nameEn: 'Canton Tower ("Slim Waist")',
    nameHi: 'कैंटन टॉवर ("स्लिम वेस्ट")',
    conicType: 'hyperbola',
    city: 'Guangzhou',
    country: 'China',
    architect: 'Mark Hemel & Barbara Kuit (Information Based Architecture)',
    yearBuilt: 2010,
    standardEquation: 'x²/a² + y²/b² - z²/c² = 1',
    realWorldEquation: 'x²/10.0² + y²/14.0² - (z - 450)²/160.0² = 1  (waist ellipse)',
    eccentricity: 2.35,
    eccentricityFormula: 'e = \\sqrt{1 + c^2/a^2} \\approx 2.35',
    parameters: {
      'Total Height': '604 m (1,982 ft)',
      'Base Footprint': '60 m × 40 m ellipse',
      'Waist Dimensions': '20 m × 14 m ellipse at 450 m',
      'Twist Angle': '45° clockwise rotation from base to top',
    },
    keyDimensions: {
      'Height': '604 m (tallest tower in China upon completion)',
      'Observation Deck': '488 m rooftop plaza',
      'Columns': '24 slanted concrete-filled steel tubes',
      'Tuned Mass Dampers': 'Two 650-ton water tanks against typhoon sway',
    },
    mathematicalSignificanceEn:
      'The Canton Tower is generated by twisting two elliptical profiles (one at the base and one at the top) relative to each other by 45 degrees, forming a hyperbolic ruled waist at elevation 450 meters with eccentricity e > 2.',
    mathematicalSignificanceHi:
      'कैंटन टॉवर आधार और शीर्ष के दो दीर्घवृत्तों को 45 डिग्री घुमाकर बनाया गया है, जिससे 450 मीटर की ऊंचाई पर e > 2 उत्केंद्रता वाली एक अतिपरवलयिक पतली कमर बनती है।',
    architecturalAdvantageEn:
      'The constricted hyperbolic waist disrupts coherent aerodynamic vortex shedding, suppressing violent crosswind oscillation during Category 5 typhoons in the South China Sea.',
    architecturalAdvantageHi:
      'इसकी संकुचित अतिपरवलयिक कमर आंधी के दौरान हवा के भंवरों को तोड़ती है, जिससे भीषण तूफानों में भी टॉवर के हिलने का खतरा बहुत घट जाता है।',
    acousticOrStructuralPropertyEn:
      'The 24 straight inclined perimeter columns follow the linear rulings of the hyperboloid, transferring gravity and torsional wind moments directly down to the foundation.',
    acousticOrStructuralPropertyHi:
      'इसके 24 सीधे झुके हुए बाहरी खंभे अतिपरवलयज की सीधी रेखाओं का अनुसरण करते हैं, जो गुरुत्वाकर्षण और हवा के दबाव को सीधे नींव तक पहुंचाते हैं।',
    funFactEn:
      'Features the world’s highest horizontal Ferris Wheel (Bubble Tram) orbiting the tilted elliptical roof at 455 meters.',
    funFactHi:
      'इसमें 455 मीटर की ऊंचाई पर झुकी हुई दीर्घवृत्ताकार छत के चारों ओर घूमने वाला दुनिया का सबसे ऊंचा फेरिस व्हील (बबल ट्राम) है।',
    modelType: 'canton',
    accentColor: '#f59e0b',
    formulaNoteEn: 'Ruled hyperboloid formed by rotating an upper ellipse relative to the lower foundation',
    formulaNoteHi: 'निचली नींव के सापेक्ष ऊपरी दीर्घवृत्त को घुमाकर बनाई गई रूल्ड अतिपरवलयिक संरचना',
    wikipediaId: 'Canton_Tower',
  },
  {
    id: 'cathedral-brasilia',
    nameEn: 'Cathedral of Brasília',
    nameHi: 'ब्रासीलिया का कैथेड्रल',
    conicType: 'hyperbola',
    city: 'Brasília',
    country: 'Brazil',
    architect: 'Oscar Niemeyer',
    yearBuilt: 1970,
    standardEquation: 'x²/a² + y²/a² - z²/c² = 1',
    realWorldEquation: 'x²/16.0² + y²/16.0² - (z - 20)²/14.0² = 1  (hyperbolic columns)',
    eccentricity: 1.65,
    eccentricityFormula: 'e = \\sqrt{1 + 14.0^2/16.0^2} \\approx 1.65',
    parameters: {
      'Height': '40 m',
      'Diameter at Base': '70 m',
      'Waist Diameter': '32 m',
      'Pillars': '16 identical curved hyperbolic concrete columns',
    },
    keyDimensions: {
      'External Diameter': '70 m (230 ft)',
      'Column Weight': '90 metric tons per column',
      'Stained Glass Area': '2,000 m² of fiberglass triangular panels',
      'Access': 'Subterranean dark hallway emerging into brilliant light',
    },
    mathematicalSignificanceEn:
      'The crown of the cathedral is formed by 16 identical prestressed concrete curved columns assembled along a circular perimeter, each tracing an exact hyperbolic arc (e = 1.65) that curves inward to a narrow throat before flaring outward.',
    mathematicalSignificanceHi:
      'कैथेड्रल का मुकुट 16 समान कंक्रीट स्तंभों से बना है, जिनमें से प्रत्येक एक अतिपरवलयिक चाप (e = 1.65) का निर्माण करता है जो बीच में संकरा होकर फिर आकाश की ओर खुलता है।',
    architecturalAdvantageEn:
      'The inward hyperbolic lean creates an self-supporting structural arching effect: gravity dead-load forces the column tops against each other into a compression ring, eliminating tensile cracking in the concrete.',
    architecturalAdvantageHi:
      'अंदर की ओर झुकाव एक स्व-सहायक मेहराब प्रभाव पैदा करता है: गुरुत्वाकर्षण खंभों के सिरों को एक संपीड़न वलय में दबाता है, जिससे कंक्रीट में दरारें नहीं पड़तीं।',
    acousticOrStructuralPropertyEn:
      'The hyperbolic envelope encloses an underground sanctuary that remains thermally stable year-round, while triangular stained-glass panels suspended between hyperbolic ribs maximize upward daylight.',
    acousticOrStructuralPropertyHi:
      'अतिपरवलयिक आवरण एक भूमिगत प्रार्थना कक्ष को घेरता है जो साल भर ठंडा रहता है, और रंगीन कांच की खिड़कियां ऊपर से भव्य प्राकृतिक प्रकाश लाती हैं।',
    funFactEn:
      'Niemeyer intentionally designed visitors to walk through a completely pitch-black underground tunnel before stepping into the dazzling, sunlit cathedral nave.',
    funFactHi:
      'नाइमेयर ने जानबूझकर ऐसा डिज़ाइन किया कि लोग पहले एक अंधेरी भूमिगत सुरंग से गुजरें और फिर अचानक रोशनी से भरे भव्य कैथेड्रल में पहुंचें।',
    modelType: 'brasilia',
    accentColor: '#f59e0b',
    formulaNoteEn: 'Radial array of 16 hyperbolic arms converging at throat z = 20m',
    formulaNoteHi: '20 मीटर की ऊंचाई पर संकीर्ण गले में मिलती हुई 16 अतिपरवलयिक भुजाएं',
    wikipediaId: 'Cathedral_of_Brasília',
  },
  {
    id: 'cooling-tower',
    nameEn: 'Nuclear Natural Draft Cooling Towers',
    nameHi: 'प्राकृतिक ड्राफ्ट अतिपरवलयिक कूलिंग टॉवर',
    conicType: 'hyperbola',
    city: 'Global / Philippsburg',
    country: 'Worldwide',
    architect: 'Frederik van Iterson & Gerard Kuypers',
    yearBuilt: 1918,
    standardEquation: 'x²/a² + y²/a² - z²/c² = 1',
    realWorldEquation: 'x²/38.0² + y²/38.0² - (z - 110)²/75.0² = 1  (hyperboloid of revolution, waist r=38m)',
    eccentricity: 1.80,
    eccentricityFormula: 'e = \\sqrt{1 + c^2/a^2} = \\sqrt{1 + 75.0^2/38.0^2} \\approx 1.80',
    parameters: {
      'Base Diameter': '135 m (443 ft)',
      'Throat Waist Diameter': '76 m (249 ft at z = 110m)',
      'Top Rim Diameter': '84 m (275 ft)',
      'Total Height': '165 m (541 ft)',
    },
    keyDimensions: {
      'Shell Thickness at Waist': 'Only 18 cm (7 in) of reinforced concrete',
      'Structural Ratio': 'Thinner than a hen’s eggshell relative to its diameter',
      'Air Circulation': 'Up to 30,000 tons of natural air draft per hour',
      'Base Support': 'Diagonal V-strut reinforced concrete columns',
    },
    mathematicalSignificanceEn:
      'The natural draft cooling tower is the world’s most widespread and mathematically optimized hyperboloid of revolution (e = 1.80). The hyperbola equation produces a wide base for maximum air intake, a narrow throat (waist) that accelerates the rising buoyant warm air via the Venturi effect, and an outward flaring top that diffuses water vapor into the atmosphere.',
    mathematicalSignificanceHi:
      'प्राकृतिक ड्राफ्ट कूलिंग टॉवर दुनिया का सबसे प्रसिद्ध अतिपरवलयज (hyperboloid of revolution, e = 1.80) है। इसका चौड़ा आधार अधिकतम ठंडी हवा खींचता है, संकरा गला वेंचुरी प्रभाव से गर्म हवा को तेज गति देता है, और फैला हुआ शीर्ष वाष्प को वायुमंडल में फैलाता है।',
    architecturalAdvantageEn:
      'The double curvature of the hyperboloid provides immense negative Gaussian curvature resistance against cyclonic winds. Despite standing 165 meters tall, the reinforced concrete shell at its waist is only 18 cm thick—making it proportionally thinner than an eggshell!',
    architecturalAdvantageHi:
      'अतिपरवलयज की दोहरी वक्रता तूफानी हवाओं के खिलाफ जबरदस्त मजबूती प्रदान करती है। 165 मीटर ऊंचा होने के बावजूद, इसकी कंक्रीट की दीवार मात्र 18 सेमी पतली होती है—जो अंडे के छिलके से भी ज्यादा पतली है!',
    acousticOrStructuralPropertyEn:
      'Operates 100% passively with zero mechanical fans or electric motors. The chimney effect driven purely by the hyperbolic geometry and air density differential circulates up to 30,000 tons of air per hour naturally.',
    acousticOrStructuralPropertyHi:
      'बिना किसी पंखे या मोटर के 100% प्राकृतिक रूप से काम करता है। अतिपरवलयिक ज्यामिति और वायु घनत्व के अंतर के कारण यह प्रति घंटे 30,000 टन हवा को स्वयं प्रसारित करता है।',
    funFactEn:
      'If a 165-meter cooling tower were scaled down to the size of an ordinary chicken egg, its concrete shell would be less than half the thickness of the egg’s shell.',
    funFactHi:
      'यदि किसी 165 मीटर कूलिंग टॉवर को मुर्गी के अंडे के आकार में छोटा कर दिया जाए, तो इसकी कंक्रीट की दीवार अंडे के छिलके से भी आधी पतली होगी।',
    modelType: 'coolingtower',
    accentColor: '#f59e0b',
    formulaNoteEn: 'Hyperboloid of revolution: Venturi acceleration throat with negative Gaussian curvature',
    formulaNoteHi: 'घूर्णन अतिपरवलयज: वेंचुरी त्वरण गला और ऋणात्मक गाऊसी वक्रता',
    wikipediaId: 'Cooling_tower',
  },
];
