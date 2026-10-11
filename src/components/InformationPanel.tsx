import React from 'react';
import { ConicType, Language } from '../types';

interface InformationPanelProps {
  conicType: ConicType;
  lang: Language;
}

interface ShapeData {
  equations: {
    primary: string;
    canonical?: string;
    eccentricity: string;
    focalRelation?: string;
  };
  color: string; // Shape-specific color
  insightEn: string;
  insightHi: string;
}

const SHAPE_INFORMATION: Record<ConicType, ShapeData> = {
  circle: {
    equations: {
      primary: '(x - h)² + (y - k)² = r²',
      canonical: 'x² + y² = r²',
      eccentricity: 'e = 0  (Eccentricity)',
      focalRelation: 'F₁ = F₂ = (h, k)  [Coincident Foci]',
    },
    color: '#38bdf8', // sky-400 (blue)
    insightEn:
      'Circles and cylindrical structures represent the most structurally efficient closed planar geometry in architectural engineering. Under uniform external hydrostatic, wind, or gravitational pressure, circular cross-sections exhibit perfect radial symmetry, naturally resolving stresses into pure circumferential hoop tension or membrane compression while completely eliminating destructive bending moments. In monumental domes such as the Roman Pantheon and towering civic rotundas, the circle maximizes interior usable floor area while minimizing the building\'s exterior perimeter envelope, yielding optimal thermodynamic efficiency and material economy. The elimination of sharp angular corners prevents dangerous stress concentrations, distributing seismic shear and aerodynamic forces evenly across 360 degrees of exposure. Acoustically, circular perimeters provide seamless wave diffusion when acoustic panels are incorporated. By channeling vertical dead loads symmetrically to the foundational ring, circular architecture delivers timeless durability and structural equilibrium unmatched by rectilinear geometries.',
    insightHi:
      'वृत्त और बेलनाकार संरचनाएं स्थापत्य इंजीनियरिंग में सबसे संरचनात्मक रूप से कुशल बंद समतलीय ज्यामिति का प्रतिनिधित्व करती हैं। समान बाहरी हाइड्रोस्टैटिक, वायु या गुरुत्वाकर्षण भार के तहत, वृत्ताकार अनुप्रस्थ काट पूर्ण रेडियल समरूपता प्रदर्शित करते हैं, जो आंतरिक तनावों को बिना किसी विनाशकारी झुकने वाले क्षण (bending moment) के शुद्ध परिधीय तनाव या संपीड़न में बदल देते हैं। रोमन पैंथियन और भव्य गुंबदों में, वृत्त बाहरी दीवार के क्षेत्रफल को कम करते हुए आंतरिक उपयोग योग्य स्थान को अधिकतम करता है। कोनों की अनुपस्थिति भूकंपीय बलों और वायु प्रवाह को 360 डिग्री में समान रूप से वितरित करती है, जिससे संरचना को असाधारण स्थिरता प्राप्त होती है।',
  },
  parabola: {
    equations: {
      primary: 'y = a(x - h)² + k',
      canonical: '(x - h)² = 4p(y - k)',
      eccentricity: 'e = 1  (Eccentricity)',
      focalRelation: 'Focus: (h, k + p) | Directrix: y = k - p',
    },
    color: '#fb923c', // orange-400 (orange)
    insightEn:
      'Parabolic geometry represents the ideal mathematical curve of thrust equilibrium under uniform gravitational loading. When an arch or suspension bridge supports a uniform horizontal dead load along its span, the internal bending moment diagram mathematically traces an inverted parabola. By shaping load-bearing arches, roof vaults, and bridge trusses along this exact parabolic trajectory, internal shear stresses and bending moments are eliminated, channeling tremendous vertical loads into pure axial compression directly into the foundational footings. Beyond structural statics, parabolas exhibit an indispensable geometric reflection theorem: every incoming sound, light, or radio wave traveling parallel to the central axis of symmetry reflects off the parabolic curvature and converges precisely at a single focal point. Conversely, acoustic or illumination sources positioned at the focus cast perfectly collimated, parallel rays over expansive auditoriums, sports arenas, and public amphitheaters without energy dissipation.',
    insightHi:
      'परवलयिक ज्यामिति समान गुरुत्वाकर्षण भार के तहत थ्रस्ट संतुलन के आदर्श गणितीय वक्र का प्रतिनिधित्व करती है। जब कोई आर्च या सस्पेंशन ब्रिज अपने पूरे स्पैन पर एक समान क्षैतिज भार का समर्थन करता है, तो आंतरिक बेंडिंग मोमेंट आरेख सटीक रूप से एक उल्टे परवलय का अनुसरण करता है। लोड-बेयरिंग आर्च और छत के वॉल्ट को इस परवलयिक वक्र में ढालने से आंतरिक कतरनी तनाव समाप्त हो जाते हैं और भारी भार सीधे आधार नींव में स्थानांतरित हो जाता है। इसके अलावा, अक्ष के समानांतर आने वाली सभी प्रकाश और ध्वनि किरणें परावर्तित होकर सीधे इसके एकल फोकस पर केंद्रित हो जाती हैं।',
  },
  ellipse: {
    equations: {
      primary: '(x - h)²/a² + (y - k)²/b² = 1',
      canonical: 'x²/a² + y²/b² = 1  (a > b > 0)',
      eccentricity: '0 < e < 1  (e = c/a, c² = a² - b²)',
      focalRelation: 'Foci: (h ± c, k) | Constant Sum: PF₁ + PF₂ = 2a',
    },
    color: '#34d399', // emerald-400 (green)
    insightEn:
      'Elliptical geometry is celebrated in monumental architecture for combining the structural membrane efficiency of curved vaults with directional programmatic axiality. Unlike circular plans which possess uniform radial monotony, an ellipse features distinct major and minor axes, allowing architects to span wide transverse clearances while maintaining controlled vertical rise in sports arenas, bridges, and coliseums. Crucially, the ellipse possesses the two-focal acoustic reflection theorem: any acoustic sound wave or light ray emanating from one focal point reflects off the elliptical perimeter and converges with millimeter precision at the conjugate focal point. This phenomenon powers famous \'whispering galleries\' found in monumental cathedrals and state capitols, allowing faint whispers to travel hundreds of feet across public chambers without electronic amplification. Structurally, elliptical arches distribute lateral thrust smoothly to abutments, reducing foundation footprints while offering superior aerodynamic wind deflection across broad facades.',
    insightHi:
      'दीर्घवृत्ताकार ज्यामिति घुमावदार मेहराबों की संरचनात्मक दक्षता को दिशात्मक अक्षीयता के साथ जोड़ती है। वृत्त के विपरीत, दीर्घवृत्त में प्रमुख और लघु अक्ष होते हैं, जिससे वास्तुकार खेल परिसरों, पुलों और कोलोसियम में नियंत्रित ऊर्ध्वाधर ऊंचाई बनाए रखते हुए व्यापक विस्तार का निर्माण कर सकते हैं। विशेष रूप से, दीर्घवृत्त में दोहरी-फोकस परावर्तन विशेषता होती है: एक फोकस से निकलने वाली कोई भी ध्वनि तरंग परिधि से टकराकर दूसरे फोकस पर सटीक रूप से केंद्रित होती है। यही सिद्धांत दुनिया की प्रसिद्ध \'व्हिस्परिंग गैलरी\' को शक्ति प्रदान करता है।',
  },
  hyperbola: {
    equations: {
      primary: '(x - h)²/a² - (y - k)²/b² = 1',
      canonical: 'x²/a² - y²/b² = 1  (c² = a² + b²)',
      eccentricity: 'e > 1  (e = c/a > 1)',
      focalRelation: 'Asymptotes: y = ±(b/a)x | |PF₁ - PF₂| = 2a',
    },
    color: '#c084fc', // purple-400 (purple)
    insightEn:
      'Hyperboloids of revolution are double-curved quadric surfaces characterized by negative Gaussian curvature, widely regarded as one of modern engineering\'s most transformative structural discoveries. Despite having continuous 3D curvature, hyperboloids are doubly ruled surfaces, meaning their complex curving forms can be framed entirely using straight steel beams, timber columns, or prestressed rebar, drastically simplifying construction logistics and formwork costs. In industrial cooling towers, telecommunication spires, and modern civic pavilions, the hyperbola\'s narrow waist and outward-flared summit induce a natural thermodynamic chimney effect, accelerating upward convective air draft without mechanical exhaust fans. Structurally, the hyperbolic surface resists extreme wind shear, torsional twisting, and seismic vibrations through internal membrane stresses rather than brittle bending forces. This structural self-bracing allows engineers to construct ultra-thin, lightweight reinforced concrete shells soaring hundreds of meters high with remarkable structural efficiency.',
    insightHi:
      'हाइपरबोलोइड्स नकारात्मक गॉसियन वक्रता वाली दोहरी-घुमावदार सतहें हैं, जो आधुनिक इंजीनियरिंग की सबसे महत्वपूर्ण खोजों में से एक हैं। 3D वक्रता होने के बावजूद, ये दोहरी-शासित (doubly ruled) सतहें हैं, जिसका अर्थ है कि इन्हें पूरी तरह से सीधी स्टील की छड़ों या बीम से बनाया जा सकता है, जिससे निर्माण लागत और शटरिंग जटिलता में भारी कमी आती है। कूलिंग टावरों और गगनचुंबी स्मारकों में, इसकी संकरी कमर और चौड़ा शिखर प्राकृतिक वायु प्रवाह को तेज करता है, जबकि पतले कंक्रीट शेल भूकंपीय और तेज हवाओं के दबाव को आसानी से अवशोषित कर लेते हैं।',
  },
};

