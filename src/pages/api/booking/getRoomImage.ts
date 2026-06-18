import { GetRoomImagesService } from '@/graphql/RoomImagesQuery.service';
import { RoomImagesField } from '@/props/Graphql/RoomImagesQueryProps';
import { NextApiRequest, NextApiResponse } from 'next';

const getRoomImageApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const { RoomType, HotelId, Locale } = req.query;
  //console.log('getRoomImageApi===================', RoomType, HotelId, Locale);
  try {
    const [resultHotel, resultRoom] = await Promise.all([
      GetRoomImagesService(
        '{1FDD661A-EBEE-4242-970A-86FA173381DF}',
        '{6FC68EA0-BEB3-4B09-AA0D-D4DD9447AC02}',
        (Locale as string) ?? 'en',
        '',
        HotelId as string
      ),
      GetRoomImagesService(
        '{045A7968-31ED-473B-A522-0B1CB9370447}',
        '{6FC68EA0-BEB3-4B09-AA0D-D4DD9447AC02}',
        (Locale as string) ?? 'en',
        '',
        RoomType as string
      ),
    ]);
    // const resultHotel = await GetRoomImagesService(
    //   '{03951BAD-C61F-487B-891F-D83C679B201D}',
    //   '{4995CC63-670F-4761-8DC7-27BE51A45790}',
    //   (Locale as string) ?? 'en',
    //   ''
    // );
    // const resultRoom = await GetRoomImagesService(
    //   '{40639523-8C65-4D82-AC39-D5EC3703B264}',
    //   '{4995CC63-670F-4761-8DC7-27BE51A45790}',
    //   (Locale as string) ?? 'en',
    //   ''
    // );
    // let roomImage = findImage(resultRoom, RoomType as string);
    // const roomType = findValue(resultRoom, RoomType as string);
    // const hotelName = findValue(resultHotel, HotelId as string);
    // if (!roomImage) {
    //   roomImage = findImage(resultHotel, HotelId as string);
    // }
    // //console.log('getRoomImageApi=================================', hotelName, roomType);
    // return res.status(200).send({
    //   HotelName: hotelName,
    //   RoomType: roomType,
    //   RoomImage: roomImage,
    // });
    return res.status(200).send({
      HotelName: resultHotel[0].Value.jsonValue.value,
      RoomType: resultRoom[0].Value.jsonValue.value,
      RoomImage: resultRoom[0].Image.jsonValue.value?.src
        ? resultRoom[0].Image.jsonValue.value
        : resultHotel[0].Image.jsonValue.value,
    });
  } catch (e: any) {
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

// const findValue = (matches: RoomImagesField[], key?: string) => {
//   if (key == null) {
//     return '';
//   }
//   for (const match of matches) {
//     if (match.Key.jsonValue.value === key) {
//       return match.Value.jsonValue.value;
//     }
//   }
//   return key;
// };

// const findImage = (matches: RoomImagesField[], key?: string) => {
//   if (key == null) {
//     return null;
//   }
//   for (const match of matches) {
//     if (match.Key.jsonValue.value === key) {
//       return match.Image.jsonValue;
//     }
//   }
//   return null;
// };

export default getRoomImageApi;
