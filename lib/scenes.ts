// Ngân hàng cảnh cho Picture Detective & Picture Talk (chơi tự do, bốc ngẫu nhiên, chơi lại không lặp).
// Mỗi cảnh có nhiều câu; nội dung viết khớp đúng chi tiết trong ảnh.
// Ảnh do codex tạo; emoji chỉ là fallback nếu thiếu ảnh.

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

/* ============ Picture Talk — thử thách mô tả tranh CÓ ĐÁP ÁN (máy chấm được) ============ */
// Không thu âm. Bé chọn/xếp câu mô tả đúng bức tranh → chấm điểm thật.
// "say" = câu mô tả hoàn chỉnh để nói theo Maple (bước phụ, KHÔNG tính điểm).
export type TalkTaskKind = "choose" | "spot" | "fill" | "position" | "arrange";
export type TalkTask = {
  id: string;
  kind: TalkTaskKind;
  vi: string;                 // hướng dẫn/nghĩa tiếng Việt
  q?: string;                 // choose/spot/position: câu hỏi · fill: câu có chỗ "___"
  options?: string[];         // choose/spot/fill/position
  answer?: string;            // đáp án đúng (mọi kind trừ arrange)
  solution?: string[];        // arrange: các từ theo đúng thứ tự
  say: string;                // câu mô tả hoàn chỉnh để nói theo (không tính điểm)
};
export type TalkScene = {
  id: string; title: string; vi: string; image: string; emojis: string[];
  intro: string; tasks: TalkTask[];
};

