export const config = {
  runtime: "edge", // Use Edge Runtime, for ESM
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryToFetch = searchParams.get("country");
  const timezonedbApiKey = process.env.VITE_TIMEZONEDB_API_KEY;

  try {
    const response = await fetch(`https://api.timezonedb.com/v2.1/list-time-zone?key=${timezonedbApiKey}&format=json&country=${countryToFetch}`);
    const data = await response.json();

    console.log(data);

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch(e) {
    console.error(e);
    
    return new Response(
      JSON.stringify({ ok: false }),
      { status: 400 }
    );
  }
}