const teams = [];
const D1_CACHE_KEY = "cbb_d1_teams_cache_v5";
const D1_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const HARDCODED_CONFERENCE_BY_TEAM = {
  "Alabama": "SEC",
  "Arizona": "Big 12",
  "Arizona State": "Big 12",
  "Arkansas": "SEC",
  "Auburn": "SEC",
  "Baylor": "Big 12",
  "Boise State": "Mountain West",
  "Boston College": "ACC",
  "BYU": "Big 12",
  "California": "ACC",
  "Cincinnati": "Big 12",
  "Clemson": "ACC",
  "Colorado": "Big 12",
  "Creighton": "Big East",
  "Dayton": "Atlantic 10",
  "DePaul": "Big East",
  "Duke": "ACC",
  "Florida": "SEC",
  "Florida State": "ACC",
  "Georgetown": "Big East",
  "Georgia": "SEC",
  "Georgia Tech": "ACC",
  "Gonzaga": "WCC",
  "Houston": "Big 12",
  "Illinois": "Big Ten",
  "Indiana": "Big Ten",
  "Iowa": "Big Ten",
  "Iowa State": "Big 12",
  "Kansas": "Big 12",
  "Kansas State": "Big 12",
  "Kentucky": "SEC",
  "LSU": "SEC",
  "Louisville": "ACC",
  "Marquette": "Big East",
  "Maryland": "Big Ten",
  "Miami": "ACC",
  "Michigan": "Big Ten",
  "Michigan State": "Big Ten",
  "Minnesota": "Big Ten",
  "Mississippi State": "SEC",
  "Missouri": "SEC",
  "NC State": "ACC",
  "Nebraska": "Big Ten",
  "Nevada": "Mountain West",
  "New Mexico": "Mountain West",
  "North Carolina": "ACC",
  "Northwestern": "Big Ten",
  "Notre Dame": "ACC",
  "Ohio State": "Big Ten",
  "Oklahoma": "SEC",
  "Oklahoma State": "Big 12",
  "Ole Miss": "SEC",
  "Oregon": "Big Ten",
  "Penn State": "Big Ten",
  "Pittsburgh": "ACC",
  "Providence": "Big East",
  "Purdue": "Big Ten",
  "Rutgers": "Big Ten",
  "Saint Louis": "Atlantic 10",
  "San Diego State": "Mountain West",
  "Santa Clara": "WCC",
  "Seton Hall": "Big East",
  "SMU": "AAC",
  "South Carolina": "SEC",
  "Stanford": "ACC",
  "St John's": "Big East",
  "Syracuse": "ACC",
  "TCU": "Big 12",
  "Tennessee": "SEC",
  "Texas": "SEC",
  "Texas A&M": "SEC",
  "Texas Tech": "Big 12",
  "UCF": "Big 12",
  "UCLA": "Big Ten",
  "UConn": "Big East",
  "USC": "Big Ten",
  "Utah": "Big 12",
  "Utah State": "Mountain West",
  "Vanderbilt": "SEC",
  "VCU": "Atlantic 10",
  "Villanova": "Big East",
  "Virginia": "ACC",
  "Virginia Tech": "ACC",
  "Wake Forest": "ACC",
  "West Virginia": "Big 12",
  "Wisconsin": "Big Ten",
  "Xavier": "Big East"
};

const EXPLICIT_CONFERENCE_OVERRIDES = {
  "alabama": "SEC",
  "illinois": "Big Ten",
  "miami": "ACC",
  "smu": "AAC",
  "northcarolina": "ACC",
  "unc": "ACC",
  "uconn": "Big East",
  "connecticut": "Big East"
};

