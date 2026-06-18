import { TextField } from "@sitecore-jss/sitecore-jss-nextjs";

export type BookNowHotel = {
    fields:{
        Location: TextField;
        HotelId: TextField;
    }
}

export type ReservationsProp = {
    fields:{
        BookNowHotels: BookNowHotel[]
    }
}