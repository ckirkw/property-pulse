import React from "react";

import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaRulerCombined,
  FaBath,
  FaMoneyBill,
  FaMapMarker,
} from "react-icons/fa";

const convertToTitleCase = (str) => {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const PropertyCard = ({
  images,
  type,
  name,
  beds,
  baths,
  location,
  rates,
  square_feet,
  _id,
}) => {
  const getRateDisplay = (r) => {
    if (r.monthly) return `$${r.monthly.toLocaleString()}/mo`;
    if (r.weekly) return `$${r.weekly.toLocaleString()}/wk`;
    if (r.nightly) return `$${r.nighly.toLocaleString()}/night`;
  };

  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={`/images/properties/${images[0]}`}
        alt=""
        height={0}
        width={0}
        sizes="100vw"
        className="w-full h-auto rounded-t-xl"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{type}</div>
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          {getRateDisplay(rates)}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed className="inline mr-2" /> {beds + " "}
            <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath className="inline mr-2" /> {baths + " "}
            <span className="md:hidden lg:inline">
              {baths > 1 ? "Baths" : "Bath"}
            </span>
          </p>
          <p>
            <FaRulerCombined className="inline mr-2" />
            {square_feet.toLocaleString()}{" "}
            <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          {Object.keys(rates).map((rate) => (
            <p key={rate}>
              <FaMoneyBill className="inline mr-2" /> {convertToTitleCase(rate)}
            </p>
          ))}
        </div>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-orange-700 mt-1" />
            <span className="text-orange-700">
              {location.city}, {location.state}
            </span>
          </div>
          <Link
            href={`/properties/${_id}`}
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
