"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { FaArrowCircleLeft } from "react-icons/fa";
import Hero from "@/components/Hero";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();

  const propertyType = searchParams.get("propertyType");
  const location = searchParams.get("location");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await fetch(
          `/api/properties/search?propertyType=${propertyType}&location=${location}`
        );
        if (res.status === 200) {
          const p = await res.json();
          setProperties(p);
        }
        console.error("Something went wrong");
      } catch (error) {
        console.error("Something went wrong");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, [propertyType, location]);
  return (
    <>
      <Hero />
      <section className="px-4 py-6 mb-16">
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <>
            <Link
              href="/properties"
              className="flex items-center text-blue-500 hover:underline mb-3"
            >
              <FaArrowCircleLeft className="mr-2 mb-1" />
              Back to Properties
            </Link>
            <h1 className="text-2xl mb-4">Matching Properties</h1>
            <div className="container-xl lg:container m-auto px-4 py-6">
              {properties.length === 0 ? (
                <p>No properties found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} {...property} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default SearchResultsPage;
