/**
 * Avatar catalog — CC0 VRM avatars from the Open Source Avatars registry
 * (https://opensourceavatars.com, ToxSam's `open-source-avatars` dataset).
 *
 * Every entry is CC0.
 *
 * `thumbUrl` is a LOCAL card baked into `public/img/cards/<id>.webp`
 * (640x800, WebP, ~8-47 KB). Previously these pointed at arweave/pinata
 * gateways and totalled ~18 MB — the 100avatars r1/r2 thumbnails are
 * 0.6-2.2 MB PNGs that arweave serves as `Content-Type: image/gif`, so
 * `next/image` passed them through unoptimised at full weight. Serving them
 * from `public/` drops the picker to ~1.1 MB and removes the gateways'
 * latency and 504s from the critical path. Because nothing here is a remote
 * image any more, next.config.js needs no `images.remotePatterns` at all.
 *
 * `modelUrl` is still absolute and CORS-open (`access-control-allow-origin: *`)
 * because the browser fetches the VRM cross-origin to render it live. Hosts:
 *   - arweave.net                  (100avatars r1 / r2 / r3)
 *   - ekza.mypinata.cloud/ipfs     (our own pins — the original eight)
 *   - gateway.pinata.cloud/ipfs    (Halloween Rising)
 *   - raw.githubusercontent.com    (NeonGlitch86)
 * Those are plain `fetch` downloads, not `next/image` requests. All were
 * verified with `curl` (HTTP 200 following redirects, CORS wildcard present).
 * Models are kept under ~8 MB — they download in the visitor's browser.
 */

export type Avatar = {
  /** stable slug */
  id: string;
  name: string;
  author: string;
  collection: string;
  /** one short punchy line, brand voice */
  line: string;
  /** real alt text describing the figure */
  alt: string;
  /** absolute, CORS-open, .vrm */
  modelUrl: string;
  /** local baked card, `/img/cards/<id>.webp` (640x800) */
  thumbUrl: string;
  /** CSS background-image gradient stand-in */
  fallback: string;
};

