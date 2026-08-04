// ⚠️ FILE TỰ SINH — ĐỪNG SỬA TAY. Chạy lại: node scripts/gen-catalog.mjs
// Metadata nhẹ cho màn Today: tên bài học, đếm unit, danh sách chương Adventure.
// Nguồn sự thật là lib/learn.ts + lib/adventures.ts; test catalog.test.ts gác đồng bộ.

import type { LearningSectionKey } from "./learn";   // type-only: bị xoá khi compile, KHÔNG kéo content vào bundle

export type CatalogSection = { key: LearningSectionKey; name: string; vi: string; icon: string; desc: string };
export type CatalogChapter = { id: string; vi: string; sceneImage: string | null; playable: boolean };
export type CatalogSeason = { id: string; chapters: CatalogChapter[] };
export type Catalog = {
  sections: CatalogSection[];
  unitCounts: { l1: number; l2: number; l3: number };
  lessons: Record<string, { title: string; sceneImage: string | null }>;
  lostCompassId: string;
  seasons: CatalogSeason[];
};

export const CATALOG: Catalog = {
 "sections": [
  {
   "key": "words",
   "name": "Words",
   "vi": "Từ vựng",
   "icon": "📖",
   "desc": "Từ mới · phát âm · ví dụ"
  },
  {
   "key": "sentences",
   "name": "Sentences",
   "vi": "Mẫu câu",
   "icon": "✏️",
   "desc": "Mẫu câu & ngữ pháp nhẹ"
  },
  {
   "key": "listening",
   "name": "Listening",
   "vi": "Nghe hiểu",
   "icon": "🎧",
   "desc": "Nghe Maple & trả lời"
  },
  {
   "key": "speaking",
   "name": "Listen & Repeat",
   "vi": "Nghe & nói theo",
   "icon": "🎤",
   "desc": "Nghe Maple rồi nói theo · không chấm điểm"
  }
 ],
 "unitCounts": {
  "l1": 30,
  "l2": 30,
  "l3": 30
 },
 "lessons": {
  "park": {
   "title": "At the Park",
   "sceneImage": "/assets/images/gen/scene-park.webp"
  },
  "kitchen": {
   "title": "In the Kitchen",
   "sceneImage": "/assets/images/gen/scene-kitchen.webp"
  },
  "classroom": {
   "title": "In the Classroom",
   "sceneImage": "/assets/images/gen/scene-classroom.webp"
  },
  "supermarket": {
   "title": "At the Supermarket",
   "sceneImage": "/assets/images/gen/scene-supermarket.webp"
  },
  "busstop": {
   "title": "At the Bus Stop",
   "sceneImage": "/assets/images/gen/scene-bus-stop-rain.webp"
  },
  "library": {
   "title": "At the Library",
   "sceneImage": "/assets/images/gen/scene-library.webp"
  },
  "sportscentre": {
   "title": "At the Community Sports Centre",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-10-at-the-community-sports-centre.webp"
  },
  "cafe": {
   "title": "At the Café",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-11-at-the-cafe.webp"
  },
  "clinic": {
   "title": "At the Doctor's Clinic",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-12-at-the-doctors-clinic.webp"
  },
  "clothingstore": {
   "title": "At the Clothing Store",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-13-at-the-clothing-store.webp"
  },
  "communitygarden": {
   "title": "At the Community Garden",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-14-at-the-community-garden.webp"
  },
  "bikeshop": {
   "title": "At the Bike Repair Shop",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-15-at-the-bike-repair-shop.webp"
  },
  "postoffice": {
   "title": "At the Post Office",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-16-at-the-post-office.webp"
  },
  "petshelter": {
   "title": "At the Pet Shelter",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-17-at-the-pet-shelter.webp"
  },
  "skytrain": {
   "title": "At the SkyTrain Station",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-18-at-the-skytrain-station.webp"
  },
  "musicstore": {
   "title": "At the Music Store",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-19-at-the-music-store.webp"
  },
  "recycling": {
   "title": "At the Recycling Depot",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-20-at-the-recycling-depot.webp"
  },
  "farmersmarket": {
   "title": "At the Farmers' Market",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-21-at-the-farmers-market.webp"
  },
  "pool": {
   "title": "At the Community Pool",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-22-at-the-community-pool.webp"
  },
  "bakery": {
   "title": "At the Bakery",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-23-at-the-bakery.webp"
  },
  "dentist": {
   "title": "At the Dentist",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-24-at-the-dentist.webp"
  },
  "hardware": {
   "title": "At the Hardware Store",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-25-at-the-hardware-store.webp"
  },
  "artclass": {
   "title": "At the Art Class",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-26-at-the-art-class.webp"
  },
  "ferryterminal": {
   "title": "At the Ferry Terminal",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-27-at-the-ferry-terminal.webp"
  },
  "campground": {
   "title": "At the Campground",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-28-at-the-campground.webp"
  },
  "wellness": {
   "title": "At the Wellness Shop",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-29-at-the-wellness-shop.webp"
  },
  "cafeteria": {
   "title": "At the School Cafeteria",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-30-at-the-school-cafeteria.webp"
  },
  "sciencefair": {
   "title": "At the Science Fair",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-07-at-the-science-fair.webp"
  },
  "sciencemuseum": {
   "title": "At the Science Museum",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-08-at-the-science-museum.webp"
  },
  "waterfront": {
   "title": "At the Vancouver Waterfront",
   "sceneImage": "/assets/images/learn/level-1/level-1-unit-09-at-the-vancouver-waterfront.webp"
  },
  "backpack": {
   "title": "The Missing Backpack",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-01-missing-backpack.webp"
  },
  "camping": {
   "title": "The Stormy Camping Trip",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-02-stormy-camping-trip.webp"
  },
  "talentshow": {
   "title": "The School Talent Show",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-03-school-talent-show.webp"
  },
  "ferry": {
   "title": "The Ferry Trip Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-04-ferry-trip-mix-up.webp"
  },
  "robot": {
   "title": "The Robot That Wouldn't Start",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-05-robot-wouldnt-start.webp"
  },
  "garden": {
   "title": "The Community Garden Mystery",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-06-community-garden-mystery.webp"
  },
  "capsule": {
   "title": "The Time Capsule Discovery",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-07-time-capsule-discovery.webp"
  },
  "beach": {
   "title": "The Beach Cleanup Change of Plan",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-08-beach-cleanup-change-of-plan.webp"
  },
  "aquarium": {
   "title": "The Aquarium Night Mystery",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-09-aquarium-night-mystery.webp"
  },
  "outage": {
   "title": "The Power Outage at the Community Centre",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-10-community-centre-power-outage.webp"
  },
  "sfmixup": {
   "title": "The Science Fair Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-11-science-fair-mix-up.webp"
  },
  "detour": {
   "title": "The Detour Before the Field Trip",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-12-field-trip-detour.webp"
  },
  "newsmix": {
   "title": "The Community News Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-13-community-news-mix-up.webp"
  },
  "wildlifecam": {
   "title": "The Wildlife Camera Surprise",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-14-wildlife-camera-surprise.webp"
  },
  "festschedule": {
   "title": "The Festival Schedule Problem",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-15-festival-schedule-problem.webp"
  },
  "cookmix": {
   "title": "The Cooking Workshop Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-16-cooking-workshop-mix-up.webp"
  },
  "rainysports": {
   "title": "The Rainy Sports Day Plan",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-17-rainy-sports-day-plan.webp"
  },
  "audiomix": {
   "title": "The Museum Audio Guide Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-18-museum-audio-guide-mix-up.webp"
  },
  "delivery": {
   "title": "The Neighbourhood Delivery Puzzle",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-19-neighbourhood-delivery-puzzle.webp"
  },
  "podcast": {
   "title": "The School Podcast Deadline",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-20-school-podcast-deadline.webp"
  },
  "bookfair": {
   "title": "The Library Book Fair Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-21-library-book-fair-mix-up.webp"
  },
  "weatherdata": {
   "title": "The Weather Station Data Puzzle",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-22-weather-station-data-puzzle.webp"
  },
  "theatreprop": {
   "title": "The Missing Theatre Prop",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-23-missing-theatre-prop.webp"
  },
  "biketrail": {
   "title": "The Bike Trail Route Change",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-24-bike-trail-route-change.webp"
  },
  "donationsort": {
   "title": "The Community Donation Sorting Challenge",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-25-donation-sorting-challenge.webp"
  },
  "canoeclub": {
   "title": "The Canoe Club Equipment Mix-Up",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-26-canoe-club-equipment-mix-up.webp"
  },
  "greenhouse": {
   "title": "The Greenhouse Temperature Mystery",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-27-greenhouse-temperature-mystery.webp"
  },
  "concertclash": {
   "title": "The Community Concert Schedule Clash",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-28-community-concert-schedule-clash.webp"
  },
  "photoseq": {
   "title": "The Photo Exhibition Sequence Puzzle",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-29-photo-exhibition-sequence-puzzle.webp"
  },
  "winterdelivery": {
   "title": "The Winter Supply Delivery Delay",
   "sceneImage": "/assets/images/learn/level-2/level-2-unit-30-winter-supply-delivery-delay.webp"
  },
  "classtrip": {
   "title": "Planning a Class Trip",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-01-planning-class-trip.webp"
  },
  "screentime": {
   "title": "Screen Time or Outdoor Time?",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-02-screen-or-outdoor-time.webp"
  },
  "teamproject": {
   "title": "Choosing a Team Project",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-03-choosing-team-project.webp"
  },
  "volunteer": {
   "title": "Choosing a Weekend Volunteer Activity",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-04-weekend-volunteer-activity.webp"
  },
  "celebspace": {
   "title": "Choosing a Space for the School Celebration",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-05-school-celebration-space.webp"
  },
  "readingproject": {
   "title": "Choosing a Class Reading Project",
   "sceneImage": "/assets/images/learn/level-3/collection-01-making-choices/level-3-c01-unit-06-choosing-class-reading-project.webp"
  },
  "homework": {
   "title": "Should Homework Be Shorter?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-01-shorter-homework.webp"
  },
  "savespend": {
   "title": "Save It or Spend It?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-02-save-or-spend.webp"
  },
  "goodfriend": {
   "title": "What Makes a Good Friend?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-03-good-friend.webp"
  },
  "startlater": {
   "title": "Should the School Day Start Later?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-04-school-day-start-later.webp"
  },
  "uniforms": {
   "title": "Should Students Wear School Uniforms?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-05-school-uniforms.webp"
  },
  "tripphones": {
   "title": "Should Phones Be Allowed on School Trips?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-06-phones-on-school-trips.webp"
  },
  "groupwork": {
   "title": "Is Group Work Better Than Working Alone?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-07-group-or-independent-work.webp"
  },
  "classpet": {
   "title": "Should a Classroom Have a Visiting Pet?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-08-visiting-classroom-pet.webp"
  },
  "plantmeals": {
   "title": "Should the Cafeteria Offer More Plant-Based Meals?",
   "sceneImage": "/assets/images/learn/level-3/collection-02-giving-reasons/level-3-c02-unit-09-plant-based-cafeteria-meals.webp"
  },
  "lunchroom": {
   "title": "A Quieter Lunchroom",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-01-quieter-lunchroom.webp"
  },
  "bikeroute": {
   "title": "A Safer Bike Route",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-02-safer-bike-route.webp"
  },
  "festival": {
   "title": "A Greener School Festival",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-03-greener-school-festival.webp"
  },
  "accessible": {
   "title": "Making the School More Accessible",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-04-making-school-more-accessible-updated.webp"
  },
  "foodwaste": {
   "title": "Reducing Food Waste at School",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-05-reducing-food-waste.webp"
  },
  "coolclass": {
   "title": "Cooling a Hot Classroom",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-06-cooling-a-hot-classroom.webp"
  },
  "pickupzone": {
   "title": "Improving the School Pickup Zone",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-07-improving-school-pickup-zone.webp"
  },
  "savewater": {
   "title": "Saving Water in the School Garden",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-08-saving-water-in-school-garden.webp"
  },
  "lostfound": {
   "title": "Improving the Lost-and-Found System",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-09-improving-lost-and-found.webp"
  },
  "recessspace": {
   "title": "Designing a Better Recess Space",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-10-designing-a-better-recess-space.webp"
  },
  "rainycourtyard": {
   "title": "Improving a Rainy School Courtyard",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-11-rainy-school-courtyard.webp"
  },
  "beachaccess": {
   "title": "Making a Beach Path Easier to Use",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-12-accessible-beach-path.webp"
  },
  "quiethall": {
   "title": "Reducing Noise in the Community Sports Hall",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-13-quieter-sports-hall.webp"
  },
  "pollinator": {
   "title": "Helping Pollinators in the School Garden",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-14-pollinator-school-garden.webp"
  },
  "libraryenergy": {
   "title": "Reducing Energy Use at the Community Library",
   "sceneImage": "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-15-library-energy-use.webp"
  }
 },
 "lostCompassId": "s01",
 "seasons": [
  {
   "id": "s01",
   "chapters": [
    {
     "id": "s01-ch01",
     "vi": "Lời nhắn ở bến cảng",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-01-harbour-message.webp",
     "playable": true
    },
    {
     "id": "s01-ch02",
     "vi": "Nhầm chuyến phà",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-02-wrong-ferry.webp",
     "playable": true
    },
    {
     "id": "s01-ch03",
     "vi": "Dấu chân trong rừng",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-03-forest-footprints.webp",
     "playable": true
    },
    {
     "id": "s01-ch04",
     "vi": "Manh mối trong căn nhà gỗ",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-04-cabin-clue.webp",
     "playable": true
    },
    {
     "id": "s01-ch05",
     "vi": "Bí ẩn bảo tàng",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-05-museum-mystery.webp",
     "playable": true
    },
    {
     "id": "s01-ch06",
     "vi": "Bến nước trong bão",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-06-stormy-waterfront.webp",
     "playable": true
    },
    {
     "id": "s01-ch07",
     "vi": "Mật mã ngọn hải đăng",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-07-lighthouse-code.webp",
     "playable": true
    },
    {
     "id": "s01-ch08",
     "vi": "Khu vườn bí mật",
     "sceneImage": "/assets/images/adventure/season-01-lost-maple-compass/chapters/chapter-08-hidden-garden.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s02",
   "chapters": [
    {
     "id": "s02-ch01",
     "vi": "Lá thư ngân nga",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-01-letter-that-hummed.webp",
     "playable": true
    },
    {
     "id": "s02-ch02",
     "vi": "Chiếc phao mất tích",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-02-missing-buoy.webp",
     "playable": true
    },
    {
     "id": "s02-ch03",
     "vi": "Những lời kể ở khu chợ",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-03-voices-at-the-market.webp",
     "playable": true
    },
    {
     "id": "s02-ch04",
     "vi": "Thư viện thuỷ triều",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-04-library-of-tides.webp",
     "playable": true
    },
    {
     "id": "s02-ch05",
     "vi": "Đài radio trên đảo",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-05-island-radio.webp",
     "playable": true
    },
    {
     "id": "s02-ch06",
     "vi": "Hang biển khi triều rút",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-06-cave-at-low-tide.webp",
     "playable": true
    },
    {
     "id": "s02-ch07",
     "vi": "Tín hiệu trong bão",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-07-signal-in-the-storm.webp",
     "playable": true
    },
    {
     "id": "s02-ch08",
     "vi": "Bài ca dưới lòng cảng",
     "sceneImage": "/assets/images/adventure/season-02-silent-harbour-signal/chapters/chapter-08-song-beneath-the-harbour.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s03",
   "chapters": [
    {
     "id": "s03-ch01",
     "vi": "Sân thượng trống",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-01-empty-rooftop.webp",
     "playable": true
    },
    {
     "id": "s03-ch02",
     "vi": "Ba bản thiết kế vườn",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-02-three-garden-plans.webp",
     "playable": true
    },
    {
     "id": "s03-ch03",
     "vi": "Bài toán trọng lượng",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-03-weight-problem.webp",
     "playable": true
    },
    {
     "id": "s03-ch04",
     "vi": "Tiết kiệm từng giọt",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-04-saving-every-drop.webp",
     "playable": true
    },
    {
     "id": "s03-ch05",
     "vi": "Bài thử trong bão",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-05-stormy-test.webp",
     "playable": true
    },
    {
     "id": "s03-ch06",
     "vi": "Khu vườn khánh thành",
     "sceneImage": "/assets/images/adventure/season-03-sky-garden-challenge/chapters/chapter-06-garden-opens.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s04",
   "chapters": [
    {
     "id": "s04-ch01",
     "vi": "Bản dự báo bị gián đoạn",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-01-broken-forecast.webp",
     "playable": true
    },
    {
     "id": "s04-ch02",
     "vi": "Đường mòn vi khí hậu",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-02-trail-of-microclimates.webp",
     "playable": true
    },
    {
     "id": "s04-ch03",
     "vi": "Câu đố cảm biến",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-03-sensor-puzzle.webp",
     "playable": true
    },
    {
     "id": "s04-ch04",
     "vi": "Quyết định dưới tầng mây",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-04-cloud-line-decision.webp",
     "playable": true
    },
    {
     "id": "s04-ch05",
     "vi": "Khôi phục trạm trên đỉnh",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-05-repair-at-summit.webp",
     "playable": true
    },
    {
     "id": "s04-ch06",
     "vi": "Ngày hội dự báo thời tiết",
     "sceneImage": "/assets/images/adventure/season-04-mountain-weather-station/chapters/chapter-06-forecast-festival.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s05",
   "chapters": [
    {
     "id": "s05-ch01",
     "vi": "Thư viện sau giờ đóng cửa",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-01-library-after-dark.webp",
     "playable": true
    },
    {
     "id": "s05-ch02",
     "vi": "Thành phố không có ngày mai",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-02-city-without-tomorrow.webp",
     "playable": true
    },
    {
     "id": "s05-ch03",
     "vi": "Khu rừng của hai câu chuyện",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-03-forest-of-two-stories.webp",
     "playable": true
    },
    {
     "id": "s05-ch04",
     "vi": "Lâu đài bánh răng",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-04-clockwork-castle.webp",
     "playable": true
    },
    {
     "id": "s05-ch05",
     "vi": "Chuyến tàu ánh trăng",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-05-moonlight-express.webp",
     "playable": true
    },
    {
     "id": "s05-ch06",
     "vi": "Trang trắng cuối cùng",
     "sceneImage": "/assets/images/adventure/season-05-story-atlas/chapters/chapter-06-last-blank-page.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s06",
   "chapters": [
    {
     "id": "s06-ch01",
     "vi": "Bản kế hoạch còn dang dở",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-01-unfinished-market-plan.webp",
     "playable": true
    },
    {
     "id": "s06-ch02",
     "vi": "Mỗi gian hàng một vị trí",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-02-place-for-every-stall.webp",
     "playable": true
    },
    {
     "id": "s06-ch03",
     "vi": "Cảnh báo dị ứng",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-03-allergy-alert.webp",
     "playable": true
    },
    {
     "id": "s06-ch04",
     "vi": "Bài toán ngân sách",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-04-budget-puzzle.webp",
     "playable": true
    },
    {
     "id": "s06-ch05",
     "vi": "Chuyến giao hàng bị xáo trộn",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-05-mixed-up-delivery.webp",
     "playable": true
    },
    {
     "id": "s06-ch06",
     "vi": "Thắp đèn, mở hội!",
     "sceneImage": "/assets/images/adventure/season-06-lantern-market-challenge/chapters/chapter-06-lights-on-market-open.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s07",
   "chapters": [
    {
     "id": "s07-ch01",
     "vi": "Tin nhắn ai cũng chia sẻ",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-01-message-everyone-shared.webp",
     "playable": true
    },
    {
     "id": "s07-ch02",
     "vi": "Bức ảnh bị cắt",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-02-cropped-photograph.webp",
     "playable": true
    },
    {
     "id": "s07-ch03",
     "vi": "Hai nhân chứng, hai phiên bản",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-03-two-witnesses.webp",
     "playable": true
    },
    {
     "id": "s07-ch04",
     "vi": "Thông báo chính thức",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-04-official-notice.webp",
     "playable": true
    },
    {
     "id": "s07-ch05",
     "vi": "Viết lại tiêu đề",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-05-rewrite-headline.webp",
     "playable": true
    },
    {
     "id": "s07-ch06",
     "vi": "Trực tiếp từ phòng tin",
     "sceneImage": "/assets/images/adventure/season-07-junior-newsroom/chapters/chapter-06-live-newsroom.webp",
     "playable": true
    }
   ]
  },
  {
   "id": "s08",
   "chapters": [
    {
     "id": "s08-ch01",
     "vi": "Buổi phân công nhiệm vụ",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-01-crew-briefing.webp",
     "playable": true
    },
    {
     "id": "s08-ch02",
     "vi": "Giới hạn khoang hàng",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-02-cargo-limit.webp",
     "playable": true
    },
    {
     "id": "s08-ch03",
     "vi": "Đi qua buồng khí",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-03-through-airlock.webp",
     "playable": true
    },
    {
     "id": "s08-ch04",
     "vi": "Tuyến đường xe rover",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-04-rover-route.webp",
     "playable": true
    },
    {
     "id": "s08-ch05",
     "vi": "Thông điệp bị trễ",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-05-delayed-message.webp",
     "playable": true
    },
    {
     "id": "s08-ch06",
     "vi": "Quyết định vị trí căn cứ",
     "sceneImage": "/assets/images/adventure/season-08-mission-moonbase/chapters/chapter-06-habitat-decision.webp",
     "playable": true
    }
   ]
  }
 ]
};
