// Ngân hàng nội dung chữ cho Sentence Puzzle & English Riddles.
// Mỗi game có nhiều bộ; một lượt chơi bốc ngẫu nhiên 1 bộ + N câu chưa gặp.
import type { PuzzleSet, RiddleSet } from "./games";

/* ================= SENTENCE PUZZLE — 6 chủ đề ================= */
export const PUZZLE_SETS: PuzzleSet[] = [
  {
    id: "daily", title: "Daily Life", items: [
      { id: "d1", solution: ["I", "usually", "pack", "my", "bag", "before", "breakfast"], vi: "Mình thường soạn cặp trước bữa sáng.", difficulty: "medium" },
      { id: "d2", solution: ["She", "walks", "to", "school", "unless", "it", "is", "raining"], vi: "Bạn ấy đi bộ đến trường trừ khi trời mưa.", difficulty: "hard" },
      { id: "d3", solution: ["We", "take", "turns", "setting", "the", "table", "for", "dinner"], vi: "Chúng mình thay phiên nhau dọn bàn ăn tối.", difficulty: "hard" },
      { id: "d4", solution: ["He", "finishes", "his", "homework", "before", "playing", "online"], vi: "Cậu ấy làm xong bài trước khi chơi trực tuyến.", difficulty: "medium" },
      { id: "d5", solution: ["They", "have", "already", "cleaned", "their", "shared", "room"], vi: "Họ đã dọn xong căn phòng chung.", difficulty: "medium" },
      { id: "d6", solution: ["I", "forgot", "to", "charge", "my", "tablet", "last", "night"], vi: "Tối qua mình quên sạc máy tính bảng.", difficulty: "hard" },
      { id: "d7", solution: ["We", "should", "leave", "early", "to", "avoid", "the", "traffic"], vi: "Chúng mình nên đi sớm để tránh kẹt xe.", difficulty: "hard" },
      { id: "d8", solution: ["I", "go", "to", "bed", "early", "on", "school", "nights"], vi: "Mình đi ngủ sớm vào những tối trước ngày học.", difficulty: "easy" },
    ],
  },
  {
    id: "school", title: "School", items: [
      { id: "s1", solution: ["The", "teacher", "asked", "us", "to", "explain", "our", "answers"], vi: "Giáo viên yêu cầu chúng mình giải thích đáp án.", difficulty: "hard" },
      { id: "s2", solution: ["I", "raised", "my", "hand", "because", "I", "had", "an", "idea"], vi: "Mình giơ tay vì có một ý tưởng.", difficulty: "hard" },
      { id: "s3", solution: ["We", "are", "preparing", "a", "presentation", "about", "ocean", "life"], vi: "Chúng mình đang chuẩn bị bài thuyết trình về sinh vật biển.", difficulty: "medium" },
      { id: "s4", solution: ["Her", "diagram", "is", "clearer", "than", "the", "first", "version"], vi: "Sơ đồ của bạn ấy rõ hơn phiên bản đầu.", difficulty: "hard" },
      { id: "s5", solution: ["He", "borrowed", "a", "book", "from", "the", "school", "library"], vi: "Cậu ấy mượn sách từ thư viện trường.", difficulty: "medium" },
      { id: "s6", solution: ["The", "students", "worked", "together", "to", "solve", "the", "problem"], vi: "Các bạn học sinh cùng nhau giải quyết vấn đề.", difficulty: "medium" },
      { id: "s7", solution: ["I", "forgot", "my", "notes", "but", "remembered", "the", "main", "idea"], vi: "Mình quên ghi chú nhưng vẫn nhớ ý chính.", difficulty: "hard" },
      { id: "s8", solution: ["We", "check", "our", "work", "before", "submitting", "it"], vi: "Chúng mình kiểm tra bài trước khi nộp.", difficulty: "easy" },
    ],
  },
  {
    id: "food", title: "Food & Cooking", items: [
      { id: "f1", solution: ["This", "soup", "tastes", "better", "with", "a", "little", "pepper"], vi: "Món súp này ngon hơn khi thêm một chút tiêu.", difficulty: "medium" },
      { id: "f2", solution: ["She", "is", "following", "a", "recipe", "from", "her", "grandmother"], vi: "Bạn ấy đang làm theo công thức của bà.", difficulty: "medium" },
      { id: "f3", solution: ["We", "bought", "fresh", "bread", "because", "the", "bakery", "was", "open"], vi: "Chúng mình mua bánh mì tươi vì tiệm bánh đang mở.", difficulty: "hard" },
      { id: "f4", solution: ["He", "would", "rather", "drink", "water", "than", "a", "sugary", "soda"], vi: "Cậu ấy thích uống nước hơn nước ngọt có đường.", difficulty: "hard" },
      { id: "f5", solution: ["The", "pancakes", "will", "burn", "if", "you", "forget", "to", "flip", "them"], vi: "Bánh sẽ cháy nếu bạn quên lật.", difficulty: "hard" },
      { id: "f6", solution: ["I", "have", "never", "tried", "this", "kind", "of", "fruit"], vi: "Mình chưa từng thử loại trái cây này.", difficulty: "medium" },
      { id: "f7", solution: ["They", "shared", "the", "last", "slice", "of", "pizza"], vi: "Họ chia nhau miếng pizza cuối cùng.", difficulty: "easy" },
      { id: "f8", solution: ["Could", "you", "please", "pass", "me", "the", "cheese"], vi: "Bạn có thể chuyền phô mai cho mình được không?", difficulty: "easy" },
    ],
  },
  {
    id: "places", title: "Places & Travel", items: [
      { id: "p1", solution: ["We", "took", "the", "scenic", "route", "through", "the", "forest"], vi: "Chúng mình đi theo tuyến đường đẹp xuyên qua rừng.", difficulty: "medium" },
      { id: "p2", solution: ["The", "bus", "was", "late", "because", "of", "the", "heavy", "traffic"], vi: "Xe buýt đến muộn vì giao thông đông.", difficulty: "hard" },
      { id: "p3", solution: ["I", "have", "been", "waiting", "at", "the", "stop", "for", "ten", "minutes"], vi: "Mình đã đợi ở trạm được mười phút.", difficulty: "hard" },
      { id: "p4", solution: ["She", "found", "the", "information", "in", "a", "travel", "guide"], vi: "Bạn ấy tìm thấy thông tin trong sách hướng dẫn du lịch.", difficulty: "medium" },
      { id: "p5", solution: ["We", "should", "check", "the", "map", "before", "choosing", "a", "route"], vi: "Chúng mình nên xem bản đồ trước khi chọn đường.", difficulty: "hard" },
      { id: "p6", solution: ["The", "train", "leaves", "at", "noon", "from", "platform", "four"], vi: "Tàu rời ga lúc trưa từ sân ga số bốn.", difficulty: "medium" },
      { id: "p7", solution: ["The", "museum", "is", "within", "walking", "distance", "of", "the", "station"], vi: "Bảo tàng nằm trong khoảng cách có thể đi bộ từ nhà ga.", difficulty: "hard" },
      { id: "p8", solution: ["Turn", "left", "after", "you", "cross", "the", "bridge"], vi: "Rẽ trái sau khi bạn đi qua cầu.", difficulty: "easy" },
    ],
  },
  {
    id: "feelings", title: "Feelings", items: [
      { id: "e1", solution: ["I", "felt", "relieved", "when", "we", "finally", "solved", "the", "problem"], vi: "Mình thấy nhẹ nhõm khi cuối cùng chúng mình giải được vấn đề.", difficulty: "hard" },
      { id: "e2", solution: ["She", "was", "disappointed", "but", "decided", "to", "try", "again"], vi: "Bạn ấy thất vọng nhưng quyết định thử lại.", difficulty: "hard" },
      { id: "e3", solution: ["He", "is", "excited", "about", "presenting", "his", "new", "invention"], vi: "Cậu ấy hào hứng về việc trình bày phát minh mới.", difficulty: "medium" },
      { id: "e4", solution: ["We", "are", "proud", "of", "how", "much", "you", "have", "improved"], vi: "Chúng mình tự hào vì bạn đã tiến bộ rất nhiều.", difficulty: "hard" },
      { id: "e5", solution: ["It", "is", "normal", "to", "feel", "nervous", "before", "a", "performance"], vi: "Cảm thấy hồi hộp trước buổi biểu diễn là bình thường.", difficulty: "medium" },
      { id: "e6", solution: ["I", "feel", "calmer", "after", "talking", "to", "a", "friend"], vi: "Mình bình tĩnh hơn sau khi nói chuyện với một người bạn.", difficulty: "medium" },
      { id: "e7", solution: ["They", "were", "surprised", "by", "the", "unexpected", "result"], vi: "Họ bất ngờ trước kết quả ngoài dự đoán.", difficulty: "easy" },
      { id: "e8", solution: ["He", "seemed", "confident", "even", "though", "he", "was", "worried"], vi: "Cậu ấy trông tự tin dù đang lo lắng.", difficulty: "hard" },
    ],
  },
  {
    id: "past", title: "Past Events", items: [
      { id: "t1", solution: ["We", "were", "walking", "home", "when", "the", "storm", "began"], vi: "Chúng mình đang đi bộ về nhà thì cơn bão bắt đầu.", difficulty: "hard" },
      { id: "t2", solution: ["She", "found", "her", "ticket", "after", "searching", "every", "pocket"], vi: "Bạn ấy tìm thấy vé sau khi lục mọi túi áo.", difficulty: "medium" },
      { id: "t3", solution: ["He", "had", "already", "left", "when", "I", "called", "him"], vi: "Cậu ấy đã rời đi khi mình gọi.", difficulty: "hard" },
      { id: "t4", solution: ["I", "visited", "my", "grandmother", "during", "the", "winter", "break"], vi: "Mình đã thăm bà trong kỳ nghỉ đông.", difficulty: "easy" },
      { id: "t5", solution: ["They", "missed", "the", "bus", "because", "they", "left", "late"], vi: "Họ lỡ xe buýt vì rời đi muộn.", difficulty: "medium" },
      { id: "t6", solution: ["We", "had", "never", "seen", "such", "a", "bright", "rainbow"], vi: "Chúng mình chưa từng thấy cầu vồng rực rỡ đến vậy.", difficulty: "hard" },
      { id: "t7", solution: ["The", "dog", "returned", "the", "ball", "after", "chasing", "it"], vi: "Chú chó mang bóng về sau khi đuổi theo.", difficulty: "medium" },
      { id: "t8", solution: ["She", "realized", "that", "her", "backpack", "was", "still", "at", "school"], vi: "Bạn ấy nhận ra balô vẫn còn ở trường.", difficulty: "hard" },
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