const MANUAL_CONFERENCE_SOURCE = `
Abilene Christian Wildcats Big 12
Air Force Falcons Mountain West
Akron Zips MAC
Alabama A&M Bulldogs SWAC
Alabama Crimson Tide SEC
Alabama State Hornets SWAC
Albany Great Danes America East
Alcorn State Braves SWAC
American Eagles Patriot
Appalachian State Mountaineers Sun Belt
Arizona State Sun Devils Big 12
Arizona Wildcats Big 12
Arkansas Razorbacks SEC
Arkansas State Red Wolves Sun Belt
Arkansas-Pine Bluff Golden Lions SWAC
Army Black Knights Patriot
Auburn Tigers SEC
Austin Peay Governors ASUN
Ball State Cardinals MAC
Baylor Bears Big 12
Bellarmine Knights ASUN
Belmont Bruins MVC
Bethune-Cookman Wildcats SWAC
Binghamton Bearcats America East
Boise State Broncos Mountain West
Boston College Eagles ACC
Boston University Terriers Patriot
Bowling Green Falcons MAC
Bradley Braves MVC
Brown Bears Ivy
Bryant Bulldogs America East
Bucknell Bison Patriot
Buffalo Bulls MAC
Butler Bulldogs Big East
BYU Cougars Big 12
Cal Baptist Lancers WAC
California Golden Bears ACC
Campbell Fighting Camels CAA
Canisius Golden Griffins MAAC
Central Arkansas Bears ASUN
Central Connecticut Blue Devils NEC
Central Michigan Chippewas MAC
Charleston Cougars CAA
Charleston Southern Buccaneers Big South
Charlotte 49ers AAC
Chattanooga Mocs SoCon
Chicago State Cougars NEC
Cincinnati Bearcats Big 12
Clemson Tigers ACC
Cleveland State Vikings Horizon
Coastal Carolina Chanticleers Sun Belt
Colgate Raiders Patriot
Colorado Buffaloes Big 12
Colorado State Rams Mountain West
Columbia Lions Ivy
Connecticut Huskies Big East
Coppin State Eagles MEAC
Cornell Big Red Ivy
Creighton Bluejays Big East
Dartmouth Big Green Ivy
Davidson Wildcats A-10
Dayton Flyers A-10
DePaul Blue Demons Big East
Delaware Blue Hens CAA
Delaware State Hornets MEAC
Denver Pioneers Summit
Detroit Mercy Titans Horizon
Drake Bulldogs MVC
Drexel Dragons CAA
Duke Blue Devils ACC
East Carolina Pirates AAC
East Tennessee State Buccaneers SoCon
Eastern Illinois Panthers OVC
Eastern Kentucky Colonels ASUN
Eastern Michigan Eagles MAC
Eastern Washington Eagles Big Sky
Elon Phoenix CAA
Evansville Purple Aces MVC
Fairfield Stags MAAC
Fairleigh Dickinson Knights NEC
Florida A&M Rattlers SWAC
Florida Atlantic Owls AAC
Florida Gators SEC
Florida Gulf Coast Eagles ASUN
Florida International Panthers CUSA
Florida State Seminoles ACC
Fordham Rams A-10
Fresno State Bulldogs Mountain West
Furman Paladins SoCon
Gardner-Webb Runnin' Bulldogs Big South
George Mason Patriots A-10
George Washington Revolutionaries A-10
Georgetown Hoyas Big East
Georgia Bulldogs SEC
Georgia Southern Eagles Sun Belt
Georgia State Panthers Sun Belt
Georgia Tech Yellow Jackets ACC
Gonzaga Bulldogs WCC
Grambling State Tigers SWAC
Grand Canyon Lopes WAC
Green Bay Phoenix Horizon
Hampton Pirates CAA
Harvard Crimson Ivy
Hawaii Rainbow Warriors Big West
High Point Panthers Big South
Hofstra Pride CAA
Holy Cross Crusaders Patriot
Houston Cougars Big 12
Houston Christian Huskies Southland
Howard Bison MEAC
Idaho Vandals Big Sky
Idaho State Bengals Big Sky
Illinois Fighting Illini Big Ten
Illinois State Redbirds MVC
Incarnate Word Cardinals Southland
Indiana Hoosiers Big Ten
Indiana State Sycamores MVC
Iona Gaels MAAC
Iowa Hawkeyes Big Ten
Iowa State Cyclones Big 12
Jackson State Tigers SWAC
Jacksonville Dolphins ASUN
Jacksonville State Gamecocks CUSA
James Madison Dukes Sun Belt
Kansas Jayhawks Big 12
Kansas State Wildcats Big 12
Kennesaw State Owls CUSA
Kent State Golden Flashes MAC
Kentucky Wildcats SEC
LSU Tigers SEC
Louisiana Ragin' Cajuns Sun Belt
Louisiana Tech Bulldogs CUSA
Louisville Cardinals ACC
Loyola Chicago Ramblers A-10
Loyola Marymount Lions WCC
Maine Black Bears America East
Marist Red Foxes MAAC
Marquette Golden Eagles Big East
Marshall Thundering Herd Sun Belt
Maryland Terrapins Big Ten
McNeese Cowboys Southland
Memphis Tigers AAC
Mercer Bears SoCon
Miami Hurricanes ACC
Miami RedHawks MAC
Michigan Wolverines Big Ten
Michigan State Spartans Big Ten
Middle Tennessee Blue Raiders CUSA
Minnesota Golden Gophers Big Ten
Mississippi State Bulldogs SEC
Missouri Tigers SEC
Missouri State Bears MVC
Monmouth Hawks CAA
Montana Grizzlies Big Sky
Montana State Bobcats Big Sky
Morehead State Eagles OVC
Morgan State Bears MEAC
Mount St. Mary's Mountaineers MAAC
Murray State Racers MVC
Nebraska Cornhuskers Big Ten
Nevada Wolf Pack Mountain West
New Hampshire Wildcats America East
New Mexico Lobos Mountain West
New Mexico State Aggies CUSA
New Orleans Privateers Southland
Niagara Purple Eagles MAAC
Nicholls Colonels Southland
NJIT Highlanders America East
Norfolk State Spartans MEAC
North Alabama Lions ASUN
North Carolina A&T Aggies CAA
North Carolina Central Eagles MEAC
North Carolina State Wolfpack ACC
North Carolina Tar Heels ACC
North Dakota Fighting Hawks Summit
North Dakota State Bison Summit
North Florida Ospreys ASUN
North Texas Mean Green AAC
Northeastern Huskies CAA
Northern Arizona Lumberjacks Big Sky
Northern Colorado Bears Big Sky
Northern Illinois Huskies MAC
Northern Iowa Panthers MVC
Northern Kentucky Norse Horizon
Northwestern Wildcats Big Ten
Northwestern State Demons Southland
Notre Dame Fighting Irish ACC
Oakland Golden Grizzlies Horizon
Ohio Bobcats MAC
Ohio State Buckeyes Big Ten
Oklahoma Sooners SEC
Oklahoma State Cowboys Big 12
Old Dominion Monarchs Sun Belt
Ole Miss Rebels SEC
Oral Roberts Golden Eagles Summit
Oregon Ducks Big Ten
Oregon State Beavers WCC
Pacific Tigers WCC
Penn State Nittany Lions Big Ten
Penn Quakers Ivy
Pepperdine Waves WCC
Pittsburgh Panthers ACC
Portland Pilots WCC
Portland State Vikings Big Sky
Prairie View A&M Panthers SWAC
Presbyterian Blue Hose Big South
Princeton Tigers Ivy
Providence Friars Big East
Purdue Boilermakers Big Ten
Queens Royals ASUN
Radford Highlanders Big South
Rhode Island Rams A-10
Rice Owls AAC
Richmond Spiders A-10
Rider Broncs MAAC
Robert Morris Colonials Horizon
Rutgers Scarlet Knights Big Ten
Sacramento State Hornets Big Sky
Sacred Heart Pioneers MAAC
Saint Francis Red Flash NEC
Saint Joseph's Hawks A-10
Saint Louis Billikens A-10
Saint Mary's Gaels WCC
Saint Peter's Peacocks MAAC
Sam Houston Bearkats CUSA
Samford Bulldogs SoCon
San Diego Toreros WCC
San Diego State Aztecs Mountain West
San Francisco Dons WCC
San Jose State Spartans Mountain West
Santa Clara Broncos WCC
Seattle Redhawks WAC
Seton Hall Pirates Big East
SIU Edwardsville Cougars OVC
SMU Mustangs AAC
South Alabama Jaguars Sun Belt
South Carolina Gamecocks SEC
South Carolina State Bulldogs MEAC
South Dakota Coyotes Summit
South Dakota State Jackrabbits Summit
South Florida Bulls AAC
Southeast Missouri Redhawks OVC
Southeastern Louisiana Lions Southland
Southern Jaguars SWAC
Southern Illinois Salukis MVC
Southern Indiana Screaming Eagles OVC
Southern Miss Golden Eagles Sun Belt
Southern Utah Thunderbirds WAC
St. Bonaventure Bonnies A-10
St. John's Red Storm Big East
Stanford Cardinal ACC
Stephen F. Austin Lumberjacks WAC
Stetson Hatters ASUN
Syracuse Orange ACC
TCU Horned Frogs Big 12
Temple Owls AAC
Tennessee Volunteers SEC
Tennessee State Tigers OVC
Tennessee Tech Golden Eagles OVC
Texas A&M Aggies SEC
Texas Longhorns SEC
Texas State Bobcats Sun Belt
Texas Tech Red Raiders Big 12
Texas Southern Tigers SWAC
Texas A&M-Corpus Christi Islanders Southland
The Citadel Bulldogs SoCon
Toledo Rockets MAC
Towson Tigers CAA
Troy Trojans Sun Belt
Tulane Green Wave AAC
Tulsa Golden Hurricane AAC
UAB Blazers AAC
UC Davis Aggies Big West
UC Irvine Anteaters Big West
UC Riverside Highlanders Big West
UC San Diego Tritons Big West
UC Santa Barbara Gauchos Big West
UCF Knights Big 12
UCLA Bruins Big Ten
UIC Flames MVC
UMass Minutemen A-10
UMBC Retrievers America East
UNC Asheville Bulldogs Big South
UNC Greensboro Spartans SoCon
UNC Wilmington Seahawks CAA
UNLV Rebels Mountain West
USC Trojans Big Ten
UT Arlington Mavericks WAC
UT Martin Skyhawks OVC
UTEP Miners CUSA
UTSA Roadrunners AAC
Utah Utes Big 12
Utah State Aggies Mountain West
Utah Tech Trailblazers WAC
Valparaiso Beacons MVC
Vanderbilt Commodores SEC
Vermont Catamounts America East
Villanova Wildcats Big East
Virginia Cavaliers ACC
Virginia Tech Hokies ACC
VMI Keydets SoCon
Wagner Seahawks NEC
Wake Forest Demon Deacons ACC
Washington Huskies Big Ten
Washington State Cougars WCC
Weber State Wildcats Big Sky
West Virginia Mountaineers Big 12
Western Carolina Catamounts SoCon
Western Illinois Leathernecks OVC
Western Kentucky Hilltoppers CUSA
Western Michigan Broncos MAC
Wichita State Shockers AAC
William & Mary Tribe CAA
Winthrop Eagles Big South
Wisconsin Badgers Big Ten
Wofford Terriers SoCon
Wright State Raiders Horizon
Wyoming Cowboys Mountain West
Xavier Musketeers Big East
Yale Bulldogs Ivy
Youngstown State Penguins Horizon
`;

