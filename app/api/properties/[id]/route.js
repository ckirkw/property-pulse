import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { Client } from "@googlemaps/google-maps-services-js";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const property = await Property.findById(params.id);

    if (!property) return new Response("Property not found", { status: 404 });

    return new Response(JSON.stringify(property), { status: 200 });
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) return new Response("Property not found", { status: 404 });

    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await property.deleteOne();

    return new Response(JSON.stringify("Property deleted"), { status: 200 });
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId)
      return new Response("User ID is required", { status: 401 });

    const { id } = params;
    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }

    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    const client = new Client({});

    try {
      const {
        data: { results },
      } = await client.geocode({
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
          address: `${propertyData.location.street} ${propertyData.location.city}, ${propertyData.state} ${propertyData.zipcode}`,
        },
      });
      if (results.length > 0) {
        const {
          geometry: {
            location: { lat, lng },
          },
        } = results[0];
        propertyData.location.lat = lat;
        propertyData.location.long = lng;
      } else {
        console.warn("No geocoding results");
      }
    } catch (e) {
      console.error("There was an error", e);
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    return new Response("Failed to add property " + error, { status: 500 });
  }
};
