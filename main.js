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

        <div class="cart">
          <p>Cart({{cart}})</p>
        </div>

        <div>
          <p>{{printProduct}}</p>
        </div>

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
      cart: 0
    }
  },
  methods: {
    addToCart: function() {
      this.cart += 1
    },
    updateProduct: function(index) {
      this.selectedVariant = index
      console.log(index)
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
    }
  }

})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    details: ''
  }
})