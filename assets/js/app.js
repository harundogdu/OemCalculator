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
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
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
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach((product) => {
                total += product.price;
            });
            data.totalPrice = total
            return data.totalPrice;
        },
        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            });

            return product;
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
        buttonUpdate: '.btnUpdate',
        buttonDelete: '.btnDelete',
        buttonCancel: '.btnCancel',
        productCard: '#productCard',
        totalCard: '#totalCard',
        totalTRY: '#total-try',
        totalUSD: '#total-usd'
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
                    <td>$${product.price}</td>
                    <td class="text-right">
                        <i style="cursor:pointer;" title="Edit Product" class="fa fa-edit bg-warning p-2 font-weight-bold product-edit" aria-hidden="true"></i>
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
                    <td>$${product.price}</td>
                    <td class="text-right">
                            <i style="cursor:pointer;" title="Edit Product" class="fa fa-edit bg-warning p-2 font-weight-bold product-edit" aria-hidden="true" data-id="${product.id}"></i>
                    </td>
                </tr>
                `;

            document.querySelector(Selectors.productList).innerHTML += item;

        },
        showTotal: function (total) {
            let rate = 3.8;
            document.querySelector(Selectors.totalUSD).textContent = (total).toFixed(2);
            document.querySelector(Selectors.totalTRY).textContent = (parseFloat(total * rate)).toFixed(2);
        },
        clearInputs: () => {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard: () => {
            document.querySelector(Selectors.productCard).style.display = 'none';
            document.querySelector(Selectors.totalCard).style.display = 'none';
        },
        addProductToForm: function () {
            let product = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = product.name;
            document.querySelector(Selectors.productPrice).value = product.price;
        },
        addingState: function () {
            UIController.clearInputs();
            document.querySelector(Selectors.buttonAdd).style.display = "inline";
            document.querySelector(Selectors.buttonCancel).style.display = "none";
            document.querySelector(Selectors.buttonDelete).style.display = "none";
            document.querySelector(Selectors.buttonUpdate).style.display = "none";
        },
        editingState: function (tr) {
            const parent = tr.parentElement.children;

            for (let index = 0; index < parent.length; index++) {
                if (parent[index].classList.contains('bg-warning')) {
                    parent[index].classList.remove('bg-warning');
                }
            }

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.buttonAdd).style.display = "none";
            document.querySelector(Selectors.buttonCancel).style.display = "inline";
            document.querySelector(Selectors.buttonDelete).style.display = "inline";
            document.querySelector(Selectors.buttonUpdate).style.display = "inline";
        }
    }

})();

// App Controller
const AppController = ((ProductCtrl, UICtrl) => {

    const UISelector = UICtrl.getSelectors();

    //load event listeners
    const loadEventListeners = () => {
        document.querySelector(UISelector.buttonAdd).addEventListener('click', productAddSubmit);
        document.querySelector(UISelector.productList).addEventListener('click', productEditSubmit);
        document.querySelector(UISelector.buttonUpdate).addEventListener('click', productEditSubmit);
    }

    // product edit form
    const productEditSubmit = ((e) => {

        if (e.target.classList.contains('product-edit')) {

            // selected item
            const id = e.target.getAttribute('data-id');

            // getProduct by selected item
            const product = ProductCtrl.getProductById(id);

            // set current product
            ProductCtrl.setCurrentProduct(product);

            // edit interface
            UICtrl.addProductToForm();

            // editing area
            UICtrl.editingState(e.target.parentElement.parentElement);

        }

        e.preventDefault();
    });

    // product add
    const productAddSubmit = ((e) => {

        const productName = document.querySelector(UISelector.productName).value;
        const productPrice = document.querySelector(UISelector.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            // get Total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

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
            UICtrl.addingState();
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