export const InformationPanel: React.FC<InformationPanelProps> = ({ conicType, lang }) => {
  const data = SHAPE_INFORMATION[conicType];

  return (
    <div
      id={`information-panel-${conicType}`}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center"
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333333',
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      {/* Left Column: EQUATION */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
        <h3
          className="text-lg sm:text-xl font-bold tracking-wider uppercase font-display"
          style={{ color: '#ffffff' }}
        >
          {lang === 'en' ? 'EQUATION' : 'समीकरण (EQUATION)'}
        </h3>

        <div className="w-full flex flex-col items-center justify-center space-y-3">
          {/* Main Primary Monospace Equation */}
          <div
            className="w-full max-w-md px-4 py-3 rounded-md flex items-center justify-center border"
            style={{
              backgroundColor: '#121212',
              borderColor: '#2a2a2a',
            }}
          >
            <code
              className="font-mono text-base sm:text-lg md:text-xl font-extrabold tracking-wide text-center"
              style={{ color: data.color }}
            >
              {data.equations.primary}
            </code>
          </div>

          {/* Canonical & Parameters in Monospace */}
          <div className="flex flex-col items-center space-y-1.5 text-center">
            {data.equations.canonical && (
              <code
                className="font-mono text-xs sm:text-sm font-semibold tracking-wide"
                style={{ color: data.color }}
              >
                {data.equations.canonical}
              </code>
            )}
            <code
              className="font-mono text-xs font-medium tracking-wider"
              style={{ color: '#94a3b8' }}
            >
              {data.equations.eccentricity}
            </code>
            {data.equations.focalRelation && (
              <code
                className="font-mono text-[11px] tracking-tight"
                style={{ color: '#64748b' }}
              >
                {data.equations.focalRelation}
              </code>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: ENGINEERING INSIGHT */}
      <div className="flex flex-col justify-center space-y-3 lg:border-l lg:border-[#2e2e2e] lg:pl-8 py-2">
        <h3
          className="text-lg sm:text-xl font-bold tracking-wider uppercase font-display"
          style={{ color: '#ffffff' }}
        >
          {lang === 'en' ? 'ENGINEERING INSIGHT' : 'इंजीनियरिंग अंतर्दृष्टि (ENGINEERING INSIGHT)'}
        </h3>

        <p
          className="text-sm sm:text-[15px] leading-relaxed font-normal"
          style={{ color: '#b0b0b0' }}
        >
          {lang === 'en' ? data.insightEn : data.insightHi}
        </p>
      </div>
    </div>
  );
};
