const Products = {
    /**
     * Takes a JSON representation of the products and renders cards to the DOM
     * @param {Object} productsJson
     */
     displayProducts: (productsJson) => {
      console.log(productsJson);
      const productsContainer = document.getElementById("productsContainer"); // Assuming you have a container element with id "productsContainer"
    
      // Clear existing products
      productsContainer.innerHTML = "";
    
      // Loop through each product
      productsJson.products.edges.forEach((product) => {
        const { id, title, description, images, priceRange, compareAtPriceRange } = product.node;
    
        // Create a div for the product
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
          <img src="${images.edges[0].node.originalSrc}" alt="${title}" />
          <h3>${title}</h3>
          <p>${description}</p>
          <p>Price: ${priceRange.minVariantPrice.amount} ${priceRange.minVariantPrice.currencyCode}</p>
          <p>Was: ${compareAtPriceRange.minVariantPrice.amount} ${compareAtPriceRange.minVariantPrice.currencyCode}</p>
          <button>Buy Now</button>
        `;
    
        // Append the product div to the container
        productsContainer.appendChild(productDiv);
      });
    },
    
  
    state: {
      storeUrl: "https://m-p-technical-test.myshopify.com/api/2023-01/graphql.json",
      contentType: "application/json",
      accept: "application/json",
      accessToken: "bc47fff02556a8e3426af638bcf634ac",
    },
  
    /**
     * Sets up the query string for the GraphQL request
     * @returns {String} A GraphQL query string
     */
    query: () => `
      {
        products(first: 3) {
          edges {
            node {
              id
              handle
              title
              description
              tags
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
  
    /**
     * Fetches the products via GraphQL then runs the display function
     */
    handleFetch: async () => {
      const productsResponse = await fetch(Products.state.storeUrl, {
        method: "POST",
        headers: {
          "Content-Type": Products.state.contentType,
          Accept: Products.state.accept,
          "X-Shopify-Storefront-Access-Token": Products.state.accessToken,
        },
        body: JSON.stringify({
          query: Products.query(),
        }),
      });
      const productsResponseJson = await productsResponse.json();
      Products.displayProducts(productsResponseJson.data);
    },
  
    /**
     * Sets up the click handler for the fetch button
     */
    initialize: () => {
      // Add click handler to fetch button
      const fetchButton = document.querySelector(".fetchButton");
      if (fetchButton) {
        fetchButton.addEventListener("click", Products.handleFetch);
      }
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    Products.initialize();
  });