let api = "http://localhost:7777/products";
let apiUsers = "http://localhost:7777/users";

// ---------------
let regOpen = document.getElementById("reg-open");
let regLogin = document.getElementById("regLogin");
let regMail = document.getElementById("regMail");
let regPass = document.getElementById("regPass");
let btnReg = document.getElementById("btnReg");
let btnRegClose = document.getElementById("btnRegClose");
let regModal = document.querySelector(".reg-modal");
let adminPanel = document.getElementById("adminPanel");
let btnDelete = document.querySelector(".btnDelete");
let btnEdit = document.querySelector(".btnEdit");
let btnCart = document.querySelector(".btnCart");

regOpen.addEventListener("click", () => {
  regModal.style.display = "flex";
});

btnRegClose.addEventListener("click", () => {
  regModal.style.display = "none";
});

btnReg.addEventListener("click", () => {
  if (
    !regLogin.value.trim() ||
    !regMail.value.trim() ||
    !regPass.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }
  let user = {
    login: regLogin.value,
    mail: regMail.value,
    password: regPass.value,
    isAdmin: false,
  };
  fetch(apiUsers, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  regLogin.value = "";
  regMail.value = "";
  regPass.value = "";
  regModal.style.display = "none";
  alert("Вы успешно зарегистрировались");
});

// -------------------

let authOpen = document.getElementById("auth-open");
let authLogin = document.getElementById("authLogin");
let authMail = document.getElementById("authMail");
let authPass = document.getElementById("authPass");
let btnAuth = document.getElementById("btnAuth");
let btnAuthClose = document.getElementById("btnAuthClose");
let authModal = document.querySelector(".auth-modal");
let userNick = document.getElementById("userNick");
let logOutBtn = document.getElementById("logOut");
let logUser = [];
let adminRole = false;
let isLogin = false;
let userName;

logOutBtn.addEventListener("click", () => {
  isLogin = false;
  readProducts();
  localStorage.removeItem("karina&aman");
  userNick.innerHTML = "";
  window.location.reload();
});

authOpen.addEventListener("click", () => {
  authModal.style.display = "flex";
});

btnAuthClose.addEventListener("click", () => {
  authModal.style.display = "none";
});

btnAuth.addEventListener("click", () => {
  if (
    !authLogin.value.trim() ||
    !authMail.value.trim() ||
    !authPass.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }
  let user = {
    login: authLogin.value,
    mail: authMail.value,
    password: authPass.value,
  };
  let userCheck = false;
  fetch(apiUsers)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        if (
          item.login == user.login &&
          item.mail == user.mail &&
          item.password == user.password
        ) {
          userCheck = true;
          logUser = item;
          userName = logUser.login;
        }
      });
      if (userCheck) {
        localStorage.setItem(
          "karina&aman",
          JSON.stringify([userName, adminRole])
        );
        isLogin = true;
        authModal.style.display = "none";
        readProducts();
      } else {
        alert("Такого пользователя не существует");
        authModal.style.display = "none";
      }
      if (logUser.isAdmin) {
        let adminCheck = JSON.parse(localStorage.getItem("karina&aman"));
        adminRole = true;
        adminPanel.style.display = "block";
        localStorage.setItem(
          "karina&aman",
          JSON.stringify([userName, adminRole])
        );
      }
      if (isLogin) {
        showIfLogIn(userName);
        readProducts();
      }
    });
  authLogin.value = "";
  authMail.value = "";
  authPass.value = "";
});

function showIfLogIn(item) {
  regOpen.style.display = "none";
  authOpen.style.display = "none";
  logOutBtn.style.display = "block";
  userNick.innerText = item;
}

// add panel
let inpName = document.getElementById("inpName");
let inpFormat = document.getElementById("inpFormat");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let inpDetails = document.getElementById("inpDetails");
let inpCategory = document.getElementById("inpCategory");
let btnAddProduct = document.getElementById("btnAdd");
let adminPanelInner = document.getElementById("flush-collapseOne");
let sectionProducts = document.getElementById("sectionProducts");
let searchValue = "";
let category = "";

// pagination
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let currentPage = 1;
let countPage = 1;
//

// text cut
function textCut(text) {
  if (text.length > 33) {
    return text.slice(0, 30) + "...";
  }
  return text;
}

// add product logic
btnAddProduct.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpFormat.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim() ||
    !inpDetails.value.trim()
  ) {
    alert("Поля не могут быть пустыми");
    return;
  }
  let newProduct = {
    productName: inpName.value,
    productFormat: inpFormat.value,
    productImage: inpImage.value,
    productPrice: inpPrice.value,
    productCategory: inpCategory.value,
    productDetails: inpDetails.value,
  };
  createProducts(newProduct);
  readProducts();
});

// create
function createProducts(product) {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  }).then(() => readProducts());
  inpName.value = "";
  inpFormat.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  inpDetails.value = "";
  adminPanelInner.classList.toggle("show");
}

