const form = document.querySelector("#signup-form");

const checkPassword = () => {
  const formData = new FormData(form);
  const password1 = formData.get("password");
  const password2 = formData.get("password2");

  if (password1 == password2) {
    return true;
  } else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  // html 폼에서 입력된 데이터를 JS 객체로 변환해준다.
  const sha256Password = sha256(formData.get("password"));
  // formData에서 가져온 password값을 sha256으로 보완해서 변수에 넣어줌.
  formData.set("password", sha256Password);
  // password에 sha256Password값을 대입

  const div = document.querySelector("#info");

  if (checkPassword()) {
    const res = await fetch("/signup", {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    if (data == "200");
    {
      div.innerText = "회원가입에 성공했습니다.";
      div.style.color = "blue";
    }
  } else {
    div.innerText = "비밀번호가 같지 않습니다.";
    div.style.color = "red";
    form.appendChild(div);
  }
};

form.addEventListener("submit", handleSubmit);
