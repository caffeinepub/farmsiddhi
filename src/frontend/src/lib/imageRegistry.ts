/**
 * imageRegistry.ts
 *
 * Central registry of all image paths used in the FarmSiddhi app.
 *
 * WHY THIS FILE EXISTS:
 * The Caffeine build pipeline prunes assets from public/assets/generated/ that
 * are not detected in the compiled JS/CSS output. By centralising every image
 * path in this single exported module, the build scanner will always find each
 * path string in the compiled bundle and will never prune a referenced asset.
 *
 * RULE: Every <img src="…"> or CSS backgroundImage that references a
 * /assets/… path MUST be sourced from this registry. Never use inline string
 * literals for image paths anywhere else in the codebase.
 */

// ─── Logo ────────────────────────────────────────────────────────────────────
export const logoUrl = "/assets/Logo.png";
// Additional uploaded logos (kept so build scanner never prunes them)
export const logoAlt1 = "/assets/generated/Logo.dim_400x200.png";
export const logoAlt2 = "/assets/generated/Logo.dim_400x150.png";
export const logoAlt3 = "/assets/generated/Logo.png.dim_1200x600.png";
export const farmsiddhiLogo =
  "/assets/generated/farmsiddhi-logo.dim_400x120.png";

// ─── Category Icons ──────────────────────────────────────────────────────────
export const iconRice = "/assets/generated/icon-rice.dim_128x128.png";
export const iconWheat = "/assets/generated/icon-wheat.dim_128x128.png";
export const iconPulses = "/assets/generated/icon-pulses.dim_128x128.png";
export const iconSpices = "/assets/generated/icon-spices.dim_128x128.png";
export const iconProcessed = "/assets/generated/icon-processed.dim_128x128.png";
export const iconMakhana = "/assets/generated/icon-makhana.dim_128x128.png";

// ─── Hero & UI Banners ───────────────────────────────────────────────────────
export const heroBg = "/assets/generated/hero-bg.dim_1920x800.png";
export const supplyChain =
  "/assets/generated/supply-chain-diagram.dim_800x400.png";
export const mandiBanner = "/assets/generated/mandi-banner.dim_1200x400.png";
export const watermark =
  "/assets/generated/farmsiddhi-watermark.dim_1200x800.png";
export const watermarkFallback =
  "/assets/generated/farmsiddhi-watermark.dim_1200x600.png";

// ─── Rice ────────────────────────────────────────────────────────────────────
export const riceDetail = "/assets/generated/rice-detail.dim_800x600.png";
export const riceBasmati = "/assets/generated/rice-basmati.dim_400x300.png";
export const riceSonaMasoori =
  "/assets/generated/rice-sona-masoori.dim_400x300.png";
export const riceIr64 = "/assets/generated/rice-ir64.dim_400x300.png";
export const riceBrown = "/assets/generated/rice-brown.dim_400x300.png";
export const riceBroken = "/assets/generated/rice-broken.dim_400x300.png";

// ─── Wheat ───────────────────────────────────────────────────────────────────
export const wheatDetail = "/assets/generated/wheat-detail.dim_800x600.png";
export const wheatDurum = "/assets/generated/wheat-durum.dim_400x300.png";
export const wheatWhole = "/assets/generated/wheat-whole.dim_400x300.png";
export const wheatSemolina = "/assets/generated/wheat-semolina.dim_400x300.png";

// ─── Pulses ──────────────────────────────────────────────────────────────────
export const pulsesDetail = "/assets/generated/pulses-detail.dim_800x600.png";
export const pulsesChana = "/assets/generated/pulses-chana-dal.dim_400x300.png";
export const pulsesMoong = "/assets/generated/pulses-moong-dal.dim_400x300.png";
export const pulsesMasoor =
  "/assets/generated/pulses-masoor-dal.dim_400x300.png";
export const pulsesUrad = "/assets/generated/pulses-urad-dal.dim_400x300.png";
export const pulsesToor = "/assets/generated/pulses-toor-dal.dim_400x300.png";
export const pulsesRajma = "/assets/generated/pulses-rajma.dim_400x300.png";
export const pulsesKabuli =
  "/assets/generated/pulses-kabuli-chana.dim_400x300.png";

// ─── Spices ──────────────────────────────────────────────────────────────────
export const spicesDetail = "/assets/generated/spices-detail.dim_800x600.png";
export const spicesTurmeric =
  "/assets/generated/spices-turmeric.dim_400x400.png";
export const spicesRedChilli =
  "/assets/generated/spices-red-chilli.dim_400x400.png";
export const spicesCoriander =
  "/assets/generated/spices-coriander.dim_400x400.png";
export const spicesCumin = "/assets/generated/spices-cumin.dim_400x300.png";
export const spicesBlackPepper =
  "/assets/generated/spices-black-pepper.dim_400x300.png";
export const spicesCardamom =
  "/assets/generated/spices-cardamom.dim_400x300.png";