const KNOWN_CONFERENCES = [
  "Mountain West", "America East", "Sun Belt", "Big South", "Big Sky", "Big West", "Big East",
  "Big Ten", "Big 12", "Southland", "Patriot", "Horizon", "Atlantic 10", "A-10", "SoCon",
  "Summit", "SWAC", "SEC", "ACC", "AAC", "MAC", "ASUN", "MVC", "Ivy", "WAC", "CAA", "NEC",
  "MAAC", "MEAC", "CUSA", "OVC", "WCC"
];

function normalizeConferenceAlias(conf) {
  const value = String(conf || "").trim();
  if (value === "A-10") return "Atlantic 10";
  return value;
}

function parseManualConferenceEntries(text) {
  const entries = [];
  const confs = [...KNOWN_CONFERENCES].sort((a, b) => b.length - a.length);
  text.split("\n").map(line => line.trim()).filter(Boolean).forEach(line => {
    const found = confs.find(conf => line.endsWith(` ${conf}`));
    if (!found) return;
    const teamText = line.slice(0, line.length - found.length).trim();
    if (!teamText) return;
    entries.push({
      fullName: teamText,
      fullKey: normalizeTeamName(teamText),
      conference: normalizeConferenceAlias(found)
    });
  });
  return entries;
}

const MANUAL_CONFERENCE_ENTRIES = parseManualConferenceEntries(MANUAL_CONFERENCE_SOURCE);

