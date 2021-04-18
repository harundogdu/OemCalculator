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
        products: [],
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
        },
        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products.length;
            } else {
                id = 0;
            }

            const newProduct = new Products(id, name, parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
        }
    }

})();

// UI Controller
const UIController = (() => {
    //private
    const Selectors = {
        productList: '#products-list',
        productName: '#productName',
        productPrice: '#productPrice',
        buttonAdd: '.btnAdd',
        productCard: '#productCard',
        totalCard: '#totalCard'

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
                        <button title="Edit Product" class="btn btn-warning btn-sm btnEdit" type="submit">
                            <i class="fa fa-edit" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: () => {
            return Selectors;
        },
        addProduct: function (product) {
            document.querySelector(Selectors.productCard).style.display = 'block';
            document.querySelector(Selectors.totalCard).style.display = 'block';
            var item =
                `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td class="text-right">
                        <button title="Edit Product" class="btn btn-warning btn-sm btnEdit" type="submit">
                            <i class="fa fa-edit" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>
                `;

            document.querySelector(Selectors.productList).innerHTML += item;

        },
        clearInputs: () => {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard: () => {
            document.querySelector(Selectors.productCard).style.display = 'none';
            document.querySelector(Selectors.totalCard).style.display = 'none';
        }
    }

})();

// App Controller
const AppController = ((ProductCtrl, UICtrl) => {

    const UISelector = UICtrl.getSelectors();

    //load event listeners
    const loadEventListeners = () => {
        document.querySelector(UISelector.buttonAdd).addEventListener('click', productAddSubmit);
    }

    const productAddSubmit = ((e) => {

        const productName = document.querySelector(UISelector.productName).value;
        const productPrice = document.querySelector(UISelector.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            // clear inputs
            UICtrl.clearInputs();
        } else {
            alert('Please fill in the relevant fields.');
        }

        e.preventDefault();
    });

    return {
        init: () => {
            console.log('starting app..');
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            loadEventListeners();
        }
    }

})(ProductController, UIController);

AppController.init();