import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Fetch all rows from the `two_wheeler_listings` table
    const listings = await sql`
      SELECT * FROM two_wheeler_listings;
    `;

    // Return the data as a JSON response
    return new Response(JSON.stringify({ data: listings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error fetching listings:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
