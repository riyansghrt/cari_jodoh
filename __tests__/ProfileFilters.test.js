import {
  defaultProfileFilters,
  filterProfiles,
  profiles,
} from "../apps/data/profiles";

const ids = (changes = {}) =>
  filterProfiles(profiles, { ...defaultProfileFilters, ...changes }).map(
    (profile) => profile.id
  );

test("default preferences include all dummy profiles", () => {
  expect(profiles).toHaveLength(12);
  expect(new Set(profiles.map((profile) => profile.id)).size).toBe(12);
  expect(new Set(profiles.map((profile) => profile.photo)).size).toBe(12);
  expect(ids()).toEqual(profiles.map((profile) => profile.id));
});

test("distance uses numeric km with an inclusive maximum", () => {
  expect(ids({ maxDistanceKm: 1 })).toEqual([]);
  expect(ids({ maxDistanceKm: 3 })).toEqual(["alyssa"]);
  expect(ids({ maxDistanceKm: 6 })).toEqual(["alyssa", "amelia"]);
  expect(ids({ maxDistanceKm: 8 })).toEqual(["alyssa", "nadia", "amelia"]);
});

test.each([
  [{ religion: "Kristen" }, ["kiara", "farah"]],
  [{ relationshipIntent: "serious" }, ["nadia", "dinda", "laras", "putri"]],
  [{ relationshipIntent: "commitment" }, ["kiara", "farah", "melati"]],
  [{ premiumOnly: true }, ["alyssa", "amelia", "citra", "intan", "salma"]],
  [{ minAge: 26, maxAge: 26 }, ["amelia", "melati"]],
  [{ religion: "Kristen", premiumOnly: true }, []],
  [
    {
      religion: "Islam",
      relationshipIntent: "marriage",
      maxDistanceKm: 6,
      minAge: 26,
      premiumOnly: true,
    },
    ["amelia"],
  ],
])("combines preferences %j", (changes, expected) => {
  expect(ids(changes)).toEqual(expected);
});

test("filters only supplied candidates without changing input data", () => {
  const candidates = [profiles[1], profiles[3]];
  expect(
    filterProfiles(candidates, { ...defaultProfileFilters, premiumOnly: true })
  ).toEqual([profiles[3]]);
  expect(candidates).toEqual([profiles[1], profiles[3]]);
  expect(defaultProfileFilters.premiumOnly).toBe(false);
});
