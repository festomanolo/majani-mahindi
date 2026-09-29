/**
 * Swahili condition data for Majani Mahindi.
 *
 * Includes localised names, summaries, observed signs, immediate actions,
 * field management (including pembejeo / fertilizer recommendations specific
 * to East African smallholder practice), and monitoring advice.
 *
 * Pembejeo terminology follows Kenya/Tanzania smallholder common usage:
 *   - Mbolea ya DAP   — Di-ammonium phosphate (starter fertilizer)
 *   - Mbolea ya CAN   — Calcium ammonium nitrate (top-dress)
 *   - Mbolea ya Urea  — Urea (nitrogen top-dress)
 *   - Mbolea ya majani / dawa ya majani — foliar feed
 *   - Mboji / mbolea ya samadi          — compost / farmyard manure
 *   - Dawa ya kuua kuvu                 — fungicide
 *   - Dawa ya wadudu                    — insecticide
 */

import type { ConditionKey, Condition } from "./diagnosis";

export const CONDITIONS_SW: Record<ConditionKey, Condition> = {
  healthy: {
    key: "healthy",
    name: "Jani Zuri (Afya)",
    summary:
      "Hakuna ugonjwa wala upungufu wa virutubisho ulioonekana. Jani linaonyesha ukuaji wa kawaida, wenye nguvu, unaofanana na mmea wenye afya nzuri.",
    signs: [
      "Rangi ya kijani kibichi iliyosawa katika upande wote wa jani",
      "Mishipa na tishu kati ya mishipa zina rangi sawa bila kubadilika rangi",
      "Hakuna madoa, matundu, uvimbe, au maeneo yaliyokufa",
      "Umbo na muundo wa jani unafanana na kiwango cha rejeleo la jani zuri",
    ],
    immediate: [
      "Hakuna hatua ya kurekebisha inayohitajika. Endelea kufuatilia mimea inayokizunguka kama tahadhari.",
    ],
    field: [
      "Endelea na mpango wako wa sasa wa pembejeo na kulinda mazao.",
      "Weka ratiba ya DAP (50–60 kg/ekari) wakati wa kupanda kwa mwanzo wa msimu ujao.",
      "Tumia CAN au Urea (50 kg/ekari) kwa top-dressing wakati wa V6 hadi V8 ili kudumisha nguvu ya mmea.",
      "Ongeza mboji au mbolea ya samadi (tani 2–3 kwa ekari) kuimarisha rutuba ya ardhi kwa muda mrefu.",
      "Hakikisha ratiba ya umwagiliaji inadumisha unyevu bora wa ardhi — epuka mafuriko.",
      "Endelea na doria ya kawaida katika sehemu zote za shamba.",
    ],
    monitoring: [
      "Changanua sampuli inayowakilisha (angalau mimea 20) kutoka kila eneo la shamba kila wiki.",
      "Toa kipaumbele kwa majani ya chini ya zamani mwanzoni mwa msimu — upungufu wa virutubisho huonekana hapo kwanza.",
      "Rekodi matokeo ya skani ili kujenga msingi wa afya ya shamba.",
    ],
  },

  rust: {
    key: "rust",
    name: "Kutu ya Mahindi (Common Rust)",
    summary:
      "Uambukizo wa Kuvu Puccinia sorghi unaozalisha uvimbe mdogo wa rangi ya kahawia-nyekundu kwenye nyuso zote mbili za jani.",
    signs: [
      "Uvimbe mdogo wa mviringo hadi mrefu wenye rangi ya kahawia-nyekundu kwenye nyuso zote mbili za jani",
      "Uvimbe hupasuka kwa urahisi na kutoa unga mzito wenye rangi ya kutu (urediniospores)",
      "Uvimbe mara nyingi umezingirwa na halo nyembamba ya kijano (chlorotic)",
      "Majani yaliyoambukizwa sana yanaweza kugeuka njano kabla ya wakati na kufa kabla ya nafaka kujaza",
    ],
    immediate: [
      "Tumia dawa ya kuua kuvu iliyosajiliwa (aina ya triazole au strobilurin) mara uvimbe unapoanza kuonekana kwenye mimea mingi (≥5% ya mimea).",
      "Piga dawa asubuhi mapema ili kuhakikisha dawa inabaki kwenye jani na kupunguza uvukizi.",
      "Epuka kupiga dawa wakati wa kutoa poleni (tasselling) ili kulinda wadudu wanaosaidia kuchavusha.",
    ],
    field: [
      "Zungushia mazao: panda zao lisilo la nyasi (mfano: maharagwe, dengu, au mboga) kwa angalau msimu mmoja ili kuvunja mzunguko wa mbegu za ugonjwa.",
      "Chagua mbegu za mahindi zinazostahimili kutu kwa msimu ujao wa kupanda.",
      "Ondoa na teketeza (kuchoma au kuzika kwa kina) mabaki ya mazao yaliyoambukizwa sana baada ya mavuno.",
      "Epuka kutumia Urea kwa wingi kupita kiasi — tishu laini na zenye nitrogen nyingi ni rahisi zaidi kuambukizwa na kutu.",
      "Kwa pembejeo ya mwanzo, tumia DAP (50 kg/ekari) wakati wa kupanda ili kuimarisha mfumo wa mizizi.",
      "Top-dress na CAN (50 kg/ekari) kwenye V6 — usitumie Urea peke yake kwenye mashamba yenye historia ya kutu.",
    ],
    monitoring: [
      "Fanya doria angalau mara moja kwa wiki kuanzia hatua ya V6, hasa wakati wa hali ya hewa ya joto (16–23 °C) na unyevu.",
      "Hesabu uvimbe kwenye kila jani (kwenye mimea ≥20) na rekodi asilimia ya eneo la jani lililoathirika.",
      "Dawa ya pili ya kuua kuvu mara nyingi inahitajika siku 14–21 baada ya ya kwanza ikiwa hali ya hewa ya unyevu inadumu.",
    ],
  },

  blight: {
    key: "blight",
    name: "Ugonjwa wa Blight ya Kaskazini (Northern Leaf Blight)",
    summary:
      "Uambukizo wa Kuvu Exserohilum turcicum unaozalisha vidonda virefu vya mviringo kama sigara, vya rangi ya kijani-kijivu, sambamba na mishipa ya jani.",
    signs: [
      "Vidonda virefu (2–20 cm) vya rangi ya kijani-kijivu hadi kahawia, vikiendesha sambamba na mishipa ya jani",
      "Vidonda vina umbo la kipekee la 'sigara' au mfusho ambao hutofautisha NLB na magonjwa mengine",
      "Kuota kwa rangi ya zeituni-giza hadi kahawia kunaweza kuonekana katikati ya kidonda wakati wa unyevu mkubwa",
      "Ugonjwa huenea juu kutoka kwenye safu ya chini; kuambukizwa kwa jani la sikio au juu yake husababisha upotezaji mkubwa wa mavuno",
    ],
    immediate: [
      "Tumia dawa ya kuua kuvu iliyosajiliwa (triazole au strobilurin) mara vidonda vya kwanza vinapopatikana kwenye majani ya safu ya chini.",
      "Usikawilishe matibabu: upotezaji wa mavuno huongezeka kwa kasi ikiwa jani la sikio linaambukizwa kabla ya kuota nywele (silking).",
      "Ondoa kwa mikono na utupe (usifanye mboji) majani yaliyoambukizwa sana ya safu ya chini ili kupunguza mzigo wa mbegu za ugonjwa.",
    ],
    field: [
      "Zungushia mazao kwa angalau miaka miwili; E. turcicum huishi kwenye mabaki ya mahindi yaliyoambukizwa.",
      "Lima kwa kina (≥20 cm) au ingiza mabaki yaliyoambukizwa mara moja baada ya mavuno ili kuharakisha kuoza.",
      "Chagua mahindi ya mseto yanayostahimili au kuvumilia NLB, hasa kwenye mashamba yenye historia ya ugonjwa au mvua nyingi.",
      "Epuka umwagiliaji wa juu mchana au usiku — unyevu wa jani usiku unapendelea sana uambukizaji.",
      "Pembejeo: Tumia DAP (50 kg/ekari) wakati wa kupanda. Kwa top-dressing, tumia CAN badala ya Urea peke yake kwenye mashamba yenye NLB — nitrojeni nyingi kunahusishwa na uambukizaji zaidi.",
      "Ongeza mboji (tani 2 kwa ekari) kuimarisha afya ya ardhi na kupunguza msongo wa ugonjwa.",
    ],
    monitoring: [
      "Fanya doria mara mbili kwa wiki kuanzia hatua ya V8, ukizingatia jani la sikio na majani mawili juu yake.",
      "Rekodi idadi ya vidonda kwa kila mmea (kwenye mimea ≥20) na ukadirie asilimia ya eneo la jani lililoathirika.",
      "Ikiwa vidonda vinapatikana kwenye jani la sikio kabla ya kuota nywele, dawa ya pili siku 14 baadaye inapendekezwa sana.",
    ],
  },

  gray_leaf_spot: {
    key: "gray_leaf_spot",
    name: "Madoa ya Kijivu (Gray Leaf Spot)",
    summary:
      "Uambukizo wa Kuvu Cercospora zeae-maydis unaozalisha vidonda vya mstatili vya rangi ya kijivu hadi kahawia, vilivyopakana na mishipa ya jani.",
    signs: [
      "Vidonda vya mstatili vya rangi ya kijivu, kahawia nyepesi, au kahawia, vikipakana wazi na mishipa ya jani sambamba",
      "Vidonda kwa kawaida vina urefu wa 1–8 cm, vikielekea sambamba na mshipa mkuu wa jani",
      "Kwenye hali ya unyevu mkubwa, safu nyembamba ya kijivu ya conidia inaweza kuonekana juu ya vidonda",
      "Chini ya msongo mkubwa wa uambukizaji, vidonda huungana, na kusababisha maeneo makubwa ya kifo cha jani kabla ya wakati",
    ],
    immediate: [
      "Tumia dawa ya kuua kuvu ya strobilurin au triazole iliyosajiliwa mara vidonda vya kwanza vinapopatikana kwenye majani ya chini — kulinda jani la sikio ni kipaumbele cha juu kabisa.",
      "Toa kipaumbele kwa mashamba yenye historia inayojulikana ya madoa ya kijivu au kulima mahindi mfululizo.",
    ],
    field: [
      "Zungushia mazao; C. zeae-maydis huishi kwenye mabaki ya mazao yaliyoambukizwa juu ya uso wa ardhi.",
      "Lima ili kuzika mabaki ya juu ya ardhi na kupunguza mzigo wa kwanza wa uambukizaji unaoingia msimu ujao.",
      "Panda mahindi ya mseto yanayostahimili au kuvumilia hali yoyote inapopatikana — upinzani wa mmea ni mkakati bora na wa gharama nafuu zaidi wa kudhibiti muda mrefu.",
      "Epuka kilimo kidogo cha kulima kwenye mashamba yenye mabaki mengi ya juu ya ardhi na historia iliyorekodiwa ya ugonjwa.",
      "Pembejeo: Tumia DAP (50 kg/ekari) wakati wa kupanda. Top-dress na CAN (50 kg/ekari) kwenye V6–V8. Epuka nitrojeni nyingi kupita kiasi — husababisha tishu laini ambazo ni rahisi zaidi kwa madoa ya kijivu.",
      "Fikiria dawa ya majani ya zinki (zinc foliar spray) ikiwa ardhi ina upungufu — zinki inasaidia nguvu ya ukuta wa seli.",
    ],
    monitoring: [
      "Fanya doria mara mbili kwa wiki kuanzia V10 hadi kutoa poleni kwenye mashamba yenye mabaki mengi au historia ya madoa ya kijivu.",
      "Rekodi idadi ya vidonda kwa kila jani kwenye jani la sikio na majani mawili juu yake moja kwa moja.",
      "Angalia tena mazao siku 10–14 baada ya kila dawa ya kuua kuvu ili tathmini maendeleo ya ugonjwa na haja ya dawa ya ufuatiliaji.",
    ],
  },
};
