fetch("http://localhost:3000/api/product/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "teapot",
    imageURL:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQoVN3VFNeWGVpB4c1jcq52N7q3PVynIrkZByKdvY6u3s-A1Q7vWpPud-haMQz8ZtzTQj27_FPEjJk8x3U4r0xIqLD35-UMpfvmGpiAHIBtfIzA6aq0XJRDQ3w",
    priceInCents: 10000,
    count: 42,
    description:
      "A high quality teapot perfect for serving tea with friends and family.",
  }),
});