// read
function readProducts() {
  fetch(
    `${api}?q=${searchValue}&_page=${currentPage}&_limit=10&productCategory_like=${category}`
  )
    .then((res) => res.json())
    .then((data) => {
      sectionProducts.innerHTML = "";
      data.forEach((item) => {
        sectionProducts.innerHTML += `
        <div class="card m-3 shadow p-1 mb-5 bg-white rounded" style="width: 14rem; cursor: pointer">
          <img id="${item.id}" src="${item.productImage}" 
          class="card-img-top detailsCard" 
          style="height: 250px; object-fit: cover" alt="${item.productName}"/>
          <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between">
            <h5 class="card-title">
            ${textCut(item.productName)}
            </h5>
            <p class="card-text">
            ${item.productFormat}
            </p>
            <div>
            <h6 class="card-price" style = "color: #ba1051">
            ${item.productPrice}₽
            </h6>
            ${
              adminRole
                ? `<div style="display: flex; justify-content: center; justify-content: space-evenly">
            <button class="btn mt-1 btnDelete" style="background-color: #ba1051; color: white; display: flex" id="${item.id}">Delete</button>
            <button class="btn mt-1 btnEdit" style="background-color: #ba1051; color: white; display: flex" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">⠀Edit⠀</button>
            </div>`
                : ` `
            }
            ${
              isLogin
                ? `<button class="btn mt-1 btnCart" style="width: 100%; text-align: center; background-color: #ba1051; display: block;" id="${item.id}"><a href = "https://web.telegram.org/k/#@karinadnk98" target = "_blank" style = "text-decoration: none; color: white">Купить</a></button>`
                : ` `
            }
        </div> 
      </div>
    </div> `;
      });
      pageFunc();
    });
}
readProducts();

// delete
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${api}/${del_id}`, {
      method: "DELETE",
    }).then(() => readProducts());
  }
});

// edit
let editModal = document.getElementById("exampleModal");
let editInpName = document.getElementById("editInpName");
let editInpFormat = document.getElementById("editInpFormat");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editInpDetails = document.getElementById("editInpDetails");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${api}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.productName;
        editInpFormat.value = data.productFormat;
        editInpImage.value = data.productImage;
        editInpPrice.value = data.productPrice;
        editInpDetails.value = data.productDetails;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedProduct = {
    productName: editInpName.value,
    productFormat: editInpFormat.value,
    productImage: editInpImage.value,
    productPrice: editInpPrice.value,
    productDetails: editInpDetails.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});

function editProduct(editedProduct, id) {
  fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => readProducts());
}

// search
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (e) => {
  e.preventDefault();
  searchValue = e.target.value;
  readProducts();
});

// pagination
function pageFunc() {
  fetch(`${api}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 10);
    });
}

prevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});

nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});

// details
let detailsModal = document.getElementById("detailsModal");
let detailsModalBody = document.getElementById("detailsModalBody");
let detailsModalClose = document.getElementById("detailsModalClose");

document.addEventListener("click", (e) => {
  let classProduct = [...e.target.classList];
  if (classProduct.includes("detailsCard")) {
    productDetails(e.target.id);
    detailsModal.style.display = "flex";
  }
});

function productDetails(id) {
  try {
    fetch(`${api}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        detailsModalBody.innerHTML = `
        <div style="width: 35%">
        <img src="${data.productImage}" alt="" style = "width: 100%" />
      </div>
      <div style="width: 60%; height: 25rem; display: flex; flex-direction: column; justify-content: space-between">
        <div>
        <h6>${data.productName}</h6>
        <p style = "font-size: 14px">${data.productDetails}</p>
        </div>
        <div>
        <p >Категория: ${data.productCategory}</p>
        </div>
      </div>
        `;
      });
  } catch {
    console.log("Error");
  }
}

detailsModalClose.addEventListener("click", () => {
  detailsModal.style.display = "none";
});

// filter
let filterBtn = document.querySelectorAll(".filterBtn");
let filterAll = document.querySelector(".filterAll");

filterAll.addEventListener("click", () => {
  category = "";
  readProducts();
});

filterBtn.forEach((item) => {
  item.addEventListener("click", (e) => {
    category = e.target.innerText;
    readProducts();
  });
});

// -------------------------------------------------

// функции для предотвращения выхода из аккаунта

function saveLogIn() {
  let check = JSON.parse(localStorage.getItem("karina&aman"));
  if (check) {
    isLogin = true;
    authModal.style.display = "none";
    readProducts();
    showIfLogIn(check[0]);
  }
}
saveLogIn();

function saveAdmin() {
  let check = JSON.parse(localStorage.getItem("karina&aman"));
  if (check[1]) {
    // ошибка в консоли выходит только тогда, когда вы не залогинены. Это не баг, а фича
    adminRole = true;
    adminPanel.style.display = "block";
    readProducts();
    showIfLogIn(check[0]);
  }
}
saveAdmin();
