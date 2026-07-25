// Ngân hàng cảnh cho Picture Detective & Picture Talk (chơi tự do, bốc ngẫu nhiên, chơi lại không lặp).
// Mỗi cảnh có nhiều câu; nội dung viết khớp đúng chi tiết trong ảnh.
// Ảnh do codex tạo; emoji chỉ là fallback nếu thiếu ảnh.

import type { Difficulty } from "./gameplay";

export type SceneQKind = "observe" | "locate" | "compare" | "infer" | "sequence";
export type SceneQ = {
  id: string; kind: SceneQKind;
  q: string; vi: string;
  options: string[]; answer: string; explainVi?: string;
  difficulty?: Difficulty; // tùy chọn — nếu thiếu sẽ suy ra từ kind
};
export type DetectiveScene = {
  id: string; title: string; vi: string; image: string; emojis: string[];
  questions: SceneQ[];
};

const IMG = "/assets/images/gen/";
const L1 = "/assets/images/learn/level-1/";
const L2 = "/assets/images/learn/level-2/";
const L3 = "/assets/images/learn/level-3/";

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
  {
    id: "sciencefair", title: "At the Science Fair", vi: "Ở hội chợ khoa học", image: L1 + "level-1-unit-07-at-the-science-fair.webp",
    emojis: ["🔬", "🌋", "🌬️", "🎗️", "☀️", "🌉", "🧑‍⚖️", "🎒", "🚗", "🏔️"],
    questions: [
      { id: "sf1", kind: "observe", q: "What is the girl in the teal cardigan presenting?", vi: "Bạn nữ áo teal đang giới thiệu gì?", options: ["A wind turbine model", "A birthday cake", "A pet dog"], answer: "A wind turbine model" },
      { id: "sf2", kind: "observe", q: "What colour is the foam coming out of the volcano?", vi: "Bọt trào ra từ núi lửa màu gì?", options: ["Red", "Blue", "Green"], answer: "Red" },
      { id: "sf3", kind: "infer", q: "A boy pours liquid into the clay volcano. What happens next?", vi: "Cậu bé đổ dung dịch vào núi lửa đất sét. Tiếp theo sẽ ra sao?", options: ["It erupts with foam", "It turns to ice", "It flies away"], answer: "It erupts with foam", explainVi: "Đổ dung dịch vào làm phản ứng, núi lửa phun bọt." },
      { id: "sf4", kind: "compare", q: "Which project uses the sun for power?", vi: "Dự án nào dùng năng lượng mặt trời?", options: ["The solar toy car", "The volcano", "The bridge"], answer: "The solar toy car", explainVi: "Chiếc xe đồ chơi có tấm pin mặt trời trên nóc." },
      { id: "sf5", kind: "observe", q: "Who is holding a clipboard?", vi: "Ai đang cầm bảng kẹp giấy?", options: ["The teacher (the judge)", "The solar car", "The turbine"], answer: "The teacher (the judge)" },
      { id: "sf6", kind: "locate", q: "Where are the prize ribbons?", vi: "Những huy hiệu ruy-băng ở đâu?", options: ["On a board on the right", "In the volcano", "Under the floor"], answer: "On a board on the right" },
      { id: "sf7", kind: "compare", q: "Which ribbon usually means first place?", vi: "Ruy-băng nào thường là giải nhất?", options: ["The blue ribbon", "The yellow ribbon", "The green ribbon"], answer: "The blue ribbon" },
      { id: "sf8", kind: "infer", q: "A boy adds heavy weights onto a model bridge. What is he testing?", vi: "Cậu bé đặt vật nặng lên cầu mô hình. Cậu đang thử điều gì?", options: ["How strong the bridge is", "How sweet it tastes", "How fast it can fly"], answer: "How strong the bridge is", explainVi: "Thêm vật nặng để kiểm tra độ chắc của cây cầu." },
      { id: "sf9", kind: "locate", q: "What can you see through the big windows?", vi: "Nhìn qua ô cửa lớn thấy gì?", options: ["Mountains and a city", "A desert", "The deep sea"], answer: "Mountains and a city" },
      { id: "sf10", kind: "sequence", q: "The judge has looked at every project. What will she do next?", vi: "Giám khảo đã xem hết các dự án. Tiếp theo cô sẽ làm gì?", options: ["Give a ribbon to the best one", "Go to sleep", "Erase all the projects"], answer: "Give a ribbon to the best one", explainVi: "Xem xong thì trao giải cho dự án tốt nhất." },
    ],
  },
  {
    id: "sciencemuseum", title: "At the Science Museum", vi: "Ở bảo tàng khoa học", image: L1 + "level-1-unit-08-at-the-science-museum.webp",
    emojis: ["🦖", "🪐", "🔭", "🧲", "🐚", "🤖", "🌈", "🎒", "🏔️", "🏙️"],
    questions: [
      { id: "mu1", kind: "observe", q: "What big skeleton stands in the hall?", vi: "Bộ xương lớn nào đứng trong sảnh?", options: ["A dinosaur", "A whale", "A horse"], answer: "A dinosaur" },
      { id: "mu2", kind: "observe", q: "What is hanging from the ceiling?", vi: "Vật gì treo trên trần?", options: ["Model planets", "Kites", "Lamps only"], answer: "Model planets" },
      { id: "mu3", kind: "observe", q: "What is the girl touching with her hand?", vi: "Bạn nữ đang chạm tay vào gì?", options: ["A plasma ball", "A candle", "A fish tank"], answer: "A plasma ball" },
      { id: "mu4", kind: "compare", q: "Which object splits light into a rainbow?", vi: "Vật nào tách ánh sáng thành cầu vồng?", options: ["The glass prism", "The magnet", "The telescope"], answer: "The glass prism" },
      { id: "mu5", kind: "locate", q: "What is the boy on the right looking through?", vi: "Cậu bé bên phải nhìn qua vật gì?", options: ["A telescope", "A window", "A book"], answer: "A telescope" },
      { id: "mu6", kind: "observe", q: "What are the two children in the middle looking at?", vi: "Hai bạn ở giữa đang xem gì?", options: ["A model Mars rover", "A cake", "A bicycle"], answer: "A model Mars rover" },
      { id: "mu7", kind: "infer", q: "The boy holds a spiral ammonite. What is it?", vi: "Cậu bé cầm một vật xoắn ốc (ammonite). Đó là gì?", options: ["A fossil", "A cookie", "A ball"], answer: "A fossil", explainVi: "Ammonite là hoá thạch con vật biển cổ đại." },
      { id: "mu8", kind: "compare", q: "Which is the shape of the magnet on the table?", vi: "Cục nam châm trên bàn có hình gì?", options: ["A horseshoe (U shape)", "A star", "A heart"], answer: "A horseshoe (U shape)" },
      { id: "mu9", kind: "infer", q: "There is a sign that says 'do not touch'. Why?", vi: "Có biển ghi 'không chạm vào'. Vì sao?", options: ["To protect the exhibits", "Because it is dark", "Because it is lunchtime"], answer: "To protect the exhibits", explainVi: "Không chạm để giữ gìn hiện vật quý." },
      { id: "mu10", kind: "sequence", q: "The children finished the rover exhibit. Where might they go next?", vi: "Các bạn xem xong khu xe tự hành. Tiếp theo có thể đi đâu?", options: ["To the telescope to look outside", "Back home to bed", "Into the fossil case"], answer: "To the telescope to look outside", explainVi: "Trong bảo tàng, các bạn đi từ khu này sang khu khác để khám phá tiếp." },
    ],
  },
  {
    id: "waterfront", title: "At the Vancouver Waterfront", vi: "Bờ nước Vancouver", image: L1 + "level-1-unit-09-at-the-vancouver-waterfront.webp",
    emojis: ["🌊", "⛴️", "🏙️", "🏔️", "🐦", "🔭", "🚲", "🍁", "☂️", "⛵"],
    questions: [
      { id: "wf1", kind: "observe", q: "Where are the children standing?", vi: "Các bạn đang đứng ở đâu?", options: ["On a seawall by the water", "In a classroom", "On a mountain top"], answer: "On a seawall by the water" },
      { id: "wf2", kind: "observe", q: "What is the girl in the teal jacket holding?", vi: "Bạn nữ áo teal đang cầm gì?", options: ["A map", "A cake", "A cat"], answer: "A map" },
      { id: "wf3", kind: "compare", q: "What big boat is sailing on the water?", vi: "Con thuyền lớn nào đang chạy trên nước?", options: ["A blue and white ferry", "A pirate ship", "A canoe"], answer: "A blue and white ferry" },
      { id: "wf4", kind: "observe", q: "What tall bird is standing near the water?", vi: "Con chim cao nào đứng gần mặt nước?", options: ["A grey heron", "A parrot", "A penguin"], answer: "A grey heron" },
      { id: "wf5", kind: "observe", q: "What is the girl in yellow using to look far away?", vi: "Bạn nữ áo vàng dùng gì để nhìn xa?", options: ["Binoculars", "A phone", "A cup"], answer: "Binoculars" },
      { id: "wf6", kind: "infer", q: "A boy is kneeling by a bicycle and touching the chain. What is he doing?", vi: "Cậu bé quỳ bên xe đạp và chạm vào xích. Cậu đang làm gì?", options: ["Fixing the bike chain", "Eating lunch", "Painting the bike"], answer: "Fixing the bike chain", explainVi: "Cúi xuống chỉnh xích nghĩa là đang sửa xe đạp." },
      { id: "wf7", kind: "locate", q: "What can you see far across the water?", vi: "Nhìn xa bên kia mặt nước thấy gì?", options: ["A city and snowy mountains", "A hot desert", "A big farm"], answer: "A city and snowy mountains" },
      { id: "wf8", kind: "infer", q: "The sky is full of grey clouds. What might happen soon?", vi: "Bầu trời đầy mây xám. Điều gì có thể sắp xảy ra?", options: ["It might rain", "It will be very hot", "It will snow candy"], answer: "It might rain", explainVi: "Mây xám dày thường báo hiệu sắp mưa." },
      { id: "wf9", kind: "locate", q: "What season is it? Look at the leaves.", vi: "Đang là mùa nào? Hãy nhìn lá cây.", options: ["Autumn", "Summer", "Spring"], answer: "Autumn", explainVi: "Lá phong đỏ cam rơi đầy đất là dấu hiệu mùa thu." },
      { id: "wf10", kind: "sequence", q: "The girl is pointing at the map. What will the friends probably do?", vi: "Bạn nữ chỉ vào bản đồ. Các bạn có lẽ sẽ làm gì?", options: ["Follow the map to their next stop", "Jump into the cold water", "Go to sleep on the path"], answer: "Follow the map to their next stop", explainVi: "Chỉ bản đồ để dẫn đường tới điểm tiếp theo." },
    ],
  },
  {
    id: "missingbackpack", title: "The Missing Backpack", vi: "Chiếc balô thất lạc", image: L2 + "level-2-unit-01-missing-backpack.webp",
    emojis: ["🎒", "🧭", "📓", "🥤", "🔎", "🚪", "🪑", "🏫"],
    questions: [
      { id: "mb1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a school hallway", "On a beach", "In a kitchen"], answer: "In a school hallway" },
      { id: "mb2", kind: "observe", q: "What is on the floor near the bench?", vi: "Trên sàn cạnh ghế có gì?", options: ["A green notebook", "A red ball", "A slice of cake"], answer: "A green notebook" },
      { id: "mb3", kind: "observe", q: "What colour is the water bottle on the floor?", vi: "Chai nước trên sàn màu gì?", options: ["Light blue", "Bright red", "Yellow"], answer: "Light blue" },
      { id: "mb4", kind: "locate", q: "What is the boy with glasses holding?", vi: "Cậu bé đeo kính cầm gì?", options: ["A map of the school", "A sandwich", "A cat"], answer: "A map of the school" },
      { id: "mb5", kind: "compare", q: "Which child is looking under the bench?", vi: "Bạn nào đang nhìn dưới gầm ghế?", options: ["The girl in the striped shirt", "The boy with glasses", "The boy in the plaid shirt"], answer: "The girl in the striped shirt" },
      { id: "mb6", kind: "observe", q: "What is the weather like outside the window?", vi: "Ngoài cửa sổ thời tiết thế nào?", options: ["Sunny", "Snowy", "Stormy"], answer: "Sunny" },
      { id: "mb7", kind: "infer", q: "The children are looking down and searching the floor. What are they doing?", vi: "Các bạn cúi xuống tìm trên sàn. Họ đang làm gì?", options: ["Looking for something lost", "Cleaning the floor", "Playing football"], answer: "Looking for something lost", explainVi: "Cúi nhìn và tìm quanh sàn nghĩa là đang tìm đồ bị mất." },
      { id: "mb8", kind: "locate", q: "What can you see through the doorway in the background?", vi: "Nhìn qua ô cửa phía sau thấy gì?", options: ["A library with bookshelves", "A swimming pool", "A farm"], answer: "A library with bookshelves" },
      { id: "mb9", kind: "infer", q: "A notebook, a card and a bottle lie on the floor. What probably happened?", vi: "Quyển vở, tấm thẻ và chai nước nằm trên sàn. Có lẽ đã xảy ra gì?", options: ["A bag tipped over and things fell out", "It started to snow indoors", "Someone built a tower"], answer: "A bag tipped over and things fell out", explainVi: "Nhiều đồ rơi vãi trên sàn → một chiếc túi đã bị đổ." },
      { id: "mb10", kind: "sequence", q: "They found clues on the floor. What should they do next?", vi: "Các bạn tìm thấy manh mối trên sàn. Tiếp theo nên làm gì?", options: ["Follow the clues to find the backpack", "Go to sleep", "Throw the clues away"], answer: "Follow the clues to find the backpack", explainVi: "Có manh mối thì lần theo để tìm chiếc balô thất lạc." },
    ],
  },
  {
    id: "classtrip", title: "Planning the Class Trip", vi: "Lên kế hoạch chuyến đi lớp", image: L3 + "collection-01-making-choices/level-3-c01-unit-01-planning-class-trip.webp",
    emojis: ["🗺️", "🔭", "🌲", "🦌", "⛴️", "🗳️", "🌍", "🧑‍🏫"],
    questions: [
      { id: "ct1", kind: "observe", q: "Where are the students?", vi: "Các bạn học sinh đang ở đâu?", options: ["In a classroom", "On a boat", "In a park"], answer: "In a classroom" },
      { id: "ct2", kind: "observe", q: "How many trip choices are on the table?", vi: "Trên bàn có mấy lựa chọn chuyến đi?", options: ["Two", "Three", "Five"], answer: "Three" },
      { id: "ct3", kind: "observe", q: "What is on the first card?", vi: "Trên tấm thẻ đầu tiên có gì?", options: ["A telescope and a science flask", "A birthday cake", "A racing car"], answer: "A telescope and a science flask" },
      { id: "ct4", kind: "compare", q: "Which card shows a forest with a deer?", vi: "Tấm thẻ nào có rừng cây và một con hươu?", options: ["The middle card", "The first card", "The last card"], answer: "The middle card" },
      { id: "ct5", kind: "observe", q: "What is on the last card?", vi: "Trên tấm thẻ cuối cùng có gì?", options: ["A boat with an anchor", "An airplane", "A school bus"], answer: "A boat with an anchor" },
      { id: "ct6", kind: "locate", q: "Who is holding a small voting board?", vi: "Ai đang cầm bảng bỏ phiếu nhỏ?", options: ["The teacher", "The youngest boy", "Nobody"], answer: "The teacher" },
      { id: "ct7", kind: "locate", q: "What is on the shelf in the background?", vi: "Trên kệ phía sau có gì?", options: ["A globe", "A television", "A fish tank"], answer: "A globe" },
      { id: "ct8", kind: "infer", q: "The students point at the cards and talk. What are they doing?", vi: "Các bạn chỉ vào các thẻ và trò chuyện. Họ đang làm gì?", options: ["Choosing where to go on a trip", "Cooking dinner", "Cleaning the room"], answer: "Choosing where to go on a trip", explainVi: "Chỉ vào các lựa chọn và bàn bạc → đang chọn nơi đi chơi." },
      { id: "ct9", kind: "infer", q: "Each card has small tokens under it. What are the tokens for?", vi: "Dưới mỗi thẻ có những đồng nhỏ. Chúng dùng để làm gì?", options: ["Voting and comparing the choices", "Buying food", "Telling the time"], answer: "Voting and comparing the choices", explainVi: "Các đồng nhỏ dùng để bỏ phiếu, so sánh giữa các lựa chọn." },
      { id: "ct10", kind: "sequence", q: "After everyone votes, what will the class do?", vi: "Sau khi mọi người bỏ phiếu, cả lớp sẽ làm gì?", options: ["Pick the trip with the most votes", "Go home immediately", "Erase the whole board"], answer: "Pick the trip with the most votes", explainVi: "Bỏ phiếu xong thì chọn chuyến đi được nhiều phiếu nhất." },
    ],
  },
  {
    id: "talentshow", title: "The School Talent Show", vi: "Hội diễn tài năng", image: L2 + "level-2-unit-03-school-talent-show.webp",
    emojis: ["🎸", "🎩", "🃏", "🎤", "✨", "🎭", "🧣", "🌟"],
    questions: [
      { id: "sh1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["Backstage at a talent show", "In a kitchen", "On a farm"], answer: "Backstage at a talent show" },
      { id: "sh2", kind: "observe", q: "What is the girl on the case playing?", vi: "Bạn nữ ngồi trên thùng đồ đang chơi nhạc cụ gì?", options: ["A guitar", "A drum", "A flute"], answer: "A guitar" },
      { id: "sh3", kind: "observe", q: "What is the boy in the cape holding?", vi: "Cậu bé mặc áo choàng đang cầm gì?", options: ["Playing cards", "A book", "A ball"], answer: "Playing cards" },
      { id: "sh4", kind: "locate", q: "What red hat is on the floor?", vi: "Chiếc mũ đỏ nào nằm trên sàn?", options: ["A top hat", "A cap", "A helmet"], answer: "A top hat" },
      { id: "sh5", kind: "observe", q: "What is the girl in the purple sweater holding?", vi: "Bạn nữ áo len tím đang cầm gì?", options: ["A clipboard", "A guitar", "A cake"], answer: "A clipboard" },
      { id: "sh6", kind: "locate", q: "What is inside the open prop trunk?", vi: "Trong thùng đạo cụ mở có gì?", options: ["A feather boa and a star wand", "Food", "Books"], answer: "A feather boa and a star wand" },
      { id: "sh7", kind: "infer", q: "A boy peeks through the curtain at the crowd. How does he feel?", vi: "Một cậu bé nhìn trộm qua rèm ra đám đông. Cậu thấy thế nào?", options: ["Nervous", "Sleepy", "Angry"], answer: "Nervous", explainVi: "Sắp lên biểu diễn trước đông người nên hồi hộp." },
      { id: "sh8", kind: "infer", q: "The boy wears a cape and holds cards. What act will he do?", vi: "Cậu bé mặc áo choàng và cầm bài. Cậu sẽ biểu diễn tiết mục gì?", options: ["A magic show", "A cooking show", "A running race"], answer: "A magic show", explainVi: "Áo choàng và bộ bài là đạo cụ của ảo thuật." },
      { id: "sh9", kind: "locate", q: "What can you see on the stage through the curtain?", vi: "Nhìn qua rèm ra sân khấu thấy gì?", options: ["A microphone and the audience", "A swimming pool", "Snowy mountains"], answer: "A microphone and the audience" },
      { id: "sh10", kind: "sequence", q: "The performers are getting ready backstage. What happens next?", vi: "Các bạn đang chuẩn bị sau cánh gà. Tiếp theo sẽ thế nào?", options: ["They go on stage to perform", "They go home", "They fall asleep"], answer: "They go on stage to perform", explainVi: "Chuẩn bị xong thì ra sân khấu biểu diễn." },
    ],
  },
  {
    id: "gardenmystery", title: "The Community Garden Mystery", vi: "Bí ẩn khu vườn chung", image: L2 + "level-2-unit-06-community-garden-mystery.webp",
    emojis: ["🥕", "🍅", "🔍", "🦝", "🚿", "👣", "🌿", "🏙️"],
    questions: [
      { id: "gm1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a community garden", "At a beach", "In a library"], answer: "In a community garden" },
      { id: "gm2", kind: "observe", q: "What is the girl in the striped shirt holding?", vi: "Bạn nữ áo sọc đang cầm gì?", options: ["A magnifying glass", "A camera", "A spoon"], answer: "A magnifying glass" },
      { id: "gm3", kind: "observe", q: "What has tipped over on the muddy ground?", vi: "Vật gì đổ trên nền đất lầy?", options: ["A green watering can", "A flower pot", "A bucket of paint"], answer: "A green watering can" },
      { id: "gm4", kind: "locate", q: "What animal is hiding in the compost bin?", vi: "Con vật nào đang trốn trong thùng ủ phân?", options: ["A raccoon", "A cat", "A rabbit"], answer: "A raccoon" },
      { id: "gm5", kind: "observe", q: "What small red fruit is scattered on the ground?", vi: "Loại quả đỏ nhỏ nào rơi vãi trên đất?", options: ["Cherry tomatoes", "Strawberries", "Apples"], answer: "Cherry tomatoes" },
      { id: "gm6", kind: "compare", q: "Who is holding a notebook with a drawing?", vi: "Ai đang cầm cuốn sổ có hình vẽ?", options: ["The boy in the plaid shirt", "The girl with the magnifying glass", "The boy with glasses"], answer: "The boy in the plaid shirt" },
      { id: "gm7", kind: "infer", q: "There are paw prints and a raccoon in the bin. Who made the mess?", vi: "Có dấu chân thú và một con gấu mèo trong thùng. Ai đã bày bừa?", options: ["The raccoon", "The children", "The wind"], answer: "The raccoon", explainVi: "Dấu chân và con gấu mèo trốn trong thùng → chính nó gây ra." },
      { id: "gm8", kind: "infer", q: "The girl looks at prints with a magnifying glass. What is she doing?", vi: "Bạn nữ soi dấu vết bằng kính lúp. Bạn ấy đang làm gì?", options: ["Looking for clues", "Planting seeds", "Washing her hands"], answer: "Looking for clues" },
      { id: "gm9", kind: "locate", q: "What can you see far behind the garden?", vi: "Phía xa sau khu vườn có gì?", options: ["Tall city buildings", "Snowy mountains", "The ocean"], answer: "Tall city buildings" },
      { id: "gm10", kind: "sequence", q: "They followed the tomatoes and paw prints to the bin. What did they find?", vi: "Lần theo cà chua và dấu chân tới thùng, các bạn phát hiện gì?", options: ["A raccoon caused the mess", "Nothing at all", "A hidden treasure"], answer: "A raccoon caused the mess", explainVi: "Manh mối dẫn tới con gấu mèo trong thùng ủ phân." },
    ],
  },
  {
    id: "aquarium", title: "The Aquarium at Night", vi: "Thủy cung về đêm", image: L2 + "level-2-unit-09-aquarium-night-mystery.webp",
    emojis: ["🐙", "🔦", "⚠️", "🪣", "🌊", "🕐", "🐠", "🌙"],
    questions: [
      { id: "aq1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["At an aquarium", "At a park", "In a bakery"], answer: "At an aquarium" },
      { id: "aq2", kind: "observe", q: "What animal is in the big tank?", vi: "Con vật nào trong bể lớn?", options: ["An octopus", "A shark", "A dolphin"], answer: "An octopus" },
      { id: "aq3", kind: "observe", q: "What is the boy with glasses holding?", vi: "Cậu bé đeo kính đang cầm gì?", options: ["A flashlight", "A sandwich", "A ball"], answer: "A flashlight" },
      { id: "aq4", kind: "locate", q: "What on the floor warns people to be careful?", vi: "Vật gì trên sàn cảnh báo mọi người cẩn thận?", options: ["A yellow caution sign", "A flower", "A toy car"], answer: "A yellow caution sign" },
      { id: "aq5", kind: "observe", q: "What is the girl in the striped shirt looking at?", vi: "Bạn nữ áo sọc đang nhìn gì?", options: ["A tablet with a diagram", "A mirror", "A cake"], answer: "A tablet with a diagram" },
      { id: "aq6", kind: "compare", q: "Who is holding a clipboard?", vi: "Ai đang cầm bảng kẹp giấy?", options: ["The girl in the teal jacket", "The boy with the flashlight", "A fish"], answer: "The girl in the teal jacket" },
      { id: "aq7", kind: "infer", q: "The floor is wet and there is a caution sign. What should they do?", vi: "Sàn ướt và có biển cảnh báo. Các bạn nên làm gì?", options: ["Be careful and tell an adult", "Run and jump on it", "Ignore it"], answer: "Be careful and tell an adult", explainVi: "Sàn ướt dễ trơn — hãy cẩn thận và báo người lớn." },
      { id: "aq8", kind: "locate", q: "What is the staff member doing in the background?", vi: "Nhân viên phía sau đang làm gì?", options: ["Putting bins on a shelf", "Swimming in the tank", "Sleeping"], answer: "Putting bins on a shelf" },
      { id: "aq9", kind: "infer", q: "The lights are low and they use a flashlight. What time is it?", vi: "Đèn tối và phải dùng đèn pin. Lúc này là khi nào?", options: ["Night, after closing", "Breakfast time", "Sunny noon"], answer: "Night, after closing", explainVi: "Tối om, phải dùng đèn pin → là buổi tối sau giờ đóng cửa." },
      { id: "aq10", kind: "sequence", q: "They found a wet floor and a control box. What will the adult do next?", vi: "Phát hiện sàn ướt và hộp điều khiển. Người lớn sẽ làm gì tiếp theo?", options: ["Check it safely to fix the problem", "Let the children touch the wires", "Leave and lock everyone in"], answer: "Check it safely to fix the problem", explainVi: "Người lớn sẽ kiểm tra an toàn để khắc phục sự cố." },
    ],
  },
  {
    id: "cookingworkshop", title: "The Cooking Workshop Mix-Up", vi: "Lớp nấu ăn bị nhầm", image: L2 + "level-2-unit-16-cooking-workshop-mix-up.webp",
    emojis: ["🧁", "🫐", "🍫", "⏲️", "🥣", "📋", "🥛", "🍓"],
    questions: [
      { id: "cw1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a kitchen workshop", "In a library", "In a garden"], answer: "In a kitchen workshop" },
      { id: "cw2", kind: "observe", q: "What are they making?", vi: "Các bạn đang làm món gì?", options: ["Muffins", "Pizza", "Soup"], answer: "Muffins" },
      { id: "cw3", kind: "compare", q: "What is in the pale batter on the left?", vi: "Trong tô bột nhạt màu bên trái có gì?", options: ["Blueberries", "Chocolate", "Carrots"], answer: "Blueberries" },
      { id: "cw4", kind: "compare", q: "What colour is the batter on the right?", vi: "Tô bột bên phải màu gì?", options: ["Brown, like chocolate", "Green", "Pink"], answer: "Brown, like chocolate" },
      { id: "cw5", kind: "observe", q: "What is in the middle of the table?", vi: "Ở giữa bàn có gì?", options: ["A kitchen timer", "A phone", "A candle"], answer: "A kitchen timer" },
      { id: "cw6", kind: "locate", q: "What do the step cards show?", vi: "Các thẻ bước chỉ điều gì?", options: ["How to make each muffin, in order", "A treasure map", "A song"], answer: "How to make each muffin, in order" },
      { id: "cw7", kind: "infer", q: "The boy looks worried and holds a recipe card. What happened?", vi: "Cậu bé lo lắng và cầm thẻ công thức. Đã xảy ra chuyện gì?", options: ["The recipe cards got mixed up", "It started to rain", "The oven flew away"], answer: "The recipe cards got mixed up", explainVi: "Vẻ mặt lo lắng và xem lại thẻ → công thức đã bị lẫn lộn." },
      { id: "cw8", kind: "observe", q: "What is used to measure liquids?", vi: "Dùng gì để đong chất lỏng?", options: ["A glass measuring cup", "A shoe", "A book"], answer: "A glass measuring cup" },
      { id: "cw9", kind: "compare", q: "Which bowl uses cocoa powder?", vi: "Tô nào dùng bột ca cao?", options: ["The chocolate batter", "The blueberry batter", "The flour bag"], answer: "The chocolate batter" },
      { id: "cw10", kind: "sequence", q: "They fixed the mix-up and filled the trays. What happens next?", vi: "Sửa xong và đổ bột vào khuôn. Tiếp theo là gì?", options: ["They bake the muffins", "They throw them away", "They eat the raw batter"], answer: "They bake the muffins", explainVi: "Đổ khuôn xong thì đem nướng bánh." },
    ],
  },
  {
    id: "wildlifecam", title: "The Wildlife Camera Surprise", vi: "Bất ngờ từ máy ảnh rừng", image: L2 + "level-2-unit-14-wildlife-camera-surprise.webp",
    emojis: ["📷", "🦝", "👣", "🏕️", "🔦", "🔭", "🍁", "🌆"],
    questions: [
      { id: "wc1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["At a lakeside camp", "At a supermarket", "In a classroom"], answer: "At a lakeside camp" },
      { id: "wc2", kind: "observe", q: "What are they looking at on the table?", vi: "Trên bàn các bạn đang xem gì?", options: ["Photos from a wildlife camera", "Birthday cards", "Menus"], answer: "Photos from a wildlife camera" },
      { id: "wc3", kind: "observe", q: "What is strapped to the tree?", vi: "Vật gì được buộc vào thân cây?", options: ["A trail camera", "A clock", "A birdhouse"], answer: "A trail camera" },
      { id: "wc4", kind: "compare", q: "What do the muddy photos show?", vi: "Những tấm ảnh chụp bùn cho thấy gì?", options: ["Animal paw prints", "Handprints", "Letters"], answer: "Animal paw prints" },
      { id: "wc5", kind: "locate", q: "What is glowing on the table?", vi: "Vật gì đang phát sáng trên bàn?", options: ["A lantern", "A phone", "A campfire"], answer: "A lantern" },
      { id: "wc6", kind: "observe", q: "Whose striped tail is in one photo?", vi: "Cái đuôi có sọc trong một tấm ảnh là của con nào?", options: ["A raccoon's", "A tiger's", "A zebra's"], answer: "A raccoon's" },
      { id: "wc7", kind: "infer", q: "They found paw prints, a striped tail, and a dark shape. What animal came at night?", vi: "Có dấu chân, đuôi sọc và một bóng đen. Con vật nào đã đến vào ban đêm?", options: ["A raccoon", "An elephant", "A whale"], answer: "A raccoon", explainVi: "Các manh mối đều chỉ về con gấu mèo (raccoon)." },
      { id: "wc8", kind: "locate", q: "What can you use to look far across the lake?", vi: "Dùng gì để nhìn xa qua mặt hồ?", options: ["Binoculars", "A spoon", "A pillow"], answer: "Binoculars" },
      { id: "wc9", kind: "infer", q: "The sky is orange and the lantern is on. What time is it?", vi: "Trời cam và đèn lồng đã bật. Lúc này là khi nào?", options: ["Evening", "Midday", "Early school morning"], answer: "Evening" },
      { id: "wc10", kind: "sequence", q: "The camera took photos at night. What did the photos help them do?", vi: "Máy ảnh chụp ban đêm. Những tấm ảnh giúp các bạn làm gì?", options: ["Find out which animal came", "Cook dinner", "Paint the cabin"], answer: "Find out which animal came", explainVi: "Ảnh ban đêm giúp biết con vật nào đã ghé qua." },
    ],
  },
  {
    id: "teamproject", title: "Choosing the Team Project", vi: "Chọn dự án nhóm", image: L3 + "collection-01-making-choices/level-3-c01-unit-03-choosing-team-project.webp",
    emojis: ["🌱", "🔆", "🗺️", "🐝", "💡", "🧩", "🌍", "🧑‍🏫"],
    questions: [
      { id: "tj1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a classroom", "In a swimming pool", "On a farm"], answer: "In a classroom" },
      { id: "tj2", kind: "observe", q: "What are the three project models about?", vi: "Ba mô hình dự án nói về điều gì?", options: ["A garden, solar power, and a city map", "Cakes", "Racing cars"], answer: "A garden, solar power, and a city map" },
      { id: "tj3", kind: "observe", q: "What charges the phone in one model?", vi: "Trong một mô hình, thứ gì sạc điện thoại?", options: ["A solar panel", "A candle", "A fan"], answer: "A solar panel" },
      { id: "tj4", kind: "locate", q: "What small animals are in the flower model?", vi: "Trong mô hình vườn hoa có con vật nhỏ nào?", options: ["Bees", "Fish", "Cats"], answer: "Bees" },
      { id: "tj5", kind: "observe", q: "What is the teacher holding?", vi: "Cô giáo đang cầm gì?", options: ["A tablet with a team diagram", "A guitar", "An umbrella"], answer: "A tablet with a team diagram" },
      { id: "tj6", kind: "compare", q: "Which model shows streets and a park?", vi: "Mô hình nào có đường phố và công viên?", options: ["The city map model", "The garden", "The solar panel"], answer: "The city map model" },
      { id: "tj7", kind: "infer", q: "They point at models and a chart of icons. What are they doing?", vi: "Các bạn chỉ vào mô hình và bảng biểu tượng. Họ đang làm gì?", options: ["Choosing a team project", "Cooking lunch", "Cleaning up"], answer: "Choosing a team project" },
      { id: "tj8", kind: "observe", q: "What is the girl in the denim jacket doing?", vi: "Bạn nữ áo jean đang làm gì?", options: ["Drawing icons in a notebook", "Sleeping", "Eating a snack"], answer: "Drawing icons in a notebook" },
      { id: "tj9", kind: "locate", q: "What is on the whiteboard behind them?", vi: "Trên bảng trắng phía sau có gì?", options: ["A flowchart plan", "A movie", "An open window"], answer: "A flowchart plan" },
      { id: "tj10", kind: "sequence", q: "After they compare the ideas, what will the team do?", vi: "Sau khi so sánh các ý tưởng, nhóm sẽ làm gì?", options: ["Pick one project to work on", "Go home", "Erase the board"], answer: "Pick one project to work on", explainVi: "So sánh xong thì chọn một dự án để cùng thực hiện." },
    ],
  },
  {
    id: "greenfestival", title: "The Greener School Festival", vi: "Lễ hội trường xanh", image: L3 + "collection-03-solving-problems/level-3-c03-unit-03-greener-school-festival.webp",
    emojis: ["♻️", "🌱", "💧", "🔆", "🏮", "🎪", "🔦", "🍃"],
    questions: [
      { id: "gf1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["At an outdoor school festival", "Inside a classroom", "At a beach"], answer: "At an outdoor school festival" },
      { id: "gf2", kind: "observe", q: "Where are the children filling their bottles?", vi: "Các bạn đổ đầy bình nước ở đâu?", options: ["At a water refill station", "In a swimming pool", "From a juice fountain"], answer: "At a water refill station" },
      { id: "gf3", kind: "observe", q: "How many sorting bins are lined up?", vi: "Có mấy thùng phân loại rác xếp thành hàng?", options: ["Two", "Three", "Five"], answer: "Three" },
      { id: "gf4", kind: "compare", q: "Which bin is for bottles and cans?", vi: "Thùng nào để chai và lon?", options: ["The blue bin", "The green bin", "The grey bin"], answer: "The blue bin" },
      { id: "gf5", kind: "locate", q: "What is the girl on the crate doing?", vi: "Bạn nữ đứng trên thùng gỗ đang làm gì?", options: ["Hanging up bunting flags", "Cooking", "Reading a book"], answer: "Hanging up bunting flags" },
      { id: "gf6", kind: "observe", q: "What is on the table with the green cloth?", vi: "Trên bàn phủ khăn xanh có gì?", options: ["A solar panel and a lantern", "A cake", "A television"], answer: "A solar panel and a lantern" },
      { id: "gf7", kind: "infer", q: "The children sort scraps into different bins. What are they trying to do?", vi: "Các bạn phân loại rác vào các thùng khác nhau. Họ đang cố làm gì?", options: ["Reduce waste at the festival", "Make noise", "Buy toys"], answer: "Reduce waste at the festival", explainVi: "Phân loại rác để giảm rác thải, giữ lễ hội xanh sạch." },
      { id: "gf8", kind: "infer", q: "They use a solar panel and a hand crank. What are these for?", vi: "Họ dùng tấm pin mặt trời và tay quay. Những thứ này để làm gì?", options: ["To make clean electricity", "To cook food", "To cool drinks"], answer: "To make clean electricity", explainVi: "Pin mặt trời và tay quay tạo ra điện sạch." },
      { id: "gf9", kind: "locate", q: "What is being set up in the background?", vi: "Phía sau đang dựng gì?", options: ["A stage", "A farm", "A car park"], answer: "A stage" },
      { id: "gf10", kind: "sequence", q: "They set up bins, water and lights. What happens next?", vi: "Đã chuẩn bị thùng rác, nước và đèn. Tiếp theo là gì?", options: ["The festival will begin", "Everyone goes home", "It starts to snow"], answer: "The festival will begin", explainVi: "Chuẩn bị xong thì lễ hội bắt đầu." },
    ],
  },
  {
    id: "recessspace", title: "Designing a Better Recess Space", vi: "Thiết kế sân chơi tốt hơn", image: L3 + "collection-03-solving-problems/level-3-c03-unit-10-designing-a-better-recess-space.webp",
    emojis: ["🏀", "🛝", "🧩", "♿", "🌳", "🎨", "📋", "🟩"],
    questions: [
      { id: "rs1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a schoolyard at recess", "In a library", "In a kitchen"], answer: "In a schoolyard at recess" },
      { id: "rs2", kind: "observe", q: "What is on the table they are gathered around?", vi: "Trên bàn các bạn vây quanh có gì?", options: ["A model of a play space", "A birthday cake", "A fish tank"], answer: "A model of a play space" },
      { id: "rs3", kind: "observe", q: "What is the girl in the purple hoodie holding?", vi: "Bạn nữ áo hoodie tím đang cầm gì?", options: ["A rating card", "A guitar", "An umbrella"], answer: "A rating card" },
      { id: "rs4", kind: "locate", q: "What is the boy in the yellow hoodie using to walk?", vi: "Cậu bé áo vàng dùng gì để đi lại?", options: ["Crutches", "A scooter", "Roller skates"], answer: "Crutches" },
      { id: "rs5", kind: "observe", q: "What is the boy with glasses placing on the ground?", vi: "Cậu bé đeo kính đang đặt gì xuống đất?", options: ["Coloured paving tiles", "Books", "Plates"], answer: "Coloured paving tiles" },
      { id: "rs6", kind: "compare", q: "What game are children playing in the background?", vi: "Phía sau các bạn đang chơi trò gì?", options: ["Basketball", "Swimming", "Chess"], answer: "Basketball" },
      { id: "rs7", kind: "infer", q: "They look at a model and a map. What are they planning?", vi: "Họ nhìn mô hình và bản đồ. Họ đang lên kế hoạch gì?", options: ["A better recess space", "A menu", "A new car"], answer: "A better recess space" },
      { id: "rs8", kind: "infer", q: "One boy uses crutches and they add smooth paths. Who are they helping?", vi: "Một bạn dùng nạng và họ làm thêm lối đi phẳng. Họ đang giúp ai?", options: ["Everyone, including kids who find it hard to move", "Only the tallest kids", "Only the teachers"], answer: "Everyone, including kids who find it hard to move", explainVi: "Lối đi phẳng giúp mọi người, kể cả bạn đi lại khó khăn." },
      { id: "rs9", kind: "locate", q: "Where are some children resting in the background?", vi: "Phía sau vài bạn đang nghỉ ở đâu?", options: ["Under a shaded pergola", "In the water", "On the roof"], answer: "Under a shaded pergola" },
      { id: "rs10", kind: "sequence", q: "They rated the ideas with the card. What will they do next?", vi: "Họ chấm điểm các ý tưởng bằng thẻ. Tiếp theo sẽ làm gì?", options: ["Choose the best design", "Erase everything", "Go to sleep"], answer: "Choose the best design", explainVi: "Chấm điểm xong thì chọn thiết kế tốt nhất." },
    ],
  },
  {
    id: "screentime", title: "Screen or Outdoor Time?", vi: "Xem màn hình hay ra ngoài?", image: L3 + "collection-01-making-choices/level-3-c01-unit-02-screen-or-outdoor-time.webp",
    emojis: ["📱", "🎧", "🚲", "🧩", "☀️", "🌳", "🏀", "🪴"],
    questions: [
      { id: "sn1", kind: "observe", q: "Where are the children?", vi: "Các bạn đang ở đâu?", options: ["In a living room", "In a cave", "On a bus"], answer: "In a living room" },
      { id: "sn2", kind: "observe", q: "What is the boy in the plaid shirt holding?", vi: "Cậu bé áo kẻ đang cầm gì?", options: ["A tablet with a game", "A frying pan", "A map"], answer: "A tablet with a game" },
      { id: "sn3", kind: "observe", q: "What is on the table next to the tablet?", vi: "Cạnh máy tính bảng trên bàn có gì?", options: ["Blue headphones", "A helmet", "A straw hat"], answer: "Blue headphones" },
      { id: "sn4", kind: "locate", q: "What can you see outside through the glass door?", vi: "Nhìn qua cửa kính ra ngoài thấy gì?", options: ["A garden with bicycles", "The ocean", "A desert"], answer: "A garden with bicycles" },
      { id: "sn5", kind: "observe", q: "What icons are at the top of the decision board?", vi: "Trên cùng bảng quyết định có biểu tượng gì?", options: ["Weather icons", "Animal icons", "Money icons"], answer: "Weather icons" },
      { id: "sn6", kind: "compare", q: "What are the children deciding between?", vi: "Các bạn đang chọn giữa hai điều gì?", options: ["Screen time and going outside", "Two kinds of soup", "Two songs"], answer: "Screen time and going outside" },
      { id: "sn7", kind: "infer", q: "The girl points outside where it is sunny. What is she suggesting?", vi: "Bạn nữ chỉ ra ngoài trời nắng. Bạn ấy gợi ý điều gì?", options: ["Going outside to play", "Watching more videos", "Going to sleep"], answer: "Going outside to play" },
      { id: "sn8", kind: "locate", q: "What are the children playing with on the table?", vi: "Trên bàn các bạn đang chơi gì?", options: ["A jigsaw puzzle", "A football", "A piano"], answer: "A jigsaw puzzle" },
      { id: "sn9", kind: "infer", q: "The weather board shows a sunny icon. What activity fits best?", vi: "Bảng thời tiết hiện biểu tượng nắng. Hoạt động nào hợp nhất?", options: ["Riding bikes outside", "Staying in bed", "Swimming in the rain"], answer: "Riding bikes outside" },
      { id: "sn10", kind: "sequence", q: "They weigh the choices on the board. What will they decide?", vi: "Họ cân nhắc các lựa chọn trên bảng. Họ sẽ quyết định gì?", options: ["To balance screen time and outdoor play", "To never go outside", "To throw the tablet away"], answer: "To balance screen time and outdoor play", explainVi: "Cân bằng giữa xem màn hình và ra ngoài vận động." },
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
  difficulty?: Difficulty;    // tùy chọn — nếu thiếu sẽ suy ra từ kind
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
  {
    id: "sciencefair", title: "Describe the Science Fair", vi: "Mô tả hội chợ khoa học", image: L1 + "level-1-unit-07-at-the-science-fair.webp",
    emojis: ["🔬", "🌋", "🌬️", "🎗️", "🌉", "🧑‍⚖️", "🚗", "🎒"],
    intro: "Nhìn hội chợ khoa học. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "df1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["A girl is presenting a wind turbine model.", "A girl is riding a horse.", "A girl is baking a cake."], answer: "A girl is presenting a wind turbine model.", say: "A girl is presenting a wind turbine model." },
      { id: "df2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A volcano is erupting with red foam.", "A teacher is judging the projects.", "A whale is swimming in the gym."], answer: "A whale is swimming in the gym.", say: "There is no whale. It is a science fair in a gym." },
      { id: "df3", kind: "fill", vi: "Điền từ: Núi lửa đang … bọt đỏ.", q: "The volcano is ___ with red foam.", options: ["erupting", "sleeping", "singing"], answer: "erupting", say: "The volcano is erupting with red foam." },
      { id: "df4", kind: "position", vi: "Những huy hiệu ruy-băng ở đâu?", q: "Where are the prize ribbons?", options: ["on a board on the right", "under the water", "in the sky"], answer: "on a board on the right", say: "The prize ribbons are on a board on the right." },
      { id: "df5", kind: "arrange", vi: "Xếp câu: Giám khảo đang xem từng dự án.", solution: ["The", "judge", "is", "looking", "at", "the", "projects"], say: "The judge is looking at the projects." },
      { id: "df6", kind: "arrange", vi: "Xếp câu: Chiếc xe chạy bằng năng lượng mặt trời.", solution: ["The", "car", "runs", "on", "solar", "power"], say: "The car runs on solar power." },
      { id: "df7", kind: "fill", vi: "Điền màu: Dự án tốt nhất được huy hiệu màu …", q: "The best project wins a ___ ribbon.", options: ["blue", "purple", "brown"], answer: "blue", say: "The best project wins a blue ribbon." },
    ],
  },
  {
    id: "sciencemuseum", title: "Describe the Science Museum", vi: "Mô tả bảo tàng khoa học", image: L1 + "level-1-unit-08-at-the-science-museum.webp",
    emojis: ["🦖", "🪐", "🔭", "🧲", "🐚", "🤖", "🌈", "🎒"],
    intro: "Nhìn bảo tàng khoa học. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "dm1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["A huge dinosaur skeleton stands in the hall.", "A dinosaur is eating lunch.", "A dinosaur is driving a car."], answer: "A huge dinosaur skeleton stands in the hall.", say: "A huge dinosaur skeleton stands in the hall." },
      { id: "dm2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["Model planets hang from the ceiling.", "A boy looks through a telescope.", "A shark is flying in the room."], answer: "A shark is flying in the room.", say: "There is no flying shark in the museum." },
      { id: "dm3", kind: "fill", vi: "Điền từ: Các hành tinh … trên trần.", q: "The planets ___ from the ceiling.", options: ["hang", "cook", "run"], answer: "hang", say: "The planets hang from the ceiling." },
      { id: "dm4", kind: "position", vi: "Bộ xương khủng long ở đâu?", q: "Where is the dinosaur skeleton?", options: ["on the left side of the hall", "inside a teapot", "under the sea"], answer: "on the left side of the hall", say: "The dinosaur skeleton is on the left side of the hall." },
      { id: "dm5", kind: "arrange", vi: "Xếp câu: Hai bạn nhỏ xem xe tự hành.", solution: ["Two", "children", "look", "at", "the", "rover"], say: "Two children look at the rover." },
      { id: "dm6", kind: "arrange", vi: "Xếp câu: Mình được nhìn nhưng không được chạm.", solution: ["I", "can", "look", "but", "not", "touch"], say: "I can look but not touch." },
      { id: "dm7", kind: "fill", vi: "Điền từ: Lăng kính tách ánh sáng thành một …", q: "The prism splits light into a ___.", options: ["rainbow", "sandwich", "song"], answer: "rainbow", say: "The prism splits light into a rainbow." },
    ],
  },
  {
    id: "waterfront", title: "Describe the Waterfront", vi: "Mô tả bờ nước Vancouver", image: L1 + "level-1-unit-09-at-the-vancouver-waterfront.webp",
    emojis: ["🌊", "⛴️", "🏙️", "🏔️", "🐦", "🔭", "🚲", "🍁"],
    intro: "Nhìn bờ nước Vancouver. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "dw1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["A ferry is sailing on the water.", "A ferry is flying in the sky.", "A ferry is in the classroom."], answer: "A ferry is sailing on the water.", say: "A ferry is sailing on the water." },
      { id: "dw2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A heron is standing near the water.", "A girl is holding a map.", "A polar bear is riding the ferry."], answer: "A polar bear is riding the ferry.", say: "There is no polar bear on the ferry." },
      { id: "dw3", kind: "fill", vi: "Điền từ: Bạn nữ áo vàng nhìn qua chiếc …", q: "The girl in yellow looks through her ___.", options: ["binoculars", "sandwich", "pillow"], answer: "binoculars", say: "The girl in yellow looks through her binoculars." },
      { id: "dw4", kind: "position", vi: "Con diệc xám đứng ở đâu?", q: "Where is the grey heron?", options: ["near the water on the right", "on the moon", "inside a locker"], answer: "near the water on the right", say: "The grey heron is near the water on the right." },
      { id: "dw5", kind: "arrange", vi: "Xếp câu: Bên kia mặt nước có núi tuyết.", solution: ["Across", "the", "water", "are", "snowy", "mountains"], say: "Across the water are snowy mountains." },
      { id: "dw6", kind: "arrange", vi: "Xếp câu: Một cậu bé đang sửa xe đạp.", solution: ["A", "boy", "is", "fixing", "his", "bike"], say: "A boy is fixing his bike." },
      { id: "dw7", kind: "fill", vi: "Điền từ: Bầu trời nhiều mây nên trời có thể …", q: "The sky is cloudy, so it might ___.", options: ["rain", "sing", "sleep"], answer: "rain", say: "The sky is cloudy, so it might rain." },
    ],
  },
  {
    id: "missingbackpack", title: "Describe the Missing Backpack", vi: "Mô tả chiếc balô thất lạc", image: L2 + "level-2-unit-01-missing-backpack.webp",
    emojis: ["🎒", "🧭", "📓", "🥤", "🔎", "🚪", "🪑", "🏫"],
    intro: "Nhìn dãy hành lang. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tmb1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are searching the floor.", "The children are swimming.", "The children are eating lunch."], answer: "The children are searching the floor.", say: "The children are searching the floor." },
      { id: "tmb2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A boy is holding a map.", "A water bottle is on the floor.", "A dog is reading a map."], answer: "A dog is reading a map.", say: "A boy is holding the map, not a dog." },
      { id: "tmb3", kind: "fill", vi: "Điền từ: Cậu bé cầm một … của trường.", q: "The boy is holding a ___ of the school.", options: ["map", "cake", "shoe"], answer: "map", say: "The boy is holding a map of the school." },
      { id: "tmb4", kind: "position", vi: "Quyển vở xanh ở đâu?", q: "Where is the green notebook?", options: ["on the floor", "in the sky", "under the sea"], answer: "on the floor", say: "The green notebook is on the floor." },
      { id: "tmb5", kind: "arrange", vi: "Xếp câu: Các bạn đang tìm một chiếc balô.", solution: ["The", "children", "are", "looking", "for", "a", "backpack"], say: "The children are looking for a backpack." },
      { id: "tmb6", kind: "arrange", vi: "Xếp câu: Một chai nước nằm trên sàn.", solution: ["A", "water", "bottle", "is", "on", "the", "floor"], say: "A water bottle is on the floor." },
      { id: "tmb7", kind: "fill", vi: "Điền từ: Nắng chiếu qua khung … lớn.", q: "Sunlight comes through the big ___.", options: ["window", "oven", "river"], answer: "window", say: "Sunlight comes through the big window." },
    ],
  },
  {
    id: "classtrip", title: "Describe the Class Trip Plan", vi: "Mô tả buổi lên kế hoạch chuyến đi", image: L3 + "collection-01-making-choices/level-3-c01-unit-01-planning-class-trip.webp",
    emojis: ["🗺️", "🔭", "🌲", "🦌", "⛴️", "🗳️", "🌍", "🧑‍🏫"],
    intro: "Nhìn buổi bàn kế hoạch. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tct1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The students are choosing a class trip.", "The students are sleeping.", "The students are on a boat."], answer: "The students are choosing a class trip.", say: "The students are choosing a class trip." },
      { id: "tct2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["There are three cards on the table.", "The teacher holds a voting board.", "A deer is sitting at the table."], answer: "A deer is sitting at the table.", say: "The deer is only a picture on a card." },
      { id: "tct3", kind: "fill", vi: "Điền từ: Trên bàn có … tấm thẻ chuyến đi.", q: "There are ___ trip cards on the table.", options: ["three", "ten", "two"], answer: "three", say: "There are three trip cards on the table." },
      { id: "tct4", kind: "position", vi: "Quả địa cầu ở đâu?", q: "Where is the globe?", options: ["on the shelf", "under the table", "up in the sky"], answer: "on the shelf", say: "The globe is on the shelf." },
      { id: "tct5", kind: "arrange", vi: "Xếp câu: Cả lớp đang lên kế hoạch một chuyến đi.", solution: ["The", "class", "is", "planning", "a", "school", "trip"], say: "The class is planning a school trip." },
      { id: "tct6", kind: "arrange", vi: "Xếp câu: Chúng mình bỏ phiếu cho lựa chọn tốt nhất.", solution: ["We", "vote", "for", "the", "best", "choice"], say: "We vote for the best choice." },
      { id: "tct7", kind: "fill", vi: "Điền từ: Tấm thẻ cuối có hình một … với chiếc mỏ neo.", q: "The last card shows a ___ with an anchor.", options: ["boat", "plane", "train"], answer: "boat", say: "The last card shows a boat with an anchor." },
    ],
  },
  {
    id: "talentshow", title: "Describe the Talent Show", vi: "Mô tả hội diễn tài năng", image: L2 + "level-2-unit-03-school-talent-show.webp",
    emojis: ["🎸", "🎩", "🃏", "🎤", "✨", "🎭"],
    intro: "Nhìn hậu trường hội diễn. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tsh1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["A girl is playing the guitar.", "A girl is riding a bike.", "A girl is cooking soup."], answer: "A girl is playing the guitar.", say: "A girl is playing the guitar." },
      { id: "tsh2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A boy is holding playing cards.", "A top hat is on the floor.", "A lion is singing on stage."], answer: "A lion is singing on stage.", say: "There is no lion; the children are performing." },
      { id: "tsh3", kind: "fill", vi: "Điền từ: Nhà ảo thuật đang mặc một chiếc …", q: "The magician is wearing a ___.", options: ["cape", "raincoat", "apron"], answer: "cape", say: "The magician is wearing a cape." },
      { id: "tsh4", kind: "position", vi: "Chiếc micro ở đâu?", q: "Where is the microphone?", options: ["on the stage", "under the table", "inside the trunk"], answer: "on the stage", say: "The microphone is on the stage." },
      { id: "tsh5", kind: "arrange", vi: "Xếp câu: Một bạn nữ đang chơi ghi ta.", solution: ["A", "girl", "is", "playing", "the", "guitar"], say: "A girl is playing the guitar." },
      { id: "tsh6", kind: "arrange", vi: "Xếp câu: Nhà ảo thuật cầm vài lá bài.", solution: ["The", "magician", "holds", "some", "cards"], say: "The magician holds some cards." },
      { id: "tsh7", kind: "fill", vi: "Điền từ: Một cậu bé nhìn trộm qua tấm …", q: "A boy is peeking through the ___.", options: ["curtain", "window", "door"], answer: "curtain", say: "A boy is peeking through the curtain." },
    ],
  },
  {
    id: "gardenmystery", title: "Describe the Garden Mystery", vi: "Mô tả bí ẩn khu vườn", image: L2 + "level-2-unit-06-community-garden-mystery.webp",
    emojis: ["🥕", "🍅", "🔍", "🦝", "🚿", "👣"],
    intro: "Nhìn khu vườn chung. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tgm1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are looking for clues in the garden.", "The children are swimming.", "The children are sleeping."], answer: "The children are looking for clues in the garden.", say: "The children are looking for clues in the garden." },
      { id: "tgm2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A watering can is on the ground.", "A girl is holding a magnifying glass.", "A tiger is eating the plants."], answer: "A tiger is eating the plants.", say: "There is no tiger; a raccoon made the mess." },
      { id: "tgm3", kind: "fill", vi: "Điền từ: Bạn nữ dùng một chiếc … để soi dấu vết.", q: "The girl is using a ___ to look at the prints.", options: ["magnifying glass", "spoon", "hat"], answer: "magnifying glass", say: "The girl is using a magnifying glass to look at the prints." },
      { id: "tgm4", kind: "position", vi: "Con gấu mèo ở đâu?", q: "Where is the raccoon?", options: ["in the compost bin", "in the sky", "under the water"], answer: "in the compost bin", say: "The raccoon is in the compost bin." },
      { id: "tgm5", kind: "arrange", vi: "Xếp câu: Một con gấu mèo đang trốn trong thùng.", solution: ["A", "raccoon", "is", "hiding", "in", "the", "bin"], say: "A raccoon is hiding in the bin." },
      { id: "tgm6", kind: "arrange", vi: "Xếp câu: Bình tưới nằm trên mặt đất.", solution: ["The", "watering", "can", "is", "on", "the", "ground"], say: "The watering can is on the ground." },
      { id: "tgm7", kind: "fill", vi: "Điền từ: Các bạn tìm thấy dấu … thú trong bùn.", q: "The children found ___ prints in the mud.", options: ["paw", "hand", "bird"], answer: "paw", say: "The children found paw prints in the mud." },
    ],
  },
  {
    id: "aquarium", title: "Describe the Aquarium", vi: "Mô tả thủy cung về đêm", image: L2 + "level-2-unit-09-aquarium-night-mystery.webp",
    emojis: ["🐙", "🔦", "⚠️", "🪣", "🌊", "🕐"],
    intro: "Nhìn thủy cung ban đêm. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "taq1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are at an aquarium at night.", "The children are at a beach party.", "The children are in a classroom."], answer: "The children are at an aquarium at night.", say: "The children are at an aquarium at night." },
      { id: "taq2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["An octopus is in the tank.", "The floor is wet.", "A dog is swimming in the tank."], answer: "A dog is swimming in the tank.", say: "There is no dog; an octopus is in the tank." },
      { id: "taq3", kind: "fill", vi: "Điền từ: Cậu bé cầm một chiếc … để nhìn trong bóng tối.", q: "The boy is holding a ___ to see in the dark.", options: ["flashlight", "spoon", "kite"], answer: "flashlight", say: "The boy is holding a flashlight to see in the dark." },
      { id: "taq4", kind: "position", vi: "Biển cảnh báo ở đâu?", q: "Where is the caution sign?", options: ["on the wet floor", "in the sky", "inside the tank"], answer: "on the wet floor", say: "The caution sign is on the wet floor." },
      { id: "taq5", kind: "arrange", vi: "Xếp câu: Sàn nhà bị ướt và trơn.", solution: ["The", "floor", "is", "wet", "and", "slippery"], say: "The floor is wet and slippery." },
      { id: "taq6", kind: "arrange", vi: "Xếp câu: Một con bạch tuộc sống trong bể.", solution: ["An", "octopus", "lives", "in", "the", "tank"], say: "An octopus lives in the tank." },
      { id: "taq7", kind: "fill", vi: "Điền từ: Các bạn thấy một con … trong bể lớn.", q: "They see an ___ in the big tank.", options: ["octopus", "airplane", "apple"], answer: "octopus", say: "They see an octopus in the big tank." },
    ],
  },
  {
    id: "cookingworkshop", title: "Describe the Cooking Workshop", vi: "Mô tả lớp nấu ăn", image: L2 + "level-2-unit-16-cooking-workshop-mix-up.webp",
    emojis: ["🧁", "🫐", "🍫", "⏲️", "🥣", "📋"],
    intro: "Nhìn lớp làm bánh. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tcw1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are baking muffins.", "The children are washing a car.", "The children are flying a kite."], answer: "The children are baking muffins.", say: "The children are baking muffins." },
      { id: "tcw2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["One bowl has blueberry batter.", "One bowl has chocolate batter.", "A cat is stirring the bowl."], answer: "A cat is stirring the bowl.", say: "No cat is stirring; the children are baking." },
      { id: "tcw3", kind: "fill", vi: "Điền từ: Tô bột nhạt màu có … bên trong.", q: "The pale batter has ___ in it.", options: ["blueberries", "rocks", "socks"], answer: "blueberries", say: "The pale batter has blueberries in it." },
      { id: "tcw4", kind: "position", vi: "Chiếc đồng hồ hẹn giờ ở đâu?", q: "Where is the timer?", options: ["on the table", "in the sky", "under the floor"], answer: "on the table", say: "The timer is on the table." },
      { id: "tcw5", kind: "arrange", vi: "Xếp câu: Chúng mình đang làm bánh muffin việt quất.", solution: ["We", "are", "making", "blueberry", "muffins"], say: "We are making blueberry muffins." },
      { id: "tcw6", kind: "arrange", vi: "Xếp câu: Tô bột sô-cô-la có màu nâu.", solution: ["The", "chocolate", "batter", "is", "brown"], say: "The chocolate batter is brown." },
      { id: "tcw7", kind: "fill", vi: "Điền từ: Các thẻ chỉ các … theo thứ tự.", q: "The step cards show the ___ in order.", options: ["steps", "stars", "shoes"], answer: "steps", say: "The step cards show the steps in order." },
    ],
  },
  {
    id: "wildlifecam", title: "Describe the Wildlife Camera", vi: "Mô tả máy ảnh rừng", image: L2 + "level-2-unit-14-wildlife-camera-surprise.webp",
    emojis: ["📷", "🦝", "👣", "🏕️", "🔦", "🔭"],
    intro: "Nhìn khu cắm trại bên hồ. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "twc1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are looking at wildlife photos.", "The children are swimming in the lake.", "The children are baking a cake."], answer: "The children are looking at wildlife photos.", say: "The children are looking at wildlife photos." },
      { id: "twc2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A camera is on the tree.", "There are paw prints in a photo.", "A dinosaur is sitting at the table."], answer: "A dinosaur is sitting at the table.", say: "There is no dinosaur; they study animal photos." },
      { id: "twc3", kind: "fill", vi: "Điền từ: Một chiếc máy ảnh … đã chụp ảnh vào ban đêm.", q: "A ___ camera took pictures at night.", options: ["trail", "toy", "paper"], answer: "trail", say: "A trail camera took pictures at night." },
      { id: "twc4", kind: "position", vi: "Chiếc đèn lồng ở đâu?", q: "Where is the lantern?", options: ["on the table", "in the lake", "on the roof"], answer: "on the table", say: "The lantern is on the table." },
      { id: "twc5", kind: "arrange", vi: "Xếp câu: Một con gấu mèo đã đến vào ban đêm.", solution: ["A", "raccoon", "came", "at", "night"], say: "A raccoon came at night." },
      { id: "twc6", kind: "arrange", vi: "Xếp câu: Máy ảnh đã chụp rất nhiều tấm hình.", solution: ["The", "camera", "took", "many", "photos"], say: "The camera took many photos." },
      { id: "twc7", kind: "fill", vi: "Điền từ: Những tấm ảnh cho thấy dấu … thú trong bùn.", q: "The photos show animal ___ in the mud.", options: ["prints", "books", "hats"], answer: "prints", say: "The photos show animal prints in the mud." },
    ],
  },
  {
    id: "teamproject", title: "Describe the Team Project", vi: "Mô tả buổi chọn dự án", image: L3 + "collection-01-making-choices/level-3-c01-unit-03-choosing-team-project.webp",
    emojis: ["🌱", "🔆", "🗺️", "🐝", "💡", "🧩"],
    intro: "Nhìn buổi chọn dự án nhóm. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "ttj1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are choosing a team project.", "The children are riding bikes.", "The children are sailing a boat."], answer: "The children are choosing a team project.", say: "The children are choosing a team project." },
      { id: "ttj2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["One model has a solar panel.", "One model is a city map.", "A robot is teaching the class."], answer: "A robot is teaching the class.", say: "No robot is teaching; a teacher helps them." },
      { id: "ttj3", kind: "fill", vi: "Điền từ: Tấm pin … sạc điện thoại bằng ánh nắng.", q: "The ___ panel charges the phone with sunlight.", options: ["solar", "paper", "ice"], answer: "solar", say: "The solar panel charges the phone with sunlight." },
      { id: "ttj4", kind: "position", vi: "Những con ong ở đâu?", q: "Where are the bees?", options: ["in the flower model", "in the sky", "under the sea"], answer: "in the flower model", say: "The bees are in the flower model." },
      { id: "ttj5", kind: "arrange", vi: "Xếp câu: Chúng mình đang chọn một dự án nhóm.", solution: ["We", "are", "choosing", "a", "team", "project"], say: "We are choosing a team project." },
      { id: "ttj6", kind: "arrange", vi: "Xếp câu: Tấm pin mặt trời tạo ra điện.", solution: ["The", "solar", "panel", "makes", "power"], say: "The solar panel makes power." },
      { id: "ttj7", kind: "fill", vi: "Điền từ: Cô giáo cho xem một … nhóm trên máy tính bảng.", q: "The teacher shows a team ___ on her tablet.", options: ["diagram", "dinner", "dog"], answer: "diagram", say: "The teacher shows a team diagram on her tablet." },
    ],
  },
  {
    id: "greenfestival", title: "Describe the Green Festival", vi: "Mô tả lễ hội trường xanh", image: L3 + "collection-03-solving-problems/level-3-c03-unit-03-greener-school-festival.webp",
    emojis: ["♻️", "🌱", "💧", "🔆", "🏮", "🎪"],
    intro: "Nhìn lễ hội trường xanh. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tgf1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are sorting waste into bins.", "The children are swimming.", "The children are sleeping."], answer: "The children are sorting waste into bins.", say: "The children are sorting waste into bins." },
      { id: "tgf2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["There are three sorting bins.", "A girl is hanging flags.", "A whale is filling a bottle."], answer: "A whale is filling a bottle.", say: "There is no whale; children fill reusable bottles." },
      { id: "tgf3", kind: "fill", vi: "Điền từ: Các bạn đổ đầy bình … tại trạm nước.", q: "They fill their ___ bottles at the water station.", options: ["reusable", "paper", "glass"], answer: "reusable", say: "They fill their reusable bottles at the water station." },
      { id: "tgf4", kind: "position", vi: "Tấm pin mặt trời ở đâu?", q: "Where is the solar panel?", options: ["on the table", "in the sky", "in the bin"], answer: "on the table", say: "The solar panel is on the table." },
      { id: "tgf5", kind: "arrange", vi: "Xếp câu: Các bạn phân loại rác.", solution: ["The", "children", "sort", "the", "waste"], say: "The children sort the waste." },
      { id: "tgf6", kind: "arrange", vi: "Xếp câu: Chúng mình đổ nước đầy bình.", solution: ["We", "fill", "our", "bottles", "with", "water"], say: "We fill our bottles with water." },
      { id: "tgf7", kind: "fill", vi: "Điền từ: Thùng xanh dương dùng để …", q: "The blue bin is for ___.", options: ["recycling", "food", "clothes"], answer: "recycling", say: "The blue bin is for recycling." },
    ],
  },
  {
    id: "recessspace", title: "Describe the Recess Space", vi: "Mô tả sân chơi", image: L3 + "collection-03-solving-problems/level-3-c03-unit-10-designing-a-better-recess-space.webp",
    emojis: ["🏀", "🛝", "🧩", "♿", "🌳", "📋"],
    intro: "Nhìn buổi thiết kế sân chơi. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "trs1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are planning a new play space.", "The children are cooking dinner.", "The children are sailing a boat."], answer: "The children are planning a new play space.", say: "The children are planning a new play space." },
      { id: "trs2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A boy is using crutches.", "Children are playing basketball.", "A dragon is flying over the court."], answer: "A dragon is flying over the court.", say: "There is no dragon; children play in the yard." },
      { id: "trs3", kind: "fill", vi: "Điền từ: Bạn nữ cầm một tấm thẻ … để chấm điểm các ý tưởng.", q: "The girl is holding a ___ card to score the ideas.", options: ["rating", "birthday", "bus"], answer: "rating", say: "The girl is holding a rating card to score the ideas." },
      { id: "trs4", kind: "position", vi: "Vòng rổ bóng ở đâu?", q: "Where is the basketball hoop?", options: ["on the court", "in the classroom", "under the sea"], answer: "on the court", say: "The basketball hoop is on the court." },
      { id: "trs5", kind: "arrange", vi: "Xếp câu: Các bạn lên kế hoạch một sân chơi mới.", solution: ["The", "children", "plan", "a", "new", "play", "space"], say: "The children plan a new play space." },
      { id: "trs6", kind: "arrange", vi: "Xếp câu: Một cậu bé đang xếp các viên gạch.", solution: ["A", "boy", "is", "placing", "the", "tiles"], say: "A boy is placing the tiles." },
      { id: "trs7", kind: "fill", vi: "Điền từ: Họ muốn sân chơi vui cho …", q: "They want the playground to be fun for ___.", options: ["everyone", "no one", "only adults"], answer: "everyone", say: "They want the playground to be fun for everyone." },
    ],
  },
  {
    id: "screentime", title: "Describe the Choice", vi: "Mô tả lựa chọn trong nhà", image: L3 + "collection-01-making-choices/level-3-c01-unit-02-screen-or-outdoor-time.webp",
    emojis: ["📱", "🎧", "🚲", "🧩", "☀️", "🌳"],
    intro: "Nhìn cảnh phòng khách. Chọn, xếp câu mô tả đúng — rồi nói theo Maple nhé!",
    tasks: [
      { id: "tsn1", kind: "choose", vi: "Chọn câu mô tả ĐÚNG bức tranh.", q: "Which sentence is TRUE about the picture?", options: ["The children are deciding between screens and going outside.", "The children are cooking dinner.", "The children are driving a car."], answer: "The children are deciding between screens and going outside.", say: "The children are deciding between screens and going outside." },
      { id: "tsn2", kind: "spot", vi: "Câu nào KHÔNG đúng với tranh?", q: "Which sentence is FALSE about the picture?", options: ["A boy is holding a tablet.", "There are bicycles outside.", "A whale is sitting at the table."], answer: "A whale is sitting at the table.", say: "There is no whale; the friends are deciding what to do." },
      { id: "tsn3", kind: "fill", vi: "Điền từ: Ngoài trời nắng nên các bạn có thể đạp …", q: "Outside it is sunny, so they could ride ___.", options: ["bikes", "boats", "rockets"], answer: "bikes", say: "Outside it is sunny, so they could ride bikes." },
      { id: "tsn4", kind: "position", vi: "Chiếc tai nghe ở đâu?", q: "Where are the headphones?", options: ["on the table", "in the garden", "in the sky"], answer: "on the table", say: "The headphones are on the table." },
      { id: "tsn5", kind: "arrange", vi: "Xếp câu: Hôm nay chúng mình có thể chơi ngoài trời.", solution: ["We", "can", "play", "outside", "today"], say: "We can play outside today." },
      { id: "tsn6", kind: "arrange", vi: "Xếp câu: Máy tính bảng đang chiếu một trò chơi điện tử.", solution: ["The", "tablet", "shows", "a", "video", "game"], say: "The tablet shows a video game." },
      { id: "tsn7", kind: "fill", vi: "Điền từ: Bảng có các biểu tượng … như nắng và mưa.", q: "The board shows ___ icons like sun and rain.", options: ["weather", "money", "music"], answer: "weather", say: "The board shows weather icons like sun and rain." },
    ],
  },
];
export const talkSceneById = (id: string) => TALK_SCENES.find((s) => s.id === id);
export function randomTalkScene(): TalkScene {
  return TALK_SCENES[Math.floor(Math.random() * TALK_SCENES.length)];
}