function normalizeTeamName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

const HARDCODED_CONFERENCE_BY_TEAM_NORMALIZED = Object.fromEntries(
  Object.entries(HARDCODED_CONFERENCE_BY_TEAM).map(([name, conference]) => [
    normalizeTeamName(name),
    conference
  ])
);

function normalizeConferenceName(conference) {
  const value = String(conference || "").trim();
  return value || "Other";
}

function hardcodedConferenceForTeamName(name) {
  const direct = HARDCODED_CONFERENCE_BY_TEAM_NORMALIZED[normalizeTeamName(name)];
  return direct ? normalizeConferenceName(direct) : "";
}

function manualConferenceForTeamName(name, currentConference = "") {
  const teamKey = normalizeTeamName(name);
  if (!teamKey) return "";

  const explicit = EXPLICIT_CONFERENCE_OVERRIDES[teamKey];
  if (explicit) return normalizeConferenceName(explicit);

  const exact = MANUAL_CONFERENCE_ENTRIES.find(entry => entry.fullKey === teamKey);
  if (exact) return exact.conference;

  // Avoid ambiguous short-name matching (e.g. "Miami", "Illinois", "UNC").
  if (teamKey.length < 7) return "";

  const candidates = MANUAL_CONFERENCE_ENTRIES.filter(entry => entry.fullKey.startsWith(teamKey));
  if (!candidates.length) return "";

  const preferredByCurrentConference = normalizeConferenceAlias(currentConference);
  if (preferredByCurrentConference) {
    const sameConf = candidates.find(entry => entry.conference === preferredByCurrentConference);
    if (sameConf) return sameConf.conference;
  }

  candidates.sort((a, b) => a.fullKey.length - b.fullKey.length);
  return candidates[0]?.conference || "";
}

