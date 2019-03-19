Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    

    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null
    }
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image">
      </div>

      <div class="product-info">
        <h1>{{title}}</h1>
        <p v-if="variants[selectedVariant].variantQuantity > 10">In stock</p>
        <p v-else-if="variants[selectedVariant].variantQuantity<=10 && variants[selectedVariant].variantQuantity>0">Almost sold out!</p>
        <p v-else :class="{ lineThrough: !inStock }">Out of stock</p>
        <p>Shipping: {{ shipping }}</p>
        <p v-show="onSale">On sale!</p>

        <product-details :details="details"></product-details>

        <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart" 
                :disabled="!inStock" 
                :class="{ disabledButton: !inStock }">Add to Cart</button>
        
        <button v-on:click="removeFromCart">Remove</button>

        <div>
          <p>{{printProduct}}</p>
        </div>

        <div>
          <h2>Reviews</h2>
          <p>There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">{{ review }}</li>
          </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>

      </div>
      
    </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      details: ['80% cotton', '20% polyester', 'gender-neutral'],
      selectedVariant: 0,
      inventory: 0,
      onSale: true,
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
          variantQuantity: 0
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
          variantQuantity: 30
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeFromCart: function() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct: function(index) {
      this.selectedVariant = index
      console.log(index)
    },
    addReview(productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    printProduct() {
      if(this.onSale) {return `${this.title} are currently on sale in your area, grab a pair before the sale ends!`}
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return 2.99
    },
  }

})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    updateCartRemove(id) {
      var index = this.cart.indexOf(id)
      this.cart.splice(index, 1)
    }
  }
})