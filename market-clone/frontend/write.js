const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault();
  const body = new FormData(form);
  body.append("insertAt", new Date().getTime());
  try {
    // console.log("제출!!");
    const res = await fetch("/items", {
      method: "POST",
      body: body,
    });
    const data = await res.json(); // fetch해서 받은 서버의 response
    if (data == "200") window.location.pathname = "/"; //페이지를 이동시켜줌
  } catch (e) {
    console.error(e);
  }
};

form.addEventListener("submit", handleSubmitForm);