function resolveConference(name, conference) {
  const manual = manualConferenceForTeamName(name, conference);
  if (manual) return normalizeConferenceName(manual);

  const hardcoded = hardcodedConferenceForTeamName(name);
  if (hardcoded) return hardcoded;
  return normalizeConferenceName(conference);
}

function logoFromEspnTeam(team) {
  const direct = Array.isArray(team?.logos) && team.logos.length ? team.logos[0].href : "";
  if (direct) return direct;
  if (team?.id) return `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.id}.png`;
  return "";
}

function recordFromEspnTeam(team) {
  const values = [
    team?.record?.items?.[0]?.summary,
    team?.recordSummary,
    team?.standingSummary
  ];
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "N/A";
}

function conferenceFromEspnTeam(team) {
  const group = team?.group || (Array.isArray(team?.groups) ? team.groups[0] : null);
  const value = group?.shortName || group?.abbreviation || group?.name;
  return normalizeConferenceName(value);
}

function parseIdFromRef(ref) {
  const text = String(ref || "");
  const match = text.match(/\/(\d+)(?:\?|$)/);
  return match ? match[1] : "";
}

function parseTeamGroupId(team) {
  const fromGroupId = team?.group?.id || "";
  if (fromGroupId) return String(fromGroupId);

  const fromGroupsId = Array.isArray(team?.groups) && team.groups[0]?.id ? team.groups[0].id : "";
  if (fromGroupsId) return String(fromGroupsId);

  const fromGroupRef = parseIdFromRef(team?.group?.$ref);
  if (fromGroupRef) return fromGroupRef;

  const fromGroupsRef = Array.isArray(team?.groups) ? parseIdFromRef(team.groups[0]?.$ref) : "";
  if (fromGroupsRef) return fromGroupsRef;

  return "";
}

function buildConferenceMapFromGroupsPayload(payload) {
  const map = new Map();
  const groupEntries = payload?.sports?.[0]?.leagues?.[0]?.groups || payload?.groups || [];
  groupEntries.forEach(entry => {
    const group = entry?.group || entry;
    const groupId = parseGroupId(group);
    if (!groupId) return;
    const conferenceName = normalizeConferenceName(group?.shortName || group?.abbreviation || group?.name);
    if (conferenceName !== "Other") {
      map.set(String(groupId), conferenceName);
    }
  });
  return map;
}

