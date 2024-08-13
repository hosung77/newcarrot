const calcTime = (timestamp) => {
  //한국시간 UTC+9시간 (세계시간 기준으로)

  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; // 현재 시각의 타임스탬프를 가져옵니다.
  const time = new Date(curTime - timestamp); // 현재 시각에서 입력받은 타임스탬프를 빼서 경과된 시간을 계산합니다.
  const hour = time.getHours(); // 경과된 시간에서 시간을 추출합니다.
  const minute = time.getMinutes(); // 경과된 시간에서 분을 추출합니다.
  const second = time.getSeconds(); // 경과된 시간에서 초를 추출합니다.

  if (hour > 0)
    return `${hour}시간 전`; // 경과 시간이 1시간 이상일 경우 "시간 전"으로 표시합니다.
  else if (minute > 0)
    return `${minute}분 전`; // 경과 시간이 1분 이상 1시간 미만일 경우 "분 전"으로 표시합니다.
  else if (second >= 0)
    return `${second}초 전`; // 경과 시간이 1초 이상 1분 미만일 경우 "초 전"으로 표시합니다.
  else "방금 전";
};

const renderData = (data) => {
  const main = document.querySelector("main");
  //.sort()순서를 최신께 맨 위로
  data
    .sort((a, b) => b.insertAt - a.insertAt)
    .forEach(async (obj) => {
      const div = document.createElement("div");
      div.className = "item-list";

      const divImg = document.createElement("div");
      divImg.className = "item-list__img";

      const img = document.createElement("img");
      const res = await fetch(`/images/${obj.id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      img.src = url;

      const InfoDiv = document.createElement("div");
      InfoDiv.className = "item-list__info";

      const InfoTitleDiv = document.createElement("div");
      InfoTitleDiv.className = "item-list__info-title";
      InfoTitleDiv.innerText = obj.title;

      const InfoMetaDiv = document.createElement("div");
      InfoMetaDiv.className = "item-list__info-meta";
      InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);

      const InfoPriceDiv = document.createElement("div");
      InfoPriceDiv.className = "item-list__info-price";
      InfoPriceDiv.innerText = obj.price;

      divImg.appendChild(img);
      InfoDiv.appendChild(InfoTitleDiv);
      InfoDiv.appendChild(InfoMetaDiv);
      InfoDiv.appendChild(InfoPriceDiv);
      div.appendChild(divImg);
      div.appendChild(InfoDiv);
      main.appendChild(div); // 하위코드를 선언하고 상위코드를 순차적으로 선언
    });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data);
};

fetchList();
