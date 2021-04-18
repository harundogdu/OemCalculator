// Storage Controller
const StorageController = (() => {

})();

// Product Controller
const ProductController = (() => {
    // private

    const Products = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [{
                id: 0,
                name: 'Monitör',
                price: '1000'
            },
            {
                id: 1,
                name: 'Klavye',
                price: '200'
            },
            {
                id: 2,
                name: 'Ram',
                price: '400'
            },
            {
                id: 3,
                name: 'Mouse',
                price: '50'
            }
        ],
        selectedProduct: null,
        totalPrice: 0
    }

    //public

    return {
        getProducts: () => {
            return data.products
        },
        getData: () => {
            return data
        }
    }

})();

// UI Controller
const UIController = (() => {
    //private
    const Selectors = {
        productList: '#products-list'
    }

    //public
    return {
        createProductList: (products) => {
            let html = "";

            products.forEach(product => {
               html +=
                    `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td class="text-right">
                        <button id="btnEdit" class="btn btn-warning btn-sm" type="submit">
                            <i class="fa fa-edit" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        }
    }

})();

// App Controller
const AppController = ((ProductCtrl, UICtrl) => {

    return {
        init: () => {
            console.log('starting app..');
            let products = ProductCtrl.getProducts();
            UICtrl.createProductList(products);
        }
    }

})(ProductController, UIController);

AppController.init();