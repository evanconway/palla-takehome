# Palla Takehome Interview

create a simple e-commerce web app that enables customers to browse available products, add them to their cart, see the total price, and "checkout", i.e. finalize their cart.

please create an API that powers this experience. additionally, the API should allow for new products to be added to the site's inventory.

we use nextjs <14 atm with xstate for handling state but as far as stack, feel free to use what is most comfortable for you -- and skip the database / 3rd party solutions and just store everything in memory...no need for authentication, styling or anything else not central to functionality.

please use github or similar to host the repo, and please make the project easy for me to run on my machine. dont worry about hosting or deploying.

## Running The App

To run this app, clone the repo to your machine. Make sure you have the latest version of Node installed. Navigate to the cloned directory and run:

`npm i`
`npm run dev`

You should now see a plain Browse Products page with no products. To seed with test data run:

`npm run seed`

Refresh the page and you should now see a paginated list of imaginary products. You made view these products, add them to your cart, and checkout to create orders totalling the sum of all items in your cart.

## Add Product Endpoint

You may also add products to the list. The endpoint is `<app domain>/api/product/create`. The request should use the post method and the body contents should contain the following fields:

| name         | type    |
| ------------ | ------- |
| name         | string  |
| imageURL     | string  |
| description  | string  |
| priceInCents | integer |
| count        | integer |

Here's an example fetch request in javascript to add a teapot to the product inventory:

```javascript
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
```
