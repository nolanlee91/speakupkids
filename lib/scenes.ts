// Ngân hàng cảnh cho Picture Detective & Picture Talk (chơi tự do, bốc ngẫu nhiên, chơi lại không lặp).
// Mỗi cảnh có nhiều câu; nội dung viết khớp đúng chi tiết trong ảnh.
// Ảnh do codex tạo; emoji chỉ là fallback nếu thiếu ảnh.
import type { TalkScene } from "./games";

export type SceneQKind = "observe" | "locate" | "compare" | "infer" | "sequence";
export type SceneQ = {
  id: string; kind: SceneQKind;
  q: string; vi: string;
  options: string[]; answer: string; explainVi?: string;
};
export type DetectiveScene = {
  id: string; title: string; vi: string; image: string; emojis: string[];
  questions: SceneQ[];
};

const IMG = "/assets/images/gen/";

export const DETECTIVE_SCENES: DetectiveScene[] = [
  {
    id: "park", title: "At the Park", vi: "Ở công viên", image: IMG + "scene-park.webp",
    emojis: ["🌳", "☀️", "🐕", "🐦", "⚽", "🧒", "👧", "🌷", "🪑", "🦋"],
    questions: [
      { id: "pk1", kind: "observe", q: "What is the weather like?", vi: "Thời tiết thế nào?", options: ["It is sunny.", "It is rainy.", "It is snowy."], answer: "It is sunny." },
      { id: "pk2", kind: "observe", q: "How many children are playing?", vi: "Có mấy bạn nhỏ đang chơi?", options: ["One", "Two", "Three"], answer: "Two" },
      { id: "pk3", kind: "compare", q: "Which animal is flying?", vi: "Con vật nào đang bay?", options: ["The dog", "The blue bird", "The cat"], answer: "The blue bird" },
      { id: "pk4", kind: "observe", q: "What is the boy playing with?", vi: "Cậu bé chơi với thứ gì?", options: ["A soccer ball", "A kite", "A book"], answer: "A soccer ball" },
      { id: "pk5", kind: "infer", q: "The dog is running toward the ball. What does it want to do?", vi: "Chú chó chạy về phía quả bóng. Nó muốn làm gì?", options: ["Sleep", "Chase the ball", "Eat lunch"], answer: "Chase the ball", explainVi: "Chó chạy theo bóng nghĩa là muốn đuổi bắt bóng." },
      { id: "pk6", kind: "infer", q: "The leaves are red and orange. What season is it?", vi: "Lá cây đỏ và cam. Đang là mùa nào?", options: ["Summer", "Autumn", "Winter"], answer: "Autumn", explainVi: "Lá phong đỏ là dấu hiệu của mùa thu." },
      { id: "pk7", kind: "locate", q: "What can you see far in the background?", vi: "Phía xa có gì?", options: ["A desert", "Mountains and a city", "A farm"], answer: "Mountains and a city" },
      { id: "pk8", kind: "sequence", q: "The children are smiling and running. What probably happened?", vi: "Các bạn cười và chạy. Có lẽ vừa xảy ra gì?", options: ["They got hurt", "They started a fun game", "They went home"], answer: "They started a fun game", explainVi: "Vẻ mặt vui + đang chạy → các bạn vừa bắt đầu trò chơi." },
      { id: "pk9", kind: "infer", q: "Why are the children wearing light jackets?", vi: "Vì sao các bạn mặc áo khoác mỏng?", options: ["Because it is snowing", "Because it is cool but sunny", "Because it is very hot"], answer: "Because it is cool but sunny", explainVi: "Trời thu nắng nhẹ, hơi mát nên mặc áo khoác mỏng." },
      { id: "pk10", kind: "locate", q: "Where is the empty bench?", vi: "Cái ghế trống ở đâu?", options: ["On the left in the water", "On the right, near the tree", "Up in the sky"], answer: "On the right, near the tree" },
    ],
  },
  {
    id: "kitchen", title: "In the Kitchen", vi: "Trong bếp", image: IMG + "scene-kitchen.webp",
    emojis: ["🍎", "🍌", "🥕", "🥛", "🍞", "🧀", "🍳", "👩‍🍳", "🍽️", "🫖"],
    questions: [
      { id: "kt1", kind: "observe", q: "What is the cook making?", vi: "Người nấu đang làm món gì?", options: ["Soup", "A fried egg", "A cake"], answer: "A fried egg" },
      { id: "kt2", kind: "compare", q: "Which food is red?", vi: "Món nào màu đỏ?", options: ["The apple", "The bread", "The cheese"], answer: "The apple" },
      { id: "kt3", kind: "compare", q: "Which one is a vegetable, not a fruit?", vi: "Thứ nào là rau, không phải trái cây?", options: ["The apple", "The banana", "The carrot"], answer: "The carrot" },
      { id: "kt4", kind: "locate", q: "What is on the small plate?", vi: "Trên cái đĩa nhỏ có gì?", options: ["The bread", "The cheese", "The egg"], answer: "The cheese" },
      { id: "kt5", kind: "locate", q: "Where is the loaf of bread?", vi: "Ổ bánh mì ở đâu?", options: ["In the pan", "On a wooden board", "In the fridge"], answer: "On a wooden board" },
      { id: "kt6", kind: "observe", q: "What colour is the teapot?", vi: "Ấm trà màu gì?", options: ["Red", "Teal (blue-green)", "Yellow"], answer: "Teal (blue-green)" },
      { id: "kt7", kind: "infer", q: "The cook is holding a pan on the stove. What is she doing?", vi: "Người nấu cầm chảo trên bếp. Cô ấy đang làm gì?", options: ["Washing dishes", "Cooking breakfast", "Cleaning the floor"], answer: "Cooking breakfast", explainVi: "Cầm chảo trên bếp nóng nghĩa là đang nấu ăn." },
      { id: "kt8", kind: "infer", q: "There are bread, cheese and an egg. What meal are they making?", vi: "Có bánh mì, phô mai và trứng. Họ chuẩn bị bữa gì?", options: ["A birthday cake", "A breakfast", "A bowl of ice cream"], answer: "A breakfast", explainVi: "Bánh mì + phô mai + trứng là món ăn sáng quen thuộc." },
      { id: "kt9", kind: "locate", q: "Where is the red lamp?", vi: "Đèn đỏ ở đâu?", options: ["On the floor", "Hanging above the table", "Inside the pan"], answer: "Hanging above the table" },
      { id: "kt10", kind: "sequence", q: "The egg is in the pan and the stove is on. What happens next?", vi: "Trứng đang trong chảo, bếp đang bật. Tiếp theo sẽ thế nào?", options: ["The egg will be frozen", "The egg will be cooked", "The egg will be thrown away"], answer: "The egg will be cooked", explainVi: "Chảo nóng trên bếp → trứng sẽ chín." },
    ],
  },
  {
    id: "classroom", title: "In the Classroom", vi: "Trong lớp học", image: IMG + "scene-classroom.webp",
    emojis: ["🧑‍🏫", "🗺️", "📖", "✋", "🌋", "🎒", "✈️", "🕐", "🌍", "🪴"],
    questions: [
      { id: "cl1", kind: "observe", q: "What is the teacher pointing at?", vi: "Cô giáo đang chỉ vào gì?", options: ["The clock", "The world map", "The window"], answer: "The world map" },
      { id: "cl2", kind: "observe", q: "What is the boy in the red hoodie doing?", vi: "Cậu bé áo hoodie đỏ đang làm gì?", options: ["Reading a book", "Sleeping", "Drawing"], answer: "Reading a book" },
      { id: "cl3", kind: "observe", q: "What experiment are two students doing?", vi: "Hai bạn đang làm thí nghiệm gì?", options: ["A volcano", "A rainbow", "A robot"], answer: "A volcano" },
      { id: "cl4", kind: "locate", q: "Where is the paper airplane?", vi: "Chiếc máy bay giấy ở đâu?", options: ["On the shelf", "On the floor", "In a backpack"], answer: "On the floor" },
      { id: "cl5", kind: "locate", q: "What is on the windowsill?", vi: "Trên bệ cửa sổ có gì?", options: ["A red water bottle", "A globe", "A cake"], answer: "A red water bottle" },
      { id: "cl6", kind: "compare", q: "Who has a hand raised?", vi: "Ai đang giơ tay?", options: ["The teacher", "The girl in the teal jacket", "The boy reading"], answer: "The girl in the teal jacket" },
      { id: "cl7", kind: "infer", q: "One boy is looking under a desk. What is he probably doing?", vi: "Một cậu bé nhìn xuống gầm bàn. Có lẽ đang làm gì?", options: ["Taking a nap", "Looking for something he dropped", "Fixing the desk"], answer: "Looking for something he dropped", explainVi: "Cúi nhìn gầm bàn thường là đang tìm đồ bị rơi." },
      { id: "cl8", kind: "infer", q: "The girl is raising her hand. What does she probably want?", vi: "Bạn nữ giơ tay. Bạn ấy có lẽ muốn gì?", options: ["To leave the room", "To answer or ask something", "To sleep"], answer: "To answer or ask something", explainVi: "Giơ tay trong lớp thường để phát biểu hoặc hỏi bài." },
      { id: "cl9", kind: "observe", q: "What can you see through the window?", vi: "Nhìn qua cửa sổ thấy gì?", options: ["A beach", "Mountains and the city", "A forest"], answer: "Mountains and the city" },
      { id: "cl10", kind: "sequence", q: "A backpack is open on the floor. What probably happened before?", vi: "Balô mở trên sàn. Có lẽ trước đó đã xảy ra gì?", options: ["It was always closed", "Someone took something out of it", "It is brand new"], answer: "Someone took something out of it", explainVi: "Balô mở → ai đó vừa lấy đồ ra khỏi nó." },
    ],
  },
  {
    id: "supermarket", title: "At the Supermarket", vi: "Ở siêu thị", image: IMG + "scene-supermarket.webp",
    emojis: ["🛒", "🍎", "🍌", "🍊", "🥖", "🥛", "🧀", "📝", "☂️", "🧓"],
    questions: [
      { id: "sm1", kind: "observe", q: "What is the boy pushing?", vi: "Cậu bé đang đẩy gì?", options: ["A shopping cart", "A bike", "A stroller"], answer: "A shopping cart" },
      { id: "sm2", kind: "observe", q: "What is the boy holding in his hand?", vi: "Trên tay cậu bé cầm gì?", options: ["A phone", "A shopping list", "A ticket"], answer: "A shopping list" },
      { id: "sm3", kind: "compare", q: "Which fruit is the girl reaching for?", vi: "Bạn nữ đang với lấy trái cây nào?", options: ["Red apples", "Green apples", "Oranges"], answer: "Green apples" },
      { id: "sm4", kind: "infer", q: "The woman is holding two cereal boxes. What is she doing?", vi: "Người phụ nữ cầm hai hộp ngũ cốc. Cô ấy đang làm gì?", options: ["Juggling them", "Comparing them to choose one", "Hiding them"], answer: "Comparing them to choose one", explainVi: "Cầm hai hộp cùng lúc thường để so sánh và chọn." },
      { id: "sm5", kind: "locate", q: "What has spilled on the floor?", vi: "Thứ gì đã đổ ra sàn?", options: ["A box of cereal", "The old woman's shopping bag", "A bottle of milk"], answer: "The old woman's shopping bag" },
      { id: "sm6", kind: "sequence", q: "The old woman looks surprised and her bag is on the floor. What just happened?", vi: "Bà cụ ngạc nhiên, túi nằm dưới sàn. Vừa xảy ra chuyện gì?", options: ["She found money", "Her bag tipped over and spilled", "She won a prize"], answer: "Her bag tipped over and spilled", explainVi: "Túi đổ + đồ rơi ra + vẻ mặt bất ngờ → túi vừa bị đổ." },
      { id: "sm7", kind: "locate", q: "What is rolling on the floor?", vi: "Vật gì đang lăn trên sàn?", options: ["An orange", "An apple", "A ball"], answer: "An orange", explainVi: "Quả cam từ túi đổ ra và đang lăn đi." },
      { id: "sm8", kind: "infer", q: "Someone left a blue umbrella by the door. What was the weather probably like?", vi: "Có người để quên chiếc ô xanh cạnh cửa. Thời tiết có lẽ thế nào?", options: ["It was sunny", "It was rainy", "It was snowy"], answer: "It was rainy", explainVi: "Mang ô đi thường vì trời mưa." },
      { id: "sm9", kind: "observe", q: "Who is working at the checkout?", vi: "Ai đang làm ở quầy thu ngân?", options: ["A cashier", "A doctor", "A teacher"], answer: "A cashier" },
      { id: "sm10", kind: "sequence", q: "The boy's cart is full and he is near the checkout. What will he do next?", vi: "Xe đẩy đầy đồ, cậu bé gần quầy tính tiền. Tiếp theo sẽ làm gì?", options: ["Put everything back", "Pay for the food", "Leave with an empty cart"], answer: "Pay for the food", explainVi: "Xe đầy + gần quầy → bước tiếp theo là thanh toán." },
    ],
  },
  {
    id: "busstop", title: "A Rainy Bus Stop", vi: "Trạm xe buýt ngày mưa", image: IMG + "scene-bus-stop-rain.webp",
    emojis: ["🌧️", "🚌", "☂️", "🎒", "🎫", "👟", "🍁", "⌚", "🧥", "🏔️"],
    questions: [
      { id: "bs1", kind: "observe", q: "What is the weather like?", vi: "Thời tiết thế nào?", options: ["It is sunny", "It is rainy", "It is snowy"], answer: "It is rainy" },
      { id: "bs2", kind: "observe", q: "What is the man looking at?", vi: "Người đàn ông đang nhìn gì?", options: ["His watch", "His phone", "A book"], answer: "His watch" },
      { id: "bs3", kind: "infer", q: "The man is checking his watch and a bus is coming. What is he worried about?", vi: "Chú xem đồng hồ, xe buýt đang tới. Chú lo điều gì?", options: ["The colour of the rain", "Being on time", "His shoes"], answer: "Being on time", explainVi: "Xem giờ + xe sắp đến → lo về việc kịp giờ." },
      { id: "bs4", kind: "locate", q: "What was left on the bench?", vi: "Thứ gì bị bỏ quên trên ghế?", options: ["A backpack", "An umbrella", "A dog"], answer: "A backpack" },
      { id: "bs5", kind: "locate", q: "What is dropped on the wet ground?", vi: "Vật gì rơi trên nền đất ướt?", options: ["A bus ticket", "A phone", "A key"], answer: "A bus ticket" },
      { id: "bs6", kind: "infer", q: "The boy is running and his shoelace is untied. What might happen?", vi: "Cậu bé chạy, dây giày tuột. Điều gì có thể xảy ra?", options: ["He could fly", "He could trip and fall", "Nothing at all"], answer: "He could trip and fall", explainVi: "Chạy khi dây giày tuột dễ bị vấp ngã." },
      { id: "bs7", kind: "compare", q: "Who is holding an open umbrella?", vi: "Ai đang cầm ô đã mở?", options: ["The girl", "The man", "The old woman"], answer: "The old woman", explainVi: "Ô của bạn nữ đang gập lại; bà cụ mới là người mở ô." },
      { id: "bs8", kind: "observe", q: "What colour is the old woman's umbrella?", vi: "Ô của bà cụ màu gì?", options: ["Red", "Yellow", "Blue"], answer: "Yellow" },
      { id: "bs9", kind: "sequence", q: "The bus is coming and the backpack is still on the bench. What should someone do?", vi: "Xe tới mà balô còn trên ghế. Nên làm gì?", options: ["Ignore it", "Grab the backpack before the bus leaves", "Throw it away"], answer: "Grab the backpack before the bus leaves", explainVi: "Sắp lên xe → phải lấy balô kẻo bỏ quên." },
      { id: "bs10", kind: "infer", q: "It is raining and the leaves are red. What season is it?", vi: "Trời mưa, lá đỏ. Đang là mùa nào?", options: ["Spring", "Autumn", "Summer"], answer: "Autumn", explainVi: "Lá phong đỏ + mưa lạnh là đặc trưng mùa thu." },
    ],
  },
  {
    id: "library", title: "At the Library", vi: "Ở thư viện", image: IMG + "scene-library.webp",
    emojis: ["📚", "🪜", "🔖", "👓", "🧣", "🎒", "🪑", "🧑‍🏫", "🏙️", "📖"],
    questions: [
      { id: "lb1", kind: "observe", q: "Where are the two children reading?", vi: "Hai bạn đang đọc sách ở đâu?", options: ["On the floor", "At a table", "On the stairs"], answer: "At a table" },
      { id: "lb2", kind: "locate", q: "What is the girl standing on to reach the shelf?", vi: "Bạn nữ đứng lên vật gì để với kệ sách?", options: ["A chair", "A wooden stool", "A box"], answer: "A wooden stool" },
      { id: "lb3", kind: "observe", q: "What is the librarian pushing?", vi: "Cô thủ thư đang đẩy gì?", options: ["A book cart", "A shopping cart", "A stroller"], answer: "A book cart" },
      { id: "lb4", kind: "compare", q: "Which child is reading a pink book?", vi: "Bạn nào đang đọc quyển sách màu hồng?", options: ["The boy in green", "The girl in the yellow sweater", "The girl on the stool"], answer: "The girl in the yellow sweater" },
      { id: "lb5", kind: "locate", q: "What was left on the small side table?", vi: "Trên chiếc bàn nhỏ có gì được để lại?", options: ["A mug and glasses", "A laptop", "A ball"], answer: "A mug and glasses" },
      { id: "lb6", kind: "locate", q: "What is under the table?", vi: "Dưới gầm bàn có gì?", options: ["A backpack", "A dog", "A bike"], answer: "A backpack" },
      { id: "lb7", kind: "infer", q: "A trail of bookmarks lies on the floor. What could the children follow?", vi: "Một chuỗi bookmark rơi trên sàn. Các bạn có thể lần theo cái gì?", options: ["The lights", "The bookmarks, like a clue trail", "The windows"], answer: "The bookmarks, like a clue trail", explainVi: "Dãy bookmark nối nhau như một dấu vết để lần theo." },
      { id: "lb8", kind: "infer", q: "There is an open book on the armchair. What probably happened?", vi: "Có một cuốn sách mở trên ghế bành. Có lẽ đã xảy ra gì?", options: ["It fell from the sky", "Someone was reading and left it", "It is a decoration"], answer: "Someone was reading and left it", explainVi: "Sách mở trên ghế → ai đó vừa đọc rồi rời đi." },
      { id: "lb9", kind: "observe", q: "What can you see through the big window?", vi: "Nhìn qua cửa sổ lớn thấy gì?", options: ["Only the ocean", "Mountains and the city", "A playground"], answer: "Mountains and the city" },
      { id: "lb10", kind: "sequence", q: "The girl is reaching up high on the shelf. What is she trying to do?", vi: "Bạn nữ với lên cao trên kệ. Bạn ấy đang cố làm gì?", options: ["Hide", "Take a book from a high shelf", "Clean the window"], answer: "Take a book from a high shelf", explainVi: "Với tay lên kệ cao là để lấy một cuốn sách." },
    ],
  },
];

