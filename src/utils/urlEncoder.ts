export function encodeCompareData(name: string, districtIds: string[]): string {
  const params = new URLSearchParams();
  params.set("n", encodeURIComponent(name));
  params.set("d", districtIds.join(","));
  return params.toString();
}

export function decodeCompareData(search: string): {
  name: string;
  districtIds: string[];
} {
  const params = new URLSearchParams(search);
  const rawName = params.get("n");
  const rawDistricts = params.get("d");

  const name = rawName ? decodeURIComponent(rawName) : "বন্ধু পর্যটক";
  const districtIds = rawDistricts ? rawDistricts.split(",").filter(Boolean) : [];

  return { name, districtIds };
}
