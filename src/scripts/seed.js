console.log("seeding database");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const generateRandomName = () => {
  const numOfWords = Math.floor(Math.random() * 4) + 1;
  let result = "";
  for (let i = 0; i < numOfWords; i++) {
    let word = "";
    const wordLength = Math.floor(Math.random() * 12) + 1;
    for (let c = 0; c < wordLength; c++) {
      const char = alphabet[Math.floor(Math.random() * alphabet.length)];
      word += c === 0 ? char.toLocaleUpperCase() : char;
    }
    if (i < numOfWords - 1) word += " ";
    result += word;
  }
  return result;
};

const seedTheInventory = async () => {
  for (let i = 0; i < 100; i++) {
    const res = await fetch("http://localhost:3000/api/product/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: generateRandomName(),
        imageURL: "",
        priceInCents: Math.floor(Math.random() * 100000) + 100,
        count: Math.floor(Math.random() * 100) + 1,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar odio metus, sit amet feugiat erat laoreet a. Praesent commodo ultricies tellus, id maximus libero porttitor eu. Duis viverra dui sit amet lacus rhoncus, ac imperdiet nibh gravida. Pellentesque egestas fringilla nunc, vel pharetra purus volutpat quis. Sed tincidunt, est vitae ultricies ultricies, nibh nulla mattis erat, eget ornare urna est quis nunc. Nulla facilisis magna non ex auctor, in tempus nibh pellentesque. Curabitur gravida nunc sagittis lacus tempus, ac convallis ante vestibulum. Vestibulum dui tortor, tincidunt at eleifend eget, lobortis a sapien. Quisque at metus risus. Mauris varius massa sed quam fringilla, nec interdum lorem accumsan.",
      }),
    });
    const data = await res.json();
    console.log(`${data["newProductId"]} added`);
  }
};

seedTheInventory();