function preferTeamRecord(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const score = (team) => {
    let points = 0;
    if (team.logo) points += 2;
    if (team.record && team.record !== "N/A") points += 2;
    if (team.conference && team.conference !== "Other") points += 2;
    if (team.id) points += 1;
    return points;
  };

  return score(incoming) > score(existing) ? incoming : existing;
}

function setTeamsFromList(list) {
  const byIdOrName = new Map();

  list.forEach(item => {
    const keyById = item.id ? `id:${item.id}` : "";
    const keyByName = `name:${normalizeTeamName(item.name)}`;
    const key = keyById || keyByName;
    if (!key || key === "name:") return;

    const normalized = {
      id: String(item.id || ""),
      name: String(item.name || "").trim(),
      conference: resolveConference(item.name, item.conference),
      record: String(item.record || "N/A").trim() || "N/A",
      logo: String(item.logo || "").trim()
    };
    if (!normalized.name) return;

    const existing = byIdOrName.get(key);
    byIdOrName.set(key, preferTeamRecord(existing, normalized));
  });

  const byName = new Map();
  [...byIdOrName.values()].forEach(team => {
    const nameKey = normalizeTeamName(team.name);
    if (!nameKey) return;
    const existing = byName.get(nameKey);
    byName.set(nameKey, preferTeamRecord(existing, team));
  });

  const finalTeams = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  teams.length = 0;
  teams.push(...finalTeams);
}

function dispatchTeamsUpdated(detail = {}) {
  window.dispatchEvent(new CustomEvent("teamsUpdated", {
    detail: {
      total: teams.length,
      ...detail
    }
  }));
}

function readCachedTeams() {
  try {
    const raw = localStorage.getItem(D1_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.teams)) return null;
    const updatedAt = Number(parsed.updatedAt || 0);
    if (!Number.isFinite(updatedAt) || updatedAt <= 0) return null;
    return { teams: parsed.teams, updatedAt };
  } catch {
    return null;
  }
}

function writeCachedTeams(list) {
  try {
    localStorage.setItem(D1_CACHE_KEY, JSON.stringify({
      updatedAt: Date.now(),
      teams: list
    }));
  } catch {
    // Ignore cache write errors (private mode/storage limits).
  }
}

function buildSeedTeamsFromHardcodedMap() {
  return Object.entries(HARDCODED_CONFERENCE_BY_TEAM).map(([name, conference]) => ({
    id: "",
    name,
    conference,
    record: "N/A",
    logo: ""
  }));
}

function parseEspnTeamEntries(payload, conferenceByTeamId = new Map()) {
  const entries = payload?.sports?.[0]?.leagues?.[0]?.teams || [];
  return entries
    .map(entry => entry?.team || null)
    .filter(Boolean)
    .map(team => {
      const name = team.shortDisplayName || team.location || team.displayName || team.name || "";
      const teamId = String(team.id || "");
      const conferenceFromGroupMap = teamId ? conferenceByTeamId.get(teamId) : "";
      return {
        id: teamId,
        name,
        conference: resolveConference(name, conferenceFromGroupMap || conferenceFromEspnTeam(team)),
        record: recordFromEspnTeam(team),
        logo: logoFromEspnTeam(team)
      };
    })
    .filter(team => team.name);
}

async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const runners = new Array(Math.min(limit, queue.length)).fill(null).map(async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) break;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function parseStandingEntries(payload) {
  const results = [];
  const seen = new Set();

  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (seen.has(node)) return;
    seen.add(node);

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (node.team && (node.team.id || node.team.$ref || node.team.uid)) {
      results.push(node);
    }

    Object.values(node).forEach(value => {
      if (value && typeof value === "object") walk(value);
    });
  }

  walk(payload);
  return results;
}

function parseTeamIdFromStandingEntry(entry) {
  const direct = entry?.team?.id;
  if (direct) return String(direct);

  const uid = String(entry?.team?.uid || "");
  const uidMatch = uid.match(/s:\d+~l:\d+~t:(\d+)/);
  if (uidMatch) return uidMatch[1];

  const ref = String(entry?.team?.$ref || "");
  const match = ref.match(/\/teams\/(\d+)/);
  return match ? match[1] : "";
}

