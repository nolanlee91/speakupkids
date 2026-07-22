// Ngân hàng nội dung chữ cho Sentence Puzzle & English Riddles.
// Mỗi game có nhiều bộ; một lượt chơi bốc ngẫu nhiên 1 bộ + N câu chưa gặp.
import type { PuzzleSet, RiddleSet } from "./games";

/* ================= SENTENCE PUZZLE — 6 chủ đề ================= */
export const PUZZLE_SETS: PuzzleSet[] = [
  {
    id: "daily", title: "Daily Life", items: [
      { id: "d1", solution: ["I", "brush", "my", "teeth"], vi: "Mình đánh răng." },
      { id: "d2", solution: ["She", "walks", "to", "school"], vi: "Bạn ấy đi bộ đến trường." },
      { id: "d3", solution: ["We", "eat", "dinner", "together"], vi: "Chúng mình ăn tối cùng nhau." },
      { id: "d4", solution: ["He", "rides", "his", "bike"], vi: "Cậu ấy đạp xe." },
      { id: "d5", solution: ["They", "watch", "TV", "together"], vi: "Họ xem TV cùng nhau." },
      { id: "d6", solution: ["I", "wash", "my", "hands"], vi: "Mình rửa tay." },
      { id: "d7", solution: ["We", "clean", "the", "room"], vi: "Chúng mình dọn phòng." },
      { id: "d8", solution: ["I", "go", "to", "bed", "early"], vi: "Mình đi ngủ sớm." },
    ],
  },
  {
    id: "school", title: "School", items: [
      { id: "s1", solution: ["The", "teacher", "reads", "a", "story"], vi: "Cô giáo đọc truyện." },
      { id: "s2", solution: ["I", "raise", "my", "hand"], vi: "Mình giơ tay." },
      { id: "s3", solution: ["We", "study", "English", "together"], vi: "Chúng mình học tiếng Anh cùng nhau." },
      { id: "s4", solution: ["She", "draws", "a", "picture"], vi: "Bạn ấy vẽ tranh." },
      { id: "s5", solution: ["He", "opens", "his", "book"], vi: "Cậu ấy mở sách." },
      { id: "s6", solution: ["The", "students", "play", "outside"], vi: "Các bạn chơi ngoài sân." },
      { id: "s7", solution: ["I", "forgot", "my", "pencil"], vi: "Mình quên bút chì." },
      { id: "s8", solution: ["We", "do", "our", "homework"], vi: "Chúng mình làm bài tập." },
    ],
  },
  {
    id: "food", title: "Food & Cooking", items: [
      { id: "f1", solution: ["I", "like", "red", "apples"], vi: "Mình thích táo đỏ." },
      { id: "f2", solution: ["She", "is", "making", "soup"], vi: "Bạn ấy đang nấu súp." },
      { id: "f3", solution: ["We", "buy", "fresh", "bread"], vi: "Chúng mình mua bánh mì tươi." },
      { id: "f4", solution: ["He", "drinks", "cold", "milk"], vi: "Cậu ấy uống sữa lạnh." },
      { id: "f5", solution: ["The", "cook", "fries", "an", "egg"], vi: "Người nấu chiên trứng." },
      { id: "f6", solution: ["I", "eat", "a", "banana"], vi: "Mình ăn một quả chuối." },
      { id: "f7", solution: ["They", "share", "a", "pizza"], vi: "Họ chia nhau một cái pizza." },
      { id: "f8", solution: ["Please", "pass", "the", "cheese"], vi: "Chuyền phô mai giúp mình." },
    ],
  },
  {
    id: "places", title: "Places & Travel", items: [
      { id: "p1", solution: ["We", "go", "to", "the", "park"], vi: "Chúng mình đi công viên." },
      { id: "p2", solution: ["The", "bus", "is", "coming"], vi: "Xe buýt đang tới." },
      { id: "p3", solution: ["I", "wait", "at", "the", "stop"], vi: "Mình đợi ở trạm." },
      { id: "p4", solution: ["She", "reads", "in", "the", "library"], vi: "Bạn ấy đọc trong thư viện." },
      { id: "p5", solution: ["We", "shop", "at", "the", "market"], vi: "Chúng mình mua sắm ở chợ." },
      { id: "p6", solution: ["The", "train", "leaves", "at", "noon"], vi: "Tàu rời đi lúc trưa." },
      { id: "p7", solution: ["He", "lives", "near", "the", "beach"], vi: "Cậu ấy sống gần biển." },
      { id: "p8", solution: ["Turn", "left", "at", "the", "corner"], vi: "Rẽ trái ở góc đường." },
    ],
  },
  {
    id: "feelings", title: "Feelings", items: [
      { id: "e1", solution: ["I", "am", "very", "happy"], vi: "Mình rất vui." },
      { id: "e2", solution: ["She", "feels", "a", "little", "tired"], vi: "Bạn ấy hơi mệt." },
      { id: "e3", solution: ["He", "is", "excited", "today"], vi: "Hôm nay cậu ấy hào hứng." },
      { id: "e4", solution: ["We", "are", "proud", "of", "you"], vi: "Chúng mình tự hào về bạn." },
      { id: "e5", solution: ["The", "baby", "is", "scared"], vi: "Em bé đang sợ." },
      { id: "e6", solution: ["I", "feel", "calm", "and", "safe"], vi: "Mình thấy bình yên và an toàn." },
      { id: "e7", solution: ["They", "are", "surprised", "by", "the", "gift"], vi: "Họ bất ngờ vì món quà." },
      { id: "e8", solution: ["He", "feels", "nervous", "and", "shy"], vi: "Cậu ấy hồi hộp và ngại." },
    ],
  },
  {
    id: "past", title: "Past Events", items: [
      { id: "t1", solution: ["We", "played", "in", "the", "rain"], vi: "Chúng mình đã chơi dưới mưa." },
      { id: "t2", solution: ["She", "found", "her", "lost", "ticket"], vi: "Bạn ấy đã tìm thấy vé bị mất." },
      { id: "t3", solution: ["He", "dropped", "his", "umbrella"], vi: "Cậu ấy đã làm rơi ô." },
      { id: "t4", solution: ["I", "visited", "my", "grandma"], vi: "Mình đã thăm bà." },
      { id: "t5", solution: ["They", "missed", "the", "bus"], vi: "Họ đã lỡ xe buýt." },
      { id: "t6", solution: ["We", "watched", "a", "funny", "movie"], vi: "Chúng mình đã xem phim vui." },
      { id: "t7", solution: ["The", "dog", "chased", "the", "ball"], vi: "Chú chó đã đuổi theo bóng." },
      { id: "t8", solution: ["She", "forgot", "her", "backpack"], vi: "Bạn ấy đã quên balô." },
    ],
  },
];
export const puzzleSetById = (id: string) => PUZZLE_SETS.find((s) => s.id === id);
export function randomPuzzleSet(): PuzzleSet {
  return PUZZLE_SETS[Math.floor(Math.random() * PUZZLE_SETS.length)];
}

