// Ngân hàng nội dung chữ cho Sentence Puzzle & English Riddles.
// Mỗi game có nhiều bộ/chủ đề; MỖI câu gắn sẵn độ khó (easy/medium/hard) để trẻ TỰ CHỌN mức chơi.
// Puzzle: cân ~3 Dễ / 3 Vừa / 2 Khó mỗi chủ đề. Riddle: bộ từ vựng = Dễ/Vừa, bộ Đố mẹo = Khó.
import type { PuzzleSet, RiddleSet, ListenSet } from "./games";

/* ================= SENTENCE PUZZLE — 6 chủ đề ================= */
export const PUZZLE_SETS: PuzzleSet[] = [
  {
    id: "daily", title: "Daily Life", items: [
      { id: "d1", solution: ["I", "usually", "pack", "my", "bag", "before", "breakfast"], vi: "Mình thường soạn cặp trước bữa sáng.", difficulty: "easy" },
      { id: "d2", solution: ["She", "walks", "to", "school", "unless", "it", "is", "raining"], vi: "Bạn ấy đi bộ đến trường trừ khi trời mưa.", difficulty: "hard" },
      { id: "d3", solution: ["We", "take", "turns", "setting", "the", "table", "for", "dinner"], vi: "Chúng mình thay phiên nhau dọn bàn ăn tối.", difficulty: "medium" },
      { id: "d4", solution: ["He", "finishes", "his", "homework", "before", "playing", "online"], vi: "Cậu ấy làm xong bài trước khi chơi trực tuyến.", difficulty: "medium" },
      { id: "d5", solution: ["They", "have", "already", "cleaned", "their", "shared", "room"], vi: "Họ đã dọn xong căn phòng chung.", difficulty: "medium" },
      { id: "d6", solution: ["I", "forgot", "to", "charge", "my", "tablet", "last", "night"], vi: "Tối qua mình quên sạc máy tính bảng.", difficulty: "easy" },
      { id: "d7", solution: ["We", "should", "leave", "early", "to", "avoid", "the", "traffic"], vi: "Chúng mình nên đi sớm để tránh kẹt xe.", difficulty: "hard" },
      { id: "d8", solution: ["I", "go", "to", "bed", "early", "on", "school", "nights"], vi: "Mình đi ngủ sớm vào những tối trước ngày học.", difficulty: "easy" },
    ],
  },
  {
    id: "school", title: "School", items: [
      { id: "s1", solution: ["The", "teacher", "asked", "us", "to", "explain", "our", "answers"], vi: "Giáo viên yêu cầu chúng mình giải thích đáp án.", difficulty: "medium" },
      { id: "s2", solution: ["I", "raised", "my", "hand", "because", "I", "had", "an", "idea"], vi: "Mình giơ tay vì có một ý tưởng.", difficulty: "hard" },
      { id: "s3", solution: ["We", "are", "preparing", "a", "presentation", "about", "ocean", "life"], vi: "Chúng mình đang chuẩn bị bài thuyết trình về sinh vật biển.", difficulty: "easy" },
      { id: "s4", solution: ["Her", "diagram", "is", "clearer", "than", "the", "first", "version"], vi: "Sơ đồ của bạn ấy rõ hơn phiên bản đầu.", difficulty: "medium" },
      { id: "s5", solution: ["He", "borrowed", "a", "book", "from", "the", "school", "library"], vi: "Cậu ấy mượn sách từ thư viện trường.", difficulty: "easy" },
      { id: "s6", solution: ["The", "students", "worked", "together", "to", "solve", "the", "problem"], vi: "Các bạn học sinh cùng nhau giải quyết vấn đề.", difficulty: "medium" },
      { id: "s7", solution: ["I", "forgot", "my", "notes", "but", "remembered", "the", "main", "idea"], vi: "Mình quên ghi chú nhưng vẫn nhớ ý chính.", difficulty: "hard" },
      { id: "s8", solution: ["We", "check", "our", "work", "before", "submitting", "it"], vi: "Chúng mình kiểm tra bài trước khi nộp.", difficulty: "easy" },
    ],
  },
  {
    id: "food", title: "Food & Cooking", items: [
      { id: "f1", solution: ["This", "soup", "tastes", "better", "with", "a", "little", "pepper"], vi: "Món súp này ngon hơn khi thêm một chút tiêu.", difficulty: "medium" },
      { id: "f2", solution: ["She", "is", "following", "a", "recipe", "from", "her", "grandmother"], vi: "Bạn ấy đang làm theo công thức của bà.", difficulty: "easy" },
      { id: "f3", solution: ["We", "bought", "fresh", "bread", "because", "the", "bakery", "was", "open"], vi: "Chúng mình mua bánh mì tươi vì tiệm bánh đang mở.", difficulty: "hard" },
      { id: "f4", solution: ["He", "would", "rather", "drink", "water", "than", "a", "sugary", "soda"], vi: "Cậu ấy thích uống nước hơn nước ngọt có đường.", difficulty: "hard" },
      { id: "f5", solution: ["The", "pancakes", "will", "burn", "if", "you", "forget", "to", "flip", "them"], vi: "Bánh sẽ cháy nếu bạn quên lật.", difficulty: "medium" },
      { id: "f6", solution: ["I", "have", "never", "tried", "this", "kind", "of", "fruit"], vi: "Mình chưa từng thử loại trái cây này.", difficulty: "medium" },
      { id: "f7", solution: ["They", "shared", "the", "last", "slice", "of", "pizza"], vi: "Họ chia nhau miếng pizza cuối cùng.", difficulty: "easy" },
      { id: "f8", solution: ["Could", "you", "please", "pass", "me", "the", "cheese"], vi: "Bạn có thể chuyền phô mai cho mình được không?", difficulty: "easy" },
    ],
  },
  {
    id: "places", title: "Places & Travel", items: [
      { id: "p1", solution: ["We", "took", "the", "scenic", "route", "through", "the", "forest"], vi: "Chúng mình đi theo tuyến đường đẹp xuyên qua rừng.", difficulty: "easy" },
      { id: "p2", solution: ["The", "bus", "was", "late", "because", "of", "the", "heavy", "traffic"], vi: "Xe buýt đến muộn vì giao thông đông.", difficulty: "hard" },
      { id: "p3", solution: ["I", "have", "been", "waiting", "at", "the", "stop", "for", "ten", "minutes"], vi: "Mình đã đợi ở trạm được mười phút.", difficulty: "hard" },
      { id: "p4", solution: ["She", "found", "the", "information", "in", "a", "travel", "guide"], vi: "Bạn ấy tìm thấy thông tin trong sách hướng dẫn du lịch.", difficulty: "easy" },
      { id: "p5", solution: ["We", "should", "check", "the", "map", "before", "choosing", "a", "route"], vi: "Chúng mình nên xem bản đồ trước khi chọn đường.", difficulty: "medium" },
      { id: "p6", solution: ["The", "train", "leaves", "at", "noon", "from", "platform", "four"], vi: "Tàu rời ga lúc trưa từ sân ga số bốn.", difficulty: "easy" },
      { id: "p7", solution: ["The", "museum", "is", "within", "walking", "distance", "of", "the", "station"], vi: "Bảo tàng nằm trong khoảng cách có thể đi bộ từ nhà ga.", difficulty: "medium" },
      { id: "p8", solution: ["Turn", "left", "after", "you", "cross", "the", "bridge"], vi: "Rẽ trái sau khi bạn đi qua cầu.", difficulty: "easy" },
    ],
  },
  {
    id: "feelings", title: "Feelings", items: [
      { id: "e1", solution: ["I", "felt", "relieved", "when", "we", "finally", "solved", "the", "problem"], vi: "Mình thấy nhẹ nhõm khi cuối cùng chúng mình giải được vấn đề.", difficulty: "hard" },
      { id: "e2", solution: ["She", "was", "disappointed", "but", "decided", "to", "try", "again"], vi: "Bạn ấy thất vọng nhưng quyết định thử lại.", difficulty: "easy" },
      { id: "e3", solution: ["He", "is", "excited", "about", "presenting", "his", "new", "invention"], vi: "Cậu ấy hào hứng về việc trình bày phát minh mới.", difficulty: "medium" },
      { id: "e4", solution: ["We", "are", "proud", "of", "how", "much", "you", "have", "improved"], vi: "Chúng mình tự hào vì bạn đã tiến bộ rất nhiều.", difficulty: "medium" },
      { id: "e5", solution: ["It", "is", "normal", "to", "feel", "nervous", "before", "a", "performance"], vi: "Cảm thấy hồi hộp trước buổi biểu diễn là bình thường.", difficulty: "medium" },
      { id: "e6", solution: ["I", "feel", "calmer", "after", "talking", "to", "a", "friend"], vi: "Mình bình tĩnh hơn sau khi nói chuyện với một người bạn.", difficulty: "easy" },
      { id: "e7", solution: ["They", "were", "surprised", "by", "the", "unexpected", "result"], vi: "Họ bất ngờ trước kết quả ngoài dự đoán.", difficulty: "easy" },
      { id: "e8", solution: ["He", "seemed", "confident", "even", "though", "he", "was", "worried"], vi: "Cậu ấy trông tự tin dù đang lo lắng.", difficulty: "hard" },
    ],
  },
  {
    id: "past", title: "Past Events", items: [
      { id: "t1", solution: ["We", "were", "walking", "home", "when", "the", "storm", "began"], vi: "Chúng mình đang đi bộ về nhà thì cơn bão bắt đầu.", difficulty: "hard" },
      { id: "t2", solution: ["She", "found", "her", "ticket", "after", "searching", "every", "pocket"], vi: "Bạn ấy tìm thấy vé sau khi lục mọi túi áo.", difficulty: "easy" },
      { id: "t3", solution: ["He", "had", "already", "left", "when", "I", "called", "him"], vi: "Cậu ấy đã rời đi khi mình gọi.", difficulty: "hard" },
      { id: "t4", solution: ["I", "visited", "my", "grandmother", "during", "the", "winter", "break"], vi: "Mình đã thăm bà trong kỳ nghỉ đông.", difficulty: "easy" },
      { id: "t5", solution: ["They", "missed", "the", "bus", "because", "they", "left", "late"], vi: "Họ lỡ xe buýt vì rời đi muộn.", difficulty: "medium" },
      { id: "t6", solution: ["We", "had", "never", "seen", "such", "a", "bright", "rainbow"], vi: "Chúng mình chưa từng thấy cầu vồng rực rỡ đến vậy.", difficulty: "medium" },
      { id: "t7", solution: ["The", "dog", "returned", "the", "ball", "after", "chasing", "it"], vi: "Chú chó mang bóng về sau khi đuổi theo.", difficulty: "easy" },
      { id: "t8", solution: ["She", "realized", "that", "her", "backpack", "was", "still", "at", "school"], vi: "Bạn ấy nhận ra balô vẫn còn ở trường.", difficulty: "medium" },
    ],
  },
  // Bám nội dung Learn Level 2 (Stories & Situations): định lượng, so sánh, điều kiện, việc song song.
  {
    id: "stories", title: "Stories & Situations", items: [
      { id: "st1", solution: ["Measure", "the", "flour", "carefully"], vi: "Hãy đong bột cẩn thận.", difficulty: "easy" },
      { id: "st2", solution: ["We", "should", "postpone", "the", "match"], vi: "Chúng mình nên hoãn trận đấu.", difficulty: "easy" },
      { id: "st3", solution: ["Each", "guide", "matches", "one", "route"], vi: "Mỗi máy thuyết minh khớp một tuyến.", difficulty: "easy" },
      { id: "st4", solution: ["The", "recipe", "cards", "were", "swapped", "yesterday"], vi: "Các thẻ công thức đã bị đổi nhầm hôm qua.", difficulty: "medium" },
      { id: "st5", solution: ["We", "chose", "the", "most", "efficient", "order"], vi: "Chúng mình chọn thứ tự hiệu quả nhất.", difficulty: "medium" },
      { id: "st6", solution: ["The", "forecast", "says", "the", "rain", "will", "continue"], vi: "Dự báo nói mưa sẽ tiếp tục.", difficulty: "medium" },
      { id: "st7", solution: ["If", "it", "keeps", "raining", "we", "could", "play", "indoors"], vi: "Nếu trời cứ mưa, chúng mình có thể chơi trong nhà.", difficulty: "hard" },
      { id: "st8", solution: ["While", "the", "recorder", "charges", "we", "can", "rehearse", "the", "questions"], vi: "Trong khi máy sạc, chúng mình có thể tập câu hỏi.", difficulty: "hard" },
    ],
  },
  // Bám nội dung Learn Level 3 (Opinions & Solving Problems): bằng chứng, lợi–hại, khuyến nghị, thỏa hiệp.
  {
    id: "opinions", title: "Opinions & Reasons", items: [
      { id: "op1", solution: ["We", "should", "conserve", "water"], vi: "Chúng mình nên tiết kiệm nước.", difficulty: "easy" },
      { id: "op2", solution: ["The", "survey", "shows", "clear", "results"], vi: "Khảo sát cho thấy kết quả rõ ràng.", difficulty: "easy" },
      { id: "op3", solution: ["Different", "users", "need", "different", "spaces"], vi: "Những người dùng khác nhau cần không gian khác nhau.", difficulty: "easy" },
      { id: "op4", solution: ["Mulch", "helps", "the", "soil", "stay", "moist"], vi: "Lớp phủ giúp đất giữ ẩm.", difficulty: "medium" },
      { id: "op5", solution: ["The", "benefit", "is", "shade", "and", "cooler", "air"], vi: "Lợi ích là bóng râm và không khí mát hơn.", difficulty: "medium" },
      { id: "op6", solution: ["A", "fair", "compromise", "would", "help", "everyone"], vi: "Một thỏa hiệp hợp lý sẽ giúp mọi người.", difficulty: "medium" },
      { id: "op7", solution: ["Although", "photos", "help", "us", "identify", "items", "they", "reduce", "privacy"], vi: "Mặc dù ảnh giúp nhận ra đồ vật, chúng làm giảm riêng tư.", difficulty: "hard" },
      { id: "op8", solution: ["Based", "on", "the", "trial", "we", "would", "use", "fewer", "categories"], vi: "Dựa trên thử nghiệm, chúng mình sẽ dùng ít nhóm hơn.", difficulty: "hard" },
    ],
  },
];
export const puzzleSetById = (id: string) => PUZZLE_SETS.find((s) => s.id === id);
export function randomPuzzleSet(): PuzzleSet {
  return PUZZLE_SETS[Math.floor(Math.random() * PUZZLE_SETS.length)];
}