export const TALK_SCENES: TalkScene[] = [
  {
    id: "park", title: "Describe the Park", vi: "Mô tả công viên", image: IMG + "scene-park.webp",
    emojis: ["🌳", "🐕", "⚽", "🧒", "👧", "🌷", "🪑", "🍁"],
    intro: "Nhìn công viên. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tp1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The dog is chasing a ball.", "The dog is sleeping.", "The dog is eating dinner."], answer: "The dog is chasing a ball.", say: "The dog is chasing a ball." },
      { id: "tp2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["Two children are running.", "It is snowing in the park.", "The trees have red leaves."], answer: "It is snowing in the park.", say: "It is not snowing. It is a sunny autumn day." },
      { id: "tp3", kind: "fill", vi: "Điền từ đúng: Các bạn đang … trong công viên.", q: "The children are ___ in the park.", options: ["running", "sleeping", "swimming"], answer: "running", say: "The children are running in the park." },
      { id: "tp4", kind: "position", vi: "Cái ghế trống ở đâu?", q: "Where is the empty bench?", options: ["next to the tree", "under the water", "up in the sky"], answer: "next to the tree", say: "The empty bench is next to the tree." },
      { id: "tp5", kind: "arrange", vi: "Xếp câu: Chú chó đang đuổi theo quả bóng.", solution: ["The", "dog", "is", "chasing", "a", "ball"], say: "The dog is chasing a ball." },
      { id: "tp6", kind: "arrange", vi: "Xếp câu: Hai bạn nhỏ đang chạy.", solution: ["Two", "children", "are", "running"], say: "Two children are running." },
      { id: "tp7", kind: "fill", vi: "Điền màu: Lá cây màu đỏ và …", q: "The leaves are red and ___.", options: ["orange", "blue", "white"], answer: "orange", say: "The leaves are red and orange." },
    ],
  },
  {
    id: "kitchen", title: "Describe the Kitchen", vi: "Mô tả nhà bếp", image: IMG + "scene-kitchen.webp",
    emojis: ["🍳", "🍎", "🍌", "🥛", "🍞", "🧀", "🥕", "🫖"],
    intro: "Nhìn nhà bếp. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tk1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The cook is making a fried egg.", "The cook is washing a car.", "The cook is reading a book."], answer: "The cook is making a fried egg.", say: "The cook is making a fried egg." },
      { id: "tk2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["There are apples on the table.", "There is bread on the board.", "The cook is riding a bike."], answer: "The cook is riding a bike.", say: "The cook is cooking, not riding a bike." },
      { id: "tk3", kind: "fill", vi: "Điền từ: Người nấu đang … một quả trứng.", q: "The cook is ___ a fried egg.", options: ["making", "driving", "singing"], answer: "making", say: "The cook is making a fried egg." },
      { id: "tk4", kind: "position", vi: "Miếng phô mai ở đâu?", q: "Where is the cheese?", options: ["on the small plate", "under the floor", "inside the teapot"], answer: "on the small plate", say: "The cheese is on the small plate." },
      { id: "tk5", kind: "arrange", vi: "Xếp câu: Người nấu đang chiên một quả trứng.", solution: ["The", "cook", "is", "frying", "an", "egg"], say: "The cook is frying an egg." },
      { id: "tk6", kind: "arrange", vi: "Xếp câu: Mình thấy bánh mì tươi.", solution: ["I", "can", "see", "fresh", "bread"], say: "I can see fresh bread." },
      { id: "tk7", kind: "fill", vi: "Điền từ: Trên bàn có táo và …", q: "There are apples and ___ on the table.", options: ["bananas", "cars", "shoes"], answer: "bananas", say: "There are apples and bananas on the table." },
    ],
  },
  {
    id: "classroom", title: "Describe the Classroom", vi: "Mô tả lớp học", image: IMG + "scene-classroom.webp",
    emojis: ["🧑‍🏫", "🗺️", "📖", "✋", "🌋", "🎒", "🕐", "🪴"],
    intro: "Nhìn lớp học. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tc1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The teacher is pointing at the world map.", "The teacher is cooking dinner.", "The teacher is sleeping."], answer: "The teacher is pointing at the world map.", say: "The teacher is pointing at the world map." },
      { id: "tc2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A boy is reading a book.", "Two students do an experiment.", "A dog is teaching the class."], answer: "A dog is teaching the class.", say: "A teacher is teaching the class, not a dog." },
      { id: "tc3", kind: "fill", vi: "Điền từ: Bạn nữ đang … tay.", q: "The girl is ___ her hand.", options: ["raising", "eating", "washing"], answer: "raising", say: "The girl is raising her hand." },
      { id: "tc4", kind: "position", vi: "Chiếc máy bay giấy ở đâu?", q: "Where is the paper airplane?", options: ["on the floor", "on the moon", "in the water"], answer: "on the floor", say: "The paper airplane is on the floor." },
      { id: "tc5", kind: "arrange", vi: "Xếp câu: Cô giáo chỉ vào bản đồ.", solution: ["The", "teacher", "points", "at", "the", "map"], say: "The teacher points at the map." },
      { id: "tc6", kind: "arrange", vi: "Xếp câu: Hai bạn làm một thí nghiệm.", solution: ["Two", "students", "do", "an", "experiment"], say: "Two students do an experiment." },
      { id: "tc7", kind: "fill", vi: "Điền từ: Lớp học nhộn nhịp và …", q: "The classroom is busy and ___.", options: ["fun", "dark", "cold"], answer: "fun", say: "The classroom is busy and fun." },
    ],
  },
  {
    id: "supermarket", title: "Describe the Supermarket", vi: "Mô tả siêu thị", image: IMG + "scene-supermarket.webp",
    emojis: ["🛒", "🍎", "🍌", "🍊", "🥖", "🥛", "📝", "☂️"],
    intro: "Nhìn siêu thị. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "ts1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["A boy is pushing a shopping cart.", "A boy is flying a kite.", "A boy is swimming."], answer: "A boy is pushing a shopping cart.", say: "A boy is pushing a shopping cart." },
      { id: "ts2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A cashier is at the checkout.", "The old woman's bag spilled.", "An elephant is buying milk."], answer: "An elephant is buying milk.", say: "There is no elephant. People are shopping." },
      { id: "ts3", kind: "fill", vi: "Điền từ: Cậu bé cầm một … mua sắm.", q: "The boy is holding a shopping ___.", options: ["list", "cat", "car"], answer: "list", say: "The boy is holding a shopping list." },
      { id: "ts4", kind: "position", vi: "Chiếc ô xanh ở đâu?", q: "Where is the blue umbrella?", options: ["by the door", "in the sky", "under the sea"], answer: "by the door", say: "The blue umbrella is by the door." },
      { id: "ts5", kind: "arrange", vi: "Xếp câu: Một cậu bé đẩy xe hàng.", solution: ["A", "boy", "pushes", "a", "shopping", "cart"], say: "A boy pushes a shopping cart." },
      { id: "ts6", kind: "arrange", vi: "Xếp câu: Có táo và cam trong thùng.", solution: ["There", "are", "apples", "and", "oranges"], say: "There are apples and oranges." },
      { id: "ts7", kind: "fill", vi: "Điền từ: Bạn nữ với lấy táo màu …", q: "The girl is reaching for green ___.", options: ["apples", "cars", "books"], answer: "apples", say: "The girl is reaching for green apples." },
    ],
  },
  {
    id: "busstop", title: "Describe the Bus Stop", vi: "Mô tả trạm xe buýt", image: IMG + "scene-bus-stop-rain.webp",
    emojis: ["🌧️", "🚌", "☂️", "🎒", "🎫", "👟", "🍁", "⌚"],
    intro: "Nhìn trạm xe buýt ngày mưa. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tb1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["It is a rainy day.", "It is a hot sunny day.", "It is a snowy night."], answer: "It is a rainy day.", say: "It is a rainy day at the bus stop." },
      { id: "tb2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A man is checking his watch.", "A blue bus is coming.", "A lion is driving the bus."], answer: "A lion is driving the bus.", say: "A driver is on the bus, not a lion." },
      { id: "tb3", kind: "fill", vi: "Điền từ: Cậu bé đang … để kịp xe buýt.", q: "The boy is ___ to catch the bus.", options: ["running", "sleeping", "cooking"], answer: "running", say: "The boy is running to catch the bus." },
      { id: "tb4", kind: "position", vi: "Chiếc balô ở đâu?", q: "Where is the backpack?", options: ["on the bench", "in the bus", "on the roof"], answer: "on the bench", say: "The backpack is on the bench." },
      { id: "tb5", kind: "arrange", vi: "Xếp câu: Một chú đang xem đồng hồ.", solution: ["A", "man", "checks", "his", "watch"], say: "A man checks his watch." },
      { id: "tb6", kind: "arrange", vi: "Xếp câu: Xe buýt xanh đang tới.", solution: ["The", "blue", "bus", "is", "coming"], say: "The blue bus is coming." },
      { id: "tb7", kind: "fill", vi: "Điền màu: Ô của bà cụ màu …", q: "The old woman's umbrella is ___.", options: ["yellow", "green", "black"], answer: "yellow", say: "The old woman's umbrella is yellow." },
    ],
  },
  {
    id: "library", title: "Describe the Library", vi: "Mô tả thư viện", image: IMG + "scene-library.webp",
    emojis: ["📚", "🪜", "🔖", "👓", "🧣", "🎒", "🪑", "🏙️"],
    intro: "Nhìn thư viện. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tl1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The librarian is pushing a book cart.", "The librarian is cooking soup.", "The librarian is swimming."], answer: "The librarian is pushing a book cart.", say: "The librarian is pushing a book cart." },
      { id: "tl2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["Two children are reading.", "A girl stands on a stool.", "A shark is reading a book."], answer: "A shark is reading a book.", say: "Children are reading, there is no shark." },
      { id: "tl3", kind: "fill", vi: "Điền từ: Bạn nữ đứng trên một … để với kệ.", q: "A girl is standing on a ___ to reach the shelf.", options: ["stool", "bus", "boat"], answer: "stool", say: "A girl is standing on a stool to reach the shelf." },
      { id: "tl4", kind: "position", vi: "Chiếc balô ở đâu?", q: "Where is the backpack?", options: ["under the table", "on the ceiling", "in the river"], answer: "under the table", say: "The backpack is under the table." },
      { id: "tl5", kind: "arrange", vi: "Xếp câu: Thư viện yên tĩnh và êm đềm.", solution: ["The", "library", "is", "calm", "and", "quiet"], say: "The library is calm and quiet." },
      { id: "tl6", kind: "arrange", vi: "Xếp câu: Hai bạn đọc sách ở bàn.", solution: ["Two", "children", "read", "at", "a", "table"], say: "Two children read at a table." },
      { id: "tl7", kind: "fill", vi: "Điền màu: Bạn nữ áo vàng đọc cuốn sách màu …", q: "The girl in yellow is reading a ___ book.", options: ["pink", "green", "black"], answer: "pink", say: "The girl in yellow is reading a pink book." },
    ],
  },
];
export const talkSceneById = (id: string) => TALK_SCENES.find((s) => s.id === id);
export function randomTalkScene(): TalkScene {
  return TALK_SCENES[Math.floor(Math.random() * TALK_SCENES.length)];
}