function buildConferenceMapFromStandingsPayload(payload) {
  const conferenceMap = new Map();
  const children = Array.isArray(payload?.children) ? payload.children : [];

  children.forEach(child => {
    const confName = normalizeConferenceName(
      child?.abbreviation || child?.shortName || child?.name || child?.group?.name
    );
    const entries = parseStandingEntries(child);
    entries.forEach(entry => {
      const teamId = parseTeamIdFromStandingEntry(entry);
      if (teamId && confName !== "Other") {
        conferenceMap.set(String(teamId), confName);
      }
    });
  });

  return conferenceMap;
}

async function fetchConferenceMapFromEspnStandings() {
  const endpoint = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/standings";
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Standings fetch failed: ${response.status}`);
  const payload = await response.json();
  return buildConferenceMapFromStandingsPayload(payload);
}

async function fetchTeamConferenceFromEspnTeamEndpoint(teamId) {
  const endpoint = `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamId}`;
  const response = await fetch(endpoint);
  if (!response.ok) return null;
  const payload = await response.json();
  const groups = payload?.team?.groups;
  const group = Array.isArray(groups) ? groups[0] : (groups || payload?.team?.group);
  const value = group?.shortName || group?.abbreviation || group?.name;
  const normalized = normalizeConferenceName(value);
  return normalized === "Other" ? null : normalized;
}

async function enrichAllTeamConferences() {
  const updatable = teams.filter(team => team.id);
  let changed = 0;
  let unresolved = [];

  try {
    const conferenceMap = await fetchConferenceMapFromEspnGroups();
    updatable.forEach(team => {
      const mapped = conferenceMap.get(String(team.id));
      if (mapped && mapped !== "Other" && team.conference !== mapped) {
        team.conference = mapped;
        changed++;
      }
      if (!mapped || team.conference === "Other") unresolved.push(team);
    });
  } catch (error) {
    console.warn("Bulk conference map lookup failed, using fallback team lookups.", error);
    unresolved = [...updatable];
  }

  await runWithConcurrency(unresolved, 8, async (team) => {
    try {
      const latestConference = await fetchTeamConferenceFromEspnTeamEndpoint(team.id);
      if (!latestConference) return;
      if (team.conference !== latestConference) {
        team.conference = latestConference;
        changed++;
      }
    } catch (error) {
      console.warn(`Conference lookup failed for ${team.name}:`, error);
    }
  });

  if (changed > 0 || unresolved.length > 0) {
    setTeamsFromList(teams);
  }
}

async function loadAllD1TeamsFromEspn() {
  const teamsEndpoint = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?limit=500";

  const [teamsResponse, standingsResult] = await Promise.all([
    fetch(teamsEndpoint),
    fetchConferenceMapFromEspnStandings().catch(() => new Map())
  ]);

  if (!teamsResponse.ok) throw new Error(`Teams fetch failed: ${teamsResponse.status}`);

  const teamsPayload = await teamsResponse.json();
  const conferenceByTeamId = standingsResult instanceof Map ? standingsResult : new Map();
  const parsed = parseEspnTeamEntries(teamsPayload, conferenceByTeamId);
  setTeamsFromList(parsed);
  writeCachedTeams(teams);
  dispatchTeamsUpdated({ source: "network" });
}

function bootstrapTeamsFast() {
  const cached = readCachedTeams();

  if (cached && cached.teams.length) {
    setTeamsFromList(cached.teams);
    dispatchTeamsUpdated({ source: "cache" });
    return;
  }

  const seed = buildSeedTeamsFromHardcodedMap();
  setTeamsFromList(seed);
  dispatchTeamsUpdated({ source: "seed" });

  loadAllD1TeamsFromEspn().catch(error => {
    console.error("Could not refresh D1 team list:", error);
    if (!teams.length) {
      const seed = buildSeedTeamsFromHardcodedMap();
      setTeamsFromList(seed);
    }
    dispatchTeamsUpdated({ failed: true, source: "fallback" });
  });
}

bootstrapTeamsFast();
