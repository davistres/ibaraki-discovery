const fs = require('fs')
const path = require('path')

const places = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/places.json'), 'utf8'))
const festivals = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/festivals.json'), 'utf8'))

const placeTranslations = {
  "hitachi-seaside-park": {
    nom_en: "Hitachi Seaside Park", nom_ja: "国営ひたち海浜公園",
    description_en: "Spectacular park famous for its fields of blue nemophila in spring and red kochia in autumn",
    description_ja: "春のネモフィラの青い花畑と秋の赤いコキアで有名な壮大な公園",
    descriptionLongue_en: "Hitachi Seaside Park is one of Japan's most spectacular parks, spanning 190 hectares. It is world-renowned for its stunning seasonal blooms: the blue nemophila (baby blue eyes) in spring create an ocean of blue flowers, while the kochia (ball bushes) turn bright red in autumn. The park also features tulip, rose, cosmos gardens and many other floral varieties throughout the year.",
    descriptionLongue_ja: "国営ひたち海浜公園は、190ヘクタールに広がる日本で最も壮大な公園の一つです。季節ごとの見事な花々で世界的に有名です。春にはネモフィラ（ベビーブルーアイズ）が青い花の海を作り出し、秋にはコキア（ほうき草）が鮮やかな赤に染まります。チューリップ、バラ、コスモスなど、年間を通じて様々な花を楽しめます。",
    horaires_en: "9:30 AM - 5:00 PM (varies by season)", horaires_ja: "9時30分〜17時（季節により変動）",
    tarif_en: "450¥ adults", tarif_ja: "大人450円",
    dureeVisite_en: "3-4 hours", dureeVisite_ja: "3〜4時間",
    acces_en: "Bus from JR Katsuta Station (15 min)", acces_ja: "JR勝田駅からバス（15分）"
  },
  "kairaku-en": {
    nom_en: "Kairaku-en Garden", nom_ja: "偕楽園",
    description_en: "One of Japan's three most beautiful gardens, famous for its 3,000 plum trees.",
    description_ja: "日本三名園の一つ、約3,000本の梅で有名。",
    descriptionLongue_en: "Kairaku-en is one of Japan's three most famous landscape gardens. Created in 1842 by Tokugawa Nariaki, it is particularly renowned for its approximately 3,000 plum trees of 100 varieties. The Mito Plum Festival (Mito Ume Matsuri) attracts many visitors. The garden also features bamboo, cedar landscapes and the traditional Kobuntei building.",
    descriptionLongue_ja: "偕楽園は日本三名園の一つです。1842年に徳川斉昭によって造られ、約100品種3,000本の梅で特に有名です。水戸の梅まつりには多くの観光客が訪れます。竹林、杉林、伝統的な好文亭も見どころです。",
    horaires_en: "Garden: 6 AM-7 PM (Feb-Sep), 7 AM-6 PM (Oct-Feb). Kobuntei: 9 AM-5 PM.", horaires_ja: "庭園：6時〜19時（2月〜9月）、7時〜18時（10月〜2月）。好文亭：9時〜17時。",
    tarif_en: "Garden: 300¥ (adult), 150¥ (reduced). Kobuntei: ~200¥.", tarif_ja: "庭園：大人300円、割引150円。好文亭：約200円。",
    dureeVisite_en: "2-3 hours", dureeVisite_ja: "2〜3時間",
    acces_en: "Bus from JR Mito Station (15-20 min) or 30 min walk.", acces_ja: "JR水戸駅からバス（15〜20分）または徒歩30分。"
  },

