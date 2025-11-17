export class MappingAPI {
  private static readonly API_BASE =
    "https://uh9xzk9px2.execute-api.us-west-2.amazonaws.com/dev/geocode";

  static async getCoordinates(location: string) {
    const res = await fetch(MappingAPI.API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });

    if (!res.ok) {
      throw new Error(`Failed to get coordinates: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }
}