export const spicesGinger = "/assets/generated/spices-ginger.dim_400x300.png";
export const spicesFenugreek =
  "/assets/generated/spices-fenugreek.dim_400x300.png";

// ─── Processed Foods ─────────────────────────────────────────────────────────
export const processedDetail =
  "/assets/generated/processed-detail.dim_800x600.png";
export const processedRiceFlour =
  "/assets/generated/processed-rice-flour.dim_400x300.png";
export const processedWheatFlour =
  "/assets/generated/processed-wheat-flour.dim_400x300.png";
export const processedBesan =
  "/assets/generated/processed-besan.dim_400x300.png";
export const processedPoha = "/assets/generated/processed-poha.dim_400x300.png";
export const processedRoastedChana =
  "/assets/generated/processed-roasted-chana.dim_400x300.png";
export const processedVermicelli =
  "/assets/generated/processed-vermicelli.dim_400x300.png";

// ─── Makhana ─────────────────────────────────────────────────────────────────
export const makhanaDetail = "/assets/generated/makhana-detail.dim_800x600.png";
export const makhana = "/assets/generated/makhana.dim_400x300.png";
export const makhanaRoasted =
  "/assets/generated/makhana-roasted.dim_400x300.png";
export const makhanaPowder = "/assets/generated/makhana-powder.dim_400x300.png";
export const makhanaFlavored =
  "/assets/generated/makhana-flavored.dim_400x300.png";
export const makhanaHome = "/assets/generated/makhana-home.dim_800x600.png";

// ─── Extra rice variants ──────────────────────────────────────────────────────
export const basmatiPremium =
  "/assets/generated/basmati-premium.dim_400x300.png";
export const basmatiRegular =
  "/assets/generated/basmati-regular.dim_400x300.png";
export const basmatiOrganic =
  "/assets/generated/basmati-organic.dim_400x300.png";
export const riceMain = "/assets/generated/rice.dim_400x300.png";

// ─── Extra wheat variants ─────────────────────────────────────────────────────
export const wheatRefined = "/assets/generated/wheat-refined.dim_400x300.png";
export const wheatMain = "/assets/generated/wheat.dim_400x300.png";

// ─── Extra spices ─────────────────────────────────────────────────────────────
export const turmericPowder =
  "/assets/generated/turmeric-powder.dim_400x300.png";
export const chiliPowder = "/assets/generated/chili-powder.dim_400x300.png";
export const spicesMain = "/assets/generated/spices.dim_400x300.png";

// ─── Extra pulses ─────────────────────────────────────────────────────────────
export const pulsesMain = "/assets/generated/pulses.dim_400x300.png";
export const moongGreen = "/assets/generated/moong-green.dim_400x300.png";
export const moongYellow = "/assets/generated/moong-yellow.dim_400x300.png";

// ─── Extra processed ─────────────────────────────────────────────────────────
export const processedFoods =
  "/assets/generated/processed-foods.dim_400x300.png";

// ─── Watermark / banners ──────────────────────────────────────────────────────
export const tractorWatermark =
  "/assets/generated/tractor-field-watermark.dim_800x600.png";

// ─── Convenience grouped export ──────────────────────────────────────────────
export const images = {
  // Logo
  logoUrl,
  logoAlt1,
  logoAlt2,
  logoAlt3,
  farmsiddhiLogo,

  // Icons
  iconRice,
  iconWheat,
  iconPulses,
  iconSpices,
  iconProcessed,
  iconMakhana,

  // Hero & UI
  heroBg,
  supplyChain,
  mandiBanner,
  watermark,
  watermarkFallback,
  tractorWatermark,

  // Rice
  riceDetail,
  riceMain,
  riceBasmati,
  riceSonaMasoori,
  riceIr64,
  riceBrown,
  riceBroken,
  basmatiPremium,
  basmatiRegular,
  basmatiOrganic,

  // Wheat
  wheatDetail,
  wheatMain,
  wheatDurum,
  wheatWhole,
  wheatSemolina,
  wheatRefined,

  // Pulses
  pulsesDetail,
  pulsesMain,
  pulsesChana,
  pulsesMoong,
  pulsesMasoor,
  pulsesUrad,
  pulsesToor,
  pulsesRajma,
  pulsesKabuli,
  moongGreen,
  moongYellow,

  // Spices
  spicesDetail,
  spicesMain,
  spicesTurmeric,
  spicesRedChilli,
  spicesCoriander,
  spicesCumin,
  spicesBlackPepper,
  spicesCardamom,
  spicesGinger,
  spicesFenugreek,
  turmericPowder,
  chiliPowder,

  // Processed Foods
  processedDetail,
  processedFoods,
  processedRiceFlour,
  processedWheatFlour,
  processedBesan,
  processedPoha,
  processedRoastedChana,
  processedVermicelli,

  // Makhana
  makhanaDetail,
  makhanaHome,
  makhana,
  makhanaRoasted,
  makhanaPowder,
  makhanaFlavored,
} as const;
