/** @format */

"use strict";
//accounts
const user1 = {
  owner: "sachin raj",
  movements: [100, 200, -10, 5000, -100],
  interestRate: 1.3,
  pin: 4444,
};
const user2 = {
  owner: "mukesh raj",
  movements: [100, 200, -1000, 5000, -100],
  interestRate: 1.3,
  pin: 3333,
};
const user3 = {
  owner: "steffi sharma",
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
const moves = (acc) => {
  // Select the container element to display the account movements
  const containerMovements = document.querySelector(".movements");

  // Clear the container before displaying the movements
  containerMovements.innerHTML = "";

  // Loop through each movement in the account's movements array
  acc.movements.forEach((mov, i) => {
    // Determine the type of movement (deposit or withdrawal) using the sign of the movement value
    const type = mov > 0 ? "deposit" : "withdrawl";

    // Create an HTML element for each movement using a template literal string
    const html = `                  
        <div class="moment-row d-flex justify-content-around">
          <div class="movements__type movements__type--${type}">
            ${i} ${type}
          </div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;

    // Insert the movement element into the container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });

  // Calculate and display the total deposits
  const euroToUsd = 1.1; // exchange rate from EUR to USD
  const TotalDeposit = acc.movements
    .filter((mov) => mov > 0) // filter only positive movements (deposits)
    .reduce((acc, val) => acc + val, 0); // add up the total deposit amount

  labelSumIn.textContent = `${TotalDeposit} EUR`;

  // Calculate and display the total withdrawals
  const TotalWithdrawal = acc.movements
    .filter((mov) => mov < 0) // filter only negative movements (withdrawals)
    .reduce((acc, val) => acc + val, 0); // add up the total withdrawal amount

  labelSumOut.textContent = `${Math.abs(TotalWithdrawal)} EUR`; // display the absolute (positive) amount

  // Calculate and display the total interest earned
  const intRate = Math.trunc(
    acc.movements
      .filter((val) => val > 0) // filter only positive movements (deposits)
      .map((val) => (val * acc.interestRate) / 100) // calculate the interest for each deposit
      .reduce((acc, val) => acc + val, 0) // add up the total interest earned
  );

  labelSumInterest.innerHTML = `${intRate} EUR`;

  // Calculate and display the account balance
  acc.totalBalance = acc.movements.reduce((acc, val, i, arr) => acc + val, 0); // add up all the movements to get the total balance

  labelBalance.textContent = `${acc.totalBalance} EUR`;

  // Calculate and display the total USD deposits
  const totalDepositUsd = acc.movements
    .filter((val) => val > 0) // filter only positive movements (deposits)
    .map((val) => val * euroToUsd) // convert each deposit to USD
    .reduce((acc, val) => acc + val, 0); // add up the total USD deposits

  console.log(totalDepositUsd);
};
// Function to create username for an account
const createUsername = (user) => {
  // convert owner name to lowercase, split it by space, take the first letter of each word, and join them to create username
  return user
    .toLowerCase()
    .split(" ")
    .map((ele) => ele[0])
    .join("");
};

// creating username for each account
accounts.forEach((val) => {
  val.userName = createUsername(val.owner);
});

// Event handling for login button
btnLogin.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page from reloading on button click
  // find the account for the entered username and pin
  acc = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  if (acc) {
    // show welcome message to the user
    labelWelcome.textContent = `Welcome Back ${acc.owner.split(" ")[0]}`;
    // display the banking app interface
    containerApp.classList.remove("d-none");
    // clear the login inputs
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    // display the transactions/movements for the logged-in user
    moves(acc);
  }
});

// Event handling for transfer money button
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  // get the amount to transfer
  const rs = Number(inputTransferAmount.value);
  // find the recipient account
  const anotherAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  // make the transfer if recipient exists, the amount is valid, and recipient is not the sender
  if (
    anotherAcc &&
    anotherAcc.userName !== acc.userName &&
    rs <= acc.totalBalance &&
    rs >= 0
  ) {
    acc.movements.push(-rs);
    anotherAcc.movements.push(rs);
    moves(acc);
    // clear the transfer inputs
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
  }
});
// Event handler for requesting a loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent page reload on button click
  const loan = Number(inputLoanAmount.value); // Get the loan amount entered by the user
  if (loan >= 0 && loan < acc.totalBalance * 100) {
    // Check if the loan amount is valid
    acc.movements.push(loan); // Add the loan amount to the user's account movements
    moves(acc); // Update the account movements displayed on the UI
    inputLoanAmount.value = ""; // Clear the loan amount input field
  }
});

// Event handler for closing an account
btnClose.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent page reload on button click
  if (
    acc.userName === inputCloseUsername.value &&
    acc.pin === Number(inputClosePin.value)
  ) {
    // Check if the user entered the correct username and pin
    containerApp.classList.add("d-none"); // Hide the main app container
    labelWelcome.innerHTML = `Log In To Continue `; // Set the welcome message to prompt the user to log in again
    inputCloseUsername.value = ""; // Clear the close account username input field
    inputClosePin.value = ""; // Clear the close account pin input field
  }
});
//
