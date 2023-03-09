/** @format */

"use strict";
//accounts
const user1 = {
  owner: "Sachin Raj",
  movements: [100, 200, -10, 5000, -100, 2222, -100, 5000, -100],
  interestRate: 1.3,
  pin: 4444,
};
const user2 = {
  owner: "Mukesh Maj",
  movements: [100, 200, -1000, 5000, -100, 999, 560, -4500],
  interestRate: 1.3,
  pin: 3333,
};
const user3 = {
  owner: "Steffi Sharma",
  movements: [1100, 1200, -1110, 5000, -1700],
  interestRate: 1.3,
  pin: 2222,
};
const user4 = {
  owner: "Nischal Timalsina",
  movements: [100, 200, -10, 5000, -100],
  interestRate: 1.3,
  pin: 1111,
};
const accounts = [user1, user2, user3, user4];
//elements
//labels
const userInfo = document.querySelector(".userInfo");
const navigation = document.querySelector(".navigation");
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
//buttons
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

//input fields
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const Info = `
<div class="d-flex justify-content-center">
  <p class="lead m-0">Welcome to the Simple Pseudo Trasection Page. </p>
</div>
<div class="d-flex justify-content-center">
  <p class="d-block m-0">Username: ss Pin: 2222 </br> Username:sr Pin:4444 
  </p> 
</div>
<div class="d-flex justify-content-center">
  <button class="close__cookie">Ok</button>
</div>
`;
window.onload = (e) => {
  userInfo.insertAdjacentHTML("afterbegin", Info);
  const cookieClose = document.querySelector(".close__cookie");
  cookieClose.addEventListener("click", () => {
    userInfo.style.display = "none";
  });
};
const moves = (acc) => {
  containerMovements.innerHTML = "";

  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawl";
    const html = `                  
    <div class="moment-row d-flex justify-content-around">
    <div class="movements__type movements__type--${type}">
      ${i} ${type}
    </div>
    <div class="movements__value">${mov}€</div>
  </div>
      `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
  //for incoming(depost) and outgoint(withdrawl)
  const euroToUsd = 1.1;
  const TotalDeposit = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  //   console.log(TotalDeposit);
  labelSumIn.textContent = `${TotalDeposit} EUR`;
  const Totalwithdrawl = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  //   console.log(Totalwithdrawl);
  labelSumOut.textContent = `${Totalwithdrawl} EUR`;

  //interest rate
  const intRate = acc.movements
    .filter((val) => val > 0)
    .map((val) => (val * acc.interestRate) / 100)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  labelSumInterest.innerHTML = `${intRate} EUR`;
  acc.totalBalance = acc.movements.reduce((acc, val, i, arr) => acc + val, 0);
  labelBalance.textContent = `${acc.totalBalance} EUR`;
  // console.log(totalBalance);
  //total USD deposit using chaining methods
  const totalDepositUsd = acc.movements
    .map((val) => val * euroToUsd)
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0);
  console.log(totalDepositUsd);

  //
  //   const movementsUsd = movement.map((mov) => mov * euroToUsd);
  //   console.log(movementsUsd);
};

// moves(user2.movements);
// const user = "Sachin Raj";
// var us = "";

// const userName = [...user.toLowerCase().split(" ")];
// userName.forEach((ele) => {
//   us += ele[0];
// });
const createUsername = (user) => {
  return user
    .toLowerCase()
    .split(" ")
    .map((ele) => ele[0])
    .join("");
};
//creating username for each
accounts.forEach((val) => {
  val.userName = createUsername(val.owner);
  //   console.log(val.userName);
});
// console.log(accounts);
let acc;

//Event Handeling for login
btnLogin.addEventListener("click", (e) => {
  e.preventDefault(); // for preventing default reload of webpage while we click that button
  acc = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  if (acc) {
    labelWelcome.textContent = `Welcome Back ${acc.owner.split(" ")[0]}`;
    containerApp.classList.remove("d-none");
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    // inputLoginPin.blur();
    //display movements/app
    moves(acc);
  }
  // console.log(acc);
  // Transfer Money section
});
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const rs = Number(inputTransferAmount.value);

  const anotherAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (
    anotherAcc &&
    anotherAcc.userName !== acc.userName &&
    rs <= acc.totalBalance &&
    rs >= 0
  ) {
    acc.movements.push(-rs);
    anotherAcc.movements.push(rs);
    moves(acc);
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
  }
});
// Loan Event Handler
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan >= 0 && loan < acc.totalBalance * 100) {
    acc.movements.push(loan);
    moves(acc);
    inputLoanAmount.value = "";
  }
});
// close account
btnClose.addEventListener("click", (e) => {
  // e.preventDefault();
  if (
    acc.userName === inputCloseUsername.value &&
    acc.pin === Number(inputClosePin.value)
  ) {
    containerApp.classList.add("d-none");
    labelWelcome.innerHTML = `Log In To Continue `;
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
});
const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function () {
    return `${this.firstName} ${this.lastName}`;
  },
};

const person2 = {
  firstName: "Jane",
  lastName: "Doe",
};

// .addEventListener("click", () => {
//   document.querySelector(".userInfo").classList.remove(userInfo);
// });
console.log(person.fullName.call(person2)); // "Jane Doe"
const date = new Date();
console.log(date.getDate());
labelDate.innerHTML = `${date.getFullYear()}/${
  date.getMonth() + 1
}/${date.getDate()}`;
