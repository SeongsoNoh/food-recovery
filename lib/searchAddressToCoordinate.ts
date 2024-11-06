export function searchAddressToCoordinate(
  address: string,
  nmap: naver.maps.Map
) {
  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (
      status: naver.maps.Service.Status,
      response: naver.maps.Service.GeocodeResponse
    ) {
      if (status === naver.maps.Service.Status.ERROR) {
        return alert("응답 노!!");
      }
      // 주소를 도로명으로 찾을 때, 건물명까지 입력하지 않으면 응답받지 못한다.
      if (response.v2.meta.totalCount === 0) {
        return alert("no results");
      }

      const item = response.v2.addresses[0]; // 찾은 주소 정보
      const point = new naver.maps.Point(Number(item.x), Number(item.y)); // 지도에서 이동할 좌표
      const address = item.roadAddress ? item.roadAddress : item.jibunAddress;

      let detailAddress = item.addressElements[6].longName;
      const infoWindow = new naver.maps.InfoWindow({
        content: [
          '<div style="padding:10px;" id="mapAddress"><h4>' +
            address +
            "</h4></div>",
          '<div style="display:none;" id="landAddress">',
          detailAddress,
          "</div>",
        ].join(""),
        borderWidth: 0,
      });

      // 검색한 주소를 중심으로 지도 움직이기
      nmap.setCenter(point);
      infoWindow.open(nmap, point);
    }
  );
}
