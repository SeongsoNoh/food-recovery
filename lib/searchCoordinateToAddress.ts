export const searchCoordinateToAddress = (
  latlng: naver.maps.LatLng,
  nmap: naver.maps.Map
) => {
  const infoWindow = new naver.maps.InfoWindow({ content: "", borderWidth: 0 });
  naver.maps.Service.reverseGeocode(
    // options
    {
      coords: latlng,
      orders: [
        naver.maps.Service.OrderType.ADDR,
        naver.maps.Service.OrderType.ROAD_ADDR,
      ].join(","),
    },
    // callback
    function (
      status: naver.maps.Service.Status,
      response: naver.maps.Service.ReverseGeocodeResponse
    ) {
      console.log("response!!!!!!!!!!", response);
      // 응답을 못 받으면 'Something went wrong' alert 띄우기
      if (status !== naver.maps.Service.Status.OK) {
        return alert("응답 못받음!");
      }

      console.log("Reverse geocode response:", response); // 응답 구조 확인용 로그

      // 도로명 주소가 있다면 도로명 주소를, 없다면 지번 주소를 address 변수에 담는다.
      const address = response.v2.address.roadAddress
        ? response.v2.address.roadAddress
        : response.v2.address.jibunAddress;

      // const address =
      // response.v2 && response.v2.address
      //   ? response.v2.address.roadAddress || response.v2.address.jibunAddress
      //   : "주소를 찾을 수 없습니다.";

      // infoWindow 안에 넣어줄 html을 setContent 메서드에 넣어준다.
      infoWindow.setContent(
        [
          '<div style="padding:10px;min-width:200px;line-height:150%;">',
          address,
          "</div>",
        ].join("")
      );
      // open 메서드에 지도와 좌표를 전달하여 정보 창을 열어준다.
      infoWindow.open(nmap, latlng);
    }
  );
};
