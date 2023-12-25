let bookList = [],
    basketList = [];
let totalPrice = 0;
let btnCheck;

// toggle menu

const toggleModal = () => {
    const basketModal = document.querySelector(".basket_modal");
    basketModal.classList.toggle("active");

};

const getBooks = () => {
    fetch("./products.json")
        .then((res) => res.json())
        .then((books) => (bookList = books))
        .catch((err) => console.log(err));
};
getBooks();

const createBookStars = (starRate) => {
    // console.log(starRate);
    let starRateHtml = "";
    for (let i = 1; i <= 5; i++) {
        if (Math.round(starRate) >= i) {
            starRateHtml += `<i class="bi bi-star-fill active"></i>`;
        } else {
            starRateHtml += `<i class="bi bi-star-fill"></i>`;
        }

    }
    return starRateHtml;

}
const createBookItemHtml = () => {
    const bookListEl = document.querySelector(".book_list");
    let bookListHtml = "";

    bookList.forEach((book, index) => {
        // console.log(book);
        bookListHtml += `<div class="col-lg-5 col-sm-10 ${index % 2 == 0 && "offset-2 "} my-5 offset-md-1">
        <div class="row book_card">
            <div class="col-6">
                <img src="${book.imgSource}" class="img-fluid shadow" width="258px" height="400px" alt="">
            </div>
            <div class="col-6 d-flex flex-column justify-content-between gap-2 book_list-card-info">
                <div class="book_detail">
                    <span class="fos gray fs-7">${book.author}</span> <br>
                    <span class="fs-5 fw-bold">${book.name}</span>
                    <div class="book_star-rate">
                     ${createBookStars(book.starRate)}
                        <p class="gray">${book.reviewCount}</p>
                    </div>
                </div>
                <p class="book_description fos gray">
                    ${book.description}
                </p>
                <div>
                    <span class="black fw-bold fs-4 me-2 ">
                        ${book.price}tl
                    </span>
                    <span class="fs-4 fw-bold old_price">${book.oldPrice ? `<span class="fs-4 fw-bold old_price" >${book.oldPrice}tl</span>` : ""}</span>
                </div>
                <button class="btn_purple" onClick ="addBookToBasket(${book.id})"><i class="bi bi-cart3"></i>Sepete Ekle</button>
            </div>
        </div>
    </div>`;
    });
    bookListEl.innerHTML = bookListHtml;
}

const BOOK_TYPES = {

    ALL: "All",
    NOVEL: "Novel",
    CHILDREN: "Children",
    HISTORY: "History",
    FINANCE: "Finance",
    SCIENCE: "Science",
    SELFIMPROVEMENT: "Self Improvement",


};

const createBookTypesHtml = () => {
    const filterEle = document.querySelector(".filter");
    let filterHtml = "";
    let filterTypes = ["ALL"];
    bookList.forEach((book) => {
        if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
            filterTypes.push(book.type);
        }
    });
    filterTypes.forEach((type, index) => {
        // console.log(type);
        filterHtml += `<li onClick = "filterBooks(this)" data-types ="${type}" class="${index == 0 ? "active" : null}">${BOOK_TYPES[type] || type}</li>`
    });

    filterEle.innerHTML = filterHtml;

};
const filterBooks = (filterEl) => {
    document.querySelector(".filter .active").classList.remove("active");
    filterEl.classList.add("active");
    let bookType = filterEl.dataset.types;
    // console.log(bookType);
    getBooks()
    if (bookType !== "ALL") {
        bookList = bookList.filter((book) => book.type == bookType);

    }
    createBookItemHtml();
};


const listBasketItems = () => {
    const basketListEl = document.querySelector(".basket_list");
    const basketCountEl = document.querySelector(".basket_count");
    const totalQuantity = basketList.reduce((total, item) => total + item.quantity, 0);

    basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
    const totalPriceEle = document.querySelector(".total_price");
    console.log(totalPriceEle);
    let basketListHtml = "";
    let totalPrice = 0;
    basketList.forEach((item) => {

        totalPrice += item.product.price * item.quantity;
        basketListHtml += `<li class="basket_item">
    <img src="${item.product.imgSource}" width="100" height="100" />
    <div class="basket_item-info">
    <h3 class="book_name">${item.product.name}</h3>
    <span class="book_price">${item.product.price}tl</span> <br />
    <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book_count">
         <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
         <span class="mx-2">${item.quantity}</span>
         <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
    </li>`;
    });

    basketListEl.innerHTML = basketListHtml ? basketListHtml : `<li class="basket_item">Sepette Ürün Bulunmuyor.</li>`;
    totalPriceEle.innerHTML = totalPrice > 0 ? "Total:" + totalPrice.toFixed(2) + "tl" : null;

}
const addBookToBasket = (bookId) => {
    let findedBook = bookList.find(book => book.id == bookId);
    console.log(findedBook);
    if (findedBook) {
        const basketAlreadyIndex = basketList.findIndex(
            (basket) => basket.product.id == bookId);

        if (basketAlreadyIndex == -1) {
            let addItem = { quantity: 1, product: findedBook };
            basketList.push(addItem);

        } else {
            basketList[basketAlreadyIndex].quantity += 1;
            console.log(basketList);
        }
    }

    const btnCheck = document.querySelector(".btn-Check");
    btnCheck.style.display = "block";


    listBasketItems();
}

const removeItemBasket = (bookId) => {
    const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);
    if (findedIndex != -1) {
        basketList.splice(findedIndex, 1);
    }

    const btnCheck = document.querySelector(".btn-Check");
    btnCheck.style.display = basketList.length > 0 ? "block" : "none";
    listBasketItems();
}


const decreaseItemToBasket = (bookId) => {
    // console.log(bookId);
    const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);

    if (findedIndex != -1) {
        if (basketList[findedIndex].quantity != 1) {
            basketList[findedIndex].quantity -= 1;
        } else {
            removeItemBasket(bookId);
        }
    }
    listBasketItems();
};

increaseItemToBasket = (bookId) => {
    const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);

    if (findedIndex >= 0) {
        const stockLimit = basketList[findedIndex].product.stock;

        if (stockLimit && basketList[findedIndex].quantity < stockLimit) {
            basketList[findedIndex].quantity += 1;
            listBasketItems();
        } else if (stockLimit && basketList[findedIndex].quantity === stockLimit) {
            // Stok limitine ulaşıldı, kullanıcıya bilgi verilebilir.
            alert(`Stok limitine ulaşıldı. Bu üründen en fazla ${stockLimit} adet ekleyebilirsiniz.`);
        } else {
            // Eğer stok sınırlaması yoksa veya limiti belirlenmemişse sınırsız eklenmesine izin ver.
            basketList[findedIndex].quantity += 1;
            listBasketItems();
        }
    }
}

createBookTypesHtml();

createBookItemHtml();
setTimeout(() => {
    createBookTypesHtml();
    createBookItemHtml();
}, 100);