export const detectiveSceneById = (id: string) => DETECTIVE_SCENES.find((s) => s.id === id);
// Chọn 1 cảnh ngẫu nhiên (gọi lúc runtime phía client)
export function randomDetectiveScene(exceptId?: string): DetectiveScene {
  const pool = exceptId ? DETECTIVE_SCENES.filter((s) => s.id !== exceptId) : DETECTIVE_SCENES;
  const list = pool.length ? pool : DETECTIVE_SCENES;
  return list[Math.floor(Math.random() * list.length)];
}

/* ============ Picture Talk — dùng chung 6 ảnh, mỗi cảnh 8 prompt (nói) ============ */
export const TALK_SCENES: TalkScene[] = [
  {
    id: "park", title: "Talk about the Park", vi: "Nói về công viên", image: IMG + "scene-park.webp",
    emojis: ["🌳", "🐕", "⚽", "🧒", "👧", "🌷", "🪑", "🍁"], assetNote: "",
    intro: "Look at the park. Say each sentence out loud, then answer!",
    prompts: [
      { en: "I can see two children running in the park.", vi: "Mình thấy hai bạn nhỏ chạy trong công viên." },
      { en: "There is a dog chasing a ball.", vi: "Có một chú chó đang đuổi theo quả bóng." },
      { en: "The trees have red and orange leaves.", vi: "Cây có lá đỏ và cam." },
      { en: "It is a warm, sunny autumn day.", vi: "Trời thu ấm áp và nắng đẹp." },
      { en: "What are the children doing?", vi: "Các bạn nhỏ đang làm gì?" },
      { en: "How do you think they feel? Why?", vi: "Bạn nghĩ họ cảm thấy thế nào? Vì sao?" },
      { en: "What can you see far in the background?", vi: "Phía xa bạn thấy gì?" },
      { en: "Describe the park in three sentences.", vi: "Mô tả công viên trong ba câu." },
    ],
  },
  {
    id: "kitchen", title: "Talk about the Kitchen", vi: "Nói về nhà bếp", image: IMG + "scene-kitchen.webp",
    emojis: ["🍳", "🍎", "🍌", "🥛", "🍞", "🧀", "🥕", "🫖"], assetNote: "",
    intro: "Look at the kitchen. Say and answer out loud!",
    prompts: [
      { en: "The cook is making a fried egg.", vi: "Người nấu đang chiên trứng." },
      { en: "There are apples, bananas and bread on the table.", vi: "Trên bàn có táo, chuối và bánh mì." },
      { en: "I can see a blue teapot on the stove.", vi: "Mình thấy một ấm trà xanh trên bếp." },
      { en: "The kitchen is warm and full of food.", vi: "Nhà bếp ấm cúng và đầy đồ ăn." },
      { en: "What food can you see on the table?", vi: "Trên bàn có những món ăn nào?" },
      { en: "What is the cook doing?", vi: "Người nấu đang làm gì?" },
      { en: "Which foods are healthy? Why?", vi: "Món nào tốt cho sức khoẻ? Vì sao?" },
      { en: "Describe the kitchen in three sentences.", vi: "Mô tả nhà bếp trong ba câu." },
    ],
  },
  {
    id: "classroom", title: "Talk about the Classroom", vi: "Nói về lớp học", image: IMG + "scene-classroom.webp",
    emojis: ["🧑‍🏫", "🗺️", "📖", "✋", "🌋", "🎒", "🕐", "🪴"], assetNote: "",
    intro: "Look at the classroom. Say and answer out loud!",
    prompts: [
      { en: "The teacher is pointing at the world map.", vi: "Cô giáo đang chỉ vào bản đồ thế giới." },
      { en: "One boy is reading a book at his desk.", vi: "Một cậu bé đang đọc sách ở bàn." },
      { en: "Two students are doing a volcano experiment.", vi: "Hai bạn đang làm thí nghiệm núi lửa." },
      { en: "The classroom is busy and fun.", vi: "Lớp học nhộn nhịp và vui." },
      { en: "What is happening in the classroom?", vi: "Trong lớp đang xảy ra chuyện gì?" },
      { en: "Why do you think the girl is raising her hand?", vi: "Vì sao bạn nữ giơ tay?" },
      { en: "What is the boy under the desk looking for?", vi: "Cậu bé dưới gầm bàn đang tìm gì?" },
      { en: "Describe the classroom in three sentences.", vi: "Mô tả lớp học trong ba câu." },
    ],
  },
  {
    id: "supermarket", title: "Talk about the Supermarket", vi: "Nói về siêu thị", image: IMG + "scene-supermarket.webp",
    emojis: ["🛒", "🍎", "🍌", "🍊", "🥖", "🥛", "📝", "☂️"], assetNote: "",
    intro: "Look at the supermarket. Say and answer out loud!",
    prompts: [
      { en: "A boy is pushing a shopping cart full of food.", vi: "Một cậu bé đẩy xe đầy đồ ăn." },
      { en: "There are apples, bananas and oranges in the boxes.", vi: "Trong các thùng có táo, chuối và cam." },
      { en: "An old woman's shopping bag has spilled on the floor.", vi: "Túi hàng của bà cụ đổ ra sàn." },
      { en: "The supermarket is busy today.", vi: "Hôm nay siêu thị đông." },
      { en: "What is the woman with the cereal boxes doing?", vi: "Người phụ nữ cầm hộp ngũ cốc đang làm gì?" },
      { en: "What just happened to the old woman's bag?", vi: "Túi của bà cụ vừa xảy ra chuyện gì?" },
      { en: "What should the boy do at the checkout?", vi: "Ở quầy tính tiền, cậu bé nên làm gì?" },
      { en: "Describe the supermarket in three sentences.", vi: "Mô tả siêu thị trong ba câu." },
    ],
  },
  {
    id: "busstop", title: "Talk about the Bus Stop", vi: "Nói về trạm xe buýt", image: IMG + "scene-bus-stop-rain.webp",
    emojis: ["🌧️", "🚌", "☂️", "🎒", "🎫", "👟", "🍁", "⌚"], assetNote: "",
    intro: "Look at the rainy bus stop. Say and answer out loud!",
    prompts: [
      { en: "It is a rainy day at the bus stop.", vi: "Một ngày mưa ở trạm xe buýt." },
      { en: "A man is looking at his watch.", vi: "Một người đàn ông đang xem đồng hồ." },
      { en: "A boy is running, and his shoelace is untied.", vi: "Một cậu bé đang chạy, dây giày bị tuột." },
      { en: "The blue bus is coming to the stop.", vi: "Chiếc xe buýt xanh đang tới trạm." },
      { en: "What is the weather like? How do you know?", vi: "Thời tiết thế nào? Làm sao bạn biết?" },
      { en: "Why is the man checking his watch?", vi: "Vì sao chú ấy xem đồng hồ?" },
      { en: "What might happen to the running boy? Why?", vi: "Điều gì có thể xảy ra với cậu bé đang chạy? Vì sao?" },
      { en: "Describe the scene in three sentences.", vi: "Mô tả cảnh này trong ba câu." },
    ],
  },
  {
    id: "library", title: "Talk about the Library", vi: "Nói về thư viện", image: IMG + "scene-library.webp",
    emojis: ["📚", "🪜", "🔖", "👓", "🧣", "🎒", "🪑", "🏙️"], assetNote: "",
    intro: "Look at the library. Say and answer out loud!",
    prompts: [
      { en: "Two children are reading books at a table.", vi: "Hai bạn đang đọc sách ở bàn." },
      { en: "A girl is standing on a stool to reach a high shelf.", vi: "Một bạn nữ đứng lên ghế đẩu để với kệ cao." },
      { en: "The librarian is pushing a book cart.", vi: "Cô thủ thư đang đẩy xe sách." },
      { en: "The library is calm and quiet.", vi: "Thư viện yên tĩnh và êm đềm." },
      { en: "What are the children doing in the library?", vi: "Các bạn đang làm gì trong thư viện?" },
      { en: "What could the trail of bookmarks lead to?", vi: "Chuỗi bookmark có thể dẫn đến đâu?" },
      { en: "Why is there an open book on the armchair?", vi: "Vì sao có cuốn sách mở trên ghế bành?" },
      { en: "Describe the library in three sentences.", vi: "Mô tả thư viện trong ba câu." },
    ],
  },
];
export const talkSceneById = (id: string) => TALK_SCENES.find((s) => s.id === id);
export function randomTalkScene(): TalkScene {
  return TALK_SCENES[Math.floor(Math.random() * TALK_SCENES.length)];
}