/* ================= ENGLISH RIDDLES — 6 bộ ================= */
// Bộ từ vựng (animals/food/places/objects/nature): Dễ + một ít Vừa. Bộ Đố mẹo (logic): Khó.
export const RIDDLE_SETS: RiddleSet[] = [
  {
    id: "animals", title: "Animals", items: [
      { id: "a1", text: "I say 'moo' and I give milk. What am I?", hint: "🐄", options: ["Cow", "Cat", "Duck"], answer: "Cow", vi: "Mình kêu 'ụm bò' và cho sữa.", difficulty: "easy" },
      { id: "a2", text: "I am small, I can fly, and I make honey. What am I?", hint: "🐝", options: ["Bee", "Bird", "Fly"], answer: "Bee", vi: "Mình nhỏ, biết bay, làm ra mật ong.", difficulty: "easy" },
      { id: "a3", text: "I live in the sea and I have big claws. What am I?", hint: "🦀", options: ["Crab", "Fish", "Frog"], answer: "Crab", vi: "Mình sống ở biển, có càng to.", difficulty: "medium" },
      { id: "a4", text: "I am a friend to people and I like to bark. What am I?", hint: "🐕", options: ["Dog", "Pig", "Sheep"], answer: "Dog", vi: "Mình là bạn của người và hay sủa.", difficulty: "easy" },
      { id: "a5", text: "I have a very long neck and I eat leaves from tall trees. What am I?", hint: "🦒", options: ["Giraffe", "Horse", "Deer"], answer: "Giraffe", vi: "Mình cổ rất dài, ăn lá trên cây cao.", difficulty: "medium" },
      { id: "a6", text: "I am a big cat, orange with black stripes. What am I?", hint: "🐯", options: ["Tiger", "Lion", "Bear"], answer: "Tiger", vi: "Mình là mèo lớn, cam sọc đen.", difficulty: "easy" },
      { id: "a7", text: "I am grey, very big, and I have a long trunk. What am I?", hint: "🐘", options: ["Elephant", "Hippo", "Rhino"], answer: "Elephant", vi: "Mình to, xám, có vòi dài.", difficulty: "easy" },
      { id: "a8", text: "I hop, and I carry my baby in a pocket. What am I?", hint: "🦘", options: ["Kangaroo", "Rabbit", "Frog"], answer: "Kangaroo", vi: "Mình nhảy và có túi đựng con.", difficulty: "medium" },
    ],
  },
  {
    id: "food", title: "Food", items: [
      { id: "fo1", text: "I am yellow, long, and monkeys love me. What am I?", hint: "🍌", options: ["Banana", "Apple", "Corn"], answer: "Banana", vi: "Mình vàng, dài, khỉ thích ăn.", difficulty: "easy" },
      { id: "fo2", text: "I am round and sweet, red or green. What am I?", hint: "🍎", options: ["Apple", "Onion", "Potato"], answer: "Apple", vi: "Mình tròn, ngọt, đỏ hoặc xanh.", difficulty: "easy" },
      { id: "fo3", text: "I am orange and you peel my skin. What am I?", hint: "🍊", options: ["Orange", "Grape", "Cherry"], answer: "Orange", vi: "Mình màu cam, bóc vỏ mới ăn.", difficulty: "easy" },
      { id: "fo4", text: "I am white and cold, and you pour me on cereal. What am I?", hint: "🥛", options: ["Milk", "Juice", "Water"], answer: "Milk", vi: "Mình trắng, lạnh, rưới lên ngũ cốc.", difficulty: "easy" },
      { id: "fo5", text: "I am made from milk, yellow and soft. What am I?", hint: "🧀", options: ["Cheese", "Butter", "Egg"], answer: "Cheese", vi: "Mình làm từ sữa, vàng và mềm.", difficulty: "medium" },
      { id: "fo6", text: "You bake me and make sandwiches with me. What am I?", hint: "🍞", options: ["Bread", "Rice", "Cake"], answer: "Bread", vi: "Mình được nướng, dùng làm bánh mì kẹp.", difficulty: "easy" },
      { id: "fo7", text: "I am orange and long, and rabbits love me. What am I?", hint: "🥕", options: ["Carrot", "Pepper", "Pumpkin"], answer: "Carrot", vi: "Mình cam, dài, thỏ thích ăn.", difficulty: "medium" },
      { id: "fo8", text: "I am sweet and cold, and I melt in the sun. What am I?", hint: "🍦", options: ["Ice cream", "Candy", "Cookie"], answer: "Ice cream", vi: "Mình ngọt, lạnh, gặp nắng thì tan.", difficulty: "medium" },
    ],
  },
  {
    id: "places", title: "Places", items: [
      { id: "pl1", text: "You come to me to borrow books quietly. Where am I?", hint: "📚", options: ["Library", "Kitchen", "Garden"], answer: "Library", vi: "Nơi mượn sách và giữ yên lặng.", difficulty: "medium" },
      { id: "pl2", text: "You wait here for a bus. Where am I?", hint: "🚏", options: ["Bus stop", "Airport", "Bedroom"], answer: "Bus stop", vi: "Nơi đứng đợi xe buýt.", difficulty: "easy" },
      { id: "pl3", text: "You push a cart and buy food here. Where am I?", hint: "🛒", options: ["Supermarket", "Museum", "Beach"], answer: "Supermarket", vi: "Nơi đẩy xe và mua thực phẩm.", difficulty: "medium" },
      { id: "pl4", text: "Children play on swings and slides here. Where am I?", hint: "🛝", options: ["Playground", "Office", "Hospital"], answer: "Playground", vi: "Nơi có xích đu và cầu trượt.", difficulty: "easy" },
      { id: "pl5", text: "You learn lessons from a teacher here. Where am I?", hint: "🏫", options: ["School", "Farm", "Cinema"], answer: "School", vi: "Nơi học bài với thầy cô.", difficulty: "easy" },
      { id: "pl6", text: "You swim and build sandcastles here. Where am I?", hint: "🏖️", options: ["Beach", "Forest", "Kitchen"], answer: "Beach", vi: "Nơi bơi và xây lâu đài cát.", difficulty: "easy" },
      { id: "pl7", text: "You visit animals in a big park here. Where am I?", hint: "🦁", options: ["Zoo", "Bank", "Station"], answer: "Zoo", vi: "Nơi tham quan các con vật.", difficulty: "easy" },
      { id: "pl8", text: "You watch movies on a big screen here. Where am I?", hint: "🎬", options: ["Cinema", "Library", "Park"], answer: "Cinema", vi: "Nơi xem phim màn hình lớn.", difficulty: "medium" },
    ],
  },
  {
    id: "objects", title: "Everyday Objects", items: [
      { id: "ob1", text: "I keep you dry in the rain. What am I?", hint: "☂️", options: ["Umbrella", "Hat", "Scarf"], answer: "Umbrella", vi: "Mình che cho bạn khỏi ướt khi mưa.", difficulty: "easy" },
      { id: "ob2", text: "I have hands and a face, and I tell the time. What am I?", hint: "🕐", options: ["Clock", "Mirror", "Radio"], answer: "Clock", vi: "Mình có kim và mặt, báo giờ.", difficulty: "medium" },
      { id: "ob3", text: "You carry books in me to school. What am I?", hint: "🎒", options: ["Backpack", "Basket", "Box"], answer: "Backpack", vi: "Bạn đựng sách trong mình để đi học.", difficulty: "easy" },
      { id: "ob4", text: "I have many pages and you read me. What am I?", hint: "📖", options: ["Book", "Plate", "Pillow"], answer: "Book", vi: "Mình có nhiều trang để bạn đọc.", difficulty: "easy" },
      { id: "ob5", text: "You write with me and I have lead inside. What am I?", hint: "✏️", options: ["Pencil", "Spoon", "Key"], answer: "Pencil", vi: "Bạn viết bằng mình, bên trong có ruột chì.", difficulty: "easy" },
      { id: "ob6", text: "You wear me on your feet to walk outside. What am I?", hint: "👟", options: ["Shoes", "Gloves", "Glasses"], answer: "Shoes", vi: "Bạn đi mình dưới chân khi ra ngoài.", difficulty: "easy" },
      { id: "ob7", text: "I show you where places are on paper. What am I?", hint: "🗺️", options: ["Map", "Clock", "Cup"], answer: "Map", vi: "Mình chỉ nơi chốn trên giấy.", difficulty: "medium" },
      { id: "ob8", text: "I light up a dark room. What am I?", hint: "💡", options: ["Lamp", "Fan", "Door"], answer: "Lamp", vi: "Mình thắp sáng căn phòng tối.", difficulty: "medium" },
    ],
  },
  {
    id: "nature", title: "Nature", items: [
      { id: "n1", text: "I fall from clouds and make everything wet. What am I?", hint: "🌧️", options: ["Rain", "Wind", "Fog"], answer: "Rain", vi: "Mình rơi từ mây, làm mọi thứ ướt.", difficulty: "easy" },
      { id: "n2", text: "I am bright and hot, and I light the day. What am I?", hint: "☀️", options: ["Sun", "Moon", "Star"], answer: "Sun", vi: "Mình sáng, nóng, chiếu sáng ban ngày.", difficulty: "easy" },
      { id: "n3", text: "I am tall and green, and birds live in me. What am I?", hint: "🌳", options: ["Tree", "Rock", "River"], answer: "Tree", vi: "Mình cao, xanh, chim làm tổ trong mình.", difficulty: "easy" },
      { id: "n4", text: "I am white and cold, and I fall in winter. What am I?", hint: "❄️", options: ["Snow", "Sand", "Grass"], answer: "Snow", vi: "Mình trắng, lạnh, rơi vào mùa đông.", difficulty: "easy" },
      { id: "n5", text: "I am red or orange and I fall in autumn. What am I?", hint: "🍁", options: ["Leaf", "Flower", "Fruit"], answer: "Leaf", vi: "Mình đỏ hoặc cam, rụng vào mùa thu.", difficulty: "medium" },
      { id: "n6", text: "I am very tall, made of rock, with snow on top. What am I?", hint: "🏔️", options: ["Mountain", "Hill", "Cave"], answer: "Mountain", vi: "Mình cao, bằng đá, đỉnh có tuyết.", difficulty: "medium" },
      { id: "n7", text: "I appear after the rain with many colours. What am I?", hint: "🌈", options: ["Rainbow", "Cloud", "Lightning"], answer: "Rainbow", vi: "Mình hiện sau mưa với nhiều màu.", difficulty: "easy" },
      { id: "n8", text: "I twinkle in the night sky. What am I?", hint: "⭐", options: ["Star", "Sun", "Kite"], answer: "Star", vi: "Mình lấp lánh trên bầu trời đêm.", difficulty: "medium" },
    ],
  },
  {
    id: "logic", title: "Brain Teasers", items: [
      { id: "lg1", text: "I have hands but I cannot clap. What am I?", hint: "🕐", options: ["A clock", "A tree", "A cloud"], answer: "A clock", vi: "Mình có kim (hands) nhưng không vỗ tay được.", difficulty: "hard" },
      { id: "lg2", text: "The more you take, the more you leave behind. What are they?", hint: "👣", options: ["Footsteps", "Coins", "Photos"], answer: "Footsteps", vi: "Càng bước (take steps) càng để lại nhiều dấu chân.", difficulty: "hard" },
      { id: "lg3", text: "I get wetter the more I dry things. What am I?", hint: "🧻", options: ["A towel", "A rock", "A lamp"], answer: "A towel", vi: "Càng lau khô đồ, mình càng ướt — cái khăn.", difficulty: "hard" },
      { id: "lg4", text: "I have keys but open no locks. What am I?", hint: "🎹", options: ["A piano", "A door", "A car"], answer: "A piano", vi: "Mình có phím (keys) nhưng không mở khoá — đàn piano.", difficulty: "hard" },
      { id: "lg5", text: "You must break me before you can use me. What am I?", hint: "🥚", options: ["An egg", "A cup", "A stick"], answer: "An egg", vi: "Phải đập vỡ mới dùng được — quả trứng.", difficulty: "hard" },
      { id: "lg6", text: "I have many teeth but I cannot bite. What am I?", hint: "🪮", options: ["A comb", "A dog", "A saw"], answer: "A comb", vi: "Mình nhiều răng (teeth) nhưng không cắn — cái lược.", difficulty: "hard" },
      { id: "lg7", text: "I have a neck but no head. What am I?", hint: "🍾", options: ["A bottle", "A snake", "A shirt"], answer: "A bottle", vi: "Mình có cổ (neck) nhưng không có đầu — cái chai.", difficulty: "hard" },
      { id: "lg8", text: "I go up but never come down. What is it?", hint: "🎂", options: ["Your age", "A ball", "The rain"], answer: "Your age", vi: "Chỉ tăng chứ không giảm — số tuổi của bạn.", difficulty: "hard" },
    ],
  },
  // Bộ từ vựng bám Learn Level 2 & 3 (recipe, forecast, deadline, detour, exhibit, schedule, mulch, route).
  {
    id: "storywords", title: "Story Words", items: [
      { id: "sw1", text: "You read me to learn the ingredients and steps for a dish. What am I?", hint: "📋", options: ["Recipe", "Ticket", "Poster"], answer: "Recipe", vi: "Bạn đọc mình để biết nguyên liệu và các bước nấu — công thức.", difficulty: "easy" },
      { id: "sw2", text: "I tell people whether it will rain or shine tomorrow. What am I?", hint: "🌦️", options: ["Forecast", "Story", "Recipe"], answer: "Forecast", vi: "Mình báo ngày mai mưa hay nắng — bản dự báo.", difficulty: "easy" },
      { id: "sw3", text: "I am a plan that shows the times of events in order. What am I?", hint: "🗓️", options: ["Schedule", "Riddle", "Recipe"], answer: "Schedule", vi: "Bản kế hoạch ghi giờ các sự kiện — lịch trình.", difficulty: "easy" },
      { id: "sw4", text: "I am the path you follow to reach a place. What am I?", hint: "🗺️", options: ["Route", "Corner", "Wall"], answer: "Route", vi: "Con đường bạn đi để tới nơi — tuyến đường.", difficulty: "easy" },
      { id: "sw5", text: "I am an object put on display for visitors in a museum. What am I?", hint: "🏛️", options: ["Exhibit", "Ticket", "Guard"], answer: "Exhibit", vi: "Vật được trưng bày cho khách xem — khu trưng bày.", difficulty: "medium" },
      { id: "sw6", text: "I am the last moment when your work must be finished. What am I?", hint: "⏰", options: ["Deadline", "Holiday", "Weekend"], answer: "Deadline", vi: "Thời điểm cuối cùng phải xong việc — hạn chót.", difficulty: "medium" },
      { id: "sw7", text: "I am a longer way around when the direct road is blocked. What am I?", hint: "🚧", options: ["Detour", "Shortcut", "Bridge"], answer: "Detour", vi: "Đường vòng khi lối thẳng bị chặn.", difficulty: "medium" },
      { id: "sw8", text: "I cover the soil to keep water in and help plants grow. What am I?", hint: "🍂", options: ["Mulch", "Sand", "Glass"], answer: "Mulch", vi: "Lớp phủ giữ nước cho đất — lớp phủ đất.", difficulty: "hard" },
    ],
  },
];
export const riddleSetById = (id: string) => RIDDLE_SETS.find((s) => s.id === id);
export function randomRiddleSet(): RiddleSet {
  return RIDDLE_SETS[Math.floor(Math.random() * RIDDLE_SETS.length)];
}

