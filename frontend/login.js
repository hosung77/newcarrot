const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  // html 폼에서 입력된 데이터를 JS 객체로 변환해준다.
  const sha256Password = sha256(formData.get("password"));
  // formData에서 가져온 password값을 sha256으로 보완해서 변수에 넣어줌.
  formData.set("password", sha256Password);
  // password에 sha256Password값을 대입

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  const data = await res.json();

  if (res.status === "200") {
    //
    alert("로그인에 성공했습니다.");
  } else if (res.status === 401) {
    alert("아이디 또는 비밀번호가 틀렸습니다.");
  }
};

form.addEventListener("submit", handleSubmit);
