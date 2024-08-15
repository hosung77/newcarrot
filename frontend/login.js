const form = document.querySelector("#login-form");

// let accessToken = null;

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  const data = await res.json();
  const accessToken = data.access_token; //65강
  window.localStorage.setItem("token", accessToken);
  alert("로그인되었습니다!");

  window.location.pathname = "/";
};

form.addEventListener("submit", handleSubmit);

// const InfoDiv = document.querySelector("#info");
// InfoDiv.innerText = "로그인 완료";

// window.location.pathname="/";

// const btn = document.createElement("button");
// btn.innerText = "상품 가져오기";
// btn.addEventListener("click", async () => {
//   const res = await fetch("/items", {
//     hearders: {
//       Authorization: "Bearer ${accessToken}",  // accessToken을 넣어서 요청
//     },
//   });
//   const data = await res.json();
//   console.log(data);
// });
// InfoDiv.appendChild(btn);
// if (res.status === "200") {
//   //
//   alert("로그인에 성공했습니다.");
//   window.location.pathname = "/";
// } else if (res.status === 401) {
//   alert("아이디 또는 비밀번호가 틀렸습니다.");
// }
