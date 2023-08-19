const Products = {
    /**
     * Takes a JSON representation of the products and renders cards to the DOM
     * @param {Object} productsJson
     */
     displayProducts: (productsJson) => {

      // Grab product container
      const productsContainer = document.querySelector(".fp-products-container");
    
      // Clear existing products
      productsContainer.innerHTML = "";
    
      // Function to convert Shopify MoneyV2 object to a legible price
      const formatPrice = (MoneyV2) => {
        let amount = parseFloat(MoneyV2.amount);
        let locale = Shopify.locale + '-' + Shopify.country; //eg. 'en-GB'

        return amount.toLocaleString(locale, {
            style: 'currency',
            currency: MoneyV2.currencyCode
        });
      }

      // Loop through each product
      productsJson.products.edges.forEach((product) => {
        const { id, title, description, images, priceRange, compareAtPriceRange } = product.node;

        // Format prices
        const price = formatPrice(priceRange.minVariantPrice);
        const priceCompare = formatPrice(compareAtPriceRange.minVariantPrice);

        // Create a div for the product
        const productDiv = document.createElement("div");

        productDiv.classList.add("fp-product-card", "animate--fade-in");

        console.log(compareAtPriceRange.minVariantPrice);
        console.log(priceRange.minVariantPrice)

        productDiv.innerHTML = `
            <img src="${images.edges[0].node.originalSrc}" class="fp-product-card-image" alt="${title}" />
            <h3>${title}</h3>
            <div class="fp-product-card-price">
                <div class="fp-price">
                    ${price}
                </div>

                ${parseFloat(compareAtPriceRange.minVariantPrice.amount) > parseFloat(priceRange.minVariantPrice.amount) ? `<div class="fp-price-compare">${priceCompare}</div>` : ``}

            </div>
            <p>${description}</p>
            <a href="#" class="fp-cta inverse fluid">
                <div class="label">  
                    Buy Now
                </div> 
            </a>
        `;
    
        // Append the product div to the container
        productsContainer.appendChild(productDiv);
      });
    },
    
  
    state: {
      storeUrl: "",
      contentType: "application/json",
      accept: "application/json",
      accessToken: "",
      productsToShow: 3
    },
  
    /**
     * Sets up the query string for the GraphQL request
     * @returns {String} A GraphQL query string
     */
    query: (productsToShow) => `
      {
        products(first: ${productsToShow}) {
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
          query: Products.query(Products.state.productsToShow),
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
    // Pass GraphQL endpoint information to Products.state
    Object.assign(Products.state, featuredProductsSettings);

    Products.initialize();
  });