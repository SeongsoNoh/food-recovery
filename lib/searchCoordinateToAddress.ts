export const searchCoordinateToAddress = (
  latlng: naver.maps.LatLng,
  nmap: naver.maps.Map
) => {
  // infoWindow 생성
  const infoWindow = new naver.maps.InfoWindow({ content: "", borderWidth: 0 });
  naver.maps.Service.reverseGeocode(
    {
      coords: latlng,
      orders: [
        naver.maps.Service.OrderType.ADDR,
        naver.maps.Service.OrderType.ROAD_ADDR,
      ].join(","),
    },
    function (
      status: naver.maps.Service.Status,
      response: naver.maps.Service.ReverseGeocodeResponse
    ) {
      if (status !== naver.maps.Service.Status.OK) {
        return alert("Something went wrong!");
      }

      // const address = response.v2.address.roadAddress
      //   ? response.v2.address.roadAddress
      //   : response.v2.address.jibunAddress;
      const address = response.v2.address.roadAddress
        ? response.v2.address.roadAddress
        : response.v2.address.jibunAddress;

      let detailAddress = "";
      if (response.v2.address.roadAddress) {
        const resultJson = JSON.stringify(response.v2.results[1]);
        const parsedResult = JSON.parse(resultJson);
        detailAddress = parsedResult.land.addition0.value;
      }
      // infoWindow 안에 넣어줄 html을 setContent 메서드에 넣어준다.
      infoWindow.setContent(
        [
          '<div style="padding:10px;min-width:200px;line-height:150%;" id="mapAddress">',
          address,
          "</div>",
          '<div style="display:none;" id="landAddress">',
          detailAddress,
          "</div>",
        ].join("")
      );

      // open 메서드에 지도와 좌표를 전달하여 정보 창을 열어준다.
      infoWindow.open(nmap, latlng);
    }
  );
};