export const AVATARS: Avatar[] = [
  {
    id: "goldfish-bag-person",
    name: "Goldfish Bag Person",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "A bag of pond water that got up and walked. Goldfish included.",
    alt: "Goldfish Bag Person — a translucent blue water-bag figure with live goldfish swimming inside.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmT3d8Uu68GpnTumnSLSrUCnCQeYAVAEtosJQaQHY1xHq6",
    thumbUrl: "/img/cards/goldfish-bag-person.webp",
    fallback:
      "radial-gradient(80% 70% at 40% 25%, rgba(64,196,214,0.48), transparent 62%), linear-gradient(160deg, #0E1C22 0%, #07080A 100%)",
  },
  {
    id: "king-mutatio",
    name: "King Mutatio",
    author: "ToxSam",
    collection: "toxsam",
    line: "Crowned mutant royalty. Three eyes, zero manners.",
    alt: "King Mutatio — a hulking stone-skinned mutant with a neon green crown and extra eyes.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmNbkfpTDXRfKZrHka9bg2GEe54y5Wg2WNVFFkbg12DhTu",
    thumbUrl: "/img/cards/king-mutatio.webp",
    fallback:
      "radial-gradient(75% 65% at 55% 20%, rgba(182,255,26,0.45), transparent 62%), linear-gradient(160deg, #131A12 0%, #07080A 100%)",
  },
  {
    id: "maxhax",
    name: "MaxHax",
    author: "ToxSam",
    collection: "toxsam",
    line: "Neon hoodie gremlin. Hacks the dance floor, nothing else.",
    alt: "MaxHax — a masked figure in a red hood and neon-trimmed black hoodie, mid-jump on a glowing grid.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/Qmcj5vWNSbG9uwKkzGAfYKz2WBBVyx3o4bfkzq315T8tQ8",
    thumbUrl: "/img/cards/maxhax.webp",
    fallback:
      "radial-gradient(80% 70% at 30% 20%, rgba(226,60,38,0.46), transparent 62%), linear-gradient(160deg, #1A1012 0%, #07080A 100%)",
  },
  {
    id: "frostyboogie",
    name: "FrostyBoogie",
    author: "ToxSam",
    collection: "toxsam",
    line: "Blue shuffle machine in a knitted onesie. Perpetually mid-groove.",
    alt: "FrostyBoogie — a lanky blue creature in a stitched knit onesie, caught mid-dance.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmU1wLBQE2KCnbvHGd3ZYyCKscJPXhPZ7GYtJiytb2Fbcp",
    thumbUrl: "/img/cards/frostyboogie.webp",
    fallback:
      "radial-gradient(75% 65% at 60% 25%, rgba(64,150,226,0.44), transparent 62%), linear-gradient(160deg, #101828 0%, #07080A 100%)",
  },
  {
    id: "skull",
    name: "Skull",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Hoodie up, face gone. The classic.",
    alt: "Skull — a low-poly figure with a cartoon skull head wearing a dark hoodie.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmTzkSW7X2fyMmgkshgfKF9UCckxbdYDUuyKHzTgftGVKe",
    thumbUrl: "/img/cards/skull.webp",
    fallback:
      "radial-gradient(75% 65% at 45% 20%, rgba(237,242,233,0.3), transparent 62%), linear-gradient(160deg, #141614 0%, #07080A 100%)",
  },
  {
    id: "witch",
    name: "Witch",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Green-faced spellcaster. One glowing orb, no patience.",
    alt: "Witch — a green-skinned low-poly witch in a wide hat holding a glowing yellow orb.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmRz3hsZ1YGSJwY83vBUqesKgXt6CcBnE3rVpKSXFei3m8",
    thumbUrl: "/img/cards/witch.webp",
    fallback:
      "radial-gradient(80% 70% at 40% 30%, rgba(110,242,68,0.46), transparent 60%), linear-gradient(160deg, #101A0F 0%, #07080A 100%)",
  },
  {
    id: "dreameater",
    name: "DreamEater",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "The thing your nightlight warned you about. It means well. Probably.",
    alt: "DreamEater — a slim shadow creature with a toothy grin and a dotted sphere for a head.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/Qmch6tmQ1xgbW7dH7Xf6BBMWmvHu4BxrW8ZkERkHGNtFjX",
    thumbUrl: "/img/cards/dreameater.webp",
    fallback:
      "radial-gradient(80% 70% at 55% 25%, rgba(154,167,154,0.36), transparent 62%), linear-gradient(160deg, #131318 0%, #07080A 100%)",
  },
  {
    id: "buffedwolf",
    name: "Buffedwolf",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Leg day every day. Howls in reps.",
    alt: "Buffedwolf — a grey werewolf flexing both arms in front of a red crescent moon.",
    modelUrl:
      "https://ekza.mypinata.cloud/ipfs/QmcQuu9rxkyuxmFWRd7sJcUoiLLprQHz6v4ogqBAU2FJQP",
    thumbUrl: "/img/cards/buffedwolf.webp",
    fallback:
      "radial-gradient(75% 65% at 55% 20%, rgba(226,60,38,0.42), transparent 62%), linear-gradient(160deg, #1D1214 0%, #07080A 100%)",
  },
  {
    id: "devil",
    name: "Devil",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Small red guy, enormous red energy. Do not sign anything he hands you.",
    alt: "Devil — a glowing red low-poly demon with curled horns and a long thin tail, lit red in a dark room.",
    modelUrl:
      "https://arweave.net/gfVzs1oH_aPaHVxpQK86HT_rqzyrFPOUKUrDJ30yprs",
    thumbUrl: "/img/cards/devil.webp",
    fallback:
      "radial-gradient(78% 68% at 45% 25%, rgba(255,58,44,0.5), transparent 62%), linear-gradient(160deg, #23090A 0%, #07080A 100%)",
  },
  {
    id: "muscary",
    name: "Muscary",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Head is a fly agaric. Great hat, terrible snack.",
    alt: "Muscary — a pale stubby figure whose head is a red-and-white spotted mushroom cap, wearing only black shorts.",
    modelUrl:
      "https://arweave.net/JCPq_-G5ipvtYBQKC0GRKQ-_lOrZ_LYw_jZji8_-sL4",
    thumbUrl: "/img/cards/muscary.webp",
    fallback:
      "radial-gradient(76% 66% at 48% 22%, rgba(233,63,52,0.46), transparent 62%), linear-gradient(160deg, #1B1412 0%, #07080A 100%)",
  },
  {
    id: "aesthetica",
    name: "Aesthetica",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Wireframe body, all-seeing triangle. It has read your search history.",
    alt: "Aesthetica — a neon green wireframe figure with a glowing triangle-and-eye symbol floating where its head should be.",
    modelUrl:
      "https://arweave.net/orNIoMYKafN-EyZRft2No1ZQsPNl3XUcMXhfT2rKQVc",
    thumbUrl: "/img/cards/aesthetica.webp",
    fallback:
      "radial-gradient(80% 70% at 50% 24%, rgba(182,255,26,0.5), transparent 60%), linear-gradient(160deg, #0E1A0B 0%, #07080A 100%)",
  },
  {
    id: "toilet-paper",
    name: "Toilet Paper",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Two-ply, one expression. Somehow the most dependable one here.",
    alt: "Toilet Paper — a smiling roll of toilet paper with stubby limbs, standing on a tiled bathroom floor.",
    modelUrl:
      "https://arweave.net/SQ9ZFJIjR6ek3dU76sZmeobQXOzRGYkweKa4CGrpkvg",
    thumbUrl: "/img/cards/toilet-paper.webp",
    fallback:
      "radial-gradient(74% 64% at 45% 26%, rgba(231,255,176,0.4), transparent 62%), linear-gradient(160deg, #101A1C 0%, #07080A 100%)",
  },
  {
    id: "captain-lobster",
    name: "Captain Lobster",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Claw, cutlass, zero maritime law. Boiling point strictly negotiable.",
    alt: "Captain Lobster — a red lobster pirate in a green coat with a claw for one hand, crouched on a ship's deck.",
    modelUrl:
      "https://arweave.net/N-wQWvd1GJQt4L4XA53kVI9r5bqNJWyoSvOH7FVp0Uk",
    thumbUrl: "/img/cards/captain-lobster.webp",
    fallback:
      "radial-gradient(76% 66% at 40% 24%, rgba(226,60,38,0.48), transparent 62%), linear-gradient(160deg, #14200F 0%, #07080A 100%)",
  },
  {
    id: "clown",
    name: "Clown",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "The balloon is not for you. Nothing in this tent is for you.",
    alt: "Clown — a white-faced circus clown with a red nose, red hair and a ruffled collar, lit on a dark stage.",
    modelUrl:
      "https://arweave.net/pICFDWCb9lHSvhpBkoCXNdG3VngvYhvvi20lK51uwyA",
    thumbUrl: "/img/cards/clown.webp",
    fallback:
      "radial-gradient(72% 62% at 50% 22%, rgba(231,255,176,0.34), transparent 60%), linear-gradient(160deg, #1B1112 0%, #07080A 100%)",
  },
  {
    id: "weird-flex-but-ok",
    name: "Weird Flex But Ok",
    author: "Polygonal-Mind",
    collection: "100avatars r1",
    line: "Flexing in a swimsuit against UFO wallpaper. Weird flex, but ok.",
    alt: "Weird Flex But Ok — a bright green alien in a blue one-piece swimsuit flexing both arms against a UFO-patterned wall.",
    modelUrl:
      "https://arweave.net/SLR0PvjqsNa3K_Mj9hXYFdA6v0tn92tZuhDShd2ggaI",
    thumbUrl: "/img/cards/weird-flex-but-ok.webp",
    fallback:
      "radial-gradient(80% 70% at 42% 25%, rgba(110,242,68,0.5), transparent 62%), linear-gradient(160deg, #0D1A10 0%, #07080A 100%)",
  },
  {
    id: "cool-poo",
    name: "Cool Poo",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "A turd with legs and ambition. Also the smallest download here.",
    alt: "Cool Poo — a brown cartoon swirl of poop balanced on two thin black stick legs.",
    modelUrl:
      "https://arweave.net/4V0lF-3oQafJ7-65R5Rk7TWemHFvmof2GFwzlYq0H6s",
    thumbUrl: "/img/cards/cool-poo.webp",
    fallback:
      "radial-gradient(72% 62% at 48% 28%, rgba(150,96,44,0.5), transparent 62%), linear-gradient(160deg, #171310 0%, #07080A 100%)",
  },
  {
    id: "cool-trash",
    name: "Cool Trash",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Wheelie bin, full commitment to the bit. Takes itself out.",
    alt: "Cool Trash — a black wheeled rubbish bin with thin stick arms and legs and its lid propped open.",
    modelUrl:
      "https://arweave.net/aq5rlTk1TwYO_awaEhmdGRWrqf47txHuyDGRwtXDp34",
    thumbUrl: "/img/cards/cool-trash.webp",
    fallback:
      "radial-gradient(70% 60% at 50% 26%, rgba(154,167,154,0.34), transparent 62%), linear-gradient(160deg, #121512 0%, #07080A 100%)",
  },
  {
    id: "eye-wizard",
    name: "EYE Wizard",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "One eye, one spell, absolutely no bedside manner.",
    alt: "EYE Wizard — a robed figure whose entire head is a huge red-rimmed eyeball, over a pale tunic and heavy boots.",
    modelUrl:
      "https://arweave.net/tl58PHpAKJhRdCUWcnfUxIzjGJCCJ4cl1tlfrFEs48I",
    thumbUrl: "/img/cards/eye-wizard.webp",
    fallback:
      "radial-gradient(76% 66% at 48% 22%, rgba(214,49,40,0.44), transparent 62%), linear-gradient(160deg, #1A1210 0%, #07080A 100%)",
  },
  {
    id: "slug-person",
    name: "Slug Person",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Damp, golden, in no hurry. Leaves a trail you'll be scrubbing for weeks.",
    alt: "Slug Person — a translucent golden-yellow slug shaped like a person, with two eyestalks and no feet.",
    modelUrl:
      "https://arweave.net/ys7hRfG4nAlsio4AQjJaYSO56h8rUxZ7VP3b1rOXlyw",
    thumbUrl: "/img/cards/slug-person.webp",
    fallback:
      "radial-gradient(78% 68% at 46% 26%, rgba(231,196,54,0.48), transparent 62%), linear-gradient(160deg, #1A170C 0%, #07080A 100%)",
  },
  {
    id: "awesome-lemon",
    name: "Awesome Lemon",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Sunglasses on a lemon. Sour, and completely unbothered by it.",
    alt: "Awesome Lemon — a bright yellow lemon wearing wide black sunglasses, propped up on thin stick legs.",
    modelUrl:
      "https://arweave.net/U-c4eE3ETJ5HOqiC_ad4CLcbWfWuNBiY85azu922uD0",
    thumbUrl: "/img/cards/awesome-lemon.webp",
    fallback:
      "radial-gradient(78% 68% at 46% 24%, rgba(231,255,176,0.5), transparent 62%), linear-gradient(160deg, #1A1A0C 0%, #07080A 100%)",
  },
  {
    id: "chill-penguin",
    name: "Chill Penguin",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Wearing a tuxedo over a tuxedo. Overdressed on principle.",
    alt: "Chill Penguin — a black-and-white penguin in a formal tuxedo with white gloves and a bow tie.",
    modelUrl:
      "https://arweave.net/4c5EhflLKYfBtzpcLlvZY0afAwXLVdxXmpgwGaarAIQ",
    thumbUrl: "/img/cards/chill-penguin.webp",
    fallback:
      "radial-gradient(70% 60% at 50% 24%, rgba(237,242,233,0.32), transparent 62%), linear-gradient(160deg, #101210 0%, #07080A 100%)",
  },
  {
    id: "cool-pirate",
    name: "Cool Pirate",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Died at sea, kept the coat. Still owes the whole crew money.",
    alt: "Cool Pirate — a grinning skeleton pirate in a navy captain's coat and red shorts, with a gold-toothed skull face.",
    modelUrl:
      "https://arweave.net/lQwSPMpcSKzL9lMYyAaQ63vHK1ATP1Xmir43jZg2Ob0",
    thumbUrl: "/img/cards/cool-pirate.webp",
    fallback:
      "radial-gradient(74% 64% at 46% 24%, rgba(231,196,54,0.4), transparent 62%), linear-gradient(160deg, #0F1420 0%, #07080A 100%)",
  },
  {
    id: "hourglass-person",
    name: "Hourglass Person",
    author: "Polygonal-Mind",
    collection: "100avatars r2",
    line: "Your time is running out and it finds that genuinely funny.",
    alt: "Hourglass Person — a smiling hourglass with capped ends and yellow sand for a body, standing on stick limbs.",
    modelUrl:
      "https://arweave.net/Vo0F7lugbb2-iO9GVIG0vZKb8VucsC6fAh9UHD0tu98",
    thumbUrl: "/img/cards/hourglass-person.webp",
    fallback:
      "radial-gradient(76% 66% at 48% 26%, rgba(231,196,54,0.44), transparent 62%), linear-gradient(160deg, #16161A 0%, #07080A 100%)",
  },
  {
    id: "cool-pyramid",
    name: "Cool Pyramid",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Golden, triangular, wearing shades indoors. You know exactly what it is.",
    alt: "Cool Pyramid — a golden pyramid with a single eye behind black sunglasses, walking on thin stick legs.",
    modelUrl:
      "https://arweave.net/SdnGu0ajq-TNVxLbenkQBgG4gPdIraWJoPHN0HY41p8",
    thumbUrl: "/img/cards/cool-pyramid.webp",
    fallback:
      "radial-gradient(78% 68% at 48% 24%, rgba(231,196,54,0.5), transparent 62%), linear-gradient(160deg, #191509 0%, #07080A 100%)",
  },
  {
    id: "cool-pawn",
    name: "Cool Pawn",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Bottom of the board, wearing a crown anyway. Respect the delusion.",
    alt: "Cool Pawn — a glossy black chess pawn with wiry limbs and a tiny gold crown, standing on a checkerboard.",
    modelUrl:
      "https://arweave.net/YHOo7iOMpmA44TYyPQNswS-lKaU0yrY_BG0WCVdqkbw",
    thumbUrl: "/img/cards/cool-pawn.webp",
    fallback:
      "radial-gradient(70% 60% at 50% 24%, rgba(237,242,233,0.3), transparent 60%), linear-gradient(160deg, #131313 0%, #07080A 100%)",
  },
  {
    id: "goat-ghost",
    name: "Goat Ghost",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "A goat in a bedsheet, haunting purely on a technicality.",
    alt: "Goat Ghost — a slender black goat-headed creature draped in a white sheet, drifting against a starry sky.",
    modelUrl:
      "https://arweave.net/cedA3Is8tZhL86D0Bq5JGVMXtFQXdmqY-xLcd_CuhNY",
    thumbUrl: "/img/cards/goat-ghost.webp",
    fallback:
      "radial-gradient(74% 64% at 52% 24%, rgba(237,242,233,0.34), transparent 60%), linear-gradient(160deg, #14141C 0%, #07080A 100%)",
  },
  {
    id: "urban-tv",
    name: "Urban TV",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Head is a CRT. Signal is terrible, outfit is immaculate.",
    alt: "Urban TV — a figure with an old CRT television for a head and a bent antenna, in an orange bomber jacket and jeans.",
    modelUrl:
      "https://arweave.net/h7MGIGl6Mpzof0lIV9s_2KYiOBxwDOUUqos5bKjBwhQ",
    thumbUrl: "/img/cards/urban-tv.webp",
    fallback:
      "radial-gradient(76% 66% at 44% 24%, rgba(232,140,42,0.44), transparent 62%), linear-gradient(160deg, #131A18 0%, #07080A 100%)",
  },
  {
    id: "dogo-burger",
    name: "Dogo Burger",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Shiba in a bun. Nobody has explained this and nobody is going to.",
    alt: "Dogo Burger — a shiba inu whose body is a hamburger, lettuce and all, raising one paw.",
    modelUrl:
      "https://arweave.net/qKrAwFf60cT1348kvQc7S5Nzn3fO0aNvJ8ybMx5Lu04",
    thumbUrl: "/img/cards/dogo-burger.webp",
    fallback:
      "radial-gradient(78% 68% at 46% 26%, rgba(226,152,58,0.48), transparent 62%), linear-gradient(160deg, #1B1410 0%, #07080A 100%)",
  },
  {
    id: "ripped-jimbo",
    name: "Ripped Jimbo",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Purple, big-eyed, and utterly convinced that he lifts.",
    alt: "Ripped Jimbo — a purple blob-shaped alien with big eyes, in a pink shirt and yellow shorts, hands on hips.",
    modelUrl:
      "https://arweave.net/vdRezR_hCUxtqmSAGhpHtWWs_YXGhvgK3aQVmwIYaj8",
    thumbUrl: "/img/cards/ripped-jimbo.webp",
    fallback:
      "radial-gradient(76% 66% at 46% 24%, rgba(232,140,42,0.4), transparent 62%), linear-gradient(160deg, #1A1220 0%, #07080A 100%)",
  },
  {
    id: "weird-cat",
    name: "Weird Cat",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Enormous eyes, small satchel. Do not ask what's in the satchel.",
    alt: "Weird Cat — a beige cat standing upright with huge round eyes, a leather satchel across its chest and a long tail.",
    modelUrl:
      "https://arweave.net/pPaWwgWt8Gu7hJyHo_wG45lxPVV8ka8zBJJKSQD8Ngs",
    thumbUrl: "/img/cards/weird-cat.webp",
    fallback:
      "radial-gradient(74% 64% at 48% 24%, rgba(214,186,132,0.42), transparent 62%), linear-gradient(160deg, #171319 0%, #07080A 100%)",
  },
  {
    id: "cool-thief",
    name: "Cool Thief",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Red cloak, black gloves, nobody home. Check your pockets.",
    alt: "Cool Thief — an empty red hooded cloak with floating black gloves and boots, and no body visible inside.",
    modelUrl:
      "https://arweave.net/aZqq_UIFZSAXVxhcAoul9rmcKDvAJcy-A1K6gnTzHLo",
    thumbUrl: "/img/cards/cool-thief.webp",
    fallback:
      "radial-gradient(74% 64% at 46% 24%, rgba(214,49,40,0.46), transparent 62%), linear-gradient(160deg, #101820 0%, #07080A 100%)",
  },
  {
    id: "astro-nacho",
    name: "Astro Nacho",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Hazard-yellow astronaut, drifting somewhere nobody asked it to go.",
    alt: "Astro Nacho — a slim yellow-and-black robotic astronaut with a triangular chest badge, floating among bubbles in the dark.",
    modelUrl:
      "https://arweave.net/yN-bc2espBKNBlbd1J5CfKJkv4ukOcwwyHdJiXoidHg",
    thumbUrl: "/img/cards/astro-nacho.webp",
    fallback:
      "radial-gradient(76% 66% at 48% 26%, rgba(231,196,54,0.42), transparent 62%), linear-gradient(160deg, #0C1018 0%, #07080A 100%)",
  },
  {
    id: "cherry-bros",
    name: "CherryBros",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Two cherries, one stem, one shared pair of legs. Only one of them is happy about it.",
    alt: "CherryBros — two red cherries hanging off a single green stem, each with a face and stick limbs; one grins, the other scowls with its arms folded.",
    modelUrl:
      "https://arweave.net/0o1sL5UKrtgVpAGeRhbNRR55n3WlTgd0t9sGRXwJnw8",
    thumbUrl: "/img/cards/cherry-bros.webp",
    fallback:
      "radial-gradient(76% 66% at 46% 26%, rgba(214,44,44,0.44), transparent 62%), linear-gradient(160deg, #0F1622 0%, #07080A 100%)",
  },
  {
    id: "bad-bot",
    name: "BadBot",
    author: "Polygonal-Mind",
    collection: "100avatars r3",
    line: "Grille for a mouth, antennae for manners. Built angry, stayed angry.",
    alt: "BadBot — a lanky red-and-white robot with twin antennae, a grimacing metal grille for a mouth, thin rod limbs and oversized white boots.",
    modelUrl:
      "https://arweave.net/ssQPFGxKhSLVlXndDSfdwYo-lcgMT8rLXd-2hJgK5RI",
    thumbUrl: "/img/cards/bad-bot.webp",
    fallback:
      "radial-gradient(76% 66% at 46% 22%, rgba(226,60,38,0.46), transparent 62%), linear-gradient(160deg, #1C0F0C 0%, #07080A 100%)",
  },
  {
    id: "mocking-spit-strawberry",
    name: "Mocking Spit: Strawberry",
    author: "Polygonal-Mind",
    collection: "halloween rising",
    line: "One enormous eyeball, four tiny hands. It looked at you first.",
    alt: "Mocking Spit: Strawberry — a pale creature that is mostly one giant eyeball, with small horns and stubby hands, posed against a police height chart.",
    modelUrl:
      "https://gateway.pinata.cloud/ipfs/QmXyEuwbgUfMG7WzRZys6JnS6DJvxqkPGDseZmHM8wLJm1/Avatar01_v1_Cute_Pink.vrm",
    thumbUrl: "/img/cards/mocking-spit-strawberry.webp",
    fallback:
      "radial-gradient(78% 68% at 46% 24%, rgba(231,255,176,0.34), transparent 62%), linear-gradient(160deg, #1E161C 0%, #07080A 100%)",
  },
  {
    id: "mimic-slime-jello",
    name: "Mimic Slime: Jello",
    author: "Polygonal-Mind",
    collection: "halloween rising",
    line: "A cheerful green blob that clearly ate something with a skull in it.",
    alt: "Mimic Slime: Jello — a wobbling lime-green slime with stubby arms and a white skull grinning out of its middle.",
    modelUrl:
      "https://gateway.pinata.cloud/ipfs/QmXyEuwbgUfMG7WzRZys6JnS6DJvxqkPGDseZmHM8wLJm1/Avatar03_v1_Cute_Green.vrm",
    thumbUrl: "/img/cards/mimic-slime-jello.webp",
    fallback:
      "radial-gradient(80% 70% at 46% 26%, rgba(110,242,68,0.5), transparent 62%), linear-gradient(160deg, #0E1A10 0%, #07080A 100%)",
  },
  {
    id: "wendigo-chocolate",
    name: "Wendigo: Chocolate",
    author: "Polygonal-Mind",
    collection: "halloween rising",
    line: "Antlers, hooves, and a skull where a face should be. Don't follow it home.",
    alt: "Wendigo: Chocolate — a lanky brown beast with a horned animal skull for a head, hooved legs and long clawed arms.",
    modelUrl:
      "https://gateway.pinata.cloud/ipfs/QmXyEuwbgUfMG7WzRZys6JnS6DJvxqkPGDseZmHM8wLJm1/Avatar05_v1_Cute_Brown.vrm",
    thumbUrl: "/img/cards/wendigo-chocolate.webp",
    fallback:
      "radial-gradient(76% 66% at 46% 24%, rgba(168,104,54,0.44), transparent 62%), linear-gradient(160deg, #1A1410 0%, #07080A 100%)",
  },
  {
    id: "esktix-midnight",
    name: "Esktix: Midnight",
    author: "Polygonal-Mind",
    collection: "halloween rising",
    line: "Bat-winged, mid-shriek, permanently on the wrong side of sunrise.",
    alt: "Esktix: Midnight — a dark bat creature with wide leathery wings, pointed ears and a mouth open mid-screech.",
    modelUrl:
      "https://gateway.pinata.cloud/ipfs/QmXyEuwbgUfMG7WzRZys6JnS6DJvxqkPGDseZmHM8wLJm1/Avatar02_v1_Cute_Black.vrm",
    thumbUrl: "/img/cards/esktix-midnight.webp",
    fallback:
      "radial-gradient(74% 64% at 50% 24%, rgba(154,167,154,0.34), transparent 62%), linear-gradient(160deg, #14121C 0%, #07080A 100%)",
  },
  {
    id: "shapey",
    name: "SHAPEY",
    author: "NeonGlitch86",
    collection: "neonglitch86",
    line: "A black circle with two enormous eyes. That is the whole character.",
    alt: "SHAPEY — a plain black sphere with two oversized white googly eyes and one small round mouth.",
    modelUrl:
      "https://raw.githubusercontent.com/neonglitch86/vrm/main/shapey.vrm",
    thumbUrl: "/img/cards/shapey.webp",
    fallback:
      "radial-gradient(70% 60% at 50% 26%, rgba(237,242,233,0.34), transparent 58%), linear-gradient(160deg, #131513 0%, #07080A 100%)",
  },
];
