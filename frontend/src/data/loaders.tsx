import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: true,
              },
            },
          },
          "layout.features-section": {
            populate: {
              feature: {
                populate: true,
              },
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getGlobalData() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    populate: [
      "header.logoText",
      "header.ctaButton",
      "footer.logoText",
      "footer.socialLink",
    ],
  });

  const response = await fetchData(url.href);
  console.log(response);
  return response;
}

export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    fields: ["title", "description"],
  });

  return await fetchData(url.href);
}

export async function getSummaries(queryString: string, currentPage: number) {
  const PAGE_SIZE = 4;

  const query = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: queryString } },
        { summary: { $containsi: queryString } },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    },
  });
  const url = new URL("/api/summaries", baseUrl);
  url.search = query;
  return fetchData(url.href);
}

export async function getSummaryById(summaryId: string) {
  return fetchData(`${baseUrl}/api/summaries/${summaryId}`);
}

export async function getQuoteById(quoteId: string) {
  const query = qs.stringify({
    populate: "*",
  });

  const url = new URL(`/api/quotes/${quoteId}`, baseUrl);
  url.search = query;
  return fetchData(url.href);

  //return fetchData(`${baseUrl}/api/quotes/${quoteId}?populate=*`);
}

export async function getRfqById(rfqId: string) {
  const query = qs.stringify({
    populate: {
      quotes: {
        populate: {
          supplier: {
            populate: '*'
          },
        },
      },
    },
  });

  const url = new URL(`/api/rfqs/${rfqId}`, baseUrl);
  url.search = query;
  return fetchData(url.href);
}

export async function getRfqs(queryString: string, currentPage: number) {
  const PAGE_SIZE = 4;

  const query = qs.stringify({
    sort: ["createdAt:desc"],
    populate: "*",
    filters: {
      $or: [
        { title: { $containsi: queryString } },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    },
  });
  const url = new URL("/api/rfqs", baseUrl);
  url.search = query;
  return fetchData(url.href);
}