/* ================= LISTEN & CHOOSE — nghe câu → chọn nghĩa (không ảnh) ================= */
// `say` = câu Maple đọc (ẩn, hiện lại sau khi trả lời). options = 3 nghĩa tiếng Việt. Mỗi bộ ~3 Dễ / 3 Vừa / 2 Khó.
export const LISTEN_SETS: ListenSet[] = [
  {
    id: "everyday", title: "Everyday", items: [
      { id: "le1", say: "I brush my teeth every morning.", options: ["Mình đánh răng mỗi sáng.", "Mình rửa tay mỗi sáng.", "Mình chải tóc mỗi sáng."], answer: "Mình đánh răng mỗi sáng.", difficulty: "easy" },
      { id: "le2", say: "She is reading a book now.", options: ["Bạn ấy đang đọc sách.", "Bạn ấy đang viết thư.", "Bạn ấy đang nấu ăn."], answer: "Bạn ấy đang đọc sách.", difficulty: "easy" },
      { id: "le3", say: "He forgot to charge his phone.", options: ["Cậu ấy quên sạc điện thoại.", "Cậu ấy quên mang điện thoại.", "Cậu ấy làm rơi điện thoại."], answer: "Cậu ấy quên sạc điện thoại.", difficulty: "easy" },
      { id: "le4", say: "We usually eat dinner at seven.", options: ["Chúng mình thường ăn tối lúc bảy giờ.", "Chúng mình thường ăn sáng lúc bảy giờ.", "Chúng mình thường ngủ lúc bảy giờ."], answer: "Chúng mình thường ăn tối lúc bảy giờ.", difficulty: "medium" },
      { id: "le5", say: "It is raining, so take an umbrella.", options: ["Trời đang mưa nên hãy mang ô.", "Trời nắng nên hãy đội mũ.", "Trời lạnh nên hãy mặc áo ấm."], answer: "Trời đang mưa nên hãy mang ô.", difficulty: "medium" },
      { id: "le6", say: "They are cleaning their room together.", options: ["Họ đang cùng nhau dọn phòng.", "Họ đang cùng nhau chơi game.", "Họ đang cùng nhau xem phim."], answer: "Họ đang cùng nhau dọn phòng.", difficulty: "medium" },
      { id: "le7", say: "I would rather walk than take the bus.", options: ["Mình thà đi bộ còn hơn đi xe buýt.", "Mình thích đi xe buýt hơn đi bộ.", "Mình không đi bộ cũng không đi xe buýt."], answer: "Mình thà đi bộ còn hơn đi xe buýt.", difficulty: "hard" },
      { id: "le8", say: "Please turn off the lights before you leave.", options: ["Làm ơn tắt đèn trước khi bạn rời đi.", "Làm ơn bật đèn khi bạn bước vào.", "Làm ơn đóng cửa sổ trước khi ngủ."], answer: "Làm ơn tắt đèn trước khi bạn rời đi.", difficulty: "hard" },
    ],
  },
  {
    id: "school", title: "At School", items: [
      { id: "ls1", say: "The teacher is writing on the board.", options: ["Cô giáo đang viết trên bảng.", "Cô giáo đang đọc sách.", "Cô giáo đang chỉ vào bản đồ."], answer: "Cô giáo đang viết trên bảng.", difficulty: "easy" },
      { id: "ls2", say: "We are doing a science experiment.", options: ["Chúng mình đang làm một thí nghiệm khoa học.", "Chúng mình đang vẽ một bức tranh.", "Chúng mình đang hát một bài hát."], answer: "Chúng mình đang làm một thí nghiệm khoa học.", difficulty: "easy" },
      { id: "ls3", say: "I borrowed two books from the library.", options: ["Mình mượn hai quyển sách từ thư viện.", "Mình mua hai quyển sách ở hiệu sách.", "Mình trả hai quyển sách cho bạn."], answer: "Mình mượn hai quyển sách từ thư viện.", difficulty: "easy" },
      { id: "ls4", say: "Raise your hand if you have a question.", options: ["Hãy giơ tay nếu bạn có câu hỏi.", "Hãy đứng dậy nếu bạn thấy mệt.", "Hãy vỗ tay nếu bạn thấy vui."], answer: "Hãy giơ tay nếu bạn có câu hỏi.", difficulty: "medium" },
      { id: "ls5", say: "Don't forget to hand in your homework.", options: ["Đừng quên nộp bài tập về nhà.", "Đừng quên mang bữa trưa.", "Đừng quên mặc đồng phục."], answer: "Đừng quên nộp bài tập về nhà.", difficulty: "medium" },
      { id: "ls6", say: "The library is quiet, so please whisper.", options: ["Thư viện yên tĩnh nên hãy nói thầm.", "Sân trường ồn ào nên hãy nói to.", "Lớp học vui nên hãy cười lớn."], answer: "Thư viện yên tĩnh nên hãy nói thầm.", difficulty: "medium" },
      { id: "ls7", say: "If you finish early, you can read quietly.", options: ["Nếu xong sớm, bạn có thể đọc sách trong yên lặng.", "Nếu đến muộn, bạn phải ở lại lớp.", "Nếu làm sai, bạn phải làm lại từ đầu."], answer: "Nếu xong sớm, bạn có thể đọc sách trong yên lặng.", difficulty: "hard" },
      { id: "ls8", say: "Our group presented a poster about oceans.", options: ["Nhóm mình đã thuyết trình một tấm áp phích về đại dương.", "Nhóm mình đã xem một bộ phim về đại dương.", "Nhóm mình đã đi tham quan đại dương."], answer: "Nhóm mình đã thuyết trình một tấm áp phích về đại dương.", difficulty: "hard" },
    ],
  },
  // Bám nội dung Learn Level 2 & 3 (chuyến đi, lựa chọn, lý do, điều kiện) — hợp với cảnh ảnh mới trong Practice.
  {
    id: "outdoors", title: "Trips & Choices", items: [
      { id: "od1", say: "We are going on a class trip tomorrow.", options: ["Ngày mai chúng mình đi dã ngoại cùng lớp.", "Hôm qua chúng mình đã đi dã ngoại.", "Chúng mình sẽ không đi dã ngoại."], answer: "Ngày mai chúng mình đi dã ngoại cùng lớp.", difficulty: "easy" },
      { id: "od2", say: "Let's take the ferry across the water.", options: ["Hãy đi phà qua bên kia mặt nước.", "Hãy đi bộ qua cây cầu.", "Hãy đi xe buýt đến trường."], answer: "Hãy đi phà qua bên kia mặt nước.", difficulty: "easy" },
      { id: "od3", say: "I can see a deer near the forest trail.", options: ["Mình thấy một con hươu gần lối mòn trong rừng.", "Mình thấy một con chó gần bãi biển.", "Mình thấy một con chim gần hồ nước."], answer: "Mình thấy một con hươu gần lối mòn trong rừng.", difficulty: "easy" },
      { id: "od4", say: "We should bring water because the hike is long.", options: ["Chúng mình nên mang nước vì quãng đi bộ dài.", "Chúng mình nên mang ô vì trời sắp mưa.", "Chúng mình nên mang đèn pin vì trời tối."], answer: "Chúng mình nên mang nước vì quãng đi bộ dài.", difficulty: "medium" },
      { id: "od5", say: "The museum trip costs less than the boat trip.", options: ["Chuyến đi bảo tàng ít tốn kém hơn chuyến đi thuyền.", "Chuyến đi bảo tàng tốn kém hơn chuyến đi thuyền.", "Chuyến đi thuyền dài hơn chuyến đi bảo tàng."], answer: "Chuyến đi bảo tàng ít tốn kém hơn chuyến đi thuyền.", difficulty: "medium" },
      { id: "od6", say: "Most of the class voted for the nature trip.", options: ["Phần lớn cả lớp bỏ phiếu cho chuyến đi thiên nhiên.", "Phần lớn cả lớp bỏ phiếu cho chuyến đi bảo tàng.", "Không ai bỏ phiếu cho chuyến đi nào cả."], answer: "Phần lớn cả lớp bỏ phiếu cho chuyến đi thiên nhiên.", difficulty: "medium" },
      { id: "od7", say: "If it rains, we will visit the museum instead.", options: ["Nếu trời mưa, chúng mình sẽ đi bảo tàng thay thế.", "Vì trời mưa, chúng mình đã huỷ chuyến đi.", "Nếu trời nắng, chúng mình sẽ ở nhà."], answer: "Nếu trời mưa, chúng mình sẽ đi bảo tàng thay thế.", difficulty: "hard" },
      { id: "od8", say: "We chose the trail because it is close and cheap.", options: ["Chúng mình chọn lối mòn vì nó gần và rẻ.", "Chúng mình chọn chiếc thuyền vì nó nhanh và đắt.", "Chúng mình chọn bảo tàng vì nó xa và đẹp."], answer: "Chúng mình chọn lối mòn vì nó gần và rẻ.", difficulty: "hard" },
    ],
  },
];
export const listenSetById = (id: string) => LISTEN_SETS.find((s) => s.id === id);
