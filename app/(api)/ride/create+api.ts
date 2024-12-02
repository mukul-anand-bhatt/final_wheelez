// import { neon } from "@neondatabase/serverless";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       origin_address,
//       destination_address,
//       origin_latitude,
//       origin_longitude,
//       destination_latitude,
//       destination_longitude,
//       ride_time,
//       fare_price,
//       payment_status,
//       driver_id,
//       user_id,
//     } = body;

//     if (
//       !origin_address ||
//       !destination_address ||
//       !origin_latitude ||
//       !origin_longitude ||
//       !destination_latitude ||
//       !destination_longitude ||
//       !ride_time ||
//       !fare_price ||
//       !payment_status ||
//       !driver_id ||
//       !user_id
//     ) {
//       return Response.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     const sql = neon(`${process.env.DATABASE_URL}`);

//     const response = await sql`
//       INSERT INTO rides (
//           origin_address,
//           destination_address,
//           origin_latitude,
//           origin_longitude,
//           destination_latitude,
//           destination_longitude,
//           ride_time,
//           fare_price,
//           payment_status,
//           driver_id,
//           user_id
//       ) VALUES (
//           ${origin_address},
//           ${destination_address},
//           ${origin_latitude},
//           ${origin_longitude},
//           ${destination_latitude},
//           ${destination_longitude},
//           ${ride_time},
//           ${fare_price},
//           ${payment_status},
//           ${driver_id},
//           ${user_id}
//       )
//       RETURNING *;
//     `;

//     return Response.json({ data: response[0] }, { status: 201 });
//   } catch (error) {
//     console.error("Error inserting data into recent_rides:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON body
    const body = await request.json();
    const { scootyNumber, price, phoneNumber, location, photos } = body;

    console.log("Received body:", body);

    // Validate required fields
    if (
      !scootyNumber ||
      !price ||
      !phoneNumber ||
      !location ||
      !location.longitude ||
      !location.latitude ||
      !photos ||
      photos.length !== 4
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields or invalid data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Insert the data into the database
    const response = await sql`
      INSERT INTO two_wheeler_listings (
          scooty_number,
          price,
          phone_number,
          longitude,
          latitude,
          photos
      ) VALUES (
          ${scootyNumber},
          ${price},
          ${phoneNumber},
          ${location.longitude},
          ${location.latitude},
          ${photos}
      )
      RETURNING *;
    `;

    // Return the inserted data
    return new Response(JSON.stringify({ data: response[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors
    console.error("Error inserting two-wheeler listing:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