/* ================= ENGLISH RIDDLES — 6 bộ ================= */
export const RIDDLE_SETS: RiddleSet[] = [
  {
    id: "animals", title: "Animals", items: [
      { id: "a1", text: "I say 'moo' and I give milk. What am I?", hint: "🐄", options: ["Cow", "Cat", "Duck"], answer: "Cow", vi: "Mình kêu 'ụm bò' và cho sữa." },
      { id: "a2", text: "I am small, I can fly, and I make honey. What am I?", hint: "🐝", options: ["Bee", "Bird", "Fly"], answer: "Bee", vi: "Mình nhỏ, biết bay, làm ra mật ong." },
      { id: "a3", text: "I live in the sea and I have big claws. What am I?", hint: "🦀", options: ["Crab", "Fish", "Frog"], answer: "Crab", vi: "Mình sống ở biển, có càng to." },
      { id: "a4", text: "I am a friend to people and I like to bark. What am I?", hint: "🐕", options: ["Dog", "Pig", "Sheep"], answer: "Dog", vi: "Mình là bạn của người và hay sủa." },
      { id: "a5", text: "I have a very long neck and I eat leaves from tall trees. What am I?", hint: "🦒", options: ["Giraffe", "Horse", "Deer"], answer: "Giraffe", vi: "Mình cổ rất dài, ăn lá trên cây cao." },
      { id: "a6", text: "I am a big cat, orange with black stripes. What am I?", hint: "🐯", options: ["Tiger", "Lion", "Bear"], answer: "Tiger", vi: "Mình là mèo lớn, cam sọc đen." },
      { id: "a7", text: "I am grey, very big, and I have a long trunk. What am I?", hint: "🐘", options: ["Elephant", "Hippo", "Rhino"], answer: "Elephant", vi: "Mình to, xám, có vòi dài." },
      { id: "a8", text: "I hop, and I carry my baby in a pocket. What am I?", hint: "🦘", options: ["Kangaroo", "Rabbit", "Frog"], answer: "Kangaroo", vi: "Mình nhảy và có túi đựng con." },
    ],
  },
  {
    id: "food", title: "Food", items: [
      { id: "fo1", text: "I am yellow, long, and monkeys love me. What am I?", hint: "🍌", options: ["Banana", "Apple", "Corn"], answer: "Banana", vi: "Mình vàng, dài, khỉ thích ăn." },
      { id: "fo2", text: "I am round and sweet, red or green. What am I?", hint: "🍎", options: ["Apple", "Onion", "Potato"], answer: "Apple", vi: "Mình tròn, ngọt, đỏ hoặc xanh." },
      { id: "fo3", text: "I am orange and you peel my skin. What am I?", hint: "🍊", options: ["Orange", "Grape", "Cherry"], answer: "Orange", vi: "Mình màu cam, bóc vỏ mới ăn." },
      { id: "fo4", text: "I am white and cold, and you pour me on cereal. What am I?", hint: "🥛", options: ["Milk", "Juice", "Water"], answer: "Milk", vi: "Mình trắng, lạnh, rưới lên ngũ cốc." },
      { id: "fo5", text: "I am made from milk, yellow and soft. What am I?", hint: "🧀", options: ["Cheese", "Butter", "Egg"], answer: "Cheese", vi: "Mình làm từ sữa, vàng và mềm." },
      { id: "fo6", text: "You bake me and make sandwiches with me. What am I?", hint: "🍞", options: ["Bread", "Rice", "Cake"], answer: "Bread", vi: "Mình được nướng, dùng làm bánh mì kẹp." },
      { id: "fo7", text: "I am orange and long, and rabbits love me. What am I?", hint: "🥕", options: ["Carrot", "Pepper", "Pumpkin"], answer: "Carrot", vi: "Mình cam, dài, thỏ thích ăn." },
      { id: "fo8", text: "I am sweet and cold, and I melt in the sun. What am I?", hint: "🍦", options: ["Ice cream", "Candy", "Cookie"], answer: "Ice cream", vi: "Mình ngọt, lạnh, gặp nắng thì tan." },
    ],
  },
  {
    id: "places", title: "Places", items: [
      { id: "pl1", text: "You come to me to borrow books quietly. Where am I?", hint: "📚", options: ["Library", "Kitchen", "Garden"], answer: "Library", vi: "Nơi mượn sách và giữ yên lặng." },
      { id: "pl2", text: "You wait here for a bus. Where am I?", hint: "🚏", options: ["Bus stop", "Airport", "Bedroom"], answer: "Bus stop", vi: "Nơi đứng đợi xe buýt." },
      { id: "pl3", text: "You push a cart and buy food here. Where am I?", hint: "🛒", options: ["Supermarket", "Museum", "Beach"], answer: "Supermarket", vi: "Nơi đẩy xe và mua thực phẩm." },
      { id: "pl4", text: "Children play on swings and slides here. Where am I?", hint: "🛝", options: ["Playground", "Office", "Hospital"], answer: "Playground", vi: "Nơi có xích đu và cầu trượt." },
      { id: "pl5", text: "You learn lessons from a teacher here. Where am I?", hint: "🏫", options: ["School", "Farm", "Cinema"], answer: "School", vi: "Nơi học bài với thầy cô." },
      { id: "pl6", text: "You swim and build sandcastles here. Where am I?", hint: "🏖️", options: ["Beach", "Forest", "Kitchen"], answer: "Beach", vi: "Nơi bơi và xây lâu đài cát." },
      { id: "pl7", text: "You visit animals in a big park here. Where am I?", hint: "🦁", options: ["Zoo", "Bank", "Station"], answer: "Zoo", vi: "Nơi tham quan các con vật." },
      { id: "pl8", text: "You watch movies on a big screen here. Where am I?", hint: "🎬", options: ["Cinema", "Library", "Park"], answer: "Cinema", vi: "Nơi xem phim màn hình lớn." },
    ],
  },
  {
    id: "objects", title: "Everyday Objects", items: [
      { id: "ob1", text: "I keep you dry in the rain. What am I?", hint: "☂️", options: ["Umbrella", "Hat", "Scarf"], answer: "Umbrella", vi: "Mình che cho bạn khỏi ướt khi mưa." },
      { id: "ob2", text: "I have hands and a face, and I tell the time. What am I?", hint: "🕐", options: ["Clock", "Mirror", "Radio"], answer: "Clock", vi: "Mình có kim và mặt, báo giờ." },
      { id: "ob3", text: "You carry books in me to school. What am I?", hint: "🎒", options: ["Backpack", "Basket", "Box"], answer: "Backpack", vi: "Bạn đựng sách trong mình để đi học." },
      { id: "ob4", text: "I have many pages and you read me. What am I?", hint: "📖", options: ["Book", "Plate", "Pillow"], answer: "Book", vi: "Mình có nhiều trang để bạn đọc." },
      { id: "ob5", text: "You write with me and I have lead inside. What am I?", hint: "✏️", options: ["Pencil", "Spoon", "Key"], answer: "Pencil", vi: "Bạn viết bằng mình, bên trong có ruột chì." },
      { id: "ob6", text: "You wear me on your feet to walk outside. What am I?", hint: "👟", options: ["Shoes", "Gloves", "Glasses"], answer: "Shoes", vi: "Bạn đi mình dưới chân khi ra ngoài." },
      { id: "ob7", text: "I show you where places are on paper. What am I?", hint: "🗺️", options: ["Map", "Clock", "Cup"], answer: "Map", vi: "Mình chỉ nơi chốn trên giấy." },
      { id: "ob8", text: "I light up a dark room. What am I?", hint: "💡", options: ["Lamp", "Fan", "Door"], answer: "Lamp", vi: "Mình thắp sáng căn phòng tối." },
    ],
  },
  {
    id: "nature", title: "Nature", items: [
      { id: "n1", text: "I fall from clouds and make everything wet. What am I?", hint: "🌧️", options: ["Rain", "Wind", "Fog"], answer: "Rain", vi: "Mình rơi từ mây, làm mọi thứ ướt." },
      { id: "n2", text: "I am bright and hot, and I light the day. What am I?", hint: "☀️", options: ["Sun", "Moon", "Star"], answer: "Sun", vi: "Mình sáng, nóng, chiếu sáng ban ngày." },
      { id: "n3", text: "I am tall and green, and birds live in me. What am I?", hint: "🌳", options: ["Tree", "Rock", "River"], answer: "Tree", vi: "Mình cao, xanh, chim làm tổ trong mình." },
      { id: "n4", text: "I am white and cold, and I fall in winter. What am I?", hint: "❄️", options: ["Snow", "Sand", "Grass"], answer: "Snow", vi: "Mình trắng, lạnh, rơi vào mùa đông." },
      { id: "n5", text: "I am red or orange and I fall in autumn. What am I?", hint: "🍁", options: ["Leaf", "Flower", "Fruit"], answer: "Leaf", vi: "Mình đỏ hoặc cam, rụng vào mùa thu." },
      { id: "n6", text: "I am very tall, made of rock, with snow on top. What am I?", hint: "🏔️", options: ["Mountain", "Hill", "Cave"], answer: "Mountain", vi: "Mình cao, bằng đá, đỉnh có tuyết." },
      { id: "n7", text: "I appear after the rain with many colours. What am I?", hint: "🌈", options: ["Rainbow", "Cloud", "Lightning"], answer: "Rainbow", vi: "Mình hiện sau mưa với nhiều màu." },
      { id: "n8", text: "I twinkle in the night sky. What am I?", hint: "⭐", options: ["Star", "Sun", "Kite"], answer: "Star", vi: "Mình lấp lánh trên bầu trời đêm." },
    ],
  },
  {
    id: "logic", title: "Brain Teasers", items: [
      { id: "lg1", text: "I have hands but I cannot clap. What am I?", hint: "🕐", options: ["A clock", "A tree", "A cloud"], answer: "A clock", vi: "Mình có kim (hands) nhưng không vỗ tay được." },
      { id: "lg2", text: "The more you take, the more you leave behind. What are they?", hint: "👣", options: ["Footsteps", "Coins", "Photos"], answer: "Footsteps", vi: "Càng bước (take steps) càng để lại nhiều dấu chân." },
      { id: "lg3", text: "I get wetter the more I dry things. What am I?", hint: "🧻", options: ["A towel", "A rock", "A lamp"], answer: "A towel", vi: "Càng lau khô đồ, mình càng ướt — cái khăn." },
      { id: "lg4", text: "I have keys but open no locks. What am I?", hint: "🎹", options: ["A piano", "A door", "A car"], answer: "A piano", vi: "Mình có phím (keys) nhưng không mở khoá — đàn piano." },
      { id: "lg5", text: "You must break me before you can use me. What am I?", hint: "🥚", options: ["An egg", "A cup", "A stick"], answer: "An egg", vi: "Phải đập vỡ mới dùng được — quả trứng." },
      { id: "lg6", text: "I have many teeth but I cannot bite. What am I?", hint: "🪮", options: ["A comb", "A dog", "A saw"], answer: "A comb", vi: "Mình nhiều răng (teeth) nhưng không cắn — cái lược." },
      { id: "lg7", text: "I have a neck but no head. What am I?", hint: "🍾", options: ["A bottle", "A snake", "A shirt"], answer: "A bottle", vi: "Mình có cổ (neck) nhưng không có đầu — cái chai." },
      { id: "lg8", text: "I go up but never come down. What is it?", hint: "🎂", options: ["Your age", "A ball", "The rain"], answer: "Your age", vi: "Chỉ tăng chứ không giảm — số tuổi của bạn." },
    ],
  },
];
export const riddleSetById = (id: string) => RIDDLE_SETS.find((s) => s.id === id);
export function randomRiddleSet(): RiddleSet {
  return RIDDLE_SETS[Math.floor(Math.random() * RIDDLE_SETS.length)];
}
