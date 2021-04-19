// Storage Controller
const StorageController = (() => {
    // public
    return {
        addProduct: function (product) {
            let products;

            if (localStorage.getItem('products') == null) {
                products = [];
                products.push(product);
            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function () {
            let products;

            if (localStorage.getItem('products') == null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem('products'));
            }

            return products;
        },
        uptadeProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function (prd, index) {
                if (product.id == prd.id) {
                    products.splice(index, 1, product);
                }
            });

            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function (prd, index) {
                if (product.id == prd.id) {
                    products.splice(index, 1);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }

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
        products: StorageController.getProducts(),
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
        setProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;

        },
        deleteProduct: function (product) {
            data.products.forEach((prd, index) => {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
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
        productListItems: '#products-list tr',
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
                        <i style="cursor:pointer;" title="Edit Product" class="fa fa-edit bg-warning p-2 font-weight-bold product-edit" aria-hidden="true" data-id="${product.id}"></i>
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
        uptadeProduct: function (product) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = product.name;
                    item.children[2].textContent = `$${product.price}`;
                    updatedItem = item;
                }
            });

            return updatedItem;
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
        clearWarnings: () => {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
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
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach((item) => {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        addingState: function () {
            UIController.clearWarnings();
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
const AppController = ((ProductCtrl, UICtrl, StorageCtrl) => {

    const UISelector = UICtrl.getSelectors();

    //load event listeners
    const loadEventListeners = () => {
        // add product event
        document.querySelector(UISelector.buttonAdd).addEventListener('click', productAddSubmit);

        // edit product click
        document.querySelector(UISelector.productList).addEventListener('click', productEditSubmit);

        // edit product submit
        document.querySelector(UISelector.buttonUpdate).addEventListener('click', productUpdate);

        // cancel event
        document.querySelector(UISelector.buttonCancel).addEventListener('click', productCancel);

        // delete event
        document.querySelector(UISelector.buttonDelete).addEventListener('click', productDelete);
    }

    // product add
    const productAddSubmit = ((e) => {

        const productName = document.querySelector(UISelector.productName).value;
        const productPrice = document.querySelector(UISelector.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            // add product to LS
            StorageCtrl.addProduct(newProduct);

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

    // product update
    const productUpdate = ((e) => {

        const productName = document.querySelector(UISelector.productName).value;
        const productPrice = document.querySelector(UISelector.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            // setProduct
            const updatedProduct = ProductCtrl.setProduct(productName, productPrice);

            // updated product ui
            UICtrl.uptadeProduct(updatedProduct);

            // get Total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            // set product to LS
            StorageCtrl.uptadeProduct(updatedProduct);

            // clear inputs
            UICtrl.clearInputs();

            // adding state
            UICtrl.addingState();


        } else {
            alert('Please fill in the relevant fields.');
        }

        e.preventDefault();
    });

    // product cancel
    const productCancel = ((e) => {

        // adding state
        UICtrl.addingState();

        // clear bg warnings
        UIController.clearWarnings();

        // clear inputs
        UICtrl.clearInputs();

        e.preventDefault();
    });

    // product delete
    const productDelete = ((e) => {

        // get selected product
        let selectedProduct = ProductCtrl.getCurrentProduct();

        // delete product
        ProductCtrl.deleteProduct(selectedProduct);

        // delete ui
        UICtrl.deleteProduct();

        // get Total
        const total = ProductCtrl.getTotal();

        // show total
        UICtrl.showTotal(total);

        // set product to LS
        StorageCtrl.deleteProduct(selectedProduct);

        // clear inputs
        UICtrl.clearInputs();

        // adding state
        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
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

            // total
            const total = ProductCtrl.getTotal();

            // show total ui
            UIController.showTotal(total);

            loadEventListeners();
        }
    }

})(ProductController, UIController, StorageController);

AppController.init();