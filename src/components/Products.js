import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 * http://13.127.89.97:8082/api/v1/products
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const URL = config.endpoint + "/products";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const performAPICall = async (url) => {
    try {
      setIsLoading(true);
      const response = await axios.get(url);
      setIsLoading(false);
      // console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log("A");
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log("B");
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }

      console.log(error.config);
    }
  };

  useEffect(() => {
    performAPICall(URL);
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(false);
  const performSearch = async (text) => {
    try {
      console.log("text", text);
      const response = await axios.get(URL + "/search?value=" + text);
      console.log("response", response.data);
      setError(false);
      setProducts(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("A", error.request, error.response);
        setError(true);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const [debounceTimer, setDebounceTimer] = useState(0);
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }
    const newTimer = setTimeout(() => {
      performSearch(event);
    }, 500);

    setDebounceTimer(newTimer);
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => {
            debounceSearch(event.target.value, debounceTimer);
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {isLoading ? (
          <Box className="loading" sx={{ display: "flex" }}>
            <CircularProgress />
            <br />
            <p>Loading Products</p>
          </Box>
        ) : error ? (
          <Grid className="loading" item xs={12} md={12}>
          {console.log('A', error)}

            <SentimentDissatisfied />
            <br/>
            <p>No products found</p>
          </Grid>
        ) : (
          products.map((product) => (
            <Grid key={product._id} item xs={6} md={3}>
          {console.log('A', error)}
              <ProductCard product={product} handleAddToCart={() => {}} />
            </Grid>
          ))
        )    
        }
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
