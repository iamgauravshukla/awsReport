// const baseUrl = 'https://ibw3ad7147.execute-api.us-east-1.amazonaws.com/Prod/';
const baseUrl = "https://68jz4wyb88.execute-api.us-east-1.amazonaws.com/Prod";
const form = document.getElementsByClassName("register-form")[0];
const loginForm = document.getElementsByClassName("login-form")[0];
const registerOtpBtn = document.getElementById("registerOtpBtn");
const loginOtpBtn = document.getElementById("loginOtpBtn");

console.log("form", form, loginForm);

const showAlert = (cssClass, message) => {
  const html = `
    <div class="alert alert-${cssClass} alert-dismissible" role="alert">
        <strong>${message}</strong>
        <button class="close" type="button" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>`;

  document.querySelector("#alert").innerHTML += html;
};

const formToJSON = (elements) =>
  [].reduce.call(
    elements,
    (data, element) => {
      data[element.name] = element.value;
      return data;
    },
    {}
  );

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// Register form submit

const handleFormSubmit = (event) => {
  event.preventDefault();

  const postUrl = `${baseUrl}subscriber`;
  const regToken = getUrlParameter("x-amzn-marketplace-token");

  const data = formToJSON(form.elements);
  console.log("data", data);

  if (!regToken) {
    showAlert(
      "danger",
      "Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!"
    );
  } else {
    const data = formToJSON(form.elements);
    console.log("data", data);
    data.regToken = regToken;

    const xhr = new XMLHttpRequest();

    xhr.open("POST", postUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        showAlert("primary", xhr.responseText);
        console.log(JSON.stringify(xhr.responseText));
      }
    };
  }
};

// login form submit
const handleLoginFormSubmit = async (event) => {
  event.preventDefault();

  const postUrl = `${baseUrl}//verify-otp`;
  const data = formToJSON(loginForm.elements);
  console.log("data", data);

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"email" : data.email , "otp" : data.otp}),
  };

  try {
    let response = await fetch(postUrl, options);
    console.log("Success", response);
  } catch (err) {
    console.log(err);
  }
};

// register otp request
const handleSendRegisterOtp = (event) => {
  event.preventDefault();

  const postUrl = `${baseUrl}registerOtp`;

  const data = formToJSON(form.elements);
  console.log("email", data.contactEmail);
};

//Login OTP request
const handleSendLoginOtp = async (event) => {
  event.preventDefault();
  const data = formToJSON(loginForm.elements);
  const email = data.email;
  const postUrl = `${baseUrl}/send-otp`;
  console.log(email);
  let options = {
    method: "POST",
    
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      email, 
      name : "Ioanyt Innovations" }),
  };

  try {
    let response = await fetch(postUrl, options);
    console.log("Success", response);
  } catch (err) {
    console.log(err);
  }
};

form.addEventListener("submit", handleFormSubmit);
loginForm.addEventListener("submit", handleLoginFormSubmit);
registerOtpBtn.addEventListener("click", handleSendRegisterOtp);
loginOtpBtn.addEventListener("click", handleSendLoginOtp);

const regToken = getUrlParameter("x-amzn-marketplace-token");
if (!regToken) {
  showAlert(
    "danger",
    "Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!"
  );
}

if (!baseUrl) {
  showAlert("danger", "Please update the baseUrl");
}
